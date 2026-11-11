# TÀI LIỆU THIẾT KẾ GAME: MÔ PHỎNG ĐỜI THƯỜNG (LIFE SIM GDD)

## 1. Tầm nhìn & Cảm xúc cốt lõi
Game biến người chơi thành một người bình dân tại Việt Nam, bắt đầu từ vạch xuất phát ngẫu nhiên ở tuổi 18. Người chơi trải qua từng cảnh ngộ sinh kế then chốt, mỗi quyết định đều mang tính đánh đổi: tiền bạc, sức khỏe, mối quan hệ và những dằn vặt lương tâm. Triết học Mác - Lênin không nằm ở khẩu hiệu hay bài giảng, mà ẩn sâu trong sự giằng xé giữa miếng cơm manh áo và phẩm giá con người.

---

## 2. Vòng lặp chơi chính (Core Game Loop)

1. **Khởi sinh cuộc đời (Lottery of Birth):**
   - Seed ngẫu nhiên bốc: Tên, Giới tính, Quê quán, Tầng lớp xuất thân, Hoàn cảnh gia đình, Số tiền ban đầu.
2. **Trình hiện cảnh đời (Scene Presentation):**
   - Hệ thống chọn 1 cảnh phù hợp nhất dựa trên: Độ tuổi (`tuoi`), Xuất thân/Nghề nghiệp (`nghe_nghiep`), Các cờ sự kiện quá khứ (`flags`), và Trọng số ngẫu nhiên.
   - Hiển thị văn bản đời thường (80-150 chữ, ngôi thứ hai), 2-3 lựa chọn cụ thể.
3. **Quyết định & Bước nhảy thời gian (Choice & Turn Step):**
   - Người chơi chọn 1 phương án.
   - Cập nhật tài nguyên: `tien_mat`, `suc_khoe`, `tinh_than`, `quan_he`.
   - Cập nhật 3 trục triết học ẩn: `tich_luy`, `sinh_luc`, `quan_he`.
   - Lưu các cờ nhớ (`flags`).
   - Thời gian nhảy tới mốc tiếp theo (+2 đến +5 tuổi).
4. **Kiểm tra điều kiện tiếp diễn / Kết thúc (End Condition Check):**
   - Nếu `suc_khoe <= 0` hoặc qua mốc tuổi 65+: Chuyển sang màn hình **Nhìn lại cuộc đời**.
   - Ngược lại: Quay về bước 2 với cảnh tiếp theo.
5. **Nhìn lại cuộc đời (Reflection Screen):**
   - Phân tích 3 mô thức sống nổi bật nhất từ 3 trục ngầm và các cờ then chốt.
   - Trích xuất tiếng vọng quá khứ: Những việc đã làm, cái giá đã trả.
   - Một câu hỏi mở cuối cùng không có đáp án, kèm góc nhìn chiêm nghiệm kinh tế chính trị ngắn gọn (tùy chọn).

---

## 3. Kiến trúc chỉ số (Stat Mechanics)

### 3.1. Chỉ số hiển thị (Visible Stats)
- **Tiền mặt (`tien_mat`):** Đơn vị VNĐ. Có thể âm (khoản nợ cá nhân). Tác động trực tiếp đến khả năng chữa bệnh, ăn uống, chi trả học phí.
- **Sức khỏe (`suc_khoe`):** Thang 0 - 100. Đại diện cho thể lực, bệnh tật. Tụt nhanh khi tăng ca, tự bóc lột, ăn uống thiếu thốn. Về 0 = tử vong do bệnh/tai nạn.
- **Tinh thần (`tinh_than`):** Thang 0 - 100. Đại diện cho niềm vui, sự thanh thản, áp lực âu lo. Tinh thần thấp làm giảm hiệu quả công việc và gây ức chế quan hệ.
- **Tình nghĩa / Quan hệ (`quan_he`):** Thang 0 - 100. Đại diện cho sự gắn kết với cha mẹ, vợ chồng, con cái, anh em họ hàng, chòm xóm.

### 3.2. Ba trục triết học ngầm định (Hidden Ethical & Class Axes)
*Người chơi KHÔNG nhìn thấy con số cụ thể, chỉ được dùng để phân loại mô thức ở màn hình kết thúc.*
- **Trục 1: Tích lũy vs Trải nghiệm (`tich_luy` [-100..100]):** Vị thế tư bản hóa, tiết kiệm khắt khe hay coi nhẹ tiền của.
- **Trục 2: Sinh lực vs Tự bóc lột (`sinh_luc` [-100..100]):** Tôn trọng giới hạn con người hay vắt kiệt bản thân chạy theo đồng tiền.
- **Trục 3: Vị tha cộng đồng vs Vị kỷ cá nhân (`cong_dong` [-100..100]):** Gánh vác người thân, chia sẻ vs Tách biệt, ưu tiên tối đa bản thân.

---

## 4. Danh mục 6 Mô thức nhìn lại cuối đời (Reflection Archetypes)

1. **Người cày cuốc thầm lặng (The Silent Striver):** `tich_luy` cao, `sinh_luc` rất thấp. Cả đời tăng ca kiếm tiền, để lại tài sản cho con cháu nhưng thân thể mang đầy bệnh tật tuổi già.
2. **Cánh buồm phiêu lãng (The Carefree Wanderer):** `tich_luy` rất thấp, `sinh_luc` cao, `tinh_than` cao. Không nhà lầu xe hơi, không dư dả tiền bạc, nhưng thanh thản và sống trọn từng khoảnh khắc tuổi trẻ.
3. **Cột trụ gia đình (The Family Pillar):** `cong_dong` rất cao, `tich_luy` trung bình. Luôn hy sinh ước mơ riêng để lo cho cha mẹ, các em và con cái; được họ hàng kính trọng.
4. **Chiến binh cô độc (The Lone Pragmatist):** `cong_dong` rất thấp, `tich_luy` cao. Thực dụng, cắt đứt các gánh nặng họ hàng để vươn lên thành đạt vật chất, nhưng cuối đời cô quạnh trong căn nhà rộng.
5. **Đời trôi theo dòng (The Drifter):** Các chỉ số quanh mức 0. Thích nghi với mọi biến cố, không quá tham vọng cũng không buông xuôi, bình lặng qua tháng ngày.
6. **Vết thương chưa lành (The Burdened Soul):** `tinh_than` thấp, vướng nhiều bẫy nợ hoặc biến cố sức khỏe dở dang; để lại nhiều trăn trở day dứt.
