import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";

const C = {
  bg: "#06090F", surface: "#0D1117", surfaceLight: "#161B22", border: "#21262D",
  accent: "#10B981", accentDim: "#064E3B", danger: "#F87171", dangerDim: "#7F1D1D",
  warning: "#FBBF24", warningDim: "#78350F", blue: "#60A5FA", blueDim: "#1E3A5F",
  text: "#E6EDF3", textDim: "#8B949E", textMuted: "#484F58",
};
const ff = `'DM Sans', sans-serif`;
const mono = `'JetBrains Mono', monospace`;
const fmt = (n) => `$${Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtTime = (d) => d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
const MERCHANTS = ["KFC LATAM","Sony Store MX","Volaris","Clic Air","GetJusto","Rappi Pay"];
const CURRENCIES = ["USD","MXN","BRL","COP"];

function genTx(id){
  const m=MERCHANTS[~~(Math.random()*MERCHANTS.length)];
  const amt=Math.round((Math.random()*45000+500)*100)/100;
  const cur=CURRENCIES[~~(Math.random()*CURRENCIES.length)];
  const st=Math.random()>0.05?"settled":"flagged";
  const sTime=(Math.random()*2.5+0.8).toFixed(1);
  const risk=~~(Math.random()*100);
  return{id,merchant:m,amount:amt,currency:cur,status:st,settlementTime:sTime,riskScore:risk,time:new Date(),legacyCost:amt*0.025,newCost:amt*0.0008};
}

/* --- SHARED --- */
const Pill=({color,children})=>{
  const map={green:{bg:C.accentDim,fg:C.accent},red:{bg:C.dangerDim,fg:C.danger},yellow:{bg:C.warningDim,fg:C.warning},blue:{bg:C.blueDim,fg:C.blue}};
  const s=map[color]||map.blue;
  return <span style={{background:s.bg,color:s.fg,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>{children}</span>;
};

const Metric=({label,value,sub,accent,icon})=>(
  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"22px 20px",flex:1,minWidth:155}}>
    <div style={{color:C.textMuted,fontSize:10,fontWeight:700,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8,fontFamily:ff}}>{icon&&<span style={{marginRight:4}}>{icon}</span>}{label}</div>
    <div style={{color:accent||C.text,fontSize:28,fontWeight:700,fontFamily:mono,lineHeight:1}}>{value}</div>
    {sub&&<div style={{color:C.textDim,fontSize:11,marginTop:6}}>{sub}</div>}
  </div>
);

const Panel=({title,right,children})=>(
  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
    {title&&<div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{color:C.text,fontWeight:700,fontSize:13}}>{title}</span>
      {right}
    </div>}
    <div>{children}</div>
  </div>
);

const Tabs=({tabs,active,onChange})=>(
  <div style={{display:"flex",gap:2,background:C.surface,borderRadius:10,padding:3,border:`1px solid ${C.border}`,marginBottom:24}}>
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onChange(t.id)} style={{flex:1,padding:"10px 14px",background:active===t.id?C.surfaceLight:"transparent",color:active===t.id?C.text:C.textMuted,border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:ff,transition:"all .2s"}}>{t.icon} {t.label}</button>
    ))}
  </div>
);

const NAV=[
  {id:"settlement",label:"Settlement",icon:"⚡"},
  {id:"reconciliation",label:"Reconciliation",icon:"⟳"},
  {id:"refunds",label:"Refunds",icon:"↩"},
  {id:"chargebacks",label:"Chargebacks",icon:"🛡"},
  {id:"fraud",label:"Fraud",icon:"⊘"},
];

/* === SCREEN 1: SETTLEMENT === */
function SettlementScreen({txs}){
  const vol=txs.reduce((s,t)=>s+t.amount,0);
  const saved=txs.reduce((s,t)=>s+(t.legacyCost-t.newCost),0);
  const avg=txs.length?(txs.reduce((s,t)=>s+parseFloat(t.settlementTime),0)/txs.length).toFixed(1):"—";
  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      <Metric label="Settled Today" value={fmt(vol)} sub={`${txs.length} transactions`} icon="💰"/>
      <Metric label="Avg Settlement" value={`${avg}s`} accent={C.accent} sub="vs 3-7 days legacy" icon="⚡"/>
      <Metric label="Fees Saved" value={fmt(saved)} accent={C.accent} sub="vs 2.5% legacy" icon="📉"/>
      <Metric label="Success Rate" value="99.8%" accent={C.accent} sub="0 failures" icon="✓"/>
    </div>
    <Panel title="Live Settlement Feed" right={<span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:C.accent,animation:"pulse 2s infinite"}}/><span style={{color:C.accent,fontSize:11,fontWeight:700}}>LIVE</span></span>}>
      <div style={{maxHeight:400,overflowY:"auto"}}>
        {txs.slice().reverse().map((tx,i)=>(
          <div key={tx.id} style={{display:"grid",gridTemplateColumns:"130px 1fr 110px 70px 90px 80px",padding:"11px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i===0?`${C.accent}06`:"transparent"}}>
            <span style={{color:C.textMuted,fontSize:11,fontFamily:mono}}>{fmtTime(tx.time)}</span>
            <span style={{color:C.text,fontSize:12,fontWeight:600}}>{tx.merchant}</span>
            <span style={{color:C.text,fontSize:12,fontFamily:mono,textAlign:"right"}}>{fmt(tx.amount)}</span>
            <span style={{textAlign:"center"}}><Pill color="blue">{tx.currency}</Pill></span>
            <span style={{color:C.accent,fontSize:11,fontFamily:mono,textAlign:"center"}}>{tx.settlementTime}s ✓</span>
            <span style={{textAlign:"right"}}><Pill color={tx.status==="settled"?"green":"yellow"}>{tx.status}</Pill></span>
          </div>
        ))}
      </div>
    </Panel>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
  </div>);
}

/* === SCREEN 2: RECONCILIATION === */
function ReconciliationScreen({txs}){
  const matched=Math.floor(txs.length*.97);
  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      <Metric label="Auto-Reconciled" value={`${matched}/${txs.length}`} accent={C.accent} sub="97% match rate"/>
      <Metric label="Mismatches" value={String(txs.length-matched)} accent={C.warning} sub="Auto-flagged"/>
      <Metric label="Recon Time" value="Real-time" accent={C.accent} sub="vs 3-5 days manual"/>
      <Metric label="Report Alignment" value="100%" accent={C.accent} sub="Finance = Ops = Client"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 36px 1fr",gap:0,marginBottom:20}}>
      <div style={{background:C.surface,border:`1px solid ${C.danger}25`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:`${C.danger}08`}}>
          <span style={{color:C.danger,fontWeight:700,fontSize:12}}>❌ TODAY — Excel + Email</span>
        </div>
        {[{t:"Finance Report",a:"$1,247,832.50",n:"Internal ERP"},{t:"Ops Report",a:"$1,245,119.00",n:"PSP Dashboard"},{t:"Client Report",a:"$1,248,001.75",n:"Merchant Portal"}].map((r,i)=>(
          <div key={i} style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{color:C.text,fontSize:12,fontWeight:600}}>{r.t}</div><div style={{color:C.textMuted,fontSize:10}}>{r.n}</div></div>
            <span style={{color:C.danger,fontFamily:mono,fontSize:13}}>{r.a} {i>0?"≠":""}</span>
          </div>
        ))}
        <div style={{padding:"12px 18px",background:`${C.danger}06`}}>
          <span style={{color:C.danger,fontSize:11,fontWeight:600}}>⚠ $2,882.75 mismatch → 3-5 days to resolve</span>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.textMuted,fontSize:18}}>→</span></div>
      <div style={{background:C.surface,border:`1px solid ${C.accent}25`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:`${C.accent}08`}}>
          <span style={{color:C.accent,fontWeight:700,fontSize:12}}>✅ NEW — Single Ledger</span>
        </div>
        {["Finance View","Ops View","Client View"].map((t,i)=>(
          <div key={i} style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{color:C.text,fontSize:12,fontWeight:600}}>{t}</div><div style={{color:C.textMuted,fontSize:10}}>Same ledger, real-time</div></div>
            <span style={{color:C.accent,fontFamily:mono,fontSize:13}}>$1,247,832.50 ✓</span>
          </div>
        ))}
        <div style={{padding:"12px 18px",background:`${C.accent}06`}}>
          <span style={{color:C.accent,fontSize:11,fontWeight:600}}>✓ Zero mismatch — one record, all aligned</span>
        </div>
      </div>
    </div>
    <Panel title="Export-Ready Reports">
      <div style={{padding:16,display:"flex",gap:8,flexWrap:"wrap"}}>
        {["Daily Settlement","Monthly Reconciliation","Full Audit Trail","Chargeback Summary"].map(r=>(
          <button key={r} style={{background:C.surfaceLight,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:ff}}>📄 {r}</button>
        ))}
      </div>
    </Panel>
  </div>);
}

/* === SCREEN 3: REFUNDS === */
function RefundsScreen(){
  const [approvedSet,setApprovedSet]=useState(new Set());
  const rows=[
    {id:"RF-001",m:"KFC LATAM",a:2340,reason:"Reconciliation mismatch",st:"auto",t:"0.8s",old:"4 days"},
    {id:"RF-002",m:"Sony Store MX",a:15780.5,reason:"Duplicate settlement",st:"auto",t:"1.2s",old:"6 days"},
    {id:"RF-003",m:"Volaris",a:890,reason:"Client dispute",st:"pending",t:"—",old:"8 days"},
    {id:"RF-004",m:"Clic Air",a:4520.75,reason:"Amount discrepancy",st:"auto",t:"0.6s",old:"3 days"},
    {id:"RF-005",m:"GetJusto",a:670,reason:"Reconciliation mismatch",st:"auto",t:"1.0s",old:"5 days"},
  ];
  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      <Metric label="Refunds This Month" value="47" sub="$89,234 total"/>
      <Metric label="Auto-Resolved" value="91%" accent={C.accent} sub="vs 0% before"/>
      <Metric label="Avg Resolution" value="0.9s" accent={C.accent} sub="vs 4.2 days legacy"/>
      <Metric label="Recon Refunds" value="↓84%" accent={C.accent} sub="Eliminated by single ledger"/>
    </div>
    <Panel title="Refund Engine — Recent">
      {rows.map(r=>{
        const isApproved=approvedSet.has(r.id);
        const isPending=r.st==="pending"&&!isApproved;
        return(
          <div key={r.id} style={{display:"grid",gridTemplateColumns:"70px 130px 110px 1fr 90px 100px",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
            <span style={{color:C.textMuted,fontFamily:mono,fontSize:11}}>{r.id}</span>
            <span style={{color:C.text,fontSize:12,fontWeight:600}}>{r.m}</span>
            <span style={{color:C.text,fontFamily:mono,fontSize:12}}>{fmt(r.a)}</span>
            <div><div style={{color:C.textDim,fontSize:11}}>{r.reason}</div><div style={{color:C.textMuted,fontSize:10}}>{r.old} → {r.t}</div></div>
            <span style={{textAlign:"center"}}><Pill color={isPending?"yellow":"green"}>{isPending?"Review":"Auto ✓"}</Pill></span>
            {isPending?<button onClick={()=>setApprovedSet(prev=>{const n=new Set(prev);n.add(r.id);return n;})} style={{background:C.accent,color:"#000",border:"none",borderRadius:6,padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Approve</button>:
            isApproved?<span style={{color:C.accent,fontSize:10,fontFamily:mono,textAlign:"center"}}>Approved ✓</span>:
            <span style={{color:C.accent,fontSize:10,fontFamily:mono,textAlign:"center"}}>{r.t}</span>}
          </div>
        );
      })}
    </Panel>
    <div style={{marginTop:16,background:`${C.accent}06`,border:`1px solid ${C.accent}15`,borderRadius:12,padding:18}}>
      <div style={{color:C.accent,fontSize:12,fontWeight:700,marginBottom:6}}>Why refunds dropped 84%</div>
      <div style={{color:C.textDim,fontSize:12,lineHeight:1.6}}>Most refunds were reconciliation mismatches — different teams seeing different numbers. Single ledger = one number = no mismatch = no refund needed.</div>
    </div>
  </div>);
}

/* === SCREEN 4: CHARGEBACKS (REAL / FUNCTIONAL) === */
const SAMPLE_CSV=`id,merchant,amount,reason,date,card_last4,currency
CB-2401,KFC LATAM,3420.00,Unauthorized transaction,2026-02-15,4521,MXN
CB-2402,Sony Store MX,12800.50,Duplicate charge,2026-02-17,8832,USD
CB-2403,Volaris,890.00,Product not received,2026-02-19,3341,MXN
CB-2404,Clic Air,2150.75,Amount differs from receipt,2026-02-21,6612,USD
CB-2405,GetJusto,445.00,Unauthorized transaction,2026-02-23,9981,COP
CB-2406,KFC LATAM,6700.00,Card not present fraud,2026-02-25,4521,MXN
CB-2407,Rappi Pay,1230.00,Subscription not cancelled,2026-02-27,7745,BRL
CB-2408,Sony Store MX,8900.00,Unauthorized transaction,2026-03-01,2234,USD
CB-2409,Volaris,3300.00,Duplicate charge,2026-03-04,5567,MXN
CB-2410,KFC LATAM,1580.00,Amount differs,2026-03-07,4521,MXN
CB-2411,Clic Air,22400.00,Card not present fraud,2026-03-10,8891,USD
CB-2412,GetJusto,670.00,Unauthorized transaction,2026-03-13,3345,COP
CB-2413,Rappi Pay,4100.00,Product not received,2026-03-16,7712,BRL
CB-2414,KFC LATAM,950.00,Duplicate charge,2026-03-19,4521,MXN
CB-2415,Sony Store MX,15200.00,Unauthorized transaction,2026-03-22,6678,USD
CB-2416,Volaris,2800.00,Subscription not cancelled,2026-03-25,1123,MXN
CB-2417,KFC LATAM,7600.00,Card not present fraud,2026-03-27,4521,MXN
CB-2418,Clic Air,1100.00,Amount differs,2026-03-28,9934,USD`;

const CB_CATS={
  unauthorized:{label:"Unauthorized Transaction",color:"red",kw:["unauthorized","not authorized","no autorizada","fraud","fraude","stolen","robada"]},
  duplicate:{label:"Duplicate Charge",color:"yellow",kw:["duplicate","duplicat","doble cargo","double","duplicada"]},
  not_received:{label:"Product/Service Not Received",color:"red",kw:["not received","no recibido","never received","undelivered","no entregado"]},
  amount:{label:"Amount Differs",color:"yellow",kw:["amount","monto","differ","wrong amount","monto incorrecto","overcharge"]},
  subscription:{label:"Subscription Not Cancelled",color:"blue",kw:["subscription","suscripcion","recurring","recurrente","cancel"]},
  cnp_fraud:{label:"Card Not Present Fraud",color:"red",kw:["card not present","cnp","online fraud","fraude en línea","remote"]},
  other:{label:"Other / Unclassified",color:"blue",kw:[]},
};

function categorize(text){
  const lower=(text||"").toLowerCase();
  for(const[key,cat] of Object.entries(CB_CATS)){
    if(key==="other")continue;
    if(cat.kw.some(kw=>lower.includes(kw)))return key;
  }
  return "other";
}

function parseCSV(text){
  const lines=text.trim().split("\n");
  if(lines.length<2)return[];
  const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/['"]/g,""));
  return lines.slice(1).map(line=>{
    const vals=line.split(",").map(v=>v.trim().replace(/['"]/g,""));
    const row={};
    headers.forEach((h,i)=>{row[h]=vals[i]||"";});
    return row;
  }).filter(r=>Object.values(r).some(v=>v));
}

function ChargebackScreen(){
  const [data,setData]=useState(null);
  const [analyzing,setAnalyzing]=useState(false);
  const [blockedCards,setBlockedCards]=useState(new Set());
  const fileRef=useRef();

  function processData(csvText){
    setAnalyzing(true);
    setTimeout(()=>{
      const rows=parseCSV(csvText);
      const analyzed=rows.map(r=>{
        const cat=categorize(r.reason||r.description||r.type||"");
        const catInfo=CB_CATS[cat];
        const amt=parseFloat(r.amount||r.monto||"0");
        return{...r,category:cat,categoryLabel:catInfo.label,categoryColor:catInfo.color,parsedAmount:isNaN(amt)?0:amt};
      });
      setData(analyzed);
      setAnalyzing(false);
    },1200);
  }

  function handleFile(e){
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>processData(ev.target.result);
    reader.readAsText(file);
  }

  const analysis=useMemo(()=>{
    if(!data)return null;
    const total=data.reduce((s,r)=>s+r.parsedAmount,0);
    const byCat={};
    data.forEach(r=>{
      if(!byCat[r.category])byCat[r.category]={count:0,amount:0,label:r.categoryLabel,color:r.categoryColor};
      byCat[r.category].count++;byCat[r.category].amount+=r.parsedAmount;
    });
    const byMerchant={};
    data.forEach(r=>{const m=r.merchant||"Unknown";if(!byMerchant[m])byMerchant[m]={count:0,amount:0};byMerchant[m].count++;byMerchant[m].amount+=r.parsedAmount;});
    const byCard={};
    data.forEach(r=>{const c=r.card_last4||"????";if(!byCard[c])byCard[c]={count:0,amount:0};byCard[c].count++;byCard[c].amount+=r.parsedAmount;});
    const repeatCards=Object.entries(byCard).filter(([,v])=>v.count>=2).sort((a,b)=>b[1].count-a[1].count);
    const fraudRelated=data.filter(r=>["unauthorized","cnp_fraud"].includes(r.category));
    const sortedCats=Object.entries(byCat).sort((a,b)=>b[1].amount-a[1].amount);
    const sortedMerchants=Object.entries(byMerchant).sort((a,b)=>b[1].amount-a[1].amount);
    const recs=[];
    if(repeatCards.length>0)recs.push({title:`Block repeat-offender cards`,desc:`${repeatCards.length} card(s) with multiple chargebacks. ****${repeatCards[0][0]} has ${repeatCards[0][1].count} cases (${fmt(repeatCards[0][1].amount)}).`,impact:"High",color:"red"});
    if(fraudRelated.length>0)recs.push({title:`Enable 3DS for CNP transactions`,desc:`${fraudRelated.length} chargebacks (${Math.round(fraudRelated.length/data.length*100)}%) fraud-related. 3D Secure prevents ~89%.`,impact:"High",color:"red"});
    const dupCat=byCat["duplicate"];
    if(dupCat)recs.push({title:`Fix duplicate charge bug`,desc:`${dupCat.count} duplicates (${fmt(dupCat.amount)}). Likely retry logic issue.`,impact:"Medium",color:"yellow"});
    if(sortedMerchants.length>0)recs.push({title:`Investigate: ${sortedMerchants[0][0]}`,desc:`${sortedMerchants[0][1].count} chargebacks (${fmt(sortedMerchants[0][1].amount)}). Disproportionate.`,impact:"Medium",color:"yellow"});
    recs.push({title:`Set up real-time alerts`,desc:`Alert on >3 chargebacks/day per merchant.`,impact:"Medium",color:"blue"});
    return{total,count:data.length,byCat:sortedCats,byMerchant:sortedMerchants,repeatCards,fraudPct:Math.round(fraudRelated.length/data.length*100),recs};
  },[data]);

  if(!data){
    return(<div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <Metric label="Status" value="Awaiting Data" accent={C.warning} sub="Upload chargeback file"/>
        <Metric label="Formats" value="CSV" sub="Any column names"/>
        <Metric label="Auto-Detection" value="ON" accent={C.accent} sub="EN + ES reason codes"/>
      </div>
      <div style={{background:C.surface,border:`2px dashed ${C.border}`,borderRadius:16,padding:60,textAlign:"center",marginBottom:20,cursor:"pointer",transition:"border-color .2s"}}
        onClick={()=>fileRef.current?.click()}
        onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=C.accent;}}
        onDragLeave={e=>{e.currentTarget.style.borderColor=C.border;}}
        onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor=C.border;const f=e.dataTransfer.files[0];if(f){const r=new FileReader();r.onload=ev=>processData(ev.target.result);r.readAsText(f);}}}>
        <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" style={{display:"none"}} onChange={handleFile}/>
        <div style={{fontSize:40,marginBottom:12}}>📂</div>
        <div style={{color:C.text,fontSize:16,fontWeight:700,marginBottom:6}}>Drop chargeback file here or click to upload</div>
        <div style={{color:C.textDim,fontSize:12}}>CSV with columns: id, merchant, amount, reason, date, card_last4</div>
      </div>
      <div style={{textAlign:"center"}}>
        <button onClick={()=>processData(SAMPLE_CSV)} style={{background:C.surfaceLight,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 20px",color:C.accent,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:ff}}>
          ▶ Load Sample Data (Feb 13 – Mar 28)
        </button>
      </div>
      {analyzing&&<div style={{textAlign:"center",marginTop:30}}><div style={{color:C.accent,fontSize:14,fontWeight:600}}>Analyzing chargebacks...</div></div>}
    </div>);
  }

  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      <Metric label="Total Chargebacks" value={String(analysis.count)} accent={C.danger} sub={fmt(analysis.total)} icon="🛡"/>
      <Metric label="Fraud-Related" value={`${analysis.fraudPct}%`} accent={C.danger} sub="Unauthorized + CNP" icon="⚠"/>
      <Metric label="Repeat Cards" value={String(analysis.repeatCards.length)} accent={C.warning} sub="2+ cases" icon="🔁"/>
      <Metric label="Top Cause" value={analysis.byCat[0]?analysis.byCat[0][1].label.split(" ").slice(0,2).join(" "):"—"} accent={C.warning} icon="📊"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
      <Panel title="Root Cause Breakdown">
        <div style={{padding:16}}>
          {analysis.byCat.map(([key,cat])=>{
            const pct=Math.round(cat.count/analysis.count*100);
            return(<div key={key} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:C.textDim,fontSize:11}}>{cat.label}</span>
                <span style={{color:C.text,fontSize:11,fontFamily:mono}}>{cat.count} ({pct}%) — {fmt(cat.amount)}</span>
              </div>
              <div style={{height:6,background:C.surfaceLight,borderRadius:3}}>
                <div style={{height:"100%",width:`${pct}%`,background:cat.color==="red"?C.danger:cat.color==="yellow"?C.warning:C.blue,borderRadius:3}}/>
              </div>
            </div>);
          })}
        </div>
      </Panel>
      <Panel title="🤖 AI Recommendations">
        <div style={{padding:16}}>
          {analysis.recs.map((r,i)=>(
            <div key={i} style={{padding:"10px 0",borderBottom:i<analysis.recs.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                <span style={{color:C.text,fontSize:12,fontWeight:600}}>{r.title}</span>
                <Pill color={r.color}>{r.impact}</Pill>
              </div>
              <div style={{color:C.textMuted,fontSize:11}}>{r.desc}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
      <Panel title="By Merchant">
        <div style={{padding:16}}>
          {analysis.byMerchant.map(([m,v])=>(
            <div key={m} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.text,fontSize:12,fontWeight:600}}>{m}</span>
              <span style={{color:C.textDim,fontSize:11,fontFamily:mono}}>{v.count} — {fmt(v.amount)}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="⚠ Repeat Offender Cards">
        <div style={{padding:16}}>
          {analysis.repeatCards.length===0?<div style={{color:C.textMuted,fontSize:12,padding:20,textAlign:"center"}}>No repeat cards</div>:
          analysis.repeatCards.map(([card,v])=>(
            <div key={card} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div>
                <span style={{color:C.text,fontFamily:mono,fontSize:13}}>****{card}</span>
                <span style={{color:C.textMuted,fontSize:11,marginLeft:8}}>{v.count} chargebacks</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:C.danger,fontFamily:mono,fontSize:12}}>{fmt(v.amount)}</span>
                {blockedCards.has(card)?
                  <span style={{color:C.danger,fontSize:10,fontWeight:700}}>Blocked ✓</span>:
                  <button onClick={()=>setBlockedCards(p=>{const n=new Set(p);n.add(card);return n;})} style={{background:C.dangerDim,color:C.danger,border:"none",borderRadius:4,padding:"4px 8px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Block</button>
                }
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
    <Panel title={`All Chargebacks (${analysis.count})`} right={
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>{setData(null);setBlockedCards(new Set());}} style={{background:C.surfaceLight,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",color:C.textDim,fontSize:10,fontWeight:600,cursor:"pointer"}}>↻ New File</button>
        <button style={{background:C.surfaceLight,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",color:C.text,fontSize:10,fontWeight:600,cursor:"pointer"}}>📄 Export</button>
      </div>
    }>
      <div style={{maxHeight:280,overflowY:"auto"}}>
        {data.map((r,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"70px 130px 100px 1fr 90px 80px",padding:"10px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
            <span style={{color:C.textMuted,fontFamily:mono,fontSize:10}}>{r.id||`#${i+1}`}</span>
            <span style={{color:C.text,fontSize:11,fontWeight:600}}>{r.merchant||"—"}</span>
            <span style={{color:C.text,fontFamily:mono,fontSize:11}}>{fmt(r.parsedAmount)}</span>
            <span style={{color:C.textDim,fontSize:11}}>{r.categoryLabel}</span>
            <span style={{color:C.textMuted,fontFamily:mono,fontSize:10}}>{r.date||"—"}</span>
            <Pill color={r.categoryColor}>{r.category}</Pill>
          </div>
        ))}
      </div>
    </Panel>
  </div>);
}

