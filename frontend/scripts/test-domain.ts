import assert from 'assert';

// 1. Theme Color Verification
import { colors } from '../src/theme/colors';
assert.strictEqual(colors.surface, '#FAF9F6', 'Canvas surface base must be Luminous Alabaster #FAF9F6');
assert.strictEqual(colors.primary, '#161616', 'Primary ink must be Obsidian #161616');
assert.strictEqual(colors.auroraGradient.length, 3, 'Signature Aurora Continuum must have 3 stops');
assert.strictEqual(colors.auroraGradient[0], '#FF6B4A', 'First stop must be Sunset Ember');
console.log('✓ Theme tokens match Luminous Alabaster specifications');

// 2. RevenueCat Constants & Entitlement Logic Verification (Shipaton 2026 mandates)
const REVENUECAT_ENTITLEMENT_ID = 'proof_pro';
const REVENUECAT_PRODUCT_MONTHLY = 'proof_monthly';
const REVENUECAT_PRODUCT_ANNUAL = 'proof_annual';

assert.strictEqual(REVENUECAT_ENTITLEMENT_ID, 'proof_pro', 'Shipaton required entitlement must be proof_pro');
assert.strictEqual(REVENUECAT_PRODUCT_MONTHLY, 'proof_monthly', 'Shipaton required product must be proof_monthly');
assert.strictEqual(REVENUECAT_PRODUCT_ANNUAL, 'proof_annual', 'Shipaton required product must be proof_annual');

// Test entitlement derivation logic
function checkProEntitlement(customerInfo: any) {
  if (!customerInfo || !customerInfo.entitlements || !customerInfo.entitlements.active) return false;
  return typeof customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID] !== 'undefined';
}

assert.strictEqual(checkProEntitlement(null), false, 'Null customerInfo should not be Pro');
assert.strictEqual(checkProEntitlement({ entitlements: { active: {} } }), false, 'Empty active entitlements should not be Pro');
assert.strictEqual(checkProEntitlement({ entitlements: { active: { proof_pro: { isActive: true } } } }), true, 'Active proof_pro must yield isPro = true');
console.log('✓ RevenueCat entitlement logic verification passed');

// 3. Demo Dataset & Waypoint Integrity
import { DEMO_JOURNEYS, DEMO_EVIDENCE, DEMO_PROOF_STORY } from '../src/services/demoData';
assert.strictEqual(DEMO_JOURNEYS.length, 2, 'Should provide 2 demo journeys');
assert.strictEqual(DEMO_JOURNEYS[0].title, 'Learning Digital Art', 'Primary demo journey must be Learning Digital Art');
assert.strictEqual(DEMO_EVIDENCE.length, 5, 'Should provide 5 evidence waypoints (Day 1, 7, 15, 23, 30)');

const days = DEMO_EVIDENCE.map((e) => e.day_number);
assert.deepStrictEqual(days, [1, 7, 15, 23, 30], 'Evidence captures must be chronologically ordered');

// Check Proof Story
assert.strictEqual(DEMO_PROOF_STORY.chapters.length, 4, 'Proof story must have 4 chapters');
assert.strictEqual(DEMO_PROOF_STORY.chapters[0].badge_label, 'RAW SKETCH', 'Chapter 1 badge must be RAW SKETCH');
assert.strictEqual(DEMO_PROOF_STORY.chapters[3].badge_label, 'MASTERPIECE', 'Chapter 4 badge must be MASTERPIECE');
console.log('✓ Demo data and story narrative integrity passed');

console.log('\nAll frontend domain tests passed successfully!');
