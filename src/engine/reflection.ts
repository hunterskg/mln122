import { LifeState } from './life-types';
import { formatCurrency } from '@/lib/utils';

export interface ReflectionPattern {
  id: string;
  tenMoThuc: string;
  moTaNgan: string;
  dieuKien: (state: LifeState) => boolean;
  tinhDiemUuTien: (state: LifeState) => number;
  sinhVanBan: (state: LifeState) => string;
  gocTrietHoc?: string;
}

export interface LifeReflectionReport {
  tieuDeCuocDoi: string;
  moThucChinh: {
    ten: string;
    moTaNgan: string;
    doanNhinLai: string;
  }[];
  cauHoiMo: string;
  gocKinhTeChinhTri: string;
}

export const REFLECTION_PATTERNS: ReflectionPattern[] = [
  {
    id: 'pat_cay_cuoc_than_the',
    tenMoThuc: 'Người cày cuốc thầm lặng',
    moTaNgan: 'Đánh đổi sinh lực thể xác lấy tích lũy vật chất cho ngày sau.',
    dieuKien: (state) => state.axes.tichLuy >= 20 && state.axes.sinhLuc <= -20,
    tinhDiemUuTien: (state) => Math.abs(state.axes.tichLuy) + Math.abs(state.axes.sinhLuc) + 20,
    sinhVanBan: (state) =>
      `Bạn bước qua đời người như một con ong thợ cần mẫn tại ${state.profile.diaPhuong}. Những ca làm đêm rã rời, những lần nén cơn đau lưng để tiếp tục cầm vô lăng hay đứng máy đã giúp bạn tích lũy được ${formatCurrency(Math.max(0, state.stats.tienMat))}. Bạn đã hoàn thành bổn phận của một người lao động kiên cường, dẫu thân thể mang đầy vết hằn của sự hao mòn sinh học mà tiền bạc khó lòng mua lại được.`,
    gocTrietHoc: 'Quy luật bóc lột giá trị thặng dư tuyệt đối và hao mòn sức lao động.',
  },
  {
    id: 'pat_tru_cot_hy_sinh',
    tenMoThuc: 'Cột trụ gia đình',
    moTaNgan: 'Luôn đặt người thân và trách nhiệm gia đình lên trên ước mơ cá nhân.',
    dieuKien: (state) => state.axes.congDong >= 25,
    tinhDiemUuTien: (state) => state.axes.congDong * 1.5,
    sinhVanBan: (state) =>
      `Trong mắt gia đình và họ hàng, bạn là điểm tựa vững chãi nhất. Dù có những lúc ví tiền cạn kiệt hay phải gác lại việc riêng, bạn chưa từng chối từ khi người thân cần giúp đỡ. Tình nghĩa họ hàng và sự ấm êm của mái nhà chính là gia tài lớn nhất mà bạn để lại cho đời, dẫu đôi khi bạn phải âm thầm nuốt những trăn trở riêng vào trong.`,
    gocTrietHoc: 'Tính xã hội của sức lao động và sự tương trợ trong cộng đồng lao động.',
  },
  {
    id: 'pat_thanh_than_an_nhien',
    tenMoThuc: 'Lối sống an nhiên',
    moTaNgan: 'Không màng tích lũy của cải, coi trọng sự bình an trong tâm hồn.',
    dieuKien: (state) => state.axes.tichLuy <= -15 && state.stats.tinhThan >= 60,
    tinhDiemUuTien: (state) => Math.abs(state.axes.tichLuy) + state.stats.tinhThan,
    sinhVanBan: (state) =>
      `Bạn không để đồng tiền trói buộc đôi chân mình. Giữa guồng quay hối hả của cơm áo gạo tiền, bạn luôn biết dừng lại đúng lúc để lắng nghe hơi thở bản thân và chia sẻ bữa cơm ấm với bạn bè. Bạn có thể không để lại những khối tài sản đồ sộ, nhưng bạn đã sống từng ngày trọn vẹn không tiếc nuối.`,
    gocTrietHoc: 'Giá trị sử dụng của đời sống tinh thần vượt lên trên sự sùng bái hàng hóa tiền tệ.',
  },
  {
    id: 'pat_thuc_dung_song_sot',
    tenMoThuc: 'Bản lĩnh thực dụng',
    moTaNgan: 'Tính toán thiệt hơn sắc bén để sinh tồn giữa thương trường khắc nghiệt.',
    dieuKien: (state) => state.axes.tichLuy >= 25 && state.axes.congDong <= -15,
    tinhDiemUuTien: (state) => state.axes.tichLuy + Math.abs(state.axes.congDong) + 15,
    sinhVanBan: (state) =>
      `Xuất phát từ hoàn cảnh chật vật, bạn sớm hiểu rằng không ai có thể cứu mình ngoài chính bản thân. Bạn tỉnh táo trước mọi lời rủ rê, dứt khoát cắt bỏ những gánh nặng không cần thiết để bảo vệ tài chính cá nhân. Sự thực tế ấy đã giúp bạn không bao giờ rơi vào cảnh túng quẫn, dẫu đôi khi trong căn phòng rộng, bạn thoáng thấy một khoảng trống cô đơn.`,
    gocTrietHoc: 'Quy luật cạnh tranh và áp lực tích lũy tư bản cá thể.',
  },
  {
    id: 'pat_vong_xoay_no_nan',
    tenMoThuc: 'Vòng xoáy gánh nợ',
    moTaNgan: 'Vật lộn không ngừng với các áp lực tài chính và bẫy tín dụng sinh tồn.',
    dieuKien: (state) => state.stats.tienMat < 0 || Boolean(state.flags['no_chong_no']),
    tinhDiemUuTien: (state) => 60,
    sinhVanBan: (state) =>
      `Cuộc đời đặt lên vai bạn những bài toán chi tiêu quá ngặt nghèo ngay từ vạch xuất phát. Mỗi đồng tiền làm ra dường như đều có địa chỉ phải trả trước khi kịp ấm túi. Bạn đã chiến đấu đến cùng trước những con số nợ nần và lãi phạt, cho thấy sức bền kinh ngạc của một con người bình dân trước sóng gió đời sống.`,
    gocTrietHoc: 'Sự phụ thuộc vào tư bản cho vay và bẫy tín dụng tiêu dùng đối với người lao động.',
  },
  {
    id: 'pat_giu_gin_pham_gia',
    tenMoThuc: 'Người giữ trọn chữ tín',
    moTaNgan: 'Kiên quyết từ chối gian dối thương trường để bảo toàn lương tâm.',
    dieuKien: (state) => Boolean(state.flags['giu_pham_gia_buon_ban'] || state.flags['hoi_cai_lam_an']),
    tinhDiemUuTien: (state) => 45,
    sinhVanBan: (state) =>
      `Dù có những thời điểm bát cơm mưu sinh bị đe dọa, bạn đã chọn con đường không hổ thẹn với lương tâm. Bạn từ chối dùng hóa chất độc hại, từ chối lừa dối người tiêu dùng. Có thể số tiền bạn kiếm được không bằng người khác, nhưng mỗi đồng bạn tiêu đều mang sự thanh thản vô giá.`,
    gocTrietHoc: 'Hai thuộc tính của hàng hóa: Giá trị sử dụng đích thực bảo vệ phẩm giá người sản xuất.',
  },
  {
    id: 'pat_song_vi_the_he_sau',
    tenMoThuc: 'Bậc sinh thành tận tụy',
    moTaNgan: 'Dồn hết gia tài và mồ hôi cho tương lai của con cái.',
    dieuKien: (state) => Boolean(state.flags['doc_long_vi_con']),
    tinhDiemUuTien: (state) => 50,
    sinhVanBan: (state) =>
      `Khoản tiền dưỡng già cuối cùng bạn cũng dành trọn cho con cái bước vào đời. Bạn chấp nhận sự bấp bênh của tuổi xế chiều để thế hệ sau có cơ hội đứng cao hơn mình một bậc. Tình thương ấy là sự tiếp nối bất tận của dòng chảy nhân sinh.`,
    gocTrietHoc: 'Tái sản xuất sức lao động liên thế hệ trong điều kiện kinh tế khó khăn.',
  },
  {
    id: 'pat_nhip_song_ben_bi',
    tenMoThuc: 'Nhịp sống bền bỉ',
    moTaNgan: 'Tôn trọng giới hạn sinh học, không bán rẻ sức khỏe lấy tăng ca.',
    dieuKien: (state) => state.axes.sinhLuc >= 20 && state.stats.sucKhoe >= 65,
    tinhDiemUuTien: (state) => state.axes.sinhLuc + 25,
    sinhVanBan: (state) =>
      `Giữa lúc người xung quanh hối hả vắt kiệt sức lực vào những ca làm xuyên đêm, bạn chọn giữ lấy nhịp sống điều độ. Nhờ biết lắng nghe tiếng kêu cứu của cơ thể, đến tuổi ${state.profile.tuoi} bạn vẫn giữ được tinh thần minh mẫn và đôi chân vững vàng.`,
    gocTrietHoc: 'Bảo toàn giá trị sức lao động trước nguy cơ hao mòn quá độ.',
  },
  {
    id: 'pat_buoc_chan_ly_huong',
    tenMoThuc: 'Bước chân ly hương',
    moTaNgan: 'Rời quê nhà từ thuở đôi mươi để tìm cơ hội nơi khu công nghiệp đô thị.',
    dieuKien: (state) => Boolean(state.flags['ly_huong']),
    tinhDiemUuTien: (state) => 38,
    sinhVanBan: (state) =>
      `Chuyến xe rời ${state.profile.diaPhuong} năm 18 tuổi đã mở ra những tháng ngày lăn lộn ở dãy trọ chật hẹp. Bạn quen với tiếng còi ca máy, quen với những cái Tết gói ghém gửi quà về quê, trở thành một phần lặng lẽ nhưng không thể thiếu của dòng người lao động nhập cư.`,
    gocTrietHoc: 'Quá trình di dịch lao động nông thôn ra đô thị trong công nghiệp hóa.',
  },
  {
    id: 'pat_re_bam_dat_que',
    tenMoThuc: 'Rễ bám đất quê',
    moTaNgan: 'Từ chối dòng xoáy đô thị để ở lại mảnh đất quê hương chăm lo người thân.',
    dieuKien: (state) => Boolean(state.flags['o_lai_que']),
    tinhDiemUuTien: (state) => 38,
    sinhVanBan: (state) =>
      `Bạn chọn ở lại ${state.profile.diaPhuong} dẫu biết đồng tiền kiếm được không nhiều. Đổi lại cho sự chật vật kinh tế là những bữa cơm chiều đầy đủ thành viên, là sự hiện diện kịp thời bên người thân mỗi lúc trái gió trở trời.`,
    gocTrietHoc: 'Mối quan hệ giữa tái sản xuất cộng đồng nông thôn và thu nhập sinh kế.',
  },
  {
    id: 'pat_tam_luoi_an_sinh',
    tenMoThuc: 'Tấm lưới phòng thân',
    moTaNgan: 'Ưu tiên an sinh dài hạn và bảo hiểm hơn tiền mặt cầm tay ngắn hạn.',
    dieuKien: (state) => Boolean(state.flags['co_bhxh']),
    tinhDiemUuTien: (state) => 35,
    sinhVanBan: (state) =>
      `Từ sớm bạn đã chấp nhận trích một phần tiền lương ít ỏi để đóng bảo hiểm xã hội. Quyết định ấy giúp bạn tránh được nhiều cú sốc viện phí bất ngờ và có được sự chủ động nhất định khi bước qua sườn dốc tuổi lao động.`,
    gocTrietHoc: 'Vai trò của quỹ bảo hiểm xã hội trong việc tái sản xuất sức lao động.',
  },
  {
    id: 'pat_ban_tay_tho_lanh_nghe',
    tenMoThuc: 'Bàn tay thợ lành nghề',
    moTaNgan: 'Kiên trì chịu khổ học nghề ban đầu để tạo năng lực tự chủ dài lâu.',
    dieuKien: (state) => Boolean(state.flags['co_tay_nghe']),
    tinhDiemUuTien: (state) => 42,
    sinhVanBan: (state) =>
      `Những ngày tháng ăn mì gói phụ việc trong xưởng ${state.profile.ngheNghiep} thuở mười tám đã trui rèn cho bạn cái nghề vững chắc trong tay. Khi thị trường biến động, chính tay nghề kỹ thuật chuyên môn chứ không phải sức bắp đã giúp bạn đứng vững.`,
    gocTrietHoc: 'Chuyển hóa từ lao động giản đơn sang lao động phức tạp tạo giá trị cao hơn.',
  },
];

