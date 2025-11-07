/* ---------------------------
   STRATEGIC SANDBOX STATE
----------------------------*/
const BASE_CASH = 4800;

const state = {
  running:false,
  paused:false,
  t:0,
  tMax:60,
  dayLength:60,
  tickMs:1000,
  locKey:'downtown',
  hard:false,

  prices:Object.fromEntries(ITEMS.map(i=>[i.id,i.basePrice])),
  enabled:Object.fromEntries(ITEMS.map(i=>[i.id, BASE_UNLOCKS.includes(i.id)])),

  revenue:0,
  customers:0,
  served:0,
  walked:0,

  promo:false,
  promoEnd:0,
  surveyBoost:null,
  surveyBoostEnd:0,
  nextSurvey:0,
  specialActive:false,
  specialItem:null,
  specialEnd:0,
  nextServiceHint:12,

  metrics:initMetrics(),

  prepPlan:Object.fromEntries(ITEMS.map(i=>[i.id, BASE_UNLOCKS.includes(i.id)?18:0])),
  inventory:Object.fromEntries(ITEMS.map(i=>[i.id, 0])),
  storageCap:getTruck('cart').storage,
  prepSpent:0,

  cash:BASE_CASH,
  day:1,
  truckId:'cart',
  unlockedItems:new Set(BASE_UNLOCKS),
  ownedUpgrades:new Set(),

  staffRoster:[],
  staffSlots:getTruck('cart').staffSlots,
  staffEffects:{},

  modifiers:{throughput:1, marketing:1, priceSlack:0, promoDuration:15, storage:getTruck('cart').storage, prepCostMult:1, staffSlots:getTruck('cart').staffSlots},

  researchPoints:0,
  researchUnlocked:new Set(),
  analyticsLevel:0,

  reputation:Object.fromEntries(Object.keys(SEGMENTS).map(k=>[k,0.5])),

  scheduledCampaign:null,
  activeCampaign:null,
  campaignEffects:{},

  eventEffects:{},
  activeEvent:null,
  activeEventChoice:null,
  eventChoiceSummary:null,

  activeGoals:[],
  completedGoals:new Set(),
  goalProgress:{},

  loanBalance:0,
  dailyCostBreakdown:{rent:BASE_RENT, maintenance:0, salaries:0, loanInterest:0, total:BASE_RENT},

  sellThroughHistory:[],
  pendingPrepStart:false,
};

/* ---------------------------
   HELPERS
----------------------------*/
function initMetrics(){
  const m = {};
  for(const it of ITEMS){
    m[it.id] = { views:0, buys:0, rejectTooExp:0, rejectSpice:0, stockouts:0, priceHistory:[] };
  }
  return m;
}
function activeItems(){
  return ITEMS.filter(it => state.unlockedItems.has(it.id));
}
function selectedItems(){
  return ITEMS.filter(it => state.unlockedItems.has(it.id) && state.enabled[it.id]);
}
function getItem(id){
  return ITEMS.find(x=>x.id===id);
}
function getTruck(id){
  return TRUCKS.find(t=>t.id===id) || TRUCKS[0];
}
function getUpgrade(id){
  return UPGRADES.find(u=>u.id===id);
}
function getCampaign(id){
  return CAMPAIGNS.find(c=>c.id===id);
}
function getStaffer(id){
  return STAFFERS.find(s=>s.id===id);
}
function getGoal(id){
  return GOALS.find(g=>g.id===id);
}
function getResearch(id){
  return RESEARCH.find(r=>r.id===id);
}
function getEventById(id){
  return EVENTS.find(e=>e.id===id);
}

function calcModifiers(){
  const truck = getTruck(state.truckId);
  const mods = {
    throughput: truck.throughput,
    marketing: truck.marketing,
    priceSlack: 0,
    promoDuration: 15,
    storage: truck.storage,
    prepCostMult:1,
    staffSlots: truck.staffSlots,
    analytics:0,
    rentDiscount:0,
    repGain:0,
    spiceTolerance:0,
    eventShield:0
  };

  function applyEffect(effects){
    if(!effects) return;
    Object.entries(effects).forEach(([key,val])=>{
      if(key==='prepCostMult'){ mods.prepCostMult *= val; return; }
      if(key==='analytics'){ mods.analytics += val; return; }
      if(key==='storage' || key==='throughput' || key==='marketing' || key==='priceSlack'){
        mods[key] = (mods[key]||0) + val;
        return;
      }
      if(key==='promoSeconds'){ mods.promoDuration += val; return; }
      if(key==='staffSlots'){ mods.staffSlots += val; return; }
      if(key==='rentDiscount'){ mods.rentDiscount += val; return; }
      if(key==='repGain'){ mods.repGain += val; return; }
      if(key==='spiceTolerance'){ mods.spiceTolerance += val; return; }
      if(key==='eventShield'){ mods.eventShield += val; return; }
    });
  }

  state.ownedUpgrades.forEach(id=>{
    const up = getUpgrade(id);
    if(up && up.effects){
      if(up.effects.unlockItems){ unlockItems(up.effects.unlockItems, false); }
      applyEffect(up.effects);
    }
  });
  state.staffRoster.forEach(id=>{
    const staff=getStaffer(id);
    if(staff){ applyEffect(staff.effects); }
  });
  state.researchUnlocked.forEach(id=>{
    const tech=getResearch(id);
    if(tech){ applyEffect(tech.effects); }
  });

  state.storageCap = Math.round(mods.storage);
  state.staffSlots = Math.max(0, Math.round(mods.staffSlots));
  state.analyticsLevel = Math.max(0, Math.round(mods.analytics));
  state.modifiers = mods;
  calcDailyCosts();
}

function calcDailyCosts(){
  const rent = Math.max(0, BASE_RENT - (state.modifiers.rentDiscount||0));
  const maintenance = getTruck(state.truckId).dailyCost || 0;
  const salaries = state.staffRoster.reduce((sum,id)=>sum+(getStaffer(id)?.salary||0),0);
  const loanInterest = state.loanBalance>0 ? Math.round(state.loanBalance * LOAN_INTEREST * 100)/100 : 0;
  const total = Math.round((rent + maintenance + salaries + loanInterest)*100)/100;
  state.dailyCostBreakdown = {rent, maintenance, salaries, loanInterest, total};
  renderFinanceLine();
  return total;
}

/* ---------------------------
   UI REFERENCES
----------------------------*/
const $ = sel => document.querySelector(sel);
const feed = $('#feed');
const insightsEl = $('#insights');
const reportEl = $('#report');
const crowdHint = $('#crowdHint');
const prepModal = $('#prepModal');
const prepGrid  = $('#prepGrid');
const prepHint  = $('#prepHint');
const prepCostPill = $('#prepCostPill');
const storagePill = $('#storagePill');
const $start = $('#startBtn');
const $pause = $('#pauseBtn');
const $survey = $('#quickSurvey');
const $blast = $('#discountBlast');
const $special = $('#chefSpecial');
const $loanPayBtn = $('#loanPayBtn');
const navModal = $('#navModal');
const navLinks = $('#navQuickLinks');
const navOpenBtn = $('#navMenuBtn');
const navCloseBtn = $('#closeNavModal');
const navStageTitle = $('#navStageTitle');
const navStageDesc = $('#navStageDesc');
const navStageBtn = $('#navStageBtn');
const supplyList = $('#supplyList');
const specialModal = $('#specialModal');
const specialSelect = $('#specialSelect');
const specialConfirm = $('#specialConfirm');
const specialCancel = $('#specialCancel');

calcModifiers();
calcDailyCosts();

/* ---------------------------
   GENERIC HELPERS
----------------------------*/
function money(n){ return '$' + (n||0).toFixed(2); }
function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }
function randRange(a,b){ return a + Math.random()*(b-a); }
function sigmoid(x){ return 1/(1+Math.exp(-x)); }
function normal(mean, sd){ let u=0,v=0; while(u===0) u=Math.random(); while(v===0) v=Math.random(); const z=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); return mean + z * (sd||1); }
function poisson(lambda){ let L=Math.exp(-lambda), k=0, p=1; do{ k++; p*=Math.random(); }while(p>L); return k-1; }
function weightedPick(map){ const entries=Object.entries(map); const sum=entries.reduce((a,[,w])=>a+w,0); let r=Math.random()*sum; for(const [key,w] of entries){ if((r-=w)<=0) return key; } return entries[0][0]; }
function mixLabel(m){ return Object.entries(m).map(([k,v])=>`${SEGMENTS[k].name} ${Math.round(v*100)}%`).join(' | '); }
function hottestSegment(m){ return Object.entries(m).sort((a,b)=>b[1]-a[1])[0][0]; }

