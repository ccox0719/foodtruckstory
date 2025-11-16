
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const BASE_TRUCK_STATS = Object.freeze({ speed: 1, capacity: 28 });
const BASE_STAFF_STATS = Object.freeze({ efficiency: 1, charm: 1 });

const createUpgradeBonusState = () => ({
  hypeDailyBonus: 0,
  upkeepReductionPct: 0,
  suppliesCostPct: 0,
  servingsCapacityAdd: 0,
  hypeRandomRange: null,
});

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

const VARIANT_ADJECTIVES = [
  'Glinting',
  'Velvet',
  'Smoldering',
  'Crisp',
  'Neon',
  'Luminous',
  'Aurora',
  'Ember',
  'Frosted',
  'Verdant',
];

const randomVariantDelta = (range) => (Math.random() - 0.5) * range;

const describeVariantAdjustments = (adjustments) => {
  const parts = [];
  if (typeof adjustments.popularityDelta === 'number' && adjustments.popularityDelta !== 0) {
    const sign = adjustments.popularityDelta > 0 ? '+' : '';
    parts.push(`${sign}${(adjustments.popularityDelta * 100).toFixed(0)}% appeal`);
  }
  if (typeof adjustments.prepSpeedDelta === 'number' && adjustments.prepSpeedDelta !== 0) {
    const sign = adjustments.prepSpeedDelta > 0 ? '+' : '';
    parts.push(`${sign}${(adjustments.prepSpeedDelta * 100).toFixed(0)}% prep speed`);
  }
  if (typeof adjustments.marginDelta === 'number' && adjustments.marginDelta !== 0) {
    const sign = adjustments.marginDelta > 0 ? '+' : '';
    parts.push(`${sign}${(adjustments.marginDelta * 100).toFixed(0)}% margin`);
  }
  return parts.length ? parts.join(' • ') : 'Balanced tweak';
};

const createRecipeVariant = () => {
  const label = VARIANT_ADJECTIVES[Math.floor(Math.random() * VARIANT_ADJECTIVES.length)];
  const adjustments = {
    prepSpeedDelta: randomVariantDelta(0.16),
    popularityDelta: randomVariantDelta(0.22),
    marginDelta: randomVariantDelta(0.32),
  };
  const scoreDelta = Math.round(
    adjustments.popularityDelta * 45
      + adjustments.prepSpeedDelta * 35
      + adjustments.marginDelta * 20,
  );
  return {
    label,
    adjustments,
    scoreDelta,
    note: describeVariantAdjustments(adjustments),
  };
};

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
// PATCH 1: Swingier risk profiles (bigger upside & downside)
const RISK_PROFILES = {
  safe: {
    label: 'Reliable',
    margin: 0.02,
    popularity: 0.08,
    speedBoost: 0.08,
    ratingShift: 3,
    hypeBoost: -1,
    description: 'Crowd-pleaser with low variance and low upside.',
  },
  classic: {
    label: 'Classic',
    margin: 0.18,
    popularity: 0.03,
    ratingShift: 1,
    hypeBoost: 0,
    description: 'Baseline staple. Most consistent path to steady growth.',
  },
  bold: {
    label: 'Bold Fusion',
    margin: 0.55,
    popularity: -0.04,
    speedPenalty: 0.02,
    hypeBoost: 2,
    ratingShift: -1,
    description: 'High margin and hype, but tougher on rating when it whiffs.',
  },
  experimental: {
    label: 'Experimental',
    margin: 0.8,
    popularity: -0.08,
    speedPenalty: 0.05,
    hypeBoost: 4,
    ratingShift: -2,
    description: 'Big hype spikes when it hits; ratings tank on bad days.',
  },
  volatile: {
    label: 'High Risk',
    margin: 1.1,
    popularity: -0.12,
    speedPenalty: 0.06,
    hypeBoost: 6,
    ratingShift: -3,
    description: 'Lottery ticket: can explode your brand or nearly sink it.',
  },
};

const buildDishFromBlueprint = (blueprint, { name, keySuffix, variant } = {}) => {
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
  const adjustments = variant?.adjustments || {};
  const prepSpeedDelta = adjustments.prepSpeedDelta ?? 0;
  let prepSpeed = derivePrepSpeed(blueprint.prepTier);
  if (riskProfile.speedPenalty) prepSpeed -= riskProfile.speedPenalty;
  if (riskProfile.speedBoost) prepSpeed += riskProfile.speedBoost;
  prepSpeed += prepSpeedDelta;
  prepSpeed = clamp(prepSpeed, 0.55, 1.35);
  const popularityDelta = adjustments.popularityDelta ?? 0;
  let popularity = derivePopularity(blueprint.appealTier, blueprint.trendTier);
  popularity = clamp(popularity + (riskProfile.popularity || 0) + popularityDelta, 0.75, 1.5);
  const marginDelta = adjustments.marginDelta ?? 0;
  let margin = deriveMargin(blueprint.trendTier, blueprint.costTier) + (riskProfile.margin || 0) + marginDelta;
  margin = clamp(margin, 2.3, 6);
  const baseEval = evaluateBlueprintCore(blueprint);
  const variantScoreDelta = variant?.scoreDelta ?? 0;
  const rawScore = baseEval.score + variantScoreDelta;
  const clampedScore = clamp(rawScore, COMBO_MATRIX.hardRules.clampMin, COMBO_MATRIX.hardRules.clampMax);
  const finalScore = Math.round(clampedScore);
  const finalTier = tierForScore(clampedScore);
  const variantMeta = variant
    ? {
      label: variant.label,
      note: variant.note,
      adjustments: {
        prepSpeedDelta,
        popularityDelta,
        marginDelta,
      },
      scoreDelta: variantScoreDelta,
    }
    : null;
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
    baseTier: finalTier,
    baseScore: finalScore,
    baseHiddenTitle: baseEval.hiddenTitle,
    variant: variantMeta,
  };
};

// PATCH 2: Sharper pricing tradeoffs
const PRICE_POINTS = {
  street: {
    id: 'street',
    label: 'Street',
    price: 9,
    popularity: 1.25,
    quality: 0.8,
    blurb: 'Max volume, but guests expect less polish.',
  },
  market: {
    id: 'market',
    label: 'Market',
    price: 12,
    popularity: 1,
    quality: 1,
    blurb: 'Balanced reputation + demand.',
  },
  premium: {
    id: 'premium',
    label: 'Premium',
    price: 16,
    popularity: 0.8,
    quality: 1.25,
    blurb: 'Higher ticket and expectations; great if rating stays strong.',
  },
  vip: {
    id: 'vip',
    label: 'VIP',
    price: 19,
    popularity: 0.6,
    quality: 1.45,
    blurb: 'Huge upside on great days; punishing if reviews slip.',
  },
};

const HELPERS = [
  { id: 'none', name: 'Solo shift', description: 'No helper. Keep expenses low.', cost: 0, efficiency: 0, charm: 0, capacity: 0 },
  { id: 'runner', name: 'Line Runner', description: 'Speeds plating, +5% capacity.', cost: 45, efficiency: 0.2, charm: 0, capacity: 0.05 },
  { id: 'grill', name: 'Grill Anchor', description: 'Keeps proteins flowing, +8% cap, +5 charm.', cost: 65, efficiency: 0.12, charm: 0.05, capacity: 0.08 },
  { id: 'host', name: 'Hype Host', description: 'Lines move slower but guests stay chill.', cost: 55, efficiency: 0, charm: 0.18, capacity: 0 },
];

// --- STARTING PROFILES + LOAN SYSTEM ------------------------

const PROFILE_PRESETS = [
  {
    id: 'bootstrapped_cart',
    name: 'Bootstrapped Cart',
    description: 'No debt, small cart, slower start but very forgiving.',
    startingRep: 6,
    startingHype: 4,
    startingBank: 100,
    startingLoan: 0,
    truckSpeed: 0.9,
    truckCapacity: 24,
    loanDueDay: null,
    loanRiskMultiplier: 0.8,
    loanRewardMultiplier: 0.8,
  },
  {
    id: 'family_truck',
    name: 'Family Truck',
    description: 'Steady starter truck with a modest community reputation.',
    startingRep: 10,
    startingHype: 8,
    startingBank: 250,
    startingLoan: 800,
    truckSpeed: 1.0,
    truckCapacity: 28,
    loanDueDay: 10,
    loanRiskMultiplier: 1.0,
    loanRewardMultiplier: 1.1,
  },
  {
    id: 'festival_regular',
    name: 'Festival Regular',
    description: 'Bigger rig, built for crowds, but carrying real debt.',
    startingRep: 14,
    startingHype: 12,
    startingBank: 400,
    startingLoan: 1200,
    truckSpeed: 1.05,
    truckCapacity: 32,
    loanDueDay: 8,
    loanRiskMultiplier: 1.3,
    loanRewardMultiplier: 1.35,
  },
  {
    id: 'high_roller_launch',
    name: 'High-Roller Launch',
    description: 'Backer-funded launch with serious expectations.',
    startingRep: 18,
    startingHype: 16,
    startingBank: 600,
    startingLoan: 1800,
    truckSpeed: 1.12,
    truckCapacity: 36,
    loanDueDay: 6,
    loanRiskMultiplier: 1.6,
    loanRewardMultiplier: 1.7,
  },
];

const getProfilePresetById = (id) => PROFILE_PRESETS.find((preset) => preset.id === id) || null;

const getActiveProfilePreset = () => getProfilePresetById(state.starterProfileId) || null;

const formatMultiplier = (value) => {
  const numeric = Number.isFinite(Number(value)) ? Number(value) : 1;
  const text = numeric.toFixed(2);
  return text.endsWith('.00') ? text.slice(0, -3) : text;
};

const renderProfileOptions = () => {
  if (!elements.profileOptions) return;
  const markup = PROFILE_PRESETS.map((preset) => {
    const bank = currency(preset.startingBank ?? 0);
    const loanLabel =
      preset.startingLoan && preset.startingLoan > 0
        ? `${currency(preset.startingLoan)} due Day ${preset.loanDueDay ?? 'TBD'}`
        : 'None';
    const speed = (preset.truckSpeed ?? BASE_TRUCK_STATS.speed).toFixed(2);
    const capacity = preset.truckCapacity ?? BASE_TRUCK_STATS.capacity;
    const risk = formatMultiplier(preset.loanRiskMultiplier ?? 1);
    const reward = formatMultiplier(preset.loanRewardMultiplier ?? 1);

    return `
      <button class="profile-option" type="button" data-profile-id="${preset.id}" role="listitem">
        <div class="profile-option-head">
          <p class="eyebrow">Launch profile</p>
          <h3>${preset.name}</h3>
        </div>
        <p class="profile-option-description">${preset.description}</p>
        <div class="profile-metrics">
          <div>
            <p class="mini-label">Bank</p>
            <p>${bank}</p>
          </div>
          <div>
            <p class="mini-label">Loan</p>
            <p>${loanLabel}</p>
          </div>
          <div>
            <p class="mini-label">Speed &amp; capacity</p>
            <p>${speed}x / ${capacity}</p>
          </div>
          <div>
            <p class="mini-label">Risk &amp; reward</p>
            <p>${risk}x / ${reward}x</p>
          </div>
        </div>
      </button>
    `;
  });
  elements.profileOptions.innerHTML = markup.join('');
};

