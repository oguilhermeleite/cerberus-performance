import React, { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, Target, DollarSign, ShoppingBag,
  Radar, Printer, Sparkles, ChevronDown, Loader2, ArrowLeft, ShieldCheck, ChevronRight,
} from "lucide-react";

/* ============================================================
   CERBERUS — CENTRAL DE PERFORMANCE (protótipo, dados fictícios)
   Carteira multi-cliente + painel detalhado por loja.
   ============================================================ */

const STYLES = `
:root{
  --void:#0A0A0B; --panel:#141417; --panel2:#1B1B1F;
  --ember:#FF5A1F; --ember2:#FF7A3C; --bone:#F4F2EE; --ash:#86868C;
  --line:#26262B; --up:#3DDC84; --down:#FF4D57; --warn:#FFB020;
}
*{box-sizing:border-box}
.cb-app{background:var(--void);color:var(--bone);min-height:100vh;
  font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.cb-wrap{max-width:1200px;margin:0 auto;padding:20px 18px 60px}
.cb-mono{font-family:'JetBrains Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums}
.cb-disp{font-family:'Anton',sans-serif;letter-spacing:.5px;text-transform:uppercase;font-weight:400}

.cb-top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  padding:12px 0 18px;border-bottom:1px solid var(--line);margin-bottom:22px}
.cb-brand{display:flex;align-items:center;gap:11px;margin-right:auto}
.cb-mark{width:38px;height:38px;flex:0 0 38px}
.cb-name b{font-family:'Anton',sans-serif;font-size:20px;letter-spacing:1px;text-transform:uppercase;display:block;line-height:1}
.cb-name span{display:block;font-size:9.5px;letter-spacing:3px;color:var(--ember);
  text-transform:uppercase;margin-top:3px;font-weight:700}

.cb-ctrl{position:relative}
.cb-select{appearance:none;background:var(--panel);color:var(--bone);border:1px solid var(--line);
  border-radius:10px;padding:10px 34px 10px 13px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif}
.cb-select:focus-visible{outline:2px solid var(--ember);outline-offset:1px}
.cb-chev{position:absolute;right:11px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--ash)}
.cb-seg{display:flex;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:3px}
.cb-seg button{background:none;border:none;color:var(--ash);font-size:12.5px;font-weight:700;
  padding:7px 13px;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif}
.cb-seg button[data-on="1"]{background:var(--ember);color:#160800}
.cb-seg button:focus-visible{outline:2px solid var(--ember);outline-offset:1px}
.cb-btn{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--bone);
  border:1px solid var(--line);border-radius:10px;padding:10px 15px;font-size:12.5px;font-weight:700;
  cursor:pointer;font-family:'Inter',sans-serif}
.cb-btn:hover{border-color:var(--ember);color:var(--ember)}
.cb-btn:focus-visible{outline:2px solid var(--ember);outline-offset:1px}

.cb-kgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
.cb-kpi{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;position:relative;overflow:hidden}
.cb-kpi::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ember)}
.cb-klab{font-size:10.5px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ash);font-weight:700}
.cb-kval{font-family:'Anton',sans-serif;font-size:31px;line-height:1;margin:11px 0 8px;letter-spacing:.5px}
.cb-kdelta{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:800;font-family:'JetBrains Mono',monospace}
.cb-kdelta small{color:var(--ash);font-weight:600;margin-left:3px}

.cb-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px}
.cb-hero h1{font-family:'Anton',sans-serif;font-size:34px;letter-spacing:.5px;text-transform:uppercase;margin:0;line-height:.95}
.cb-hero p{color:var(--ash);font-size:13px;margin:8px 0 0}
.cb-legend{display:flex;gap:14px;font-size:11.5px;color:var(--ash);font-weight:600}
.cb-legend i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px}
.cb-filterbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:4px 0 14px}
.cb-cardgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.cb-card{text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:14px;
  padding:15px 15px 14px;cursor:pointer;position:relative;overflow:hidden;transition:transform .12s,border-color .12s;
  font-family:'Inter',sans-serif;color:var(--bone)}
.cb-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--sc)}
.cb-card:hover{transform:translateY(-2px);border-color:#3a3a40}
.cb-card:focus-visible{outline:2px solid var(--ember);outline-offset:1px}
.cb-chead{display:flex;align-items:center;gap:8px;margin-bottom:2px}
.cb-cdot{width:9px;height:9px;border-radius:50%;background:var(--sc);flex:0 0 auto}
.cb-cnm{font-family:'Anton',sans-serif;font-size:15px;letter-spacing:.4px;text-transform:uppercase;line-height:1}
.cb-cseg{font-size:11px;color:var(--ash);margin-bottom:12px;margin-left:17px}
.cb-cfat{font-family:'Anton',sans-serif;font-size:25px;line-height:1;margin-bottom:9px}
.cb-crow{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.cb-chip{font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:800;padding:3px 8px;border-radius:6px;background:var(--panel2)}
.cb-cdelta{display:inline-flex;align-items:center;gap:3px;font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:800}
.cb-pace{height:7px;border-radius:4px;background:var(--panel2);overflow:hidden;margin-bottom:6px}
.cb-pacefill{height:100%;border-radius:4px;background:var(--sc)}
.cb-paclab{display:flex;justify-content:space-between;font-size:10.5px;color:var(--ash);font-weight:600}
.cb-cgo{position:absolute;right:13px;bottom:13px;color:var(--ash)}

.cb-row{display:grid;grid-template-columns:1.55fr 1fr;gap:12px;margin-bottom:14px}
.cb-panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:17px 18px}
.cb-ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.cb-ph h3{font-family:'Anton',sans-serif;font-size:16px;letter-spacing:.6px;text-transform:uppercase;margin:0}
.cb-ph .cb-tag{font-size:10px;letter-spacing:1.5px;color:var(--ash);text-transform:uppercase;font-weight:700}
.cb-funnel{display:flex;flex-direction:column;gap:9px}
.cb-fstep{display:flex;align-items:center;gap:12px}
.cb-fbar{height:34px;border-radius:8px;display:flex;align-items:center;padding:0 12px;
  background:linear-gradient(90deg,var(--ember),var(--ember2));color:#160800;font-weight:800;font-size:13px;
  min-width:64px;font-family:'JetBrains Mono',monospace}
.cb-fmeta{font-size:11px;color:var(--ash)}
.cb-fmeta b{color:var(--bone);font-size:12.5px;display:block;font-weight:700}
.cb-chan{display:flex;flex-direction:column;gap:11px}
.cb-crow2{display:grid;grid-template-columns:128px 1fr 62px;align-items:center;gap:12px}
.cb-cbarwrap{height:9px;background:var(--panel2);border-radius:5px;overflow:hidden}
.cb-cbar{height:100%;border-radius:5px;background:linear-gradient(90deg,var(--ember),var(--ember2))}
.cb-croas{text-align:right;font-family:'JetBrains Mono',monospace;font-weight:800;font-size:13px}

.cb-intel{background:radial-gradient(120% 90% at 100% 0%, rgba(255,90,31,.14), transparent 60%), var(--panel);
  border:1px solid #33200F;border-radius:14px;padding:18px;position:relative;overflow:hidden}
.cb-intel::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.012) 4px)}
.cb-ihead{display:flex;align-items:center;gap:9px;margin-bottom:5px}
.cb-ihead .dot{width:8px;height:8px;border-radius:50%;background:var(--up);box-shadow:0 0 10px var(--up);animation:cbpulse 1.8s infinite}
@keyframes cbpulse{50%{opacity:.35}}
.cb-ihead h3{font-family:'Anton',sans-serif;font-size:15px;letter-spacing:2px;margin:0;text-transform:uppercase}
.cb-isub{font-size:10px;letter-spacing:2px;color:var(--ember);text-transform:uppercase;font-weight:700;margin-bottom:15px}
.cb-ilist{display:flex;flex-direction:column;gap:12px;position:relative;z-index:1}
.cb-item{display:flex;gap:11px;align-items:flex-start}
.cb-inum{font-family:'Anton',sans-serif;color:var(--ember);font-size:15px;line-height:1.15}
.cb-itext{font-size:13.5px;line-height:1.5;color:#DCDAD4}
.cb-itext b{color:var(--bone)}
.cb-igen{margin-top:16px;display:inline-flex;align-items:center;gap:8px;background:var(--ember);color:#160800;border:none;
  border-radius:9px;padding:10px 15px;font-size:12.5px;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;position:relative;z-index:1}
.cb-igen:disabled{opacity:.6;cursor:default}
.cb-igen:focus-visible{outline:2px solid var(--bone);outline-offset:2px}
.cb-note{font-size:10.5px;color:var(--ash);margin-top:9px;position:relative;z-index:1}

.cb-foot{margin-top:26px;padding-top:16px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:11px;color:var(--ash)}
.cb-foot b{color:var(--ember)}
@keyframes spin{to{transform:rotate(360deg)}}

@media (max-width:900px){ .cb-cardgrid{grid-template-columns:repeat(2,1fr)} }
@media (max-width:820px){ .cb-kgrid{grid-template-columns:repeat(2,1fr)} .cb-row{grid-template-columns:1fr} .cb-kval{font-size:27px} .cb-hero h1{font-size:28px} }
@media (max-width:560px){ .cb-cardgrid{grid-template-columns:1fr} }
@media print{ .cb-app{background:#fff;color:#000} .cb-no-print{display:none!important}
  .cb-kpi,.cb-panel,.cb-intel,.cb-card{border-color:#ccc;background:#fff;break-inside:avoid} .cb-app *{color:#000!important} }
`;