/* === SCREEN 5: FRAUD === */
function FraudScreen({txs}){
  const [blockedTxs,setBlockedTxs]=useState(new Set());
  const flagged=txs.filter(t=>t.riskScore>75);
  const high=txs.filter(t=>t.riskScore>90);
  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      <Metric label="Scanned" value={String(txs.length)} sub="Real-time"/>
      <Metric label="Flagged" value={String(flagged.length)} accent={C.warning} sub={`${high.length} high risk`}/>
      <Metric label="Auto-Blocked" value={String(high.length)} accent={C.danger} sub="Score > 90"/>
      <Metric label="Prevented" value={fmt(high.reduce((s,t)=>s+t.amount,0))} accent={C.accent}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
      <Panel title="Risk Distribution">
        <div style={{padding:16}}>
          <div style={{display:"flex",gap:3,height:100,alignItems:"flex-end"}}>
            {Array.from({length:20},(_,i)=>{
              const lo=i*5,hi2=lo+5;
              const n=txs.filter(t=>t.riskScore>=lo&&t.riskScore<hi2).length;
              const h=n?Math.max(6,(n/txs.length)*180):3;
              const clr=lo>=90?C.danger:lo>=75?C.warning:lo>=50?C.blue:C.accent;
              return<div key={i} style={{flex:1,height:h,background:clr,borderRadius:2,opacity:.8}}/>;
            })}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{color:C.textMuted,fontSize:9}}>0 Safe</span><span style={{color:C.textMuted,fontSize:9}}>100 Critical</span>
          </div>
        </div>
      </Panel>
      <Panel title="Active Rules">
        <div style={{padding:16}}>
          {[{r:"Velocity check",d:"> 5 tx/min same card",n:23},{r:"Amount anomaly",d:"> 3x avg merchant tx",n:8},{r:"Geo mismatch",d:"Card ≠ IP country",n:15},{r:"Repeat CB card",d:"> 2 past chargebacks",n:6},{r:"Time pattern",d:"2-5 AM local",n:41}].map((x,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<4?`1px solid ${C.border}`:"none",alignItems:"center"}}>
              <div><div style={{color:C.text,fontSize:11,fontWeight:600}}>{x.r}</div><div style={{color:C.textMuted,fontSize:10}}>{x.d}</div></div>
              <span style={{color:C.textDim,fontSize:10,fontFamily:mono}}>{x.n} triggers</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
    <Panel title="Flagged Transactions">
      {flagged.length===0?<div style={{padding:30,textAlign:"center",color:C.accent}}>✓ No flags</div>:
      <div style={{maxHeight:260,overflowY:"auto"}}>
        {flagged.slice(0,8).map(tx=>(
          <div key={tx.id} style={{display:"grid",gridTemplateColumns:"100px 130px 110px 50px 1fr 90px",padding:"10px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:tx.riskScore>90?`${C.danger}06`:"transparent"}}>
            <span style={{color:C.textMuted,fontFamily:mono,fontSize:10}}>{fmtTime(tx.time)}</span>
            <span style={{color:C.text,fontSize:11,fontWeight:600}}>{tx.merchant}</span>
            <span style={{color:C.text,fontFamily:mono,fontSize:11}}>{fmt(tx.amount)}</span>
            <span style={{color:C.textDim,fontSize:10}}>{tx.currency}</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:50,height:5,background:C.surfaceLight,borderRadius:3}}><div style={{height:"100%",width:`${tx.riskScore}%`,background:tx.riskScore>90?C.danger:C.warning,borderRadius:3}}/></div>
              <span style={{color:tx.riskScore>90?C.danger:C.warning,fontFamily:mono,fontSize:11,fontWeight:700}}>{tx.riskScore}</span>
            </div>
            <div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>
              {blockedTxs.has(tx.id)?<span style={{color:C.danger,fontSize:10,fontWeight:700}}>Blocked ✓</span>:<>
                <button onClick={()=>setBlockedTxs(p=>{const n=new Set(p);n.add(tx.id);return n;})} style={{background:C.dangerDim,color:C.danger,border:"none",borderRadius:4,padding:"3px 7px",fontSize:9,fontWeight:700,cursor:"pointer"}}>Block</button>
                <button style={{background:C.surfaceLight,color:C.textDim,border:"none",borderRadius:4,padding:"3px 7px",fontSize:9,fontWeight:700,cursor:"pointer"}}>Review</button>
              </>}
            </div>
          </div>
        ))}
      </div>}
    </Panel>
  </div>);
}