const showProfileModal = () => {
  if (!elements.profileModal) return;
  elements.profileModal.classList.add('open');
  elements.profileModal.setAttribute('aria-hidden', 'false');
  const firstOption = elements.profileOptions?.querySelector('[data-profile-id]');
  if (firstOption && typeof firstOption.focus === 'function') {
    firstOption.focus();
  }
};

const hideProfileModal = () => {
  if (!elements.profileModal) return;
  elements.profileModal.classList.remove('open');
  elements.profileModal.setAttribute('aria-hidden', 'true');
};

/**
 * Apply profile stats + loan to the core economy fields.
 * This is where we actually set day, money, hype, rep, and loan tracking.
 */
const applyStarterProfile = (profile) => {
  state.starterProfileId = profile.id;
  state.day = 1;

  state.profileTruckSpeed = profile.truckSpeed ?? BASE_TRUCK_STATS.speed;
  state.profileTruckCapacity = profile.truckCapacity ?? BASE_TRUCK_STATS.capacity;

  state.truck.speed = state.profileTruckSpeed;
  state.truck.capacity = state.profileTruckCapacity;

  state.loanPrincipal = Math.max(0, profile.startingLoan || 0);
  state.loanDueDay = state.loanPrincipal > 0 ? profile.loanDueDay ?? 10 : null;
  state.loanPaid = state.loanPrincipal <= 0;
  state.loanDefaulted = false;
  state.loanRiskMultiplier = profile.loanRiskMultiplier ?? 1;
  state.loanRewardMultiplier = profile.loanRewardMultiplier ?? 1;

  const startingCash = profile.startingBank || 0;
  state.money = startingCash;
  state.hype = profile.startingHype ?? state.hype;
  state.reputation = profile.startingRep ?? state.reputation;

  if (state.loanPrincipal > 0 && state.loanDueDay != null) {
    logServiceMessage(
      `${profile.name} chosen: Bank ${currency(startingCash)}, loan ${currency(state.loanPrincipal)} due Day ${state.loanDueDay}.`,
    );
  } else {
    logServiceMessage(`${profile.name} chosen: Bank ${currency(startingCash)} with no lenders breathing down your neck.`);
  }

  syncProfileSelectionUI();
};

const applyProfileRiskAndReward = (outcome) => {
  const profile = getActiveProfilePreset();
  if (!profile || !outcome) return;
  const risk = state.loanRiskMultiplier ?? profile.loanRiskMultiplier ?? 1;
  const reward = state.loanRewardMultiplier ?? profile.loanRewardMultiplier ?? 1;

  if (outcome.profit >= 0) {
    outcome.profit = Math.round(outcome.profit * reward);
  } else {
    outcome.profit = Math.round(outcome.profit * risk);
  }

  outcome.hypeDelta =
    outcome.hypeDelta >= 0 ? Math.round(outcome.hypeDelta * reward) : Math.round(outcome.hypeDelta * risk);

  outcome.repDelta =
    outcome.repDelta >= 0 ? Math.round(outcome.repDelta * reward) : Math.round(outcome.repDelta * risk);

  outcome.angry = Math.max(0, Math.round(outcome.angry * risk));
  if (outcome.served) {
    outcome.angerRate = outcome.angry / outcome.served;
  }
};

const syncProfileSelectionUI = () => {
  enforceSupplyCapacity();
  if (elements && Object.keys(elements).length) {
    updateHUD();
    applyReputationLocks();
    updateSupplyUI();
    updateCommandButtons();
    if (typeof updateComboNote === 'function') {
      updateComboNote();
    }
    updateStockForecast(null);
  }
};

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

