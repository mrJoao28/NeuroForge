"use client";
import { useEffect, useState } from "react";
import { ComparisonChart } from "../components/ComparisonChart";
import { PredictionChart } from "../components/PredictionChart";
import { ExperimentInsights } from "../components/ExperimentInsights";
import { comparableRuns } from "../lib/comparison";
import { downloadText, exportExperimentsCsv } from "../lib/export";
import { clearExperiments, loadExperiments, saveExperiments } from "../lib/storage";
import { createDataset, datasetOptions, type DatasetId } from "../lib/datasets";
import { appendExperiment, finalLoss, rankExperiments, type Experiment } from "../lib/experiments";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

type Point = { epoch: number; train: number; validation: number | null };
type TrainingResponse = { kind: "real-training"; model: { input: number; hidden: number; output: number }; history: Point[]; predictions?: {x:number;actual:number;predicted:number}[] };
export default function Home() {
  const [datasetId, setDatasetId] = useState<DatasetId>("linear");
  const [epochs, setEpochs] = useState(120);
  const [rate, setRate] = useState(0.03);
  const [width, setWidth] = useState(8);
  const [validationFraction, setValidationFraction] = useState(0.2);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrainingResponse | null>(null);
  const [runs, setRuns] = useState<Experiment[]>([]);
  const [nextId, setNextId] = useState(1);
  const [storageReady, setStorageReady] = useState(false);
  const [comparisonDataset, setComparisonDataset] = useState<DatasetId>("linear");
  const filteredRuns = comparableRuns(runs, comparisonDataset);
  useEffect(() => {
    const restored = loadExperiments(window.localStorage);
    setRuns(restored);
    setNextId(Math.max(0, ...restored.map(run => run.id)) + 1);
    setStorageReady(true);
  }, []);
  useEffect(() => { if (storageReady) saveExperiments(window.localStorage, runs); }, [runs, storageReady]);
  const history = result?.history ?? [];
  const final = history.at(-1);
  async function runTraining() {
    setTraining(true); setError(""); setResult(null);
    try {
      const dataset = createDataset(datasetId);
      const response = await fetch("/api/train", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: dataset.x, y: dataset.y,
          hidden_width: width, epochs, learning_rate: rate, seed: 42, validation_fraction: validationFraction }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const issue = data && typeof data === "object" && "error" in data ? String(data.error) :
          data && typeof data === "object" && "detail" in data ? JSON.stringify(data.detail) : "Training failed.";
        throw new Error(issue);
      }
      if (!data || typeof data !== "object" || !("kind" in data) || data.kind !== "real-training" ||
          !("history" in data) || !Array.isArray(data.history)) throw new Error("Unexpected training response.");
      const trained = data as TrainingResponse;
      setResult(trained);
      setRuns(previous => appendExperiment(previous, { id: nextId, dataset: datasetId, epochs, rate, width, history: trained.history }));
      setNextId(previous => previous + 1);
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
    <p className="muted subtitle">Run the NumPy engine on a selectable deterministic regression dataset. Metrics are returned by the Python training API. Nothing is simulated.</p>
    <section className="grid"><div className="card"><h3>Epochs completed</h3><div className="metric">{history.length || "—"}</div></div><div className="card"><h3>Final training MSE</h3><div className="metric">{final ? final.train.toFixed(5) : "—"}</div></div><div className="card"><h3>Final validation MSE</h3><div className="metric">{final?.validation == null ? "—" : final.validation.toFixed(5)}</div></div></section><section className="grid"><div className="card"><h3>Hidden neurons</h3><div className="metric">{result?.model.hidden ?? width}</div></div></section>
    <section className="card"><h3>Training configuration · NumPy</h3><div className="controls"><label>Dataset <select aria-label="Dataset" value={datasetId} disabled={training} onChange={e => { setDatasetId(e.target.value as DatasetId); setResult(null); }} style={{background:"#0a1324",color:"white",padding:8,borderRadius:8,border:"1px solid #40516b"}}>{datasetOptions.map(option => <option key={option.id} value={option.id}>{option.name} ({option.description})</option>)}</select></label>
      <label>Epochs <input aria-label="Epochs" type="number" min={10} max={500} value={epochs} disabled={training} onChange={e=>setEpochs(Math.max(10,Math.min(500,Number(e.target.value)||10)))}/></label>
      <label>Learning rate <input aria-label="Learning rate" type="number" min={0.001} max={0.1} step={0.005} value={rate} disabled={training} onChange={e=>setRate(Math.max(0.001,Math.min(0.1,Number(e.target.value)||0.001)))}/></label>
      <label>Validation split <select aria-label="Validation split" value={validationFraction} disabled={training} onChange={e => setValidationFraction(Number(e.target.value))}><option value={0}>None</option><option value={0.1}>10%</option><option value={0.2}>20%</option><option value={0.3}>30%</option></select></label>
      <label>Neurons <input aria-label="Neurons" type="number" min={1} max={32} value={width} disabled={training} onChange={e=>setWidth(Math.max(1,Math.min(32,Number(e.target.value)||1)))}/></label>
      <button className="btn" disabled={training} onClick={runTraining}>{training ? "Training…" : "Run training"}</button>
      <button className="btn" disabled={!result || training} onClick={exportData}>Export JSON</button>
    </div>{error && <p role="alert" style={{color:"#ff9a9a"}}>{error}</p>}</section>
    <section className="card" style={{marginTop:16}}><h3>Real training loss over epochs</h3><div className="chart">{history.length ? <ResponsiveContainer width="100%" height="100%"><LineChart data={history}><CartesianGrid stroke="#25354b" strokeDasharray="3 3"/><XAxis dataKey="epoch" stroke="#93a5bf"/><YAxis stroke="#93a5bf"/><Tooltip contentStyle={{background:"#142039",border:"1px solid #40516b"}}/><Legend/><Line type="monotone" dataKey="train" name="Training MSE" stroke="#54b6ff" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer> : <p className="muted">Run a training experiment to display the loss curve.</p>}</div></section>
    <section className="card" style={{marginTop:16}}><h3>Model predictions vs. ground truth</h3><p className="muted">Compare final predictions against the original target function. Validation samples are held out during training.</p><PredictionChart points={(result?.predictions ?? []).map(point => ({...point,partition:"train" as const}))}/></section>
    <section className="card" style={{marginTop:16}}><h3>Experiment comparison · Current session</h3><p className="muted">The last 8 runs are stored in this browser only. Select a dataset to compare matching experiments fairly.</p><div className="controls"><label>Compare dataset <select aria-label="Compare dataset" value={comparisonDataset} onChange={e => setComparisonDataset(e.target.value as DatasetId)}>{datasetOptions.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label><button className="btn" disabled={!runs.length} onClick={() => downloadText("neuroforge-experiments.csv",exportExperimentsCsv(runs),"text/csv;charset=utf-8")}>Export all CSV</button></div><ExperimentInsights runs={filteredRuns}/><ComparisonChart runs={filteredRuns}/>{filteredRuns.length ? <><div style={{overflowX:"auto"}}><table style={{width:"100%",textAlign:"left",borderCollapse:"collapse"}}><thead><tr><th>Run</th><th>Dataset</th><th>Epochs</th><th>Rate</th><th>Neurons</th><th>Final MSE</th></tr></thead><tbody>{rankExperiments(filteredRuns).map(run => <tr key={run.id}><td>#{run.id}</td><td>{run.dataset}</td><td>{run.epochs}</td><td>{run.rate}</td><td>{run.width}</td><td>{finalLoss(run).toFixed(6)}</td></tr>)}</tbody></table></div><button className="btn" style={{marginTop:12}} onClick={() => { setRuns([]); clearExperiments(window.localStorage); }}>Clear all history</button></> : <p className="muted">No runs for this dataset yet.</p>}</section>
  </main></>;
}
