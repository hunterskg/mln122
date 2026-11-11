# MÔ HÌNH THẾ GIỚI & NHÂN KHẨU HỌC VIỆT NAM (WORLD MODEL)

Mọi thông số và bảng xác suất phục vụ `life-generator.ts` (bốc cuộc đời bằng `engine/rng.ts`).

---

## 1. Bảng xác suất sinh ra (Birth Lottery)

### 1.1. Vùng miền (`vung_mien`)
| Vùng miền | Tỷ trọng | Địa danh đại diện (`dia_phuong`) | Đặc trưng kinh tế - đời sống |
| :--- | :---: | :--- | :--- |
| `bac` (Miền Bắc) | 35% | Hà Nội, Hải Phòng, Nam Định, Bắc Giang, Phú Thọ | Trọng bằng cấp/biên chế, áp lực thể diện họ hàng, tiết kiệm phòng thân cao. |
| `trung` (Miền Trung) | 25% | Nghệ An, Hà Tĩnh, Đà Nẵng, Quảng Nam, Bình Định | Chi tiêu dè sẻn, thiên tai bão lũ rủi ro tài sản, ý chí vượt khó mạnh, hay ly hương làm ăn. |
| `nam` (Miền Nam) | 40% | TP.HCM, Bình Dương, Đồng Nai, Cần Thơ, Long An | Năng động, dễ xoay nghề buôn bán nhỏ/dịch vụ, chi phí sinh hoạt đô thị đắt đỏ, cởi mở hơn. |

### 1.2. Tầng lớp xuất thân (`xuat_than`)
| Tầng lớp | Tỷ trọng | Tiền mặt khởi điểm tuổi 18 (VNĐ) | Nợ gia đình khởi điểm | Hỗ trợ học vấn / Quan hệ |
| :--- | :---: | :--- | :--- | :--- |
| `nong_thon_ngheo` (Nông thôn / Làm thuê) | 40% | 500.000 - 2.000.000 ₫ | 0 - 30.000.000 ₫ (xác suất 35%) | Tự lập sớm từ 18 tuổi, có thể phải gửi tiền về phụ giúp cha mẹ/em nhỏ. |
| `lao_dong_do_thi` (Công nhân / Buôn bán nhỏ) | 45% | 3.000.000 - 8.000.000 ₫ | 0 - 15.000.000 ₫ (xác suất 15%) | Ở nhà trọ hoặc nhà hẻm nhỏ, đủ ăn đủ mặc, biến cố bệnh tật dễ làm hụt hơi. |
| `tieu_tu_san` (Công chức / Hộ kinh doanh khá) | 15% | 20.000.000 - 50.000.000 ₫ | 0 ₫ | Có nền tảng học đại học, có xe máy sẵn, mạng lưới quan hệ nghề nghiệp tốt hơn. |

### 1.3. Giới tính & Tên nhân vật
- `gioi_tinh`: `nam` (50%), `nu` (50%)
- **Họ phổ biến:** Nguyễn (38%), Trần (12%), Lê (10%), Phạm (7%), Hoàng/Huỳnh (6%), Phan (5%), Vũ/Võ (5%), Đặng (4%), Bùi (4%), Đỗ (4%), Hồ (3%), Ngô (2%).
- **Tên đệm + Tên nam:** Văn Hùng, Minh Tuấn, Quốc Bảo, Đức Thắng, Quang Huy, Thanh Tùng, Thành Đạt, Hoàng Nam, Hữu Phước, Trọng Nghĩa.
- **Tên đệm + Tên nữ:** Thị Lan, Thu Hương, Ngọc Ánh, Thanh Thảo, Minh Thư, Hải Yến, Phương Linh, Kim Ngân, Mỹ Duyên, Khánh Huyền.

---

## 2. Nhịp sống, Tuổi tác & Nghề nghiệp (Age & Career Brackets)

