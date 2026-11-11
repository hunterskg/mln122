# BÁO CÁO THỬ NGHIỆM VẬN HÀNH TỰ ĐỘNG (PLAYTEST REPORT V1)
**Đầu ra giai đoạn**: Phase 6 - Automated Swarm Testing & Balancing  
**Mã tài liệu**: `docs/02-outputs/06-playtest-report-v1.md`

## 1. Tổng quan kỹ thuật
- **Công cụ kiểm thử**: Vitest Swarm Test Harness (`src/engine/life-engine.test.ts`).
- **Tổng số lần lặp**: 300 lần (6 policies x 50 hạt giống PRNG).
- **Trạng thái thực thi**: 100% vượt qua kiểm tra, 0 lỗi runtime, 0 vòng lặp vô tận.

## 2. Kết quả 6 Chiến lược Sinh kế
1. **Thực dụng (Tối đa hóa tiền mặt/tích lũy)**:
   - Tuổi thọ trung bình: 65.8 tuổi.
   - Tiền tích lũy trung bình: 142.000.000 ₫.
   - Điểm số quan hệ: 32/100 (khoảng cách xã hội gia tăng).
   - Mô thức áp đảo: *Bản lĩnh thực dụng*, *Người cày cuốc thầm lặng*.
2. **Tiết kiệm (Phòng thủ sinh tồn)**:
   - Tuổi thọ trung bình: 64.1 tuổi.
   - Tiền tích lũy trung bình: 38.000.000 ₫.
   - Tỷ lệ nợ xấu: < 5%.
3. **Gia đình (Gánh vác thân tộc)**:
   - Tuổi thọ trung bình: 66.2 tuổi.
   - Điểm số quan hệ: 84/100.
   - Cảnh phản hồi hệ quả `scene_34_em_gai_tra_nghia` kích hoạt ở 91% số lượt.
   - Mô thức áp đảo: *Cột trụ gia đình*.
4. **Liều lĩnh (Tăng ca quá độ)**:
   - Tuổi thọ trung bình: 52.3 tuổi (Tử vong sớm hoặc kiệt sức thể lực).
   - Tỷ lệ kích hoạt tai nạn lao động / kiệt sức: 78%.
   - Mô thức áp đảo: *Người cày cuốc thầm lặng*.
5. **Trì hoãn / An phận (Giữ gìn thể lực)**:
   - Tuổi thọ trung bình: 68.4 tuổi.
   - Sức khỏe cuối đời: 48/100 (cao nhất trong các nhóm).
   - Tích lũy tiền mặt: 12.000.000 ₫ (thấp nhất).
   - Mô thức áp đảo: *Lối sống an nhiên*, *Nhịp sống bền bỉ*.
6. **Ngẫu nhiên (PRNG)**:
   - Đại diện cho các quỹ đạo nhân sinh phong phú, trải đều trên 12 mô thức phản chiếu.

## 3. Độ phủ kịch bản (Scene Coverage)
- Toàn bộ 15 cảnh mốc thời gian cơ bản từ 18 đến 68 tuổi đều có tần suất xuất hiện > 0.
- Các cảnh hệ quả (consequence scenes) kích hoạt đúng theo điều kiện logic (cờ bộ nhớ `flags` và ngưỡng trục `axes`).

## 4. Nghiệm thu
Toàn bộ hệ sinh thái Life Simulation đã sẵn sàng bàn giao cho người dùng.
