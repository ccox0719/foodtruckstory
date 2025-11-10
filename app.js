const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const INGREDIENT_BLUEPRINTS = [
  {
    id: 'smoke-bowl-bbq',
    flavor: 'Smoke',
    form: 'Bowl',
    name: 'Smoked BBQ Pork Bowl',
    baseIngredients: 'Rice or grains',
    signatureIngredients: 'Smoked pork, BBQ sauce, caramelized onion',
    costTier: 4,
    prepTier: 3,
    appealTier: 5,
    trendTier: 3,
    risk: 'safe',
    proteinType: 'Pork',
    baseType: 'Rice',
    sauceType: 'BBQ',
  },
  {
    id: 'smoke-wrap-chipotle',
    flavor: 'Smoke',
    form: 'Wrap',
    name: 'Chipotle Chicken Wrap',
    baseIngredients: 'Flour tortilla',
    signatureIngredients: 'Chipotle chicken, BBQ aioli, grilled onion',
    costTier: 3,
    prepTier: 2,
    appealTier: 4,
    trendTier: 3,
    risk: 'classic',
    proteinType: 'Chicken',
    baseType: 'Bread',
    sauceType: 'BBQ',
  },
  {
    id: 'smoke-drink-vanilla',
    flavor: 'Smoke',
    form: 'Drink',
    name: 'Smoked Vanilla Cold Brew',
    baseIngredients: 'Cold brew coffee',
    signatureIngredients: 'Vanilla, molasses, smoked salt',
    costTier: 2,
    prepTier: 1,
    appealTier: 3,
    trendTier: 4,
    risk: 'experimental',
    proteinType: null,
    baseType: null,
    sauceType: 'PineappleGlaze',
  },
  {
    id: 'smoke-handheld-sliders',
    flavor: 'Smoke',
    form: 'Handheld',
    name: 'Mini BBQ Sliders',
    baseIngredients: 'Brioche buns',
    signatureIngredients: 'Pulled pork, slaw, BBQ glaze',
    costTier: 3,
    prepTier: 3,
    appealTier: 5,
    trendTier: 3,
    risk: 'classic',
    proteinType: 'Pork',
    baseType: 'Bread',
    sauceType: 'BBQ',
  },
  {
    id: 'heat-bowl-korean',
    flavor: 'Heat',
    form: 'Bowl',
    name: 'Spicy Korean Bowl',
    baseIngredients: 'Rice or noodles',
    signatureIngredients: 'Beef bulgogi, gochujang, sesame',
    costTier: 3,
    prepTier: 4,
    appealTier: 5,
    trendTier: 5,
    risk: 'bold',
    proteinType: 'Pork',
    baseType: 'Rice',
    sauceType: 'BBQ',
  },
  {
    id: 'heat-wrap-thai',
    flavor: 'Heat',
    form: 'Wrap',
    name: 'Fiery Thai Wrap',
    baseIngredients: 'Flatbread',
    signatureIngredients: 'Chicken, spicy peanut sauce, chili flakes',
    costTier: 3,
    prepTier: 3,
    appealTier: 4,
    trendTier: 5,
    risk: 'bold',
    proteinType: 'Chicken',
    baseType: 'Bread',
    sauceType: 'Peanut',
  },
  {
    id: 'heat-drink-mango',
    flavor: 'Heat',
    form: 'Drink',
    name: 'Spicy Mango Lemonade',
    baseIngredients: 'Lemonade',
    signatureIngredients: 'Mango puree, chili rim',
    costTier: 2,
    prepTier: 2,
    appealTier: 4,
    trendTier: 5,
    risk: 'volatile',
    proteinType: null,
    baseType: null,
    sauceType: 'PineappleGlaze',
  },
  {
    id: 'heat-handheld-hot-honey',
    flavor: 'Heat',
    form: 'Handheld',
    name: 'Hot Honey Chicken Tacos',
    baseIngredients: 'Mini tortillas',
    signatureIngredients: 'Fried chicken, hot honey, jalapeño',
    costTier: 3,
    prepTier: 3,
    appealTier: 5,
    trendTier: 4,
    risk: 'bold',
    proteinType: 'Chicken',
    baseType: 'Bread',
    sauceType: 'BBQ',
  },
  {
    id: 'fresh-bowl-herb',
    flavor: 'Fresh',
    form: 'Bowl',
    name: 'Herb & Veggie Bowl',
    baseIngredients: 'Quinoa or rice',
    signatureIngredients: 'Chicken, cucumber, mint, herbs',
    costTier: 2,
    prepTier: 3,
    appealTier: 4,
    trendTier: 4,
    risk: 'safe',
    proteinType: 'Chicken',
    baseType: 'Rice',
    sauceType: 'LimeCrema',
  },
  {
    id: 'fresh-wrap-greek',
    flavor: 'Fresh',
    form: 'Wrap',
    name: 'Greek Veggie Wrap',
    baseIngredients: 'Pita',
    signatureIngredients: 'Tzatziki, cucumber, sprouts, parsley',
    costTier: 2,
    prepTier: 2,
    appealTier: 5,
    trendTier: 4,
    risk: 'safe',
    proteinType: 'Veggie',
    baseType: 'Bread',
    sauceType: 'LimeCrema',
  },
  {
    id: 'fresh-drink-cucumber',
    flavor: 'Fresh',
    form: 'Drink',
    name: 'Cucumber Mint Limeade',
    baseIngredients: 'Sparkling water',
    signatureIngredients: 'Cucumber, mint, lime',
    costTier: 1,
    prepTier: 1,
    appealTier: 5,
    trendTier: 5,
    risk: 'safe',
    proteinType: null,
    baseType: null,
    sauceType: 'LimeCrema',
  },
  {
    id: 'fresh-handheld-falafel',
    flavor: 'Fresh',
    form: 'Handheld',
    name: 'Falafel Pita Pocket',
    baseIngredients: 'Pita bread',
    signatureIngredients: 'Falafel, lettuce, garlic sauce',
    costTier: 2,
    prepTier: 3,
    appealTier: 4,
    trendTier: 4,
    risk: 'classic',
    proteinType: 'Veggie',
    baseType: 'Bread',
    sauceType: 'LimeCrema',
  },
  {
    id: 'tropical-bowl-jerk',
    flavor: 'Tropical',
    form: 'Bowl',
    name: 'Caribbean Jerk Bowl',
    baseIngredients: 'Coconut rice',
    signatureIngredients: 'Jerk pork, pineapple, coconut',
    costTier: 3,
    prepTier: 3,
    appealTier: 5,
    trendTier: 5,
    risk: 'bold',
    proteinType: 'Pork',
    baseType: 'Rice',
    sauceType: 'PineappleGlaze',
  },
  {
    id: 'tropical-bowl-island-shrimp',
    flavor: 'Tropical',
    form: 'Bowl',
    name: 'Island Shrimp Bowl',
    baseIngredients: 'Coconut rice',
    signatureIngredients: 'Shrimp, pineapple glaze, charred citrus salsa',
    costTier: 3,
    prepTier: 3,
    appealTier: 5,
    trendTier: 5,
    risk: 'bold',
    proteinType: 'Shrimp',
    baseType: 'Rice',
    sauceType: 'PineappleGlaze',
  },
  {
    id: 'tropical-wrap-curry',
    flavor: 'Tropical',
    form: 'Wrap',
    name: 'Mango Curry Wrap',
    baseIngredients: 'Flatbread',
    signatureIngredients: 'Chicken, tropical curry, lime slaw',
    costTier: 3,
    prepTier: 3,
    appealTier: 4,
    trendTier: 5,
    risk: 'experimental',
    proteinType: 'Chicken',
    baseType: 'Bread',
    sauceType: 'Peanut',
  },
  {
    id: 'tropical-drink-iced-tea',
    flavor: 'Tropical',
    form: 'Drink',
    name: 'Pineapple Coconut Iced Tea',
    baseIngredients: 'Iced tea',
    signatureIngredients: 'Pineapple, coconut milk, lime',
    costTier: 2,
    prepTier: 2,
    appealTier: 5,
    trendTier: 5,
    risk: 'safe',
    proteinType: null,
    baseType: null,
    sauceType: 'PineappleGlaze',
  },
  {
    id: 'tropical-handheld-skewers',
    flavor: 'Tropical',
    form: 'Handheld',
    name: 'Tropical Pork Skewers',
    baseIngredients: 'Wood skewers',
    signatureIngredients: 'Pork, pineapple glaze, allspice',
    costTier: 3,
    prepTier: 4,
    appealTier: 4,
    trendTier: 5,
    risk: 'volatile',
    proteinType: 'Pork',
    baseType: 'Bread',
    sauceType: 'PineappleGlaze',
  },
];

const toSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const derivePrepSpeed = (tier) => clamp(1.35 - tier * 0.12, 0.6, 1.25);
const derivePopularity = (appealTier, trendTier) => clamp(0.82 + appealTier * 0.08 + trendTier * 0.02, 0.85, 1.45);
const deriveCost = (tier) => clamp(1.8 + tier * 0.55, 1.8, 5);
const deriveMargin = (trendTier, costTier) => clamp(3 + trendTier * 0.4 - costTier * 0.2, 2.3, 5.6);
const deriveDescription = (blueprint) => `Base: ${blueprint.baseIngredients}. Signature: ${blueprint.signatureIngredients}.`;
const getBlueprintId = (blueprint) => blueprint.id || toSlug(`${blueprint.flavor}-${blueprint.form}-${blueprint.name}`);
const getBlueprintKey = (blueprint) => `${blueprint.flavor}-${blueprint.form}`;
const findBlueprintById = (id) => INGREDIENT_BLUEPRINTS.find((entry) => getBlueprintId(entry) === id);

const COMBO_MATRIX = {
  coreSynergy: {
    Smoke: { Bowl: 85, Wrap: 78, Handheld: 88, Drink: 20 },
    Heat: { Bowl: 82, Wrap: 86, Handheld: 84, Drink: 70 },
    Fresh: { Bowl: 80, Wrap: 82, Handheld: 76, Drink: 92 },
    Tropical: { Bowl: 88, Wrap: 80, Handheld: 78, Drink: 95 },
  },
  proteinMod: {
    Smoke: { Chicken: 0, Pork: 10, Veggie: -4, Shrimp: 0 },
    Heat: { Chicken: 8, Pork: 2, Veggie: 4, Shrimp: 4 },
    Fresh: { Chicken: 6, Pork: 0, Veggie: 10, Shrimp: 8 },
    Tropical: { Chicken: 4, Pork: 6, Veggie: 2, Shrimp: 12 },
  },
  baseMod: {
    Rice: { Bowl: 8, Wrap: 2, Handheld: 0 },
    Noodles: { Bowl: 6, Wrap: 4, Handheld: 0 },
    Greens: { Bowl: 5, Wrap: 6, Handheld: -2 },
    Bread: { Bowl: -6, Wrap: 6, Handheld: 10 },
  },
  sauceMod: {
    BBQ: { Smoke: 10, Heat: 4, Fresh: -6, Tropical: -8 },
    Peanut: { Smoke: -6, Heat: 10, Fresh: 6, Tropical: 4 },
    LimeCrema: { Smoke: -6, Heat: 2, Fresh: 10, Tropical: 8 },
    PineappleGlaze: { Smoke: -10, Heat: 0, Fresh: 4, Tropical: 12 },
  },
  contextMod: {
    weatherHot: { Fresh: 8, Tropical: 10, Smoke: -8 },
    weatherCold: { Smoke: 10, Fresh: -6 },
    locationCollege: { Heat: 8, Handheld: 6 },
    festival: { Handheld: 6, Drink: 6 },
    officeLunch: { Bowl: 6, Wrap: 4 },
  },
  novelty: { firstTime: 5, repeat1DayAgo: -8, repeat3Days: -15 },
  tiers: [
    { name: 'S', min: 100 },
    { name: 'A', min: 85 },
    { name: 'B', min: 70 },
    { name: 'C', min: 55 },
    { name: 'D', min: 40 },
    { name: 'F', min: 0 },
  ],
  hardRules: { drinksNoProteinPenalty: -25, clampMin: 0, clampMax: 120 },
  hiddenCombos: [
    {
      match: { Flavor: 'Tropical', Format: 'Bowl', Protein: 'Shrimp', Sauce: 'PineappleGlaze', Base: 'Rice' },
      bonus: 12,
      title: 'Island Classic',
    },
    { match: { Flavor: 'Heat', Format: 'Handheld' }, bonus: 8, title: 'Street Heat Tacos' },
    { match: { Flavor: 'Fresh', Format: 'Drink', Sauce: 'LimeCrema' }, bonus: 10, title: 'Spa Sipper' },
  ],
};

const tierForScore = (score) => COMBO_MATRIX.tiers.find((tier) => score >= tier.min)?.name || 'F';
const TIER_MULTIPLIER = { S: 1.2, A: 0.9, B: 0.4, C: 0, D: -0.4, F: -0.8 };

const findHiddenCombo = (blueprint) => {
  if (!blueprint) return null;
  return (
    COMBO_MATRIX.hiddenCombos.find((combo) => {
      const match = combo.match || {};
      if (match.Flavor && match.Flavor !== blueprint.flavor) return false;
      if (match.Format && match.Format !== blueprint.form) return false;
      if (match.Protein && match.Protein !== blueprint.proteinType) return false;
      if (match.Base && match.Base !== blueprint.baseType) return false;
      if (match.Sauce && match.Sauce !== blueprint.sauceType) return false;
      return true;
    }) || null
  );
};

