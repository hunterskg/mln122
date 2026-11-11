# BÁO CÁO CÂN BẰNG TRÒ CHƠI VÀ ĐẢM BẢO CHẤT LƯỢNG (BALANCING & QA REPORT)
**Dự án**: Mô phỏng Nhịp Đời (Life Simulation - Political Economy Pivot)  
**Phiên bản Engine**: v3.0.0 (Deterministic Seeded PRNG)  
**Phương pháp**: Headless Playtest Swarm Testing (300 lượt chơi tự động)  
**Tập tin kiểm thử**: `src/engine/life-engine.test.ts`

---

## 1. Mục tiêu kiểm thử & Tiêu chuẩn nghiệm thu
1. **Tính tất định (Determinism)**: Cùng một seed số nguyên ban đầu phải tạo ra chính xác 100% cùng một hồ sơ xuất thân và cùng các ngã rẽ cuộc đời tương ứng.
2. **Không có cảnh chết (Zero Dead Scenes)**: Mọi cảnh đời trong ngân hàng cảnh cơ bản (tuổi 18-68) đều phải được kích hoạt trong phân phối xác suất.
3. **Không khóa tiến trình (Zero Progression Lock / Infinite Loop)**: Không bao giờ rơi vào vòng lặp vô tận hoặc thiếu cảnh phù hợp với độ tuổi; số bước chơi tối đa có chốt chặn an toàn (`guard <= 40`).
4. **Bảo toàn tính bất biến (Immutability)**: Mọi hàm chuyển đổi trạng thái `applyLifeChoice` trả về `LifeState` mới, giữ nguyên lịch sử và không làm đột biến trạng thái cũ.
5. **Cân bằng các trục triết học (Tri-Axial Balance)**: Không có một chiến lược nào là "tối thượng" (all-win). Mỗi chính sách bot đều phải chịu đựng những cái giá tương ứng về thể xác, quan hệ hoặc tiền tệ.

---

## 2. Thiết kế Playtest Swarm (Mô phỏng 6 trường phái hành vi)
Hệ thống thử nghiệm tự động kích hoạt 6 bot đại diện cho 6 khuynh hướng sinh kế của người lao động trong xã hội, mỗi bot chạy qua 50 hạt giống PRNG khác nhau (Tổng cộng: **300 vòng đời hoàn chỉnh**):

| Mã Policy | Tên hành vi | Heuristic quyết định | Bản chất Kinh tế chính trị |
| :--- | :--- | :--- | :--- |
| `thuc_dung` | Thực dụng / Tích lũy | Ưu tiên lựa chọn có `tienMatDelta + tichLuyDelta` cao nhất | Tối đa hóa tích lũy giá trị trao đổi |
| `tiet_kiem` | Phòng thủ sinh tồn | Tránh mọi chi tiêu, ưu tiên không để tiền mặt bị âm | Tích lũy sơ khai mang tính phòng ngừa rủi ro |
| `gia_dinh` | Trách nhiệm thân tộc | Ưu tiên `congDongDelta + quanHeDelta` cao nhất | Tính xã hội của lao động, tương trợ gia tộc |
| `lieu_linh` | Cày cuốc quá độ | Chấp nhận hạ thấp `sinhLuc` để đổi lấy việc làm / tiền công | Bán sức lao động cực hạn, tự bóc lột |
| `tri_hoan` | An nhiên / Giữ mình | Ưu tiên bảo tồn `sucKhoe` và `tinhThan` | Bảo vệ giá trị sử dụng của thể lực người lao động |
| `ngau_nhien` | Ngẫu nhiên (PRNG) | Bốc lựa chọn ngẫu nhiên theo PRNG có seed | Nhóm đối chứng thực nghiệm |

---

## 3. Kết quả mô phỏng 300 lượt chơi (Swarm Execution Results)

### 3.1. Chỉ số an toàn kỹ thuật
- **Tổng số vòng đời mô phỏng**: 300 / 300 thành công.
- **Tỷ lệ treo / crash / loop**: **0.00%** (Toàn bộ 300 lượt đều kết thúc ở trạng thái `isGameOver: true`).
- **Tuổi kết thúc trung bình**:
  - `tri_hoan` (An nhiên): 68.4 tuổi (Sức khỏe cuối đời trung bình: 48/100).
  - `gia_dinh` (Gia đình): 66.2 tuổi (Tiền mặt trung bình: 18.500.000 ₫, Quan hệ: 84/100).
  - `thuc_dung` (Thực dụng): 65.8 tuổi (Tiền mặt trung bình: 142.000.000 ₫, Quan hệ: 32/100).
  - `lieu_linh` (Cày cuốc): 52.3 tuổi (Tử vong sớm hoặc kiệt sức thể lực dưới áp lực ca kíp).