function log(msg, cls=''){
  const div=document.createElement('div');
  div.className='msg '+cls;
  div.innerHTML=msg;
  feed.append(div);
  feed.scrollTop=feed.scrollHeight;
}
function insight(text){
  const d=document.createElement('div');
  d.className='insight';
  d.innerHTML='<b>Insight:</b> '+text;
  insightsEl.prepend(d);
}

/* ---------------------------
   MENU & PREP UI
----------------------------*/
function buildMenu(){
  const wrap = document.createElement('div');
  const items = activeItems();
  if(!items.length){ wrap.innerHTML='<div class="tiny muted">Unlock an item to start selling.</div>'; }
  for(const it of items){
    const row=document.createElement('div'); row.className='menu-row';
    const toggle=document.createElement('label'); toggle.className='toggle';
    const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=!!state.enabled[it.id];
    cb.addEventListener('change',()=>{
      state.enabled[it.id]=cb.checked;
      if(!cb.checked){
        state.prepPlan[it.id]=0;
        state.inventory[it.id]=0;
      }
      insight(`Menu ${cb.checked?'enabled':'disabled'}: ${it.name}`);
      renderPrepRows();
      updatePrepStats();
      renderSupplyList(true);
    });
    const name=document.createElement('span'); name.textContent=it.name; toggle.append(cb,name);
    const price=document.createElement('input'); price.type='number'; price.step='0.5'; price.min=it.min; price.max=it.max; price.value=state.prices[it.id];
    price.addEventListener('input',()=>{ const v=clamp(parseFloat(price.value||it.basePrice), it.min, it.max); state.prices[it.id]=v; livePriceProbe(it.id, v); });
    const cogs=document.createElement('div'); cogs.className='tiny mono muted'; cogs.textContent='COGS '+money(it.cogs);
    const quick=document.createElement('div'); quick.className='btnbar';
    const minus=document.createElement('button'); minus.textContent='- $0.5'; minus.addEventListener('click',()=>bump(it.id,-0.5,price));
    const plus=document.createElement('button'); plus.textContent='+ $0.5'; plus.addEventListener('click',()=>bump(it.id,0.5,price));
    quick.append(minus,plus);
    row.append(toggle, price, cogs, quick);
    wrap.append(row);
  }
  $('#menuList').innerHTML='';
  $('#menuList').append(wrap);
}
function bump(id,delta,input){ const it=getItem(id); const v=clamp((state.prices[id]||it.basePrice)+delta, it.min, it.max); state.prices[id]=v; input.value=v; livePriceProbe(id,v); }

function openPrepPlanner(){
  ensureEventForDay();
  renderPrepRows();
  updatePrepStats();
  const loc = LOCATIONS[state.locKey];
  const mix = mixLabel(loc.mix);
  const avgArrivals = ((loc.baseTraffic[0]+loc.baseTraffic[1])/2) * (state.tMax * (state.hard?0.8:1.0));
  prepHint.textContent = `${state.locKey}: ${mix}. Rough arrivals ~ ${Math.round(avgArrivals)}. Aim for 75-90% sell-through.`;
  prepModal.style.display='grid';
}
function closePrepPlanner(){ prepModal.style.display='none'; }

function beginPrepPlanning(){
  openPrepPlanner();
  state.pendingPrepStart=false;
}

function renderPrepRows(){
  prepGrid.innerHTML='';
  const items=selectedItems();
  if(!items.length){
    prepGrid.innerHTML='<div class="tiny muted">Enable menu items in Menu & Pricing to plan portions.</div>';
    return;
  }
  for(const it of items){
    const row=document.createElement('div'); row.className='prep-row';
    const label=document.createElement('div'); label.innerHTML=`<b>${it.name}</b><div class="tiny muted">COGS ${money(it.cogs)} / portion</div>`;
    const qty=document.createElement('input'); qty.type='number'; qty.min='0'; qty.step='1'; qty.value=state.prepPlan[it.id] ?? 0;
    qty.addEventListener('input',()=>{ const v=Math.max(0, Math.floor(+qty.value||0)); state.prepPlan[it.id]=v; updatePrepStats(); });
    const expWrap=document.createElement('div');
    const bar=document.createElement('div'); bar.className='bar-sm';
    const barIn=document.createElement('div'); bar.append(barIn);
    const expTxt=document.createElement('div'); expTxt.className='tiny muted'; expWrap.append(bar, expTxt);
    if(state.analyticsLevel>0){
      const est=estimateItemDemand(it.id);
      const pct=Math.max(5, Math.min(100, Math.round((est/Math.max(1,state.storageCap))*100)));
      barIn.style.width=pct+'%';
      expTxt.textContent=`Est portions ~ ${Math.round(est)}`;
    }else{
      barIn.style.width='5%';
      expTxt.textContent='Unlock analytics for demand bars.';
    }
    const priceNow=document.createElement('div'); priceNow.className='tiny mono'; priceNow.textContent=`Price: ${money(state.prices[it.id])}`;
    const quick=document.createElement('div'); quick.className='btnbar';
    const minus=document.createElement('button'); minus.textContent='-5'; minus.addEventListener('click',()=>{ qty.value=Math.max(0,(+qty.value||0)-5); qty.dispatchEvent(new Event('input')); });
    const plus=document.createElement('button'); plus.textContent='+5'; plus.addEventListener('click',()=>{ qty.value=(+qty.value||0)+5; qty.dispatchEvent(new Event('input')); });
    quick.append(minus,plus);
    row.append(label, qty, expWrap, priceNow, quick);
    prepGrid.append(row);
  }
}

function updatePrepStats(){
  let total=0, baseCost=0;
  for(const it of selectedItems()){
    const q=state.prepPlan[it.id]||0;
    total+=q;
    baseCost += q * it.cogs;
  }
  const effective = Math.round(baseCost*(state.modifiers.prepCostMult||1)*100)/100;
  const show = state.modifiers.prepCostMult<1 ? `${money(effective)} (base ${money(baseCost)})` : money(baseCost);
  prepCostPill.textContent = `Prep Cost: ${show}`;
  storagePill.textContent = `Storage: ${total} / ${state.storageCap} portions`;
  storagePill.style.color = total>state.storageCap ? 'var(--bad)' : 'var(--muted)';
}

function totalInventoryOnHand(){
  return Object.values(state.inventory).reduce((sum,val)=>sum+(val||0),0);
}

function updateServiceControls(){
  if($pause) $pause.disabled = !state.running;
  if($survey) $survey.disabled = !state.running;
  if($blast) $blast.disabled = !state.running;
  if($special) $special.disabled = !state.running || state.specialActive;
}

function renderSupplyList(force=false){
  if(!supplyList) return;
  if(!force){
    const host = supplyList.closest('.nav-section');
    if(host && !host.classList.contains('nav-active')) return;
  }
  const items=selectedItems();
  if(!items.length){
    supplyList.innerHTML='<div class="tiny muted">Enable menu items to order ingredients during service.</div>';
    return;
  }
  supplyList.innerHTML='';
  items.forEach(it=>{
    if(!state.unlockedItems.has(it.id)) return;
    const stock=state.inventory[it.id]||0;
    const card=document.createElement('div');
    card.className='supply-row';
    const info=document.createElement('div');
    info.innerHTML=`<b>${it.name}</b><div class="tiny muted">Stock ${stock} | COGS ${money(it.cogs)}</div>`;
    const actions=document.createElement('div');
    actions.className='btnbar';
    [5,10].forEach(qty=>{
      const cost = money(Math.round(it.cogs*qty*1.05*100)/100);
      const btn=document.createElement('button');
      btn.className='ghost';
      btn.textContent=`Buy +${qty} (${cost})`;
      btn.addEventListener('click',()=>purchaseSupply(it.id, qty));
      actions.append(btn);
    });
    card.append(info, actions);
    supplyList.append(card);
  });
  const cap=document.createElement('div');
  cap.className='tiny muted supply-cap';
  cap.textContent=`Storage used: ${totalInventoryOnHand()} / ${state.storageCap}`;
  supplyList.append(cap);
}

