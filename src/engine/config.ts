import { SupplierState, Industry, GameEvent } from './state';

export const INDUSTRY_CONFIG: Record<
  Industry,
  {
    name: string;
    description: string;
    unitName: string;
    defaultPrice: number;
    defaultCompetitorPrice: number;
    baseRent: number;
    suppliers: SupplierState[];
  }
> = {
  coffee: {
    name: 'Xưởng rang xay Cà phê thủ công',
    description: 'Tốc độ chu chuyển kho nhanh, hàng dễ hỏng, thời gian cung ứng ngắn.',
    unitName: 'Gói cà phê',
    defaultPrice: 18,
    defaultCompetitorPrice: 16,
    baseRent: 1200,
    suppliers: [
      {
        id: 'local_beans',
        name: 'Nhà cung ứng Hạt cà phê Nội địa',
        unitCost: 7,
        quality: 60,
        reliability: 95,
        leadTimeMonths: 0,
        paymentTerms: 'immediate',
        minOrderQuantity: 50,
      },
      {
        id: 'direct_farm',
        name: 'Hợp tác xã Cà phê Cao nguyên Cầu Đất',
        unitCost: 5,
        quality: 85,
        reliability: 80,
        leadTimeMonths: 1,
        paymentTerms: 'net30',
        minOrderQuantity: 200,
      },
      {
        id: 'bulk_importer',
        name: 'Đại lý Nhập khẩu Cà phê Quy mô lớn',
        unitCost: 4,
        quality: 50,
        reliability: 70,
        leadTimeMonths: 2,
        paymentTerms: 'net30',
        minOrderQuantity: 500,
      },
    ],
  },
  apparel: {
    name: 'Thời trang May mặc Bền vững',
    description: 'Biên lợi nhuận trung bình, thời gian giao hàng dài, nhạy cảm với thương hiệu và tiếp thị.',
    unitName: 'Bộ trang phục',
    defaultPrice: 48,
    defaultCompetitorPrice: 45,
    baseRent: 2000,
    suppliers: [
      {
        id: 'domestic_apparel',
        name: 'Xưởng Dệt May Bông Hữu cơ Nội địa',
        unitCost: 22,
        quality: 85,
        reliability: 95,
        leadTimeMonths: 1,
        paymentTerms: 'net30',
        minOrderQuantity: 100,
      },
      {
        id: 'overseas_factory',
        name: 'Nhà máy May gia công Xuất khẩu',
        unitCost: 14,
        quality: 75,
        reliability: 80,
        leadTimeMonths: 2,
        paymentTerms: 'net30',
        minOrderQuantity: 400,
      },
      {
        id: 'discount_express',
        name: 'Xưởng In Nhanh Khu vực',
        unitCost: 28,
        quality: 60,
        reliability: 99,
        leadTimeMonths: 0,
        paymentTerms: 'immediate',
        minOrderQuantity: 25,
      },
    ],
  },
  saas: {
    name: 'Phần mềm Doanh nghiệp B2B (SaaS)',
    description: 'Biên lợi nhuận gộp cao, không hàng tồn kho vật chất, chu kỳ bán hàng dài và quỹ lương lớn.',
    unitName: 'Bản quyền hàng tháng',
    defaultPrice: 250,
    defaultCompetitorPrice: 220,
    baseRent: 3500,
    suppliers: [
      {
        id: 'cloud_infra_standard',
        name: 'Nhà cung cấp Hạ tầng Đám mây Cấp 1',
        unitCost: 35,
        quality: 90,
        reliability: 99,
        leadTimeMonths: 0,
        paymentTerms: 'immediate',
        minOrderQuantity: 10,
      },
      {
        id: 'cloud_infra_baremetal',
        name: 'Cụm Máy chủ Chuyên dụng Cố định',
        unitCost: 20,
        quality: 95,
        reliability: 88,
        leadTimeMonths: 1,
        paymentTerms: 'net30',
        minOrderQuantity: 50,
      },
    ],
  },
};

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'supplier_delay',
    title: 'Nghẽn chuỗi cung ứng vật tư',
    description: 'Sự cố vận tải quốc tế đe dọa làm chậm các lô hàng vật tư đang vận chuyển.',
    options: [
      {
        id: 'air_freight',
        label: 'Vận chuyển hỏa tốc hàng không (Phí 1.200 ₫)',
        impactSummary: 'Tránh trễ hạn; chi thêm phí vận chuyển khẩn cấp.',
      },
      {
        id: 'accept_delay',
        label: 'Chấp nhận trễ hạn (+1 Tháng)',
        impactSummary: 'Tiết kiệm tiền mặt; hàng về chậm 1 tháng, nguy cơ đứt hàng.',
      },
    ],
  },
  {
    id: 'employee_headhunter',
    title: 'Nhân sự chủ chốt bị chèo kéo',
    description: 'Đối thủ cạnh tranh đưa ra lời mời hấp dẫn nhằm lôi kéo nhân sự nòng cốt.',
    options: [
      {
        id: 'match_salary',
        label: 'Tăng lương cạnh tranh (+20% Lương)',
        impactSummary: 'Giữ chân nhân tài, tăng lòng trung thành; tăng chi phí lương hàng tháng.',
      },
      {
        id: 'wish_luck',
        label: 'Để nhân viên rời đi',
        impactSummary: 'Tiết kiệm quỹ lương; tinh thần đội ngũ giảm -15 và giảm công suất.',
      },
    ],
  },
  {
    id: 'viral_pr',
    title: 'Hiệu ứng lan tỏa mạng xã hội',
    description: 'Một người có tầm ảnh hưởng bất ngờ giới thiệu và khen ngợi sản phẩm của bạn.',
    options: [
      {
        id: 'boost_ads',
        label: 'Đẩy mạnh quảng cáo (Chi phí 800 ₫)',
        impactSummary: 'Chi ngân sách tiếp thị; tăng vọt uy tín thương hiệu và nhu cầu +50%.',
      },
      {
        id: 'organic',
        label: 'Tận dụng đà lan tỏa tự nhiên',
        impactSummary: 'Không tốn tiền mặt; tăng trưởng nhu cầu tự nhiên +20%.',
      },
    ],
  },
  {
    id: 'equipment_upgrade',
    title: 'Cơ hội tự động hóa quy trình',
    description: 'Một công cụ phần mềm tự động hóa vận hành đang có sẵn cho doanh nghiệp của bạn.',
    options: [
      {
        id: 'invest_tools',
        label: 'Đầu tư công nghệ (2.000 ₫ một lần)',
        impactSummary: 'Tăng vĩnh viễn năng lực sản xuất của lao động vận hành thêm +20%.',
      },
      {
        id: 'decline_tools',
        label: 'Tạm hoãn đầu tư',
        impactSummary: 'Bảo toàn lượng tiền mặt dự trữ.',
      },
    ],
  },
];