export function evaluateReflection(state: LifeState): LifeReflectionReport {
  // Đánh giá tất cả mô thức phù hợp
  const eligible = REFLECTION_PATTERNS.filter((p) => p.dieuKien(state));

  // Sắp xếp theo điểm ưu tiên giảm dần
  eligible.sort((a, b) => b.tinhDiemUuTien(state) - a.tinhDiemUuTien(state));

  // Lấy tối đa 3 mô thức nổi bật nhất
  const topPatterns = eligible.slice(0, 3);

  // Nếu không trúng mô thức nào đặc biệt (trường hợp cân bằng), dùng fallback
  if (topPatterns.length === 0) {
    topPatterns.push(REFLECTION_PATTERNS[2]); // Lối sống an nhiên
  }

  const moThucChinh = topPatterns.map((p) => ({
    ten: p.tenMoThuc,
    moTaNgan: p.moTaNgan,
    doanNhinLai: p.sinhVanBan(state),
  }));

  // Tạo câu hỏi mở không có đáp án đúng/sai
  let cauHoiMo = 'Nếu có cơ hội bước lại từ tuổi mười tám với số phận ấy, bạn sẽ chọn giữ gìn sức khỏe cho bản thân hay tiếp tục dốc lòng vì những người thân yêu?';
  if (state.axes.tichLuy > 30) {
    cauHoiMo = 'Khi nhìn lại số của cải đã gom góp được, điều bạn nhớ nhất là những con số trong sổ tiết kiệm, hay là những khoảnh khắc ấm áp bên người thân?';
  } else if (state.axes.congDong > 30) {
    cauHoiMo = 'Sống trọn một đời vì gia đình và chòm xóm, liệu trong sâu thẳm bạn có bao giờ nuối tiếc một ước mơ riêng chưa từng được cất cánh?';
  }

  // Góc nhìn kinh tế chính trị ngắn gọn (1-2 câu tham chiếu)
  const gocKinhTeChinhTri =
    'Một góc nhìn để chiêm nghiệm: Dưới lăng kính Kinh tế chính trị Mác - Lênin, mỗi lựa chọn sinh kế của bạn không chỉ là tính cách cá nhân, mà là sự phản ánh trực tiếp của vị trí người lao động trước áp lực sinh tồn, tích lũy và quan hệ phân phối trong xã hội.';

  const tieuDeCuocDoi = `${state.profile.ten} (${state.profile.namSinh} - ${state.profile.namSinh + state.profile.tuoi})`;

  return {
    tieuDeCuocDoi,
    moThucChinh,
    cauHoiMo,
    gocKinhTeChinhTri,
  };
}
