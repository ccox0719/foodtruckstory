const ITEMS = [
  { id:'bbq',    name:'Classic BBQ',          basePrice:13,   min:10, max:16, cogs:3.6, flavor:'savory', spice:0.2,  unlock:'base' },
  { id:'thai',   name:'Bangkok Peanut',       basePrice:13,   min:10, max:16, cogs:2.9, flavor:'umami',  spice:0.5,  unlock:'base' },
  { id:'carib',  name:'Caribbean Jerk',       basePrice:13,   min:10, max:16, cogs:3.1, flavor:'bright', spice:0.7,  unlock:'base' },
  { id:'taco',   name:'Smoky Street Tacos',   basePrice:12.5, min:9,  max:16, cogs:2.8, flavor:'savory', spice:0.45, unlock:'base' },
  { id:'noodle', name:'Ginger Sesame Noodles',basePrice:13.5, min:10, max:17, cogs:3.2, flavor:'bright', spice:0.25, unlock:'base' },
  { id:'gyro',   name:'Mediterranean Gyro',   basePrice:14,   min:10, max:17, cogs:3.4, flavor:'savory', spice:0.3,  unlock:'base' },
  { id:'fusion', name:'Seoul Heat Melt',      basePrice:15,   min:11, max:18, cogs:3.8, flavor:'umami',  spice:0.85, unlock:'fusion_lab' },
  { id:'veggie', name:'Green Goddess Wrap',   basePrice:12.5, min:9,  max:16, cogs:3.0, flavor:'bright', spice:0.15, unlock:'green_partner' }
];

const LOCATIONS = {
  downtown: {
    mix:{office:0.7, foodie:0.2, family:0.1},
    baseTraffic:[1.5, 1.45],
    priceSensitivity:1.12,
    spiceTolerance:0.62,
    speedBias:1.18
  },
  park: {
    mix:{office:0.1, foodie:0.2, family:0.7},
    baseTraffic:[1.2, 1.25],
    priceSensitivity:1.08,
    spiceTolerance:0.45,
    speedBias:1.0
  },
  festival: {
    mix:{office:0.2, foodie:0.6, family:0.2},
    baseTraffic:[1.35, 1.65],
    priceSensitivity:1.15,
    spiceTolerance:0.82,
    speedBias:1.08
  }
};

const SEGMENTS = {
  office: { name:'Office',  wtpMean:15.8, wtpVar:2.5, spicePref:0.48, flavorBias:{savory:1.15, umami:1.05, bright:0.95} },
  family: { name:'Families',wtpMean:13.3, wtpVar:2.0, spicePref:0.32, flavorBias:{savory:1.12, umami:0.98, bright:1.08} },
  foodie: { name:'Foodies', wtpMean:16.9, wtpVar:3.0, spicePref:0.78, flavorBias:{savory:1.05, umami:1.1, bright:1.15} }
};

const TRUCKS = [
  { id:'cart',    name:'Hand-Me-Down Cart', cost:0,     storage:140, throughput:1.0,  marketing:1.0,  staffSlots:1, dailyCost:45,  desc:'Tiny cart with one service window.' },
  { id:'stepvan', name:'Step Van Classic',  cost:8000,  storage:210, throughput:1.12, marketing:1.08, staffSlots:2, dailyCost:100, desc:'More grills and a second window.' },
  { id:'gourmet', name:'Gourmet Rig',       cost:20000, storage:260, throughput:1.22, marketing:1.15, staffSlots:3, dailyCost:175, desc:'Premium kitchen with built-in signage.' }
];

const UPGRADES = [
  { id:'cold_storage', name:'Cold Storage Bins', type:'capacity', cost:1800, desc:'+40 storage, less spoilage anxiety.', effects:{storage:40} },
  { id:'dual_line',    name:'Dual Service Line', type:'operations', cost:3500, desc:'+10% throughput, better queue flow.', effects:{throughput:0.1, staffSlots:1} },
  { id:'street_team',  name:'Street Team', type:'marketing', cost:1400, desc:'+10% traffic from hype.', effects:{marketing:0.1} },
  { id:'promo_suite',  name:'Promo Suite', type:'marketing', cost:2600, desc:'Promo lasts +10s and customers forgive prices.', effects:{promoSeconds:10, priceSlack:0.05} },
  { id:'fusion_lab',   name:'Fusion Test Kitchen', type:'menu', cost:4200, desc:'Unlocks Seoul Heat Melt (spicy fusion).', effects:{unlockItems:['fusion']} },
  { id:'green_partner',name:'Green Partner License', type:'menu', cost:3600, desc:'Unlocks Green Goddess wrap & gentler price pushback.', effects:{unlockItems:['veggie'], priceSlack:0.03} }
];