function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
const brl=(n)=>"R$ "+Math.round(n).toLocaleString("pt-BR");
const brlK=(n)=>n>=1000?"R$ "+(n/1000).toFixed(n>=10000?0:1).replace(".",",")+"k":"R$ "+Math.round(n);
const num=(n)=>Math.round(n).toLocaleString("pt-BR");
const pct=(n)=>(n>=0?"+":"")+n.toFixed(1).replace(".",",")+"%";
const SC={verde:"#3DDC84",amarelo:"#FFB020",vermelho:"#FF4D57"};

const CHANNELS=[{key:"Meta Ads",w:0.44},{key:"Google Ads",w:0.19},{key:"Instagram orgânico",w:0.22},{key:"Influencers",w:0.15}];

const CLIENT_DEFS=[
  ["indigo","Loja Índigo","Moda feminina",111],["corvo","Corvo Streetwear","Streetwear",777],
  ["verano","Ateliê Verano","Alfaiataria",428],["mare","Maré Alta Wear","Beachwear",914],
  ["ambar","Studio Âmbar","Moda festa",233],["denim","Rústico Denim","Jeanswear",560],
  ["lume","Lume Concept","Minimalista",801],["fera","Fera Fitness","Moda fitness",649],
  ["bento","Bento & Cia","Moda masculina",372],["oliva","Oliva Boutique","Boutique",128],
  ["nomade","Nômade Co.","Urbano outdoor",915],["rosa","Rosa Selvagem","Fast fashion",204],
  ["norte","Norte 22","Streetwear",733],["linho","Casa Linho","Slow fashion",488],
  ["prime","Vitrine Prime","Multimarca",651],["zeno","Zeno Alfaiataria","Ternos",319],
  ["bruma","Bruma Moda Praia","Beachwear",842],["arroz","Pó de Arroz","Romântica",176],
  ["grao","Grão Kids","Moda infantil",905],["ferro","Ferro & Couro","Acessórios",254],
  ["malha","Malha Fina","Tricô/inverno",617],["duna","Duna Resortwear","Resort",380],
  ["preto","Preto no Branco","Básicos",729],["aurora","Aurora Plus","Plus size",142],
];
function makeClient([id,name,seg,seed]){
  const r=mulberry32(seed);
  const spend=280+Math.floor(r()*760);
  const roas=3.1+r()*3.6;
  const rev=spend*roas;
  const trend=0.8+r()*0.62;
  const meta=Math.round(spend*roas*30*(0.82+r()*0.5));
  return {id,name,seg,seed,spend,roas,rev,trend,meta};
}
const CLIENTS=CLIENT_DEFS.map(makeClient);