// PATCH 3: Stronger lineup synergies (reward smart 3-item menus)
const LINEUP_SYNERGIES = [
  {
    id: 'full-spread',
    label: 'Full spread',
    description: 'Anchor bowl + handheld + drink cover every craving.',
    check(dishes) {
      if (dishes.length < 3) return null;
      const forms = new Set(dishes.map((dish) => dish.form));
      const hasBowl = forms.has('Bowl');
      const hasHandheld = forms.has('Handheld') || forms.has('Wrap');
      const hasDrink = forms.has('Drink');
      if (hasBowl && hasHandheld && hasDrink) {
        return { demandMod: 0.22, ratingMod: 6, hypeMod: 4 };
      }
      return null;
    },
  },
  {
    id: 'flavor-band',
    label: 'Flavor band',
    description: 'Three distinct flavor profiles widen appeal.',
    check(dishes) {
      if (dishes.length < 3) return null;
      const flavors = new Set(dishes.map((dish) => dish.flavor));
      if (flavors.size >= 3) {
        return { demandMod: 0.14, ratingMod: 3, hypeMod: 2 };
      }
      return null;
    },
  },
  {
    id: 'anchor-plus-wildcard',
    label: 'Anchor + wildcard',
    description: 'Two reliable staples plus one risky experiment.',
    check(dishes) {
      if (dishes.length < 3) return null;
      const safeish = ['safe', 'classic'];
      const boldish = ['bold', 'experimental', 'volatile'];
      const safeCount = dishes.filter((dish) => safeish.includes(dish?.risk?.id || dish?.risk)).length;
      const boldCount = dishes.filter((dish) => boldish.includes(dish?.risk?.id || dish?.risk)).length;
      if (safeCount >= 2 && boldCount >= 1) {
        return { demandMod: 0.09, ratingMod: 2, hypeMod: 5 };
      }
      return null;
    },
  },
  {
    id: 'closer-drink',
    label: 'Sweet closer',
    description: 'Fast, low-cost drink boosts per-guest revenue.',
    check(dishes) {
      if (dishes.length < 3) return null;
      const drink = dishes.find((dish) => dish.form === 'Drink');
      if (!drink) return null;
      const costTier = Number(drink.costTier ?? drink.tiers?.cost ?? 3);
      const prepTier = Number(drink.prepTier ?? drink.tiers?.prep ?? 3);
      if (costTier <= 2 && prepTier <= 2) {
        return { demandMod: 0.08, ratingMod: 0, hypeMod: 2 };
      }
      return null;
    },
  },
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

// PATCH 7: Swingier daily events (bigger boom & bust days)
const EVENTS = [
  {
    id: 'bluebird',
    title: 'Bluebird Skies',
    description: 'Sunshine brings the neighborhood out in force.',
    effects: { turnout: 0.4, hype: 3, rating: 5 },
  },
  {
    id: 'rain',
    title: 'Rain Drizzle',
    description: 'Rain jackets and umbrellas thin the crowd.',
    effects: { turnout: -0.35, hype: -2, rating: -6 },
  },
  {
    id: 'critic',
    title: 'Local Blogger Drops In',
    description: 'Serve fast and keep them happy for bonus rep.',
    effects: { turnout: 0.08, hype: 2, rating: 9 },
  },
  {
    id: 'rush-hour',
    title: 'Rush Hour Detour',
    description: 'Office crowd spills over for a surprise spike.',
    effects: { turnout: 0.28, hype: 1, rating: 3 },
  },
  {
    id: 'supply',
    title: 'Supplier Delay',
    description: 'Ingredients arrive tight, so prep is slower.',
    effects: { turnout: -0.12, hype: -1, rating: -4, speed: -0.1 },
  },
  {
    id: 'festival',
    title: 'Street Fest Nearby',
    description: 'Crowd energy is high, but expectations too.',
    effects: { turnout: 0.35, hype: 4, rating: -1 },
  },
];

const EVENT_CONTEXT_TAGS = {
  bluebird: ['weatherHot'],
  rain: ['weatherCold'],
  festival: ['festival'],
  'rush-hour': ['officeLunch'],
};

const STRIKE_BRIBE_STORIES = [
  'A health inspector slides a file across the counter: "{amount} for a fresh slate, and this paperwork never existed."',
  'Your fixer cousin texts: "{amount} buys a round of bao for the committee and erases one strike."',
  'A neighborhood blogger whispers, "Grease the hype crew with {amount} and those angry posts disappear."',
  'A city clerk winks: "{amount} keeps the complaint line mysteriously busy elsewhere tonight."',
];

const formatStrikeBribeStory = (amount) => {
  const template = STRIKE_BRIBE_STORIES[Math.floor(Math.random() * STRIKE_BRIBE_STORIES.length)];
  return template.replace('{amount}', currency(amount));
};

const SERVICE_STEP_MIN = 1;
const SERVICE_STEP_VARIANCE = 3;
const SERVICE_INTERVAL_MS = 640;
const SUPPLY_COST_PER_UNIT = 4;
const SUPPLY_MAX_UNITS = 80;
const getSupplyCapacityLimitFromState = (stateRef) => {
  const truckCapacity = Number(stateRef?.truck?.capacity);
  if (!Number.isNaN(truckCapacity) && truckCapacity > 0) {
    return Math.max(1, Math.round(truckCapacity));
  }
  return SUPPLY_MAX_UNITS;
};

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
    const capacity = getSupplyCapacityLimitFromState(this.state);
    const current = this.units;
    const room = Math.max(capacity - current, 0);
    const amount = clamp(units || 0, 0, room);
    if (amount <= 0) return 0;
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

  reset() {
    this.state.inventory = { units: 0, age: 0 };
    this.resetPurchasePlan();
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

const UPGRADE_DECK = [
  {
    id: 'truck_suspension',
    category: 'truck',
    name: 'Reinforced Suspension',
    cost: 450,
    upkeep: 0,
    effects: {
      speed_mult: 1.1,
      hype_daily_bonus: 1,
    },
    unlock_requirements: [],
    description: 'Smoother ride and tighter handling. Slightly faster line flow.',
  },
  {
    id: 'truck_second_window',
    category: 'truck',
    name: 'Dual Service Window',
    cost: 900,
    upkeep: 5,
    effects: {
      capacity_add: 6,
      speed_mult: 1.05,
    },
    unlock_requirements: ['truck_suspension'],
    description: 'Open a second window to handle more guests during rushes.',
  },
  {
    id: 'truck_hotbox',
    category: 'truck',
    name: 'Insulated Hot Hold Box',
    cost: 600,
    upkeep: 3,
    effects: {
      angry_reduction_pct: 10,
      waste_reduction_pct: 10,
    },
    unlock_requirements: ['truck_second_window'],
    description: 'Keeps food warm longer, reducing angry guests and waste.',
  },
  {
    id: 'truck_vent_system',
    category: 'truck',
    name: 'High-Flow Vent System',
    cost: 1200,
    upkeep: 6,
    effects: {
      speed_mult: 1.1,
      staff_efficiency_mult: 1.05,
    },
    unlock_requirements: ['truck_hotbox'],
    description: 'Powerful airflow improves cooking performance and kitchen comfort.',
  },
  {
    id: 'equip_griddle_plate',
    category: 'equipment',
    name: 'Cast Iron Griddle Plate',
    cost: 350,
    upkeep: 0,
    effects: {
      cook_speed_pct: 15,
    },
    unlock_requirements: [],
    description: 'Heats evenly and cooks faster. Great for bowls and wraps.',
  },
  {
    id: 'equip_sous_vide',
    category: 'equipment',
    name: 'Precision Sous-Vide Station',
    cost: 500,
    upkeep: 0,
    effects: {
      signature_unlock: 'tender',
      hype_on_meat_dishes: 2,
    },
    unlock_requirements: ['equip_griddle_plate'],
    description: 'Tender, consistent meats. Unlocks premium meat kits.',
  },
  {
    id: 'equip_double_rice',
    category: 'equipment',
    name: 'Double-Batch Rice Cooker',
    cost: 450,
    upkeep: 0,
    effects: {
      servings_capacity_add: 8,
      revenue_rice_dishes_pct: 5,
    },
    unlock_requirements: [],
    description: 'Cook more rice per cycle and improve bowl profitability.',
  },
  {
    id: 'equip_steam_well',
    category: 'equipment',
    name: 'Double-Well Steam Table',
    cost: 700,
    upkeep: 3,
    effects: {
      angry_reduction_pct: 10,
    },
    unlock_requirements: ['equip_double_rice'],
    description: 'Keeps food hot and reduces line frustration during rushes.',
  },
  {
    id: 'equip_cold_line',
    category: 'equipment',
    name: 'Expanded Cold Line',
    cost: 520,
    upkeep: 2,
    effects: {
      fresh_unlock: true,
      rating_ceiling_add: 1,
    },
    unlock_requirements: [],
    description: 'More room for crisp toppings. Fresh dishes get better scores.',
  },
  {
    id: 'staff_training_1',
    category: 'staff',
    name: 'Helper Training I',
    cost: 300,
    upkeep: 0,
    effects: {
      efficiency_mult: 1.05,
    },
    unlock_requirements: [],
    description: 'Basic training that improves flow during busy periods.',
  },
  {
    id: 'staff_training_2',
    category: 'staff',
    name: 'Helper Training II',
    cost: 500,
    upkeep: 2,
    effects: {
      command_unlock: 'fast_pass',
    },
    unlock_requirements: ['staff_training_1'],
    description: 'Advanced training unlocks a once-per-day Fast Pass command.',
  },
  {
    id: 'staff_barista',
    category: 'staff',
    name: 'Barista Certification',
    cost: 650,
    upkeep: 3,
    effects: {
      drink_revenue_pct: 15,
      drinks_unlocked: true,
    },
    unlock_requirements: [],
    description: 'Opens a drink menu and improves profit margins.',
  },
  {
    id: 'staff_charm',
    category: 'staff',
    name: 'Front-of-House Charm Boost',
    cost: 500,
    upkeep: 0,
    effects: {
      charm_mult: 1.1,
    },
    unlock_requirements: [],
    description: 'Improve customer rapport. Ratings climb more easily.',
  },
  {
    id: 'brand_signage',
    category: 'brand',
    name: 'Branding Kit I',
    cost: 400,
    upkeep: 0,
    effects: {
      hype_daily_bonus: 3,
    },
    unlock_requirements: [],
    description: 'Better signage helps boost morning hype.',
  },
  {
    id: 'brand_social',
    category: 'brand',
    name: 'Branding Kit II',
    cost: 650,
    upkeep: 0,
    effects: {
      hype_random_range: [1, 3],
    },
    unlock_requirements: ['brand_signage'],
    description: 'Social media buzz adds small random hype after service.',
  },
  {
    id: 'brand_smoker',
    category: 'brand',
    name: 'Smoker Upgrade',
    cost: 700,
    upkeep: 3,
    effects: {
      unlock_flavor_tier: 'smoke_2',
      trend_chance_smoke_pct: 10,
    },
    unlock_requirements: [],
    description: 'More smoke, more trend potential. Unlock tier 2 smoke kits.',
  },
  {
    id: 'brand_fusion',
    category: 'brand',
    name: 'Fusion Line Unlock',
    cost: 900,
    upkeep: 6,
    effects: {
      unlock_dual_flavors: true,
    },
    unlock_requirements: ['brand_social'],
    description: 'Combine flavors like Tropical Heat and Garden Fresh.',
  },
  {
    id: 'brand_premium',
    category: 'brand',
    name: 'Premium Ingredient License',
    cost: 1200,
    upkeep: 10,
    effects: {
      unlock_premium: true,
      price_point_add: 2,
      rating_ceiling_add: 2,
    },
    unlock_requirements: [],
    description: 'Access premium ingredients and boost your rating potential.',
  },
  {
    id: 'econ_fuel',
    category: 'economy',
    name: 'Fuel Efficiency Mods',
    cost: 300,
    upkeep: -2,
    effects: {
      upkeep_reduction_pct: 10,
    },
    unlock_requirements: [],
    description: 'Better mileage reduces daily expenses.',
  },
  {
    id: 'econ_bulk',
    category: 'economy',
    name: 'Bulk Supplier Contract',
    cost: 350,
    upkeep: 0,
    effects: {
      supplies_cost_pct: -15,
      old_stock_risk_add: 5,
    },
    unlock_requirements: [],
    description: 'Cheaper supplies but higher risk when carrying over stock.',
  },
  {
    id: 'econ_loyalty',
    category: 'economy',
    name: 'VIP Loyalty Program',
    cost: 500,
    upkeep: 3,
    effects: {
      repeat_revenue_pct: 5,
      critic_harshness_pct: -5,
    },
    unlock_requirements: [],
    description: 'Encourages returning fans and softens critic scores.',
  },
  {
    id: 'econ_weather',
    category: 'economy',
    name: 'Weather Shielding',
    cost: 480,
    upkeep: 2,
    effects: {
      weather_penalty_pct: -50,
    },
    unlock_requirements: [],
    description: 'Reduces negative effects from bad weather.',
  },
];

const UPGRADE_LOOKUP = new Map(UPGRADE_DECK.map((upgrade) => [upgrade.id, upgrade]));

const UPGRADE_CATEGORY_META = {
  truck: { label: 'Truck systems', blurb: 'Capacity, speed, and flow control.' },
  equipment: { label: 'Kitchen gear', blurb: 'Prep stations that unlock formats.' },
  staff: { label: 'Crew development', blurb: 'Boost helpers, unlock commands.' },
  brand: { label: 'Brand/marketing', blurb: 'Hype swings + new flavor ceilings.' },
  economy: { label: 'Economy', blurb: 'Cost control & passive revenue.' },
};

const DIFFICULTY_STORAGE_KEY = 'fts_difficulty_tuning_v1';
const DEFAULT_DIFFICULTY = Object.freeze({
  upkeepMultiplier: 1,
  ingredientCostMultiplier: 1,
  helperCostMultiplier: 1,
  turnoutMultiplier: 1,
  hypeDeltaMultiplier: 1,
  eventEffectMultiplier: 1,
  serviceSpeedMultiplier: 1,
  angryTolerance: 1,
  spoilageRiskMultiplier: 1,
});

const DIFFICULTY_FIELDS = [
  {
    id: 'upkeepMultiplier',
    inputId: 'difficulty-upkeep',
    valueId: 'difficulty-upkeep-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.5,
    max: 2,
  },
  {
    id: 'ingredientCostMultiplier',
    inputId: 'difficulty-ingredient',
    valueId: 'difficulty-ingredient-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.5,
    max: 2,
  },
  {
    id: 'helperCostMultiplier',
    inputId: 'difficulty-helper',
    valueId: 'difficulty-helper-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.5,
    max: 2,
  },
  {
    id: 'turnoutMultiplier',
    inputId: 'difficulty-turnout',
    valueId: 'difficulty-turnout-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.5,
    max: 2,
  },
  {
    id: 'hypeDeltaMultiplier',
    inputId: 'difficulty-hype',
    valueId: 'difficulty-hype-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.5,
    max: 2,
  },
  {
    id: 'eventEffectMultiplier',
    inputId: 'difficulty-event',
    valueId: 'difficulty-event-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.5,
    max: 2,
  },
  {
    id: 'serviceSpeedMultiplier',
    inputId: 'difficulty-service',
    valueId: 'difficulty-service-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.5,
    max: 2,
  },
  {
    id: 'angryTolerance',
    inputId: 'difficulty-angry',
    valueId: 'difficulty-angry-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.5,
    max: 2,
  },
  {
    id: 'spoilageRiskMultiplier',
    inputId: 'difficulty-spoilage',
    valueId: 'difficulty-spoilage-value',
    format: (value) => `${value.toFixed(2)}×`,
    min: 0.25,
    max: 2,
  },
];

const getDifficultyStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (error) {
    return null;
  }
  return null;
};

const loadDifficultySettings = () => {
  const storage = getDifficultyStorage();
  if (!storage) return { ...DEFAULT_DIFFICULTY };
  try {
    const saved = storage.getItem(DIFFICULTY_STORAGE_KEY);
    if (!saved) return { ...DEFAULT_DIFFICULTY };
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_DIFFICULTY, ...parsed };
  } catch (error) {
    return { ...DEFAULT_DIFFICULTY };
  }
};

const persistDifficultySettings = () => {
  const storage = getDifficultyStorage();
  if (!storage) return;
  try {
    storage.setItem(DIFFICULTY_STORAGE_KEY, JSON.stringify(state.difficulty));
  } catch (error) {
    // ignore persistence failures
  }
};

const state = {
  day: 1,
  money: 100,
  hype: 10,
  reputation: 10,
  truck: { ...BASE_TRUCK_STATS },
  staff: { ...BASE_STAFF_STATS },
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
  lastCraftDay: 0,
  comboHistory: {},
  lastSupplyUnitCost: SUPPLY_COST_PER_UNIT,
  difficulty: loadDifficultySettings(),
  ownedUpgrades: new Set(),
  upgradeBonuses: createUpgradeBonusState(),
  totalUpgradeUpkeep: 0,
  strikeBribeUsed: false,
  starterProfileId: null,
  loanPrincipal: 0,
  loanDueDay: null,
  loanPaid: false,
  loanDefaulted: false,
  loanRiskMultiplier: 1,
  loanRewardMultiplier: 1,
  profileTruckSpeed: BASE_TRUCK_STATS.speed,
  profileTruckCapacity: BASE_TRUCK_STATS.capacity,
};

const getSupplyCapacityLimit = () => getSupplyCapacityLimitFromState(state);

const enforceSupplyCapacity = () => {
  const cap = getSupplyCapacityLimit();
  if (typeof state.inventory.units === 'number') {
    state.inventory.units = Math.min(Math.max(state.inventory.units, 0), cap);
  } else {
    state.inventory.units = 0;
  }
  state.purchaseUnits = clamp(state.purchaseUnits || 0, 0, cap);
};

const getProfileTruckBaseStats = () => ({
  speed: state.profileTruckSpeed ?? BASE_TRUCK_STATS.speed,
  capacity: state.profileTruckCapacity ?? BASE_TRUCK_STATS.capacity,
});

