"""Per-process fixed-window limiter for a private single-worker deployment.

Not a distributed rate limiter. Use Redis or an API gateway for multi-worker deployments.
"""
from __future__ import annotations
from collections import defaultdict, deque
from threading import Lock
from time import monotonic

class RateLimiter:
    def __init__(self, limit: int = 10, window_seconds: float = 60.0):
        if limit < 1 or window_seconds <= 0:
            raise ValueError("limit and window must be positive")
        self.limit = limit
        self.window_seconds = window_seconds
        self._events: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def allow(self, identity: str, now: float | None = None) -> tuple[bool, int]:
        timestamp = monotonic() if now is None else now
        with self._lock:
            history = self._events[identity]
            while history and history[0] <= timestamp - self.window_seconds:
                history.popleft()
            if len(history) >= self.limit:
                retry_after = max(1, int(history[0] + self.window_seconds - timestamp + 0.999))
                return False, retry_after
            history.append(timestamp)
            return True, 0