/* === MAIN DEMO PAGE === */
export default function Demo(){
  const [tab,setTab]=useState("settlement");
  const [txs,setTxs]=useState(()=>Array.from({length:15},(_,i)=>genTx(i)));
  const ctr=useRef(15);

  useEffect(()=>{
    const iv=setInterval(()=>{ctr.current++;setTxs(p=>[...p,genTx(ctr.current)].slice(-50));},4000);
    return()=>clearInterval(iv);
  },[]);

  return(
    <div style={{fontFamily:ff,background:C.bg,minHeight:"100vh",color:C.text}}>
      {/* Header */}
      <div style={{borderBottom:`1px solid ${C.border}`,padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <Link to="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none",color:C.text}}>
            <div style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${C.accent},${C.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#000"}}>S</div>
            <div><div style={{fontWeight:700,fontSize:15,letterSpacing:-.3}}>Settlement Engine</div><div style={{color:C.textMuted,fontSize:10}}>Enterprise Settlement Infrastructure</div></div>
          </Link>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <Link to="/" style={{color:C.textDim,fontSize:11,textDecoration:"none",fontWeight:500}}>← Back to FoundryDocs</Link>
          <span style={{color:C.textMuted,fontSize:11,fontFamily:mono}}>v1.0</span>
          <div style={{width:28,height:28,borderRadius:"50%",background:C.surfaceLight,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim,fontSize:12,fontWeight:600}}>A</div>
        </div>
      </div>
      {/* Body */}
      <div style={{maxWidth:1180,margin:"0 auto",padding:"20px 28px"}}>
        <Tabs tabs={NAV} active={tab} onChange={setTab}/>
        {tab==="settlement"&&<SettlementScreen txs={txs}/>}
        {tab==="reconciliation"&&<ReconciliationScreen txs={txs}/>}
        {tab==="refunds"&&<RefundsScreen/>}
        {tab==="chargebacks"&&<ChargebackScreen/>}
        {tab==="fraud"&&<FraudScreen txs={txs}/>}
      </div>
      <div style={{borderTop:`1px solid ${C.border}`,padding:"14px 28px",textAlign:"center",marginTop:32}}>
        <span style={{color:C.textMuted,fontSize:10}}>Settlement Engine v1.0 · Built by FoundryDocs</span>
      </div>
    </div>
  );
}