const PHASE_SEQUENCE = ['prep', 'service', 'results'];
const PHASE_TIPS = {
  prep: 'Lock lineup, price point, and supplies to unlock service.',
  service: 'Service sim in progress: trigger commands and watch events.',
  results: 'Check the hype report, then advance or tweak for the next day.',
};

const setPhase = (nextPhase) => {
  state.phase = nextPhase;
  if (nextPhase === 'prep') {
    state.strikeBribeUsed = false;
  }
  updatePhaseGuide();
  updatePhasePanels();
};

const inventoryManager = new InventoryManager(state);

const ensureUpgradeState = () => {
  if (!(state.ownedUpgrades instanceof Set)) {
    state.ownedUpgrades = new Set(state.ownedUpgrades ? Array.from(state.ownedUpgrades) : []);
  }
  if (!state.upgradeBonuses) {
    state.upgradeBonuses = createUpgradeBonusState();
  }
  if (typeof state.totalUpgradeUpkeep !== 'number') {
    state.totalUpgradeUpkeep = 0;
  }
};

const getOwnedUpgradeIds = () => {
  ensureUpgradeState();
  return Array.from(state.ownedUpgrades);
};

const isUpgradeOwned = (upgradeId) => {
  ensureUpgradeState();
  return state.ownedUpgrades.has(upgradeId);
};

const getMissingUpgradeRequirements = (upgrade) =>
  (upgrade?.unlock_requirements || []).filter((requirementId) => !isUpgradeOwned(requirementId));

const applyUpgradeEffectValue = (bonuses, key, value) => {
  switch (key) {
    case 'speed_mult':
      state.truck.speed *= value;
      break;
    case 'capacity_add':
      state.truck.capacity += value;
      break;
    case 'servings_capacity_add':
      bonuses.servingsCapacityAdd = (bonuses.servingsCapacityAdd || 0) + value;
      break;
    case 'staff_efficiency_mult':
    case 'efficiency_mult':
      state.staff.efficiency *= value;
      break;
    case 'charm_mult':
      state.staff.charm *= value;
      break;
    case 'hype_daily_bonus':
      bonuses.hypeDailyBonus += value;
      break;
    case 'hype_random_range':
      bonuses.hypeRandomRange = Array.isArray(value) ? [...value] : value;
      break;
    case 'upkeep_reduction_pct':
      bonuses.upkeepReductionPct += value;
      break;
    case 'supplies_cost_pct':
      bonuses.suppliesCostPct += value;
      break;
    default: {
      if (typeof value === 'number') {
        bonuses[key] = (bonuses[key] || 0) + value;
      } else if (Array.isArray(value)) {
        bonuses[key] = [...value];
      } else if (typeof value === 'object' && value !== null) {
        bonuses[key] = { ...value };
      } else {
        bonuses[key] = value;
      }
    }
  }
};

const recalculateUpgradeEffects = () => {
  ensureUpgradeState();
  state.truck = { ...getProfileTruckBaseStats() };
  state.staff = { ...BASE_STAFF_STATS };
  const bonuses = createUpgradeBonusState();
  let totalUpkeep = 0;
  getOwnedUpgradeIds().forEach((upgradeId) => {
    const upgrade = UPGRADE_LOOKUP.get(upgradeId);
    if (!upgrade) return;
    totalUpkeep += upgrade.upkeep || 0;
    Object.entries(upgrade.effects || {}).forEach(([key, value]) => {
      applyUpgradeEffectValue(bonuses, key, value);
    });
  });
  state.totalUpgradeUpkeep = totalUpkeep;
  state.upgradeBonuses = bonuses;
};

recalculateUpgradeEffects();
enforceSupplyCapacity();

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

const getSupplyUnitCost = () => {
  const baseCost = Math.max(3, Math.round(getAverageDishCost()));
  const modifier = 1 + ((state.upgradeBonuses?.suppliesCostPct || 0) / 100);
  return Math.max(1, Math.round(baseCost * modifier));
};

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
  elements.prepSynergyNote = document.getElementById('prep-synergy-note');
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
  elements.serviceHints = document.getElementById('service-hints');
  elements.hintList = document.getElementById('hint-list');
  elements.startButton = document.getElementById('start-day');
  elements.pauseButton = document.getElementById('pause-day');
  elements.nextDay = document.getElementById('next-day');
  elements.resetButton = document.getElementById('reset-campaign');
  elements.devtoolsTrigger = document.getElementById('devtools-trigger');
  elements.devtoolsModal = document.getElementById('devtools-modal');
  elements.devtoolsClose = document.getElementById('devtools-close');
  elements.devtoolsCloseSecondary = document.getElementById('devtools-close-secondary');
  elements.devtoolsReset = document.getElementById('devtools-reset');
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
  elements.failVideoOverlay = document.getElementById('fail-video-overlay');
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
  elements.profileModal = document.getElementById('profile-modal');
  elements.profileOptions = document.getElementById('profile-option-grid');
  elements.upgradesModal = document.getElementById('upgrades-modal');
  elements.upgradesTrigger = document.getElementById('upgrades-trigger');
  elements.upgradesClose = document.getElementById('upgrades-close');
  elements.upgradeList = document.getElementById('upgrade-list');
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
  elements.synergyList = document.getElementById('synergy-list');
  elements.lossVideo = document.getElementById('loss-video');
  elements.strikePayoffButton = document.getElementById('strike-payoff');
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

const titleize = (text = '') =>
  text
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatPercentValue = (value) => `${formatSigned(Math.round(value))}%`;
const formatMultiplierPercent = (value) => formatPercentValue((value - 1) * 100);

const formatCurrencySigned = (value) => {
  if (value === 0) return '$0';
  const symbol = value > 0 ? '+' : '-';
  return `${symbol}$${Math.abs(value).toFixed(0)}`;
};

const describeRange = (value) => {
  if (Array.isArray(value) && value.length === 2) {
    return `${value[0]}-${value[1]}`;
  }
  return value;
};

const getUpgradeNameById = (id) => UPGRADE_DECK.find((upgrade) => upgrade.id === id)?.name || titleize(id);

const describeUpgradeAvailability = (upgrade) => {
  ensureUpgradeState();
  if (!upgrade) {
    return { status: 'missing', buttonLabel: 'Unavailable', disabled: true, message: 'Upgrade not found.' };
  }
  if (isUpgradeOwned(upgrade.id)) {
    return { status: 'owned', buttonLabel: 'Owned', disabled: true, message: 'Already installed.' };
  }
  const missing = getMissingUpgradeRequirements(upgrade);
  if (missing.length) {
    return {
      status: 'locked',
      buttonLabel: 'Locked',
      disabled: true,
      message: `Requires ${missing.map((id) => getUpgradeNameById(id)).join(', ')}`,
    };
  }
  if (state.money < upgrade.cost) {
    const short = upgrade.cost - state.money;
    return {
      status: 'funds',
      buttonLabel: 'Need funds',
      disabled: true,
      message: `Need ${currency(short)} more.`,
    };
  }
  return {
    status: 'ready',
    buttonLabel: `Buy for ${currency(upgrade.cost)}`,
    disabled: false,
    message: 'Ready to install.',
  };
};

const getDailyBaseUpkeep = () => {
  const difficulty = state.difficulty || DEFAULT_DIFFICULTY;
  return Math.round((60 + state.day * 6) * (difficulty.upkeepMultiplier || 1));
};

const getUpgradeUpkeepCost = () => {
  const difficulty = state.difficulty || DEFAULT_DIFFICULTY;
  const totalUpgradeCost = state.totalUpgradeUpkeep || 0;
  return Math.round(totalUpgradeCost * (difficulty.upkeepMultiplier || 1));
};

const getDailyUpkeepCost = () => {
  const base = getDailyBaseUpkeep();
  const upgrades = getUpgradeUpkeepCost();
  const reductionPct = state.upgradeBonuses?.upkeepReductionPct || 0;
  const combined = base + upgrades;
  const adjusted = Math.round(combined * (1 - reductionPct / 100));
  return Math.max(0, adjusted);
};

const applyDailyUpgradeBonuses = () => {
  const hypeBonus = state.upgradeBonuses?.hypeDailyBonus || 0;
  if (hypeBonus) {
    state.hype = clamp(state.hype + hypeBonus, 0, 100);
  }
};

const formatCommandLabel = (commandId) => SERVICE_COMMANDS[commandId]?.label || titleize(commandId);

const formatUpgradeEffect = (key, value) => {
  switch (key) {
    case 'speed_mult':
      return `Truck speed ${formatMultiplierPercent(value)}`;
    case 'staff_efficiency_mult':
    case 'efficiency_mult':
      return `Staff efficiency ${formatMultiplierPercent(value)}`;
    case 'capacity_add':
      return `Capacity +${value} guests`;
    case 'servings_capacity_add':
      return `Prep capacity +${value} servings`;
    case 'hype_daily_bonus':
      return `Daily hype +${value}`;
    case 'angry_reduction_pct':
      return `Angry guests ${formatPercentValue(-value)}`;
    case 'waste_reduction_pct':
      return `Waste ${formatPercentValue(-value)}`;
    case 'cook_speed_pct':
      return `Cook speed ${formatPercentValue(value)}`;
    case 'hype_on_meat_dishes':
      return `Meat dish hype +${value}`;
    case 'revenue_rice_dishes_pct':
      return `Rice dish revenue ${formatPercentValue(value)}`;
    case 'rating_ceiling_add':
      return `Rating ceiling +${value}`;
    case 'price_point_add':
      return `Price point ceiling +${value}`;
    case 'signature_unlock':
      return `Unlock signature kit: ${titleize(value)}`;
    case 'command_unlock':
      return `Unlock command: ${formatCommandLabel(value)}`;
    case 'fresh_unlock':
      return 'Unlocks Fresh line prep.';
    case 'drinks_unlocked':
      return 'Unlocks drink program.';
    case 'unlock_dual_flavors':
      return 'Unlocks dual-flavor builds.';
    case 'unlock_premium':
      return 'Unlocks premium ingredient tier.';
    case 'unlock_flavor_tier':
      return `Unlocks flavor tier ${titleize(value)}`;
    case 'trend_chance_smoke_pct':
      return `Smoke trend chance ${formatPercentValue(value)}`;
    case 'hype_random_range':
      return `Post-service hype +${describeRange(value)}`;
    case 'upkeep_reduction_pct':
      return `Upkeep costs ${formatPercentValue(-value)}`;
    case 'supplies_cost_pct':
      return `Supply costs ${formatPercentValue(value)}`;
    case 'old_stock_risk_add':
      return `Old stock risk ${formatPercentValue(value)}`;
    case 'repeat_revenue_pct':
      return `Repeat revenue ${formatPercentValue(value)}`;
    case 'critic_harshness_pct':
      return `Critic harshness ${formatPercentValue(value)}`;
    case 'weather_penalty_pct':
      return `Weather penalty ${formatPercentValue(value)}`;
    default: {
      if (typeof value === 'boolean') {
        return value ? `Unlocks ${titleize(key)}` : '';
      }
      if (typeof value === 'number') {
        return `${titleize(key)} ${formatSigned(Math.round(value))}`;
      }
      return `${titleize(key)} ${value}`;
    }
  }
};