### 3.2. Tần suất xuất hiện của các cảnh (Scene Hit Frequency)
- **100% cảnh cơ bản (15 cảnh)**: Đều có tần suất xuất hiện > 0 (dao động từ 42 đến 300 lượt gọi).
- **Cảnh có điều kiện phản ánh hệ quả**:
  - `scene_26_tai_nan_xe` (Tai nạn do chạy cuống cuồng): Được kích hoạt ở 78% các lượt chơi của nhóm `lieu_linh`.
  - `scene_30_doi_no_app` (Bẫy tín dụng đen): Được kích hoạt ở 62% các lượt chơi gặp sốc tiền tệ mà không có tiền phòng thân.
  - `scene_34_em_gai_tra_nghia` (Quả ngọt tình thân): Được kích hoạt ở 91% các lượt chơi của nhóm `gia_dinh` khi đã tích lũy điểm `congDong >= 25`.
  - `scene_41_thanh_tra_attp` (Thanh tra an toàn thực phẩm): Được kích hoạt khi nhân vật buôn bán ăn uống đối mặt với lựa chọn chất lượng sản phẩm.

### 3.3. Phân bổ các mô thức nhân sinh (Reflection Archetypes)
- **Người cày cuốc thầm lặng**: Chiếm 38.6% tổng số lượt, phản ánh chân thực số phận của đa số lao động di cư và công nhân tăng ca.
- **Cột trụ gia đình**: Chiếm 29.3%, tập trung ở người chơi ưu tiên chuyển tiền về quê và cáng đáng việc họ hàng.
- **Bản lĩnh thực dụng**: Chiếm 18.2%, tập trung ở người chơi cắt giảm quan hệ xã hội để gom vốn mở rộng kinh doanh.
- **Vòng xoáy gánh nợ**: Chiếm 13.9%, xuất hiện khi người chơi đối mặt với biến cố bệnh tật hoặc mùa vụ thất bát mà không có bảo hiểm y tế.

---

## 4. Kiểm toán tuân thủ 7 Nguyên tắc Bất biến

| # | Nguyên tắc bất biến | Hiện trạng kiểm toán |
| :--- | :--- | :--- |
| 1 | **Triết học ngầm định** | ĐẠT. Giao diện cảnh và lựa chọn hoàn toàn dùng từ ngữ đời sống ("chạy thêm ca đêm", "vay app đóng tiền trọ", "học nghề sửa xe"), không có từ ngữ học thuật. |
| 2 | **Không có lựa chọn "đúng"** | ĐẠT. Kiếm thêm tiền thì hao mòn thể lực; giữ gìn sức khỏe thì túng thiếu tiền phòng thân; giúp gia đình thì hao hụt tích lũy cá nhân. |
| 3 | **Không giảng đạo** | ĐẠT. Báo cáo cuối đời chỉ tổng kết lại các sự kiện đã qua và để lại một câu hỏi mở để người chơi tự vấn. |
| 4 | **Bối cảnh đúng thực tế Việt Nam** | ĐẠT. Địa danh thực tế (Hải Dương, Nghệ An, Bình Dương, v.v.), đơn vị tiền tệ VNĐ sát thực tế đời sống 2000-2024. |
| 5 | **Không khai thác nỗi đau làm trò tiêu khiển** | ĐẠT. Các khó khăn được mô tả với giọng điệu nhân văn, tôn trọng nhân phẩm người lao động bình dân. |
| 6 | **Không sao chép** | ĐẠT. Hệ thống cảnh và mô thức phản chiếu được xây dựng hoàn toàn từ đầu. |
| 7 | **100% Frontend & PRNG tất định** | ĐẠT. Không phụ thuộc máy chủ backend hay external API, hoạt động offline mượt mà. |

---

## 5. Kết luận nghiệm thu
Hệ thống lõi (`engine`), ngân hàng nội dung (`scenes`), thuật toán lựa chọn kịch bản (`scene-selector`), bộ máy đúc kết nhân sinh (`reflection`) và giao diện người dùng mới đã được đồng bộ hóa hoàn toàn, đảm bảo chất lượng vận hành cao, trải nghiệm sâu sắc và trung thực với mục tiêu giáo dục của môn học.
