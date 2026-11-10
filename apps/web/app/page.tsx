"use client";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

type Point = { epoch: number; train: number; validation: number | null };
type TrainingResponse = { kind: "real-training"; model: { input: number; hidden: number; output: number }; history: Point[] };
const samples = Array.from({ length: 20 }, (_, i) => {
  const x = i / 19;
  return { x: [x], y: [2 * x + 1] };
});
export default function Home() {
  const [epochs, setEpochs] = useState(120);
  const [rate, setRate] = useState(0.03);
  const [width, setWidth] = useState(8);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrainingResponse | null>(null);
  const history = result?.history ?? [];
  const final = history.at(-1);
  async function runTraining() {
    setTraining(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/train", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: samples.map(s => s.x), y: samples.map(s => s.y),
          hidden_width: width, epochs, learning_rate: rate, seed: 42 }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const issue = data && typeof data === "object" && "error" in data ? String(data.error) :
          data && typeof data === "object" && "detail" in data ? JSON.stringify(data.detail) : "Training failed.";
        throw new Error(issue);
      }
      if (!data || typeof data !== "object" || !("kind" in data) || data.kind !== "real-training" ||
          !("history" in data) || !Array.isArray(data.history)) throw new Error("Unexpected training response.");
      setResult(data as TrainingResponse);
    } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); }
    finally { setTraining(false); }
  }
  function exportData() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "neuroforge-training.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <><header className="top"><div className="logo">◈ NEUROFORGE</div><span className="muted">Neural Network Laboratory · Live engine</span></header><main>
    <p className="tag">Experiment workspace / 02</p><h1>Train a real neural network.</h1>
    <p className="muted subtitle">Run the NumPy engine on a small linear regression dataset (y = 2x + 1). Metrics are returned by the Python training API. Nothing is simulated.</p>
    <section className="grid"><div className="card"><h3>Epochs completed</h3><div className="metric">{history.length || "—"}</div></div><div className="card"><h3>Final training MSE</h3><div className="metric">{final ? final.train.toFixed(5) : "—"}</div></div><div className="card"><h3>Hidden neurons</h3><div className="metric">{result?.model.hidden ?? width}</div></div></section>
    <section className="card"><h3>Training configuration · NumPy</h3><div className="controls">
      <label>Epochs <input aria-label="Epochs" type="number" min={10} max={500} value={epochs} disabled={training} onChange={e=>setEpochs(Math.max(10,Math.min(500,Number(e.target.value)||10)))}/></label>
      <label>Learning rate <input aria-label="Learning rate" type="number" min={0.001} max={0.1} step={0.005} value={rate} disabled={training} onChange={e=>setRate(Math.max(0.001,Math.min(0.1,Number(e.target.value)||0.001)))}/></label>
      <label>Neurons <input aria-label="Neurons" type="number" min={1} max={32} value={width} disabled={training} onChange={e=>setWidth(Math.max(1,Math.min(32,Number(e.target.value)||1)))}/></label>
      <button className="btn" disabled={training} onClick={runTraining}>{training ? "Training…" : "Run training"}</button>
      <button className="btn" disabled={!result || training} onClick={exportData}>Export JSON</button>
    </div>{error && <p role="alert" style={{color:"#ff9a9a"}}>{error}</p>}</section>
    <section className="card" style={{marginTop:16}}><h3>Real training loss over epochs</h3><div className="chart">{history.length ? <ResponsiveContainer width="100%" height="100%"><LineChart data={history}><CartesianGrid stroke="#25354b" strokeDasharray="3 3"/><XAxis dataKey="epoch" stroke="#93a5bf"/><YAxis stroke="#93a5bf"/><Tooltip contentStyle={{background:"#142039",border:"1px solid #40516b"}}/><Legend/><Line type="monotone" dataKey="train" name="Training MSE" stroke="#54b6ff" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer> : <p className="muted">Run a training experiment to display the loss curve.</p>}</div></section>
  </main></>;
}
