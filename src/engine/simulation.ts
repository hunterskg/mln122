import {
  createInitialGameState,
  advanceMonth,
  GameState,
  PlayerTurnActions,
} from './index';

export function createInitialState(
  companyName: string,
  industry: 'coffee' | 'apparel' | 'saas',
  businessModel: 'd2c' | 'b2b',
  founderTrait: 'hustler' | 'product_geek' | 'ops_veteran',
  difficulty: 'bootstrapped' | 'angel' | 'vc',
  seed: number = 1337
): GameState {
  return createInitialGameState(companyName, industry, businessModel, founderTrait, difficulty, seed);
}

export function stepSimulation(state: GameState, actions: PlayerTurnActions): GameState {
  return advanceMonth(state, actions);
}
