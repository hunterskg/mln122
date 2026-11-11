// Life Simulation Core Types
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
  tienMat: number; // VNĐ (có thể âm nếu nợ)
  sucKhoe: number; // 0 - 100
  tinhThan: number; // 0 - 100
  quanHe: number; // 0 - 100
}

export interface LifeAxes {
  tichLuy: number; // -100 đến +100 (tích lũy vật chất vs trải nghiệm)
  sinhLuc: number; // -100 đến +100 (tự bóc lột vs bảo tồn thân thể)
  congDong: number; // -100 đến +100 (vị kỷ cá nhân vs vì gia đình/cộng đồng)
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
  buocNhayTuoi?: number;
}

export interface LifeScene {
  id: string;
  tieuDe: string;
  giaiDoanTuoi: [number, number];
  dieuKien?: (state: LifeState) => boolean;
  trongSo: number;
  vanBan: string;
  luaChon: LifeChoice[];
}

export interface LifeHistoryItem {
  turn: number;
  tuoi: number;
  sceneId: string;
  tieuDeCanh: string;
  choiceId: string;
  vanBanLuaChon: string;
  ghiChuHauQua: string;
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
  history: LifeHistoryItem[];
  activeScene?: LifeScene;
}