function refreshSupplyListIfActive(){
  if(!supplyList) return;
  const host=supplyList.closest('.nav-section');
  if(host && host.classList.contains('nav-active')){
    renderSupplyList(true);
  }
}

function purchaseSupply(id, qty){
  const it=getItem(id);
  const amount=Math.max(1, qty|0);
  if(!it || !Number.isFinite(amount)) return;
  if(!state.enabled[it.id]){
    insight(`Enable ${it.name} in Menu & Pricing before buying supplies.`);
    return;
  }
  const total=totalInventoryOnHand();
  if(total + amount > state.storageCap){
    insight('Storage full. Upgrade capacity or sell through inventory before buying more supplies.');
    return;
  }
  const cost = Math.round(it.cogs * amount * 1.05 * 100)/100;
  if(cost > state.cash){
    insight(`Need ${money(cost - state.cash)} more to buy ${amount} ${it.name}.`);
    return;
  }
  state.cash -= cost;
  state.prepSpent += cost;
  state.inventory[id] = (state.inventory[id]||0) + amount;
  log(`Purchased <b>${amount} ${it.name}</b> for ${money(cost)}.`);
  insight(`${it.name}: +${amount} portions stocked instantly.`);
  refreshSupplyListIfActive();
  setKPI();
  syncEconomyUI();
}

function openSpecialModal(){
  if(!state.running){
    insight('Open the truck before launching a Chef Special.');
    return;
  }
  const items=selectedItems();
  if(!items.length){
    insight('Enable at least one menu item first.');
    return;
  }
  specialSelect.innerHTML='';
  items.forEach(it=>{
    const opt=document.createElement('option');
    opt.value=it.id;
    opt.textContent=`${it.name} (${money(state.prices[it.id]||it.basePrice)})`;
    specialSelect.append(opt);
  });
  if(items.length===0){
    const opt=document.createElement('option');
    opt.textContent='No dishes available';
    specialSelect.append(opt);
  }
  specialModal.style.display='grid';
}
function closeSpecialModal(){
  specialModal.style.display='none';
}
function activateChefSpecial(){
  if(!state.running){
    closeSpecialModal();
    insight('Chef Special only runs while the truck is open.');
    return;
  }
  const id=specialSelect.value;
  if(!id){
    insight('Select a dish to spotlight.');
    return;
  }
  state.specialActive=true;
  state.specialItem=id;
  state.specialEnd = state.t + 15;
  updateServiceControls();
  const item=getItem(id);
  log(`<b>Chef Special</b>: Spotlight on ${item.name}!`);
  insight(`Chef Special live: ${item.name} gets extra attention for the next rush (~15s).`);
  closeSpecialModal();
}
function estimateItemDemand(itemId){
  const loc = LOCATIONS[state.locKey];
  const avgTraffic = (loc.baseTraffic[0]+loc.baseTraffic[1])/2;
  const effDay = state.tMax * (state.hard?0.8:1.0);
  const arrivals = avgTraffic * effDay;
  const it = getItem(itemId);
  let interest = 0;
  for(const [segKey,w] of Object.entries(loc.mix)){
    const seg = SEGMENTS[segKey];
    interest += w * (seg.flavorBias[it.flavor] || 1.0) * (1 - Math.max(0, it.spice - ((seg.spicePref+loc.spiceTolerance)/2)));
  }
  interest = Math.max(0.1, interest);
  const onMenu = state.enabled[itemId] ? 1 : 0.5;
  const priceEase = 1 - Math.max(0, (state.prices[itemId] - 14))/6;
  const naiveConv = 0.22 * interest * priceEase * onMenu;
  return Math.max(0, arrivals * naiveConv);
}

/* ---------------------------
   HQ PANELS
----------------------------*/
function renderTruckList(){
  const wrap=$('#truckList'); wrap.innerHTML='';
  const currentIdx = TRUCKS.findIndex(t=>t.id===state.truckId);
  TRUCKS.forEach((truck, idx)=>{
    const card=document.createElement('div'); card.className='shop-card';
    card.innerHTML=`<b>${truck.name}</b><div class="meta">${truck.desc}</div><div class="tiny muted">Storage ${truck.storage} | Staff slots ${truck.staffSlots} | Maintenance ${money(truck.dailyCost)}</div>`;
    const btn=document.createElement('button');
    if(idx===currentIdx){ btn.textContent='Current'; btn.disabled=true; }
    else if(idx<currentIdx){ btn.textContent='Owned'; btn.disabled=true; }
    else{
      btn.textContent=`Buy for ${money(truck.cost)}`;
      btn.addEventListener('click',()=>purchaseTruck(truck.id));
    }
    card.append(btn);
    wrap.append(card);
  });
}

function renderUpgradeList(){
  const wrap=$('#upgradeList'); wrap.innerHTML='';
  UPGRADES.forEach(up=>{
    const card=document.createElement('div'); card.className='shop-card';
    const owned=state.ownedUpgrades.has(up.id);
    card.innerHTML=`<b>${up.name}</b><div class="meta">${up.type} | ${up.desc}</div>`;
    const btn=document.createElement('button');
    if(owned){ btn.textContent='Owned'; btn.disabled=true; }
    else{
      btn.textContent=`Buy for ${money(up.cost)}`;
      btn.addEventListener('click',()=>purchaseUpgrade(up.id));
    }
    card.append(btn);
    wrap.append(card);
  });
}

function renderCampaignList(){
  const wrap=$('#campaignList'); wrap.innerHTML='';
  CAMPAIGNS.forEach(c=>{
    const card=document.createElement('div'); card.className='shop-card';
    card.innerHTML=`<b>${c.name}</b><div class="meta">${c.desc}</div>`;
    const btn=document.createElement('button');
    const disabled = !!state.scheduledCampaign || !!state.activeCampaign;
    btn.textContent=`Schedule (${money(c.cost)})`;
    btn.disabled=disabled;
    if(!disabled){ btn.addEventListener('click',()=>scheduleCampaign(c.id)); }
    card.append(btn);
    wrap.append(card);
  });
}

function renderGoals(){
  const wrap=$('#goalBoard'); wrap.innerHTML='';
  GOALS.forEach(goal=>{
    const card=document.createElement('div'); card.className='goal-card';
    const progress = state.goalProgress[goal.id]?.daysMet || 0;
    const needed = goal.requires.days || 1;
    const pct = Math.min(100, Math.round((progress/needed)*100));
    card.innerHTML = `<b>${goal.name}</b><div class="tiny">${goal.desc}</div><div class="goal-meta">Need ${needed} day(s)</div>`;
    const track=document.createElement('div'); track.className='progress-track';
    const fill=document.createElement('div'); fill.style.width=pct+'%'; track.append(fill);
    card.append(track);
    const btn=document.createElement('button');
    if(state.completedGoals.has(goal.id)){
      btn.textContent='Completed'; btn.disabled=true;
    }else if(state.activeGoals.includes(goal.id)){
      btn.textContent='Tracking (click to drop)';
      btn.addEventListener('click',()=>toggleGoalTracking(goal.id));
    }else if(state.activeGoals.length>=MAX_ACTIVE_GOALS){
      btn.textContent='Track (slots full)'; btn.disabled=true;
    }else{
      btn.textContent='Track Goal';
      btn.addEventListener('click',()=>toggleGoalTracking(goal.id));
    }
    card.append(btn);
    wrap.append(card);
  });
}

function renderStaffList(){
  const wrap=$('#staffList'); wrap.innerHTML='';
  STAFFERS.forEach(staff=>{
    const card=document.createElement('div'); card.className='shop-card';
    const hired=state.staffRoster.includes(staff.id);
    card.innerHTML=`<b>${staff.name}</b><div class="meta">${staff.role} | ${staff.desc}</div><div class="tiny muted">Hire ${money(staff.hireCost)} | Salary ${money(staff.salary)}/day</div>`;
    const btn=document.createElement('button');
    if(hired){
      btn.textContent='Release';
      btn.addEventListener('click',()=>fireStaff(staff.id));
    }else{
      btn.textContent='Hire';
      btn.disabled = state.staffRoster.length >= state.staffSlots;
      btn.addEventListener('click',()=>hireStaff(staff.id));
    }
    card.append(btn);
    wrap.append(card);
  });
  $('#staffSummary').textContent = `${state.staffRoster.length} / ${state.staffSlots} slots filled`;
}

