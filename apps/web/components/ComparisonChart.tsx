"use client";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { comparisonSeries } from "../lib/comparison";
import type { Experiment } from "../lib/experiments";
const colors=["#54b6ff","#b59bff","#4cdeb8","#ffbd75","#f38db5","#e2e86c","#75d8e8","#c7a991"];
export function ComparisonChart({runs}:{runs:Experiment[]}) {
  if (!runs.length) return <p className="muted">Train experiments on this dataset to compare curves.</p>;
  return <div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={comparisonSeries(runs)}><CartesianGrid stroke="#25354b" strokeDasharray="3 3"/><XAxis dataKey="epoch" stroke="#93a5bf"/><YAxis stroke="#93a5bf"/><Tooltip contentStyle={{background:"#142039",border:"1px solid #40516b"}}/><Legend/>{runs.map((run,index)=><Line key={run.id} type="monotone" dataKey={`run_${run.id}`} name={`Run #${run.id}`} stroke={colors[index%colors.length]} dot={false} strokeWidth={2} connectNulls={false}/>)}</LineChart></ResponsiveContainer></div>;
}
