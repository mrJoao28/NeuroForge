"use client";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

type Point = { epoch: number; train: number; validation: number };
function demo(epochs: number, rate: number): Point[] {
  return Array.from({ length: epochs }, (_, index) => {
    const epoch = index + 1;
    const train = 0.9 * Math.exp(-epoch * rate * 0.75) + 0.025;
    return { epoch, train: Number(train.toFixed(5)), validation: Number((train + 0.045 + 0.00012 * epoch).toFixed(5)) };
  });
}
export default function Home() {
  const [epochs, setEpochs] = useState(120);
  const [rate, setRate] = useState(0.06);
  const [run, setRun] = useState(0);
  const points = useMemo(() => demo(epochs, rate), [epochs, rate, run]);
  const final = points[points.length - 1];
  function exportData() {
    const blob = new Blob([JSON.stringify({ kind: "synthetic-demo", epochs, rate, history: points }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "neuroforge-demo.json"; a.click(); URL.revokeObjectURL(url);
  }
  return <><header className="top"><div className="logo">◈ NEUROFORGE</div><span className="muted">Neural Network Laboratory · Preview</span></header><main>
    <p className="tag">Experiment workspace / 01</p><h1>Understand how models learn.</h1>
    <p className="muted subtitle">Explore training dynamics with interactive loss curves. This first dashboard uses <strong>synthetic demonstration data</strong>, not a trained neural network. Python engine integration comes next.</p>
    <section className="grid"><div className="card"><h3>Epochs</h3><div className="metric">{epochs}</div></div><div className="card"><h3>Final training loss</h3><div className="metric">{final.train.toFixed(4)}</div></div><div className="card"><h3>Final validation loss</h3><div className="metric">{final.validation.toFixed(4)}</div></div></section>
    <section className="card"><h3>Training configuration · Synthetic demo</h3><div className="controls"><label>Epochs <input type="number" min={10} max={500} value={epochs} onChange={e=>setEpochs(Math.max(10,Math.min(500,Number(e.target.value)||10)))}/></label><label>Rate <input type="number" min={0.001} max={0.5} step={0.01} value={rate} onChange={e=>setRate(Math.max(0.001,Math.min(0.5,Number(e.target.value)||0.001)))}/></label><button className="btn" onClick={()=>setRun(v=>v+1)}>Refresh preview</button><button className="btn" onClick={exportData}>Export JSON</button></div></section>
    <section className="card" style={{marginTop:16}}><h3>Loss over epochs</h3><div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={points}><CartesianGrid stroke="#25354b" strokeDasharray="3 3"/><XAxis dataKey="epoch" stroke="#93a5bf"/><YAxis stroke="#93a5bf"/><Tooltip contentStyle={{background:"#142039",border:"1px solid #40516b"}}/><Legend/><Line type="monotone" dataKey="train" stroke="#54b6ff" dot={false} strokeWidth={2}/><Line type="monotone" dataKey="validation" stroke="#a48bff" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer></div></section>
  </main></>;
}