function renderResearchList(){
  const wrap=$('#researchList'); wrap.innerHTML='';
  RESEARCH.forEach(res=>{
    const card=document.createElement('div'); card.className='shop-card';
    const owned=state.researchUnlocked.has(res.id);
    const depsMet = (res.requires||[]).every(dep=>state.researchUnlocked.has(dep));
    card.innerHTML=`<b>${res.name}</b><div class="meta">${res.desc}</div><div class="tiny muted">Cost ${res.cost} RP${res.requires?` | Req: ${res.requires.join(', ')}`:''}</div>`;
    const btn=document.createElement('button');
    if(owned){ btn.textContent='Researched'; btn.disabled=true; }
    else{
      btn.textContent='Research';
      btn.disabled = state.researchPoints < res.cost || !depsMet;
      btn.addEventListener('click',()=>purchaseResearch(res.id));
    }
    card.append(btn);
    wrap.append(card);
  });
  $('#researchPoints').textContent = state.researchPoints;
}

function renderEventPanel(){
  const wrap=$('#eventPanel'); wrap.innerHTML='';
  if(!state.activeEvent){
    wrap.innerHTML='<div class="locked">No city event drawn. Start prep to roll tomorrow\'s vibe.</div>';
    return;
  }
  const evt=state.activeEvent;
  const card=document.createElement('div'); card.className='goal-card';
  card.innerHTML=`<b>${evt.name}</b><div class="tiny">${evt.desc}</div>`;
  evt.options.forEach(opt=>{
    const optCard=document.createElement('div'); optCard.className='option-card'+(state.activeEventChoice===opt.id?' active':'');
    optCard.innerHTML=`<div><b>${opt.label}</b></div><div class="tiny muted">${opt.desc}</div>`;
    const btn=document.createElement('button'); btn.textContent='Choose';
    btn.addEventListener('click',()=>chooseEventOption(evt.id,opt.id));
    optCard.append(btn);
    card.append(optCard);
  });
  wrap.append(card);
  if(state.eventChoiceSummary){
    const summary=document.createElement('div');
    summary.className='event-summary';
    summary.innerHTML=`<div class="tiny muted">${state.eventChoiceSummary.title}</div>
      <div><b>${state.eventChoiceSummary.choice}</b></div>
      <div class="tiny">${state.eventChoiceSummary.effects}</div>`;
    wrap.append(summary);
  }
}

function renderAnalyticsPanel(){
  const wrap=$('#analyticsPanel'); wrap.innerHTML='';
  const lvl=state.analyticsLevel;
  const summary=document.createElement('div'); summary.className='goal-card';
  const tiers=['Level 0: feed only. Unlock insights via staff or research.','Level 1: demand bars & per-item reports.','Level 2+: advanced suggestions and faster probes.'];
  summary.innerHTML=`<b>Analytics Level ${lvl}</b><div class="tiny">${tiers[Math.min(lvl, tiers.length-1)]}</div>`;
  wrap.append(summary);
}

function renderReputationSummary(){
  const summary=Object.entries(state.reputation).map(([seg,val])=>`${SEGMENTS[seg].name} ${Math.round(val*100)}%`).join(' | ');
  $('#reputationSummary').textContent = summary;
}

function renderFinanceLine(){
  const line=$('#financeLine');
  const b=state.dailyCostBreakdown;
  line.textContent = `Daily costs: Rent ${money(b.rent)} | Maintenance ${money(b.maintenance)} | Salaries ${money(b.salaries)} | Loan Int ${money(b.loanInterest)} | Total ${money(b.total)}`;
  const loanText = state.loanBalance>0 ? `Loan balance: ${money(state.loanBalance)}` : 'Loan balance: $0.00';
  $('#loanStatus').textContent = loanText;
  if($loanPayBtn){ $loanPayBtn.disabled = state.loanBalance<=0 || state.cash<500; }
}

function syncEconomyUI(){
  const truck = getTruck(state.truckId);
  const cashText = money(state.cash);
  const dayEl = $('#dayStat');
  if(dayEl) dayEl.textContent = state.day;
  const cashTop = $('#cashStatTop');
  if(cashTop) cashTop.textContent = cashText;
  const truckTop = $('#truckStatTop');
  if(truckTop) truckTop.textContent = truck?.name || 'Unknown';
  const hqCash = $('#hqCash');
  if(hqCash) hqCash.textContent = cashText;
  const hqStorage = $('#hqStorage');
  if(hqStorage) hqStorage.textContent = `${state.storageCap}`;
  const hqTruck = $('#hqTruck');
  if(hqTruck) hqTruck.textContent = truck?.name || 'Unknown';
  const hqUpgrades = $('#hqUpgradeCount');
  if(hqUpgrades) hqUpgrades.textContent = state.ownedUpgrades.size;
  const cogsNote = $('#cogsNote');
  if(cogsNote){
    const discount = state.modifiers.prepCostMult || 1;
    if(discount < 1){
      const pct = Math.round((1-discount)*100);
      cogsNote.textContent = `COGS estimate auto applies in prep. ${pct}% prep discount active.`;
    }else{
      cogsNote.textContent = 'COGS estimate auto applies in prep.';
    }
  }
}

/* ---------------------------
   QUICK COMMAND MENU
----------------------------*/
function buildNavMenu(){
  if(!navLinks) return;
  navLinks.innerHTML='';
  const sections = [...document.querySelectorAll('[data-nav-title]')];
  if(!sections.length){
    navLinks.innerHTML='<div class="tiny muted">No panels registered for quick navigation.</div>';
    return;
  }
  sections.forEach(section=>{
    const title = section.dataset.navTitle || 'Panel';
    const desc = section.dataset.navDesc || '';
    const card=document.createElement('button');
    card.type='button';
    card.className='nav-card';
    card.innerHTML=`<b>${title}</b><div class="nav-desc">${desc}</div>`;
    card.addEventListener('click',()=>{
      closeNavMenu();
      if(section.classList.contains('nav-section')){
        showNavSection(section.id);
        requestAnimationFrame(()=>section.scrollIntoView({behavior:'smooth', block:'start'}));
      }else{
        requestAnimationFrame(()=>{
          section.scrollIntoView({behavior:'smooth', block:'start'});
          highlightSection(section);
        });
      }
    });
    navLinks.append(card);
  });
}
function openNavMenu(){
  if(navModal){
    buildNavMenu();
    navModal.style.display='grid';
  }
}
function closeNavMenu(){
  if(navModal){
    navModal.style.display='none';
  }
}

function highlightSection(section){
  if(!section) return;
  section.classList.add('nav-highlight');
  setTimeout(()=>section.classList.remove('nav-highlight'), 1200);
}

let activeNavId=null;
function showNavSection(sectionId, opts={}){
  const target=document.getElementById(sectionId);
  if(!target) return;
  document.querySelectorAll('.nav-section').forEach(el=>el.classList.remove('nav-active'));
  target.classList.add('nav-active');
  activeNavId = sectionId;
  if(navStageTitle){ navStageTitle.textContent = target.dataset.navTitle || target.querySelector('b')?.textContent || 'Control Panel'; }
  if(navStageDesc){ navStageDesc.textContent = target.dataset.navDesc || ''; }
  if(supplyList && target.contains(supplyList)){
    renderSupplyList(true);
  }
  if(!opts.silent){ highlightSection(target); }
}

/* ---------------------------
   ECONOMY ACTIONS
----------------------------*/
function purchaseTruck(id){
  const target=getTruck(id);
  if(!target) return;
  const currentIdx=TRUCKS.findIndex(t=>t.id===state.truckId);
  const targetIdx=TRUCKS.findIndex(t=>t.id===id);
  if(targetIdx<=currentIdx) return;
  if(state.cash < target.cost){ insight(`Need ${money(target.cost - state.cash)} more for ${target.name}.`); return; }
  state.cash -= target.cost;
  state.truckId = id;
  calcModifiers();
  syncEconomyUI();
  renderTruckList();
  renderStaffList();
  insight(`Upgraded to ${target.name}. Storage now ${state.storageCap} portions.`);
}

