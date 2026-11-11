import { describe, it, expect } from 'vitest';
import {
  BUSINESS_EVENTS_CATALOG,
  evaluateAndTriggerEvent,
  resolveEventOption,
  createInitialGameState,
  advanceMonth,
  PlayerTurnActions,
  MILESTONES,
  ACHIEVEMENTS,
  PRNG,
} from './index';

describe('Phase 5 Events, Decisions & Progression Tests', () => {
  it('BUSINESS_EVENTS_CATALOG contains at least 50 distinct, balanced educational events', () => {
    expect(BUSINESS_EVENTS_CATALOG.length).toBeGreaterThanOrEqual(50);

    const uniqueIds = new Set(BUSINESS_EVENTS_CATALOG.map((e) => e.id));
    expect(uniqueIds.size).toBe(BUSINESS_EVENTS_CATALOG.length);

    // Verify all events have at least 2 distinct trade-off options and educational insights
    BUSINESS_EVENTS_CATALOG.forEach((ev) => {
      expect(ev.options.length).toBeGreaterThanOrEqual(2);
      expect(ev.title.length).toBeGreaterThan(0);
      expect(ev.description.length).toBeGreaterThan(0);
      expect(ev.cooldownTurns).toBeGreaterThan(0);
      expect(ev.sourceReference).toBeDefined();
      expect(ev.sourceReference.chapter).toMatch(/^Chương [1-3]/);
      expect(ev.educationalInsight.length).toBeGreaterThan(15);
    });
  });

  it('Events trigger deterministically with identical seeds and states', () => {
    const seed = 88888;
    const stateA = createInitialGameState('Event Test Co', 'coffee', 'd2c', 'hustler', 'angel', seed);
    stateA.turn = 5;

    const prngA = new PRNG(seed);
    const trigA = evaluateAndTriggerEvent(stateA, prngA);

    const prngB = new PRNG(seed);
    const trigB = evaluateAndTriggerEvent(stateA, prngB);

    expect(trigA.event?.id).toBe(trigB.event?.id);
  });

  it('Event options apply real trade-offs and respect cash and reputation impacts', () => {
    const state = createInitialGameState('Option Test Co', 'coffee', 'd2c', 'hustler', 'angel', 101);

    // Option 1: repackage
    const resA = resolveEventOption(state, 'evt_01_packaging_defect', 'repackage_goods');
    expect(resA.cashDelta).toBe(-900);
    expect(resA.customerSatisfactionDelta).toBe(5);

    // Option 2: liquidate grade b
    const resB = resolveEventOption(state, 'evt_01_packaging_defect', 'liquidate_grade_b');
    expect(resB.cashDelta).toBe(0);
    expect(resB.customerSatisfactionDelta).toBe(-5);
  });

  it('Progression milestones and achievements evaluate performance metrics accurately', () => {
    const state = createInitialGameState('Milestone Co', 'coffee', 'd2c', 'hustler', 'angel', 505);

    // Fresh company has not reached $10k revenue milestone
    expect(MILESTONES[0].isUnlocked(state)).toBe(false);

    // Simulate scaleup state
    state.financial.cash = 120000;
    const fortressMilestone = MILESTONES.find((m) => m.id === 'cash_cushion_100k');
    expect(fortressMilestone?.isUnlocked(state)).toBe(true);

    state.market.customerSatisfaction = 95;
    const delightAch = ACHIEVEMENTS.find((a) => a.id === 'ach_high_satisfaction');
    expect(delightAch?.check(state)).toBe(true);
  });
});
