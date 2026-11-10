"use client";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PredictionPoint } from "../lib/metrics";
export function PredictionChart({points}:{points:PredictionPoint[]}) {
  if (!points.length) return <p className="muted">Train a model to inspect its predictions.</p>;
  const data=[...points].sort((a,b)=>a.x-b.x);
  return <div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid stroke="#25354b" strokeDasharray="3 3"/><XAxis dataKey="x" type="number" domain={["dataMin","dataMax"]} stroke="#93a5bf"/><YAxis stroke="#93a5bf"/><Tooltip contentStyle={{background:"#142039",border:"1px solid #40516b"}}/><Legend/><Line type="monotone" dataKey="actual" name="Ground truth" stroke="#4cdeb8" dot={false} strokeWidth={2}/><Line type="monotone" dataKey="predicted" name="Model prediction" stroke="#54b6ff" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer></div>;
}
