from neuroforge_api.rate_limit import RateLimiter


def test_limit_and_reset():
    limiter = RateLimiter(limit=2, window_seconds=10)
    assert limiter.allow("a", now=0) == (True, 0)
    assert limiter.allow("a", now=1) == (True, 0)
    assert limiter.allow("a", now=2) == (False, 8)
    assert limiter.allow("a", now=10) == (True, 0)


def test_separate_identities():
    limiter = RateLimiter(limit=1)
    assert limiter.allow("a", now=0)[0]
    assert limiter.allow("b", now=0)[0]
    assert not limiter.allow("a", now=0)[0]