function buildDaily(c){
  const rnd=mulberry32(c.seed);const days=[];
  for(let i=0;i<365;i++){
    const growth=1+(c.trend-1)*(i/365);
    const weekly=1+0.18*Math.sin((i/7)*2*Math.PI);
    const noise=0.82+rnd()*0.36;
    const spend=c.spend*growth*weekly*noise;
    const roas=c.roas*(0.9+rnd()*0.25)*(0.96+0.08*Math.sin(i/40));
    const faturamento=spend*roas;
    const compras=Math.max(1,faturamento/(180+rnd()*120));
    const cliques=spend/(0.9+rnd()*0.6);
    const visitas=cliques*(0.72+rnd()*0.12);
    const alcance=cliques*(14+rnd()*8);
    days.push({faturamento,investimento:spend,compras,cliques,visitas,alcance});
  }
  return days;
}
const sumD=(arr)=>arr.reduce((a,d)=>({faturamento:a.faturamento+d.faturamento,investimento:a.investimento+d.investimento,compras:a.compras+d.compras,cliques:a.cliques+d.cliques,visitas:a.visitas+d.visitas,alcance:a.alcance+d.alcance}),{faturamento:0,investimento:0,compras:0,cliques:0,visitas:0,alcance:0});
function delta(cur,prev){if(!prev||prev===0)return null;return ((cur-prev)/prev)*100;}

