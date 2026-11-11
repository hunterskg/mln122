# KẾ HOẠCH REFACTOR KỸ THUẬT: TỪ STARTUP SIM SANG LIFE SIM (LIFE REFACTOR PLAN)

## 1. Bản đồ chuyển đổi tệp (Refactor File Map)

| Đường dẫn cũ | Hành động | Đường dẫn mới / Thay thế | Vai trò & Nội dung |
| :--- | :---: | :--- | :--- |
| `src/engine/types.ts` | **Cập nhật** | `src/engine/types.ts` | Giữ tương thích ngược một phần, thêm `LifeProfile`, `LifeState`, `LifeScene`, `LifeChoice`. |
| `src/engine/rng.ts` | **Giữ nguyên** | `src/engine/rng.ts` | PRNG Mulberry32 dùng cho tái tạo seed cuộc đời. |
| `src/engine/state.ts` | **Refactor** | `src/engine/state.ts` & `src/engine/life-state.ts` | Định nghĩa `LifeState` (profile, stats, axes, flags, history). |
| `src/engine/life-generator.ts` | **Tạo mới** | `src/engine/life-generator.ts` | Hàm thuần `generateInitialLife(seed: number): LifeState`. |
| `src/engine/scene-selector.ts` | **Tạo mới** | `src/engine/scene-selector.ts` | Hàm thuần `selectNextScene(state: LifeState, prng: PRNG): LifeScene`. |
| `src/engine/reflection.ts` | **Tạo mới** | `src/engine/reflection.ts` | Hàm thuần `evaluateReflection(state: LifeState): LifeReflectionReport`. |
| `src/content/scenes/` | **Tạo mới** | `src/content/scenes/*.ts` | Dữ liệu tĩnh các cảnh đời thường (tuổi 18-65) theo ma trận tình huống. |
| `src/engine/save/` | **Cập nhật** | `src/engine/save/` | Migrate save từ v2.0.0 (Startup) sang v3.0.0 (Life Sim). |
| `src/components/screens/setup-screen.tsx` | **Refactor** | `src/components/screens/setup-screen.tsx` | Màn hình "Bốc cuộc đời" (Lottery of Birth: hiển thị hồ sơ số phận ngẫu nhiên). |
| `src/components/screens/dashboard-screen.tsx` | **Refactor** | `src/components/screens/dashboard-screen.tsx` | Màn hình cảnh hiện tại: văn bản ngôi thứ 2, thanh chỉ số sống, các nút chọn. |
| `src/components/screens/final-report-screen.tsx` | **Refactor** | `src/components/screens/final-report-screen.tsx` | Màn hình "Nhìn lại cuộc đời" (mô thức sống, câu hỏi mở, chiêm nghiệm). |
| `src/components/screens/{inventory,financials,suppliers,employees}-screen.tsx` | **Ẩn/Dọn** | Lưu trữ / vô hiệu hóa | Ẩn khỏi sidebar; người chơi tập trung vào mạch cảnh sống đời thường. |

---

## 2. Thiết kế chi tiết Kiểu dữ liệu (TypeScript Interfaces)

```ts
export type VungMien = 'bac' | 'trung' | 'nam';
export type XuatThan = 'nong_thon_ngheo' | 'lao_dong_do_thi' | 'tieu_tu_san';
export type GioiTinh = 'nam' | 'nu';

export interface LifeProfile {
  id: string;
  ten: string;
  gioiTinh: GioiTinh;
  namSinh: number;
  tuoi: number;
  vungMien: VungMien;
  diaPhuong: string;
  xuatThan: XuatThan;
  ngheNghiep: string;
  tieuSuNgan: string;
}

export interface LifeStats {
  tienMat: number; // VNĐ
  sucKhoe: number; // 0 - 100
  tinhThan: number; // 0 - 100
  quanHe: number; // 0 - 100
}

export interface LifeAxes {
  tichLuy: number; // -100 (chi tiêu/trải nghiệm) đến +100 (tích lũy tối đa)
  sinhLuc: number; // -100 (tự bóc lột) đến +100 (bảo tồn thân thể)
  congDong: number; // -100 (vị kỷ cá nhân) đến +100 (vì gia đình, tập thể)
}

export interface LifeChoice {
  id: string;
  vanBan: string;
  moTaHauQuaNgan?: string;
  tacDong: {
    tienMatDelta?: number;
    sucKhoeDelta?: number;
    tinhThanDelta?: number;
    quanHeDelta?: number;
    tichLuyDelta?: number;
    sinhLucDelta?: number;
    congDongDelta?: number;
  };
  setFlags?: Record<string, boolean | number | string>;
  buocNhayTuoi?: number; // mặc định +2 đến +4 tuổi
}

export interface LifeScene {
  id: string;
  tieuDe: string;
  giaiDoanTuoi: [number, number]; // [minAge, maxAge]
  dieuKien?: (state: LifeState) => boolean;
  trongSo: number;
  vanBan: string;
  luaChon: LifeChoice[];
}

export interface LifeState {
  version: '3.0.0';
  seed: number;
  turn: number;
  isGameOver: boolean;
  lyDoKetThuc?: string;
  profile: LifeProfile;
  stats: LifeStats;
  axes: LifeAxes;
  flags: Record<string, boolean | number | string>;
  history: {
    turn: number;
    tuoi: number;
    sceneId: string;
    choiceId: string;
    vanBanLuaChon: string;
  }[];
}
```

---

## 3. Lộ trình thực thi (Implementation Order)

1. **Bước 1 (Schema & Engine Core):**
   - Viết `src/engine/life-types.ts` & `src/engine/life-generator.ts`.
   - Viết test Vitest `src/engine/life-generator.test.ts` đảm bảo sinh cuộc đời hoàn toàn xác định theo seed.
2. **Bước 2 (Content & Selector):**
   - Tạo `src/content/scenes/index.ts` chứa bộ 15-20 cảnh mẫu phủ khắp các mốc tuổi 18 - 65.
   - Viết `src/engine/scene-selector.ts` chọn cảnh thuần và test `src/engine/scene-selector.test.ts`.
3. **Bước 3 (Reflection Engine):**
   - Viết `src/engine/reflection.ts` nhận `LifeState` xuất báo cáo mô thức sống.
4. **Bước 4 (Store & Save Migration):**
   - Cập nhật `src/store/game-store.ts` tích hợp `LifeState`.
   - Bổ sung hàm migrate trong `src/engine/save/manager.ts`.
5. **Bước 5 (UI Screens):**
   - Cập nhật `SetupScreen` (màn hình số phận khởi đầu).
   - Cập nhật `DashboardScreen` (màn hình hiển thị cảnh sống hiện tại).
   - Cập nhật `FinalReportScreen` (màn hình nhìn lại cuộc đời).
6. **Bước 6 (Playtest Swarm & Verification):**
   - Chạy bộ bot giả lập kiểm tra 200 seed, đảm bảo không có cảnh bị kẹt, tiền/sức khỏe cân bằng.
