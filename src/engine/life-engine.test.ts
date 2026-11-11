import { describe, it, expect } from 'vitest';
import { generateInitialLife } from './life-generator';
import { applyLifeChoice, selectNextScene } from './scene-selector';
import { evaluateReflection, REFLECTION_PATTERNS } from './reflection';
import { LifeState, LifeChoice } from './life-types';
import { LIFE_SCENES } from '@/content/scenes';
import { PRNG } from './rng';

describe('Life Simulation Engine & Playtest Swarm Verification', () => {
  it('generateInitialLife produces deterministic profiles from seed', () => {
    const lifeA = generateInitialLife(4242);
    const lifeB = generateInitialLife(4242);

    expect(lifeA.profile.ten).toBe(lifeB.profile.ten);
    expect(lifeA.profile.diaPhuong).toBe(lifeB.profile.diaPhuong);
    expect(lifeA.profile.xuatThan).toBe(lifeB.profile.xuatThan);
    expect(lifeA.stats.tienMat).toBe(lifeB.stats.tienMat);
    expect(lifeA.activeScene?.id).toBe(lifeB.activeScene?.id);
  });

  it('Life state initializes with valid Vietnamese demographics and constraints', () => {
    const seeds = [101, 202, 303, 404, 505];
    for (const seed of seeds) {
      const life = generateInitialLife(seed);
      expect(life.profile.tuoi).toBe(18);
      expect(['bac', 'trung', 'nam']).toContain(life.profile.vungMien);
      expect(['nong_thon_ngheo', 'lao_dong_do_thi', 'tieu_tu_san']).toContain(life.profile.xuatThan);
      expect(life.stats.sucKhoe).toBeGreaterThanOrEqual(80);
      expect(life.stats.tinhThan).toBeGreaterThanOrEqual(70);
      expect(life.activeScene).toBeDefined();
      expect(life.activeScene?.luaChon.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('applyLifeChoice preserves immutability and accurately updates stats/axes', () => {
    const initial = generateInitialLife(1234);
    const scene = initial.activeScene!;
    const choice = scene.luaChon[0];

    const nextState = applyLifeChoice(initial, choice.id);

    // Immutability
    expect(nextState).not.toBe(initial);
    expect(initial.turn).toBe(1);
    expect(initial.profile.tuoi).toBe(18);

    // Progression
    expect(nextState.turn).toBe(2);
    expect(nextState.profile.tuoi).toBe(18 + (choice.buocNhayTuoi ?? 3));
    expect(nextState.history.length).toBe(1);
    expect(nextState.history[0].sceneId).toBe(scene.id);
    expect(nextState.history[0].choiceId).toBe(choice.id);

    // Delta updates
    const expectedTienMat = Math.round(initial.stats.tienMat + (choice.tacDong.tienMatDelta ?? 0));
    expect(nextState.stats.tienMat).toBe(expectedTienMat);
  });

  it('evaluateReflection selects matching archetypes and produces open-ended reflection', () => {
    const life = generateInitialLife(999);
    life.axes.tichLuy = 40;
    life.axes.sinhLuc = -30;
    life.stats.sucKhoe = 45;
    life.flags['dau_da_day'] = true;

    const report = evaluateReflection(life);

    expect(report.tieuDeCuocDoi).toContain(life.profile.ten);
    expect(report.moThucChinh.length).toBeGreaterThanOrEqual(1);
    expect(report.moThucChinh.length).toBeLessThanOrEqual(3);
    expect(report.cauHoiMo).toBeDefined();
    expect(report.cauHoiMo.endsWith('?')).toBe(true);
    expect(report.gocKinhTeChinhTri).toContain('Kinh tế chính trị Mác - Lênin');
  });

  // ========================================================
  // PLAYTEST SWARM (Bot Simulation across 6 Policies x 50 Seeds = 300 runs)
  // ========================================================
  type BotPolicy = (sceneChoices: LifeChoice[], state: LifeState) => LifeChoice;

  const POLICIES: Record<string, BotPolicy> = {
    // 1. Thực dụng: tối đa hóa tiền mặt và tích lũy
    thuc_dung: (choices) =>
      [...choices].sort(
        (a, b) =>
          (b.tacDong.tienMatDelta ?? 0) + (b.tacDong.tichLuyDelta ?? 0) * 100000 -
          ((a.tacDong.tienMatDelta ?? 0) + (a.tacDong.tichLuyDelta ?? 0) * 100000)
      )[0],

    // 2. Tiết kiệm: tránh chi tiền, ưu tiên tiền mặt không âm
    tiet_kiem: (choices) =>
      [...choices].sort((a, b) => (b.tacDong.tienMatDelta ?? 0) - (a.tacDong.tienMatDelta ?? 0))[0],

    // 3. Gia đình: ưu tiên tình cảm và cộng đồng
    gia_dinh: (choices) =>
      [...choices].sort(
        (a, b) =>
          (b.tacDong.congDongDelta ?? 0) + (b.tacDong.quanHeDelta ?? 0) -
          ((a.tacDong.congDongDelta ?? 0) + (a.tacDong.quanHeDelta ?? 0))
      )[0],

    // 4. Liều lĩnh: chấp nhận tăng ca và giảm sinh lực để mưu sinh
    lieu_linh: (choices) =>
      [...choices].sort((a, b) => (a.tacDong.sinhLucDelta ?? 0) - (b.tacDong.sinhLucDelta ?? 0))[0],

    // 5. Trì hoãn / An phận: ưu tiên giữ sức khỏe và tinh thần
    tri_hoan: (choices) =>
      [...choices].sort(
        (a, b) =>
          (b.tacDong.sucKhoeDelta ?? 0) + (b.tacDong.tinhThanDelta ?? 0) -
          ((a.tacDong.sucKhoeDelta ?? 0) + (a.tacDong.tinhThanDelta ?? 0))
      )[0],

    // 6. Ngẫu nhiên: chọn tùy hứng theo PRNG
    ngau_nhien: (choices, state) => {
      const prng = new PRNG(state.seed + state.turn * 31);
      return choices[prng.range(0, choices.length - 1)];
    },
  };

  it('Playtest Swarm: 300 automated playthroughs execute safely without infinite loops or crashes', () => {
    const policyNames = Object.keys(POLICIES);
    const scenesHitFrequency: Record<string, number> = {};

    LIFE_SCENES.forEach((s) => {
      scenesHitFrequency[s.id] = 0;
    });

    for (const policyName of policyNames) {
      const choose = POLICIES[policyName];

      for (let s = 1; s <= 50; s++) {
        const seed = s * 7919 + policyName.charCodeAt(0);
        let state = generateInitialLife(seed);
        let turnCount = 0;
        const maxTurnsGuard = 40;

        while (!state.isGameOver && turnCount < maxTurnsGuard) {
          turnCount++;
          const scene = state.activeScene;
          if (!scene) break;

          scenesHitFrequency[scene.id] = (scenesHitFrequency[scene.id] || 0) + 1;
          const choice = choose(scene.luaChon, state);
          state = applyLifeChoice(state, choice.id);
        }

        // Verify end conditions
        expect(state.isGameOver).toBe(true);
        expect(state.profile.tuoi).toBeGreaterThanOrEqual(20);
        expect(state.profile.tuoi).toBeLessThanOrEqual(80);
        expect(state.history.length).toBeGreaterThanOrEqual(1);

        // Reflection evaluation works on completed run
        const reflection = evaluateReflection(state);
        expect(reflection.moThucChinh.length).toBeGreaterThanOrEqual(1);
      }
    }

    // Đảm bảo không có cảnh nào bị 'chết' hoàn toàn (tất cả các cảnh tuổi 18-65 đều được gọi)
    const baseScenes = LIFE_SCENES.filter((s) => !s.dieuKien);
    for (const baseScene of baseScenes) {
      expect(scenesHitFrequency[baseScene.id]).toBeGreaterThan(0);
    }
  });
});