const describeUpgradeEffects = (effects = {}) =>
  Object.entries(effects)
    .map(([key, value]) => formatUpgradeEffect(key, value))
    .filter((line) => typeof line === 'string' && line.trim().length);

const renderUpgradeDeck = () => {
  if (!elements.upgradeList) return;
  const sections = Object.entries(UPGRADE_CATEGORY_META)
    .map(([category, meta]) => {
      const upgrades = UPGRADE_DECK.filter((item) => item.category === category);
      if (!upgrades.length) return '';
      const cards = upgrades
        .map((upgrade) => {
          const effectLines = describeUpgradeEffects(upgrade.effects);
          const effectsMarkup = effectLines.length
            ? `<ul class="upgrade-effects">${effectLines.map((line) => `<li>${line}</li>`).join('')}</ul>`
            : '';
          const requirements = upgrade.unlock_requirements?.length
            ? `Requires ${upgrade.unlock_requirements.map((id) => getUpgradeNameById(id)).join(', ')}`
            : 'Unlocked by default';
          const availability = describeUpgradeAvailability(upgrade);
          const statusNote = availability.message || '';
          const buttonLabel = availability.buttonLabel || 'Unavailable';
          const buttonMarkup = `
            <button class="upgrade-buy ${availability.status}" type="button" data-upgrade-id="${upgrade.id}"
              ${availability.disabled ? 'disabled' : ''}>
              ${buttonLabel}
            </button>`;
          return `
            <article class="upgrade-card ${availability.status}">
              <h4>${upgrade.name}</h4>
              <div class="upgrade-meta">
                <span><i class="bi bi-cash-stack"></i> ${currency(upgrade.cost)}</span>
                <span><i class="bi bi-arrow-repeat"></i> Upkeep ${formatCurrencySigned(upgrade.upkeep)}/day</span>
              </div>
              <p class="upgrade-desc">${upgrade.description}</p>
              ${effectsMarkup}
              <p class="upgrade-reqs">${requirements}</p>
              <div class="upgrade-card-foot">
                <span class="upgrade-status ${availability.status}">${statusNote}</span>
                ${buttonMarkup}
              </div>
            </article>
          `;
        })
        .join('');
      return `
        <section class="upgrade-section">
          <div class="upgrade-section-head">
            <h3>${meta.label}</h3>
            <p class="mini-label">${meta.blurb}</p>
          </div>
          <div class="upgrade-card-grid">
            ${cards}
          </div>
        </section>
      `;
    })
    .filter(Boolean)
    .join('');
  elements.upgradeList.innerHTML = sections || '<p class="upgrade-empty">Upgrades are still loading.</p>';
};

const showUpgradesModal = () => {
  if (!elements.upgradesModal) return;
  elements.upgradesModal.classList.add('open');
  elements.upgradesModal.setAttribute('aria-hidden', 'false');
};

const hideUpgradesModal = () => {
  if (!elements.upgradesModal) return;
  elements.upgradesModal.classList.remove('open');
  elements.upgradesModal.setAttribute('aria-hidden', 'true');
};

const renderRiskBadge = (dish) => {
  if (!dish?.risk) return '';
  return `<span class="dish-risk risk-${dish.risk.id}">${dish.risk.label}</span>`;
};

const VARIANT_STAT_CONFIG = [
  { key: 'popularityDelta', icon: 'bi bi-stars', label: 'appeal' },
  { key: 'prepSpeedDelta', icon: 'bi bi-speedometer2', label: 'prep speed' },
  { key: 'marginDelta', icon: 'bi bi-currency-dollar', label: 'margin' },
];

const formatPercent = (value) => `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`;

const renderVariantStats = (variant) => {
  if (!variant?.adjustments) return '';
  const stats = VARIANT_STAT_CONFIG
    .map(({ key, icon, label }) => {
      const value = variant.adjustments[key];
      if (typeof value !== 'number' || value === 0) return '';
      return `<span class="variant-stat" aria-label="${formatPercent(value)} ${label}" title="${label}">
        <i class="${icon}" aria-hidden="true"></i>
        <span>${formatPercent(value)}</span>
      </span>`;
    })
    .filter(Boolean);
  if (!stats.length) return '';
  return `<div class="variant-stats">${stats.join('')}</div>`;
};

const renderScoreBadge = (dish) => {
  const score = typeof dish?.baseScore === 'number' ? dish.baseScore : '--';
  const tier = dish?.baseTier || '--';
  return `
    <span class="score-badge" aria-label="Score ${score}, Tier ${tier}">
      <i class="bi bi-graph-up"></i>
      <span class="score-value">${score}</span>
      <span class="score-tier">${tier}</span>
    </span>
  `;
};