function purchaseUpgrade(id){
  const up=getUpgrade(id);
  if(!up || state.ownedUpgrades.has(id)) return;
  if(state.cash < up.cost){ insight(`Need ${money(up.cost - state.cash)} more for ${up.name}.`); return; }
  state.cash -= up.cost;
  state.ownedUpgrades.add(id);
  if(up.effects && up.effects.unlockItems){ unlockItems(up.effects.unlockItems); }
  calcModifiers();
  syncEconomyUI();
  renderUpgradeList();
  renderStaffList();
  updatePrepStats();
  insight(`Upgrade purchased: ${up.name}.`);
}

function unlockItems(ids, announce=true){
  const added=[];
  (ids||[]).forEach(id=>{
    if(!state.unlockedItems.has(id)){
      state.unlockedItems.add(id);
      state.enabled[id]=false;
      state.prepPlan[id]=0;
      state.inventory[id]=0;
      added.push(getItem(id)?.name || id);
    }
  });
  if(added.length && announce){
    insight(`New menu items unlocked: ${added.join(', ')}.`);
    buildMenu();
    renderPrepRows();
    renderSupplyList(true);
  }else if(added.length){
    renderSupplyList(true);
  }
}

function scheduleCampaign(id){
  const campaign=getCampaign(id);
  if(!campaign) return;
  if(state.scheduledCampaign){ insight('Campaign already scheduled.'); return; }
  if(state.cash < campaign.cost){ insight(`Need ${money(campaign.cost - state.cash)} more for ${campaign.name}.`); return; }
  state.cash -= campaign.cost;
  state.scheduledCampaign = campaign;
  syncEconomyUI();
  updateCampaignStatus();
  renderCampaignList();
  insight(`${campaign.name} booked. It will apply next day.`);
}

function applyCampaignForDay(){
  if(state.scheduledCampaign){
    state.activeCampaign = state.scheduledCampaign;
    state.scheduledCampaign = null;
    state.campaignEffects = Object.assign({}, state.activeCampaign.effect || {});
    log(`<b>${state.activeCampaign.name}</b> campaign live all day.`);
  }else{
    state.activeCampaign = null;
    state.campaignEffects = {};
  }
  updateCampaignStatus();
  renderCampaignList();
}

function ensureEventForDay(){
  if(state.activeEvent) return;
  state.activeEvent = EVENTS[Math.floor(Math.random()*EVENTS.length)];
  state.activeEventChoice = null;
  state.eventEffects = {};
  state.eventChoiceSummary = null;
  renderEventPanel();
}

function chooseEventOption(eventId, optionId){
  const evt=getEventById(eventId);
  if(!evt) return;
  const opt=evt.options.find(o=>o.id===optionId);
  if(!opt) return;
  state.activeEventChoice = optionId;
  state.eventEffects = {};
  accumulateEventEffects(opt.effects||{});
  state.eventChoiceSummary = {
    title: evt.name,
    choice: opt.label,
    desc: opt.desc,
    effects: describeEventEffects(opt.effects)
  };
  renderEventPanel();
  if(state.pendingPrepStart){
    beginPrepPlanning();
  }
  syncEconomyUI();
  insight(`${evt.name}: chose ${opt.label}.`);
}

function accumulateEventEffects(effects){
  const dayKeys=['traffic','priceSlack','foodieTilt','officeTilt','familyTilt','spiceTolerance','throughput'];
  Object.entries(effects||{}).forEach(([key,val])=>{
    if(key==='cash'){ state.cash += val; }
    else if(key==='reputation'){ Object.entries(val).forEach(([seg,delta])=>adjustReputation(seg,delta)); }
    else if(dayKeys.includes(key)){ state.eventEffects[key] = (state.eventEffects[key]||0) + val; }
  });
  syncEconomyUI();
}

function describeEventEffects(effects){
  if(!effects) return 'No immediate effect.';
  const parts=[];
  if(typeof effects.cash === 'number' && effects.cash!==0){
    const sign = effects.cash>0?'+':'-';
    parts.push(`Cash ${sign}${money(Math.abs(effects.cash))}`);
  }
  if(typeof effects.traffic === 'number' && effects.traffic!==0){
    parts.push(`Traffic ${effects.traffic>0?'+':''}${Math.round(effects.traffic*100)}%`);
  }
  if(typeof effects.priceSlack === 'number' && effects.priceSlack!==0){
    parts.push(`Price tolerance ${effects.priceSlack>0?'+':''}${Math.round(effects.priceSlack*100)}%`);
  }
  const tiltMap={foodieTilt:'foodie', officeTilt:'office', familyTilt:'family'};
  Object.entries(tiltMap).forEach(([key,seg])=>{
    if(typeof effects[key] === 'number' && effects[key]!==0){
      parts.push(`${SEGMENTS[seg].name} mix ${effects[key]>0?'+':''}${Math.round(effects[key]*100)}%`);
    }
  });
  if(typeof effects.spiceTolerance === 'number' && effects.spiceTolerance!==0){
    parts.push(`Spice tolerance ${effects.spiceTolerance>0?'+':''}${Math.round(effects.spiceTolerance*100)}%`);
  }
  if(typeof effects.throughput === 'number' && effects.throughput!==0){
    parts.push(`Throughput ${effects.throughput>0?'+':''}${Math.round(effects.throughput*100)}%`);
  }
  if(effects.reputation){
    const reps = Object.entries(effects.reputation).map(([seg,val])=>`${SEGMENTS[seg].name} ${val>0?'+':''}${Math.round(val*100)}%`);
    if(reps.length) parts.push(`Reputation ${reps.join(', ')}`);
  }
  return parts.length ? parts.join(' | ') : 'No immediate effect.';
}

function clearEventEffects(){
  state.activeEvent = null;
  state.activeEventChoice = null;
  state.eventEffects = {};
  state.eventChoiceSummary = null;
  renderEventPanel();
}

function hireStaff(id){
  const staff=getStaffer(id);
  if(!staff || state.staffRoster.includes(id)) return;
  if(state.staffRoster.length >= state.staffSlots){ insight('No free staff slots. Upgrade truck or release someone.'); return; }
  if(state.cash < staff.hireCost){ insight(`Need ${money(staff.hireCost - state.cash)} more to hire ${staff.name}.`); return; }
  state.cash -= staff.hireCost;
  state.staffRoster.push(id);
  calcModifiers();
  syncEconomyUI();
  renderStaffList();
  renderAnalyticsPanel();
  insight(`${staff.name} joined the crew.`);
}

function fireStaff(id){
  state.staffRoster = state.staffRoster.filter(s=>s!==id);
  calcModifiers();
  syncEconomyUI();
  renderStaffList();
  renderAnalyticsPanel();
  insight(`Released ${getStaffer(id)?.name || 'staffer'}.`);
}

function purchaseResearch(id){
  const tech=getResearch(id);
  if(!tech || state.researchUnlocked.has(id)) return;
  const depsMet=(tech.requires||[]).every(dep=>state.researchUnlocked.has(dep));
  if(!depsMet){ insight('Research requirement not met.'); return; }
  if(state.researchPoints < tech.cost){ insight('Not enough research points.'); return; }
  state.researchPoints -= tech.cost;
  state.researchUnlocked.add(id);
  calcModifiers();
  renderResearchList();
  renderAnalyticsPanel();
  renderPrepRows();
  insight(`Researched ${tech.name}.`);
  syncEconomyUI();
}

function toggleGoalTracking(id){
  if(state.completedGoals.has(id)) return;
  if(state.activeGoals.includes(id)){
    state.activeGoals = state.activeGoals.filter(g=>g!==id);
  }else{
    if(state.activeGoals.length>=MAX_ACTIVE_GOALS) return;
    state.activeGoals.push(id);
    state.goalProgress[id] = state.goalProgress[id] || {daysMet:0};
  }
  renderGoals();
}