const CAMPAIGNS = [
  { id:'flyers',     name:'Neighborhood Flyers', cost:200,  desc:'+12% traffic tomorrow.', effect:{traffic:0.12}, durationDays:1 },
  { id:'radio',      name:'Local Radio Spot',    cost:500,  desc:'+8% traffic and a tilt toward office workers.', effect:{traffic:0.08, officeTilt:0.08}, durationDays:1 },
  { id:'influencer', name:'Foodie Influencer',   cost:900,  desc:'+20% foodie mix and +4% price tolerance.', effect:{foodieTilt:0.2, priceSlack:0.04}, durationDays:1 }
];

const STAFFERS = [
  { id:'prep_guru',   name:'Prep Guru Lina',    role:'Kitchen',   hireCost:1500, salary:250, desc:'-10% prep cost, +5 storage.', effects:{prepCostMult:0.9, storage:5} },
  { id:'street_barker', name:'Street Barker Taye', role:'Marketing', hireCost:1000, salary:180, desc:'+10% marketing, +0.02 price slack.', effects:{marketing:0.1, priceSlack:0.02} },
  { id:'data_analyst',  name:'Data Analyst Mei',  role:'Ops',       hireCost:1800, salary:260, desc:'Unlocks analytics level 1 & +0.01 rep gain.', effects:{analytics:1, repGain:0.01} },
  { id:'service_captain',name:'Service Captain Ari', role:'Service', hireCost:1600, salary:240, desc:'+8% throughput, -spice complaints.', effects:{throughput:0.08, spiceTolerance:0.05} },
  { id:'fixer_raul',    name:'Fixer Raul',       role:'Ops',       hireCost:1200, salary:220, desc:'Reduces rent by 40 and event penalties.', effects:{rentDiscount:40, eventShield:0.2} }
];

const GOALS = [
  { id:'rookie', name:'Rookie Sensation', desc:'Hit $1200 revenue and 80% satisfaction in a single day.', requires:{revenue:1200, satisfaction:80, days:1}, rewards:{cash:800, research:1, reputation:{office:0.02}} },
  { id:'family_favorite', name:'Family Favorite', desc:'Post 85% satisfaction at City Park for 2 days.', requires:{satisfaction:85, days:2, location:'park'}, rewards:{cash:1200, reputation:{family:0.05}} },
  { id:'prep_master', name:'Prep Mastery', desc:'Reach 90% sell-through three days in a row.', requires:{sellThrough:0.9, days:3, resetOnFail:true}, rewards:{research:2} },
  { id:'war_chest', name:'War Chest', desc:'End a day with at least $9000 cash on hand.', requires:{cash:9000, days:1}, rewards:{cash:1000, research:1} }
];

const EVENTS = [
  { id:'rain', name:'Rain in the Forecast', desc:'Crowds may thin unless you adapt.', options:[
      { id:'awnings', label:'Buy Awnings ($200)', desc:'Spend now to keep lines dry.', effects:{cash:-200, traffic:0.08} },
      { id:'comfort', label:'Push Comfort Specials', desc:'Lean into soups & mild spice.', effects:{familyTilt:0.1, spiceTolerance:-0.1, priceSlack:-0.02} }
    ]
  },
  { id:'media', name:'Local Media Buzz', desc:'A blogger is asking for samples.', options:[
      { id:'give_free', label:'Hand Out Free Plates ($250)', desc:'Costs cash but boosts reputation.', effects:{cash:-250, reputation:{foodie:0.03}, traffic:0.05} },
      { id:'decline', label:'Decline politely', desc:'Saves cash but foodies get picky.', effects:{priceSlack:-0.03, foodieTilt:-0.05} }
    ]
  },
  { id:'inspection', name:'Health Inspection', desc:'Surprise inspection is scheduled.', options:[
      { id:'deep_clean', label:'Overtime Deep Clean ($150)', desc:'Pay staff to prep spotless kitchen.', effects:{cash:-150, reputation:{office:0.02}, priceSlack:0.02} },
      { id:'wing_it', label:'Wing it', desc:'Risk fines, get throughput penalty.', effects:{throughput:-0.05, cash:-50} }
    ]
  }
];

const RESEARCH = [
  { id:'market_insights', name:'Market Insights', cost:1, desc:'Unlock demand bars & per-item reports.', effects:{analytics:1} },
  { id:'deep_insights', name:'Deep Insights', cost:2, requires:['market_insights'], desc:'Adds advanced analytics & +0.02 price slack.', effects:{analytics:1, priceSlack:0.02} },
  { id:'ghost_commissary', name:'Ghost Commissary', cost:2, desc:'-100 rent and +20 storage.', effects:{rentDiscount:100, storage:20} },
  { id:'auto_prep', name:'Auto Prep Tools', cost:3, desc:'Prep cost -10% and +10 storage.', effects:{prepCostMult:0.9, storage:10} },
  { id:'regional_ads', name:'Regional Ads', cost:2, desc:'+0.12 marketing & +0.01 rep gain.', effects:{marketing:0.12, repGain:0.01} }
];

const BASE_UNLOCKS = ITEMS.filter(it => it.unlock === 'base').map(it => it.id);
const BASE_RENT = 220;
const MAX_ACTIVE_GOALS = 2;
const LOAN_INTEREST = 0.04;
