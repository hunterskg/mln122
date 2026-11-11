import { GameState } from '../state';
import { PRNG } from '../rng';
import { BUSINESS_EVENTS_CATALOG } from './catalog';
import { BusinessEventDefinition, EventDecisionOption } from './types';

export function evaluateAndTriggerEvent(state: GameState, prng: PRNG): {
  event?: BusinessEventDefinition;
  cooldownKey?: string;
  cooldownTurn?: number;
} {
  const turn = state.turn;

  // Filter eligible events based on predicates and cooldowns
  const eligibleEvents = BUSINESS_EVENTS_CATALOG.filter((ev) => {
    const onCooldown = state.events.eventCooldowns[ev.id] && turn <= state.events.eventCooldowns[ev.id];
    if (onCooldown) return false;
    return ev.isEligible(state);
  });

  if (eligibleEvents.length === 0) return {};

  // Sort by priority descending
  eligibleEvents.sort((a, b) => b.priority - a.priority);

  // Evaluate probability roll with seeded PRNG (target roughly 45% event frequency per turn)
  if (prng.next() < 0.45) {
    // Pick from top priority tier
    const topPriority = eligibleEvents[0].priority;
    const candidates = eligibleEvents.filter((e) => e.priority >= topPriority - 1);
    const chosen = candidates[prng.range(0, candidates.length - 1)];

    return {
      event: chosen,
      cooldownKey: chosen.id,
      cooldownTurn: turn + chosen.cooldownTurns,
    };
  }

  return {};
}

export function resolveEventOption(
  state: GameState,
  eventId: string,
  optionId: string
): {
  cashDelta: number;
  debtDelta: number;
  reputationDelta: number;
  customerSatisfactionDelta: number;
  marketDemandMultiplier: number;
  employeeMoraleDelta: number;
  logMessage: string;
} {
  const eventDef = BUSINESS_EVENTS_CATALOG.find((e) => e.id === eventId);
  if (!eventDef) {
    return {
      cashDelta: 0,
      debtDelta: 0,
      reputationDelta: 0,
      customerSatisfactionDelta: 0,
      marketDemandMultiplier: 1,
      employeeMoraleDelta: 0,
      logMessage: 'Defaulted event choice.',
    };
  }

  const option = eventDef.options.find((o) => o.id === optionId) || eventDef.options[0];
  const result = option.apply(state);

  return {
    cashDelta: result.cashDelta || 0,
    debtDelta: result.debtDelta || 0,
    reputationDelta: result.reputationDelta || 0,
    customerSatisfactionDelta: result.customerSatisfactionDelta || 0,
    marketDemandMultiplier: result.marketDemandMultiplier || 1,
    employeeMoraleDelta: result.employeeMoraleDelta || 0,
    logMessage: result.logMessage,
  };
}