const evaluateBlueprintCore = (blueprint, { contexts = [], novelty = 0 } = {}) => {
  if (!blueprint) {
    return { score: 60, tier: 'C', hiddenTitle: null };
  }
  const flavor = blueprint.flavor;
  const format = blueprint.form;
  let score = COMBO_MATRIX.coreSynergy[flavor]?.[format] ?? 60;
  if (blueprint.proteinType) {
    score += COMBO_MATRIX.proteinMod[flavor]?.[blueprint.proteinType] ?? 0;
  }
  if (blueprint.baseType) {
    score += COMBO_MATRIX.baseMod[blueprint.baseType]?.[format] ?? 0;
  }
  if (blueprint.sauceType) {
    score += COMBO_MATRIX.sauceMod[blueprint.sauceType]?.[flavor] ?? 0;
  }
  contexts.forEach((ctx) => {
    const mod = COMBO_MATRIX.contextMod[ctx];
    if (!mod) return;
    if (mod[flavor]) score += mod[flavor];
    if (mod[format]) score += mod[format];
  });
  score += novelty;
  if (format === 'Drink' && blueprint.proteinType) {
    score += COMBO_MATRIX.hardRules.drinksNoProteinPenalty;
  }
  const hidden = findHiddenCombo(blueprint);
  if (hidden) {
    score += hidden.bonus;
  }
  score = clamp(score, COMBO_MATRIX.hardRules.clampMin, COMBO_MATRIX.hardRules.clampMax);
  return { score, tier: tierForScore(score), hiddenTitle: hidden?.title || null };
};
const RISK_PROFILES = {
  safe: { label: 'Reliable', margin: 0.05, popularity: 0.06, speedBoost: 0.05, ratingShift: 2, hypeBoost: 0, description: 'Crowd-pleaser with low variance.' },
  classic: { label: 'Classic', margin: 0.15, popularity: 0.02, ratingShift: 1, hypeBoost: 0, description: 'Balanced staple with steady returns.' },
  bold: { label: 'Bold Fusion', margin: 0.4, popularity: -0.02, hypeBoost: 1, ratingShift: 0, description: 'High reward if the rumor lines up.' },
  experimental: { label: 'Experimental', margin: 0.65, popularity: -0.05, speedPenalty: 0.03, hypeBoost: 2, ratingShift: -1, description: 'Creative combo that can wow critics or confuse the line.' },
  volatile: { label: 'High Risk', margin: 0.85, popularity: -0.08, speedPenalty: 0.05, hypeBoost: 3, ratingShift: -2, description: 'Wild swings. Can spike hype or tank reviews.' },
};

const buildDishFromBlueprint = (blueprint, { name, keySuffix } = {}) => {
  if (!blueprint) return null;
  const tiers = {
    cost: clamp(blueprint.costTier, 1, 5),
    prep: clamp(blueprint.prepTier, 1, 5),
    appeal: clamp(blueprint.appealTier, 1, 5),
    trend: clamp(blueprint.trendTier, 1, 5),
    speedDisplay: clamp(6 - blueprint.prepTier, 1, 5),
  };
  const riskProfile = RISK_PROFILES[blueprint.risk] || RISK_PROFILES.classic;
  const finalName = name?.trim() || blueprint.name;
  const slug = toSlug(`${blueprint.flavor}-${blueprint.form}-${finalName || blueprint.name}`);
  const blueprintId = getBlueprintId(blueprint);
  const id = keySuffix !== undefined ? `${slug}-${keySuffix}` : slug;
  let prepSpeed = derivePrepSpeed(blueprint.prepTier);
  if (riskProfile.speedPenalty) prepSpeed -= riskProfile.speedPenalty;
  if (riskProfile.speedBoost) prepSpeed += riskProfile.speedBoost;
  prepSpeed = clamp(prepSpeed, 0.55, 1.35);
  let popularity = derivePopularity(blueprint.appealTier, blueprint.trendTier);
  popularity = clamp(popularity + (riskProfile.popularity || 0), 0.75, 1.5);
  let margin = deriveMargin(blueprint.trendTier, blueprint.costTier) + (riskProfile.margin || 0);
  margin = clamp(margin, 2.3, 6);
  const baseEval = evaluateBlueprintCore(blueprint);
  return {
    id,
    name: finalName,
    archetype: `${blueprint.flavor} ${blueprint.form}`,
    margin,
    cost: deriveCost(blueprint.costTier),
    prepSpeed,
    popularity,
    description: deriveDescription(blueprint),
    form: blueprint.form,
    flavor: blueprint.flavor,
    baseIngredients: blueprint.baseIngredients,
    signatureIngredients: blueprint.signatureIngredients,
    tiers,
    blueprintKey: getBlueprintKey(blueprint),
    blueprintId,
    risk: {
      id: blueprint.risk || 'classic',
      label: riskProfile.label,
      hypeBoost: riskProfile.hypeBoost || 0,
      ratingShift: riskProfile.ratingShift || 0,
      description: riskProfile.description,
    },
    proteinType: blueprint.proteinType || null,
    baseType: blueprint.baseType || null,
    sauceType: blueprint.sauceType || null,
    baseTier: baseEval.tier,
    baseScore: baseEval.score,
    baseHiddenTitle: baseEval.hiddenTitle,
  };
};

const PRICE_POINTS = {
  street: { id: 'street', label: 'Street', price: 9, popularity: 1.15, quality: 0.85, blurb: 'Cheap, fills the line but dings quality.' },
  market: { id: 'market', label: 'Market', price: 12, popularity: 1, quality: 1, blurb: 'Balanced reputation + demand.' },
  premium: { id: 'premium', label: 'Premium', price: 15, popularity: 0.85, quality: 1.15, blurb: 'High ticket average, picky guests.' },
};

const HELPERS = [
  { id: 'none', name: 'Solo shift', description: 'No helper. Keep expenses low.', cost: 0, efficiency: 0, charm: 0, capacity: 0 },
  { id: 'runner', name: 'Line Runner', description: 'Speeds plating, +5% capacity.', cost: 45, efficiency: 0.2, charm: 0, capacity: 0.05 },
  { id: 'grill', name: 'Grill Anchor', description: 'Keeps proteins flowing, +8% cap, +5 charm.', cost: 65, efficiency: 0.12, charm: 0.05, capacity: 0.08 },
  { id: 'host', name: 'Hype Host', description: 'Lines move slower but guests stay chill.', cost: 55, efficiency: 0, charm: 0.18, capacity: 0 },
];

const FORM_OPTIONS = [
  { id: 'Bowl', label: 'Bowl', description: 'Layered base, steady service.' },
  { id: 'Handheld', label: 'Handheld', description: 'Easy walking eats, great for rushes.' },
  { id: 'Wrap', label: 'Wrap', description: 'Balanced lunch staple.' },
  { id: 'Drink', label: 'Drink', description: 'Refreshments boost hype.' },
];

const FLAVOR_OPTIONS = [
  { id: 'Smoke', label: 'Smoke', description: 'BBQ, char, deep savor.' },
  { id: 'Heat', label: 'Heat', description: 'Spice and punchy zest.' },
  { id: 'Fresh', label: 'Fresh', description: 'Crunchy greens, clean finish.' },
  { id: 'Tropical', label: 'Tropical', description: 'Fruit-forward, vacation vibes.' },
];

const AUDIENCE_TRENDS = [
  {
    id: 'office',
    name: 'Office Surge',
    description: 'Desk escape crowd wants handheld freshness.',
    clue: 'Lobby chatter says anything foldable with crunch keeps keyboards clean.',
    tagForm: 'Palm bites',
    tagFlavor: 'Garden chill',
    form: 'Handheld',
    flavor: 'Fresh',
    modifiers: { popularity: 0.08, rating: 2 },
    contextTags: ['officeLunch'],
  },
  {
    id: 'night-market',
    name: 'Night Market',
    description: 'Glow-up crowd chasing smoky bowls.',
    clue: 'Neon seekers keep asking for ember-kissed piles.',
    tagForm: 'Glow bowls',
    tagFlavor: 'Smoke trails',
    form: 'Bowl',
    flavor: 'Smoke',
    modifiers: { popularity: 0.05, hype: 3 },
    contextTags: ['festival'],
  },
  {
    id: 'wellness',
    name: 'Wellness Pop-up',
    description: 'Yoga studio wants wraps and tropical drinks.',
    clue: 'Studio instructors whisper about swirls that taste like vacations.',
    tagForm: 'Rolled greens',
    tagFlavor: 'Beach breeze',
    form: 'Wrap',
    flavor: 'Tropical',
    modifiers: { rating: 3 },
    contextTags: ['weatherHot'],
  },
  {
    id: 'festival',
    name: 'Festival Rush',
    description: 'High-energy line wants heat + drinks.',
    clue: 'Wristband crowd wants something they can wave in the air while it sizzles.',
    tagForm: 'Street fists',
    tagFlavor: 'Fire pop',
    form: 'Handheld',
    flavor: 'Heat',
    modifiers: { popularity: 0.12, rating: -1 },
    contextTags: ['festival'],
  },
  {
    id: 'family',
    name: 'Family Day',
    description: 'Comfort seekers leaning into bowls + fresh notes.',
    clue: 'Parents keep asking for picnic bowls that feel like cooling shade.',
    tagForm: 'Family bowls',
    tagFlavor: 'Garden hush',
    form: 'Bowl',
    flavor: 'Fresh',
    modifiers: { popularity: 0.06, rating: 1 },
    contextTags: ['weatherCold'],
  },
];

const EVENTS = [
  {
    id: 'bluebird',
    title: 'Bluebird Skies',
    description: 'Sunshine brings the neighborhood out in force.',
    effects: { turnout: 0.25, hype: 2, rating: 4 },
  },
  {
    id: 'rain',
    title: 'Rain Drizzle',
    description: 'Rain jackets and umbrellas thin the crowd.',
    effects: { turnout: -0.2, hype: -1, rating: -4 },
  },
  {
    id: 'critic',
    title: 'Local Blogger Drops In',
    description: 'Serve fast and keep them happy for bonus rep.',
    effects: { turnout: 0.1, hype: 1, rating: 6 },
  },
  {
    id: 'rush-hour',
    title: 'Rush Hour Detour',
    description: 'Office crowd spills over for a surprise spike.',
    effects: { turnout: 0.18, hype: 0, rating: 2 },
  },
  {
    id: 'supply',
    title: 'Supplier Delay',
    description: 'Ingredients arrive tight, so prep is slower.',
    effects: { turnout: -0.05, hype: 0, rating: -3, speed: -0.08 },
  },
  {
    id: 'festival',
    title: 'Street Fest Nearby',
    description: 'Crowd energy is high, but expectations too.',
    effects: { turnout: 0.2, hype: 3, rating: 0 },
  },
];

const EVENT_CONTEXT_TAGS = {
  bluebird: ['weatherHot'],
  rain: ['weatherCold'],
  festival: ['festival'],
  'rush-hour': ['officeLunch'],
};

const SERVICE_STEP_MIN = 1;
const SERVICE_STEP_VARIANCE = 3;
const SERVICE_INTERVAL_MS = 640;
const SUPPLY_COST_PER_UNIT = 4;
const SUPPLY_MAX_UNITS = 80;

class InventoryManager {
  constructor(stateRef) {
    this.state = stateRef;
  }

  get units() {
    return Math.max(0, this.state.inventory.units || 0);
  }

  get age() {
    return Math.max(0, this.state.inventory.age || 0);
  }

  snapshot() {
    return { units: this.units, age: this.age };
  }

  restock(units) {
    const amount = clamp(units || 0, 0, SUPPLY_MAX_UNITS);
    if (amount <= 0) return 0;
    const current = this.units;
    this.state.inventory.units = current + amount;
    if (current === 0) {
      this.state.inventory.age = 0;
    }
    return amount;
  }

  discard() {
    const lost = this.units;
    this.state.inventory.units = 0;
    this.state.inventory.age = 0;
    return lost;
  }

  forecast(consumption, stockOverride) {
    const stock = typeof stockOverride === 'number' ? Math.max(stockOverride, 0) : this.units;
    const canServe = Math.min(Math.max(consumption || 0, 0), stock);
    const shortfall = Math.max((consumption || 0) - stock, 0);
    const leftover = Math.max(stock - canServe, 0);
    return { canServe, shortfall, leftover, stock };
  }

  consume(units, { commit = true } = {}) {
    const { canServe, shortfall, leftover } = this.forecast(units);
    if (commit) {
      this.state.inventory.units = leftover;
      if (leftover === 0) {
        this.state.inventory.age = 0;
      }
    }
    return { used: canServe, shortfall, leftover };
  }

  applyOutcome(outcome, { adjustAnger = true, angerMultiplier = 1 } = {}) {
    if (!outcome) return null;
    const stock = outcome.stockOnTruck ?? outcome.supplyBefore ?? this.units;
    const { canServe, shortfall, leftover } = this.forecast(outcome.served, stock);
    if (shortfall > 0) {
      if (adjustAnger) {
        const penalty = Math.max(1, Math.round(shortfall * angerMultiplier));
        outcome.angry = Math.max((outcome.angry || 0) + penalty, 0);
      }
      outcome.served = canServe;
    }
    outcome.supplyShortfall = shortfall;
    outcome.leftoverUnits = leftover;
    return { stock, canServe, shortfall, leftover };
  }

  finalizeService(outcome) {
    if (!outcome) return 0;
    const stockBefore = outcome.stockOnTruck ?? outcome.supplyBefore ?? this.units;
    const served = outcome.served || 0;
    const leftover = Math.max(stockBefore - served, 0);
    this.state.inventory.units = leftover;
    if (leftover > 0) {
      this.state.inventory.age += 1;
    } else {
      this.state.inventory.age = 0;
    }
    this.resetPurchasePlan();
    outcome.leftoverUnits = leftover;
    return leftover;
  }

  resetPurchasePlan() {
    this.state.purchaseUnits = 20;
    this.state.purchaseCost = 0;
  }

