import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  PlayerTurnActions,
  Industry,
  BusinessModel,
  FounderTrait,
  Difficulty,
  createInitialGameState,
  advanceMonth,
  INDUSTRY_CONFIG,
  saveGame,
  loadGame,
  deleteSave,
  autosaveGame,
  importSaveFromJson,
  SaveOperationResult,
  LifeState,
  generateInitialLife,
  applyLifeChoice,
} from '@/engine';

interface LifeStoneSummary {
  id: string;
  ten: string;
  diaPhuong: string;
  tuoiKetThuc: number;
  tienMat: number;
  lyDoKetThuc: string;
  seed: number;
}

interface GameStore {
  gameState: GameState | null;
  currentActions: PlayerTurnActions;
  lifeState: LifeState | null;
  lifeStones: LifeStoneSummary[];

  // Life Sim Actions
  initNewLife: (seed?: number) => void;
  makeLifeChoice: (choiceId: string) => void;
  resetLife: () => void;

  // Legacy Enterprise Actions
  initNewGame: (
    name: string,
    industry: Industry,
    businessModel: BusinessModel,
    founderTrait: FounderTrait,
    difficulty: Difficulty
  ) => void;
  setUnitPrice: (price: number) => void;
  setMarketingBudget: (budget: number) => void;
  addPurchaseOrder: (supplierId: string, units: number) => void;
  removePurchaseOrder: (index: number) => void;
  setHireCount: (role: 'sales' | 'operations' | 'support', count: number) => void;
  toggleFireEmployee: (id: string) => void;
  toggleTrainEmployee: (id: string) => void;
  setBorrowDebt: (amount: number) => void;
  setRepayDebt: (amount: number) => void;
  selectEventOption: (optionId: string) => void;
  selectPreferredSupplier: (supplierId: string) => void;
  advanceTurn: () => void;
  resetGame: () => void;
  saveToSlot: (slotId: string, name?: string) => SaveOperationResult;
  loadFromSlot: (slotId: string) => SaveOperationResult;
  deleteSlot: (slotId: string) => boolean;
  importSave: (json: string) => SaveOperationResult;
}

