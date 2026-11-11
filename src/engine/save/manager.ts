import { GameState, PlayerTurnActions } from '../state';
import { validateGameState } from '../validation';
import { CURRENT_SAVE_VERSION, SaveMetadata, SaveSlotData, SaveOperationResult } from './types';

const INDEX_KEY = 'startup_life_saves_index_v2';
const SLOT_PREFIX = 'startup_life_save_slot_';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function calculateSimpleChecksum(content: string): string {
  let hash = 5381;
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) + hash) + content.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export function listSaveSlots(): SaveMetadata[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error('Failed to parse save index:', err);
    return [];
  }
}

function updateIndex(metadata: SaveMetadata): void {
  if (!isBrowser()) return;
  try {
    const current = listSaveSlots().filter((s) => s.id !== metadata.id);
    current.push(metadata);
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to update save index:', err);
  }
}

function removeFromIndex(slotId: string): void {
  if (!isBrowser()) return;
  try {
    const updated = listSaveSlots().filter((s) => s.id !== slotId);
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete from save index:', err);
  }
}

export function migrateSaveData(raw: any): { migratedState: GameState; actions: PlayerTurnActions } | null {
  if (!raw || typeof raw !== 'object' || !raw.gameState || typeof raw.gameState !== 'object') {
    return null;
  }

  const state = raw.gameState;

  // Handle migration from legacy shapes
  const company = state.company || {
    name: state.companyName || 'Unknown Corp',
    industry: state.industry || 'coffee',
    businessModel: state.businessModel || 'd2c',
    founderTrait: state.founderTrait || 'hustler',
    difficulty: state.difficulty || 'bootstrapped',
    level: 1,
  };

  const migratedState: GameState = {
    turn: Number.isFinite(state.turn) ? state.turn : 1,
    seed: Number.isFinite(state.seed) ? state.seed : 1337,
    isGameOver: Boolean(state.isGameOver),
    gameEnding: state.gameEnding,
    insolventTurns: Number.isFinite(state.insolventTurns) ? state.insolventTurns : 0,
    company: {
      name: String(company.name || 'Startup Inc').trim(),
      industry: company.industry || 'coffee',
      businessModel: company.businessModel || 'd2c',
      founderTrait: company.founderTrait || 'hustler',
      difficulty: company.difficulty || 'bootstrapped',
      level: Number.isFinite(company.level) ? company.level : 1,
    },
    market: {
      marketSize: state.market?.marketSize ?? 10000,
      marketTrend: state.market?.marketTrend ?? 0.02,
      reputation: state.market?.reputation ?? 50,
      unitPrice: state.market?.unitPrice ?? 20,
      competitorPrice: state.market?.competitorPrice ?? 20,
      marketingBudget: state.market?.marketingBudget ?? 400,
      marketShare: state.market?.marketShare ?? 5,
      customerSatisfaction: state.market?.customerSatisfaction ?? 75,
      activeCustomers: state.market?.activeCustomers ?? 100,
      churnRate: state.market?.churnRate ?? 0.08,
    },
    inventory: {
      lots: Array.isArray(state.inventory?.lots) ? state.inventory.lots : [],
      purchaseOrders: Array.isArray(state.inventory?.purchaseOrders) ? state.inventory.purchaseOrders : [],
      holdingCostPerUnit: state.inventory?.holdingCostPerUnit ?? 0.2,
      selectedSupplierId: state.inventory?.selectedSupplierId,
    },
    financial: {
      cash: Number.isFinite(state.financial?.cash) ? state.financial.cash : 15000,
      debt: Number.isFinite(state.financial?.debt) ? state.financial.debt : 0,
      creditLimit: Number.isFinite(state.financial?.creditLimit) ? state.financial.creditLimit : 30000,
      pendingAR: Array.isArray(state.financial?.pendingAR) ? state.financial.pendingAR : [],
      pendingAP: Array.isArray(state.financial?.pendingAP) ? state.financial.pendingAP : [],
    },
    employees: Array.isArray(state.employees) ? state.employees : [],
    events: {
      activeEvent: state.events?.activeEvent,
      eventCooldowns: state.events?.eventCooldowns || {},
      eventsTriggeredHistory: Array.isArray(state.events?.eventsTriggeredHistory)
        ? state.events.eventsTriggeredHistory
        : [],
    },
    history: {
      financials: Array.isArray(state.history?.financials) ? state.history.financials : [],
      reports: Array.isArray(state.history?.reports) ? state.history.reports : [],
      transactions: Array.isArray(state.history?.transactions) ? state.history.transactions : [],
    },
    lastReport: state.lastReport,
  };

  const validation = validateGameState(migratedState);
  if (!validation.isValid) {
    console.warn('Migrated state failed validation:', validation.errors);
    return null;
  }

  const actions: PlayerTurnActions = raw.actions || {
    unitPrice: migratedState.market.unitPrice,
    marketingBudget: migratedState.market.marketingBudget,
    purchaseOrders: [],
    hireCount: { sales: 0, operations: 0, support: 0 },
    fireEmployeeIds: [],
    trainEmployeeIds: [],
    borrowDebt: 0,
    repayDebt: 0,
    selectedSupplierId: migratedState.inventory.selectedSupplierId,
  };

  return { migratedState, actions };
}