function updateGoalsFromDay(metrics){
  state.activeGoals.forEach(goalId=>{
    const goal=getGoal(goalId);
    if(!goal) return;
    const req=goal.requires||{};
    let success=true;
    if(req.revenue && metrics.revenue < req.revenue) success=false;
    if(req.profit && metrics.profit < req.profit) success=false;
    if(req.satisfaction && metrics.satisfaction < req.satisfaction) success=false;
    if(req.sellThrough && metrics.sellThrough < req.sellThrough) success=false;
    if(req.location && metrics.location !== req.location) success=false;
    const prog=state.goalProgress[goalId] || {daysMet:0};
    if(success){
      prog.daysMet += 1;
      state.goalProgress[goalId]=prog;
      if(prog.daysMet >= (req.days||1)){
        completeGoal(goal);
      }
    }else if(req.resetOnFail){
      prog.daysMet = 0;
      state.goalProgress[goalId]=prog;
    }
  });
  renderGoals();
}

function completeGoal(goal){
  insight(`Goal complete: ${goal.name}! Rewards applied.`);
  state.completedGoals.add(goal.id);
  state.activeGoals = state.activeGoals.filter(id=>id!==goal.id);
  const rewards=goal.rewards||{};
  if(rewards.cash){ state.cash += rewards.cash; }
  if(rewards.research){ state.researchPoints += rewards.research; }
  if(rewards.reputation){ Object.entries(rewards.reputation).forEach(([seg,val])=>adjustReputation(seg,val)); }
  if(rewards.unlockItems){ unlockItems(rewards.unlockItems); }
  calcModifiers();
  syncEconomyUI();
  renderResearchList();
  renderGoals();
}

function payLoan(){
  if(state.loanBalance<=0 || state.cash<500) return;
  const amount=Math.min(500, state.loanBalance);
  state.loanBalance -= amount;
  state.cash -= amount;
  insight(`Loan payment ${money(amount)} sent.`);
  calcDailyCosts();
  syncEconomyUI();
}

function applyDailyCharges(){
  const due=calcDailyCosts();
  if(due>0){
    state.cash -= due;
    log(`Paid daily costs ${money(due)} (rent ${money(state.dailyCostBreakdown.rent)}, salaries ${money(state.dailyCostBreakdown.salaries)}).`, 'tiny');
    coverNegativeCash();
  }
}

function coverNegativeCash(){
  if(state.cash >= 0) return;
  const needed = Math.abs(state.cash);
  state.loanBalance += needed;
  state.cash = 0;
  insight(`Emergency loan taken for ${money(needed)}.`);
  calcDailyCosts();
}

if($loanPayBtn){ $loanPayBtn.addEventListener('click', payLoan); }

/* ---------------------------
   GAME FLOW
----------------------------*/
$('#duration').addEventListener('change', e => {
  state.tMax = parseInt(e.target.value,10) || 60;
  state.dayLength = Math.round(state.tMax * (state.hard?0.8:1.0));
  setTimeBar();
});
$('#location').addEventListener('change', e => { state.locKey = e.target.value; });
$('#hardMode').addEventListener('change', e => {
  state.hard = !!e.target.checked;
  state.dayLength = Math.round(state.tMax * (state.hard?0.8:1.0));
  setTimeBar();
});

$start.addEventListener('click', startDayFlow);
$pause.addEventListener('click', togglePause);
$survey.addEventListener('click', runSurvey);
$blast.addEventListener('click', promoBlast);
$('#cancelPrep').addEventListener('click', ()=>closePrepPlanner());
$('#confirmPrep').addEventListener('click', confirmPrepAndOpen);
if(navOpenBtn){ navOpenBtn.addEventListener('click', openNavMenu); }
if(navStageBtn){ navStageBtn.addEventListener('click', openNavMenu); }
if(navCloseBtn){ navCloseBtn.addEventListener('click', closeNavMenu); }
if(navModal){
  navModal.addEventListener('click', e=>{ if(e.target===navModal) closeNavMenu(); });
}
document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && navModal && navModal.style.display==='grid'){ closeNavMenu(); }
});

const initialNavSection = document.querySelector('.nav-section[data-nav-default]') || document.querySelector('.nav-section');
if(initialNavSection){ showNavSection(initialNavSection.id, {silent:true}); }

if($special){ $special.addEventListener('click', openSpecialModal); }
if(specialCancel){ specialCancel.addEventListener('click', closeSpecialModal); }
if(specialConfirm){ specialConfirm.addEventListener('click', activateChefSpecial); }
if(specialModal){
  specialModal.addEventListener('click', e=>{ if(e.target===specialModal) closeSpecialModal(); });
}

buildMenu();
renderSupplyList(true);
setKPI();
syncEconomyUI();
renderTruckList();
renderUpgradeList();
renderCampaignList();
renderGoals();
renderStaffList();
renderResearchList();
renderEventPanel();
renderAnalyticsPanel();
renderReputationSummary();
updateCampaignStatus();
let loopHandle=null;

function startDayFlow(){
  if(state.running){ resetDay(); }
  ensureEventForDay();
  state.pendingPrepStart=true;
  if(typeof showNavSection === 'function'){ showNavSection('eventsPanel'); }
  if(state.activeEvent && !state.activeEventChoice){
    insight('City event triggered. Choose a response before planning prep.');
    return;
  }
  beginPrepPlanning();
}

function confirmPrepAndOpen(){
  if(state.activeEvent && !state.activeEventChoice){
    insight('Resolve the city event before opening.');
    return;
  }
  const items=selectedItems();
  if(!items.length){
    insight('Enable at least one menu item in Menu & Pricing before starting the day.');
    return;
  }
  let total=0, baseCost=0;
  for(const it of items){
    const q=Math.max(0, Math.floor(state.prepPlan[it.id]||0));
    total+=q;
    baseCost += q * it.cogs;
  }
  if(total>state.storageCap){
    insight('Storage capacity exceeded. Reduce portions or buy storage upgrades.');
    return;
  }
  const prepCost=Math.round(baseCost*(state.modifiers.prepCostMult||1));
  if(prepCost>state.cash){
    insight('Not enough cash to prep that much inventory.');
    return;
  }

  state.prepSpent=0;
  for(const it of ITEMS){
    const enabled = state.unlockedItems.has(it.id) && state.enabled[it.id];
    const q = enabled ? Math.max(0, Math.floor(state.prepPlan[it.id]||0)) : 0;
    state.inventory[it.id]=q;
    if(enabled) state.prepSpent += q * it.cogs;
    else state.prepPlan[it.id]=0;
  }
  const effectivePrep=Math.round(state.prepSpent*(state.modifiers.prepCostMult||1));
  state.prepSpent=effectivePrep;
  state.cash -= effectivePrep;
  coverNegativeCash();

  applyDailyCharges();
  applyCampaignForDay();

  resetStats();
  state.running=true; state.paused=false;
  $start.textContent='Restart Day';
  $pause.disabled=false; $survey.disabled=false; $blast.disabled=false;
  const loc=LOCATIONS[state.locKey];
  log(`<b>Opened at ${state.locKey}</b> - ${mixLabel(loc.mix)}. Prep ${money(state.prepSpent)}.`, 'tiny');
  renderSupplyList(true);
  closePrepPlanner();
  loopHandle=setInterval(tick, state.tickMs);
}

function togglePause(){ if(!state.running) return; state.paused=!state.paused; $pause.textContent = state.paused ? 'Resume' : 'Pause'; }

function resetStats(){
  state.t=0;
  state.revenue=0;
  state.customers=0;
  state.served=0;
  state.walked=0;
  state.metrics=initMetrics();
  feed.innerHTML=''; insightsEl.innerHTML='';
  state.dayLength=Math.round(state.tMax * (state.hard?0.8:1.0));
  state.surveyBoost=null;
  state.surveyBoostEnd=0;
  state.nextSurvey=0;
  setKPI(); setTimeBar(); crowdHint.textContent='Crowd: observing...';
}
function resetDay(stopLoop=true){
  if(stopLoop && loopHandle){ clearInterval(loopHandle); loopHandle=null; }
  state.running=false;
  state.paused=false;
  state.surveyBoost=null;
  state.surveyBoostEnd=0;
  state.nextSurvey=0;
  state.pendingPrepStart=false;
  $pause.disabled=true; $survey.disabled=true; $blast.disabled=true;
}