  describeRisk(units = this.units, age = this.age) {
    if (units === 0) return { level: 'none', label: 'None', detail: 'Low risk' };
    if (age >= 3) return { level: 'critical', label: 'Critical', detail: 'Spoilage imminent' };
    if (age === 2) return { level: 'high', label: 'High', detail: 'Risk climbing' };
    if (age === 1) return { level: 'medium', label: 'Medium', detail: 'Keep an eye on it' };
    return { level: 'low', label: 'Low', detail: 'Fresh stock' };
  }
}

const currency = (value) => `$${value.toFixed(0)}`;
const formatSigned = (value) => (value > 0 ? `+${value}` : `${value}`);
const formatUnits = (value) => `${Math.max(0, Math.round(value))} serv`;

const SERVICE_COMMANDS = {
  rush: {
    id: 'rush',
    label: 'Rush Mode',
    description: 'Push speed. More served, more heat.',
    cooldown: 2,
  },
  quality: {
    id: 'quality',
    label: 'Chef Focus',
    description: 'Slow down to protect rating + reduce anger.',
    cooldown: 1,
  },
  'form-spotlight': {
    id: 'form-spotlight',
    label: 'Form Spotlight',
    description: 'Promote dishes matching the rumor form.',
    cooldown: 2,
    scope: 'form',
  },
  'flavor-spotlight': {
    id: 'flavor-spotlight',
    label: 'Flavor Tease',
    description: 'Charm guests chasing the rumored flavor.',
    cooldown: 2,
    scope: 'flavor',
  },
  'tropical-push': {
    id: 'tropical-push',
    label: 'Highlight Tropical Drink',
    description: 'Focus on drinks/tropical items for fast hype.',
    cooldown: 3,
    scope: 'tropical',
  },
};

const state = {
  day: 1,
  money: 520,
  hype: 40,
  reputation: 48,
  truck: { speed: 1, capacity: 28 },
  staff: { efficiency: 1, charm: 1 },
  selectedDishes: [],
  pricePoint: 'street',
  helper: 'none',
  phase: 'prep',
  simRunning: false,
  lastEvent: null,
  lastResults: null,
  activeOutcome: null,
  serviceCommandsUsed: new Set(),
  commandCooldowns: {},
  currentProgress: 0,
  serviceProgress: 0,
  serviceTimer: null,
  servicePaused: false,
  serviceMidpointCalled: false,
  serviceFinalCalled: false,
  strikes: 0,
  gameOver: false,
  inventory: { units: 0, age: 0 },
  purchaseUnits: 20,
  purchaseCost: 0,
  audienceTrend: null,
  selloutWarned: false,
  slowStockWarned: false,
  labSelection: { form: FORM_OPTIONS[0].id, flavor: FLAVOR_OPTIONS[0].id, blueprintId: null },
  craftedDishes: [],
  craftedCounter: 0,
  comboHistory: {},
  lastSupplyUnitCost: SUPPLY_COST_PER_UNIT,
};

const PHASE_SEQUENCE = ['prep', 'service', 'results'];
const PHASE_TIPS = {
  prep: 'Lock lineup, price point, and supplies to unlock service.',
  service: 'Service sim in progress: trigger commands and watch events.',
  results: 'Check the hype report, then advance or tweak for the next day.',
};

const setPhase = (nextPhase) => {
  state.phase = nextPhase;
  updatePhaseGuide();
  updatePhasePanels();
};

const inventoryManager = new InventoryManager(state);

const getActiveContexts = () => {
  const contexts = new Set();
  if (state.audienceTrend?.contextTags) {
    state.audienceTrend.contextTags.forEach((tag) => contexts.add(tag));
  }
  const eventTags = state.lastEvent ? EVENT_CONTEXT_TAGS[state.lastEvent.id] : null;
  eventTags?.forEach((tag) => contexts.add(tag));
  return Array.from(contexts);
};

const getNoveltyDelta = (blueprint, { preview = false } = {}) => {
  if (preview) return 0;
  const blueprintId = blueprint?.blueprintId || getBlueprintId(blueprint);
  if (!blueprintId) return 0;
  const lastDay = state.comboHistory[blueprintId];
  if (!lastDay) return COMBO_MATRIX.novelty.firstTime;
  const daysAgo = state.day - lastDay;
  if (daysAgo <= 1) return COMBO_MATRIX.novelty.repeat1DayAgo;
  if (daysAgo <= 3) return COMBO_MATRIX.novelty.repeat3Days;
  return 0;
};

const evaluateBlueprintWithState = (blueprint, { contexts = [], preview = false } = {}) => {
  const novelty = getNoveltyDelta(blueprint, { preview });
  return evaluateBlueprintCore(blueprint, { contexts, novelty });
};

const evaluateDishWithState = (dish, contexts, options = {}) => {
  const blueprint = findBlueprintById(dish.blueprintId) || dish;
  return evaluateBlueprintWithState(blueprint, { contexts, ...options });
};

const recordComboHistory = (outcome) => {
  if (!outcome?.lineup?.length) return;
  const seen = new Set();
  outcome.lineup.forEach((dish) => {
    const blueprintId = dish.blueprintId;
    if (!blueprintId || seen.has(blueprintId)) return;
    state.comboHistory[blueprintId] = state.day;
    seen.add(blueprintId);
  });
};

const getAverageDishCost = () => {
  const lineup = getSelectedDishes();
  if (lineup.length) {
    return lineup.reduce((sum, dish) => sum + (dish.cost || SUPPLY_COST_PER_UNIT), 0) / lineup.length;
  }
  if (state.craftedDishes.length) {
    return state.craftedDishes.reduce((sum, dish) => sum + (dish.cost || SUPPLY_COST_PER_UNIT), 0) / state.craftedDishes.length;
  }
  return SUPPLY_COST_PER_UNIT;
};

const getSupplyUnitCost = () => Math.max(3, Math.round(getAverageDishCost()));

const elements = {};
const PHASE_PANEL_VISIBILITY = {
  prep: ['prepPanel'],
  service: ['servicePanel'],
  results: ['resultsPanel'],
};

const cacheElements = () => {
  elements.gameGrid = document.querySelector('.game-grid');
  elements.dishGrid = document.getElementById('dish-grid');
  elements.menuCodex = document.getElementById('menu-codex');
  elements.eventLibrary = document.getElementById('event-library');
  elements.prepNote = document.getElementById('prep-note');
  elements.prepSelection = document.getElementById('prep-selection');
  elements.helperNote = document.getElementById('helper-note');
  elements.helperSelect = document.getElementById('helper-select');
  elements.hypeBar = document.getElementById('hype-bar');
  elements.repBar = document.getElementById('rep-bar');
  elements.hudDay = document.getElementById('hud-day');
  elements.hudMoney = document.getElementById('hud-money');
  elements.hudHype = document.getElementById('hud-hype');
  elements.hudRep = document.getElementById('hud-rep');
  elements.hudStrikes = document.getElementById('hud-strikes');
  elements.statSpeed = document.getElementById('stat-speed');
  elements.statCapacity = document.getElementById('stat-capacity');
  elements.statEfficiency = document.getElementById('stat-efficiency');
  elements.statCharm = document.getElementById('stat-charm');
  elements.eventName = document.getElementById('event-name');
  elements.eventDescription = document.getElementById('event-description');
  elements.eventEffects = document.getElementById('event-effects');
  elements.serviceBar = document.getElementById('service-bar');
  elements.serviceStatus = document.getElementById('service-status');
  elements.serviceFeed = document.getElementById('service-feed');
  elements.hintList = document.getElementById('hint-list');
  elements.startButton = document.getElementById('start-day');
  elements.pauseButton = document.getElementById('pause-day');
  elements.nextDay = document.getElementById('next-day');
  elements.resetButton = document.getElementById('reset-campaign');
  elements.commandContainer = document.getElementById('command-grid');
  elements.commandButtons = new Map();
  elements.commandNote = document.getElementById('command-note');
  elements.supplyInput = document.getElementById('supply-input');
  elements.supplyCost = document.getElementById('supply-cost');
  elements.supplyStock = document.getElementById('supply-stock');
  elements.supplyCarry = document.getElementById('supply-carry');
  elements.supplyRisk = document.getElementById('supply-risk');
  elements.supplyDiscard = document.getElementById('supply-discard');
  elements.prepPanel = document.getElementById('phase-prep');
  elements.servicePanel = document.getElementById('phase-service');
  elements.resultsPanel = document.getElementById('phase-results');
  elements.audienceName = document.getElementById('audience-name');
  elements.audienceDesc = document.getElementById('audience-desc');
  elements.audienceClue = document.getElementById('audience-clue');
  elements.audienceForm = document.getElementById('audience-form');
  elements.audienceFlavor = document.getElementById('audience-flavor');
  elements.forecastStock = document.getElementById('forecast-stock');
  elements.forecastDemand = document.getElementById('forecast-demand');
  elements.forecastSellout = document.getElementById('forecast-sellout');
  elements.stockNote = document.getElementById('stock-note');
  elements.failOverlay = document.getElementById('fail-overlay');
  elements.failReason = document.getElementById('fail-reason');
  elements.failDetail = document.getElementById('fail-detail');
  elements.failReset = document.getElementById('fail-reset');
  elements.labFlavor = document.getElementById('lab-flavor');
  elements.labForm = document.getElementById('lab-form');
  elements.labName = document.getElementById('lab-name');
  elements.labPreview = document.getElementById('lab-preview');
  elements.labStatus = document.getElementById('lab-status');
  elements.labCreate = document.getElementById('lab-create');
  elements.labReset = document.getElementById('lab-reset');
  elements.labKitGrid = document.getElementById('lab-kit-grid');
  elements.phaseTip = document.getElementById('phase-tip');
  elements.phaseNodes = document.querySelectorAll('[data-phase-node]');
  elements.resultsModal = document.getElementById('results-modal');
  elements.resultsModalTrigger = document.getElementById('results-modal-trigger');
  elements.resultsModalClose = document.getElementById('results-close');
  elements.modalSummary = document.getElementById('modal-summary');
  elements.modalProfit = document.getElementById('modal-profit');
  elements.modalRating = document.getElementById('modal-rating');
  elements.modalHypeDelta = document.getElementById('modal-hype-delta');
  elements.modalRepDelta = document.getElementById('modal-rep-delta');
  elements.modalHypeTotal = document.getElementById('modal-hype-total');
  elements.modalRepTotal = document.getElementById('modal-rep-total');
  elements.modalHypeMeter = document.getElementById('modal-hype-meter');
  elements.modalRepMeter = document.getElementById('modal-rep-meter');
  elements.modalNextDay = document.getElementById('modal-next-day');
  elements.modalStay = document.getElementById('modal-stay');
  elements.serviceStats = {
    served: document.getElementById('stat-served'),
    angry: document.getElementById('stat-angry'),
    wait: document.getElementById('stat-wait'),
    revenue: document.getElementById('stat-revenue'),
  };
  elements.results = {
    profit: document.getElementById('result-profit'),
    rating: document.getElementById('result-rating'),
    hype: document.getElementById('result-hype'),
    rep: document.getElementById('result-rep'),
    summary: document.getElementById('results-summary'),
    revenue: document.getElementById('breakdown-revenue'),
    expenses: document.getElementById('breakdown-expenses'),
    ingredient: document.getElementById('breakdown-ingredient'),
    supplies: document.getElementById('breakdown-supplies'),
    staff: document.getElementById('breakdown-staff'),
    upkeep: document.getElementById('breakdown-upkeep'),
    telemetry: document.getElementById('dish-telemetry'),
  };
};

const GAUGE_ICONS = {
  speed: '>',
  expense: '$',
  pop: '*',
};

const createGaugeIcons = (count, icon) => {
  const safeCount = clamp(count, 1, 5);
  return Array.from({ length: safeCount }, () => `<span aria-hidden="true">${icon}</span>`).join('');
};

const renderGauge = (label, icon, value, modifier) => `
  <div class="dish-gauge" role="img" aria-label="${label}: ${value} of 5">
    <span class="dish-gauge-label">${label}</span>
    <span class="dish-gauge-icons gauge-${modifier}">${createGaugeIcons(value, icon)}</span>
  </div>
`;

const renderGaugeGroup = (tiers) => `
  <div class="dish-gauges">
    ${renderGauge('Speed', GAUGE_ICONS.speed, tiers.speedDisplay, 'speed')}
    ${renderGauge('Expense', GAUGE_ICONS.expense, tiers.cost, 'expense')}
    ${renderGauge('Pop', GAUGE_ICONS.pop, tiers.appeal, 'pop')}
  </div>
`;

const renderRiskBadge = (dish) => {
  if (!dish?.risk) return '';
  return `<span class="dish-risk risk-${dish.risk.id}">${dish.risk.label}</span>`;
};

const getCraftedDishById = (id) => state.craftedDishes.find((dish) => dish.id === id);
const getSelectedDishes = () => state.selectedDishes.map((id) => getCraftedDishById(id)).filter(Boolean);
const hasBlueprintCrafted = (blueprint) => {
  if (!blueprint) return false;
  const blueprintId = getBlueprintId(blueprint);
  return state.craftedDishes.some((dish) => dish.blueprintId === blueprintId);
};
const pruneSelectedDishes = () => {
  const allowed = new Set(state.craftedDishes.map((dish) => dish.id));
  const filtered = state.selectedDishes.filter((id) => allowed.has(id));
  if (filtered.length !== state.selectedDishes.length) {
    state.selectedDishes = filtered;
  }
};

