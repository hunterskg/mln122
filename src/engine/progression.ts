import { GameState } from './state';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  isUnlocked: (state: GameState) => boolean;
}

export interface Achievement {
  id: string;
  name: string;
  category: 'finance' | 'scale' | 'operations' | 'prestige';
  description: string;
  rewardText: string;
  check: (state: GameState) => boolean;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'first_10k_rev',
    title: 'Lực đẩy thương mại ban đầu',
    description: 'Vượt mốc 10.000 ₫ tổng doanh thu trong một tháng kinh doanh.',
    isUnlocked: (state) => (state.history.financials[state.history.financials.length - 1]?.revenue || 0) >= 10000,
  },
  {
    id: 'first_profitable_turn',
    title: 'Điểm hòa vốn & Bắt đầu có lãi',
    description: 'Tạo ra lợi nhuận ròng dương trong một tháng vận hành.',
    isUnlocked: (state) => (state.history.financials[state.history.financials.length - 1]?.netIncome || 0) > 0,
  },
  {
    id: 'team_scale_5',
    title: 'Mở rộng tổ chức lao động',
    description: 'Mở rộng quy mô đội ngũ nhân sự lên tối thiểu 5 thành viên.',
    isUnlocked: (state) => state.employees.length >= 5,
  },
  {
    id: 'brand_reputation_80',
    title: 'Thương hiệu uy tín',
    description: 'Đạt điểm uy tín thương hiệu từ 80 điểm trở lên trên thị trường.',
    isUnlocked: (state) => state.market.reputation >= 80,
  },
  {
    id: 'cash_cushion_100k',
    title: 'Pháo đài thanh khoản',
    description: 'Tích lũy được trên 100.000 ₫ tiền mặt dự trữ lưu động.',
    isUnlocked: (state) => state.financial.cash >= 100000,
  },
  {
    id: 'three_year_survival',
    title: 'Bền bỉ 3 năm trên thương trường',
    description: 'Hoàn thành trọn vẹn cả 36 tháng chu kỳ điều hành doanh nghiệp.',
    isUnlocked: (state) => state.turn >= 36,
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_cash_flow_positive',
    name: 'Bậc thầy dòng tiền',
    category: 'finance',
    description: 'Đạt 3 tháng liên tiếp có dòng lưu chuyển tiền tệ ròng dương.',
    rewardText: 'Chứng minh năng lực thanh khoản thực tế quan trọng hơn doanh thu ảo.',
    check: (state) => {
      const fin = state.history.financials.slice(-3);
      return fin.length >= 3 && fin.every((f) => f.netCashFlow > 0);
    },
  },
  {
    id: 'ach_zero_debt_champion',
    name: 'Tự chủ tài chính',
    category: 'finance',
    description: 'Tồn tại ít nhất 12 tháng liên tục mà không có dư nợ ngân hàng.',
    rewardText: 'Sở hữu doanh nghiệp độc lập, không chịu áp lực lãi vay tư bản.',
    check: (state) => state.turn >= 12 && state.financial.debt === 0,
  },
  {
    id: 'ach_high_satisfaction',
    name: 'Khách hàng tín nhiệm',
    category: 'prestige',
    description: 'Đạt mức độ thỏa mãn khách hàng từ 90% trở lên.',
    rewardText: 'Giá trị sử dụng của hàng hóa đáp ứng xuất sắc nhu cầu xã hội.',
    check: (state) => state.market.customerSatisfaction >= 90,
  },
  {
    id: 'ach_scaleup_capacity',
    name: 'Quy mô sản xuất vượt trội',
    category: 'operations',
    description: 'Đạt sản lượng bán hàng vượt trên 1.500 đơn vị sản phẩm trong một tháng.',
    rewardText: 'Năng lực vận hành và phân phối đạt hiệu quả theo quy mô lớn.',
    check: (state) => {
      const rep = state.lastReport;
      return !!rep && rep.unitsSold >= 1500;
    },
  },
  {
    id: 'ach_unicorn_status',
    name: 'Kỳ lân thương nghiệp',
    category: 'scale',
    description: 'Đạt định giá doanh nghiệp vượt mức 10.000.000 ₫.',
    rewardText: 'Đỉnh cao của tích lũy tư bản và giá trị vốn hóa doanh nghiệp.',
    check: (state) => {
      const totalRev = state.history.financials.reduce((a, b) => a + b.revenue, 0);
      return Math.round(totalRev * 1.5 + Math.max(0, state.financial.cash)) >= 10000000;
    },
  },
];
