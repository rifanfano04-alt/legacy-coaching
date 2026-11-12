/* LEGACY QG · appli du coach · v1 (12/11/2026)
   Données : Supabase (projet Legacy-QG). Tout est chargé en mémoire au démarrage, chaque action écrit dans la base puis réaffiche. */
(function(){
'use strict';
const C=window.LEGACY_CFG;
const SB=window.supabase.createClient(C.url,C.key);
const $=id=>document.getElementById(id);

// ---------- dates / utilitaires ----------
const DAY=864e5, T0=new Date(); T0.setHours(12,0,0,0);
const d=n=>new Date(T0.getTime()+n*DAY);
const iso=x=>{const z=new Date(x);z.setMinutes(z.getMinutes()-z.getTimezoneOffset());return z.toISOString().slice(0,10)};
const TODAY=iso(T0);
const diff=x=>Math.round((new Date(x+'T12:00:00')-T0)/DAY);
const fmtS=x=>new Date(x+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'}).replace('.','');
const fmtJ=x=>new Date(x+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric'}).replace('.','');
const eur=n=>(+n||0).toLocaleString('fr-FR')+' €';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ini=s=>String(s||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const prenom=s=>String(s||'').split(' ')[0];
const rel=x=>{const n=diff(x);return n===0?"aujourd'hui":n===-1?'hier':n===1?'demain':n<0?`il y a ${-n} j`:`dans ${n} j`};
const plus=(h,m)=>{const [a,b]=h.split(':').map(Number);const t=a*60+b+m;return String(Math.floor(t/60)%24).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
const hm=t=>t?String(t).slice(0,5):'';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const monday=(wk)=>{const m=new Date(T0);m.setDate(T0.getDate()-((T0.getDay()+6)%7)+wk*7);return m};

// ---------- constantes métier ----------
const ETAPES=[{k:'nouveau',t:'Nouveau'},{k:'contacte',t:'Contacté'},{k:'r1',t:'R1 · découverte'},{k:'r2',t:'R2 · offre'},{k:'gagne',t:'Signé'},{k:'perdu',t:'Perdu'}];
const etapeT=k=>(ETAPES.find(e=>e.k===k)||{t:k}).t;
const BASE={nouveau:15,contacte:30,r1:50,r2:75,gagne:100,perdu:0};
const NEXT={nouveau:'Premier message',contacte:'Caler le R1',r1:'R1 · appel découverte',r2:"R2 · présenter l'offre"};
const SRC={prepa:{t:'Vidéo prépa',c:'src-prepa'},ig:{t:'Instagram',c:'src-ig'},yt:{t:'YouTube',c:'src-yt'},bao:{t:'Bouche-à-oreille',c:'src-bao'}};
const STEPS=['Idée','Tournée','Montée','Publiée'];
const COL={nouveau:'var(--fg)',contacte:'var(--blue)',r1:'var(--amber)',r2:'#ffab7a',gagne:'var(--green)'};

// ---------- état ----------
const S={prospects:[],notes:{},ig:[],dm:{},videos:[],clics:{},leadsBy:{},leads:[],athletes:[],ventes:[],agenda:[],reg:{},offres:[],scripts:[],user:null};
let route='dashboard', sheetId=null, filtre='all', wk=0, selDay=TODAY, dict=null;
const OBJ_DM=()=>+(S.reg.objectif_dm??30), OBJ=()=>+(S.reg.objectif_mois??3000);
const SERVICES=()=>S.reg.services||[];
const PLAGES=()=>(S.reg.plages||[]).map(p=>({...p,t:p.kind==='prosp'?'Prospection · '+OBJ_DM()+' DM':p.t,s:p.kind==='prosp'?'Instagram':p.kind==='reel'?'Studio':'Fiches en retard'}));

// ---------- accès base ----------
async function q(p){const {data,error}=await p;if(error){console.error(error);toast('Erreur base : '+(error.message||'?'));throw error}return data}
const T=t=>SB.from(t);
async function upd(table,id,patch,local){await q(T(table).update(patch).eq('id',id));if(local)Object.assign(local,patch)}
async function ins(table,row){const r=await q(T(table).insert(row).select().single());return r}
async function del(table,id){await q(T(table).delete().eq('id',id))}
async function setReg(cle,valeur){await q(T('reglages').upsert({cle,valeur}));S.reg[cle]=valeur}

async function loadAll(){
  const [pr,no,ig,dm,vi,cl,le,at,ve,ag,re,of,ms]=await Promise.all([
    q(T('prospects').select('*').order('created_at',{ascending:false})),
    q(T('notes').select('*').order('created_at',{ascending:false})),
    q(T('ig_comptes').select('*').order('created_at',{ascending:true})),
    q(T('dm_jours').select('*')),
    q(T('videos').select('*').order('created_at',{ascending:true})),
    q(T('clics').select('slug,created_at').limit(20000)),
    q(T('leads').select('*').order('created_at',{ascending:false})),
    q(T('athletes').select('*').order('fin',{ascending:true})),
    q(T('ventes').select('*').order('date',{ascending:false})),
    q(T('agenda').select('*')),
    q(T('reglages').select('*')),
    q(T('offres').select('*').order('ordre')),
    q(T('messages_types').select('*').order('ordre')),
  ]);
  S.prospects=pr; S.notes={}; no.forEach(n=>{(S.notes[n.prospect_id]=S.notes[n.prospect_id]||[]).push({d:n.created_at.slice(0,10),t:n.texte,id:n.id})});
  S.ig=ig; S.dm={}; dm.forEach(x=>S.dm[x.jour]=x.nb);
  S.videos=vi; S.clics={}; cl.forEach(c=>S.clics[c.slug]=(S.clics[c.slug]||0)+1);
  S.leads=le; S.leadsBy={}; le.forEach(l=>S.leadsBy[l.slug]=(S.leadsBy[l.slug]||0)+1);
  S.athletes=at; S.ventes=ve;
  S.agenda=ag.map(e=>({id:e.id,d:e.date,h:hm(e.debut),e:hm(e.fin),t:e.titre,s:e.sous_titre||'',k:e.type,kind:e.kind,auto:e.auto,pid:e.prospect_id,gcal:e.gcal_id||null,meet:e.meet_url||null}));
  S.reg={}; re.forEach(r=>S.reg[r.cle]=r.valeur);
  S.offres=of; S.scripts=ms;
  await convertLeads();
}
// Un inscrit au lead magnet devient un prospect « Nouveau » avec le premier message à faire aujourd'hui.
async function convertLeads(){
  const todo=S.leads.filter(l=>!l.prospect_id);
  for(const l of todo){
    const nom=(l.email||'').split('@')[0].replace(/[._-]+/g,' ').trim()||(l.tel||'Inscrit');
    const p=await ins('prospects',{prenom:nom.charAt(0).toUpperCase()+nom.slice(1),tel:l.tel,email:l.email,source:'prepa',video_slug:l.slug,objectif:'',etape:'nouveau',montant:S.offres[0]?.prix||700,chance:BASE.nouveau,action:NEXT.nouveau,next_date:l.created_at.slice(0,10)});
    // on « réserve » l'inscrit : si un autre appareil l'a déjà converti entre-temps, on annule le doublon
    const claimed=await q(T('leads').update({prospect_id:p.id}).eq('id',l.id).is('prospect_id',null).select());
    if(!claimed.length){await del('prospects',p.id);continue}
    l.prospect_id=p.id;
    const n=await ins('notes',{prospect_id:p.id,texte:`Inscrit au lead magnet via « ${videoT(l.slug)} » (${l.tel||''} · ${l.email||''}).`});
    S.prospects.unshift(p); S.notes[p.id]=[{d:n.created_at.slice(0,10),t:n.texte,id:n.id}];
  }
}
const videoT=slug=>(S.videos.find(v=>v.slug===slug)||{}).titre||slug||'la vidéo';
const notesOf=p=>S.notes[p.id]||[];
const chance=p=>p.etape==='gagne'?100:p.etape==='perdu'?0:p.chance;
const open_=()=>S.prospects.filter(p=>!['gagne','perdu'].includes(p.etape));
const late=()=>open_().filter(p=>p.next_date&&diff(p.next_date)<=0).sort((a,b)=>a.next_date.localeCompare(b.next_date));
const dmToday=()=>S.dm[TODAY]||0;
const streak=()=>{let n=0;for(let i=1;i<400;i++){const k=iso(d(-i));if((S.dm[k]||0)>=OBJ_DM())n++;else break}return n+((dmToday()>=OBJ_DM())?1:0)};
const encMois=()=>S.ventes.filter(v=>v.date.slice(0,7)===TODAY.slice(0,7)).reduce((s,v)=>s+v.montant,0);
const caMois=(y,m)=>S.ventes.filter(v=>v.date.slice(0,7)===`${y}-${String(m+1).padStart(2,'0')}`).reduce((s,v)=>s+v.montant,0);
const hist12=()=>{const out=[];for(let i=11;i>=0;i--){const x=new Date(T0.getFullYear(),T0.getMonth()-i,1);out.push({m:x.toLocaleDateString('fr-FR',{month:'short'}).replace('.',''),v:caMois(x.getFullYear(),x.getMonth())})}return out};
const dayEv=dIso=>S.agenda.filter(e=>e.d===dIso).concat(ggDay(dIso)).sort((a,b)=>(a.h||'').localeCompare(b.h||''));
const propos=dIso=>{if(diff(dIso)<0||new Date(dIso+'T12:00:00').getDay()===0)return[];const evs=dayEv(dIso);return PLAGES().filter(pl=>!evs.some(e=>e.kind===pl.kind)&&!evs.some(e=>e.h&&e.e&&e.h<pl.e&&e.e>pl.h))};
const fill=(s,p)=>String(s).replace(/\{prénom\}/g,p?prenom(p.prenom):'').replace(/\{vidéo\}/g,p&&p.video_slug?videoT(p.video_slug):'la vidéo');
const actOf=p=>{const w=Array(12).fill(0);notesOf(p).forEach(n=>{const k=11-Math.floor(-diff(n.d)/7);if(k>=0&&k<12)w[k]++});return w};
const slots=()=>{const out=[];for(let i=1;i<=6&&out.length<3;i++){const dd=iso(d(i));const dow=new Date(dd+'T12:00:00').getDay();if(dow===0)continue;for(const h of ['12:30','18:00','19:00']){const e=plus(h,30);if(!S.agenda.some(x=>x.d===dd&&x.h&&x.e&&x.h<e&&x.e>h)){out.push({d:dd,h});break}}}return out};

// ---------- icônes ----------
const ICON={
  dash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/></svg>',
  prosp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-4-1L3 20l1.3-4A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>',
  crm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>',
  links:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/></svg>',
  ath:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12h3M19 12h3M5 8v8M19 8v8M8 6v12M16 6v12M8 12h8"/></svg>',
  sales:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></svg>',
  agenda:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4.1c1.7.7 2.4.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  out:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 17l5-5-5-5M15 12H3M21 3v18"/></svg>',
};
const VIEWS=[{k:'dashboard',t:'Tableau de bord',i:'dash'},{k:'prospection',t:'Prospection IG',i:'prosp'},{k:'crm',t:'Prospects',i:'crm'},{k:'videos',t:'Vidéos & liens',i:'links'},{k:'athletes',t:'Athlètes',i:'ath'},{k:'ventes',t:'Ventes',i:'sales'},{k:'agenda',t:'Agenda',i:'agenda'}];
const TABS={dashboard:'Accueil',prospection:'Insta',crm:'Prospects',videos:'Vidéos',agenda:'Agenda'};
const TITLES={dashboard:'Tableau de bord',prospection:'Prospection Instagram',crm:'Prospects',videos:'Vidéos & liens',athletes:'Athlètes',ventes:'Ventes',agenda:'Agenda',reglages:'Réglages'};

// ---------- petits rendus ----------
const sparkSVG=(arr,cls)=>{const w=64,h=18,mx=Math.max(...arr,1);return `<svg class="${cls||'spark'}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${arr.map((v,i)=>`<rect x="${i*(w/arr.length)+1}" y="${h-v/mx*h}" width="${w/arr.length-2}" height="${v/mx*h}" rx="1" fill="${i===arr.length-1?'var(--green)':'var(--green-dim)'}"/>`).join('')}</svg>`};
const chanceHTML=c=>{const col=c>=70?'var(--green)':c>=40?'var(--amber)':'var(--red)';return `<span class="chance"><span class="segs" style="--c:${col}">${Array.from({length:12},(_,i)=>`<i class="${i<Math.round(c/100*12)?'on':''}"></i>`).join('')}</span><span class="num">${c} %</span></span>`};
const srcPill=p=>SRC[p.source]?`<span class="pill ${SRC[p.source].c}">${SRC[p.source].t}</span>`:'';
const stPill=k=>`<span class="pill st-${k}">${etapeT(k)}</span>`;
const tempTag=p=>p.etape==='r2'&&!p.offre_prete?'<span class="tag warn">offre à préparer</span>':'';
const avc=p=>({prepa:'g',ig:'n',yt:'a',bao:'b'})[p.source]||'n';
const num=(v,suf='')=>`<span class="big num" data-count="${v}" data-suf="${suf}">${(+v||0).toLocaleString('fr-FR')}${suf}</span>`;
const countUp=()=>{if(reduced)return;document.querySelectorAll('[data-count]').forEach(el=>{const end=+el.dataset.count,suf=el.dataset.suf||'',t0=performance.now(),dur=600;const step=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=Math.round(end*e).toLocaleString('fr-FR')+suf;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)})};
const wa=(tel,msg)=>{const t=String(tel||'').replace(/\D/g,'');const n=t.startsWith('0')?'33'+t.slice(1):t;return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`};
const igUrl=h=>'https://instagram.com/'+String(h||'').replace('@','');

function nav(tab){
  const n=late().length;
  if(tab)return Object.keys(TABS).map(k=>{const v=VIEWS.find(x=>x.k===k);return `<a href="#${k}" ${route===k?'aria-current="page"':''}>${ICON[v.i]}<span>${TABS[k]}</span>${k==='crm'&&n?`<span class="n">${n}</span>`:''}</a>`}).join('');
  const counts={prospection:S.ig.filter(x=>!x.fait).length,crm:open_().length,athletes:S.athletes.length,agenda:S.agenda.filter(e=>diff(e.d)>=0&&diff(e.d)<7).length};
  return VIEWS.map(v=>`<a href="#${v.k}" ${route===v.k?'aria-current="page"':''}>${ICON[v.i]}<span>${v.t}</span>${v.k==='crm'&&n?`<span class="n alert">${n}</span>`:counts[v.k]?`<span class="n">${counts[v.k]}</span>`:''}</a>`).join('')+
  `<div class="sec">Pipeline</div>`+ETAPES.slice(0,5).map(e=>`<a href="#crm" data-f="${e.k}"><i class="dot" style="background:${COL[e.k]}"></i><span>${e.t}</span><span class="n">${S.prospects.filter(p=>p.etape===e.k).length}</span></a>`).join('')+
  `<div class="sec">Réglages</div><a href="#reglages" ${route==='reglages'?'aria-current="page"':''}>${ICON.settings}<span>Objectif, offres, messages</span></a>`;
}
function topbar(title){
  return `<img class="mlogo" src="logo.png" alt=""><h1>${title}</h1><span class="spacer"></span><a class="ic" href="#reglages" aria-label="Réglages">${ICON.settings}</a><button class="ic" data-logout aria-label="Se déconnecter" title="Se déconnecter">${ICON.out}</button><span class="me"><span class="av">${ini(S.user||'C')}</span><span>${esc(prenom(S.user||'Coach'))}</span></span>`;
}
function todayBlock(){
  const dmPct=Math.min(100,Math.round(dmToday()/OBJ_DM()*100)),todo=late(),st=streak();
  return `<div class="today"><svg class="ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="#1c1c22" stroke-width="3"/><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--red)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${dmPct*0.974} 100" transform="rotate(-90 18 18)"/><text x="18" y="21.5" text-anchor="middle" font-size="9" font-weight="600" fill="var(--fg)">${dmPct}%</text></svg>
    <div><b class="big num">${dmToday()} / ${OBJ_DM()}</b><small>DM envoyés aujourd'hui</small><div class="streak"><img src="logo.png" alt="">${st?st+' jour'+(st>1?'s':'')+" d'affilée à l'objectif":"la série commence aujourd'hui"}</div></div>
    <div style="flex:1 1 140px;min-width:0;display:flex;flex-direction:column;gap:4px"><div class="line" style="padding:0;border:0"><span class="l">Relances en retard</span><span class="r num" style="color:${todo.length?'var(--red)':'var(--muted)'}">${todo.length}</span></div><div class="line" style="padding:0;border:0"><span class="l">R1 / R2 cette semaine</span><span class="r num">${S.agenda.filter(e=>e.k==='meet'&&diff(e.d)>=0&&diff(e.d)<7).length}</span></div><div class="line" style="padding:0;border:0"><span class="l">Comptes à contacter</span><span class="r num">${S.ig.filter(x=>!x.fait).length}</span></div></div></div>`;
}

// ---------- vues ----------
function vDash(){
  const enc=encMois(), pct=Math.min(100,Math.round(enc/OBJ()*100));
  const pipe=S.prospects.filter(p=>['r1','r2'].includes(p.etape)), pipeV=pipe.reduce((s,p)=>s+p.montant,0);
  const g=S.prospects.filter(p=>p.etape==='gagne').length,l=S.prospects.filter(p=>p.etape==='perdu').length;
  const leads7=S.prospects.filter(p=>diff(p.created_at.slice(0,10))>=-7).length;
  const todo=late(), H=hist12(), vals=H.map(x=>x.v), mx=Math.max(OBJ()*1.2,...vals,1);
  const objSeg=Math.max(1,Math.round(OBJ()/mx*14));
  const led=vals.map((v,i)=>{const n=Math.round(v/mx*14);return `<div class="col ${i===11?'cur':''}">${Array.from({length:14},(_,s)=>`<i class="seg ${s<n?'on':''} ${s===objSeg-1?'obj':''}" style="animation-delay:${(i*14+s)*4}ms"></i>`).join('')}</div>`}).join('');
  const srcs=Object.keys(SRC).map(k=>({k,n:S.prospects.filter(p=>p.source===k).length,w:S.prospects.filter(p=>p.source===k&&p.etape==='gagne').length})).sort((a,b)=>b.n-a.n);
  const smax=Math.max(1,...srcs.map(s=>s.n));
  const renouv=S.athletes.filter(a=>a.fin&&diff(a.fin)<=14).sort((a,b)=>a.fin.localeCompare(b.fin));
  const lignes=[...open_()].sort((a,b)=>(chance(b)*b.montant)-(chance(a)*a.montant)).slice(0,6);
  const pub=S.videos.filter(v=>v.statut===4).map(v=>({...v,ins:S.leadsBy[v.slug]||0,clics:S.clics[v.slug]||0})).sort((a,b)=>b.ins-a.ins).slice(0,3);
  const nR2=S.prospects.filter(p=>p.etape==='r2'&&!p.offre_prete).length;
  return `
  <div class="kpis">
    <div class="kpi"><span class="lab">${ICON.sales}Encaissé ce mois<span class="tag up">${pct} %</span></span><span class="val">${num(enc,' €')}${sparkSVG(vals.slice(-8))}</span><span class="sub">objectif ${eur(OBJ())} · paiements en une fois</span></div>
    <div class="kpi"><span class="lab">${ICON.crm}En jeu<span class="tag neutral">${pipe.length} R1 et R2 en cours</span></span><span class="val">${num(pipeV,' €')}</span><span class="sub">${nR2} offre${nR2>1?'s':''} à préparer avant le R2</span></div>
    <div class="kpi"><span class="lab">${ICON.links}Nouveaux prospects · 7 j<span class="tag up">+${leads7}</span></span><span class="val">${num(leads7)}</span><span class="sub">vidéos, Instagram, bouche-à-oreille</span></div>
    <div class="kpi"><span class="lab">${ICON.prosp}Relances en retard<span class="tag ${todo.length?'bad':'up'}">${todo.length?'à faire':'à jour'}</span></span><span class="val">${num(todo.length)}</span><span class="sub">${g} signé${g>1?'s':''} sur ${g+l} décision${g+l>1?'s':''}${g+l?' · '+Math.round(g/(g+l)*100)+' %':''}</span></div>
  </div>
  <div class="split first">
    <section class="block"><div class="bh"><h2>Aujourd'hui</h2><span class="sub">${T0.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</span><span class="right"><a class="btn sm" href="#prospection">Prospecter</a><a class="btn sm" href="#agenda">Agenda</a></span></div>
      ${todayBlock()}
      <div class="agenda" style="margin-top:14px">${dayEv(TODAY).slice(0,6).map(e=>`<div class="ev ${e.k}"><span class="h">${e.h||'—'}</span><span class="bar"></span><span style="min-width:0"><span class="t">${esc(e.t)}</span><br><span class="s">${esc(e.s)}</span></span>${e.k==='meet'&&e.pid?`<button class="btn sm" data-open="${e.pid}">Fiche</button>`:''}</div>`).join('')||'<p class="empty">Rien dans l\'agenda aujourd\'hui. Dicte une tâche depuis l\'Agenda.</p>'}</div>
    </section>
    <section class="block"><div class="bh"><h2>À relancer</h2><span class="right"><a class="btn sm" href="#crm">Tout le CRM</a></span></div>
      <div class="lines">${todo.length?todo.map(p=>`<div class="line"><span class="l"><button class="name" data-open="${p.id}" style="font-weight:500">${esc(p.prenom)}</button><small>${esc(p.action||'')} · ${etapeT(p.etape)}</small></span><span class="r"><span class="tag ${diff(p.next_date)<0?'bad':'warn'}">${rel(p.next_date)}</span></span></div>`).join(''):'<p class="empty">Rien en retard.</p>'}</div>
      <div class="bh" style="margin-top:18px"><h2>Renouvellements</h2><span class="right"><a class="btn sm" href="#athletes">Athlètes</a></span></div>
      <div class="lines">${renouv.length?renouv.map(a=>`<div class="line"><span class="l">${esc(a.prenom)}<small>${esc(a.offre||'')} · fin le ${fmtS(a.fin)}</small></span><span class="r"><span class="tag ${diff(a.fin)<=7?'bad':'warn'}">J-${diff(a.fin)}</span></span></div>`).join(''):'<p class="empty">Rien dans les 14 jours.</p>'}</div>
    </section>
  </div>
  <div class="split">
    <section class="block"><div class="bh"><h2>Chiffre d'affaires</h2><span class="right"><span class="badge plain">12 mois</span></span></div>
      <div class="bignum">${num(vals.reduce((a,b)=>a+b,0),' €')}</div><small>trait ambre = objectif mensuel</small>
      <div class="led">${led}</div><div class="ledx">${H.map((x,i)=>`<span class="${i===11?'cur':''}">${x.m}</span>`).join('')}</div>
    </section>
    <section class="block"><div class="bh"><h2>D'où viennent les prospects</h2><span class="right sub">${S.prospects.length} au total</span></div>
      <div class="bignum">${num(srcs[0].n)} <span style="font-size:14px;color:var(--muted);font-weight:500;font-family:var(--font)">via ${SRC[srcs[0].k].t.toLowerCase()}</span></div><small>la source qui ramène le plus</small>
      <div class="lines" style="margin-top:14px">${srcs.map(s=>`<div class="line"><span class="l">${SRC[s.k].t}</span><span class="r num">${s.n} · ${s.w} signé${s.w>1?'s':''}</span><span class="meter"><i class="${s.k===srcs[0].k?'hot':''}" style="width:${s.n/smax*100}%"></i></span></div>`).join('')}</div>
      <div class="bh" style="margin-top:18px"><h2>Vidéos qui ramènent le plus</h2><span class="right"><a class="btn sm" href="#videos">Vidéos</a></span></div>
      <div class="lines">${pub.length?pub.map(v=>`<div class="line"><span class="l" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.titre)}</span><span class="r num">${v.ins} inscrit${v.ins>1?'s':''}${v.clics?' · '+Math.round(v.ins/v.clics*100)+' %':''}</span></div>`).join(''):'<p class="empty">Aucune vidéo publiée avec un lien.</p>'}</div>
    </section>
  </div>
  <section class="block"><div class="bh"><h2 class="t">Prospects chauds</h2><span class="badge plain">${open_().length}</span><span class="sub">triés par ce qu'ils valent</span><span class="right"><a class="btn sm" href="#crm">Voir le CRM</a><button class="btn sm primary" data-add>+ Nouveau prospect</button></span></div>
    ${lignes.length?tableHTML(lignes):'<p class="empty">Aucun prospect en cours. Ajoute-en un, ou attends les inscrits de tes vidéos.</p>'}
  </section>`;
}
function tableHTML(list){
  return `<div class="tw"><table><thead><tr><th>Prospect</th><th>Source et étape</th><th>Objectif</th><th class="r">Offre</th><th>Chances de signer</th><th>Activité</th><th>Prochaine action</th></tr></thead><tbody>
  ${list.map(p=>`<tr class="row" data-open="${p.id}"><td><span class="who"><span class="av ${avc(p)}">${ini(p.prenom)}</span><span class="name">${esc(p.prenom)}</span></span></td><td><span class="pills">${srcPill(p)}${stPill(p.etape)}${tempTag(p)}</span></td><td style="color:var(--muted);max-width:240px;overflow:hidden;text-overflow:ellipsis">${esc(p.objectif||'')}</td><td class="r num">${eur(p.montant)}</td><td>${chanceHTML(chance(p))}</td><td>${sparkSVG(actOf(p),'mini')}</td><td class="date">${p.next_date&&!['gagne','perdu'].includes(p.etape)?`<b>${fmtS(p.next_date)}</b> · ${esc(p.action||'')}${diff(p.next_date)<0?' <span class="tag bad">retard</span>':diff(p.next_date)===0?' <span class="tag warn">aujourd\'hui</span>':''}`:p.etape==='gagne'?'<span class="tag up">Signé</span>':'<span style="color:var(--dim)">—</span>'}</td></tr>`).join('')}</tbody></table></div>
  <div class="mlist">${list.map(p=>`<button class="mrow" data-open="${p.id}"><span class="t">${esc(p.prenom)}</span><span class="e num">${eur(p.montant)}</span><span class="s">${SRC[p.source]?SRC[p.source].t+' · ':''}${p.next_date&&!['gagne','perdu'].includes(p.etape)?fmtS(p.next_date)+' · '+esc(p.action||''):etapeT(p.etape)}</span><span class="p">${stPill(p.etape)}</span></button>`).join('')}</div>`;
}
function vCRM(){
  const list=filtre==='all'?[...S.prospects].sort((a,b)=>{const A=['gagne','perdu'].includes(a.etape),B=['gagne','perdu'].includes(b.etape);if(A!==B)return A?1:-1;return (a.next_date||'9').localeCompare(b.next_date||'9')}):S.prospects.filter(p=>p.etape===filtre);
  return `<section class="block"><div class="bh"><h2 class="t">Prospects</h2><span class="badge plain">${list.length}</span><span class="right"><button class="btn sm primary" data-add>+ Nouveau prospect</button></span></div>
  <div class="pills" style="gap:6px;margin-bottom:14px"><button class="btn sm ${filtre==='all'?'on':''}" data-filtre="all">Tous</button>${ETAPES.map(e=>`<button class="btn sm ${filtre===e.k?'on':''}" data-filtre="${e.k}">${e.t} <span class="num" style="opacity:.6">${S.prospects.filter(p=>p.etape===e.k).length}</span></button>`).join('')}</div>
  ${list.length?tableHTML(list):'<p class="empty">Personne ici pour l\'instant.</p>'}</section>`;
}
function vProsp(){
  const rest=S.ig.filter(x=>!x.fait).length;
  const w7=k=>diff(k)>-7;
  const dm7=Object.entries(S.dm).filter(([k])=>w7(k)).reduce((s,[,v])=>s+v,0);
  const rep7=S.ig.filter(x=>x.repondu&&x.fait_le&&w7(x.fait_le)).length;
  const num7=S.prospects.filter(p=>p.source==='ig'&&w7(p.created_at.slice(0,10))).length;
  const app7=S.agenda.filter(e=>e.k==='meet'&&w7(e.d)&&diff(e.d)<=0).length;
  const stats=[{t:'DM envoyés',n:dm7},{t:'Réponses',n:rep7},{t:'Numéros',n:num7},{t:'Appels',n:app7}];
  const todoList=S.ig.filter(x=>!x.fait).concat(S.ig.filter(x=>x.fait&&x.fait_le===TODAY));
  const sc=(i)=>S.scripts[i]?S.scripts[i].texte:'';
  return `
  <div class="kpis">${stats.map((s,i)=>`<div class="kpi"><span class="lab">${s.t}${i?`<span class="tag neutral">${stats[i-1].n?Math.round(s.n/stats[i-1].n*100)+' %':'—'}</span>`:'<span class="tag up">7 jours</span>'}</span><span class="val">${num(s.n)}</span><span class="sub">${i?'du niveau précédent':'cette semaine'}</span></div>`).join('')}</div>
  <div class="split">
    <section class="block"><div class="bh"><h2 class="t">À contacter aujourd'hui</h2><span class="badge plain">${rest} restant${rest>1?'s':''}</span><span class="right"><button class="btn sm" data-addig>+ Ajouter un @</button></span></div>
      ${todayBlock()}
      <div class="lines" style="margin-top:14px">${todoList.length?todoList.map(x=>`<div class="todo ${x.fait?'done':''}"><button class="cb" data-ig="${x.id}" aria-label="Contacté"></button><span style="min-width:0"><span class="t">@${esc(x.handle)}</span><br><span class="s">${esc(x.provenance||'')}</span></span><span class="quick"><span class="tag ${x.chaud?'bad':'neutral'}">${x.chaud?'chaud':'tiède'}</span>${x.fait?`<button class="btn sm ${x.repondu?'on':''}" data-rep="${x.id}">${x.repondu?'A répondu':'Répondu ?'}</button>`:''}<a class="btn sm" href="${igUrl(x.handle)}" target="_blank" rel="noopener" aria-label="Ouvrir sur Instagram">${ICON.ig}</a><button class="btn sm" data-copy="${esc(fill(sc(x.chaud?1:0),{prenom:x.handle.split(/[._]/)[0].replace(/^./,c=>c.toUpperCase())}))}">Copier le DM</button><button class="btn sm" data-igprospect="${x.id}" title="En faire un prospect">→ CRM</button></span></div>`).join(''):'<p class="empty">Liste vide. Ajoute les @ des gens qui ont liké, commenté ou répondu à ta story.</p>'}</div>
    </section>
    <section class="block"><div class="bh"><h2>Messages types</h2><span class="sub">{prénom} se remplit tout seul</span></div>
      <div class="scripts">${S.scripts.map(s=>`<div class="script"><b>${esc(s.titre)}</b><p>${esc(s.texte)}</p><button class="btn sm" data-copy="${esc(s.texte)}">Copier</button></div>`).join('')}</div>
      <div class="bh" style="margin-top:18px"><h2>À relancer sur Instagram</h2></div>
      <div class="lines">${open_().filter(p=>p.source==='ig').map(p=>`<div class="line"><span class="l"><button data-open="${p.id}" style="font-weight:500">${p.insta?'@'+esc(p.insta):esc(p.prenom)}</button><small>${esc(p.prenom)} · ${etapeT(p.etape)}</small></span><span class="r">${p.next_date?`<span class="tag ${diff(p.next_date)<=0?'bad':'neutral'}">${rel(p.next_date)}</span>`:''}</span></div>`).join('')||'<p class="empty">Personne pour l\'instant.</p>'}</div>
    </section>
  </div>`;
}
function vVideos(){
  const all=S.videos.map(v=>({...v,ins:S.leadsBy[v.slug]||0,clics:S.clics[v.slug]||0}));
  const pub=all.filter(v=>v.statut===4),tc=pub.reduce((s,v)=>s+v.clics,0),ti=pub.reduce((s,v)=>s+v.ins,0);
  const rows=[...pub].sort((a,b)=>b.ins-a.ins||b.clics-a.clics), mx=Math.max(1,...rows.map(v=>v.clics));
  const enCours=all.filter(v=>v.statut<4);
  const steps=v=>`<span class="vstep" title="${STEPS[v.statut-1]}">${STEPS.map((_,i)=>`<i class="${i<v.statut?'on':''}"></i>`).join('')}</span>`;
  const link=v=>`${C.site}/go/${v.slug}`;
  return `
  <div class="kpis"><div class="kpi"><span class="lab">Clics sur les liens<span class="tag up">total</span></span><span class="val">${num(tc)}</span><span class="sub">toutes vidéos</span></div><div class="kpi"><span class="lab">Inscrits au lead magnet<span class="tag up">${tc?Math.round(ti/tc*100)+' %':'—'}</span></span><span class="val">${num(ti)}</span><span class="sub">ont laissé numéro + email</span></div><div class="kpi"><span class="lab">Devenus prospects</span><span class="val">${num(S.prospects.filter(p=>p.source==='prepa').length)}</span><span class="sub">arrivés dans le CRM</span></div><div class="kpi"><span class="lab">Signés via une vidéo</span><span class="val">${num(S.prospects.filter(p=>p.source==='prepa'&&p.etape==='gagne').length)}</span><span class="sub">${eur(S.prospects.filter(p=>p.source==='prepa'&&p.etape==='gagne').reduce((s,p)=>s+p.montant,0))} encaissés</span></div></div>
  <section class="block"><div class="bh"><h2 class="t">Vidéos publiées</h2><span class="sub">un lien par vidéo, à coller en description · tous mènent à « Prépare ta perf »</span></div>
    <div class="tw"><table><thead><tr><th>Lien</th><th>Vidéo</th><th>Publiée</th><th class="r">Clics</th><th></th><th class="r">Inscrits</th><th class="r">Taux</th><th></th></tr></thead><tbody>
    ${rows.map(v=>`<tr><td class="mono">/go/${esc(v.slug)}</td><td>${esc(v.titre)}</td><td class="date num">${v.publiee_le?fmtS(v.publiee_le):'—'}</td><td class="r num">${v.clics}</td><td style="width:140px"><span class="meter" style="display:block;width:120px"><i class="${v===rows[0]?'hot':''}" style="width:${v.clics/mx*100}%"></i></span></td><td class="r num">${v.ins}</td><td class="r num">${v.clics?Math.round(v.ins/v.clics*100)+' %':'—'}</td><td class="r"><button class="btn sm" data-copy="${link(v)}">Copier le lien</button></td></tr>`).join('')||'<tr><td colspan="8" class="empty">Aucune vidéo publiée.</td></tr>'}</tbody></table></div>
    <div class="mlist">${rows.map(v=>`<div class="mrow"><span class="t mono">/go/${esc(v.slug)}</span><span class="e num">${v.ins} inscrit${v.ins>1?'s':''}</span><span class="s">${esc(v.titre)}</span><span class="p"><button class="btn sm" data-copy="${link(v)}">Copier · ${v.clics} clics</button></span></div>`).join('')||'<p class="empty">Aucune vidéo publiée.</p>'}</div>
  </section>
  <section class="block"><div class="bh"><h2 class="t">En préparation</h2><span class="sub">idée → tournée → montée → publiée · le lien existe dès la publication</span><span class="right"><button class="btn sm primary" data-newvideo>+ Idée de vidéo</button></span></div>
    <div class="lines">${enCours.map(v=>`<div class="line"><span class="l">${esc(v.titre)}<small>${STEPS[v.statut-1]} · lien /go/${esc(v.slug)}</small></span><span class="r" style="display:flex;gap:10px;align-items:center">${steps(v)}<button class="btn sm" data-vstep="${esc(v.slug)}">${v.statut===3?'Publier':'Étape suivante'}</button></span></div>`).join('')||'<p class="empty">Aucune vidéo en préparation.</p>'}</div>
  </section>
  <section class="block"><div class="bh"><h2>Derniers inscrits</h2><span class="sub">arrivent tout seuls dans le CRM en « Nouveau »</span></div>
    <div class="lines">${S.leads.slice(0,8).map(l=>{const p=S.prospects.find(x=>x.id===l.prospect_id);return `<div class="line"><span class="l">${p?`<button data-open="${p.id}" style="font-weight:500">${esc(p.prenom)}</button>`:esc(l.email||l.tel||'?')}<small>${fmtS(l.created_at.slice(0,10))} · via « ${esc(videoT(l.slug))} »</small></span><span class="r">${p?stPill(p.etape):''}</span></div>`}).join('')||'<p class="empty">Pas encore d\'inscrit. Mets un lien /go/ sous une vidéo.</p>'}</div>
  </section>`;
}
function vAth(){
  const rows=[...S.athletes].sort((a,b)=>(a.fin||'9').localeCompare(b.fin||'9'));
  return `<div class="kpis"><div class="kpi"><span class="lab">Athlètes coachés</span><span class="val">${num(S.athletes.length)}</span><span class="sub">en ce moment</span></div><div class="kpi"><span class="lab">Fin d'offre sous 14 j<span class="tag warn">à renouveler</span></span><span class="val">${num(S.athletes.filter(a=>a.fin&&diff(a.fin)<=14).length)}</span><span class="sub">proposer la suite avant la fin</span></div><div class="kpi"><span class="lab">Sans séance depuis 5 j<span class="tag bad">à relancer</span></span><span class="val">${num(S.athletes.filter(a=>a.derniere_seance&&diff(a.derniere_seance)<=-5).length)}</span><span class="sub">plus tard : lu depuis LEGACY OS</span></div><div class="kpi"><span class="lab">Valeur des offres en cours</span><span class="val">${num(S.athletes.reduce((s,a)=>s+(a.prix||0),0),' €')}</span><span class="sub">déjà encaissée</span></div></div>
  <section class="block"><div class="bh"><h2 class="t">Athlètes</h2><span class="right"><button class="btn sm" data-addath>+ Athlète</button></span></div>
  <div class="tw"><table><thead><tr><th>Athlète</th><th>Offre</th><th>Début</th><th>Fin</th><th class="r">Reste</th><th>Dernière séance</th><th></th></tr></thead><tbody>${rows.map(a=>{const r=a.fin?diff(a.fin):null,s=a.derniere_seance?diff(a.derniere_seance):null;return `<tr><td><span class="who"><span class="av g">${ini(a.prenom)}</span><span class="name">${esc(a.prenom)}</span></span></td><td>${esc(a.offre||'')}</td><td class="num date">${a.debut?fmtS(a.debut):'—'}</td><td class="num date">${a.fin?fmtS(a.fin):'—'}</td><td class="r">${r===null?'—':`<span class="tag ${r<=7?'bad':r<=14?'warn':'up'}">${r} j</span>`}</td><td style="color:${s!==null&&s<=-5?'var(--red)':'var(--muted)'}">${a.derniere_seance?rel(a.derniere_seance):'—'} <button class="btn sm" data-seance="${a.id}" title="Séance faite aujourd'hui">✓ auj.</button></td><td class="r">${r!==null&&r<=14?`<button class="btn sm" data-renew="${a.id}">Renouveler</button>`:''}</td></tr>`}).join('')||'<tr><td colspan="7" class="empty">Aucun athlète. Ils arrivent ici quand un prospect signe.</td></tr>'}</tbody></table></div>
  <div class="mlist">${rows.map(a=>`<div class="mrow"><span class="t">${esc(a.prenom)}</span><span class="e">${a.fin?`<span class="tag ${diff(a.fin)<=7?'bad':diff(a.fin)<=14?'warn':'up'}">J-${diff(a.fin)}</span>`:''}</span><span class="s">${esc(a.offre||'')} · séance ${a.derniere_seance?rel(a.derniere_seance):'—'}</span><span class="p"><button class="btn sm" data-seance="${a.id}">✓ séance auj.</button></span></div>`).join('')||'<p class="empty">Aucun athlète.</p>'}</div></section>`;
}
function vVentes(){
  const enc=encMois(), rows=[...S.ventes].sort((a,b)=>b.date.localeCompare(a.date)), af=S.ventes.filter(v=>!v.facture).length;
  const tot12=hist12().reduce((s,x)=>s+x.v,0);
  return `<div class="kpis"><div class="kpi"><span class="lab">Encaissé ce mois<span class="tag up">${Math.min(100,Math.round(enc/OBJ()*100))} %</span></span><span class="val">${num(enc,' €')}</span><span class="sub">objectif ${eur(OBJ())}</span></div><div class="kpi"><span class="lab">Sur 12 mois</span><span class="val">${num(tot12,' €')}</span><span class="sub">paiements en une fois</span></div><div class="kpi"><span class="lab">Factures à faire<span class="tag ${af?'bad':'up'}">${af}</span></span><span class="val">${num(af)}</span><span class="sub">PDF : étape 3</span></div><div class="kpi"><span class="lab">Panier moyen</span><span class="val">${num(S.ventes.length?Math.round(S.ventes.reduce((s,v)=>s+v.montant,0)/S.ventes.length):0,' €')}</span><span class="sub">par signature</span></div></div>
  <section class="block"><div class="bh"><h2 class="t">Paiements</h2><span class="right"><button class="btn sm" data-addvente>+ Noter un paiement</button></span></div>
  <div class="tw"><table><thead><tr><th>Date</th><th>Athlète</th><th>Offre</th><th>Mode</th><th class="r">Montant</th><th>Facture</th></tr></thead><tbody>${rows.map(v=>`<tr><td class="num date">${fmtS(v.date)}</td><td class="name">${esc(v.prenom)}</td><td>${esc(v.offre||'')}</td><td><span class="pill ${v.mode==='stripe'?'src-ig':'st-nouveau'}">${esc(v.mode)}</span></td><td class="r num">${eur(v.montant)}</td><td>${v.facture?'<span class="tag up">Envoyée</span>':`<button class="btn sm" data-fact="${v.id}">Marquer envoyée</button>`}</td></tr>`).join('')||'<tr><td colspan="6" class="empty">Aucun paiement noté.</td></tr>'}</tbody></table></div>
  <div class="mlist">${rows.map(v=>`<div class="mrow"><span class="t">${esc(v.prenom)}</span><span class="e num">${eur(v.montant)}</span><span class="s">${fmtS(v.date)} · ${esc(v.offre||'')} · ${esc(v.mode)}</span><span class="p">${v.facture?'<span class="tag up">Facture envoyée</span>':`<button class="btn sm" data-fact="${v.id}">Facture envoyée</button>`}</span></div>`).join('')||'<p class="empty">Aucun paiement noté.</p>'}</div></section>`;
}
function vAgenda(){
  const mon=monday(wk);
  const days=Array.from({length:7},(_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return iso(x)});
  const J=['lun','mar','mer','jeu','ven','sam','dim'];
  const chip=e=>e.g?`<a class="evc gg" href="${esc(e.url||'#')}" target="_blank" rel="noopener" title="Google Agenda · lecture seule"><span>${e.h?e.h+' · ':''}${esc(e.t)}</span><small>Google${e.e?' · '+e.e:''}</small></a>`:`<${e.k==='meet'&&e.pid?'button data-open="'+e.pid+'"':'button data-ev="'+e.id+'"'} class="evc ${e.k}"><span>${e.h?e.h+' · ':''}${esc(e.t)}</span>${e.s||e.e?`<small>${esc(e.s)}${e.e?' · '+e.e:''}</small>`:''}</button>`;
  const ghost=(dIso,pl)=>`<button class="evc ghost" data-acc="${dIso}|${pl.kind}" title="Ajouter à l'agenda"><span>${pl.h} · ${esc(pl.t)}</span><span>+</span></button>`;
  const nProp=days.reduce((a,x)=>a+propos(x).length,0);
  const sel=days.includes(selDay)?selDay:days[0];
  const dl=dayEv(sel);
  return `<section class="block"><div class="bh"><h2 class="t">Agenda</h2>${gBadge()}
    <span class="right"><button class="btn sm" data-wk="-1" aria-label="Semaine précédente">‹</button><span class="num" style="min-width:120px;text-align:center">${fmtS(days[0])} → ${fmtS(days[6])}</span><button class="btn sm" data-wk="1" aria-label="Semaine suivante">›</button>${wk?'<button class="btn sm" data-wk="0">Aujourd\'hui</button>':''}</span></div>
    <div class="wkhead"><button class="btn sm primary" data-dictee>${ICON.mic} Dicter</button>${nProp?`<button class="btn sm" data-accall>Remplir la semaine · ${nProp} plage${nProp>1?'s':''}</button>`:'<span class="sub">Semaine remplie</span>'}<span class="sub">pointillés = proposé selon tes trous, un clic pour accepter</span></div>
    <div class="strip">${days.map((x,i)=>`<button class="${x===sel?'sel':''} ${x===TODAY?'today':''}" data-day="${x}">${J[i]}<b>${+x.slice(8)}</b>${S.agenda.some(e=>e.d===x)?'<i></i>':''}</button>`).join('')}</div>
    <div class="week">${days.map((x,i)=>`<div class="day ${x===TODAY?'today':''}"><h5><span>${J[i]}</span><b>${+x.slice(8)}</b></h5>${dayEv(x).map(chip).join('')}${propos(x).map(pl=>ghost(x,pl)).join('')}</div>`).join('')}</div>
    <div class="dayview"><div class="agenda">${dl.length?dl.map(e=>`<div class="ev ${e.k}"><span class="h">${e.h||'—'}</span><span class="bar"></span><span style="min-width:0"><span class="t">${esc(e.t)}</span><br><span class="s">${esc(e.s)}${e.e?' · jusqu\'à '+e.e:''}</span></span>${e.g?`<a class="btn sm" href="${esc(e.url||'#')}" target="_blank" rel="noopener">Google</a>`:`<span class="quick">${e.meet?`<a class="btn sm" href="${esc(e.meet)}" target="_blank" rel="noopener">Meet</a>`:''}${e.k==='meet'&&e.pid?`<button class="btn sm" data-open="${e.pid}">Fiche</button>`:`<button class="btn sm" data-ev="${e.id}">…</button>`}</span>`}</div>`).join(''):'<p class="empty">Rien ce jour-là.</p>'}</div>
      ${propos(sel).length?`<div class="lines" style="margin-top:10px">${propos(sel).map(pl=>`<div class="line"><span class="l" style="color:var(--muted)">${pl.h} · ${esc(pl.t)}<small>proposé selon tes trous</small></span><span class="r"><button class="btn sm" data-acc="${sel}|${pl.kind}">Accepter</button></span></div>`).join('')}</div>`:''}</div>
  </section>`;
}
function vReglages(){
  const pl=S.reg.plages||[];
  return `<section class="block"><div class="bh"><h2 class="t">Objectif du jour</h2></div>
    <div class="setrow"><span>DM à envoyer par jour<small>la barre et la série se calent dessus</small></span><span class="stepper"><button data-dm="-5" aria-label="Moins">−</button><span class="num">${OBJ_DM()}</span><button data-dm="5" aria-label="Plus">+</button></span></div>
    <div class="setrow"><span>Plages proposées dans l'agenda<small>${pl.map(p=>`${esc(p.t)} ${p.h} → ${p.e}`).join(' · ')||'—'} · jamais le dimanche</small></span><span class="quick">${pl.map((p,i)=>`<button class="btn sm" data-plage="${i}">${esc(p.kind)} ${p.h}</button>`).join('')}</span></div>
    <div class="setrow"><span>Objectif d'encaissement du mois<small>le trait ambre du graphique</small></span><span class="stepper"><button data-obj="-250" aria-label="Moins">−</button><span class="num">${eur(OBJ())}</span><button data-obj="250" aria-label="Plus">+</button></span></div></section>
  <section class="block"><div class="bh"><h2 class="t">Offres et prix</h2><span class="sub">prix en une fois, jamais de mensualité</span><span class="right"><button class="btn sm" data-addoffre>+ Offre</button></span></div>
    <div class="lines">${S.offres.map(o=>`<div class="line"><span class="l">${esc(o.nom)}<small>${o.jours} jours · ${o.lien_stripe?'<span style="color:var(--green)">lien Stripe ✓</span>':'pas encore de lien Stripe'}</small></span><span class="r quick"><span class="num" style="color:var(--fg)">${eur(o.prix)}</span>${o.lien_stripe?'':`<button class="btn sm primary" data-mklien="${o.id}">Créer le lien Stripe</button>`}<button class="btn sm" data-editoffre="${o.id}">Modifier</button><button class="btn sm" data-deloffre="${o.id}" aria-label="Supprimer">✕</button></span></div>`).join('')||'<p class="empty">Aucune offre.</p>'}</div></section>
  <section class="block"><div class="bh"><h2 class="t">Services dans l'offre</h2><span class="sub">tout ce que tu peux proposer · pour chaque prospect, tu décoches au R2</span><span class="right"><button class="btn sm" data-addsvc>+ Service</button></span></div>
    <div class="lines">${SERVICES().map((s,i)=>`<div class="line"><span class="l">${esc(s)}</span><span class="r"><button class="btn sm" data-delsvc="${i}" aria-label="Supprimer">✕</button></span></div>`).join('')}</div></section>
  <section class="block"><div class="bh"><h2 class="t">Messages types</h2><span class="sub">{prénom} et {vidéo} se remplissent tout seuls</span><span class="right"><button class="btn sm" data-addscript>+ Message</button></span></div>
    <div class="lines">${S.scripts.map(s=>`<div class="line"><span class="l">${esc(s.titre)}<small style="white-space:normal">${esc(s.texte)}</small></span><span class="r quick"><button class="btn sm" data-editscript="${s.id}">Modifier</button><button class="btn sm" data-delscript="${s.id}" aria-label="Supprimer">✕</button></span></div>`).join('')}</div></section>
  <section class="block"><div class="bh"><h2 class="t">Comptes reliés</h2></div>
    <div class="lines"><div class="line"><span class="l">Supabase<small>ta base de données</small></span><span class="r"><span class="tag up">Relié</span></span></div><div class="line"><span class="l">Google Agenda + Meet<small>${!G.cid?'ID client Google à ajouter dans config.js':G.on?'R1, R2 et séances envoyés dans ton agenda avec un lien Meet':'tes appels créent un événement Google avec lien Meet'}</small></span><span class="r quick">${!G.cid?'<span class="tag neutral">À configurer</span>':G.on?'<span class="tag up">Relié</span><button class="btn sm" data-gout>Déconnecter</button>':'<button class="btn sm primary" data-gconnect>Connecter Google Agenda</button>'}</span></div><div class="line"><span class="l">Stripe<small>${stripeEtat()} · ${S.offres.filter(o=>o.lien_stripe).length} offre${S.offres.filter(o=>o.lien_stripe).length>1?'s':''} sur ${S.offres.length} avec un lien</small></span><span class="r">${STRIPE.ok===null?`<span class="tag neutral">${STRIPE.err?'Non vérifié':'Vérification…'}</span>`:STRIPE.ok?`<span class="tag up">Relié${STRIPE.test?' · mode test':''}</span>`:'<span class="tag bad">Clé manquante</span>'}</span></div><div class="line"><span class="l">LEGACY OS<small>dernière séance de chaque athlète</small></span><span class="r"><span class="tag neutral">Plus tard</span></span></div></div>
    <p class="empty" style="margin-top:12px">Connecté en tant que ${esc(S.user||'')}. <button class="btn sm" data-logout>Se déconnecter</button></p>
    <div class="setrow"><span>Mot de passe<small>pour te connecter sans attendre un email (2 emails par heure maximum)</small></span><span><button class="btn sm" data-setpass>Définir un mot de passe</button></span></div></section>`;
}

function render(){
  if(G.on)gLoad(monday(route==='agenda'?wk:0));
  if(route==='reglages')stripePing();
  $('nav').innerHTML=nav(false); $('tabbar').innerHTML=nav(true);
  $('topbar').innerHTML=topbar(TITLES[route]);
  $('footpct').textContent=Math.min(100,Math.round(encMois()/OBJ()*100))+' %';
  $('view').innerHTML=({dashboard:vDash,prospection:vProsp,crm:vCRM,videos:vVideos,athletes:vAth,ventes:vVentes,agenda:vAgenda,reglages:vReglages})[route]();
}

// ---------- fiche / panneaux ----------
const sheet=$('sheet'),scrim=$('scrim');
function showSheet(h){sheet.innerHTML=h;sheet.classList.add('on');scrim.classList.add('on');sheet.setAttribute('aria-hidden','false')}
function closeSheet(){sheet.classList.remove('on');scrim.classList.remove('on');sheet.setAttribute('aria-hidden','true');sheetId=null}
const X='<button class="ic" data-close aria-label="Fermer" style="margin-left:auto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
let tt;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2400)}
function flash(p){const f=$('flash');$('flashname').textContent=p.prenom;$('flashsub').textContent=`${p.offre||''} · ${eur(p.montant)}`;f.classList.add('on');f.setAttribute('aria-hidden','false');setTimeout(()=>{f.classList.remove('on');f.setAttribute('aria-hidden','true')},reduced?600:1700)}
const P=()=>S.prospects.find(x=>x.id===sheetId);
async function addNote(p,t){const n=await ins('notes',{prospect_id:p.id,texte:t});(S.notes[p.id]=S.notes[p.id]||[]).unshift({d:n.created_at.slice(0,10),t,id:n.id})}

function openSheet(pid){
  const p=S.prospects.find(x=>x.id===pid);if(!p)return;sheetId=p.id;
  const i=ETAPES.findIndex(e=>e.k===p.etape),nxt=ETAPES[i+1],ouvert=!['gagne','perdu'].includes(p.etape);
  const si=p.video_slug&&p.etape==='nouveau'?2:p.etape==='nouveau'?0:p.etape==='contacte'?3:p.etape==='r1'?5:5;
  const scr=S.scripts[si]||S.scripts[0]||{titre:'message',texte:'Salut {prénom} !'};
  const msg=fill(scr.texte,p);
  const SL=slots();
  showSheet(`
  <div class="sh"><div class="avb">${ini(p.prenom)}</div><div style="min-width:0"><h3>${esc(p.prenom)}</h3><span class="pills">${srcPill(p)}${stPill(p.etape)}${tempTag(p)}</span></div>${X}</div>
  <div class="sb">
    <div class="g"><div class="quick">${p.tel?`<a class="btn sm" href="${wa(p.tel,msg)}" target="_blank" rel="noopener">${ICON.wa} WhatsApp</a>`:''}${p.insta?`<a class="btn sm" href="${igUrl(p.insta)}" target="_blank" rel="noopener">${ICON.ig} Instagram</a>`:''}<button class="btn sm" data-copy="${esc(msg)}">Copier « ${esc(scr.titre)} »</button><button class="btn sm" data-edit>Modifier la fiche</button></div></div>
    ${ouvert?`<div class="g"><div class="nextact"><div class="a"><span>${esc(p.action||NEXT[p.etape]||'')}</span><span class="tag ${p.next_date&&diff(p.next_date)<0?'bad':p.next_date&&diff(p.next_date)===0?'warn':'neutral'}">${p.next_date?rel(p.next_date):'—'}</span></div><div class="acts"><button class="btn sm" data-done>Fait</button><button class="btn sm" data-push="2">+2 j</button><button class="btn sm" data-push="7">+1 sem.</button>${['nouveau','contacte','r1'].includes(p.etape)?`<button class="btn sm" data-slots>Caler le ${p.etape==='r1'?'R2':'R1'}</button>`:''}</div><div class="slots" id="slots" hidden>${SL.map((s,k)=>`<button class="btn sm" data-meet="${s.d}|${s.h}">${fmtJ(s.d)} · ${s.h}</button>`).join('')}<button class="btn sm" data-meetcustom>Autre créneau…</button></div></div></div>`:''}
    <div class="g"><h4>Chances de signer</h4><div class="slider"><input type="range" id="ch-${p.id}" min="5" max="95" step="5" value="${chance(p)}" data-chance ${ouvert?'':'disabled'}><span id="chv-${p.id}">${chanceHTML(chance(p))}</span></div></div>
    <div class="g"><h4>Contact</h4><dl class="kv"><dt>Instagram</dt><dd>${p.insta?'@'+esc(p.insta):'<span style="color:var(--dim)">—</span>'}</dd><dt>Téléphone</dt><dd>${p.tel?`<code>${esc(p.tel)}</code> <button class="btn sm" data-copy="${esc(p.tel)}" style="margin-left:6px">Copier</button>`:'<span style="color:var(--dim)">—</span>'}</dd><dt>Email</dt><dd>${esc(p.email||'—')}</dd><dt>Objectif</dt><dd>${esc(p.objectif||'—')}</dd><dt>Source</dt><dd>${SRC[p.source]?SRC[p.source].t:'—'}${p.video_slug?' · « '+esc(videoT(p.video_slug))+' »':''}</dd></dl></div>
    <div class="g"><h4>Offre · du R1 au R2</h4><dl class="kv"><dt>Formule</dt><dd><select id="of-${p.id}" class="inp" data-offre>${S.offres.map(o=>`<option value="${o.id}" ${o.nom===p.offre||(!p.offre&&o.prix===p.montant)?'selected':''}>${esc(o.nom)} · ${eur(o.prix)}</option>`).join('')}</select></dd>
      <dt>Vidéo d'offre</dt><dd>${p.vid_envoyee?`<span class="tag up">Envoyée${p.vid_vue?' · regardée':''}</span>`:ouvert?`<button class="btn sm" data-vid>Marquer envoyée</button>`:'<span style="color:var(--dim)">—</span>'}</dd>
      <dt>Offre perso</dt><dd>${p.offre_prete?`<span class="quick"><span class="tag up">Prête · ${eur(p.montant)}</span><button class="btn sm" data-present>Présenter en visio</button><button class="btn sm" data-prep>Modifier</button></span>`:ouvert?`<button class="btn sm" data-prep>Préparer l'offre</button>`:'<span style="color:var(--dim)">—</span>'}</dd>
      <dt>Récap + contrat</dt><dd>${p.etape==='gagne'?'<span class="tag up">Signé · payé</span>':p.recap_envoye?'<span class="tag warn">Envoyés · en attente</span>':p.offre_prete?`<button class="btn sm" data-sent>Marquer envoyés</button>`:'<span style="color:var(--dim)">après le R2</span>'}</dd>
      ${ouvert?`<dt>Paiement</dt><dd><span class="quick">${offreOf(p).lien_stripe?'<button class="btn sm" data-paylink>Envoyer le lien de paiement</button>':'<a class="btn sm" href="#reglages">Ajouter le lien Stripe de l\'offre</a>'}<button class="btn sm" data-paysur>Lien sur mesure</button><button class="btn sm" data-paid>Paiement reçu</button></span></dd>`:''}
      ${nextMeet(p)?`<dt>Lien Meet</dt><dd><span class="quick"><a class="btn sm" href="${esc(nextMeet(p).meet)}" target="_blank" rel="noopener">Ouvrir</a>${p.tel?`<a class="btn sm" href="${wa(p.tel,`${prenom(p.prenom)}, voici le lien pour notre appel ${fmtJ(nextMeet(p).d)} à ${nextMeet(p).h} : ${nextMeet(p).meet}`)}" target="_blank" rel="noopener">${ICON.wa} Envoyer</a>`:''}<button class="btn sm" data-copy="${esc(nextMeet(p).meet)}">Copier</button></span></dd>`:''}</dl></div>
    <div class="g"><h4>Historique</h4><div style="display:flex;gap:6px;margin-bottom:12px"><input class="inp" id="note-${p.id}" placeholder="Note : appel, DM, objection…"><button class="btn sm" data-note>Ajouter</button></div><div class="tl">${notesOf(p).map(n=>`<div><small>${fmtS(n.d)}</small><span>${esc(n.t)}</span></div>`).join('')||'<p class="empty">Aucune note.</p>'}</div></div>
    <div class="g"><button class="btn sm" data-delprospect style="color:var(--dim)">Supprimer ce prospect</button></div>
  </div>
  <div class="sf">${ouvert?`<button class="btn primary" data-move="${nxt.k}">${p.etape==='r2'?'Signé et payé':'Passer à « '+nxt.t+' »'}</button>${p.etape==='r1'?'<button class="btn" data-move="gagne">Signé dès le R1</button>':''}<button class="btn" data-move="perdu">Perdu</button>`:`<button class="btn" data-move="nouveau">Rouvrir</button>`}</div>`);
}
function formSheet(title,fields,submitLabel,onSubmit,extraTop){
  sheetId=null;
  showSheet(`<div class="sh"><div class="avb">+</div><div><h3>${esc(title)}</h3>${extraTop||''}</div>${X}</div>
  <form class="sb form" id="gform">${fields.map(f=>`<div class="field"><label for="g-${f.k}">${esc(f.l)}</label>${f.type==='select'?`<select class="inp" id="g-${f.k}">${f.opts.map(o=>`<option value="${esc(o.v)}" ${o.v===f.v?'selected':''}>${esc(o.t)}</option>`).join('')}</select>`:f.type==='textarea'?`<textarea class="inp" id="g-${f.k}" rows="3" placeholder="${esc(f.ph||'')}">${esc(f.v||'')}</textarea>`:`<input class="inp" id="g-${f.k}" type="${f.type||'text'}" ${f.req?'required':''} placeholder="${esc(f.ph||'')}" value="${esc(f.v||'')}" ${f.type==='tel'?'inputmode="tel"':''}>`}</div>`).join('')}</form>
  <div class="sf"><button class="btn primary" form="gform" type="submit">${esc(submitLabel)}</button></div>`);
  $('gform').addEventListener('submit',async e=>{e.preventDefault();const g={};fields.forEach(f=>g[f.k]=$('g-'+f.k).value.trim());try{await onSubmit(g)}catch(err){console.error(err)}});
  const first=sheet.querySelector('input,select,textarea');first&&first.focus();
}
function openAdd(pre){
  formSheet('Nouveau prospect',[
    {k:'prenom',l:'Prénom et nom',req:true,ph:'Samy Khelifi',v:pre?.prenom||''},
    {k:'insta',l:'Instagram (sans @)',ph:'samy.lift',v:pre?.insta||''},
    {k:'tel',l:'Téléphone',type:'tel',ph:'06 …',v:pre?.tel||''},
    {k:'source',l:'Source',type:'select',opts:Object.keys(SRC).map(k=>({v:k,t:SRC[k].t})),v:pre?.source||'ig'},
    {k:'objectif',l:'Objectif',ph:'1re compète de street lifting'},
    {k:'offre',l:'Offre visée',type:'select',opts:S.offres.map(o=>({v:o.id,t:o.nom+' · '+eur(o.prix)}))},
    {k:'note',l:'Première note',type:'textarea',ph:"Ce qu'il a dit, d'où il vient…"},
  ],'Ajouter au CRM',async g=>{
    const o=S.offres.find(x=>x.id===g.offre)||S.offres[0]||{nom:'',prix:700};
    const p=await ins('prospects',{prenom:g.prenom,insta:g.insta.replace('@',''),tel:g.tel,source:g.source,objectif:g.objectif,etape:'nouveau',montant:o.prix,offre:o.nom,chance:BASE.nouveau,action:NEXT.nouveau,next_date:TODAY});
    S.prospects.unshift(p);S.notes[p.id]=[];await addNote(p,g.note||'Ajouté au CRM.');
    if(pre?.igId){const x=S.ig.find(y=>y.id===pre.igId);if(x)await upd('ig_comptes',x.id,{prospect_id:p.id},x)}
    closeSheet();filtre='all';if(location.hash!=='#crm')location.hash='crm';else render();toast("Prospect ajouté · premier message aujourd'hui")});
}
function openEdit(p){
  formSheet('Modifier la fiche',[
    {k:'prenom',l:'Prénom et nom',req:true,v:p.prenom},{k:'insta',l:'Instagram (sans @)',v:p.insta||''},{k:'tel',l:'Téléphone',type:'tel',v:p.tel||''},{k:'email',l:'Email',type:'email',v:p.email||''},
    {k:'source',l:'Source',type:'select',opts:Object.keys(SRC).map(k=>({v:k,t:SRC[k].t})),v:p.source},{k:'objectif',l:'Objectif',v:p.objectif||''},
  ],'Enregistrer',async g=>{await upd('prospects',p.id,{prenom:g.prenom,insta:g.insta.replace('@',''),tel:g.tel,email:g.email,source:g.source,objectif:g.objectif},p);render();openSheet(p.id);toast('Fiche enregistrée')});
}
async function moveTo(p,k,mode){
  const from=p.etape;
  const patch={etape:k,chance:BASE[k]};
  if(k==='gagne'){patch.next_date=null;patch.action='';patch.paye=true;patch.contrat_signe=true}
  else if(k==='perdu'){patch.next_date=null;patch.action=''}
  else{patch.action=NEXT[k];patch.next_date=p.next_date&&diff(p.next_date)>=0?p.next_date:iso(d(k==='r1'?1:2))}
  await upd('prospects',p.id,patch,p);await addNote(p,`« ${etapeT(from)} » → « ${etapeT(k)} »`);
  if(k==='gagne'){
    const o=S.offres.find(x=>x.nom===p.offre)||S.offres.find(x=>x.prix===p.montant)||{nom:p.offre||'Coaching',prix:p.montant,jours:91};
    const v=await ins('ventes',{date:TODAY,prenom:p.prenom,offre:o.nom,montant:p.montant,mode:mode||'virement',facture:false,prospect_id:p.id});S.ventes.unshift(v);
    const a=await ins('athletes',{prenom:p.prenom,offre:o.nom,prix:p.montant,debut:TODAY,fin:iso(d(o.jours||91)),derniere_seance:null,prospect_id:p.id});S.athletes.push(a);
    closeSheet();flash(p);render();countUp();setTimeout(()=>toast(mode==='stripe'?`${p.prenom} signé · ${eur(p.montant)} payé par Stripe`:`${p.prenom} signé · ${eur(p.montant)} · note le mode de paiement dans Ventes`),reduced?700:1800);return;
  }
  toast(k==='perdu'?`${p.prenom} classé perdu`:`${p.prenom} → ${etapeT(k)}`);render();openSheet(p.id);
}
function openPresent(p){
  const o=S.offres.find(x=>x.nom===p.offre)||S.offres.find(x=>x.prix===p.montant)||{nom:p.offre||'',prix:p.montant,jours:91};
  const choix=selSvc(p);
  const g=S.athletes.slice(0,2);
  const el=$('present');el.hidden=false;
  el.innerHTML=`<div class="pin">
    <div class="ph"><img src="logo.png" alt=""><div><div class="k">OFFRE LEGACY</div><div class="sub" style="color:var(--muted);font-size:12px">préparée pour ${esc(prenom(p.prenom))} · ${fmtS(TODAY)}</div></div><span class="spacer"></span><button class="ic" data-pclose aria-label="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div><h2>${esc(prenom(p.prenom))}, on construit ta legacy.</h2><div class="obj" style="margin-top:8px">Objectif : ${esc(p.objectif||'—')}</div></div>
    <div class="cols"><div><h3>Ce qu'on fait ensemble · ${esc(o.nom)}</h3><div class="svc">${choix.map(s=>`<div class="it">${esc(s)}</div>`).join('')}</div></div>
      <div><h3>Des athlètes partis du même point</h3><div class="tr">${g.length?g.map(a=>`<div>${esc(a.prenom)} · ${esc(a.offre||'')}</div>`).join(''):'<div>Tes transfos ici</div><div>Photos et chiffres</div>'}</div>
      <div class="price" style="margin-top:22px"><small>${o.jours||''} jours · paiement en une fois</small><b class="num">${eur(p.montant||o.prix)}</b><small>contrat et lien de paiement envoyés après notre appel</small></div></div></div>
    </div>`;
  sheetId=p.id;
}
const selSvc=p=>{const all=SERVICES();const v=(p.services||[]).map(x=>typeof x==='number'?all[x]:x).filter(Boolean);return p.offre_prete?v:all};
function openPrep(p){
  sheetId=p.id;const o=offreOf(p),choix=selSvc(p);
  showSheet(`<div class="sh"><div class="avb">${ini(p.prenom)}</div><div><h3>Offre de ${esc(prenom(p.prenom))}</h3><span class="sub" style="color:var(--muted);font-size:12px">préparée avant l'appel · lui ne voit que le résultat</span></div>${X}</div>
  <form class="sb form" id="pform"><div class="field"><label for="pf-of">Formule</label><select class="inp" id="pf-of">${S.offres.map(x=>`<option value="${x.id}" ${x.nom===o.nom?'selected':''}>${esc(x.nom)} · ${eur(x.prix)}</option>`).join('')}</select></div>
  <div class="field"><label for="pf-px">Prix pour ${esc(prenom(p.prenom))} (€, en une fois)</label><input class="inp" id="pf-px" type="number" required value="${p.montant||o.prix}"></div>
  <div class="field"><label>Ce que tu lui proposes</label><div class="prepsvc">${SERVICES().map((x,i)=>`<label><input type="checkbox" value="${i}" ${choix.includes(x)?'checked':''}>${esc(x)}</label>`).join('')}</div></div></form>
  <div class="sf"><button class="btn primary" form="pform" type="submit" data-then="present">Enregistrer et présenter</button><button class="btn" form="pform" type="submit">Enregistrer</button></div>`);
  $('pf-of').addEventListener('change',e=>{const x=S.offres.find(y=>y.id===e.target.value);if(x)$('pf-px').value=x.prix});
  $('pform').addEventListener('submit',async e=>{e.preventDefault();const x=S.offres.find(y=>y.id===$('pf-of').value)||o;const svc=[...sheet.querySelectorAll('.prepsvc input:checked')].map(c=>+c.value);const prix=+$('pf-px').value||x.prix;
    await upd('prospects',p.id,{offre:x.nom,montant:prix,services:svc,offre_prete:true},p);await addNote(p,`Offre perso préparée : ${x.nom} · ${eur(prix)} · ${svc.length} services.`);
    if(e.submitter&&e.submitter.dataset.then==='present'){closeSheet();render();openPresent(p)}else{render();openSheet(p.id);toast('Offre enregistrée')}});
}
function closePresent(){const el=$('present');el.hidden=true;el.innerHTML=''}

// ---------- dictée ----------
function parseDictee(txt){
  let o=' '+txt.replace(/[’]/g,"'")+' ';const low=()=>o.toLowerCase();let date=null,h=null,e=null;
  const cut=m=>{o=o.replace(new RegExp(m.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),' ')};
  const MOIS={janvier:0,'février':1,fevrier:1,mars:2,avril:3,mai:4,juin:5,juillet:6,'août':7,aout:7,septembre:8,octobre:9,novembre:10,'décembre':11,decembre:11};
  let m=low().match(/\b(?:le\s+)?(\d{1,2})(?:er)?\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\b/);
  if(m){let dt=new Date(T0.getFullYear(),MOIS[m[2]],+m[1],12);if(dt<T0-DAY)dt=new Date(T0.getFullYear()+1,MOIS[m[2]],+m[1],12);date=iso(dt);cut(m[0])}
  if(!date){m=low().match(/\bapr[èe]s[- ]demain\b/);if(m){date=iso(d(2));cut(m[0])}}
  if(!date){m=low().match(/\bdemain\b/);if(m){date=iso(d(1));cut(m[0])}}
  if(!date){m=low().match(/\baujourd'hui\b/);if(m){date=TODAY;cut(m[0])}}
  if(!date){const J=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];m=low().match(/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/);if(m){const k=((J.indexOf(m[1])-T0.getDay())+7)%7||7;date=iso(d(k));cut(m[0])}}
  const tm=x=>{const r=x.match(/(\d{1,2})\s*(?:h|:)?\s*(\d{2})?/);return r?String(+r[1]).padStart(2,'0')+':'+(r[2]||'00'):null};
  const H="(\\d{1,2}\\s*(?:h|:)\\s*(?:\\d{2})?|\\d{1,2}\\s*heures?(?:\\s*\\d{2})?)";
  m=low().match(new RegExp("\\bde\\s+"+H+"\\s*(?:à|a|jusqu'à)\\s+"+H));if(m){h=tm(m[1]);e=tm(m[2]);cut(m[0])}
  if(!h){m=low().match(new RegExp("(?:^|\\s)(?:à|a|vers)\\s+"+H));if(m){h=tm(m[1]);cut(m[0])}}
  let t=o.replace(/\s+/g,' ').replace(/^[\s,.:;]+|[\s,.:;]+$/g,'').replace(/^(?:le|la|une?|des?)\s+/i,'');t=t.charAt(0).toUpperCase()+t.slice(1);
  const L=t.toLowerCase();const k=/séance|seance|sport|entra|street|muscu|salle|compét|compet/.test(L)?'seance':/appel|visio|meet|\br1\b|\br2\b/.test(L)?'meet':/anniv|resto|famille|dentiste|médecin|medecin|vacances|perso/.test(L)?'perso':'task';
  return {date:date||TODAY,h:h||'',e:e||(h?plus(h,60):''),t:t||'Sans titre',k};
}
function openDictee(){
  sheetId=null;
  showSheet(`<div class="sh"><div class="avb">${ICON.mic}</div><div><h3>Dicter une tâche</h3><span class="sub">« Le 22 novembre, séance street lifting de 18 h à 20 h »</span></div>${X}</div>
  <div class="sb"><div class="g"><div style="display:flex;gap:6px"><input class="inp" id="dict-in" placeholder="Dis-le ou écris-le…" autocomplete="off"><button class="btn primary" data-mic aria-label="Parler">${ICON.mic}</button></div><p class="empty">Appuie sur le micro et parle, ou écris la phrase. Je comprends la date, l'heure et le titre.</p></div>
  <div class="g" id="dict-prev" hidden></div></div>
  <div class="sf"><button class="btn primary" data-dictadd disabled>Ajouter à l'agenda</button></div>`);
  const inp=$('dict-in');inp.focus();inp.addEventListener('input',()=>previewDictee(inp.value));
}
function previewDictee(v){
  const box=$('dict-prev'),btn=sheet.querySelector('[data-dictadd]');if(!v.trim()){box.hidden=true;btn.disabled=true;dict=null;return}
  dict=parseDictee(v);box.hidden=false;btn.disabled=false;
  const KN={seance:'Séance',meet:'Appel / visio',task:'Tâche',perso:'Perso'};
  box.innerHTML=`<h4>Ce que j'ai compris</h4><dl class="kv"><dt>Quoi</dt><dd><b>${esc(dict.t)}</b> <span class="tag neutral">${KN[dict.k]}</span></dd><dt>Quand</dt><dd>${new Date(dict.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}${dict.h?' · '+dict.h+(dict.e?' → '+dict.e:''):' · toute la journée'}</dd></dl>`;
}
async function addEvent(e){const tok=G.on&&!e.auto?await gTok(true):null;const r=await ins('agenda',{date:e.d,debut:e.h||null,fin:e.e||null,titre:e.t,sous_titre:e.s||null,type:e.k||'task',kind:e.kind||null,auto:!!e.auto,prospect_id:e.pid||null});S.agenda.push({id:r.id,d:r.date,h:hm(r.debut),e:hm(r.fin),t:r.titre,s:r.sous_titre||'',k:r.type,kind:r.kind,auto:r.auto,pid:r.prospect_id,gcal:null,meet:null});
  if(tok){const loc=S.agenda[S.agenda.length-1];const ge=await gPush(loc);if(ge&&ge.id){loc.gcal=ge.id;loc.meet=ge.hangoutLink||null;await upd('agenda',r.id,{gcal_id:ge.id,meet_url:loc.meet})}}
  else if(G.on&&!e.auto)toast('Google Agenda à reconnecter (Agenda → Reconnecter)');
  return r}
function openEvent(id){
  const e=S.agenda.find(x=>x.id===id);if(!e)return;
  formSheet('Événement',[{k:'t',l:'Titre',req:true,v:e.t},{k:'d',l:'Date',type:'date',v:e.d},{k:'h',l:'Début',type:'time',v:e.h},{k:'e',l:'Fin',type:'time',v:e.e},{k:'s',l:'Détail',v:e.s},{k:'k',l:'Type',type:'select',opts:[{v:'seance',t:'Séance'},{v:'meet',t:'Appel / visio'},{v:'task',t:'Tâche'},{v:'perso',t:'Perso'}],v:e.k}],'Enregistrer',
    async g=>{await upd('agenda',e.id,{titre:g.t,date:g.d,debut:g.h||null,fin:g.e||null,sous_titre:g.s||null,type:g.k});Object.assign(e,{t:g.t,d:g.d,h:g.h,e:g.e,s:g.s,k:g.k});if(e.gcal&&await gTok(true))await gPush(e);closeSheet();render();toast('Enregistré')},
    `<button class="btn sm" data-delev="${e.id}" style="margin-top:6px">Supprimer</button>`);
}

// ---------- Stripe (liens de paiement) ----------
const offreOf=p=>S.offres.find(x=>x.nom===p.offre)||S.offres.find(x=>x.prix===p.montant)||{nom:p.offre||'Coaching',prix:p.montant,jours:91};
const STRIPE={ok:null,test:false,vu:false};
function stripePing(){if(STRIPE.vu)return;STRIPE.vu=true;SB.functions.invoke('stripe-lien',{body:{ping:true}}).then(({data,error})=>{if(error||!data){STRIPE.err=true;return}STRIPE.ok=!!data.ok;STRIPE.test=!!data.test}).catch(()=>{STRIPE.err=true}).finally(()=>{if(route==='reglages')render()})}
const stripeEtat=()=>STRIPE.ok===false?'clé secrète à coller dans Supabase (Edge Functions → Secrets)':STRIPE.test?'paiements de test, pas de vrai argent':'liens de paiement créés depuis l\'appli';
async function mkLien(nom,prix){
  const {data,error}=await SB.functions.invoke('stripe-lien',{body:{nom,prix}});
  if(error){let m='Stripe ne répond pas';try{m=(await error.context.json()).error||m}catch(_){}throw new Error(m)}
  if(!data||!data.url)throw new Error((data&&data.error)||'Lien non créé');return data;
}
const payMsg=(p,nom,prix,url)=>`${prenom(p.prenom)}, comme convenu voici le lien pour régler ton ${nom} (${eur(prix)}, en une fois) : ${url}\nDès que c'est fait, on démarre. Bienvenue dans la team LEGACY.`;
const nextMeet=p=>S.agenda.filter(e=>e.pid===p.id&&e.meet&&diff(e.d)>=0).sort((a,b)=>(a.d+a.h).localeCompare(b.d+b.h))[0];

// ---------- Google Agenda + Meet (navigateur seulement, jeton 1 h) ----------
const G={cid:(window.LEGACY_CFG||{}).gcalClientId||'',on:false,tok:null,exp:0,tc:null,cache:{},busy:{}};
const GAPI='https://www.googleapis.com/calendar/v3/calendars/primary/events';
try{const x=JSON.parse(localStorage.getItem('qg_g')||'null');if(x&&G.cid){G.on=true;G.tok=x.t;G.exp=x.e||0}}catch(_){}
function gSave(){try{G.on?localStorage.setItem('qg_g',JSON.stringify({t:G.tok,e:G.exp})):localStorage.removeItem('qg_g')}catch(_){}}
const gValid=()=>G.tok&&Date.now()<G.exp-60000;
function gLib(){return window.google&&google.accounts&&google.accounts.oauth2?Promise.resolve():new Promise((ok,ko)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
gLib().catch(()=>{});
function gTok(interactive,consent){
  if(gValid())return Promise.resolve(G.tok);
  if(!interactive||!G.cid)return Promise.resolve(null);
  const run=()=>new Promise(ok=>{
    const done=r=>{if(r&&r.access_token){G.tok=r.access_token;G.exp=Date.now()+(+r.expires_in||3600)*1000;G.on=true;gSave();ok(G.tok)}else ok(null)};
    if(!G.tc)G.tc=google.accounts.oauth2.initTokenClient({client_id:G.cid,scope:'https://www.googleapis.com/auth/calendar.events',callback:done,error_callback:()=>ok(null)});
    G.tc.callback=done;G.tc.error_callback=()=>ok(null);
    G.tc.requestAccessToken({prompt:consent?'consent':''});
  });
  return window.google&&google.accounts&&google.accounts.oauth2?run():gLib().then(run).catch(()=>null);
}
async function gConnect(){if(!G.cid){toast('ID client Google manquant dans config.js');return}const t=await gTok(true,!G.on);if(t){G.cache={};toast('Google Agenda relié');render()}else toast('Connexion Google annulée')}
function gOut(){try{G.tok&&google.accounts.oauth2.revoke(G.tok,()=>{})}catch(_){}G.on=false;G.tok=null;G.exp=0;G.cache={};gSave();render();toast('Google Agenda déconnecté')}
async function gApi(path,opt={}){
  const t=await gTok(false);if(!t)return null;
  const r=await fetch(GAPI+path,{...opt,headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'}});
  if(r.status===401){G.tok=null;G.exp=0;gSave();return null}
  if(!r.ok||r.status===204)return r.ok?{}:null;return r.json();
}
function gBody(e){
  const b={summary:e.t,description:(e.s||'')+'\nLEGACY QG'};
  if(e.h){const fin=e.e&&e.e>e.h?e.e:plus(e.h,30);b.start={dateTime:`${e.d}T${e.h}:00`,timeZone:'Europe/Paris'};b.end={dateTime:`${e.d}T${fin}:00`,timeZone:'Europe/Paris'}}
  else{const n=new Date(e.d+'T12:00:00');n.setDate(n.getDate()+1);b.start={date:e.d};b.end={date:iso(n)}}
  return b;
}
async function gPush(e){
  try{
    if(e.gcal){const r=await gApi('/'+encodeURIComponent(e.gcal),{method:'PATCH',body:JSON.stringify(gBody(e))});G.cache={};return r}
    const b=gBody(e);if(e.k==='meet')b.conferenceData={createRequest:{requestId:'qg-'+e.id,conferenceSolutionKey:{type:'hangoutsMeet'}}};
    const r=await gApi('?conferenceDataVersion=1',{method:'POST',body:JSON.stringify(b)});G.cache={};return r;
  }catch(err){console.error(err);return null}
}
async function gDel(id){try{if(await gTok(true))await gApi('/'+encodeURIComponent(id),{method:'DELETE'});G.cache={}}catch(err){console.error(err)}}
function gLoad(mon){
  const k=iso(mon);if(!G.on||!gValid()||G.cache[k]||G.busy[k])return;G.busy[k]=1;
  const end=new Date(mon);end.setDate(mon.getDate()+7);
  gApi(`?singleEvents=true&orderBy=startTime&maxResults=250&timeMin=${encodeURIComponent(new Date(k+'T00:00:00').toISOString())}&timeMax=${encodeURIComponent(new Date(iso(end)+'T00:00:00').toISOString())}`).then(r=>{
    delete G.busy[k];if(!r||!r.items)return;
    G.cache[k]=r.items.filter(x=>x.status!=='cancelled').map(x=>{const s=x.start||{},f=x.end||{};const ds=s.dateTime?new Date(s.dateTime):null,df=f.dateTime?new Date(f.dateTime):null;
      return {id:x.id,g:true,k:'gg',d:ds?iso(ds):s.date,h:ds?ds.toTimeString().slice(0,5):'',e:df?df.toTimeString().slice(0,5):'',t:x.summary||'(sans titre)',s:'Google Agenda',url:x.htmlLink,meet:x.hangoutLink||null}});
    render();
  }).catch(()=>{delete G.busy[k]});
}
const ggDay=dIso=>{const mine=new Set(S.agenda.map(e=>e.gcal).filter(Boolean));return Object.values(G.cache).flat().filter(x=>x.d===dIso&&!mine.has(x.id))};
const gBadge=()=>!G.cid?'':!G.on?'<button class="btn sm" data-gconnect>Connecter Google Agenda</button>':gValid()?'<span class="badge plain">Google Agenda relié</span>':'<button class="btn sm" data-gconnect>Reconnecter Google</button>';

// ---------- événements ----------
document.addEventListener('click',async e=>{
  const nf=e.target.closest('[data-f]');if(nf){filtre=nf.dataset.f}
  const t=e.target.closest('button,[data-open]');if(!t)return;
  try{
  if(t.dataset.open){openSheet(t.dataset.open);return}
  if(t.hasAttribute('data-add')){openAdd();return}
  if(t.hasAttribute('data-close')){closeSheet();return}
  if(t.hasAttribute('data-logout')){await SB.auth.signOut();location.reload();return}
  if(t.dataset.filtre){filtre=t.dataset.filtre;render();return}
  if(t.dataset.copy!==undefined){navigator.clipboard&&navigator.clipboard.writeText(t.dataset.copy).then(()=>toast('Copié'),()=>toast('Sélectionne le texte pour le copier'));return}
  if(t.dataset.ig!==undefined){const x=S.ig.find(y=>y.id===t.dataset.ig);const fait=!x.fait;await upd('ig_comptes',x.id,{fait,fait_le:fait?TODAY:null},x);const nb=Math.max(0,dmToday()+(fait?1:-1));await q(T('dm_jours').upsert({jour:TODAY,nb}));S.dm[TODAY]=nb;render();toast(fait?`@${x.handle} contacté · ${nb}/${OBJ_DM()}`:'Annulé');return}
  if(t.dataset.rep!==undefined){const x=S.ig.find(y=>y.id===t.dataset.rep);await upd('ig_comptes',x.id,{repondu:!x.repondu},x);render();return}
  if(t.dataset.igprospect!==undefined){const x=S.ig.find(y=>y.id===t.dataset.igprospect);openAdd({prenom:x.handle.split(/[._]/)[0].replace(/^./,c=>c.toUpperCase()),insta:x.handle,source:'ig',igId:x.id});return}
  if(t.hasAttribute('data-addig')){formSheet('Ajouter un compte à contacter',[{k:'h',l:'@ Instagram',req:true,ph:'maxou.streetlift'},{k:'p',l:"D'où il vient",type:'select',opts:['Commentaire','Like','Réponse story','Abonné récent','Abonné d\'un compte SL','Autre'].map(v=>({v,t:v})),v:'Commentaire'}],'Ajouter',async g=>{const chaud=/Commentaire|story/.test(g.p);const r=await ins('ig_comptes',{handle:g.h.replace('@','').trim(),provenance:g.p,chaud,fait:false});S.ig.push(r);closeSheet();render();toast('@'+r.handle+' ajouté à la liste du jour')});return}
  if(t.dataset.fact!==undefined){const v=S.ventes.find(x=>x.id===t.dataset.fact);await upd('ventes',v.id,{facture:true},v);render();toast('Facture marquée envoyée');return}
  if(t.hasAttribute('data-addvente')){formSheet('Noter un paiement',[{k:'prenom',l:'Athlète',req:true,type:'select',opts:S.athletes.map(a=>({v:a.prenom,t:a.prenom})).concat([{v:'',t:'Autre…'}])},{k:'autre',l:'Ou un autre nom'},{k:'offre',l:'Offre',type:'select',opts:S.offres.map(o=>({v:o.nom,t:o.nom}))},{k:'montant',l:'Montant (€)',type:'number',req:true,v:String(S.offres[0]?.prix||700)},{k:'mode',l:'Mode',type:'select',opts:['virement','lydia','especes','stripe'].map(v=>({v,t:v}))},{k:'date',l:'Date',type:'date',v:TODAY}],'Enregistrer',async g=>{const r=await ins('ventes',{date:g.date,prenom:g.autre||g.prenom,offre:g.offre,montant:+g.montant,mode:g.mode,facture:false});S.ventes.unshift(r);closeSheet();render();toast('Paiement noté')});return}
  if(t.hasAttribute('data-addath')){formSheet('Ajouter un athlète',[{k:'prenom',l:'Prénom et nom',req:true},{k:'offre',l:'Offre',type:'select',opts:S.offres.map(o=>({v:o.id,t:o.nom+' · '+eur(o.prix)}))},{k:'debut',l:'Début',type:'date',v:TODAY}],'Ajouter',async g=>{const o=S.offres.find(x=>x.id===g.offre)||{nom:'',prix:0,jours:91};const r=await ins('athletes',{prenom:g.prenom,offre:o.nom,prix:o.prix,debut:g.debut,fin:iso(new Date(new Date(g.debut+'T12:00:00').getTime()+(o.jours||91)*DAY))});S.athletes.push(r);closeSheet();render();toast('Athlète ajouté')});return}
  if(t.dataset.seance!==undefined){const a=S.athletes.find(x=>x.id===t.dataset.seance);await upd('athletes',a.id,{derniere_seance:TODAY},a);render();toast('Séance notée');return}
  if(t.dataset.renew!==undefined){const a=S.athletes.find(x=>x.id===t.dataset.renew);const o=S.offres.find(x=>x.nom===a.offre)||S.offres[0]||{jours:91,prix:a.prix,nom:a.offre};const deb=a.fin&&diff(a.fin)>0?a.fin:TODAY;await upd('athletes',a.id,{debut:deb,fin:iso(new Date(new Date(deb+'T12:00:00').getTime()+(o.jours||91)*DAY))},a);const v=await ins('ventes',{date:TODAY,prenom:a.prenom,offre:'Renouvellement · '+(o.nom||''),montant:o.prix||a.prix,mode:'virement',facture:false});S.ventes.unshift(v);render();toast(`${a.prenom} renouvelé · ${eur(o.prix||a.prix)} à encaisser`);return}
  if(t.hasAttribute('data-newvideo')){formSheet('Idée de vidéo',[{k:'titre',l:'Titre',req:true,ph:'Comment je choisis le jour où je PR'},{k:'slug',l:'Nom du lien (/go/…)',req:true,ph:'jourpr'}],'Ajouter',async g=>{const slug=g.slug.toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,40);if(!slug)return toast('Nom de lien invalide');const r=await ins('videos',{slug,titre:g.titre,statut:1});S.videos.push(r);closeSheet();render();toast('Idée ajoutée · lien /go/'+slug)});return}
  if(t.dataset.vstep){const v=S.videos.find(x=>x.slug===t.dataset.vstep);const st=Math.min(4,v.statut+1);await q(T('videos').update({statut:st,publiee_le:st===4?TODAY:v.publiee_le}).eq('slug',v.slug));v.statut=st;if(st===4)v.publiee_le=TODAY;render();toast(st===4?`Publiée · colle ${C.site}/go/${v.slug} en description`:`${v.titre} → ${STEPS[st-1]}`);return}
  if(t.hasAttribute('data-gconnect')){await gConnect();return}
  if(t.hasAttribute('data-gout')){gOut();return}
  if(t.dataset.wk!==undefined){wk=t.dataset.wk==='0'?0:wk+(+t.dataset.wk);if(t.dataset.wk==='0')selDay=TODAY;render();return}
  if(t.dataset.day){selDay=t.dataset.day;render();return}
  if(t.dataset.ev){openEvent(t.dataset.ev);return}
  if(t.dataset.delev){const id=t.dataset.delev;const ev=S.agenda.find(x=>x.id===id);if(ev&&ev.gcal)await gDel(ev.gcal);await del('agenda',id);S.agenda=S.agenda.filter(x=>x.id!==id);closeSheet();render();toast('Supprimé');return}
  if(t.dataset.acc){const [dd,k]=t.dataset.acc.split('|');const pl=PLAGES().find(x=>x.kind===k);await addEvent({d:dd,h:pl.h,e:pl.e,t:pl.t,s:pl.s,k:'task',kind:k,auto:true});render();toast("Ajouté à l'agenda");return}
  if(t.hasAttribute('data-accall')){const mon=monday(wk);let c=0;for(let i=0;i<7;i++){const x=new Date(mon);x.setDate(mon.getDate()+i);const di=iso(x);for(const pl of propos(di)){await addEvent({d:di,h:pl.h,e:pl.e,t:pl.t,s:pl.s,k:'task',kind:pl.kind,auto:true});c++}}render();toast(`${c} plages ajoutées`);return}
  if(t.hasAttribute('data-dictee')){openDictee();return}
  if(t.hasAttribute('data-mic')){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const inp=$('dict-in');if(!SR){toast('Pas de micro ici : écris la phrase');inp.focus();return}try{const r=new SR();r.lang='fr-FR';r.onresult=ev=>{inp.value=ev.results[0][0].transcript;previewDictee(inp.value)};r.onerror=()=>{toast('Micro refusé : écris la phrase');inp.focus()};r.start();toast("Je t'écoute…")}catch(err){toast('Pas de micro ici : écris la phrase');inp.focus()}return}
  if(t.hasAttribute('data-dictadd')){if(!dict)return;await addEvent({d:dict.date,h:dict.h,e:dict.e,t:dict.t,s:dict.k==='perso'?'':'Dicté',k:dict.k});selDay=dict.date;wk=Math.floor((new Date(dict.date+'T12:00:00')-monday(0))/(7*DAY));closeSheet();if(route!=='agenda')location.hash='agenda';else render();toast(`« ${dict.t} » ajouté à l'agenda`);return}
  if(t.hasAttribute('data-pclose')){closePresent();return}
  if(t.hasAttribute('data-setpass')){formSheet('Définir un mot de passe',[{k:'p1',l:'Nouveau mot de passe (8 caractères minimum)',type:'password',req:true},{k:'p2',l:'Encore une fois',type:'password',req:true}],'Enregistrer',async g=>{if(g.p1.length<8)return toast('8 caractères minimum');if(g.p1!==g.p2)return toast('Les deux ne sont pas identiques');const {error}=await SB.auth.updateUser({password:g.p1});if(error)return toast('Refusé : '+error.message);closeSheet();toast('Mot de passe enregistré')});return}
  if(t.dataset.dm){await setReg('objectif_dm',Math.max(5,OBJ_DM()+(+t.dataset.dm)));render();return}
  if(t.dataset.obj){await setReg('objectif_mois',Math.max(500,OBJ()+(+t.dataset.obj)));render();return}
  if(t.dataset.plage!==undefined){const i=+t.dataset.plage,pl=[...(S.reg.plages||[])];const p0=pl[i];formSheet('Plage · '+p0.kind,[{k:'t',l:'Nom',v:p0.t},{k:'h',l:'Début',type:'time',v:p0.h},{k:'e',l:'Fin',type:'time',v:p0.e}],'Enregistrer',async g=>{pl[i]={...p0,t:g.t,h:g.h,e:g.e};await setReg('plages',pl);closeSheet();render();toast('Plage modifiée')});return}
  if(t.hasAttribute('data-addoffre')){formSheet('Nouvelle offre',[{k:'nom',l:'Nom',req:true,ph:'Coaching 3 mois'},{k:'prix',l:'Prix (€, en une fois)',type:'number',req:true},{k:'jours',l:'Durée (jours)',type:'number',v:'91'},{k:'lien',l:'Lien de paiement Stripe',type:'url',ph:'https://buy.stripe.com/…'}],'Ajouter',async g=>{const r=await ins('offres',{nom:g.nom,prix:+g.prix,jours:+g.jours||91,ordre:S.offres.length+1,lien_stripe:g.lien||null});S.offres.push(r);closeSheet();render();toast('Offre ajoutée')});return}
  if(t.dataset.editoffre){const o=S.offres.find(x=>x.id===t.dataset.editoffre);formSheet('Modifier l\'offre',[{k:'nom',l:'Nom',req:true,v:o.nom},{k:'prix',l:'Prix (€)',type:'number',req:true,v:String(o.prix)},{k:'jours',l:'Durée (jours)',type:'number',v:String(o.jours)},{k:'lien',l:'Lien de paiement Stripe',type:'url',ph:'https://buy.stripe.com/…',v:o.lien_stripe||''}],'Enregistrer',async g=>{const vieux=o.lien_stripe&&g.lien===o.lien_stripe&&(+g.prix!==o.prix||g.nom!==o.nom);await upd('offres',o.id,{nom:g.nom,prix:+g.prix,jours:+g.jours||91,lien_stripe:vieux?null:(g.lien||null)},o);if(vieux)setTimeout(()=>toast('Prix ou nom changé : recrée le lien Stripe'),2500);closeSheet();render();toast('Offre modifiée')});return}
  if(t.dataset.mklien){const o=S.offres.find(x=>x.id===t.dataset.mklien);t.disabled=true;t.textContent='Création…';try{const r=await mkLien(o.nom,o.prix);await upd('offres',o.id,{lien_stripe:r.url},o);render();toast(r.test?'Lien Stripe créé (mode test)':'Lien Stripe créé')}catch(err){t.disabled=false;t.textContent='Créer le lien Stripe';toast(err.message)}return}
  if(t.dataset.deloffre){const id=t.dataset.deloffre;await del('offres',id);S.offres=S.offres.filter(x=>x.id!==id);render();toast('Offre supprimée');return}
  if(t.hasAttribute('data-addsvc')){formSheet('Nouveau service',[{k:'s',l:'Service',req:true,ph:'Analyse vidéo de chaque PR'}],'Ajouter',async g=>{await setReg('services',[...SERVICES(),g.s]);closeSheet();render();toast('Service ajouté')});return}
  if(t.dataset.delsvc!==undefined){if(!t.dataset.sure){t.dataset.sure='1';t.textContent='Supprimer ?';t.style.color='var(--red)';return}const i=+t.dataset.delsvc;await setReg('services',SERVICES().filter((_,k)=>k!==i));for(const p of S.prospects){const a=(p.services||[]).map(Number);if(!a.some(x=>x>=i))continue;await upd('prospects',p.id,{services:a.filter(x=>x!==i).map(x=>x>i?x-1:x)},p)}render();return}
  if(t.hasAttribute('data-addscript')){formSheet('Nouveau message type',[{k:'titre',l:'Titre',req:true},{k:'texte',l:'Texte ({prénom}, {vidéo})',type:'textarea',req:true}],'Ajouter',async g=>{const r=await ins('messages_types',{titre:g.titre,texte:g.texte,ordre:S.scripts.length+1});S.scripts.push(r);closeSheet();render();toast('Message ajouté')});return}
  if(t.dataset.editscript){const s=S.scripts.find(x=>x.id===t.dataset.editscript);formSheet('Modifier le message',[{k:'titre',l:'Titre',req:true,v:s.titre},{k:'texte',l:'Texte',type:'textarea',req:true,v:s.texte}],'Enregistrer',async g=>{await upd('messages_types',s.id,{titre:g.titre,texte:g.texte},s);closeSheet();render();toast('Message modifié')});return}
  if(t.dataset.delscript){const id=t.dataset.delscript;await del('messages_types',id);S.scripts=S.scripts.filter(x=>x.id!==id);render();return}
  // ---- actions sur la fiche ouverte ----
  const p=P();if(!p)return;
  if(t.dataset.move){await moveTo(p,t.dataset.move);return}
  if(t.hasAttribute('data-paid')){if(t.dataset.sure){await addNote(p,'Paiement Stripe reçu.');await moveTo(p,'gagne','stripe')}else{t.dataset.sure='1';t.textContent='Confirmer : payé ?';t.style.color='var(--green)'}return}
  if(t.hasAttribute('data-paysur')){const o=offreOf(p);formSheet('Lien de paiement sur mesure',[{k:'nom',l:'Intitulé',req:true,v:o.nom+' · '+prenom(p.prenom)},{k:'prix',l:'Prix (€, en une fois)',type:'number',req:true,v:String(p.montant||o.prix)}],'Créer et envoyer',async g=>{const b=sheet.querySelector('[form=gform]');b.disabled=true;b.textContent='Création…';try{const r=await mkLien(g.nom,+g.prix);await upd('prospects',p.id,{montant:+g.prix},p);const m=payMsg(p,g.nom,+g.prix,r.url);if(p.tel)window.open(wa(p.tel,m),'_blank','noopener');else navigator.clipboard&&navigator.clipboard.writeText(m);await addNote(p,`Lien Stripe sur mesure envoyé : ${g.nom} · ${eur(+g.prix)} · ${r.url}`);render();openSheet(p.id);toast(p.tel?'Lien créé · WhatsApp ouvert':'Lien créé et copié')}catch(err){b.disabled=false;b.textContent='Créer et envoyer';toast(err.message)}});return}
  if(t.hasAttribute('data-paylink')){const o=offreOf(p);const m=payMsg(p,o.nom,o.prix,o.lien_stripe);if(p.tel)window.open(wa(p.tel,m),'_blank','noopener');else navigator.clipboard&&navigator.clipboard.writeText(m);await addNote(p,`Lien de paiement Stripe envoyé (${o.nom}).`);openSheet(p.id);toast(p.tel?'WhatsApp ouvert avec le lien':'Message + lien copiés');return}
  if(t.hasAttribute('data-edit')){openEdit(p);return}
  if(t.hasAttribute('data-delprospect')){if(t.dataset.sure){await del('prospects',p.id);S.prospects=S.prospects.filter(x=>x.id!==p.id);closeSheet();render();toast('Prospect supprimé')}else{t.dataset.sure='1';t.textContent='Confirmer la suppression';t.style.color='var(--red)'}return}
  if(t.dataset.push){const nd=iso(d(Math.max(0,diff(p.next_date||TODAY))+(+t.dataset.push)));await upd('prospects',p.id,{next_date:nd},p);await addNote(p,`Relance repoussée au ${fmtS(nd)}.`);render();openSheet(p.id);toast('Relance repoussée');return}
  if(t.hasAttribute('data-done')){const patch={next_date:iso(d(2))};patch.action=p.etape==='r2'?'Relancer après le R2':p.etape==='r1'?'Caler le R2':'Relancer';if(p.etape==='nouveau'){patch.etape='contacte';patch.chance=BASE.contacte;patch.action=NEXT.contacte}await addNote(p,`Fait : ${p.action||''}.`);await upd('prospects',p.id,patch,p);render();openSheet(p.id);toast('Noté · relance dans 2 jours');return}
  if(t.hasAttribute('data-slots')){const s=$('slots');s.hidden=!s.hidden;return}
  if(t.hasAttribute('data-meetcustom')){formSheet('Caler l\'appel',[{k:'d',l:'Date',type:'date',v:iso(d(1))},{k:'h',l:'Heure',type:'time',v:'18:00'}],'Caler',async g=>{await calerMeet(p,g.d,g.h)});return}
  if(t.dataset.meet!==undefined){const [dd,hh]=t.dataset.meet.split('|');await calerMeet(p,dd,hh);return}
  if(t.hasAttribute('data-vid')){await upd('prospects',p.id,{vid_envoyee:true},p);await addNote(p,"Vidéo d'offre envoyée.");render();openSheet(p.id);toast("Vidéo d'offre marquée envoyée");return}
  if(t.hasAttribute('data-prep')){openPrep(p);return}
  if(t.hasAttribute('data-present')){openPresent(p);return}
  if(t.hasAttribute('data-sent')){const patch={recap_envoye:true};if(p.etape!=='r2'){patch.etape='r2';patch.chance=BASE.r2}patch.action='Relancer après le R2';patch.next_date=iso(d(2));await upd('prospects',p.id,patch,p);await addNote(p,'Récap de l’offre et contrat envoyés.');closePresent();render();openSheet(p.id);toast('Récap + contrat marqués envoyés');return}
  if(t.hasAttribute('data-note')){const i=$('note-'+p.id);if(i.value.trim()){await addNote(p,i.value.trim());openSheet(p.id);toast('Note ajoutée')}return}
  }catch(err){console.error(err)}
});
async function calerMeet(p,dd,hh){
  const r=p.etape==='r1'?'r2':'r1';
  await addEvent({d:dd,h:hh,e:plus(hh,30),t:r.toUpperCase()+' · '+p.prenom,s:r==='r1'?'Appel découverte':"Présentation de l'offre",k:'meet',pid:p.id});
  await upd('prospects',p.id,{etape:r,chance:BASE[r],action:NEXT[r],next_date:dd},p);
  await addNote(p,`${r.toUpperCase()} calé ${fmtJ(dd)} à ${hh}.`);
  closeSheet();render();openSheet(p.id);toast(nextMeet(p)?`${r.toUpperCase()} calé ${fmtJ(dd)} ${hh} · lien Meet prêt, envoie-le depuis la fiche`:`${r.toUpperCase()} calé ${fmtJ(dd)} ${hh} · pense à envoyer le lien Meet`);
}
document.addEventListener('input',e=>{if(e.target.matches('[data-chance]')){const p=P();if(!p)return;p.chance=+e.target.value;$('chv-'+p.id).innerHTML=chanceHTML(p.chance)}});
document.addEventListener('change',async e=>{
  const p=P();
  if(e.target.matches('[data-svc]')&&p){const i=+e.target.dataset.svc;const s=e.target.checked?[...new Set([...(p.services||[]),i])]:(p.services||[]).filter(x=>x!==i);await upd('prospects',p.id,{services:s},p);e.target.closest('label').classList.toggle('off',!e.target.checked);return}
  if(e.target.matches('[data-chance]')&&p){await upd('prospects',p.id,{chance:+e.target.value},p);render();return}
  if(e.target.matches('[data-offre]')&&p){const o=S.offres.find(x=>x.id===e.target.value);if(o){await upd('prospects',p.id,{offre:o.nom,montant:o.prix},p);render();toast('Offre mise à jour')}}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSheet();closePresent()}if(e.key==='Enter'&&e.target.id&&e.target.id.startsWith('note-')){e.preventDefault();sheet.querySelector('[data-note]').click()}});
scrim.addEventListener('click',closeSheet);
function fromHash(){const h=location.hash.slice(1);route=TITLES[h]?h:'dashboard';if(h!=='crm')filtre='all';closeSheet();closePresent();render();countUp();window.scrollTo(0,0)}
window.addEventListener('hashchange',fromHash);
window.QG={S,SB,render,loadAll};

// ---------- démarrage / connexion ----------
async function start(){
  const {data:{session}}=await SB.auth.getSession();
  if(!session){$('loading').hidden=true;$('login').hidden=false;return}
  S.user=session.user.email;$('who').textContent=S.user;
  try{await loadAll()}catch(e){$('loading').innerHTML='<div style="text-align:center;color:var(--red)">Impossible de charger la base.<br><small>'+esc(e.message||'')+'</small><br><br><button class="btn" onclick="location.reload()">Réessayer</button></div>';return}
  $('loading').hidden=true;$('login').hidden=true;$('app').hidden=false;$('tabbar').hidden=false;
  fromHash();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
}
let loginEmail='',passMode=false;
$('login-switch').addEventListener('click',()=>{passMode=!passMode;$('login-pass').hidden=!passMode;$('login-code').hidden=true;$('login-email').hidden=false;$('login-btn').textContent=passMode?'Entrer':'Recevoir mon code';$('login-switch').textContent=passMode?'Recevoir un code par email':'Me connecter avec mon mot de passe';$('login-msg').textContent='';($('login-pass').hidden?$('login-email'):$('login-pass')).focus()});
$('loginform').addEventListener('submit',async e=>{
  e.preventDefault();const msg=$('login-msg'),code=$('login-code');
  if(passMode){
    msg.textContent='Connexion…';
    const {error}=await SB.auth.signInWithPassword({email:$('login-email').value.trim(),password:$('login-pass').value});
    if(error)msg.innerHTML='<span class="err">Email ou mot de passe refusé.</span>';
    return;
  }
  if(!code.hidden){
    msg.textContent='Vérification…';
    const {error}=await SB.auth.verifyOtp({email:loginEmail,token:code.value.trim(),type:'email'});
    if(error)msg.innerHTML='<span class="err">Code refusé ou expiré. Réessaie, ou redemande un code.</span>';
    return;
  }
  loginEmail=$('login-email').value.trim();msg.textContent='Envoi…';
  const {error}=await SB.auth.signInWithOtp({email:loginEmail,options:{emailRedirectTo:location.origin+location.pathname,shouldCreateUser:true}});
  if(error){msg.innerHTML='<span class="err">'+esc(error.message)+'</span>';return}
  code.hidden=false;code.focus();$('login-email').hidden=true;$('login-btn').textContent='Entrer';
  msg.innerHTML='Regarde tes mails : tape le <b>code à 6 chiffres</b>, ou clique sur le lien (vérifie les indésirables).';
});
SB.auth.onAuthStateChange((ev,session)=>{if(ev==='SIGNED_IN'&&session&&$('app').hidden){history.replaceState(null,'',location.pathname+(location.hash.includes('access_token')?'':location.hash));start()}});
start();
})();