const renderDishGrid = () => {
  if (!elements.dishGrid) return;
  elements.dishGrid.innerHTML = '';
  if (!state.craftedDishes.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p class="empty-title">No combos crafted yet</p>
      <p>Use the recipe lab to mix a format + ingredient kit, then add it to your lineup.</p>
    `;
    elements.dishGrid.appendChild(empty);
    return;
  }
  state.craftedDishes.forEach((dish) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'dish-card';
    card.dataset.id = dish.id;
    const riskBadge = renderRiskBadge(dish);
    const tierLabel = dish.baseTier ? `Tier ${dish.baseTier}` : 'Tier --';
    card.innerHTML = `
      <div class="dish-card-head">
        <div>
          <strong>${dish.name}</strong>
          <p class="dish-tag">${dish.flavor} · ${dish.form}</p>
        </div>
        <div class="dish-head-tags">
          <span class="dish-trend">Trend ${dish.tiers.trend}/5</span>
          <span class="dish-tier">${tierLabel}</span>
          ${riskBadge}
        </div>
      </div>
      <p class="dish-ingredients"><span>Base</span> ${dish.baseIngredients}</p>
      <p class="dish-ingredients"><span>Signature</span> ${dish.signatureIngredients}</p>
      ${renderGaugeGroup(dish.tiers)}
      ${dish.risk?.description ? `<p class="dish-risk-note">${dish.risk.description}</p>` : ''}
      ${dish.baseHiddenTitle ? `<p class="dish-risk-note">Hidden combo: ${dish.baseHiddenTitle}</p>` : ''}
    `;
    card.addEventListener('click', () => toggleDish(dish.id));
    elements.dishGrid.appendChild(card);
  });
};

const renderMenuCodex = () => {
  if (!elements.menuCodex) return;
  elements.menuCodex.innerHTML = '';
  if (!state.craftedDishes.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p class="empty-title">Menu codex</p>
      <p>Craft combos to see their stats, risk, and stories here.</p>
    `;
    elements.menuCodex.appendChild(empty);
    return;
  }
  state.craftedDishes.forEach((dish) => {
    const article = document.createElement('article');
    article.className = 'menu-card';
    const riskBadge = renderRiskBadge(dish);
    const tierLabel = dish.baseTier ? `Tier ${dish.baseTier}` : 'Tier --';
    article.innerHTML = `
      <div class="dish-card-head">
        <div>
          <h3>${dish.name}</h3>
          <p class="dish-tag">${dish.flavor} · ${dish.form}</p>
        </div>
        <div class="dish-head-tags">
          <span class="dish-trend">Trend ${dish.tiers.trend}/5</span>
          <span class="dish-tier">${tierLabel}</span>
          ${riskBadge}
        </div>
      </div>
      <p class="dish-ingredients"><span>Base</span> ${dish.baseIngredients}</p>
      <p class="dish-ingredients"><span>Signature</span> ${dish.signatureIngredients}</p>
      ${renderGaugeGroup(dish.tiers)}
      <ul class="menu-stats">
        <li>Prep speed ${dish.prepSpeed.toFixed(2)}x</li>
        <li>Ingredient cost $${dish.cost.toFixed(1)}</li>
        <li>Appeal ${(dish.popularity * 100).toFixed(0)}%</li>
        ${dish.risk ? `<li>${dish.risk.label}</li>` : ''}
      </ul>
      ${dish.risk?.description ? `<p class="dish-risk-note">${dish.risk.description}</p>` : ''}
      ${dish.baseHiddenTitle ? `<p class="dish-risk-note">Hidden combo: ${dish.baseHiddenTitle}</p>` : ''}
    `;
    elements.menuCodex.appendChild(article);
  });
};

const updateLabStatus = (message) => {
  if (elements.labStatus) {
    elements.labStatus.textContent = message;
  }
};

const renderLabSelects = () => {
  const currentForm = state.labSelection?.form || FORM_OPTIONS[0].id;
  const currentFlavor = state.labSelection?.flavor || FLAVOR_OPTIONS[0].id;
  if (elements.labForm) {
    elements.labForm.innerHTML = '';
    FORM_OPTIONS.forEach((option) => {
      const opt = document.createElement('option');
      opt.value = option.id;
      opt.textContent = option.label;
      elements.labForm.appendChild(opt);
    });
    elements.labForm.value = currentForm;
  }
  if (elements.labFlavor) {
    elements.labFlavor.innerHTML = '';
    FLAVOR_OPTIONS.forEach((option) => {
      const opt = document.createElement('option');
      opt.value = option.id;
      opt.textContent = option.label;
      elements.labFlavor.appendChild(opt);
    });
    elements.labFlavor.value = currentFlavor;
  }
  renderLabKitGrid();
};

const renderLabKitGrid = () => {
  if (!elements.labKitGrid) return;
  const formValue = elements.labForm?.value || FORM_OPTIONS[0].id;
  const flavorValue = elements.labFlavor?.value || FLAVOR_OPTIONS[0].id;
  state.labSelection.form = formValue;
  state.labSelection.flavor = flavorValue;
  const kits = INGREDIENT_BLUEPRINTS.filter((bp) => bp.form === formValue && bp.flavor === flavorValue);
  elements.labKitGrid.innerHTML = '';
  if (!kits.length) {
    const empty = document.createElement('p');
    empty.className = 'lab-empty';
    empty.textContent = 'No ingredient kits map to this format + flavor yet.';
    elements.labKitGrid.appendChild(empty);
    state.labSelection.blueprintId = null;
    highlightLabSelection();
    updateLabPreview();
    updateLabStatus('Try another flavor or format to unlock different kits.');
    if (elements.labCreate) elements.labCreate.disabled = true;
    return;
  }
  kits.forEach((kit) => {
    const blueprintId = getBlueprintId(kit);
    const card = document.createElement('article');
    card.className = 'lab-kit-card';
    card.dataset.blueprintId = blueprintId;
    const dishPreview = buildDishFromBlueprint(kit, { name: kit.name });
    const riskBadge = renderRiskBadge(dishPreview);
    const tierLabel = dishPreview.baseTier ? `Tier ${dishPreview.baseTier}` : 'Tier --';
    const scoreLabel = `${Math.round(dishPreview.baseScore)} pts`;
    card.innerHTML = `
      <div class="lab-kit-head">
        <div>
          <strong>${kit.name}</strong>
          <p class="lab-kit-sub">${kit.baseIngredients}</p>
        </div>
        <div class="lab-kit-tags">
          ${riskBadge}
          <span class="dish-trend">Trend ${kit.trendTier}/5</span>
          <span class="lab-kit-tier">${tierLabel}</span>
        </div>
      </div>
      <p class="lab-kit-detail">Signature: ${kit.signatureIngredients}</p>
      <p class="lab-kit-score">${scoreLabel}</p>
      <div class="lab-kit-actions">
        <button type="button" class="btn tertiary lab-kit-craft">Quick craft</button>
      </div>
    `;
    card.addEventListener('click', (event) => {
      if (event.target.closest('.lab-kit-craft')) {
        selectLabBlueprint(blueprintId);
        craftBlueprintById(blueprintId, { quick: true });
        event.stopPropagation();
        return;
      }
      selectLabBlueprint(blueprintId);
    });
    elements.labKitGrid.appendChild(card);
  });
  const stillValid = kits.some((kit) => getBlueprintId(kit) === state.labSelection.blueprintId);
  if (!stillValid) {
    state.labSelection.blueprintId = getBlueprintId(kits[0]);
  }
  highlightLabSelection();
  updateLabPreview();
  updateLabStatus('Select a kit to preview synergy or quick craft multiples.');
};

const highlightLabSelection = () => {
  if (!elements.labKitGrid) return;
  const current = state.labSelection?.blueprintId;
  elements.labKitGrid.querySelectorAll('.lab-kit-card').forEach((card) => {
    card.classList.toggle('selected', current && card.dataset.blueprintId === current);
  });
  if (elements.labCreate) {
    elements.labCreate.disabled = !current;
  }
};

const selectLabBlueprint = (blueprintId) => {
  state.labSelection.blueprintId = blueprintId;
  highlightLabSelection();
  updateLabPreview();
};

const getLabBlueprint = () => {
  if (!state.labSelection?.blueprintId) return null;
  return findBlueprintById(state.labSelection.blueprintId);
};

const updateLabPreview = () => {
  if (!elements.labPreview) return;
  const blueprint = getLabBlueprint();
  if (!blueprint) {
    elements.labPreview.innerHTML = '<p>Select a format + ingredient kit to preview stats.</p>';
    if (elements.labName) elements.labName.placeholder = 'Auto from kit';
    if (elements.labCreate) elements.labCreate.disabled = true;
    updateLabStatus('Pick a kit to see how it plays.');
    return;
  }
  if (elements.labName && !elements.labName.value.trim()) {
    elements.labName.placeholder = blueprint.name;
  }
  const previewDish = buildDishFromBlueprint(blueprint, { name: elements.labName?.value });
  const riskBadge = renderRiskBadge(previewDish);
  elements.labPreview.innerHTML = `
    <div class="lab-preview-card">
      <div class="dish-card-head">
        <div>
          <strong>${previewDish.name}</strong>
          <p class="dish-tag">${previewDish.flavor} · ${previewDish.form}</p>
        </div>
        <div class="dish-head-tags">
          <span class="dish-trend">Trend ${previewDish.tiers.trend}/5</span>
          ${riskBadge}
        </div>
      </div>
      <p class="dish-ingredients"><span>Base</span> ${previewDish.baseIngredients}</p>
      <p class="dish-ingredients"><span>Signature</span> ${previewDish.signatureIngredients}</p>
      ${renderGaugeGroup(previewDish.tiers)}
      <p class="lab-kit-score">${Math.round(previewDish.baseScore)} pts baseline</p>
      ${previewDish.risk?.description ? `<p class="dish-risk-note">${previewDish.risk.description}</p>` : ''}
    </div>
  `;
  const craftedBefore = hasBlueprintCrafted(blueprint);
  const riskSummary = previewDish.risk?.description ? `${previewDish.risk.label}: ${previewDish.risk.description}` : 'Solid baseline combo.';
  updateLabStatus(
    craftedBefore
      ? `${riskSummary} You already have one in the library, but variations are welcome.`
      : `${riskSummary} Craft it to test on tomorrow's crowd.`,
  );
  if (elements.labCreate) {
    elements.labCreate.disabled = false;
  }
};

const craftBlueprintById = (blueprintId, { quick = false } = {}) => {
  const blueprint = findBlueprintById(blueprintId);
  if (!blueprint) {
    updateLabStatus('Pick a kit before crafting.');
    return false;
  }
  state.craftedCounter += 1;
  const manualName = !quick ? elements.labName?.value.trim() : '';
  const dishName = manualName || blueprint.name;
  const dish = buildDishFromBlueprint(blueprint, { name: dishName, keySuffix: state.craftedCounter });
  state.craftedDishes.push(dish);
  refreshDishLibrary({ showHint: true });
  if (!quick && elements.labName) {
    elements.labName.value = '';
  }
  updateLabPreview();
  updateLabStatus(quick ? `Spawned ${dish.name}. Keep experimenting!` : 'Added to your library. Tap it in prep to slot the lineup.');
  return true;
};

const craftCurrentBlueprint = () => {
  if (!state.labSelection?.blueprintId) {
    updateLabStatus('Pick a kit before crafting.');
    return;
  }
  craftBlueprintById(state.labSelection.blueprintId);
};

const clearRecipeLibrary = () => {
  if (!state.craftedDishes.length) {
    updateLabStatus('Library already empty.');
    return;
  }
  const confirmed = typeof window === 'undefined' ? true : window.confirm('Clear all crafted combos? This cannot be undone.');
  if (!confirmed) return;
  state.craftedDishes = [];
  state.selectedDishes = [];
  state.craftedCounter = 0;
  refreshDishLibrary({ showHint: true });
  updateLabPreview();
  updateLabStatus('Library cleared. Craft something new in the grid.');
};

const renderCommandButtons = () => {
  if (!elements.commandContainer) return;
  elements.commandContainer.innerHTML = '';
  elements.commandButtons = new Map();
  Object.values(SERVICE_COMMANDS).forEach((command) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn tertiary command-btn';
    button.dataset.command = command.id;
    button.innerHTML = `
      <span class="command-head">
        <strong class="command-label">${command.label}</strong>
        <span class="command-status" data-status>Ready</span>
      </span>
      <span class="command-desc">${command.description}</span>
      <span class="command-meta">Cooldown: ${command.cooldown} day${command.cooldown === 1 ? '' : 's'}</span>
    `;
    button.addEventListener('click', () => handleServiceCommand(command.id));
    elements.commandContainer.appendChild(button);
    elements.commandButtons.set(command.id, button);
  });
};

const updateStockForecast = (outcome) => {
  if (!elements.forecastStock || !elements.forecastDemand || !elements.forecastSellout || !elements.stockNote) return;
  if (!outcome) {
    elements.forecastStock.textContent = formatUnits(inventoryManager.units || 0);
    elements.forecastDemand.textContent = '--';
    elements.forecastSellout.textContent = '--';
    elements.stockNote.textContent = 'Forecast updates after prep.';
    return;
  }
  const stock = outcome.stockOnTruck ?? inventoryManager.units ?? 0;
  const demand = outcome.projectedDemand ?? 0;
  elements.forecastStock.textContent = formatUnits(stock);
  elements.forecastDemand.textContent = formatUnits(demand);
  if (outcome.selloutProgress && outcome.selloutProgress < 100) {
    elements.forecastSellout.textContent = `${Math.round(outcome.selloutProgress)}% into service`;
    elements.stockNote.textContent = 'Sellout likely - rush mode or rumor spotlights can stretch stock.';
  } else if (stock > demand * 1.15) {
    elements.forecastSellout.textContent = 'No sellout';
    elements.stockNote.textContent = 'Excess stock predicted - tropical push or lineup tweaks could help.';
  } else {
    elements.forecastSellout.textContent = 'Balanced';
    elements.stockNote.textContent = 'Supply matches demand. Watch events for swings.';
  }
};

