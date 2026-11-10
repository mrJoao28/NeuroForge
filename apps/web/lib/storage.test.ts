import { describe,expect,it } from "vitest";
import { loadExperiments,saveExperiments,clearExperiments } from "./storage";
import type { Experiment } from "./experiments";
const run:Experiment={id:1,dataset:"linear",epochs:1,rate:0.01,width:4,history:[{epoch:1,train:0.2,validation:null}]};
describe("local experiment storage",()=>{
  it("roundtrips valid runs",()=>{const values=new Map<string,string>();const storage={setItem:(k:string,v:string)=>{values.set(k,v)},getItem:(k:string)=>values.get(k)??null,removeItem:(k:string)=>{values.delete(k)}};saveExperiments(storage,[run]);expect(loadExperiments(storage)).toEqual([run]);clearExperiments(storage);expect(loadExperiments(storage)).toEqual([])});
  it("rejects malformed JSON",()=>expect(loadExperiments({getItem:()=>"{bad"})).toEqual([]));
  it("rejects invalid records",()=>expect(loadExperiments({getItem:()=>JSON.stringify([{id:"bad",history:[]}])})).toEqual([]));
});
