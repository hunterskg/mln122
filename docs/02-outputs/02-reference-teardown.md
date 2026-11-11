# BÁO CÁO PHÂN TÍCH GAME THAM CHIẾU (REFERENCE TEARDOWN)

## 1. Tổng quan các tựa game phân tích

| Tựa game | Thể loại | Điểm xuất sắc cần kế thừa | Điểm yếu / Lệch hướng cần tránh |
| :--- | :--- | :--- | :--- |
| **Real Lives (2001/2010)** | Mô phỏng nhân khẩu học thực tế thế giới | - Xổ số số phận chân thực (Lottery of Birth: GDP, tỷ lệ tử vong trẻ em, văn hóa gia đình).<br>- Mỗi năm trôi qua mang lại biến cố xã hội ngẫu nhiên. | - Quá nhiều bảng số liệu khô khan, thiếu kịch tính tự sự.<br>- Giao diện kiểu báo cáo thống kê, trải nghiệm người dùng buồn ngủ. |
| **BitLife** | Text-sim đời người trên di động | - Nhịp độ cực nhanh (Tap to Age), dễ tiếp cận.<br>- Lựa chọn tức thời, phản hồi trực quan. | - Biến bi kịch thành trò cười lố bịch (meme, gây sốc phản cảm).<br>- **Vi phạm Nguyên tắc 5:** Khổ đau bị tầm thường hóa làm trò giải trí. |
| **Reigns** | Lựa chọn nhị phân quẹt thẻ | - Cơ chế 4 cột tài nguyên giấu đầu hở đuôi.<br>- Lựa chọn ngắn gọn, không giải thích dài dòng.<br>- Nhịp điệu chơi thôi miên. | - Lựa chọn nhị phân quá cực đoan (50/50), dễ thành trò đoán mò cơ học.<br>- Thiếu chiều sâu cá nhân hóa bối cảnh đời thường. |
| **Cart Life (Richard Hofmeier)** | Mô phỏng sinh tồn đời thường (Street Vendor) | - Tái hiện xuất sắc áp lực mưu sinh: từng đồng lẻ, giờ mở hàng, tiền học cho con, sự kiệt sức thể xác.<br>- Trọng tâm là phẩm giá con người lao động. | - Cơ chế vi mô (mini-game làm đồ) quá phức tạp và mệt mỏi, khó đưa lên web thuần tĩnh. |
| **Spent (McKinney / Urban Ministries)** | Web tương tác giáo dục về đói nghèo | - Bắt đầu bằng việc mất hết tiền, sống sót qua 30 ngày với $1,000.<br>- Mỗi lựa chọn đều là 'tiến thoái lưỡng nan' đạo đức vs tiền bạc.<br>- Phản ánh tàn khốc chi phí của việc nghèo (The Cost of Being Poor). | - Quá ngắn (chỉ 1 tháng), mang tính giáo dục trực diện dễ tạo cảm giác bị lên lớp giảng đạo. |

---

## 2. Rút ra bài học cơ chế cho dự án

### 2.1. Cơ chế bốc cuộc đời (Lottery of Birth)
- **Kế thừa từ Real Lives:** Khi bắt đầu, người chơi không được 'chọn' cha mẹ hay nơi sinh. Bốc hạt giống (Seed PRNG) sinh ra: Tỉnh/thành (Hà Nội, Sài Gòn, Miền Tây, Tây Bắc), Nghề của bố mẹ (công nhân, nông dân, buôn bán nhỏ, viên chức), Nhà ở (nhà thuê trọ, nhà cấp 4, nhà phố).
- **Quy tắc thiết kế:** Xuất phát điểm không quyết định 100% kết cục, nhưng quyết định biên độ an toàn và tài nguyên ban đầu (vốn gia đình, mạng lưới quan hệ, gánh nặng nợ nần).

### 2.2. Nhịp điệu cảnh (Scene Cadence & Pacing)
- Không chia theo từng ngày (quá dài) hay từng năm (quá loãng). Chia theo **cột mốc quyết định sinh kế** (Tuổi 18 -> 22 -> 25 -> 30 -> 40 -> 55 -> 65), mỗi giai đoạn gồm 2-4 cảnh then chốt.
- Mỗi cảnh:
  - Đoạn văn 80-150 chữ, ngôi thứ hai ("Bạn..."), mô tả sự việc đang xảy ra trước mắt.
  - 2 đến 3 lựa chọn khả thi trong hoàn cảnh nhân vật (người nghèo không thể có lựa chọn 'nhờ quan hệ của bố mẹ').
  - Không có lựa chọn hoàn hảo: Tăng tiền thì giảm sức/tinh thần; bảo vệ đạo nghĩa thì hao hụt tài chính.

### 2.3. Hệ thống cờ ghi nhớ (Echo / Memory Flags)
- Học tập kỹ thuật tự sự rẽ nhánh: Lựa chọn ở tuổi 18 sẽ quay lại ở tuổi 30.
  - *Ví dụ:* Tuổi 18 chọn đi làm công nhân khu công nghiệp gửi tiền về cho em học đại học (`flag_hi_sinh_cho_em`). Đến tuổi 30, em tốt nghiệp có việc làm giúp đỡ lại, hoặc em vướng bẫy nợ tiêu dùng tạo thêm gánh nặng.
- Tạo cảm giác quyết định của mình thật sự có sức nặng nhân quả lâu dài.

### 2.4. Nhìn lại cuối đời (Post-Mortem Reflection)
- Thay vì điểm số cao/thấp hay bảng xếp hạng thắng/thua, màn hình kết thúc đưa ra **Bản nhìn lại cuộc đời**:
  - Không phán xét tốt/xấu.
  - Phác họa chân dung mô thức sống dựa trên 3 trục ngầm: Bạn là người tích lũy kiên cường, người hy sinh vì người khác, hay người chọn sự thanh thản tâm hồn?
  - Một câu hỏi mở khép lại hành trình để người chơi tự suy ngẫm.