const renderEventLibrary = () => {
  if (!elements.eventLibrary) return;
  elements.eventLibrary.innerHTML = '';
  EVENTS.forEach((event) => {
    const card = document.createElement('article');
    card.className = 'event-card--static';
    card.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p><strong>Impact:</strong> ${describeEffects(event.effects)}</p>
    `;
    elements.eventLibrary.appendChild(card);
  });
};

const describeEffects = (effects) => {
  const parts = [];
  if (effects.turnout) parts.push(`${effects.turnout > 0 ? '+' : ''}${Math.round(effects.turnout * 100)}% turnout`);
  if (effects.hype) parts.push(`${formatSigned(effects.hype)} hype`);
  if (effects.rating) parts.push(`${formatSigned(effects.rating)} rating`);
  if (effects.speed) parts.push(`${formatSigned(Math.round(effects.speed * 100))}% speed`);
  return parts.length ? parts.join(' · ') : 'Vibe only';
};

const calculateComboEffects = (dishes) => {
  if (!dishes.length) {
    return {
      demandMod: 1,
      ratingMod: 0,
      hypeMod: 0,
      dishScore: 0,
      focusScore: 0,
      audience: state.audienceTrend || null,
      evaluations: [],
      contexts: getActiveContexts(),
    };
  }
  const contexts = getActiveContexts();
  const evaluations = dishes.map((dish) => evaluateDishWithState(dish, contexts));
  const tierAverage = evaluations.reduce((sum, evalResult) => sum + (TIER_MULTIPLIER[evalResult.tier] || 0), 0) / evaluations.length;
  const avgScore = evaluations.reduce((sum, evalResult) => sum + evalResult.score, 0) / evaluations.length;
  const hiddenCount = evaluations.filter((evalResult) => evalResult.hiddenTitle).length;
  const audience = state.audienceTrend;
  const mods = audience?.modifiers || {};
  const demandMod = clamp(1 + tierAverage * 0.12 + (mods.popularity || 0), 0.65, 1.5);
  const ratingMod = (mods.rating || 0) + tierAverage * 4;
  const hypeMod = (mods.hype || 0) + hiddenCount * 2;
  return {
    demandMod,
    ratingMod,
    hypeMod,
    dishScore: avgScore,
    focusScore: tierAverage,
    audience,
    evaluations,
    contexts,
  };
};

const getCommandCooldown = (commandId) => (state.commandCooldowns?.[commandId] || 0);

const armCommandCooldown = (commandId) => {
  const command = SERVICE_COMMANDS[commandId];
  if (!command || !command.cooldown) return;
  state.commandCooldowns[commandId] = command.cooldown;
};

const decayCommandCooldowns = () => {
  const next = {};
  Object.entries(state.commandCooldowns || {}).forEach(([id, turns]) => {
    if (turns > 1) {
      next[id] = turns - 1;
    }
  });
  state.commandCooldowns = next;
};

const isCommandCoolingDown = (commandId) => getCommandCooldown(commandId) > 0;

const allocateByWeight = (total, weights) => {
  if (!weights.length) return [];
  if (!total || total <= 0) return weights.map(() => 0);
  const sanitized = weights.map((weight) => (weight > 0 ? weight : 0.5));
  const sum = sanitized.reduce((acc, weight) => acc + weight, 0) || sanitized.length;
  const distributed = sanitized.map((weight) => (weight / sum) * total);
  const base = distributed.map((value) => Math.floor(value));
  let remainder = Math.round(total - base.reduce((acc, value) => acc + value, 0));
  const fractions = distributed
    .map((value, index) => ({ index, fraction: value - base[index] }))
    .sort((a, b) => b.fraction - a.fraction);
  let pointer = 0;
  while (remainder > 0 && pointer < fractions.length) {
    base[fractions[pointer].index] += 1;
    remainder -= 1;
    pointer += 1;
  }
  return base;
};

const buildDishTelemetry = (dishes, outcome, audience) => {
  if (!dishes.length) return [];
  const servedShare = allocateByWeight(outcome.served || 0, dishes.map((dish) => dish.popularity * dish.prepSpeed));
  const angerShare = allocateByWeight(outcome.angry || 0, dishes.map((dish) => (dish.prepSpeed > 0 ? 1 / dish.prepSpeed : 1)));
  const telemetry = dishes.map((dish, index) => {
    const served = servedShare[index] || 0;
    const angryPool = Math.round(angerShare[index] || 0);
    const angry = served > 0 ? Math.min(angryPool, served) : angryPool;
    const share = outcome.served ? served / Math.max(outcome.served, 1) : 0;
    const angerRate = served > 0 ? Math.min(1, angry / served) : angry > 0 ? 1 : 0;
    const matches = [];
    if (audience && dish.form === audience.form) matches.push('Form match');
    if (audience && dish.flavor === audience.flavor) matches.push('Flavor match');
    let verdict = 'Steady';
    if (share >= 0.45 && angerRate <= 0.35) {
      verdict = 'MVP';
    } else if (angerRate >= 0.35) {
      verdict = 'Guests bailed';
    } else if (share <= 0.18 && served > 0) {
      verdict = 'Niche appeal';
    }
    if (matches.length && verdict === 'Steady') {
      verdict = matches.join(' + ');
    }
    return {
      id: dish.id,
      name: dish.name,
      served,
      angry,
      share,
      angerRate,
      verdict,
      matches,
      form: dish.form,
      flavor: dish.flavor,
    };
  });
  return telemetry.sort((a, b) => {
    if (b.served === a.served) {
      return a.angerRate - b.angerRate;
    }
    return b.served - a.served;
  });
};

const syncDishTelemetry = (outcome) => {
  if (!outcome?.lineup) return;
  outcome.dishTelemetry = buildDishTelemetry(outcome.lineup, outcome, outcome.audienceTrend);
};

const getTelemetryShare = (outcome, predicate) => {
  if (!outcome?.dishTelemetry?.length) return 0;
  return outcome.dishTelemetry.reduce((sum, entry) => (predicate(entry) ? sum + entry.share : sum), 0);
};

const applyAudienceSpotlight = (outcome, type) => {
  const audience = state.audienceTrend;
  if (!audience) {
    logServiceMessage('No rumor locked - spotlight fizzled.');
    return;
  }
  const predicate = type === 'form'
    ? (entry) => entry.form === audience.form
    : (entry) => entry.flavor === audience.flavor;
  const share = getTelemetryShare(outcome, predicate);
  if (share <= 0) {
    logServiceMessage('Spotlight missed - lineup does not match the rumor.');
    return;
  }
  const baseServed = outcome.served || 0;
  const shareScalar = type === 'form' ? 0.45 : 0.55;
  const cap = type === 'form' ? 0.28 : 0.35;
  const bonus = Math.max(1, Math.round(baseServed * Math.min(share * shareScalar, cap)));
  const angerRelief = Math.max(1, Math.round(bonus * (type === 'form' ? 0.4 : 0.55)));
  outcome.served += bonus;
  outcome.angry = Math.max(outcome.angry - angerRelief, 0);
  outcome.rating += type === 'form' ? 2 : 3;
  outcome.hypeDelta += type === 'form' ? 1 : 2;
  logServiceMessage(`${type === 'form' ? 'Form spotlight' : 'Flavor tease'} boosts ${Math.round(share * 100)}% of the lineup (+${bonus} plates).`);
};

const applyTropicalPush = (outcome) => {
  const predicate = (entry) => entry.flavor === 'Tropical' || entry.form === 'Drink';
  const share = getTelemetryShare(outcome, predicate);
  if (share <= 0) {
    logServiceMessage('No drinks or tropical items prepped - promo stalls.');
    return;
  }
  const baseServed = outcome.served || 0;
  const bonus = Math.max(1, Math.round(baseServed * Math.min(0.12 + share * 0.55, 0.4)));
  const angerRelief = Math.max(1, Math.round(bonus * 0.35));
  outcome.served += bonus;
  outcome.angry = Math.max(outcome.angry - angerRelief, 0);
  outcome.hypeDelta += 4 + Math.round(share * 4);
  outcome.rating += 1;
  outcome.pricePerTicket *= 0.96;
  logServiceMessage(`Highlight Tropical Drink pulls the crowd (+${bonus} served, hype surges).`);
};

const renderHelperSelect = () => {
  elements.helperSelect.innerHTML = '';
  HELPERS.forEach((helper) => {
    const option = document.createElement('option');
    option.value = helper.id;
    option.textContent = `${helper.name} ${helper.cost ? `($${helper.cost}/day)` : ''}`;
    elements.helperSelect.appendChild(option);
  });
  elements.helperSelect.value = state.helper;
};

const updateHelperNote = () => {
  const helper = HELPERS.find((entry) => entry.id === state.helper);
  if (!helper) return;
  elements.helperNote.textContent = `${helper.description}${helper.cost ? ` - Cost $${helper.cost}` : ''}`;
};

const toggleDish = (id) => {
  const selected = new Set(state.selectedDishes);
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    if (state.selectedDishes.length === 3) {
      setPrepMessage('Three dishes max. Swap one out to add another.');
      return;
    }
    selected.add(id);
  }
  state.selectedDishes = Array.from(selected);
  updateDishUI();
  updateSupplyUI();
};

const updateDishUI = () => {
  const cards = elements.dishGrid.querySelectorAll('.dish-card');
  cards.forEach((card) => {
    card.classList.toggle('active', state.selectedDishes.includes(card.dataset.id));
  });
  elements.prepSelection.textContent = `${state.selectedDishes.length} / 3 dishes selected`;
  updateEnvironmentHints(state.lastEvent);
};

const refreshDishLibrary = ({ showHint = false } = {}) => {
  renderDishGrid();
  renderMenuCodex();
  pruneSelectedDishes();
  updateDishUI();
  if (showHint && !state.simRunning) {
    if (!state.craftedDishes.length) {
      setPrepMessage('Recipe Lab: craft a format + ingredient combo before running service.');
    } else if (!state.selectedDishes.length) {
      setPrepMessage('Select up to 3 crafted dishes to prep.');
    }
  }
  updateSupplyUI();
};

const setPrepMessage = (message) => {
  elements.prepNote.textContent = message;
};

const handleSupplyChange = (event) => {
  let value = parseInt(event.target.value, 10);
  if (Number.isNaN(value)) value = 0;
  value = clamp(value, 0, SUPPLY_MAX_UNITS);
  state.purchaseUnits = value;
  event.target.value = value;
  updateSupplyUI();
};

const discardStock = () => {
  if (state.simRunning) {
    logServiceMessage('Cannot dump stock mid-service.');
    return;
  }
  if (inventoryManager.units <= 0) {
    logServiceMessage('No leftover stock to dump.');
    return;
  }
  const lostUnits = inventoryManager.discard();
  updateSupplyUI();
  logServiceMessage(`Dumped ${formatUnits(lostUnits)} to avoid spoilage.`);
};

const updateAudienceUI = () => {
  const audience = state.audienceTrend;
  if (!audience) return;
  if (elements.audienceName) elements.audienceName.textContent = audience.name;
  if (elements.audienceDesc) elements.audienceDesc.textContent = audience.description;
  if (elements.audienceClue) elements.audienceClue.textContent = `Clue: ${audience.clue}`;
  if (elements.audienceForm) elements.audienceForm.textContent = audience.tagForm || audience.form;
  if (elements.audienceFlavor) elements.audienceFlavor.textContent = audience.tagFlavor || audience.flavor;
};

const rollAudienceTrend = () => {
  const index = Math.floor(Math.random() * AUDIENCE_TRENDS.length);
  state.audienceTrend = AUDIENCE_TRENDS[index];
  updateAudienceUI();
};

const updateHUD = () => {
  elements.hudDay.textContent = state.day;
  elements.hudMoney.textContent = currency(state.money);
  elements.hudHype.textContent = `${state.hype}`;
  elements.hudRep.textContent = `${state.reputation}`;
  if (elements.hudStrikes) {
    elements.hudStrikes.textContent = `${state.strikes} / 3`;
  }
  if (elements.hypeBar) {
    elements.hypeBar.style.setProperty('--mini-progress', `${state.hype}%`);
  }
  if (elements.repBar) {
    elements.repBar.style.setProperty('--mini-progress', `${state.reputation}%`);
  }
  elements.statSpeed.textContent = `${state.truck.speed.toFixed(2)}x`;
  elements.statCapacity.textContent = `${state.truck.capacity} guests`;
  elements.statEfficiency.textContent = `${state.staff.efficiency.toFixed(2)}x`;
  elements.statCharm.textContent = `${state.staff.charm.toFixed(2)}x`;
};

const updatePhaseGuide = () => {
  if (!elements.phaseTip) {
    elements.phaseTip = document.getElementById('phase-tip');
  }
  const tip = PHASE_TIPS[state.phase] || PHASE_TIPS.prep;
  if (elements.phaseTip) {
    elements.phaseTip.textContent = tip;
  }
  if (!elements.phaseNodes || typeof elements.phaseNodes.forEach !== 'function') {
    return;
  }
  const currentIndex = Math.max(PHASE_SEQUENCE.indexOf(state.phase), 0);
  elements.phaseNodes.forEach((node) => {
    const phase = node.dataset.phaseNode;
    const phaseIndex = PHASE_SEQUENCE.indexOf(phase);
    node.classList.remove('active', 'done');
    if (phaseIndex === currentIndex) {
      node.classList.add('active');
    } else if (phaseIndex !== -1 && phaseIndex < currentIndex) {
      node.classList.add('done');
    }
  });
};

const updatePhasePanels = () => {
  const allKeys = Object.values(PHASE_PANEL_VISIBILITY).reduce((set, list) => {
    list.forEach((key) => set.add(key));
    return set;
  }, new Set());
  allKeys.forEach((key) => {
    const panel = elements[key];
    if (panel) {
      panel.classList.remove('phase-active');
      panel.setAttribute('aria-hidden', 'true');
    }
  });
  (PHASE_PANEL_VISIBILITY[state.phase] || []).forEach((key) => {
    const panel = elements[key];
    if (panel) {
      panel.classList.add('phase-active');
      panel.setAttribute('aria-hidden', 'false');
    }
  });
  if (elements.gameGrid) {
    elements.gameGrid.dataset.phase = state.phase;
  }
};

const updateSupplyUI = () => {
  if (elements.supplyInput && typeof state.purchaseUnits === 'number') {
    elements.supplyInput.value = state.purchaseUnits;
  }
  if (elements.supplyCost) {
    const unitCost = getSupplyUnitCost();
    state.lastSupplyUnitCost = unitCost;
    const cost = (state.purchaseUnits || 0) * unitCost;
    elements.supplyCost.textContent = `${currency(cost)} (${currency(unitCost)}/serv)`;
  }
  if (elements.supplyStock) {
    elements.supplyStock.textContent = `Stock: ${formatUnits(inventoryManager.units)}`;
  }
  if (elements.supplyCarry) {
    const age = inventoryManager.age;
    const units = inventoryManager.units;
    const ageLabel = units === 0 || age === 0 ? 'Fresh' : age === 1 ? '1 day old' : `${age} days`;
    elements.supplyCarry.textContent = `Carryover: ${formatUnits(units)} (${ageLabel})`;
  }
  if (elements.supplyRisk) {
    const risk = inventoryManager.describeRisk();
    elements.supplyRisk.textContent = `Risk: ${risk.label}`;
  }
  if (elements.supplyDiscard) {
    elements.supplyDiscard.disabled = inventoryManager.units === 0 || state.simRunning;
  }
};

const attachEvents = () => {
  document.querySelectorAll('input[name="price-point"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      state.pricePoint = radio.value;
      const price = PRICE_POINTS[state.pricePoint];
      if (state.phase === 'prep') {
        setPrepMessage(`${price.label} pricing: ${price.blurb}`);
      } else if (state.simRunning) {
        logServiceMessage(`Pricing toggled to ${price.label}. ${price.blurb}`);
      }
      applyLivePricePoint(price);
      updateEnvironmentHints(state.lastEvent);
    });
    if (radio.checked) state.pricePoint = radio.value;
  });

  elements.helperSelect.addEventListener('change', (event) => {
    state.helper = event.target.value;
    updateHelperNote();
    updateEnvironmentHints(state.lastEvent);
  });

  if (elements.supplyInput) {
    elements.supplyInput.addEventListener('input', handleSupplyChange);
  }
  if (elements.supplyDiscard) {
    elements.supplyDiscard.addEventListener('click', discardStock);
  }
  if (elements.pauseButton) {
    elements.pauseButton.addEventListener('click', togglePause);
  }

  if (elements.failReset) {
    elements.failReset.addEventListener('click', resetCampaign);
  }

  if (elements.labForm) {
    elements.labForm.addEventListener('change', () => {
      if (elements.labName) elements.labName.value = '';
      renderLabKitGrid();
    });
  }
  if (elements.labFlavor) {
    elements.labFlavor.addEventListener('change', () => {
      if (elements.labName) elements.labName.value = '';
      renderLabKitGrid();
    });
  }
  if (elements.labName) {
    elements.labName.addEventListener('input', updateLabPreview);
  }
  if (elements.labCreate) {
    elements.labCreate.addEventListener('click', craftCurrentBlueprint);
  }
  if (elements.labReset) {
    elements.labReset.addEventListener('click', clearRecipeLibrary);
  }

  elements.startButton.addEventListener('click', () => {
    if (state.simRunning) return;
    if (!state.craftedDishes.length) {
      setPrepMessage('Recipe Lab is empty. Craft at least one combo to run service.');
      return;
    }
    if (!state.selectedDishes.length) {
      setPrepMessage('Pick at least one dish to roll service.');
      return;
    }
    startDay();
  });

  elements.nextDay.addEventListener('click', advanceToNextDay);

  elements.resetButton.addEventListener('click', () => {
    resetCampaign();
  });

  if (elements.resultsModalTrigger) {
    elements.resultsModalTrigger.addEventListener('click', () => {
      if (!state.lastResults) return;
      showResultsModal();
    });
  }
  if (elements.resultsModalClose) {
    elements.resultsModalClose.addEventListener('click', hideResultsModal);
  }
  if (elements.modalStay) {
    elements.modalStay.addEventListener('click', hideResultsModal);
  }
  if (elements.resultsModal) {
    elements.resultsModal.addEventListener('click', (event) => {
      if (event.target === elements.resultsModal) {
        hideResultsModal();
      }
    });
  }
  if (elements.modalNextDay) {
    elements.modalNextDay.addEventListener('click', advanceToNextDay);
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideResultsModal();
    }
  });
};

const advanceToNextDay = () => {
  if (!state.lastResults) return;
  state.day += 1;
  decayCommandCooldowns();
  setPhase('prep');
  state.lastResults = null;
  state.lastEvent = null;
  updateResultsUI(null);
  resetServiceView();
  rollAudienceTrend();
  updateComboNote();
  updateHUD();
  updateCommandButtons();
  if (elements.nextDay) {
    elements.nextDay.disabled = true;
  }
  setPrepMessage('Tweak your lineup or price before starting the next day.');
  hideResultsModal();
  syncModalNextDay();
};

const resetServiceView = () => {
  elements.serviceBar.style.width = '0%';
  elements.serviceStatus.textContent = 'Prep dishes, then hit start.';
  elements.serviceFeed.innerHTML = '';
  updateServiceStats({ served: 0, angry: 0, wait: 0, revenue: 0 });
  renderEventCard(null);
  state.activeOutcome = null;
  state.serviceCommandsUsed = new Set();
  state.currentProgress = 0;
  state.serviceProgress = 0;
  state.servicePaused = false;
  state.serviceMidpointCalled = false;
  state.serviceFinalCalled = false;
  state.selloutWarned = false;
  state.slowStockWarned = false;
  clearServiceTimer();
  updateCommandButtons();
  updateEnvironmentHints(state.lastEvent);
  updatePauseButton();
  updateSupplyUI();
  updateStockForecast(null);
};

const resetCampaign = () => {
  state.day = 1;
  state.money = 520;
  state.hype = 40;
  state.reputation = 48;
  state.selectedDishes = [];
  state.pricePoint = 'street';
  state.helper = 'none';
  state.lastEvent = null;
  state.lastResults = null;
  state.simRunning = false;
  state.gameOver = false;
  state.strikes = 0;
  state.commandCooldowns = {};
  state.inventory.units = 0;
  state.inventory.age = 0;
  state.purchaseUnits = 20;
  state.purchaseCost = 0;
  state.lastSupplyUnitCost = SUPPLY_COST_PER_UNIT;
  state.labSelection = { form: FORM_OPTIONS[0].id, flavor: FLAVOR_OPTIONS[0].id, blueprintId: null };
  state.comboHistory = {};
  setPhase('prep');
  renderLabSelects();
  updateLabPreview();
  document.querySelector('input[name="price-point"][value="street"]').checked = true;
  renderHelperSelect();
  updateHelperNote();
  refreshDishLibrary({ showHint: true });
  resetServiceView();
  updateResultsUI(null);
  hideFailureOverlay();
  hideResultsModal();
  if (elements.startButton) {
    elements.startButton.disabled = false;
    elements.startButton.textContent = 'Start day';
  }
  setPrepMessage('Recipe Lab: craft combos, then select up to 3 to prep.');
  updateHUD();
  elements.nextDay.disabled = true;
  syncModalNextDay();
  rollAudienceTrend();
  updateStockForecast(null);
};

const renderEventCard = (event) => {
  if (!event) {
    elements.eventName.textContent = 'Waiting for prep';
    elements.eventDescription.textContent = 'Start the day to roll a weather, hype, or critic event.';
    elements.eventEffects.innerHTML = '';
    updateEnvironmentHints(null);
    return;
  }
  elements.eventName.textContent = event.title;
  elements.eventDescription.textContent = event.description;
  elements.eventEffects.innerHTML = '';
  const effectText = describeEffects(event.effects);
  if (effectText === 'Vibe only') return;
  effectText.split(' · ').forEach((chunk) => {
    const tag = document.createElement('li');
    tag.textContent = chunk;
    elements.eventEffects.appendChild(tag);
  });
  updateEnvironmentHints(event);
};

const prepareSuppliesForDay = () => {
  const units = clamp(state.purchaseUnits || 0, 0, SUPPLY_MAX_UNITS);
  state.purchaseUnits = units;
  const unitCost = getSupplyUnitCost();
  state.lastSupplyUnitCost = unitCost;
  state.purchaseCost = units * unitCost;
  if (units > 0) {
    const added = inventoryManager.restock(units);
    logServiceMessage(`Loaded ${formatUnits(added)} (${currency(state.purchaseCost)} @ ${currency(unitCost)}/serv).`);
  } else {
    state.purchaseCost = 0;
    logServiceMessage('No new supplies purchased.');
  }
  updateSupplyUI();
};

const startDay = () => {
  if (state.gameOver) {
    logServiceMessage('Campaign failed. Reset to play again.');
    return;
  }
  setPhase('service');
  hideResultsModal();
  state.simRunning = true;
  state.servicePaused = false;
  elements.startButton.disabled = true;
  elements.startButton.textContent = 'Serving...';
  if (elements.nextDay) {
    elements.nextDay.disabled = true;
  }
  syncModalNextDay();
  elements.serviceFeed.innerHTML = '';
  prepareSuppliesForDay();
  logServiceMessage('Doors up. Crew is moving.');
  const event = pickEvent();
  state.lastEvent = event;
  renderEventCard(event);
  const outcome = calculateDayOutcome(event);
  updateStockForecast(outcome);
  runServiceSimulation(outcome);
};

const pickEvent = () => {
  const index = Math.floor(Math.random() * EVENTS.length);
  return EVENTS[index];
};

const calculateDayOutcome = (event) => {
  const dishes = getSelectedDishes();
  const lineupData = dishes.map((dish) => ({ ...dish }));
  const riskRatingShift = dishes.reduce((sum, dish) => sum + (dish.risk?.ratingShift || 0), 0);
  const riskHypeBoost = dishes.reduce((sum, dish) => sum + (dish.risk?.hypeBoost || 0), 0);
  const price = PRICE_POINTS[state.pricePoint];
  const helper = HELPERS.find((entry) => entry.id === state.helper) || HELPERS[0];
  const { units: supplyBefore } = inventoryManager.snapshot();
  if (!dishes.length) {
    const upkeep = 60 + state.day * 6;
    const supplyCost = state.purchaseCost || 0;
    const expenses = helper.cost + upkeep + supplyCost;
    return {
      day: state.day,
      served: 0,
      angry: 0,
      averageWait: 0,
      revenue: 0,
      ingredientCost: 0,
      staffCost: helper.cost,
      upkeep,
      expenses,
      profit: -expenses,
      rating: 60,
      hypeDelta: 0,
      repDelta: 0,
      event,
    helper,
    price,
    dishes: [],
    lineup: [],
    dishTelemetry: [],
    pricePerTicket: 0,
    avgCost: 0,
    extraExpenses: 0,
    supplyCost,
    purchaseUnits: state.purchaseUnits || 0,
    supplyBefore,
    supplyShortfall: 0,
    leftoverUnits: supplyBefore,
    contamination: false,
    comboMatch: 0,
    focusMatch: 0,
    audienceTrend: state.audienceTrend,
    projectedDemand: 0,
    stockOnTruck: supplyBefore,
    selloutProgress: null,
  };
  }
  const avgPopularity = dishes.reduce((sum, dish) => sum + dish.popularity, 0) / dishes.length;
  const avgMargin = dishes.reduce((sum, dish) => sum + dish.margin, 0) / dishes.length;
  const avgCost = dishes.reduce((sum, dish) => sum + dish.cost, 0) / dishes.length;
  const avgSpeed = dishes.reduce((sum, dish) => sum + dish.prepSpeed, 0) / dishes.length;
  const comboEffects = calculateComboEffects(dishes);

  const hypeFactor = 0.5 + state.hype / 120;
  const turnoutFactor = avgPopularity * price.popularity * (1 + (event.effects.turnout || 0)) * comboEffects.demandMod;
  const baseDemand = 12 + state.day * 2;
  const potentialCustomers = baseDemand * hypeFactor * turnoutFactor;
  const capacityBoost = 1 + (helper.capacity || 0);
  const maxCustomers = Math.round(state.truck.capacity * capacityBoost);
  const customers = clamp(Math.round(potentialCustomers), 6, maxCustomers);
  const projectedDemand = customers;
  const stockOnTruck = supplyBefore;

  const eventSpeed = 1 + (event.effects.speed || 0);
  const speedScore = clamp(state.truck.speed * avgSpeed * eventSpeed + helper.efficiency + state.staff.efficiency * 0.15 - (dishes.length - 1) * 0.07, 0.55, 1.35);
  let served = clamp(Math.round(customers * speedScore), 0, customers);
  let angry = Math.max(customers - served, 0);
  let supplyShortfall = 0;
  const averageWait = clamp(Math.round(6 - speedScore * 3 + angry * 0.12), 2, 15);
  const pricePerTicket = price.price + avgMargin;
  const revenue = served * pricePerTicket;
  const ingredientCost = served * avgCost;
  const staffCost = helper.cost;
  const upkeep = 60 + state.day * 6;
  const supplyCost = state.purchaseCost || 0;
  const expenses = ingredientCost + staffCost + upkeep + supplyCost;
  const profit = Math.round(revenue - expenses);

  const qualityFactor = price.quality + helper.charm + state.staff.charm * 0.2;
  const ratingBase = 74 + (profit / 9) - angry * 1.8 + qualityFactor * 8 + (event.effects.rating || 0) + comboEffects.ratingMod + riskRatingShift;
  const rating = clamp(Math.round(ratingBase), 10, 100);
  const hypeDelta = clamp(Math.round((rating - 72) / 6 + (event.effects.hype || 0) + (comboEffects.hypeMod || 0) + riskHypeBoost), -12, 14);
  const repDelta = clamp(Math.round((rating - 78) / 8), -6, 8);
  const selloutProgress = stockOnTruck > 0 && projectedDemand > stockOnTruck ? clamp((stockOnTruck / projectedDemand) * 100, 1, 100) : null;

  const outcome = {
    day: state.day,
    served,
    angry,
    averageWait,
    revenue: Math.round(revenue),
    ingredientCost: Math.round(ingredientCost),
    staffCost,
    upkeep,
    expenses: Math.round(expenses),
    profit,
    rating,
    hypeDelta,
    repDelta,
    event,
    helper,
    price,
    dishes: dishes.map((dish) => dish.name),
    lineup: lineupData,
    pricePerTicket,
    avgCost,
    extraExpenses: 0,
    supplyCost,
    purchaseUnits: state.purchaseUnits || 0,
    supplyBefore,
    supplyShortfall,
    leftoverUnits: Math.max(supplyBefore - served, 0),
    contamination: false,
    comboMatch: comboEffects.dishScore,
    focusMatch: comboEffects.focusScore,
    audienceTrend: comboEffects.audience,
    projectedDemand,
    stockOnTruck,
    selloutProgress,
    comboEvaluations: comboEffects.evaluations,
    comboContexts: comboEffects.contexts,
    comboScore: comboEffects.dishScore,
    comboTierAvg: comboEffects.focusScore,
  };
  inventoryManager.applyOutcome(outcome);
  outcome.dishTelemetry = buildDishTelemetry(lineupData, outcome, comboEffects.audience);
  supplyShortfall = outcome.supplyShortfall || 0;
  return outcome;
};

const runServiceSimulation = (outcome) => {
  state.currentProgress = 0;
  state.serviceProgress = 0;
  state.servicePaused = false;
  state.serviceMidpointCalled = false;
  state.serviceFinalCalled = false;
  state.selloutWarned = !outcome.selloutProgress;
  state.slowStockWarned = false;
  state.activeOutcome = cloneOutcome(outcome);
  state.serviceCommandsUsed = new Set();
  updateCommandButtons();
  updatePauseButton();
  elements.serviceBar.style.width = '0%';
  elements.serviceStatus.textContent = 'Tickets in queue. Watch the line.';
  logServiceMessage(`Event: ${outcome.event.title}`);
  scheduleServiceTick();
};

const updateServiceStats = (stats) => {
  elements.serviceStats.served.textContent = stats.served;
  elements.serviceStats.angry.textContent = stats.angry;
  elements.serviceStats.wait.textContent = `${stats.wait} min`;
  elements.serviceStats.revenue.textContent = currency(stats.revenue || 0);
};

const renderDishTelemetry = (outcome) => {
  const list = elements.results.telemetry;
  if (!list) return;
  list.innerHTML = '';
  const telemetry = outcome?.dishTelemetry || [];
  if (!telemetry.length) {
    const empty = document.createElement('li');
    empty.className = 'telemetry-empty';
    empty.textContent = 'Run service to see which dishes carried.';
    list.appendChild(empty);
    return;
  }
  telemetry.forEach((dish) => {
    const item = document.createElement('li');
    item.className = 'telemetry-item';

    const head = document.createElement('div');
    head.className = 'telemetry-head';

    const nameWrap = document.createElement('div');
    nameWrap.className = 'telemetry-name';
    const name = document.createElement('strong');
    name.textContent = dish.name;
    nameWrap.appendChild(name);
    if (dish.verdict) {
      const badge = document.createElement('span');
      badge.className = 'dish-telemetry-pill';
      badge.textContent = dish.verdict;
      nameWrap.appendChild(badge);
    }
    head.appendChild(nameWrap);

    const share = document.createElement('span');
    share.className = 'dish-telemetry-share';
    share.textContent = `${Math.round(dish.share * 100)}% lineup`;
    head.appendChild(share);
    item.appendChild(head);

    const body = document.createElement('div');
    body.className = 'telemetry-body';
    [`Served ${dish.served}`, `Angry ${dish.angry}`, `Anger ${Math.round(dish.angerRate * 100)}%`].forEach((label) => {
      const span = document.createElement('span');
      span.textContent = label;
      body.appendChild(span);
    });
    item.appendChild(body);

    if (dish.matches.length) {
      const note = document.createElement('p');
      note.className = 'dish-telemetry-note';
      note.textContent = dish.matches.join(' · ');
      item.appendChild(note);
    }

    list.appendChild(item);
  });
};

const concludeDay = (outcome) => {
  clearServiceTimer();
  state.simRunning = false;
  state.servicePaused = false;
  setPhase('results');
  state.money += outcome.profit;
  state.hype = clamp(state.hype + outcome.hypeDelta, 0, 100);
  state.reputation = clamp(state.reputation + outcome.repDelta, 0, 100);
  state.lastResults = outcome;
  elements.startButton.disabled = false;
  elements.startButton.textContent = 'Run again';
  elements.serviceStatus.textContent = 'Service wrapped. Check results.';
  logServiceMessage(`Served ${outcome.served} guests. Profit ${currency(outcome.profit)}.`);
  if (outcome.dishTelemetry?.length) {
    const top = outcome.dishTelemetry[0];
    const laggard = outcome.dishTelemetry[outcome.dishTelemetry.length - 1];
    const topShare = Math.round(top.share * 100);
    const lagAnger = Math.round(laggard.angerRate * 100);
    logServiceMessage(`${top.name} carried (${top.served} plates · ${topShare}% lineup). ${laggard.name} saw ${laggard.angry} angry (${lagAnger}% anger).`);
  }
  finalizeInventory(outcome);
  evaluateDayRisk(outcome);
  recordComboHistory(outcome);
  updateHUD();
  updateResultsUI(outcome);
  if (!state.gameOver) {
    if (elements.nextDay) {
      elements.nextDay.disabled = false;
    }
    showResultsModal();
  } else {
    hideResultsModal();
  }
  syncModalNextDay();
  updateCommandButtons();
  updatePauseButton();
};

const updateResultsUI = (outcome) => {
  if (!outcome) {
    const summaryText = 'Finish a service day to see what changed.';
    elements.results.profit.textContent = '$0';
    elements.results.rating.textContent = '-';
    elements.results.hype.textContent = '0';
    elements.results.rep.textContent = '0';
    elements.results.summary.textContent = summaryText;
    ['revenue', 'expenses', 'ingredient', 'supplies', 'staff', 'upkeep'].forEach((key) => {
      elements.results[key].textContent = '$0';
    });
    renderDishTelemetry(null);
    syncResultsModal(null, summaryText);
    return;
  }
  const summaryText = buildSummary(outcome);
  elements.results.profit.textContent = currency(outcome.profit);
  elements.results.rating.textContent = `${outcome.rating}`;
  elements.results.hype.textContent = formatSigned(outcome.hypeDelta);
  elements.results.rep.textContent = formatSigned(outcome.repDelta);
  elements.results.revenue.textContent = currency(outcome.revenue);
  elements.results.expenses.textContent = currency(outcome.expenses);
  elements.results.ingredient.textContent = currency(outcome.ingredientCost);
  if (elements.results.supplies) {
    elements.results.supplies.textContent = currency(outcome.supplyCost || 0);
  }
  elements.results.staff.textContent = currency(outcome.staffCost);
  elements.results.upkeep.textContent = currency(outcome.upkeep);
  elements.results.summary.textContent = summaryText;
  renderDishTelemetry(outcome);
  syncResultsModal(outcome, summaryText);
};

const syncModalNextDay = () => {
  if (!elements.modalNextDay) return;
  const disabled = elements.nextDay ? elements.nextDay.disabled : true;
  elements.modalNextDay.disabled = disabled;
};

const syncResultsModal = (outcome, summaryText) => {
  if (!elements.modalSummary) return;
  const hasResults = Boolean(outcome);
  elements.modalSummary.textContent = summaryText;
  if (elements.modalProfit) {
    elements.modalProfit.textContent = hasResults ? currency(outcome.profit) : '$0';
  }
  if (elements.modalRating) {
    elements.modalRating.textContent = hasResults ? `${outcome.rating}` : '-';
  }
  if (elements.modalHypeDelta) {
    elements.modalHypeDelta.textContent = hasResults ? formatSigned(outcome.hypeDelta) : '0';
  }
  if (elements.modalRepDelta) {
    elements.modalRepDelta.textContent = hasResults ? formatSigned(outcome.repDelta) : '0';
  }
  const hypeTotal = clamp(state.hype || 0, 0, 100);
  const repTotal = clamp(state.reputation || 0, 0, 100);
  if (elements.modalHypeTotal) {
    elements.modalHypeTotal.textContent = `${hypeTotal}`;
  }
  if (elements.modalRepTotal) {
    elements.modalRepTotal.textContent = `${repTotal}`;
  }
  if (elements.modalHypeMeter) {
    elements.modalHypeMeter.style.width = `${hypeTotal}%`;
  }
  if (elements.modalRepMeter) {
    elements.modalRepMeter.style.width = `${repTotal}%`;
  }
  if (elements.resultsModalTrigger) {
    elements.resultsModalTrigger.disabled = !hasResults;
  }
  syncModalNextDay();
};

const showResultsModal = () => {
  if (!elements.resultsModal) return;
  elements.resultsModal.classList.add('open');
  elements.resultsModal.setAttribute('aria-hidden', 'false');
};

const hideResultsModal = () => {
  if (!elements.resultsModal) return;
  elements.resultsModal.classList.remove('open');
  elements.resultsModal.setAttribute('aria-hidden', 'true');
};

const buildSummary = (outcome) => {
  const tone = outcome.rating >= 85 ? 'Crushed service' : outcome.rating >= 70 ? 'Solid shift' : 'Rough day';
  const helper = outcome.helper.id === 'none' ? 'solo' : outcome.helper.name;
  const dishes = outcome.dishes.length ? outcome.dishes.join(', ') : 'no dishes';
  const leftoverNote = outcome.leftoverUnits ? ` Stock left: ${formatUnits(outcome.leftoverUnits)}.` : ' Zero carryover.';
  const contaminationNote = outcome.contamination ? ' Contamination alert hurt rep!' : '';
  const shortageNote = outcome.supplyShortfall ? ` ${formatUnits(outcome.supplyShortfall)} guests left hungry.` : '';
  const standout = outcome.dishTelemetry?.[0];
  const standoutNote = standout ? ` ${standout.name} handled ${formatUnits(standout.served)} (${Math.round(standout.share * 100)}%).` : '';
  const comboTier = typeof outcome.comboScore === 'number' ? tierForScore(Math.round(outcome.comboScore)) : null;
  const comboNote = comboTier ? ` Synergy grade ${comboTier} (~${Math.round(outcome.comboScore)} pts).` : '';
  return `${tone}! ${outcome.event.title} set the mood, ${helper} support, and the lineup (${dishes}) drove ${currency(outcome.revenue)} revenue.${standoutNote}${leftoverNote}${contaminationNote}${shortageNote}${comboNote}`;
};

const logServiceMessage = (message) => {
  const entry = document.createElement('p');
  entry.textContent = message;
  elements.serviceFeed.appendChild(entry);
  const maxEntries = 4;
  while (elements.serviceFeed.children.length > maxEntries) {
    elements.serviceFeed.removeChild(elements.serviceFeed.firstChild);
  }
};

const clearServiceTimer = () => {
  if (state.serviceTimer) {
    clearTimeout(state.serviceTimer);
    state.serviceTimer = null;
  }
};

const scheduleServiceTick = () => {
  clearServiceTimer();
  state.serviceTimer = setTimeout(serviceTick, SERVICE_INTERVAL_MS);
};

const serviceTick = () => {
  if (!state.simRunning || state.servicePaused || !state.activeOutcome || state.gameOver) return;
  let progress = state.serviceProgress + SERVICE_STEP_MIN + Math.random() * SERVICE_STEP_VARIANCE;
  if (progress >= 100) progress = 100;
  state.serviceProgress = progress;
  state.currentProgress = progress;
  elements.serviceBar.style.width = `${progress}%`;
  updateLiveStats();
  if (!state.serviceMidpointCalled && progress >= 50) {
    logServiceMessage('Halfway mark. Keep pace steady.');
    state.serviceMidpointCalled = true;
  }
  if (!state.serviceFinalCalled && progress >= 80) {
    logServiceMessage(state.lastEvent?.effects.turnout > 0 ? 'Rush still outside. Keep the grill hot.' : 'Slow trickle. Charm every guest you can.');
    state.serviceFinalCalled = true;
  }
  const selloutProgress = state.activeOutcome?.selloutProgress;
  if (!state.selloutWarned && selloutProgress && progress >= selloutProgress) {
    logServiceMessage('Stock nearly gone - rush mode or a flavor tease might squeeze extra plates.');
    state.selloutWarned = true;
  }
  const overstock = state.activeOutcome && state.activeOutcome.stockOnTruck > (state.activeOutcome.projectedDemand || 0) * 1.2;
  if (!state.slowStockWarned && overstock && progress >= 60) {
    logServiceMessage('Plenty of stock left. Spotlight or a tropical push could keep lines moving.');
    state.slowStockWarned = true;
  }
  if (progress >= 100) {
    clearServiceTimer();
    concludeDay(state.activeOutcome);
  } else {
    scheduleServiceTick();
  }
};

const updateEnvironmentHints = (event) => {
  if (!elements.hintList) return;
  const hints = buildEnvironmentHints(event);
  elements.hintList.innerHTML = '';
  hints.forEach((hint) => {
    const li = document.createElement('li');
    li.textContent = hint;
    elements.hintList.appendChild(li);
  });
};

const buildEnvironmentHints = (event) => {
  const hints = [];
  const price = PRICE_POINTS[state.pricePoint];
  const helper = HELPERS.find((entry) => entry.id === state.helper) || HELPERS[0];
  const dishes = getSelectedDishes();

  if (event) {
    if (event.effects.turnout > 0) {
      hints.push(`${event.title} will bump turnout ~${Math.round(event.effects.turnout * 100)}%. Slightly higher prices or an extra helper pay off.`);
    } else if (event.effects.turnout < 0) {
      hints.push(`${event.title} chills the crowd. Consider dropping to ${price.label === 'Street' ? 'street' : 'market'} pricing or lean on faster dishes.`);
    }
    if (event.effects.speed) {
      hints.push(event.effects.speed > 0 ? 'Ambient energy speeds the line. Ride the momentum.' : 'Supply drag will slow prep. Prioritize lighter dishes.');
    }
    if (event.effects.rating) {
      hints.push(event.effects.rating > 0 ? 'Critics nearby - quality focus can spike rating bonuses.' : 'Reputation risk today. Charm matters.');
    }
  }

  if (!dishes.length) {
    hints.push('No dishes locked in yet. Profits stall without a lineup.');
  } else {
    const fastDish = dishes.find((dish) => dish.prepSpeed >= 1.15);
    const slowDish = dishes.find((dish) => dish.prepSpeed <= 0.9);
    if (fastDish) hints.push(`${fastDish.name} is your speedster. Use it to cover any spikes.`);
    if (slowDish && dishes.length === 1) hints.push(`${slowDish.name} is slower solo - pair it with a quick seller to balance wait time.`);
    const avgPopularity = dishes.reduce((sum, dish) => sum + dish.popularity, 0) / dishes.length;
    if (avgPopularity > 1.1 && price.id !== 'premium') {
      hints.push('Lineup popularity is hot. You can nudge pricing toward premium without scaring guests.');
    }
  }

  if (state.hype >= 70 && price.id !== 'premium') {
    hints.push('Hype is booming. Premium price point keeps the cash stack rising.');
  } else if (state.hype <= 35 && price.id === 'premium') {
    hints.push('Low hype + premium pricing risks no-shows. Consider market pricing to keep volume.');
  }

  if (helper.id === 'none' && state.hype >= 60) {
    hints.push('Crowd projections are high. Hiring a runner will keep angry guests down.');
  }

  if (inventoryManager.units > 0) {
    const riskLabel = inventoryManager.describeRisk().level;
    hints.unshift(`Stock carryover ${formatUnits(inventoryManager.units)} (${riskLabel} risk).`);
  } else if ((state.purchaseUnits || 0) === 0) {
    hints.unshift('No supplies queued. You may sell out instantly.');
  }

  if (!hints.length) hints.push('Start service to surface live intel.');
  return hints.slice(0, 4);
};

const cloneOutcome = (outcome) => JSON.parse(JSON.stringify(outcome));

const refreshEconomy = (outcome) => {
  const baseExpenses = outcome.staffCost + outcome.upkeep + (outcome.supplyCost || 0) + (outcome.extraExpenses || 0);
  outcome.revenue = Math.round(outcome.served * outcome.pricePerTicket);
  outcome.ingredientCost = Math.round(outcome.served * outcome.avgCost);
  outcome.expenses = Math.round(outcome.ingredientCost + baseExpenses);
  outcome.profit = Math.round(outcome.revenue - outcome.expenses);
};

const applyLivePricePoint = (price) => {
  if (!state.simRunning || !state.activeOutcome || !price) return;
  const outcome = state.activeOutcome;
  const previousPrice = outcome.price || PRICE_POINTS.street;
  if (previousPrice.id === price.id) return;
  const avgMargin = outcome.pricePerTicket - previousPrice.price;
  const demand = outcome.projectedDemand || outcome.served + outcome.angry;
  const prevServed = outcome.served;
  const prevAngry = outcome.angry;
  const popularityRatio = clamp(price.popularity / Math.max(previousPrice.popularity, 0.2), 0.7, 1.25);
  const newServed = clamp(Math.round(demand * popularityRatio), 0, demand);
  const newAngry = Math.max(demand - newServed, 0);
  const qualityDiff = price.quality - previousPrice.quality;
  outcome.price = price;
  outcome.pricePerTicket = price.price + avgMargin;
  outcome.served = newServed;
  outcome.angry = newAngry;
  outcome.averageWait = clamp(outcome.averageWait + (popularityRatio >= 1 ? -1 : 1), 2, 18);
  outcome.rating = clamp(Math.round(outcome.rating + qualityDiff * 8 - (newAngry - prevAngry) * 0.4), 10, 100);
  outcome.hypeDelta = clamp(Math.round(outcome.hypeDelta + qualityDiff * 4 + (newServed - prevServed) * 0.05), -12, 20);
  outcome.repDelta = clamp(Math.round(outcome.repDelta + qualityDiff * 3 - (newAngry - prevAngry) * 0.04), -10, 12);
  refreshEconomy(outcome);
  recalcSupplyShortfall(outcome);
  updateLiveStats();
  updateResultsUI(outcome);
};

const recalcSupplyShortfall = (outcome, options = {}) => {
  if (!outcome) return;
  inventoryManager.applyOutcome(outcome, options);
  syncDishTelemetry(outcome);
};

const updateLiveStats = () => {
  if (!state.activeOutcome) return;
  const ratio = state.currentProgress / 100;
  updateServiceStats({
    served: Math.round(state.activeOutcome.served * ratio),
    angry: Math.round(state.activeOutcome.angry * ratio),
    wait: state.activeOutcome.averageWait,
    revenue: Math.round(state.activeOutcome.revenue * ratio),
  });
};

const updateCommandButtons = () => {
  if (!elements.commandButtons || elements.commandButtons.size === 0) return;
  elements.commandButtons.forEach((button, commandId) => {
    const used = state.serviceCommandsUsed?.has(commandId);
    const cooldown = getCommandCooldown(commandId);
    const disabled = !state.simRunning || used || state.servicePaused || state.gameOver || cooldown > 0;
    button.disabled = disabled;
    const status = button.querySelector('[data-status]');
    if (status) {
      if (cooldown > 0) {
        status.textContent = `Cooldown ${cooldown}d`;
      } else if (used && state.simRunning) {
        status.textContent = 'Used';
      } else if (!state.simRunning) {
        status.textContent = 'Prep';
      } else {
        status.textContent = 'Ready';
      }
    }
  });
  if (elements.commandNote) {
    elements.commandNote.textContent = state.gameOver
      ? 'Campaign over - reset to play.'
      : state.simRunning
        ? 'Tap once per service; some target rumors or drinks.'
        : 'Commands ready at service start. Cooldowns tick between days.';
  }
};

const updatePauseButton = () => {
  if (!elements.pauseButton) return;
  if (!state.simRunning || state.gameOver) {
    elements.pauseButton.disabled = true;
    elements.pauseButton.textContent = 'Pause';
    return;
  }
  elements.pauseButton.disabled = false;
  elements.pauseButton.textContent = state.servicePaused ? 'Resume' : 'Pause';
};

const handleServiceCommand = (commandId) => {
  if (!state.simRunning || !state.activeOutcome || state.servicePaused || state.gameOver) return;
  if (!SERVICE_COMMANDS[commandId] || state.serviceCommandsUsed.has(commandId)) return;
  if (isCommandCoolingDown(commandId)) {
    const turns = getCommandCooldown(commandId);
    logServiceMessage(`${SERVICE_COMMANDS[commandId].label} cooling down (${turns} day${turns === 1 ? '' : 's'} left).`);
    return;
  }
  state.serviceCommandsUsed.add(commandId);
  applyCommandEffect(commandId, state.activeOutcome);
  armCommandCooldown(commandId);
  refreshEconomy(state.activeOutcome);
  state.activeOutcome.rating = clamp(state.activeOutcome.rating, 10, 100);
  state.activeOutcome.hypeDelta = clamp(state.activeOutcome.hypeDelta, -12, 20);
  state.activeOutcome.repDelta = clamp(state.activeOutcome.repDelta, -10, 12);
  updateLiveStats();
  updateCommandButtons();
};

const applyCommandEffect = (commandId, outcome) => {
  if (!outcome) return;
  syncDishTelemetry(outcome);
  switch (commandId) {
    case 'rush': {
      outcome.served = Math.round(outcome.served * 1.15);
      outcome.angry = Math.round(outcome.angry * 1.35 + 2);
      outcome.rating -= 5;
      outcome.averageWait = clamp(outcome.averageWait - 1, 2, 18);
      logServiceMessage('Rush Mode: crew sprints and squeezes extra plates.');
      break;
    }
    case 'quality': {
      outcome.served = Math.max(1, Math.round(outcome.served * 0.9));
      outcome.angry = Math.max(0, Math.round(outcome.angry * 0.35));
      outcome.rating += 8;
      outcome.averageWait = clamp(outcome.averageWait + 2, 2, 18);
      logServiceMessage('Chef focus: plating gets extra care, fewer meltdowns.');
      break;
    }
    case 'form-spotlight': {
      applyAudienceSpotlight(outcome, 'form');
      break;
    }
    case 'flavor-spotlight': {
      applyAudienceSpotlight(outcome, 'flavor');
      break;
    }
    case 'tropical-push': {
      applyTropicalPush(outcome);
      break;
    }
    default:
      break;
  }
  recalcSupplyShortfall(outcome);
};

const togglePause = () => {
  if (!state.simRunning || state.gameOver) return;
  state.servicePaused = !state.servicePaused;
  if (state.servicePaused) {
    clearServiceTimer();
    elements.serviceStatus.textContent = 'Paused - crew catching breath.';
    logServiceMessage('Service paused to reset stations.');
  } else {
    elements.serviceStatus.textContent = 'Back on the line. Tickets moving.';
    logServiceMessage('Service resumed.');
    scheduleServiceTick();
  }
  updatePauseButton();
};

const finalizeInventory = (outcome) => {
  if (!outcome) return;
  const leftover = inventoryManager.finalizeService(outcome);
  updateSupplyUI();
  updateStockForecast(null);

  if (leftover > 0 && inventoryManager.age >= 2) {
    const riskChance = Math.min(0.2 + 0.15 * (inventoryManager.age - 1) + leftover / 100, 0.9);
    if (Math.random() < riskChance) {
      outcome.contamination = true;
      outcome.rating = clamp(outcome.rating - 12, 10, 100);
      outcome.hypeDelta = clamp(outcome.hypeDelta - 6, -20, 20);
      outcome.repDelta = clamp(outcome.repDelta - 10, -20, 20);
      state.reputation = clamp(state.reputation - 12, 0, 100);
      state.hype = clamp(state.hype - 8, 0, 100);
      state.strikes = Math.min(3, state.strikes + 1);
      logServiceMessage('Spoiled stock triggered health reports. Reputation tanked.');
    }
  }
};

const evaluateDayRisk = (outcome) => {
  if (!outcome) return;
  let strikesEarned = 0;
  const angryRatio = outcome.served ? outcome.angry / outcome.served : outcome.angry > 0 ? 1 : 0;
  if (outcome.profit <= 0) strikesEarned += 1;
  if (angryRatio >= 0.4) strikesEarned += 1;
  if (outcome.rating < 65) strikesEarned += 1;

  if (strikesEarned) {
    state.strikes = Math.min(3, state.strikes + strikesEarned);
    logServiceMessage(`Warning: ${strikesEarned} strike${strikesEarned > 1 ? 's' : ''} added.`);
  }

  let reason = null;
  let detail = '';
  if (state.money < 0) {
    reason = 'Bankrupt';
    detail = 'Cash dipped below zero.';
  } else if (state.reputation <= 10) {
    reason = 'Reputation Burned';
    detail = 'Critics dropped you after too many rough days.';
  } else if (state.hype <= 5) {
    reason = 'Hype Flatlined';
    detail = 'No crowd left to serve.';
  } else if (state.strikes >= 3) {
    reason = 'Three Strikes';
    detail = 'Too many losses and upset guests.';
  }

  if (reason) {
    triggerFailure(reason, detail);
  }

  updateHUD();
};

const triggerFailure = (reason, detail) => {
  if (state.gameOver) return;
  clearServiceTimer();
  state.simRunning = false;
  state.servicePaused = false;
  state.gameOver = true;
  hideResultsModal();
  if (elements.startButton) {
    elements.startButton.disabled = true;
    elements.startButton.textContent = 'Restart required';
  }
  if (elements.pauseButton) {
    elements.pauseButton.disabled = true;
    elements.pauseButton.textContent = 'Pause';
  }
  if (elements.nextDay) {
    elements.nextDay.disabled = true;
  }
  if (elements.serviceStatus) {
    elements.serviceStatus.textContent = 'Campaign failed. Reset to try again.';
  }
  if (elements.failReason) elements.failReason.textContent = reason;
  if (elements.failDetail) elements.failDetail.textContent = detail;
  if (elements.failOverlay) {
    elements.failOverlay.classList.add('show');
    elements.failOverlay.setAttribute('aria-hidden', 'false');
  }
  updateCommandButtons();
  updatePauseButton();
};

const hideFailureOverlay = () => {
  if (!elements.failOverlay) return;
  elements.failOverlay.classList.remove('show');
  elements.failOverlay.setAttribute('aria-hidden', 'true');
};

const init = () => {
  cacheElements();
  updatePhaseGuide();
  updatePhasePanels();
  syncModalNextDay();
  updateResultsUI(null);
  renderLabSelects();
  refreshDishLibrary({ showHint: true });
  renderEventLibrary();
  renderHelperSelect();
  renderCommandButtons();
  updateHelperNote();
  updateLabPreview();
  rollAudienceTrend();
  updateHUD();
  attachEvents();
  setPrepMessage('Recipe Lab: craft combos, then select up to 3 to prep.');
  updateCommandButtons();
  updateEnvironmentHints(null);
  updateSupplyUI();
  updateStockForecast(null);
};

init();