const getCraftedDishById = (id) => state.craftedDishes.find((dish) => dish.id === id);
const getSelectedDishes = () => state.selectedDishes.map((id) => getCraftedDishById(id)).filter(Boolean);
const getDishBlueprintKey = (dish) => dish?.blueprintId || dish?.id || null;
const hasBlueprintCrafted = (blueprint) => {
  if (!blueprint) return false;
  const blueprintId = getBlueprintId(blueprint);
  return state.craftedDishes.some((dish) => dish.blueprintId === blueprintId);
};
const pruneSelectedDishes = () => {
  const allowed = new Set(state.craftedDishes.map((dish) => dish.id));
  const filtered = state.selectedDishes.filter((id) => allowed.has(id));
  const seenBlueprints = new Set();
  const deduped = [];
  filtered.forEach((id) => {
    const dish = getCraftedDishById(id);
    const key = getDishBlueprintKey(dish);
    if (!dish || !key) return;
    if (seenBlueprints.has(key)) return;
    seenBlueprints.add(key);
    deduped.push(id);
  });
  const removed = state.selectedDishes.length - deduped.length;
  state.selectedDishes = deduped;
  if (removed > 0) {
    setPrepMessage('Duplicate recipes removed from the lineup.');
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
    card.title = dish.risk?.description || dish.baseHiddenTitle || '';
    const riskBadge = renderRiskBadge(dish);
    const tierLabel = dish.baseTier ? `Tier ${dish.baseTier}` : 'Tier --';
    const variantLabel = dish.variant?.label ? `${dish.variant.label} variant` : 'Lab baseline';
    const variantStats = renderVariantStats(dish.variant);
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
      ${renderGaugeGroup(dish.tiers)}
      <div class="dish-score-row">
        ${renderScoreBadge(dish)}
      </div>
      <div class="dish-variant-row">
        <p class="mini-label variant-label">${variantLabel}</p>
        ${variantStats}
      </div>
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
    const variantLabel = dish.variant?.label ? `${dish.variant.label} variant` : 'Lab baseline';
    const variantStats = renderVariantStats(dish.variant);
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
      <div class="dish-score-row">
        ${renderScoreBadge(dish)}
      </div>
      <div class="dish-variant-row">
        <p class="mini-label variant-label">${variantLabel}</p>
        ${variantStats}
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
      <div class="menu-card-actions">
        <button type="button" class="btn tertiary menu-card-retire" data-dish-id="${dish.id}" data-action="retire">
          Retire this recipe
        </button>
      </div>
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
  if (state.lastCraftDay === state.day) {
    const notice = 'One recipe per day. Come back tomorrow to craft another.';
    updateLabStatus(notice);
    setPrepMessage(notice);
    return false;
  }
  state.craftedCounter += 1;
  const manualName = !quick ? elements.labName?.value.trim() : '';
  const variant = createRecipeVariant();
  const dishName = manualName || `${variant.label} ${blueprint.name}`;
  const dish = buildDishFromBlueprint(blueprint, {
    name: dishName,
    keySuffix: state.craftedCounter,
    variant,
  });
  state.lastCraftDay = state.day;
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

const retireCraftedDish = (dishId) => {
  const index = state.craftedDishes.findIndex((dish) => dish.id === dishId);
  if (index === -1) return null;
  const [removed] = state.craftedDishes.splice(index, 1);
  state.selectedDishes = state.selectedDishes.filter((id) => id !== dishId);
  refreshDishLibrary();
  return removed;
};

const handleMenuCodexAction = (event) => {
  const button = event.target.closest('.menu-card-retire');
  if (!button) return;
  const { dishId } = button.dataset;
  if (!dishId) return;
  const dish = getCraftedDishById(dishId);
  if (!dish) return;
  const confirmed = typeof window === 'undefined'
    ? true
    : window.confirm(`Retire ${dish.name}? This removes it from the lab.`);
  if (!confirmed) return;
  const retired = retireCraftedDish(dishId);
  if (retired) {
    setPrepMessage(`${retired.name} retired. Fresh variants only.`);
  }
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
      lineupSynergies: [],
    };
  }
  const contexts = getActiveContexts();
  const evaluations = dishes.map((dish) => evaluateDishWithState(dish, contexts));
  const tierAverage = evaluations.reduce((sum, evalResult) => sum + (TIER_MULTIPLIER[evalResult.tier] || 0), 0) / evaluations.length;
  const avgScore = evaluations.reduce((sum, evalResult) => sum + evalResult.score, 0) / evaluations.length;
  const hiddenCount = evaluations.filter((evalResult) => evalResult.hiddenTitle).length;
  const audience = state.audienceTrend;
  const mods = audience?.modifiers || {};

  const synergyResults = [];
  let synergyDemand = 0;
  let synergyRating = 0;
  let synergyHype = 0;
  (LINEUP_SYNERGIES || []).forEach((synergy) => {
    if (typeof synergy?.check !== 'function') return;
    const result = synergy.check(dishes);
    if (result) {
      const entry = {
        id: synergy.id,
        label: synergy.label,
        description: synergy.description,
        demandMod: result.demandMod || 0,
        ratingMod: result.ratingMod || 0,
        hypeMod: result.hypeMod || 0,
      };
      synergyResults.push(entry);
      synergyDemand += entry.demandMod;
      synergyRating += entry.ratingMod;
      synergyHype += entry.hypeMod;
    }
  });

  const demandMod = clamp(1 + tierAverage * 0.12 + (mods.popularity || 0) + synergyDemand, 0.65, 1.75);
  const ratingMod = (mods.rating || 0) + tierAverage * 4 + synergyRating;
  const hypeMod = (mods.hype || 0) + hiddenCount * 2 + synergyHype;
  return {
    demandMod,
    ratingMod,
    hypeMod,
    dishScore: avgScore,
    focusScore: tierAverage,
    audience,
    evaluations,
    contexts,
    lineupSynergies: synergyResults,
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
  const dish = getCraftedDishById(id);
  if (!dish) return;

  const maxSlots = getMaxLineupSlots();
  const selected = new Set(state.selectedDishes);

  if (selected.has(id)) {
    selected.delete(id);
  } else {
    if (state.selectedDishes.length >= maxSlots) {
      setPrepMessage(`${maxSlots} dishes max at your current reputation. Grow your rep to unlock more slots.`);
      return;
    }
    const blueprintKey = getDishBlueprintKey(dish);
    const selectedBlueprints = new Set(
      state.selectedDishes
        .map((selectedId) => getDishBlueprintKey(getCraftedDishById(selectedId)))
        .filter(Boolean),
    );
    if (blueprintKey && selectedBlueprints.has(blueprintKey)) {
      setPrepMessage(`${dish.name} (same recipe) is already in the lineup.`);
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

  const maxSlots = getMaxLineupSlots();
  elements.prepSelection.textContent =
    `${state.selectedDishes.length} / ${maxSlots} dishes selected`;

  updateEnvironmentHints(state.lastEvent);
  updatePrepSynergyNote();
};

const updatePrepSynergyNote = () => {
  if (!elements.prepSynergyNote) return;

  const dishes = getSelectedDishes();
  const maxSlots = getMaxLineupSlots();

  if (!dishes.length) {
    elements.prepSynergyNote.textContent = '';
    return;
  }

  // Synergies kick in at 3+ dishes AND only if your rep supports 3+ slots
  if (maxSlots < 3) {
    elements.prepSynergyNote.textContent =
      'Synergies unlock once your reputation is high enough to run 3 dishes.';
    return;
  }

  if (dishes.length < 3) {
    const remaining = 3 - dishes.length;
    elements.prepSynergyNote.textContent =
      `Add ${remaining} more dish${remaining === 1 ? '' : 'es'} to unlock synergies.`;
    return;
  }

  const comboEffects = calculateComboEffects(dishes);
  const synergies = comboEffects.lineupSynergies || [];
  if (!synergies.length) {
    elements.prepSynergyNote.textContent =
      'No synergies yet. Mix formats and flavors for boosts.';
    return;
  }

  elements.prepSynergyNote.textContent =
    `Synergies: ${synergies.map((syn) => syn.label).join(', ')}`;
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
      const maxSlots = getMaxLineupSlots();
      setPrepMessage(`Select up to ${maxSlots} crafted dishes to prep.`);
    }
  }
  updateSupplyUI();
};

const setPrepMessage = (message) => {
  elements.prepNote.textContent = message;
};

const attemptStrikePayoff = () => {
  if (state.phase !== 'prep') {
    setPrepMessage('Handle hush deals during prep, before tickets fly.');
    return;
  }
  if (state.strikeBribeUsed) {
    setPrepMessage('You already cashed in a favor this prep.');
    return;
  }
  if (state.strikes <= 0) {
    setPrepMessage('Clean record. No strikes to smooth over.');
    return;
  }
  if (state.money <= 0) {
    setPrepMessage('No cash on hand to pay anyone off.');
    return;
  }
  const ratio = 0.4 + Math.random() * 0.2;
  const cost = Math.min(state.money, Math.max(1, Math.round(state.money * ratio)));
  if (cost <= 0) {
    setPrepMessage('Need at least a little cash before anyone listens.');
    return;
  }
  const story = formatStrikeBribeStory(cost);
  const confirmMessage = `${story}\n\nPay ${currency(cost)} to erase one strike?`;
  const confirmed = typeof window !== 'undefined' ? window.confirm(confirmMessage) : true;
  if (!confirmed) {
    setPrepMessage('Kept your cash. Strikes remain for now.');
    return;
  }
  state.money -= cost;
  state.strikes = Math.max(0, state.strikes - 1);
  state.strikeBribeUsed = true;
  setPrepMessage(`${story} Strike count eased to ${state.strikes} / 3.`);
  updateHUD();
};

const attemptPurchaseUpgrade = (upgradeId) => {
  const upgrade = UPGRADE_LOOKUP.get(upgradeId);
  if (!upgrade) return;
  const availability = describeUpgradeAvailability(upgrade);
  if (availability.status !== 'ready') {
    if (availability.message) {
      setPrepMessage(availability.message);
    }
    return;
  }
  ensureUpgradeState();
  state.money -= upgrade.cost;
  state.ownedUpgrades.add(upgrade.id);
  recalculateUpgradeEffects();
  enforceSupplyCapacity();
  updateHUD();
  renderUpgradeDeck();
  updateSupplyUI();
  setPrepMessage(`${upgrade.name} installed. Upkeep ${formatCurrencySigned(upgrade.upkeep || 0)}/day.`);
};

const handleUpgradeListClick = (event) => {
  const button = event.target.closest('button[data-upgrade-id]');
  if (!button || button.disabled) return;
  const { upgradeId } = button.dataset;
  if (!upgradeId) return;
  attemptPurchaseUpgrade(upgradeId);
};

const handleSupplyChange = (event) => {
  const capacity = getSupplyCapacityLimit();
  let rawValue = parseInt(event.target.value, 10);
  if (Number.isNaN(rawValue)) rawValue = 0;
  let value = rawValue;
  if (Number.isNaN(value)) value = 0;
  value = clamp(value, 0, capacity);
  state.purchaseUnits = value;
  event.target.value = value;
  if (rawValue > capacity) {
    setPrepMessage(`Truck capacity limits supplies to ${formatUnits(capacity)}.`);
  }
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

// === REPUTATION PROGRESSION SYSTEM =======================================

// Reputation ranges drive unlocks:
//  0–19  : Rookie truck      → 2 lineup slots, Street/Market, solo only
//  20–39 : Up-and-coming     → 3 slots, Street/Market, Runner unlocked
//  40–59 : Neighborhood name → 4 slots, + Premium, Grill unlocked
//  60–79 : City favorite     → 5 slots, + VIP, Host unlocked
//  80+   : Destination truck → 6 slots, full price scale, full crew

function getReputationTier(rep) {
  const value = Math.max(0, Math.min(100, Number(rep) || 0));

  if (value >= 80) {
    return {
      id: 'legend',
      label: 'Destination truck',
      maxLineupSlots: 6,
      unlockedPriceIds: ['street', 'market', 'premium', 'vip'],
      unlockedHelperIds: ['none', 'runner', 'grill', 'host'],
    };
  }
  if (value >= 60) {
    return {
      id: 'city_favorite',
      label: 'City favorite',
      maxLineupSlots: 5,
      unlockedPriceIds: ['street', 'market', 'premium', 'vip'],
      unlockedHelperIds: ['none', 'runner', 'grill', 'host'],
    };
  }
  if (value >= 40) {
    return {
      id: 'neighborhood_name',
      label: 'Neighborhood name',
      maxLineupSlots: 4,
      unlockedPriceIds: ['street', 'market', 'premium'],
      unlockedHelperIds: ['none', 'runner', 'grill'],
    };
  }
  if (value >= 20) {
    return {
      id: 'up_and_coming',
      label: 'Up-and-coming',
      maxLineupSlots: 3,
      unlockedPriceIds: ['street', 'market'],
      unlockedHelperIds: ['none', 'runner'],
    };
  }
  return {
    id: 'rookie',
    label: 'Rookie truck',
    maxLineupSlots: 2,
    unlockedPriceIds: ['street', 'market'],
    unlockedHelperIds: ['none'],
  };
}

function getMaxLineupSlots() {
  const tier = getReputationTier(state.reputation || 0);
  return tier.maxLineupSlots;
}

function getUnlockedPriceIds() {
  const tier = getReputationTier(state.reputation || 0);
  // Safety: only keep price IDs that actually exist in PRICE_POINTS
  return tier.unlockedPriceIds.filter((id) => PRICE_POINTS[id]);
}

function getUnlockedHelperIds() {
  const tier = getReputationTier(state.reputation || 0);
  const validIds = new Set(HELPERS.map((h) => h.id));
  return tier.unlockedHelperIds.filter((id) => validIds.has(id));
}

// Clamp selected dishes to the allowed lineup size
function enforceLineupCap() {
  const maxSlots = getMaxLineupSlots();
  if (state.selectedDishes.length > maxSlots) {
    state.selectedDishes = state.selectedDishes.slice(0, maxSlots);
  }
}

// Lock/unlock price radio buttons by reputation
function applyPriceLocksToUI() {
  const unlockedIds = new Set(getUnlockedPriceIds());
  const radios = document.querySelectorAll('input[name="price-point"]');
  if (!radios.length) return;

  let chosen = state.pricePoint;
  // If current price point is no longer allowed, fallback to the highest unlocked tier
  if (!unlockedIds.has(chosen)) {
    const fallbackOrder = ['vip', 'premium', 'market', 'street'];
    const fallback = fallbackOrder.find((id) => unlockedIds.has(id)) || 'street';
    chosen = fallback;
    state.pricePoint = chosen;
  }

  radios.forEach((radio) => {
    const id = radio.value;
    const isUnlocked = unlockedIds.has(id);
    radio.disabled = !isUnlocked;
    radio.closest('label')?.classList.toggle('locked', !isUnlocked);
    if (isUnlocked && id === chosen) {
      radio.checked = true;
    }
  });
}

// Lock/unlock helpers by reputation
function applyHelperLocksToUI() {
  const unlockedIds = new Set(getUnlockedHelperIds());
  const select = elements.helperSelect;
  if (!select) return;

  // Rebuild options to reflect what's actually unlocked
  const current = state.helper || 'none';
  const options = HELPERS.filter((h) => unlockedIds.has(h.id));

  // If current helper is locked, fallback to 'none' or first unlocked
  let chosen = current;
  if (!unlockedIds.has(chosen)) {
    chosen = unlockedIds.has('none') ? 'none' : (options[0]?.id || 'none');
    state.helper = chosen;
  }

  select.innerHTML = '';
  options.forEach((helper) => {
    const opt = document.createElement('option');
    opt.value = helper.id;
    opt.textContent = helper.label || helper.name;
    if (helper.id === chosen) opt.selected = true;
    select.appendChild(opt);
  });

  updateHelperNote();
}

// Update the prep copy + selection counts based on rep + lineup cap
function refreshPrepCopy() {
  if (!elements.prepNote || !elements.prepSelection) return;
  const maxSlots = getMaxLineupSlots();
  const count = state.selectedDishes.length;

  if (maxSlots <= 2) {
    elements.prepNote.textContent =
      'Recipe Lab: craft combos, then slot up to 2. Grow your reputation to unlock more slots.';
  } else {
    elements.prepNote.textContent =
      `Recipe Lab: craft combos, then slot up to ${maxSlots}.`;
  }

  elements.prepSelection.textContent =
    `${count} / ${maxSlots} dishes selected`;

  updatePrepSynergyNote();
}

// Master hook: call this whenever reputation or day state changes
function applyReputationLocks() {
  enforceLineupCap();
  applyPriceLocksToUI();
  applyHelperLocksToUI();
  refreshPrepCopy();
}

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
  elements.statCapacity.textContent = `${formatUnits(getSupplyCapacityLimit())} max`;
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
    const capacity = getSupplyCapacityLimit();
    elements.supplyStock.textContent = `Stock: ${formatUnits(inventoryManager.units)} / ${formatUnits(capacity)}`;
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

const ensureDifficultyState = () => {
  if (!state.difficulty) {
    state.difficulty = { ...DEFAULT_DIFFICULTY };
  }
};

const formatDifficultyValue = (field, value) => {
  const safeValue = Number.isFinite(value) ? value : DEFAULT_DIFFICULTY[field.id];
  return field.format ? field.format(safeValue) : safeValue.toFixed(2);
};

const syncDifficultyField = (field) => {
  const value = Number(state.difficulty?.[field.id]) || DEFAULT_DIFFICULTY[field.id];
  const input = document.getElementById(field.inputId);
  if (input && document.activeElement !== input) {
    input.value = value;
  }
  const badge = document.getElementById(field.valueId);
  if (badge) {
    badge.textContent = formatDifficultyValue(field, value);
  }
};

const renderDeveloperPanel = () => {
  ensureDifficultyState();
  DIFFICULTY_FIELDS.forEach((field) => syncDifficultyField(field));
};

const showDevtoolsModal = () => {
  if (!elements.devtoolsModal) return;
  renderDeveloperPanel();
  elements.devtoolsModal.classList.add('open');
  elements.devtoolsModal.setAttribute('aria-hidden', 'false');
};

const hideDevtoolsModal = () => {
  if (!elements.devtoolsModal) return;
  elements.devtoolsModal.classList.remove('open');
  elements.devtoolsModal.setAttribute('aria-hidden', 'true');
};

const applyDifficultySideEffects = () => {
  persistDifficultySettings();
  updateEnvironmentHints(state.lastEvent);
  updateSupplyUI();
  if (state.simRunning && !state.servicePaused) {
    scheduleServiceTick();
  }
};

const handleDifficultyInput = (field, rawValue) => {
  ensureDifficultyState();
  const parsed = parseFloat(rawValue);
  if (Number.isNaN(parsed)) return;
  const min = field.min ?? 0.1;
  const max = field.max ?? 3;
  const clamped = clamp(parsed, min, max);
  const fixed = Number(clamped.toFixed(2));
  if (state.difficulty[field.id] === fixed) {
    syncDifficultyField(field);
    return;
  }
  state.difficulty[field.id] = fixed;
  const input = document.getElementById(field.inputId);
  if (input) {
    input.value = fixed;
  }
  syncDifficultyField(field);
  applyDifficultySideEffects();
  if (state.phase === 'prep') {
    setPrepMessage('Dev tuning updated.');
  } else if (state.simRunning) {
    logServiceMessage('Dev tuning updated mid-service.');
  }
};

const resetDifficultySettings = () => {
  state.difficulty = { ...DEFAULT_DIFFICULTY };
  renderDeveloperPanel();
  applyDifficultySideEffects();
  if (state.phase === 'prep') {
    setPrepMessage('Dev tuning reset to defaults.');
  } else {
    logServiceMessage('Dev tuning reset to defaults.');
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
    updateHUD();
  });

  if (elements.supplyInput) {
    elements.supplyInput.addEventListener('input', handleSupplyChange);
  }
  if (elements.supplyDiscard) {
    elements.supplyDiscard.addEventListener('click', discardStock);
  }
  if (elements.pauseButton) {
    elements.pauseButton.addEventListener('click', () => togglePause());
  }

  if (elements.devtoolsTrigger) {
    elements.devtoolsTrigger.addEventListener('click', showDevtoolsModal);
  }
  if (elements.devtoolsClose) {
    elements.devtoolsClose.addEventListener('click', hideDevtoolsModal);
  }
  if (elements.devtoolsCloseSecondary) {
    elements.devtoolsCloseSecondary.addEventListener('click', hideDevtoolsModal);
  }
  if (elements.devtoolsModal) {
    elements.devtoolsModal.addEventListener('click', (event) => {
      if (event.target === elements.devtoolsModal) hideDevtoolsModal();
    });
  }
  if (elements.devtoolsReset) {
    elements.devtoolsReset.addEventListener('click', resetDifficultySettings);
  }
  if (elements.profileOptions) {
    elements.profileOptions.addEventListener('click', handleProfileSelection);
  }
  DIFFICULTY_FIELDS.forEach((field) => {
    const input = document.getElementById(field.inputId);
    if (!input) return;
    input.addEventListener('input', (event) => handleDifficultyInput(field, event.target.value));
    input.addEventListener('change', (event) => handleDifficultyInput(field, event.target.value));
  });

  if (elements.failReset) {
    elements.failReset.addEventListener('click', resetCampaign);
  }
  if (elements.strikePayoffButton) {
    elements.strikePayoffButton.addEventListener('click', attemptStrikePayoff);
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
  if (elements.menuCodex) {
    elements.menuCodex.addEventListener('click', handleMenuCodexAction);
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
  if (elements.upgradesTrigger) {
    elements.upgradesTrigger.addEventListener('click', () => {
      renderUpgradeDeck();
      showUpgradesModal();
    });
  }
  if (elements.upgradesClose) {
    elements.upgradesClose.addEventListener('click', hideUpgradesModal);
  }
  if (elements.upgradesModal) {
    elements.upgradesModal.addEventListener('click', (event) => {
      if (event.target === elements.upgradesModal) {
        hideUpgradesModal();
      }
    });
  }
  if (elements.upgradeList) {
    elements.upgradeList.addEventListener('click', handleUpgradeListClick);
  }
  if (elements.modalNextDay) {
    elements.modalNextDay.addEventListener('click', advanceToNextDay);
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideResultsModal();
      hideUpgradesModal();
      hideDevtoolsModal();
    }
  });
};

const advanceToNextDay = () => {
  if (!state.lastResults) return;
  state.day += 1;
  applyDailyUpgradeBonuses();
  decayCommandCooldowns();
  setPhase('prep');
  state.lastResults = null;
  state.lastEvent = null;
  updateResultsUI(null);
  resetServiceView();
  rollAudienceTrend();
  updateComboNote();
  updateHUD();
  applyReputationLocks();
  updateCommandButtons();
  if (elements.nextDay) {
    elements.nextDay.disabled = true;
  }
  setPrepMessage('Dial in your lineup and price before starting the next day.');
  hideResultsModal();
  syncModalNextDay();
};

const resetServiceView = () => {
  elements.serviceBar.style.width = '0%';
  elements.serviceStatus.textContent = 'Prep dishes, then hit start.';
  elements.serviceFeed.innerHTML = '';
  updateServiceStats({ served: 0, angry: 0, wait: 0, revenue: 0 });
  renderEventCard(null);
  state.lastEvent = null;
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

const startCampaignWithProfile = (profile) => {
  hideProfileModal();
  state.truck = { ...BASE_TRUCK_STATS };
  state.staff = { ...BASE_STAFF_STATS };
  state.selectedDishes = [];
  state.craftedDishes = [];
  state.craftedCounter = 0;
  state.lastCraftDay = 0;
  state.comboHistory = {};

  applyStarterProfile(profile);

  state.pricePoint = 'street';
  state.helper = 'none';
  setPhase('prep');
  state.simRunning = false;
  state.lastEvent = null;
  state.lastResults = null;
  state.activeOutcome = null;
  state.serviceCommandsUsed = new Set();
  state.commandCooldowns = {};
  state.currentProgress = 0;
  state.serviceProgress = 0;
  state.serviceTimer = null;
  state.servicePaused = false;
  state.serviceMidpointCalled = false;
  state.serviceFinalCalled = false;
  state.strikes = 0;
  state.gameOver = false;
  state.inventory = { units: 0, age: 0 };
  state.purchaseUnits = 20;
  state.purchaseCost = 0;
  state.audienceTrend = null;
  state.selloutWarned = false;
  state.slowStockWarned = false;
  state.labSelection = { form: FORM_OPTIONS[0].id, flavor: FLAVOR_OPTIONS[0].id, blueprintId: null };
  state.lastSupplyUnitCost = SUPPLY_COST_PER_UNIT;
  state.ownedUpgrades = new Set();
  state.upgradeBonuses = createUpgradeBonusState();
  state.totalUpgradeUpkeep = 0;
  state.strikeBribeUsed = false;

  recalculateUpgradeEffects();
  enforceSupplyCapacity();
  inventoryManager.reset();
  renderLabSelects();
  updateLabPreview();
  const streetRadio = document.querySelector('input[name="price-point"][value="street"]');
  if (streetRadio) streetRadio.checked = true;
  renderHelperSelect();
  updateHelperNote();
  refreshDishLibrary({ showHint: true });
  resetServiceView();
  updateResultsUI(null);
  hideFailureOverlay();
  hideResultsModal();
  hideUpgradesModal();
  hideDevtoolsModal();
  setPrepMessage('Recipe Lab: craft combos, then select your lineup to prep.');
  rollAudienceTrend();
  updateComboNote();
  updateHUD();
  applyReputationLocks();
  updateSupplyUI();
  updateCommandButtons();
  renderUpgradeDeck();
  updateStockForecast(null);
  if (elements.startButton) {
    elements.startButton.disabled = false;
    elements.startButton.textContent = 'Start day';
  }
  if (elements.nextDay) {
    elements.nextDay.disabled = true;
  }
  syncModalNextDay();
};

const handleProfileSelection = (event) => {
  const button = event.target instanceof Element ? event.target.closest('[data-profile-id]') : null;
  if (!button) return;
  const profile = getProfilePresetById(button.dataset.profileId);
  if (!profile) return;
  startCampaignWithProfile(profile);
};

const resetCampaign = () => {
  const profile = getActiveProfilePreset();
  if (!profile) {
    showProfileModal();
    return;
  }
  startCampaignWithProfile(profile);
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
  const capacity = getSupplyCapacityLimit();
  const requested = clamp(state.purchaseUnits || 0, 0, capacity);
  state.purchaseUnits = requested;
  const unitCost = getSupplyUnitCost();
  state.lastSupplyUnitCost = unitCost;
  const added = requested > 0 ? inventoryManager.restock(requested) : 0;
  state.purchaseCost = added * unitCost;
  if (added > 0) {
    logServiceMessage(`Loaded ${formatUnits(added)} (${currency(state.purchaseCost)} @ ${currency(unitCost)}/serv).`);
    if (added < requested) {
      logServiceMessage(`Carryover filled the truck. Max storage is ${formatUnits(capacity)}.`);
    }
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
  autoPauseForIntel();
};

const pickEvent = () => {
  const index = Math.floor(Math.random() * EVENTS.length);
  const baseEvent = EVENTS[index];
  return applyDifficultyToEvent(baseEvent);
};

const applyDifficultyToEvent = (event) => {
  if (!event) return null;
  const multiplier = state.difficulty?.eventEffectMultiplier || 1;
  const scaledEffects = {};
  Object.entries(event.effects || {}).forEach(([key, value]) => {
    if (typeof value === 'number') {
      scaledEffects[key] = Number((value * multiplier).toFixed(2));
    } else {
      scaledEffects[key] = value;
    }
  });
  return { ...event, effects: scaledEffects };
};

const calculateDayOutcome = (event) => {
  const dishes = getSelectedDishes();
  const lineupData = dishes.map((dish) => ({ ...dish }));
  const riskRatingShift = dishes.reduce((sum, dish) => sum + (dish.risk?.ratingShift || 0), 0);
  const riskHypeBoost = dishes.reduce((sum, dish) => sum + (dish.risk?.hypeBoost || 0), 0);
  const price = PRICE_POINTS[state.pricePoint];
  const helper = HELPERS.find((entry) => entry.id === state.helper) || HELPERS[0];
  const difficulty = state.difficulty || DEFAULT_DIFFICULTY;
  const { units: supplyBefore } = inventoryManager.snapshot();
  const helperCost = Math.round(helper.cost * (difficulty.helperCostMultiplier || 1));
  if (!dishes.length) {
    const upkeep = getDailyUpkeepCost();
    const supplyCost = state.purchaseCost || 0;
    const expenses = helperCost + upkeep + supplyCost;
    return {
      day: state.day,
      served: 0,
      angry: 0,
      averageWait: 0,
      revenue: 0,
      ingredientCost: 0,
      staffCost: helperCost,
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
    lineupSynergies: [],
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
  const turnoutMultiplier = difficulty.turnoutMultiplier || 1;
  const potentialCustomers = baseDemand * hypeFactor * turnoutFactor * turnoutMultiplier;
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
  const ingredientCost = served * avgCost * (difficulty.ingredientCostMultiplier || 1);
  const staffCost = helperCost;
  const upkeep = getDailyUpkeepCost();
  const supplyCost = state.purchaseCost || 0;
  const expenses = ingredientCost + staffCost + upkeep + supplyCost;
  const profit = Math.round(revenue - expenses);

  const qualityFactor = price.quality + helper.charm + state.staff.charm * 0.2;
  const ratingBase = 74 + (profit / 9) - angry * 1.8 + qualityFactor * 8 + (event.effects.rating || 0) + comboEffects.ratingMod + riskRatingShift;
  const rating = clamp(Math.round(ratingBase), 10, 100);
  const hypeBase = (rating - 72) / 6 + (event.effects.hype || 0) + (comboEffects.hypeMod || 0) + riskHypeBoost;
  const hypeDelta = clamp(Math.round(hypeBase * (difficulty.hypeDeltaMultiplier || 1)), -20, 20);
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
    lineupSynergies: comboEffects.lineupSynergies || [],
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

const scrollIntelIntoView = () => {
  if (!elements.serviceHints || typeof elements.serviceHints.scrollIntoView !== 'function') return;
  const scrollOptions = { behavior: 'smooth', block: 'center', inline: 'nearest' };
  try {
    elements.serviceHints.scrollIntoView(scrollOptions);
  } catch (error) {
    elements.serviceHints.scrollIntoView();
  }
};

const autoPauseForIntel = () => {
  if (!state.simRunning || state.servicePaused || state.gameOver) return;
  togglePause({
    statusText: 'Paused for intel review.',
    logText: 'Intel prioritized - sim auto-paused at open.',
  });
  const scrollTask = () => scrollIntelIntoView();
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(scrollTask);
  } else {
    setTimeout(scrollTask, 0);
  }
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

const formatSynergyEffect = (synergy) => {
  const parts = [];
  if (synergy.demandMod) parts.push(`${formatSigned(Math.round(synergy.demandMod * 100))}% turnout`);
  if (synergy.ratingMod) parts.push(`${formatSigned(Math.round(synergy.ratingMod))} rating`);
  if (synergy.hypeMod) parts.push(`${formatSigned(Math.round(synergy.hypeMod))} hype`);
  return parts.join(' · ') || 'Passive bonus applied.';
};

const renderSynergyBreakdown = (outcome) => {
  if (!elements.synergyList) return;
  elements.synergyList.innerHTML = '';
  const synergies = outcome?.lineupSynergies || [];
  if (!synergies.length) {
    const empty = document.createElement('li');
    empty.className = 'synergy-empty';
    empty.textContent = outcome ? 'No synergies triggered.' : 'Synergies appear after service.';
    elements.synergyList.appendChild(empty);
    return;
  }
  synergies.forEach((syn) => {
    const item = document.createElement('li');
    const label = document.createElement('strong');
    label.textContent = syn.label;
    const detail = document.createElement('span');
    detail.textContent = formatSynergyEffect(syn);
    item.appendChild(label);
    item.appendChild(detail);
    elements.synergyList.appendChild(item);
  });
};

const concludeDay = (outcome) => {
  clearServiceTimer();
  state.simRunning = false;
  state.servicePaused = false;
  setPhase('results');
  applyProfileRiskAndReward(outcome);
  state.money += outcome.profit;
  state.hype = clamp(state.hype + outcome.hypeDelta, 0, 100);
  const hypeRange = state.upgradeBonuses?.hypeRandomRange;
  if (Array.isArray(hypeRange) && hypeRange.length === 2) {
    const low = Math.min(Number(hypeRange[0]) || 0, Number(hypeRange[1]) || 0);
    const high = Math.max(Number(hypeRange[0]) || 0, Number(hypeRange[1]) || 0);
    const span = high - low;
    const bonus = Math.round(Math.random() * span) + low;
    if (bonus !== 0) {
      state.hype = clamp(state.hype + bonus, 0, 100);
      logServiceMessage(`Brand buzz delivers ${formatSigned(bonus)} hype.`);
    }
  }
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
  applyReputationLocks();
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
    renderSynergyBreakdown(null);
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
  renderSynergyBreakdown(outcome);
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

const getServiceInterval = () => {
  const multiplier = clamp(state.difficulty?.serviceSpeedMultiplier || 1, 0.5, 2);
  return Math.max(250, SERVICE_INTERVAL_MS / multiplier);
};

const scheduleServiceTick = () => {
  clearServiceTimer();
  state.serviceTimer = setTimeout(serviceTick, getServiceInterval());
};

const serviceTick = () => {
  if (!state.simRunning || state.servicePaused || !state.activeOutcome || state.gameOver) return;
  const speedMultiplier = clamp(state.difficulty?.serviceSpeedMultiplier || 1, 0.25, 4);
  const step = (SERVICE_STEP_MIN + Math.random() * SERVICE_STEP_VARIANCE) * speedMultiplier;
  let progress = state.serviceProgress + step;
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
  const ingredientMultiplier = state.difficulty?.ingredientCostMultiplier || 1;
  outcome.ingredientCost = Math.round(outcome.served * outcome.avgCost * ingredientMultiplier);
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
  const projectedServed = clamp(Math.round(demand * popularityRatio), 0, demand);
  const projectedAngry = Math.max(demand - projectedServed, 0);
  const qualityDiff = price.quality - previousPrice.quality;
  const servedDelta = projectedServed - prevServed;
  const angryDelta = projectedAngry - prevAngry;
  outcome.price = price;
  outcome.pricePerTicket = price.price + avgMargin;
  outcome.projectedDemand = demand;
  outcome.projectedServed = projectedServed;
  outcome.projectedAngry = projectedAngry;
  outcome.rating = clamp(Math.round(outcome.rating + qualityDiff * 6 - angryDelta * 0.3), 10, 100);
  outcome.hypeDelta = clamp(Math.round(outcome.hypeDelta + qualityDiff * 4 + servedDelta * 0.04), -12, 20);
  outcome.repDelta = clamp(Math.round(outcome.repDelta + qualityDiff * 3 - angryDelta * 0.03), -10, 12);
  refreshEconomy(outcome);
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

const togglePause = (options = {}) => {
  if (!state.simRunning || state.gameOver) return;
  state.servicePaused = !state.servicePaused;
  if (state.servicePaused) {
    clearServiceTimer();
    elements.serviceStatus.textContent = options.statusText || 'Paused - crew catching breath.';
    logServiceMessage(options.logText || 'Service paused to reset stations.');
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
    const spoilageMultiplier = clamp(state.difficulty?.spoilageRiskMultiplier || 1, 0.1, 3);
    const baseChance = 0.2 + 0.15 * (inventoryManager.age - 1) + leftover / 100;
    const riskChance = Math.min(baseChance * spoilageMultiplier, 0.95);
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

  // --- loan repayment / default ---
  if (
    state.loanPrincipal > 0 &&
    state.loanDueDay != null &&
    !state.loanPaid &&
    !state.loanDefaulted &&
    state.day >= state.loanDueDay
  ) {
    if (state.money >= state.loanPrincipal) {
      const paid = state.loanPrincipal;
      state.money -= state.loanPrincipal;
      state.loanPaid = true;
      state.loanPrincipal = 0;
      logServiceMessage(`Loan repaid on Day ${state.day}: ${currency(paid)} deducted. No strike earned.`);
    } else {
      state.loanDefaulted = true;
      state.loanPrincipal = 0;
      state.strikes = Math.min(3, state.strikes + 1);
      logServiceMessage(`Loan default! Could not repay by Day ${state.loanDueDay}. One strike added.`);
    }
  }

  // --- existing daily strike logic ---
  let strikesEarned = 0;
  const angryRatio = outcome.served ? outcome.angry / outcome.served : outcome.angry > 0 ? 1 : 0;
  const angryThreshold = clamp(0.4 * (state.difficulty?.angryTolerance || 1), 0.1, 0.9);

  if (outcome.profit <= 0) strikesEarned += 1;
  if (angryRatio >= angryThreshold) strikesEarned += 1;
  if (outcome.rating < 65) strikesEarned += 1;

  if (strikesEarned) {
    state.strikes = Math.min(3, state.strikes + strikesEarned);
    logServiceMessage(`Warning: ${strikesEarned} strike${strikesEarned > 1 ? 's' : ''} added.`);
  }

  // --- failure conditions ---
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

const handleLossVideo = (reason) => {
  if (!elements.lossVideo || !elements.failOverlay) return;
  const shouldPlay = reason === 'Three Strikes';
  elements.failOverlay.classList.toggle('video-active', shouldPlay);
  if (elements.failVideoOverlay) {
    elements.failVideoOverlay.setAttribute('aria-hidden', shouldPlay ? 'false' : 'true');
  }
  if (shouldPlay) {
    elements.lossVideo.currentTime = 0;
    const playPromise = elements.lossVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  } else {
    elements.lossVideo.pause();
    elements.lossVideo.currentTime = 0;
  }
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
  handleLossVideo(reason);
  updateCommandButtons();
  updatePauseButton();
};

const hideFailureOverlay = () => {
  if (!elements.failOverlay) return;
  elements.failOverlay.classList.remove('show');
  elements.failOverlay.setAttribute('aria-hidden', 'true');
  handleLossVideo(null);
};

const init = () => {
  cacheElements();
  renderProfileOptions();
  updatePhaseGuide();
  updatePhasePanels();
  syncModalNextDay();
  updateResultsUI(null);
  renderLabSelects();
  refreshDishLibrary({ showHint: true });
  renderEventLibrary();
  renderUpgradeDeck();
  renderHelperSelect();
  renderCommandButtons();
  updateHelperNote();
  updateLabPreview();
  rollAudienceTrend();
  updateHUD();
  renderDeveloperPanel();
  attachEvents();
  // Message will be refined by reputation system
  setPrepMessage('Recipe Lab: craft combos, then select your lineup to prep.');
  applyReputationLocks();
  updateCommandButtons();
  updateEnvironmentHints(null);
  updateSupplyUI();
  if (!state.starterProfileId) {
    resetCampaign();
  } else {
    updateStockForecast(null);
  }
};

init();