Một lượt chơi là một **cảnh quyết định (Scene)** trải dài qua 5 giai đoạn cuộc đời (tổng 14-18 cảnh/đời để chơi trọn 1 đời trong 5-8 phút):

| Giai đoạn | Độ tuổi | Trọng tâm sinh kế | Nghề nghiệp phổ biến theo đường đời |
| :--- | :--- | :--- | :--- |
| 1. Khởi đầu | 18 - 22 | Định hướng nghề nghiệp, rời quê hay ở lại, tự lập | Sinh viên đi làm thêm, Công nhân KCN, Phụ việc học nghề, Chạy giao hàng |
| 2. Lập thân | 23 - 29 | Áp lực tiền trọ, tăng ca, bẫy tín dụng, tích lũy đầu tiên | Thợ điện lạnh/cơ khí, Nhân viên văn phòng, Tài xế công nghệ, Bán hàng online |
| 3. Gánh vác | 30 - 42 | Gia đình, con cái, mở tiệm nhỏ hay làm thuê ổn định | Chủ quán ăn/tiệm tạp hóa, Tổ trưởng sản xuất, Kế toán/Nhân sự, Thợ lành nghề |
| 4. Trung niên | 43 - 55 | Bệnh tật bắt đầu xuất hiện, con lớn vào đời, biến động nghề | Lao động tự do trung niên, Chủ xưởng nhỏ, Nhân viên lâu năm đối mặt cắt giảm |
| 5. Xế chiều | 56 - 68 | Sức khỏe suy giảm, lương hưu vs tiếp tục mưu sinh, nhìn lại | Nghỉ hưu (nếu có BHXH), Bán nước/giữ xe, Trông cháu, Sống bằng tiền tích lũy |

---

## 3. Mặt bằng Thu nhập & Chi phí thực tế Việt Nam (2020-2026)

- **Chi phí cơ bản (VNĐ/tháng):**
  - Phòng trọ bình dân (Hà Nội / TP.HCM): 2.000.000 - 3.500.000 ₫ (đã gồm điện nước).
  - Ăn uống tằn tiện tự nấu: 2.000.000 - 3.000.000 ₫/tháng.
  - Đám cưới / ma chay / hiếu hỉ họ hàng: 500.000 - 2.000.000 ₫/lần.
  - Viện phí nội trú có BHYT: 1.500.000 - 5.000.000 ₫; không BHYT: 10.000.000 - 30.000.000 ₫.
- **Thu nhập tham chiếu (VNĐ/tháng):**
  - Lao động phổ thông / Phục vụ / Công nhân cơ bản: 6.000.000 - 8.500.000 ₫.
  - Công nhân tăng ca nặng / Tài xế công nghệ chạy 12h: 10.000.000 - 14.000.000 ₫.
  - Thợ kỹ thuật lành nghề / Văn phòng có kinh nghiệm: 12.000.000 - 20.000.000 ₫.
  - Buôn bán nhỏ / Chủ tiệm: Lãi 8.000.000 - 25.000.000 ₫ (nhưng có rủi ro thua lỗ âm vốn).

---

## 4. Quy tắc tính cái chết & Kết thúc cuộc đời
- **Tuổi thọ tối đa thông thường:** 65 - 75 tuổi (tuổi càng cao, xác suất kích hoạt biến cố sức khỏe càng lớn).
- **Chết sớm / Dừng hành trình do kiệt sức:** Nếu `suc_khoe <= 0` ở bất kỳ giai đoạn nào -> kích hoạt cảnh kết thúc (bệnh nặng hoặc kiệt quệ y tế), chuyển thẳng sang màn hình Nhìn lại.
- **Mức nợ kịch trần:** Tiền mặt không bị chặn ở 0 mà chuyển thành khoản nợ; nếu âm quá `-100.000.000 ₫` kéo dài mà không có nguồn thu -> vỡ nợ, phải bán tài sản/về quê làm lại từ đầu (đổi trạng thái, mất toàn bộ tích lũy, không game over vô lý).