export function saveGame(
  slotId: string,
  gameState: GameState,
  actions: PlayerTurnActions,
  customSlotName?: string
): SaveOperationResult {
  if (!isBrowser()) {
    return { success: false, error: 'Storage unavailable in non-browser context' };
  }

  const validation = validateGameState(gameState);
  if (!validation.isValid) {
    return { success: false, error: `Invalid game state: ${validation.errors.join(', ')}` };
  }

  try {
    const totalRev = gameState.history.financials.reduce((sum, h) => sum + h.revenue, 0);
    const valuation = Math.max(0, Math.round(totalRev * 1.5 + gameState.financial.cash));

    const metadata: SaveMetadata = {
      id: slotId,
      name: customSlotName || `${gameState.company.name} (Mo ${gameState.turn})`,
      companyName: gameState.company.name,
      industry: gameState.company.industry,
      turn: gameState.turn,
      cash: gameState.financial.cash,
      debt: gameState.financial.debt,
      valuation,
      timestamp: Date.now(),
      version: CURRENT_SAVE_VERSION,
      isGameOver: gameState.isGameOver,
      gameEnding: gameState.gameEnding,
    };

    // Trim transactions in history to last 300 to safeguard localStorage capacity
    const safeState: GameState = {
      ...gameState,
      history: {
        ...gameState.history,
        transactions: gameState.history.transactions.slice(-300),
      },
    };

    const payloadString = JSON.stringify({
      version: CURRENT_SAVE_VERSION,
      metadata,
      gameState: safeState,
      actions,
    });

    const checksum = calculateSimpleChecksum(payloadString);
    const fullSlotData: SaveSlotData = {
      version: CURRENT_SAVE_VERSION,
      metadata,
      gameState: safeState,
      actions,
      checksum,
    };

    window.localStorage.setItem(`${SLOT_PREFIX}${slotId}`, JSON.stringify(fullSlotData));
    updateIndex(metadata);

    return {
      success: true,
      message: `Saved successfully to ${metadata.name}`,
      metadata,
    };
  } catch (err: any) {
    if (err?.name === 'QuotaExceededError' || err?.code === 22) {
      return { success: false, error: 'Browser storage quota exceeded. Please clear old saves.' };
    }
    return { success: false, error: `Save failed: ${err?.message || 'Unknown error'}` };
  }
}

export function loadGame(slotId: string): SaveOperationResult {
  if (!isBrowser()) {
    return { success: false, error: 'Storage unavailable in non-browser context' };
  }

  try {
    const raw = window.localStorage.getItem(`${SLOT_PREFIX}${slotId}`);
    if (!raw) {
      return { success: false, error: `Save slot "${slotId}" not found.` };
    }

    const parsed = JSON.parse(raw);
    const migrated = migrateSaveData(parsed);

    if (!migrated) {
      return { success: false, error: 'Save data corrupted or incompatible with current version.' };
    }

    return {
      success: true,
      data: {
        gameState: migrated.migratedState,
        actions: migrated.actions,
      },
      metadata: parsed.metadata,
      message: `Loaded save slot "${slotId}" successfully.`,
    };
  } catch (err: any) {
    return { success: false, error: `Failed to load save: ${err?.message || 'Corrupted JSON'}` };
  }
}

export function deleteSave(slotId: string): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.removeItem(`${SLOT_PREFIX}${slotId}`);
    removeFromIndex(slotId);
    return true;
  } catch (err) {
    console.error(`Failed to delete save slot ${slotId}:`, err);
    return false;
  }
}

export function autosaveGame(gameState: GameState, actions: PlayerTurnActions): SaveOperationResult {
  return saveGame('autosave', gameState, actions, `Autosave (${gameState.company.name} Mo ${gameState.turn})`);
}

export function exportSaveToJson(slotId: string): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(`${SLOT_PREFIX}${slotId}`);
}

export function importSaveFromJson(jsonString: string, targetSlotId: string = 'slot_1'): SaveOperationResult {
  if (!isBrowser()) {
    return { success: false, error: 'Storage unavailable in non-browser context' };
  }

  try {
    const parsed = JSON.parse(jsonString);
    const migrated = migrateSaveData(parsed);
    if (!migrated) {
      return { success: false, error: 'Uploaded file contains invalid or corrupted save data.' };
    }

    return saveGame(targetSlotId, migrated.migratedState, migrated.actions, `Imported (${migrated.migratedState.company.name})`);
  } catch (err: any) {
    return { success: false, error: `Invalid JSON format: ${err?.message || 'Parse error'}` };
  }
}
