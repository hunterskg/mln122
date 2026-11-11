import { BusinessEventDefinition } from './types';
import { EVENTS_GROUP_A, EVENTS_GROUP_B, EVENTS_GROUP_C } from './catalog-a-b-c';
import { EVENTS_GROUP_D, EVENTS_GROUP_E, EVENTS_GROUP_F, EVENTS_GROUP_G } from './catalog-d-e-f-g';

export const BUSINESS_EVENTS_CATALOG: BusinessEventDefinition[] = [
  ...EVENTS_GROUP_A,
  ...EVENTS_GROUP_B,
  ...EVENTS_GROUP_C,
  ...EVENTS_GROUP_D,
  ...EVENTS_GROUP_E,
  ...EVENTS_GROUP_F,
  ...EVENTS_GROUP_G,
];