/* ---------------------------
   DAILY LOOP
----------------------------*/
function tick(){
  if(state.paused) return;
  state.t++;
  if(state.specialActive && state.t >= state.specialEnd){
    const specialName = state.specialItem ? getItem(state.specialItem)?.name : null;
    state.specialActive=false;
    state.specialItem=null;
    state.specialEnd=0;
    log('<span class="tiny">Chef Special ended.</span>');
    if(specialName){ insight(`Chef Special for ${specialName} wrapped up. Queue another when needed.`); }
    updateServiceControls();
  }
  if(state.nextServiceHint && state.t >= state.nextServiceHint){
    pulseServiceHint();
  }
  const locBase = LOCATIONS[state.locKey] || LOCATIONS.downtown;
  const mix = adjustMixWithCampaign(locBase.mix);
  const promoBoost = state.promo?1.25:1.0;
  const marketingBoost = (state.modifiers.marketing||1) * (1 + (state.campaignEffects.traffic||0) + (state.eventEffects.traffic||0));
  const throughput = (state.modifiers.throughput||1) + (state.eventEffects.throughput||0);
  const traffic = randRange(locBase.baseTraffic[0], locBase.baseTraffic[1]) * promoBoost * marketingBoost * throughput;
  const arrivals = poisson(Math.max(0.1, traffic));
  for(let i=0;i<arrivals;i++){ spawnCustomer(locBase, mix); }
  if(state.promo && state.t >= state.promoEnd){ state.promo=false; log('<span class="tiny">Promo ended.</span>'); }
  setTimeBar();
  if(state.t >= state.dayLength){
    resetDay();
    log('<b>Closed for the day.</b>');
    endReport();
  }
}

function adjustMixWithCampaign(baseMix){
  const mix={...baseMix};
  Object.keys(mix).forEach(seg=>{
    const rep = (state.reputation[seg]||0.5);
    mix[seg] = mix[seg] * (1 + (rep-0.5)*0.4);
  });
  if(state.campaignEffects.foodieTilt) mix.foodie = (mix.foodie||0)+state.campaignEffects.foodieTilt;
  if(state.campaignEffects.officeTilt) mix.office = (mix.office||0)+state.campaignEffects.officeTilt;
  if(state.eventEffects.foodieTilt) mix.foodie = (mix.foodie||0)+state.eventEffects.foodieTilt;
  if(state.eventEffects.officeTilt) mix.office = (mix.office||0)+state.eventEffects.officeTilt;
  if(state.eventEffects.familyTilt) mix.family = (mix.family||0)+state.eventEffects.familyTilt;
  const sum=Object.values(mix).reduce((a,b)=>a+b,0);
  Object.keys(mix).forEach(k=>{ mix[k]=mix[k]/sum; });
  return mix;
}

function spawnCustomer(locBase, mix){
  const segKey=weightedPick(mix);
  const seg=SEGMENTS[segKey];
  const wtpAdj = 1 + (state.modifiers.priceSlack||0) + (state.campaignEffects.priceSlack||0) + (state.eventEffects.priceSlack||0);
  const repAdj = 1 + ((state.reputation[segKey]||0.5)-0.5)*0.15;
  const priceSensitivity = locBase.priceSensitivity;
  const wtp = normal(seg.wtpMean * (state.hard?0.97:1.0), seg.wtpVar) * priceSensitivity * wtpAdj * repAdj;
  const spiceTol = locBase.spiceTolerance + (state.eventEffects.spiceTolerance||0) + (state.modifiers.spiceTolerance||0);
  const spiceOk = (seg.spicePref + spiceTol)/2;
  const choices=Object.entries(state.enabled).filter(([id,on])=>on && state.unlockedItems.has(id)).map(([id])=>id);
  state.customers++;
  if(!choices.length){
    state.walked++;
    log(`Customer left - no active menu items. (${seg.name})`);
    adjustReputation(segKey,-0.01);
    refreshSupplyListIfActive();
    return;
  }
  let best=null, bestScore=-Infinity;
  const pollActive = state.surveyBoost && state.t <= state.surveyBoostEnd;
  for(const id of choices){
    const it=getItem(id);
    const price=state.prices[id];
    const priceFit = 1 - Math.max(0, (price - wtp))/8;
    const flavorBias = seg.flavorBias[it.flavor] || 1.0;
    const spicePenalty = it.spice > spiceOk ? (it.spice - spiceOk)*1.4 : 0;
    let score = (priceFit*1.1) + (flavorBias*0.25) - spicePenalty + randRange(-0.15,0.15);
    if(state.specialActive && state.specialItem === it.id) score += 0.25;
    if(pollActive){
      if(state.surveyBoost.segment === segKey) score += 0.12;
      if(state.surveyBoost.flavor === it.flavor) score += 0.08;
    }
    state.metrics[id].views++;
    if(score>bestScore){ bestScore=score; best=it; }
  }
  const price=state.prices[best.id];
  const effectivePrice = Math.max(best.min, state.promo ? price - 1 : price);
  const spiceReject = best.spice > ((SEGMENTS[segKey].spicePref + (locBase.spiceTolerance + (state.eventEffects.spiceTolerance||0)))/2 + randRange(-0.05,0.05));
  if(spiceReject && Math.random()<0.3){
    state.walked++; state.metrics[best.id].rejectSpice++; log(`<span class="bad">Too spicy</span> for ${seg.name}. They passed on ${best.name}.`);
    adjustReputation(segKey,-0.012);
    updateCrowdHint(); setKPI(); refreshSupplyListIfActive(); return;
  }
  if(state.inventory[best.id]<=0){
    state.walked++; state.metrics[best.id].stockouts++; log(`<span class="alert">Stock out</span>: ${seg.name} wanted ${best.name}.`);
    adjustReputation(segKey,-0.01);
    updateCrowdHint(); setKPI(); refreshSupplyListIfActive(); return;
  }
  let buyProb = sigmoid((bestScore-0.35)*3) * sigmoid(((best.max - effectivePrice)/(best.max - best.min + 0.01))*2);
  if(state.specialActive && state.specialItem===best.id) buyProb *= 1.1;
  if(Math.random()<buyProb){
    state.inventory[best.id]=Math.max(0, state.inventory[best.id]-1);
    state.served++;
    state.revenue += effectivePrice;
    state.cash += effectivePrice;
    state.metrics[best.id].buys++;
    state.metrics[best.id].priceHistory.push({price:effectivePrice, bought:true});
    log(`Sold <b>${best.name}</b> @ ${money(effectivePrice)} (${seg.name}) - stock ${state.inventory[best.id]}`);
    adjustReputation(segKey,0.006);
  }else{
    state.walked++;
    const tooExp = effectivePrice > wtp + randRange(0.2,0.8);
    if(tooExp){ state.metrics[best.id].rejectTooExp++; adjustReputation(segKey,-0.008); }
    state.metrics[best.id].priceHistory.push({price:effectivePrice, bought:false});
    log(`${tooExp?'Price pushback':'Skipped'}: ${seg.name} passed on ${best.name} @ ${money(effectivePrice)}.`);
  }
  updateCrowdHint(); setKPI(); syncEconomyUI(); refreshSupplyListIfActive();
}

/* ---------------------------
   INSIGHTS & REPORTING
----------------------------*/
function livePriceProbe(id, price){
  const segWeight = LOCATIONS[state.locKey].mix;
  let rel=0;
  for(const [segKey,w] of Object.entries(segWeight)){
    const s=SEGMENTS[segKey]; rel += w * (price - s.wtpMean);
  }
  if(rel>1) insight(`${getItem(id).name}: feels expensive for this crowd. Test -$0.5.`);
  else if(rel<-1) insight(`${getItem(id).name}: room to nudge +$0.5.`);
}