const defaultActions: PlayerTurnActions = {
  unitPrice: 18,
  marketingBudget: 400,
  purchaseOrders: [],
  hireCount: { sales: 0, operations: 0, support: 0 },
  fireEmployeeIds: [],
  trainEmployeeIds: [],
  borrowDebt: 0,
  repayDebt: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      currentActions: defaultActions,
      lifeState: null,
      lifeStones: [],

      initNewLife: (seed) => {
        const chosenSeed = typeof seed === 'number' && Number.isFinite(seed) ? Math.floor(seed) : Math.floor(Date.now() % 10000000);
        const newLife = generateInitialLife(chosenSeed);
        set({ lifeState: newLife });
      },

      makeLifeChoice: (choiceId) => {
        const { lifeState, lifeStones } = get();
        if (!lifeState || lifeState.isGameOver) return;
        const nextLife = applyLifeChoice(lifeState, choiceId);
        let updatedStones = lifeStones;
        if (nextLife.isGameOver) {
          const alreadyLogged = lifeStones.some((s) => s.id === nextLife.profile.id);
          if (!alreadyLogged) {
            updatedStones = [
              {
                id: nextLife.profile.id,
                ten: nextLife.profile.ten,
                diaPhuong: nextLife.profile.diaPhuong,
                tuoiKetThuc: nextLife.profile.tuoi,
                tienMat: nextLife.stats.tienMat,
                lyDoKetThuc: nextLife.lyDoKetThuc || 'Hoàn thành cuộc đời',
                seed: nextLife.seed,
              },
              ...lifeStones.slice(0, 19),
            ];
          }
        }
        set({ lifeState: nextLife, lifeStones: updatedStones });
      },

      resetLife: () => {
        set({ lifeState: null });
      },

      initNewGame: (name, industry, businessModel, founderTrait, difficulty) => {
        const state = createInitialGameState(name, industry, businessModel, founderTrait, difficulty, Date.now());
        const cfg = INDUSTRY_CONFIG[industry];
        const initialActions: PlayerTurnActions = {
          ...defaultActions,
          unitPrice: cfg.defaultPrice,
          selectedSupplierId: state.inventory.selectedSupplierId,
        };
        set({
          gameState: state,
          currentActions: initialActions,
        });
        autosaveGame(state, initialActions);
      },

      setUnitPrice: (price) => {
        set((state) => ({
          currentActions: { ...state.currentActions, unitPrice: Math.max(1, price) },
        }));
      },

      setMarketingBudget: (budget) => {
        set((state) => ({
          currentActions: { ...state.currentActions, marketingBudget: Math.max(0, budget) },
        }));
      },

      addPurchaseOrder: (supplierId, units) => {
        set((state) => ({
          currentActions: {
            ...state.currentActions,
            purchaseOrders: [...state.currentActions.purchaseOrders, { supplierId, units }],
          },
        }));
      },

      removePurchaseOrder: (index) => {
        set((state) => ({
          currentActions: {
            ...state.currentActions,
            purchaseOrders: state.currentActions.purchaseOrders.filter((_, i) => i !== index),
          },
        }));
      },

      setHireCount: (role, count) => {
        set((state) => ({
          currentActions: {
            ...state.currentActions,
            hireCount: {
              ...state.currentActions.hireCount,
              [role]: Math.max(0, count),
            },
          },
        }));
      },

      toggleFireEmployee: (id) => {
        set((state) => {
          const exists = state.currentActions.fireEmployeeIds.includes(id);
          return {
            currentActions: {
              ...state.currentActions,
              fireEmployeeIds: exists
                ? state.currentActions.fireEmployeeIds.filter((item) => item !== id)
                : [...state.currentActions.fireEmployeeIds, id],
            },
          };
        });
      },

      toggleTrainEmployee: (id) => {
        set((state) => {
          const currentList = state.currentActions.trainEmployeeIds || [];
          const exists = currentList.includes(id);
          return {
            currentActions: {
              ...state.currentActions,
              trainEmployeeIds: exists ? currentList.filter((item) => item !== id) : [...currentList, id],
            },
          };
        });
      },

      setBorrowDebt: (amount) => {
        set((state) => ({
          currentActions: { ...state.currentActions, borrowDebt: Math.max(0, amount) },
        }));
      },

      setRepayDebt: (amount) => {
        set((state) => ({
          currentActions: { ...state.currentActions, repayDebt: Math.max(0, amount) },
        }));
      },

      selectEventOption: (optionId) => {
        set((state) => ({
          currentActions: { ...state.currentActions, selectedEventOptionId: optionId },
        }));
      },

      selectPreferredSupplier: (supplierId) => {
        set((state) => ({
          currentActions: { ...state.currentActions, selectedSupplierId: supplierId },
        }));
      },

      advanceTurn: () => {
        const { gameState, currentActions } = get();
        if (!gameState || gameState.isGameOver) return;

        const nextState = advanceMonth(gameState, currentActions);
        const nextActions: PlayerTurnActions = {
          unitPrice: nextState.market.unitPrice,
          marketingBudget: nextState.market.marketingBudget,
          purchaseOrders: [],
          hireCount: { sales: 0, operations: 0, support: 0 },
          fireEmployeeIds: [],
          trainEmployeeIds: [],
          borrowDebt: 0,
          repayDebt: 0,
          selectedEventOptionId: undefined,
          selectedSupplierId: nextState.inventory.selectedSupplierId,
        };

        set({
          gameState: nextState,
          currentActions: nextActions,
        });

        // Trigger autosave
        autosaveGame(nextState, nextActions);
      },

      saveToSlot: (slotId, name) => {
        const { gameState, currentActions } = get();
        if (!gameState) return { success: false, error: 'No active game session to save.' };
        return saveGame(slotId, gameState, currentActions, name);
      },

      loadFromSlot: (slotId) => {
        const result = loadGame(slotId);
        if (result.success && result.data) {
          set({
            gameState: result.data.gameState,
            currentActions: result.data.actions,
          });
        }
        return result;
      },

      deleteSlot: (slotId) => {
        return deleteSave(slotId);
      },

      importSave: (json) => {
        const result = importSaveFromJson(json, 'slot_1');
        if (result.success && result.data) {
          set({
            gameState: result.data.gameState,
            currentActions: result.data.actions,
          });
        }
        return result;
      },

      resetGame: () => {
        set({ gameState: null, currentActions: defaultActions });
      },
    }),
    {
      name: 'startup_life_state_v1',
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState) {
          return { gameState: null, currentActions: defaultActions, lifeState: null, lifeStones: [] };
        }
        return {
          ...persistedState,
          lifeState: persistedState.lifeState || null,
          lifeStones: Array.isArray(persistedState.lifeStones) ? persistedState.lifeStones : [],
        };
      },
    }
  )
);
