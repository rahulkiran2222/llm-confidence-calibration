export default function App() {
import React, {useMemo, useState} from 'react';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar} from 'recharts';

type Bin = {bin:string; n:number; confidence:number; accuracy:number; gap:number};
const development: Bin[] = [
  {bin:'20–39%',n:47,confidence:0.347128,accuracy:0.148936,gap:0.198192},
  {bin:'40–59%',n:83,confidence:0.486836,accuracy:0.277108,gap:0.209728},
  {bin:'60–79%',n:48,confidence:0.688900,accuracy:0.312500,gap:0.376400},
  {bin:'80–100%',n:32,confidence:0.896617,accuracy:0.406250,gap:0.490367},
];
const heldout: Bin[] = [
  {bin:'20–39%',n:24,confidence:0.359436,accuracy:0.208333,gap:0.151103},
  {bin:'40–59%',n:38,confidence:0.500677,accuracy:0.289474,gap:0.211203},
  {bin:'60–79%',n:16,confidence:0.678551,accuracy:0.562500,gap:0.116051},
  {bin:'80–100%',n:12,confidence:0.878919,accuracy:0.416667,gap:0.462253},
];
const subjects = [
  {name:'Biology',n:70,accuracy:34.29,ece:25.81},
  {name:'Computer science',n:70,accuracy:30.00,ece:24.54},
  {name:'Statistics',n:70,accuracy:18.57,ece:36.06},
];
const navy='#10213d', blue='#2675df', teal='#10a6a0', muted='#52627a';
const card: React.CSSProperties={background:'#fff',border:'1px solid #dce4ef',borderRadius:16,padding:20,boxShadow:'0 5px 20px rgba(15,35,65,.05)'};
const metric: React.CSSProperties={fontSize:32,fontWeight:750,letterSpacing:'-1px',color:navy};
const small: React.CSSProperties={fontSize:16,color:muted,lineHeight:1.55};

 const [split,setSplit]=useState<'heldout'|'development'>('heldout');
 const rows=split==='heldout'?heldout:development;
 const summary=split==='heldout'?{accuracy:'33.33%',ece:'21.17 pp',n:'90'}:{accuracy:'27.62%',ece:'28.80 pp',n:'210'};
 const chart=useMemo(()=>rows.map(r=>({...r,confidencePct:+(r.confidence*100).toFixed(1),accuracyPct:+(r.accuracy*100).toFixed(1)})),[rows]);
 return <main style={{fontFamily:'Inter, ui-sans-serif, system-ui, sans-serif',background:'#f4f7fb',color:'#14243c',minHeight:'100vh',padding:'32px 20px'}}>
  <div style={{maxWidth:1120,margin:'0 auto'}}>
   <header style={{background:`linear-gradient(120deg,${navy},#1e4778)`,color:'white',borderRadius:22,padding:'36px 34px',marginBottom:22}}>
    <div style={{fontSize:16,fontWeight:700,letterSpacing:2,color:'#a9d7ff'}}>STANFORD PAI1 · FINAL PROJECT</div>
    <h1 style={{fontSize:'clamp(32px,5vw,52px)',lineHeight:1.08,margin:'16px 0 12px'}}>Can AI Know When It Is Wrong?</h1>
    <p style={{fontSize:20,maxWidth:850,lineHeight:1.5,margin:0,color:'#e2edfa'}}>Measuring predictive-confidence calibration in FLAN-T5-base across biology, computer science, and statistics.</p>
   </header>
   <section style={{...card,marginBottom:20}}>
    <h2 style={{fontSize:24,margin:'0 0 10px'}}>Research question</h2>
    <p style={{fontSize:18,lineHeight:1.6,margin:0}}>Does FLAN-T5-base's predictive confidence align with its empirical accuracy on multiple-choice questions from three MMLU subjects?</p>
    <p style={{...small,marginBottom:0}}>Hypothesis: predictive confidence will be imperfectly calibrated, with calibration differing across subjects.</p>
   </section>
   <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:14,marginBottom:20}}>
    {[['Held-out accuracy',summary.accuracy],['Expected calibration error',summary.ece],['Held-out questions',summary.n]].map(([label,value])=><div key={label} style={card}><div style={{...small,fontWeight:650}}>{label}</div><div style={metric}>{value}</div></div>)}
   </section>
   <section style={{...card,marginBottom:20}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
     <div><h2 style={{fontSize:24,margin:'0 0 6px'}}>Reliability analysis</h2><p style={{...small,margin:0}}>Mean confidence compared with empirical accuracy in populated confidence bins.</p></div>
     <div role="group" aria-label="Choose evaluation split" style={{display:'flex',gap:8}}>
      <button onClick={()=>setSplit('heldout')} aria-pressed={split==='heldout'} style={{fontSize:16,padding:'10px 15px',borderRadius:9,border:'1px solid #9bb2d0',background:split==='heldout'?navy:'white',color:split==='heldout'?'white':navy,cursor:'pointer'}}>Held-out</button>
      <button onClick={()=>setSplit('development')} aria-pressed={split==='development'} style={{fontSize:16,padding:'10px 15px',borderRadius:9,border:'1px solid #9bb2d0',background:split==='development'?navy:'white',color:split==='development'?'white':navy,cursor:'pointer'}}>Development</button>
     </div>
    </div>
    <div style={{height:340,marginTop:18}}><ResponsiveContainer width="100%" height="100%"><LineChart data={chart} margin={{top:12,right:22,left:8,bottom:18}}><CartesianGrid strokeDasharray="4 4"/><XAxis type="number" dataKey="confidence" domain={[0,1]} tickFormatter={v=>`${Math.round(v*100)}%`} label={{value:'Mean predictive confidence',position:'insideBottom',offset:-8}}/><YAxis type="number" domain={[0,1]} tickFormatter={v=>`${Math.round(v*100)}%`} label={{value:'Empirical accuracy',angle:-90,position:'insideLeft'}}/><Tooltip formatter={(v:any)=>`${(Number(v)*100).toFixed(1)}%`}/><Line dataKey="accuracy" name="Empirical accuracy" stroke={blue} strokeWidth={3} dot={{r:6}}/><Line dataKey="confidence" name="Mean confidence" stroke={teal} strokeWidth={2} strokeDasharray="6 4" dot={{r:4}}/></LineChart></ResponsiveContainer></div>
    <p style={small}>Points are the four populated confidence bins. A perfectly calibrated model would have confidence equal to accuracy in each bin; here, confidence exceeds accuracy in every populated bin.</p>
    <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:16}}><thead><tr>{['Confidence bin','N','Mean confidence','Accuracy','Absolute gap'].map(x=><th key={x} style={{textAlign:'left',padding:10,borderBottom:'2px solid #dce4ef'}}>{x}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.bin}>{[r.bin,r.n,(r.confidence*100).toFixed(1)+'%',(r.accuracy*100).toFixed(1)+'%',(r.gap*100).toFixed(1)+' pp'].map((v,i)=><td key={i} style={{padding:10,borderBottom:'1px solid #e7edf5'}}>{v}</td>)}</tr>)}</tbody></table></div>
   </section>
   <section style={{...card,marginBottom:20}}>
    <h2 style={{fontSize:24,margin:'0 0 8px'}}>Development performance by subject</h2>
    <p style={small}>Each subject has 70 development questions. Accuracy and ECE are reported as recorded in the experiment.</p>
    <div style={{height:280}}><ResponsiveContainer width="100%" height="100%"><BarChart data={subjects} margin={{top:10,right:20,left:0,bottom:8}}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis domain={[0,50]} tickFormatter={v=>`${v}%`}/><Tooltip formatter={(v:any)=>`${Number(v).toFixed(1)}%`}/><Bar dataKey="accuracy" name="Accuracy" fill={blue} radius={[6,6,0,0]}/><Bar dataKey="ece" name="ECE" fill={teal} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>
   </section>
   <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14,marginBottom:20}}>
    <div style={card}><h2 style={{fontSize:22,marginTop:0}}>Probability model</h2><p style={{fontSize:17,lineHeight:1.6}}>For each multiple-choice question, the model scores each of four answer options (A–D) using conditional sequence log-likelihood. A softmax over the four scores gives relative option probabilities. The largest probability is the prediction; its value is used as predictive confidence.</p></div>
    <div style={card}><h2 style={{fontSize:22,marginTop:0}}>Experiment design</h2><p style={{fontSize:17,lineHeight:1.6}}>Model: <strong>google/flan-t5-base</strong>. Dataset: <strong>cais/mmlu</strong>. Up to 100 questions per subject; 70 development and 30 held-out per subject; seed 20261118. Subjects: biology, computer science, and statistics.</p></div>
   </section>
   <section style={{...card,marginBottom:20}}><h2 style={{fontSize:24,margin:'0 0 8px'}}>Interpretation and limitations</h2><p style={{fontSize:17,lineHeight:1.6}}>The recorded results show overconfidence in every populated confidence bin: predicted confidence was higher than empirical accuracy. The held-out accuracy was 33.33%, and held-out ECE was 21.17 percentage points. This is evidence of imperfect calibration on this sample, not proof about all models or tasks.</p><ul style={{fontSize:16,lineHeight:1.7,paddingLeft:22}}><li>Small sample sizes limit precision and generalization.</li><li>MMLU may overlap with model pretraining data.</li><li>Softmax option probabilities are relative scores, not guaranteed calibrated probabilities.</li><li>Calibration estimates depend on binning choices.</li><li>Earlier project iterations exposed some test results; this is not a pristine blind replication.</li></ul></section>
   <footer style={{...small,padding:'4px 4px 28px'}}>Data: MMLU ({'cais/mmlu'}, test split), https://huggingface.co/datasets/cais/mmlu. Model: FLAN-T5-base, https://huggingface.co/google/flan-t5-base. Aggregate values shown are the recorded experiment outputs; no question-level records are represented here.</footer>
  </div>
 </main>
}
