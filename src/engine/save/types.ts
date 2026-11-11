import { GameState, PlayerTurnActions, Industry, GameEnding } from '../state';

export const CURRENT_SAVE_VERSION = '2.0.0';

export interface SaveMetadata {
  id: string; // 'autosave' | 'slot_1' | 'slot_2' | 'slot_3'
  name: string;
  companyName: string;
  industry: Industry;
  turn: number;
  cash: number;
  debt: number;
  valuation: number;
  timestamp: number;
  version: string;
  isGameOver: boolean;
  gameEnding?: GameEnding;
}

export interface SaveSlotData {
  version: string;
  metadata: SaveMetadata;
  gameState: GameState;
  actions: PlayerTurnActions;
  checksum?: string;
}

export interface SaveOperationResult {
  success: boolean;
  message?: string;
  error?: string;
  metadata?: SaveMetadata;
  data?: {
    gameState: GameState;
    actions: PlayerTurnActions;
  };
}
