import { PRNG } from './rng';
import { LifeState, LifeScene, LifeHistoryItem } from './life-types';
import { LIFE_SCENES } from '@/content/scenes';

export function selectNextScene(state: LifeState, prng: PRNG): LifeScene | undefined {
  const visitedIds = new Set(state.history.map((h) => h.sceneId));
  if (state.activeScene) {
    visitedIds.add(state.activeScene.id);
  }

  const eligibleScenes = LIFE_SCENES.filter((s) => {
    if (visitedIds.has(s.id)) return false;
    if (s.dieuKien && !s.dieuKien(state)) return false;
    return true;
  });

  if (eligibleScenes.length === 0) return undefined;

  const currentAge = state.profile.tuoi;

  // 1. Cảnh khớp chính xác dải tuổi
  const exactTier = eligibleScenes.filter(
    (s) => s.giaiDoanTuoi[0] <= currentAge && currentAge <= s.giaiDoanTuoi[1]
  );

  let candidatePool = exactTier;

  // 2. Fallback nếu dải tuổi hẹp không còn cảnh
  if (candidatePool.length === 0) {
    candidatePool = eligibleScenes.filter(
      (s) => s.giaiDoanTuoi[0] <= currentAge + 5 && currentAge - 5 <= s.giaiDoanTuoi[1]
    );
  }

  // 3. Fallback lấy cảnh tiếp theo theo thứ tự tuổi
  if (candidatePool.length === 0) {
    candidatePool = eligibleScenes.filter((s) => s.giaiDoanTuoi[0] >= currentAge);
  }

  if (candidatePool.length === 0) {
    // Nếu quá tuổi 65 mà chưa qua cảnh hoàng hôn, ưu tiên cảnh hoàng hôn
    const sunsetScene = eligibleScenes.find((s) => s.id === 'scene_65_hoang_hon');
    if (sunsetScene) return sunsetScene;
    return undefined;
  }

  // Chọn theo trọng số
  const totalWeight = candidatePool.reduce((sum, s) => sum + s.trongSo, 0);
  let roll = prng.range(0, totalWeight - 1);
  let selectedScene = candidatePool[0];

  for (const scene of candidatePool) {
    if (roll < scene.trongSo) {
      selectedScene = scene;
      break;
    }
    roll -= scene.trongSo;
  }

  // Lọc các lựa chọn phù hợp với điều kiện xuất thân/trạng thái hiện tại
  const validChoices = selectedScene.luaChon.filter(
    (choice) => !choice.dieuKien || choice.dieuKien(state)
  );

  return {
    ...selectedScene,
    luaChon: validChoices.length > 0 ? validChoices : selectedScene.luaChon,
  };
}

export function applyLifeChoice(state: LifeState, choiceId: string): LifeState {
  if (state.isGameOver || !state.activeScene) {
    return state;
  }

  const scene = state.activeScene;
  const choice = scene.luaChon.find((c) => c.id === choiceId) || scene.luaChon[0];
  if (!choice) {
    return state;
  }

  const td = choice.tacDong;
  const newTienMat = Math.round(state.stats.tienMat + (td.tienMatDelta ?? 0));
  const newSucKhoe = Math.min(100, Math.max(0, state.stats.sucKhoe + (td.sucKhoeDelta ?? 0)));
  const newTinhThan = Math.min(100, Math.max(0, state.stats.tinhThan + (td.tinhThanDelta ?? 0)));
  const newQuanHe = Math.min(100, Math.max(0, state.stats.quanHe + (td.quanHeDelta ?? 0)));

  const newTichLuy = Math.min(100, Math.max(-100, state.axes.tichLuy + (td.tichLuyDelta ?? 0)));
  const newSinhLuc = Math.min(100, Math.max(-100, state.axes.sinhLuc + (td.sinhLucDelta ?? 0)));
  const newCongDong = Math.min(100, Math.max(-100, state.axes.congDong + (td.congDongDelta ?? 0)));

  const newFlags = {
    ...state.flags,
    ...(choice.setFlags || {}),
  };

  const historyItem: LifeHistoryItem = {
    turn: state.turn,
    tuoi: state.profile.tuoi,
    sceneId: scene.id,
    tieuDeCanh: scene.tieuDe,
    choiceId: choice.id,
    vanBanLuaChon: choice.vanBan,
    ghiChuHauQua: choice.moTaHauQuaNgan || '',
  };

  const newHistory = [...state.history, historyItem];
  const newAge = state.profile.tuoi + (choice.buocNhayTuoi ?? 3);
  const nextTurn = state.turn + 1;

  // Kiểm tra điều kiện kết thúc
  let isGameOver = false;
  let lyDoKetThuc: string | undefined = undefined;

  if (newSucKhoe <= 0) {
    isGameOver = true;
    lyDoKetThuc = 'Cơ thể kiệt quệ sau những năm tháng lao lực triền miên. Hành trình dừng lại ở tuổi ' + newAge + '.';
  } else if (scene.id === 'scene_65_hoang_hon' || newAge >= 70) {
    isGameOver = true;
    lyDoKetThuc = 'Hoàn thành trọn vẹn hành trình nhân sinh mưu sinh kiên cường ở tuổi ' + newAge + '.';
  }

  const updatedProfile = {
    ...state.profile,
    tuoi: newAge,
    ngheNghiep: (newFlags['nghe_nghiep'] as string) || state.profile.ngheNghiep,
  };

  const nextStateDraft: LifeState = {
    ...state,
    turn: nextTurn,
    isGameOver,
    lyDoKetThuc,
    profile: updatedProfile,
    stats: {
      tienMat: newTienMat,
      sucKhoe: newSucKhoe,
      tinhThan: newTinhThan,
      quanHe: newQuanHe,
    },
    axes: {
      tichLuy: newTichLuy,
      sinhLuc: newSinhLuc,
      congDong: newCongDong,
    },
    flags: newFlags,
    history: newHistory,
    activeScene: undefined,
  };

  if (isGameOver) {
    return nextStateDraft;
  }

  // Chọn cảnh tiếp theo
  const prng = new PRNG(state.seed + nextTurn * 104729);
  const nextScene = selectNextScene(nextStateDraft, prng);

  if (!nextScene) {
    return {
      ...nextStateDraft,
      isGameOver: true,
      lyDoKetThuc: 'Cuộc đời khép lại trong sự bình lặng của tuổi xế chiều.',
      activeScene: undefined,
    };
  }

  return {
    ...nextStateDraft,
    activeScene: nextScene,
  };
}
