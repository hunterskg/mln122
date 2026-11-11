import { PRNG } from './rng';
import {
  LifeProfile,
  LifeStats,
  LifeAxes,
  LifeState,
  VungMien,
  XuatThan,
  GioiTinh,
} from './life-types';
import { selectNextScene } from './scene-selector';

const HO_VIET = [
  'Nguyễn', 'Nguyễn', 'Nguyễn',
  'Trần', 'Trần',
  'Lê', 'Lê',
  'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ',
];

const TEN_NAM = [
  'Văn Hùng', 'Minh Tuấn', 'Quốc Bảo', 'Đức Thắng', 'Quang Huy',
  'Thanh Tùng', 'Thành Đạt', 'Hoàng Nam', 'Hữu Phước', 'Trọng Nghĩa',
];

const TEN_NU = [
  'Thị Lan', 'Thu Hương', 'Ngọc Ánh', 'Thanh Thảo', 'Minh Thư',
  'Hải Yến', 'Phương Linh', 'Kim Ngân', 'Mỹ Duyên', 'Khánh Huyền',
];

const DIA_PHUONG_THEO_VUNG: Record<VungMien, string[]> = {
  bac: ['Hà Nội', 'Nam Định', 'Hải Phòng', 'Bắc Giang', 'Phú Thọ'],
  trung: ['Nghệ An', 'Hà Tĩnh', 'Đà Nẵng', 'Quảng Nam', 'Bình Định'],
  nam: ['TP. Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Cần Thơ', 'Long An'],
};

export function generateInitialLife(seed: number = 1337): LifeState {
  const prng = new PRNG(seed);

  // 1. Vùng miền (Bắc: 35%, Trung: 25%, Nam: 40%)
  const rollVung = prng.range(1, 100);
  let vungMien: VungMien = 'nam';
  if (rollVung <= 35) {
    vungMien = 'bac';
  } else if (rollVung <= 60) {
    vungMien = 'trung';
  } else {
    vungMien = 'nam';
  }
  const diaPhuongPool = DIA_PHUONG_THEO_VUNG[vungMien];
  const diaPhuong = diaPhuongPool[prng.range(0, diaPhuongPool.length - 1)];

  // 2. Tầng lớp xuất thân (Nông thôn: 40%, Lao động đô thị: 45%, Tiểu tư sản: 15%)
  const rollXuatThan = prng.range(1, 100);
  let xuatThan: XuatThan = 'lao_dong_do_thi';
  let tienMat = 4000000;
  let noGiaDinh = 0;
  let tieuSuNgan = '';
  let ngheNghiep = 'Lao động tự do';

  if (rollXuatThan <= 40) {
    xuatThan = 'nong_thon_ngheo';
    tienMat = prng.range(500, 2000) * 1000;
    if (prng.range(1, 100) <= 35) {
      noGiaDinh = prng.range(10, 30) * 1000000;
    }
    ngheNghiep = 'Công nhân phụ kho';
    tieuSuNgan = `Sinh ra trong gia đình thuần nông tại ${diaPhuong}. Bố mẹ làm lụng vất vả, năm 18 tuổi quyết định tự lập kiếm sống.`;
  } else if (rollXuatThan <= 85) {
    xuatThan = 'lao_dong_do_thi';
    tienMat = prng.range(3000, 7000) * 1000;
    if (prng.range(1, 100) <= 20) {
      noGiaDinh = prng.range(5, 15) * 1000000;
    }
    ngheNghiep = 'Nhân viên bán hàng thời vụ';
    tieuSuNgan = `Lớn lên ở khu phố lao động tại ${diaPhuong}. Bố chạy xe, mẹ buôn gánh bán bưng, quen với nhịp mưu sinh chật vật từ nhỏ.`;
  } else {
    xuatThan = 'tieu_tu_san';
    tienMat = prng.range(15000, 35000) * 1000;
    ngheNghiep = 'Học việc văn phòng';
    tieuSuNgan = `Gia đình công chức nhỏ tại ${diaPhuong}. Được chu cấp học hành tử tế, nhưng bắt đầu đối mặt với áp lực kỳ vọng của gia tộc.`;
  }

  // 3. Giới tính & Tên
  const gioiTinh: GioiTinh = prng.range(1, 100) <= 50 ? 'nam' : 'nu';
  const ho = HO_VIET[prng.range(0, HO_VIET.length - 1)];
  const tenPool = gioiTinh === 'nam' ? TEN_NAM : TEN_NU;
  const ten = `${ho} ${tenPool[prng.range(0, tenPool.length - 1)]}`;

  const namSinh = 2004 - prng.range(0, 10); // 1994 - 2004

  const profile: LifeProfile = {
    id: `life_${seed}_${namSinh}`,
    ten,
    gioiTinh,
    namSinh,
    tuoi: 18,
    vungMien,
    diaPhuong,
    xuatThan,
    ngheNghiep,
    tieuSuNgan,
  };

  const stats: LifeStats = {
    tienMat: tienMat - noGiaDinh,
    sucKhoe: prng.range(85, 95),
    tinhThan: prng.range(70, 85),
    quanHe: prng.range(70, 90),
  };

  const axes: LifeAxes = {
    tichLuy: 0,
    sinhLuc: 0,
    congDong: 0,
  };

  const flags: Record<string, boolean | number | string> = {
    [`vung_${vungMien}`]: true,
    [`xuat_than_${xuatThan}`]: true,
    co_no_gia_dinh: noGiaDinh > 0,
    so_no_khoi_diem: noGiaDinh,
  };

  const initialState: LifeState = {
    version: '3.0.0',
    seed,
    turn: 1,
    isGameOver: false,
    profile,
    stats,
    axes,
    flags,
    history: [],
  };

  // Chọn cảnh đầu tiên
  const activeScene = selectNextScene(initialState, prng);

  return {
    ...initialState,
    activeScene,
  };
}