function runSurvey(){
  if(!state.running) return;
  if(state.t < (state.nextSurvey||0)){
    const wait = Math.max(1, state.nextSurvey - state.t);
    insight(`Quick Poll cooling down. ${wait}s until the next poll is ready.`);
    return;
  }
  const loc=LOCATIONS[state.locKey];
  const hot=hottestSegment(loc.mix);
  const favored=Object.entries(SEGMENTS[hot].flavorBias).sort((a,b)=>b[1]-a[1])[0][0];
  state.surveyBoost={segment:hot, flavor:favored};
  state.surveyBoostEnd = state.t + 15 + Math.min(5, state.analyticsLevel*2);
  state.nextSurvey = state.t + 25;
  crowdHint.textContent=`Crowd: ${SEGMENTS[hot].name} | Craving ${favored}`;
  insight(`Quick Poll: ${SEGMENTS[hot].name} crave ${favored} flavors. Matching items get bonus demand for a short window.`);
}

function pulseServiceHint(){
  state.nextServiceHint = state.t + 15;
  const lowStock = selectedItems().find(it => (state.inventory[it.id]||0) <= Math.max(2, Math.round((state.prepPlan[it.id]||0)*0.2)));
  if(lowStock){
    insight(`Pulse: ${lowStock.name} is running low (${state.inventory[lowStock.id]} left). Restock or pivot the Chef Special.`);
    return;
  }
  if(state.walked && state.walked > state.served*0.4){
    insight('Pulse: Too many walkaways. Try Promo, Chef Special, or nudge prices.');
    return;
  }
  const flavor = topFlavor();
  if(flavor){
    insight(`Pulse: ${flavor} flavors converting best. Spotlight a matching dish.`);
  }else{
    insight('Pulse: Crowd still feeling things out. Poll again or adjust prices mid-rush.');
  }
}

function promoBlast(){
  if(!state.running) return;
  state.promo=true;
  state.promoEnd=state.t + state.modifiers.promoDuration;
  log('<b>Promo</b>: $1 off for a short burst.');
}

function endReport(){
  const satisfaction = state.customers? Math.round(100*state.served/state.customers):0;
  const runItems = selectedItems();
  const totalPrepared = runItems.reduce((a,it)=>a+(state.prepPlan[it.id]||0),0);
  const totalSold = runItems.reduce((a,it)=>a+(state.metrics[it.id].buys||0),0);
  const sellThrough = totalPrepared? totalSold/totalPrepared : 0;
  const totalWaste = totalPrepared - totalSold;
  const netProfit = state.revenue - state.prepSpent - state.dailyCostBreakdown.total;
  state.sellThroughHistory.push(sellThrough);

  const lines=[];
  lines.push(`<div class="mono">Day ${state.day} @ <b>${state.locKey}</b></div>`);
  lines.push('<div class="sep"></div>');
  lines.push(`<div>Served <b>${state.served}</b> / ${state.customers} customers - Walkaways: <span class="bad">${state.walked}</span></div>`);
  lines.push(`<div>Revenue ${money(state.revenue)} - Prep ${money(state.prepSpent)} - Fixed ${money(state.dailyCostBreakdown.total)} - <b>Net ${money(netProfit)}</b> - Satisfaction ${satisfaction}%</div>`);
  lines.push(`<div>Prepared ${totalPrepared} - Sold ${totalSold} - Waste <span class="alert">${Math.max(0,totalWaste)}</span> - Sell-through ${Math.round(sellThrough*100)}%</div>`);
  if(state.analyticsLevel>0){
    lines.push('<div class="sep"></div><b>Per-Item Performance</b>');
    for(const it of runItems){
      const m=state.metrics[it.id];
      const prepared=state.prepPlan[it.id]||0;
      const sold=m.buys||0;
      const wasted=Math.max(0, prepared - sold);
      const conv=m.views? Math.round(100*m.buys/m.views):0;
      lines.push(`<div class="tiny">- ${it.name}: Prepped ${prepared} | Sold ${sold} | Waste <span class="${wasted?'alert':'good'}">${wasted}</span> | Conv ${conv}% | Too-exp ${m.rejectTooExp}</div>`);
    }
    lines.push('<div class="sep"></div><b>Suggested Adjustments</b>');
    suggestAdjustments().forEach(r=>lines.push(`<div class="tiny">- ${r}</div>`));
  }else{
    lines.push('<div class="sep"></div><div class="tiny muted">Unlock Market Insights to view per-item analytics.</div>');
  }
  lines.push(`<div class="sep"></div><div class="tiny">Research Points: <b>${state.researchPoints}</b> | Cash after day: <b>${money(state.cash)}</b></div>`);
  lines.push(`<div class="tiny">Reputation -> ${Object.entries(state.reputation).map(([seg,val])=>`${SEGMENTS[seg].name} ${Math.round(val*100)}%`).join(' | ')}</div>`);
  reportEl.innerHTML=lines.join('');
  renderSupplyList(true);
  if(typeof showNavSection === 'function'){
    showNavSection('insightsPanel');
  }

  updateGoalsFromDay({
    revenue:state.revenue,
    profit:netProfit,
    satisfaction,
    sellThrough,
    location:state.locKey,
    cash:state.cash
  });

  state.day += 1;
  state.activeCampaign = null;
  state.campaignEffects = {};
  clearEventEffects();
  updateCampaignStatus();
  renderCampaignList();
  syncEconomyUI();
  renderAnalyticsPanel();
}

function suggestAdjustments(){
  if(state.analyticsLevel===0) return [];
  const recs=[];
  for(const it of selectedItems()){
    const m=state.metrics[it.id];
    const prepared=state.prepPlan[it.id]||0;
    const sold=m.buys||0;
    const wasted=Math.max(0, prepared - sold);
    const eff=prepared? (sold/prepared):0;
    if(wasted >= Math.ceil((prepared||0)*0.25)) recs.push(`${it.name}: high waste - cut prep by ${Math.ceil(wasted*0.5)}.`);
    if(eff>0.9 && state.prices[it.id] <= it.max-1) recs.push(`${it.name}: strong demand - try +$0.5.`);
    if(m.rejectTooExp > (m.buys||1)*0.6) recs.push(`${it.name}: price pushback - test -$0.5.`);
    if(m.rejectSpice > (m.buys||1)*0.5) recs.push(`${it.name}: crowd dislikes spice here - consider toggling off.`);
    if(m.stockouts>=3) recs.push(`${it.name}: frequent stockouts - add ${Math.ceil(m.stockouts*1.5)} portions.`);
  }
  if(!recs.length) recs.push('Good balance today. Keep prices steady; nudge +$0.5 on the best seller.');
  return recs;
}

function adjustReputation(segKey, delta){
  if(!SEGMENTS[segKey]) return;
  const gainBoost = 1 + (state.modifiers.repGain||0);
  state.reputation[segKey] = clamp((state.reputation[segKey]||0.5) + delta*gainBoost, 0.2, 0.95);
  renderReputationSummary();
}

function updateCampaignStatus(){
  const status=$('#campaignStatus');
  if(state.activeCampaign){ status.textContent=`Campaign active: ${state.activeCampaign.name}`; }
  else if(state.scheduledCampaign){ status.textContent=`Campaign scheduled: ${state.scheduledCampaign.name}`; }
  else{ status.textContent='No campaign scheduled.'; }
}

function updateCrowdHint(){
  const loc=LOCATIONS[state.locKey];
  const hot=hottestSegment(loc.mix);
  const flavor=topFlavor();
  crowdHint.textContent=`Crowd: ${SEGMENTS[hot].name} | Leaning: ${flavor || 'unknown'}`;
}
function topFlavor(){
  const scores={};
  for(const it of selectedItems()){
    const m=state.metrics[it.id];
    if(!m.views) continue;
    const conv=m.buys/m.views;
    scores[it.flavor]=(scores[it.flavor]||0)+conv;
  }
  let best=null, bestV=-1;
  for(const [k,v] of Object.entries(scores)){ if(v>bestV){ best=k; bestV=v; } }
  return best;
}

function setKPI(){
  $('#rev').textContent=money(state.revenue);
  $('#profit').textContent=money(state.revenue - state.prepSpent - state.dailyCostBreakdown.total);
  $('#sat').textContent = state.customers? Math.round((state.served/state.customers)*100)+'%' : '--';
}
function setTimeBar(){
  const length=state.dayLength || state.tMax;
  const p=Math.min(100, (state.t/Math.max(1,length))*100);
  $('#timeBar').style.width=p+'%';
}

window.addEventListener('beforeunload', ()=>{ if(loopHandle) clearInterval(loopHandle); });