function aggregate(daily,period){
  let curSlice,prevSlice,bucket,label;
  if(period==="30d"){curSlice=daily.slice(-30);prevSlice=daily.slice(-60,-30);bucket=1;label=(i)=>`${i+1}`;}
  else if(period==="90d"){curSlice=daily.slice(-90);prevSlice=daily.slice(-180,-90);bucket=7;label=(i)=>`S${i+1}`;}
  else{curSlice=daily.slice(-360);prevSlice=null;bucket=30;label=(i)=>["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][i];}
  const series=[];
  for(let i=0;i<curSlice.length;i+=bucket){const s=sumD(curSlice.slice(i,i+bucket));series.push({label:label(series.length),faturamento:Math.round(s.faturamento),investimento:Math.round(s.investimento)});}
  return {series,totals:sumD(curSlice),prevTotals:prevSlice?sumD(prevSlice):null};
}

function localInsights(client,period,T,P){
  const roas=T.faturamento/T.investimento;const ticket=T.faturamento/T.compras;const cpa=T.investimento/T.compras;
  const dRev=P?delta(T.faturamento,P.faturamento):null;const dRoas=P?delta(roas,P.faturamento/P.investimento):null;
  const best=[...CHANNELS].sort((a,b)=>b.w-a.w)[0];const out=[];
  if(dRev!=null){out.push(dRev>=0
    ?`Faturamento <b>${pct(dRev)}</b> vs. período anterior. O ritmo de ${client.name} está saudável — vale escalar o investimento nos canais de maior ROAS antes que o CPA suba.`
    :`Faturamento recuou <b>${pct(dRev)}</b>. Sugiro revisar a verba de ${best.key}: provável fadiga de criativo. Trocar os 3 anúncios de menor CTR costuma recuperar o volume em ~7 dias.`);}
  out.push(`ROAS médio de <b>${roas.toFixed(1).replace(".",",")}x</b>${dRoas!=null?` (${pct(dRoas)})`:""} — cada R$1 investido retornou R$${roas.toFixed(2).replace(".",",")}. Acima da média de mercado para moda (3–4x), então há margem para agressividade em ${best.key}.`);
  out.push(`Ticket médio em <b>${brl(ticket)}</b> e CPA de <b>${brl(cpa)}</b>. A distância entre os dois é o lucro por venda — dá pra ampliá-la com bundles e upsell no checkout, sem gastar mais em tráfego.`);
  return out;
}

function Carteira({ portfolio, agg, onOpen }) {
  const [filter, setFilter] = useState("todas");
  const order = { vermelho: 0, amarelo: 1, verde: 2 };
  const list = portfolio
    .filter((c) => filter === "todas" ? true : filter === "alvo" ? c.status === "verde" : c.status !== "verde")
    .sort((a, b) => order[a.status] - order[b.status] || b.fat30 - a.fat30);

  const kpis = [
    { lab: "Faturamento da carteira", val: brlK(agg.fat), sub: "últimos 30 dias" },
    { lab: "Investimento total", val: brlK(agg.inv), sub: "últimos 30 dias" },
    { lab: "ROAS médio", val: (agg.fat / agg.inv).toFixed(1).replace(".", ",") + "x", sub: "ponderado" },
    { lab: "No alvo", val: `${agg.verde}/${portfolio.length}`, sub: `${agg.atencao} pedem atenção` },
  ];

  return (
    <>
      <div className="cb-hero">
        <div>
          <h1>Carteira de clientes</h1>
          <p>{portfolio.length} lojas ativas · ordenadas por prioridade de atenção</p>
        </div>
        <div className="cb-legend">
          <span><i style={{ background: SC.vermelho }} />Abaixo da meta</span>
          <span><i style={{ background: SC.amarelo }} />No limite</span>
          <span><i style={{ background: SC.verde }} />No alvo</span>
        </div>
      </div>

      <section className="cb-kgrid">
        {kpis.map((k) => (
          <div className="cb-kpi" key={k.lab}>
            <span className="cb-klab">{k.lab}</span>
            <div className="cb-kval">{k.val}</div>
            <span style={{ fontSize: 11.5, color: "var(--ash)", fontWeight: 600 }}>{k.sub}</span>
          </div>
        ))}
      </section>

      <div className="cb-filterbar">
        <div className="cb-seg" role="tablist" aria-label="Filtro">
          {[["todas", `Todas (${portfolio.length})`], ["atencao", `Atenção (${agg.atencao})`], ["alvo", `No alvo (${agg.verde})`]].map(([k, t]) => (
            <button key={k} data-on={filter === k ? "1" : "0"} onClick={() => setFilter(k)} role="tab" aria-selected={filter === k}>{t}</button>
          ))}
        </div>
        <span style={{ fontSize: 11.5, color: "var(--ash)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ShieldCheck size={14} color="var(--ember)" /> Cerberus vigia {portfolio.length} lojas em tempo real
        </span>
      </div>

      <section className="cb-cardgrid">
        {list.map((c) => (
          <button key={c.id} className="cb-card" style={{ "--sc": SC[c.status] }} onClick={() => onOpen(c.id)}>
            <div className="cb-chead"><span className="cb-cdot" /><span className="cb-cnm">{c.name}</span></div>
            <div className="cb-cseg">{c.seg}</div>
            <div className="cb-cfat">{brlK(c.fat30)}</div>
            <div className="cb-crow">
              <span className="cb-chip">ROAS {c.roas.toFixed(1).replace(".", ",")}x</span>
              {c.dRev != null && (
                <span className="cb-cdelta" style={{ color: c.dRev >= 0 ? "var(--up)" : "var(--down)" }}>
                  {c.dRev >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{pct(c.dRev)}
                </span>
              )}
            </div>
            <div className="cb-pace"><div className="cb-pacefill" style={{ width: `${Math.min(100, c.pacing * 100)}%` }} /></div>
            <div className="cb-paclab"><span>{Math.round(c.pacing * 100)}% da meta</span><span>meta {brlK(c.meta)}</span></div>
            <ChevronRight size={16} className="cb-cgo" />
          </button>
        ))}
      </section>
    </>
  );
}

function ClientPanel({ client }) {
  const [period, setPeriod] = useState("90d");
  const [aiInsights, setAiInsights] = useState(null);
  const [aiState, setAiState] = useState("idle");
  useEffect(() => { setAiInsights(null); setAiState("idle"); }, [client.id, period]);

  const daily = useMemo(() => buildDaily(client), [client]);
  const { series, totals, prevTotals } = useMemo(() => aggregate(daily, period), [daily, period]);
  const roas = totals.faturamento / totals.investimento;
  const ticket = totals.faturamento / totals.compras;

  const kpis = [
    { lab: "Faturamento", val: brlK(totals.faturamento), d: delta(totals.faturamento, prevTotals?.faturamento), icon: DollarSign },
    { lab: "ROAS", val: roas.toFixed(1).replace(".", ",") + "x", d: prevTotals ? delta(roas, prevTotals.faturamento / prevTotals.investimento) : null, icon: Target },
    { lab: "Investimento", val: brlK(totals.investimento), d: delta(totals.investimento, prevTotals?.investimento), icon: Radar, invert: true },
    { lab: "Vendas", val: num(totals.compras), d: delta(totals.compras, prevTotals?.compras), icon: ShoppingBag },
  ];
  const funnel = [
    { lab: "Alcance", v: totals.alcance }, { lab: "Cliques", v: totals.cliques },
    { lab: "Visitas à loja", v: totals.visitas }, { lab: "Vendas", v: totals.compras },
  ];
  const fmax = funnel[0].v;
  const chanData = CHANNELS.map((ch, i) => {
    const r = mulberry32(client.seed + i * 13);
    return { name: ch.key, invest: totals.investimento * ch.w, roas: client.roas * (0.7 + r() * 0.9) };
  });
  const chanMaxRoas = Math.max(...chanData.map((c) => c.roas));
  const shown = aiState === "done" && aiInsights ? aiInsights : localInsights(client, period, totals, prevTotals);

  async function generateAI() {
    setAiState("loading");
    const summary = { cliente: client.name, segmento: client.seg, periodo: period,
      faturamento: Math.round(totals.faturamento), investimento: Math.round(totals.investimento),
      roas: Number(roas.toFixed(2)), ticket_medio: Math.round(ticket), vendas: Math.round(totals.compras),
      variacao_faturamento_pct: prevTotals ? Number(delta(totals.faturamento, prevTotals.faturamento).toFixed(1)) : null };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user",
          content: "Você é um analista sênior da Cerberus, assessoria de marketing para lojas de moda. Com base nestes dados de campanha, gere EXATAMENTE 3 insights curtos e acionáveis em português do Brasil, cada um com no máximo 2 frases, tom direto e consultivo, citando números. Responda SOMENTE com um array JSON de 3 strings, sem markdown.\n\nDADOS:\n" + JSON.stringify(summary) }] }),
      });
      const data = await res.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("").replace(/```json|```/g, "").trim();
      const arr = JSON.parse(text);
      if (Array.isArray(arr) && arr.length) { setAiInsights(arr.slice(0, 3)); setAiState("done"); } else throw new Error();
    } catch { setAiState("error"); }
  }

  return (
    <>
      <div className="cb-filterbar">
        <div>
          <div className="cb-disp" style={{ fontSize: 12, color: "var(--ash)", letterSpacing: 2 }}>Relatório de resultados</div>
          <div className="cb-disp" style={{ fontSize: 26 }}>{client.name} <span style={{ color: "var(--ash)", fontSize: 15 }}>· {client.seg}</span></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="cb-seg cb-no-print" role="tablist" aria-label="Período">
            {[["30d", "30 dias"], ["90d", "90 dias"], ["12m", "12 meses"]].map(([k, t]) => (
              <button key={k} data-on={period === k ? "1" : "0"} onClick={() => setPeriod(k)} role="tab" aria-selected={period === k}>{t}</button>
            ))}
          </div>
          <button className="cb-btn cb-no-print" onClick={() => window.print()}><Printer size={15} /> Exportar</button>
        </div>
      </div>

      <section className="cb-kgrid">
        {kpis.map((k) => {
          const good = k.d == null ? null : k.invert ? k.d <= 0 : k.d >= 0; const Icon = k.icon;
          return (
            <div className="cb-kpi" key={k.lab}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="cb-klab">{k.lab}</span><Icon size={16} color="var(--ash)" />
              </div>
              <div className="cb-kval">{k.val}</div>
              {k.d != null && (
                <span className="cb-kdelta" style={{ color: good ? "var(--up)" : "var(--down)" }}>
                  {k.d >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{pct(k.d)}<small>vs. anterior</small>
                </span>
              )}
            </div>
          );
        })}
      </section>

      <section className="cb-row">
        <div className="cb-panel">
          <div className="cb-ph"><h3>Faturamento × Investimento</h3><span className="cb-tag">{period === "30d" ? "diário" : period === "90d" ? "semanal" : "mensal"}</span></div>
          <ResponsiveContainer width="100%" height={248}>
            <AreaChart data={series} margin={{ left: -8, right: 6, top: 4 }}>
              <defs><linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF5A1F" stopOpacity={0.4} /><stop offset="100%" stopColor="#FF5A1F" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="#26262B" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#86868C", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#86868C", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => "R$" + (v / 1000).toFixed(0) + "k"} width={52} />
              <Tooltip contentStyle={{ background: "#141417", border: "1px solid #26262B", borderRadius: 10, fontSize: 12 }} labelStyle={{ color: "#F4F2EE", fontWeight: 700 }} formatter={(v, n) => [brl(v), n === "faturamento" ? "Faturamento" : "Investimento"]} />
              <Area type="monotone" dataKey="faturamento" stroke="#FF5A1F" strokeWidth={2.5} fill="url(#gRev)" />
              <Line type="monotone" dataKey="investimento" stroke="#86868C" strokeWidth={1.6} dot={false} strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="cb-panel">
          <div className="cb-ph"><h3>Funil de conversão</h3><span className="cb-tag">período</span></div>
          <div className="cb-funnel">
            {funnel.map((f, i) => {
              const w = Math.max(16, (f.v / fmax) * 100); const conv = i > 0 ? (f.v / funnel[i - 1].v) * 100 : 100;
              return (
                <div className="cb-fstep" key={f.lab}>
                  <div className="cb-fbar" style={{ width: `${w}%` }}>{num(f.v)}</div>
                  <div className="cb-fmeta"><b>{f.lab}</b>{i > 0 && `${conv.toFixed(1).replace(".", ",")}% do passo anterior`}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cb-row">
        <div className="cb-panel">
          <div className="cb-ph"><h3>Desempenho por canal</h3><span className="cb-tag">ROAS por origem</span></div>
          <div className="cb-chan">
            {chanData.map((ch) => (
              <div className="cb-crow2" key={ch.name}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{ch.name}</span>
                <div className="cb-cbarwrap"><div className="cb-cbar" style={{ width: `${(ch.roas / chanMaxRoas) * 100}%` }} /></div>
                <span className="cb-croas" style={{ color: ch.roas >= client.roas ? "var(--up)" : "var(--bone)" }}>{ch.roas.toFixed(1).replace(".", ",")}x</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--ash)" }}>
            Investimento: {chanData.map((c) => `${c.name} ${brlK(c.invest)}`).join(" · ")}
          </div>
        </div>

        <div className="cb-intel">
          <div className="cb-ihead"><span className="dot" /><h3>Cerberus Intelligence</h3></div>
          <div className="cb-isub">Análise automática · {period === "12m" ? "12 meses" : period === "90d" ? "90 dias" : "30 dias"}</div>
          <div className="cb-ilist">
            {shown.map((t, i) => (
              <div className="cb-item" key={i}><span className="cb-inum">0{i + 1}</span><span className="cb-itext" dangerouslySetInnerHTML={{ __html: t }} /></div>
            ))}
          </div>
          <button className="cb-igen cb-no-print" onClick={generateAI} disabled={aiState === "loading"}>
            {aiState === "loading" ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Analisando…</> : <><Sparkles size={15} /> {aiState === "done" ? "Gerar novamente com IA" : "Aprofundar com IA"}</>}
          </button>
          {aiState === "error" && <div className="cb-note">Análise via IA indisponível neste ambiente — exibindo leitura automática. Em produção, conecte uma rota serverless com a chave da API.</div>}
          {aiState === "idle" && <div className="cb-note">Leitura automática dos dados. Toque em "Aprofundar com IA" para uma análise gerada pela Claude.</div>}
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [view, setView] = useState("carteira");
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const id = "cb-fonts";
    if (!document.getElementById(id)) {
      const l = document.createElement("link"); l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@600;800&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const portfolio = useMemo(() => CLIENTS.map((c) => {
    const daily = buildDaily(c);
    const t = sumD(daily.slice(-30)); const p = sumD(daily.slice(-60, -30));
    const pacing = t.faturamento / c.meta;
    const status = pacing >= 1 ? "verde" : pacing >= 0.9 ? "amarelo" : "vermelho";
    return { ...c, fat30: t.faturamento, inv30: t.investimento, roas: t.faturamento / t.investimento, dRev: delta(t.faturamento, p.faturamento), pacing, status };
  }), []);

  const agg = useMemo(() => ({
    fat: portfolio.reduce((a, c) => a + c.fat30, 0),
    inv: portfolio.reduce((a, c) => a + c.inv30, 0),
    verde: portfolio.filter((c) => c.status === "verde").length,
    atencao: portfolio.filter((c) => c.status !== "verde").length,
  }), [portfolio]);

  const client = clientId ? CLIENTS.find((c) => c.id === clientId) : null;
  const openClient = (id) => { setClientId(id); setView("cliente"); window.scrollTo(0, 0); };

  return (
    <div className="cb-app">
      <style>{STYLES}</style>
      <div className="cb-wrap">
        <header className="cb-top">
          <div className="cb-brand">
            <svg className="cb-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <rect width="40" height="40" rx="9" fill="#160800" />
              <path d="M8 30 L14 12 L18 24 L20 14 L22 24 L26 12 L32 30 Z" fill="#FF5A1F" />
            </svg>
            <div className="cb-name"><b>Cerberus</b><span>Central de Performance</span></div>
          </div>
          {view === "cliente" && (
            <>
              <button className="cb-btn cb-no-print" onClick={() => setView("carteira")}><ArrowLeft size={15} /> Carteira</button>
              <div className="cb-ctrl cb-no-print">
                <select className="cb-select" value={clientId} onChange={(e) => setClientId(e.target.value)} aria-label="Trocar cliente">
                  {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={15} className="cb-chev" />
              </div>
            </>
          )}
        </header>

        {view === "carteira"
          ? <Carteira portfolio={portfolio} agg={agg} onOpen={openClient} />
          : <ClientPanel client={client} />}

        <footer className="cb-foot">
          <span>Protótipo com <b>dados fictícios</b> — demonstração de conceito.</span>
          <span>Construído para a <b>Cerberus Assessoria</b> · por Guilherme</span>
        </footer>
      </div>
    </div>
  );
}
