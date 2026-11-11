# MA TRẬN CHUYỂN DỊCH KHÁI NIỆM SANG TÌNH HUỐNG ĐỜI THƯỜNG (CONCEPT-SITUATION MATRIX)

Nguyên tắc bắt buộc: Văn bản tình huống và lựa chọn hiển thị cho người chơi **HOÀN TOÀN KHÔNG CHỨA THUẬT NGỮ TRIẾT HỌC/KINH TẾ CHÍNH TRỊ**.

---

## 1. Khái niệm: Hàng hóa Sức lao động & Lao động giản đơn vs Phức tạp

### Tình huống 1.1: Cơ hội học việc nghề sửa chữa điện lạnh (Tuổi 19-22)
- **Bối cảnh:** Vừa tốt nghiệp cấp 3, gia đình khó khăn.
- **Tình huống:** Một xưởng sửa chữa điện lạnh gần bến xe nhận bạn vào vừa học việc vừa làm phụ kho. Lương phụ việc chỉ 2,5 triệu/tháng và phải học nghề ban tối trong 1 năm rưỡi. Trong khi đó, một công ty đóng gói bên cạnh đang tuyển nhân công thời vụ bốc vác trả ngay 300.000đ/ngày.
- **Lựa chọn A:** Nhận học việc điện lạnh, chấp nhận ăn mì gói 18 tháng để lấy cái nghề.
  - *Tác động:* `tien_mat`: -5.000.000đ/năm; `truc_tich_luy`: +15 (đầu tư kỹ năng); `truc_sinh_luc`: +10; `flags.nghe_nghiep = 'tho_dien_lanh'`.
- **Lựa chọn B:** Đi bốc vác lấy tiền tươi 300k/ngày để gửi về cho gia đình trả nợ trước mắt.
  - *Tác động:* `tien_mat`: +7.000.000đ/tháng; `suc_khoe`: -15; `truc_tich_luy`: -10; `truc_sinh_luc`: -20; `flags.ky_nang = 'lao_dong_pho_thong'`.

---

## 2. Khái niệm: Giá trị thặng dư tuyệt đối & Cường độ lao động (Tự bóc lột)

### Tình huống 2.1: Cuộc gọi ca đêm ở kho chuyển phát nhanh (Tuổi 23-28)
- **Bối cảnh:** Bạn đang làm nhân viên giao hàng/phân loại kho.
- **Tình huống:** Mùa khuyến mãi cuối năm, quản lý thông báo kho thiếu người ca 22h - 6h sáng, trả gấp đôi lương ngày (600k/đêm) nếu nhận liên tục 15 đêm. Người bạn đã mỏi nhừ sau 10 tiếng làm ca ngày, mắt cay xè.
- **Lựa chọn A:** Đăng ký cày trọn 15 đêm gom tiền tiêu Tết.
  - *Tác động:* `tien_mat`: +9.000.000đ; `suc_khoe`: -25; `tinh_than`: -15; `truc_sinh_luc`: -30; `flags.benh_da_day = true`.
- **Lựa chọn B:** Từ chối ca đêm, về phòng trọ nghỉ ngơi và nấu bữa cơm ấm với bạn cùng phòng.
  - *Tác động:* `tien_mat`: 0; `suc_khoe`: +10; `quan_he`: +10; `truc_sinh_luc`: +20; `truc_tich_luy`: -10.

---

## 3. Khái niệm: Hao mòn tư bản cố định & Công cụ mưu sinh

### Tình huống 3.1: Chiếc xe máy cà tàng chở hàng (Tuổi 24-30)
- **Bối cảnh:** Chiếc xe Wave cũ là cần câu cơm mưu sinh chạy hàng ngày.
- **Tình huống:** Xe bắt đầu hú láp, thắng trước mòn vẹt và nhả khói đen. Thợ sửa xe đầu hẻm bảo thay bộ nồi với thắng mất 1,8 triệu thì đi êm và an toàn, hoặc chỉ châm dầu nhớt thải 40k chạy tạm, nhưng dễ đứt thắng giữa dốc.
- **Lựa chọn A:** Cắn răng rút 1,8 triệu thay mới an toàn để chạy lâu dài.
  - *Tác động:* `tien_mat`: -1.800.000đ; `suc_khoe`: +5 (giảm rủi ro tai nạn); `truc_tich_luy`: +10; `flags.xe_tot = true`.
- **Lựa chọn B:** Châm nhớt 40k chạy tiếp, cầu mong không sao để dành tiền trả nợ tháng.
  - *Tác động:* `tien_mat`: -40.000đ; `truc_sinh_luc`: -10; `flags.xe_sap_hong = true` (tăng 25% rủi ro sự kiện tai nạn ở tuổi sau).

---

## 4. Khái niệm: Hai thuộc tính của hàng hóa (Giá trị sử dụng vs Giá trị trao đổi)

### Tình huống 4.1: Nồi nước lèo của quán bún vỉa hè (Tuổi 32-40)
- **Bối cảnh:** Bạn mở xe bún riêu cua mưu sinh ở góc phố.
- **Tình huống:** Giá thịt và cua đồng tăng 30%. Một mối quen chào bán chất tạo ngọt công nghiệp và hương liệu cua giá rẻ bằng 1/5, chỉ cần nêm một thìa là nồi nước lèo thơm phức, ăn không phân biệt được.
- **Lựa chọn A:** Quyết giữ công thức nấu bằng cua đồng thật, tăng giá bán thêm 5.000đ/tô dù khách có thể càu nhàu bỏ đi vài người.
  - *Tác động:* `tien_mat`: -1.000.000đ (tháng đầu sụt khách); `tinh_than`: +15 (lương tâm thanh thản); `truc_quan_he`: +20; `flags.quan_uy_tin = true`.
- **Lựa chọn B:** Dùng hương liệu công nghiệp để giữ nguyên giá 30k cạnh tranh và tối đa hóa lợi nhuận.
  - *Tác động:* `tien_mat`: +3.500.000đ/tháng; `truc_tich_luy`: +25; `truc_quan_he`: -20; `flags.bot_ngot_hoa_chat = true`.

---

## 5. Khái niệm: Tư bản cho vay & Bẫy tín dụng tiêu dùng

### Tình huống 5.1: Chiếc điện thoại thông minh phục vụ công việc (Tuổi 21-25)
- **Bối cảnh:** Cần điện thoại tốt để nhận cuốc xe công nghệ / trả lời đơn bán hàng online.
- **Tình huống:** Điện thoại cũ vỡ màn hình. Cửa hàng mời mua máy mới 8 triệu bằng hình thức trả góp '0 đồng qua app tài chính', mỗi tháng chỉ đóng 850k trong 18 tháng (thực chất lãi suất ẩn gần 40%/năm).
- **Lựa chọn A:** Vay app tài chính mua máy xịn trả góp để nhận việc ngay.
  - *Tác động:* `tien_mat`: 0 (trước mắt), gánh nặng nợ 850k/tháng trong 18 tháng; `truc_tich_luy`: -25; `flags.vay_app_tieu_dung = true`.
- **Lựa chọn B:** Mua lại điện thoại cũ nứt vỏ giá 1,2 triệu từ bạn bè dùng tạm.
  - *Tác động:* `tien_mat`: -1.200.000đ; `tinh_than`: hơi tự ti nhưng nhẹ đầu; `truc_tich_luy`: +15; `flags.vay_app_tieu_dung = false`.

---

## 6. Khái niệm: Tích lũy tư bản & Tái đầu tư vs Hưởng thụ cá nhân

### Tình huống 6.1: Tiền thưởng Tết sau một năm làm ăn có dư (Tuổi 35-45)
- **Bối cảnh:** Sau một năm tích cóp, bạn dư được 35 triệu đồng trong tài khoản.
- **Tình huống:** Cả nhà ao ước có chuyến đi chơi xa một lần và sửa lại gian bếp dột cho mẹ; trong khi người bạn thân rủ hùn 35 triệu này mở thêm một xe bán nước giải khát trước cổng trường học.
- **Lựa chọn A:** Dành tiền đưa mẹ đi khám tổng quát và sửa gian bếp khang trang.
  - *Tác động:* `tien_mat`: -30.000.000đ; `quan_he`: +30; `tinh_than`: +25; `truc_quan_he`: +30; `truc_tich_luy`: -20.
- **Lựa chọn B:** Dồn toàn bộ 35 triệu hùn vốn mở điểm kinh doanh mới để tiền đẻ ra tiền.
  - *Tác động:* `tien_mat`: -35.000.000đ; `truc_tich_luy`: +35; `truc_quan_he`: -15; `flags.dau_tu_xe_nuoc = true`.

---

## 7. Khái niệm: Ngoại ứng tiêu cực & Trách nhiệm cộng đồng

### Tình huống 7.1: Rác thải từ xưởng mộc nhỏ trong khu dân cư (Tuổi 38-48)
- **Bối cảnh:** Bạn làm chủ một xưởng mộc nhỏ gia đình 3 thợ.
- **Tình huống:** Bụi cưa và mùi sơn PU bay sang nhà hàng xóm có trẻ nhỏ. Chi phí lắp buồng lọc khí và gom bụi khép kín mất 15 triệu đồng. Hàng xóm sang góp ý tế nhị.
- **Lựa chọn A:** Đi vay mượn gom đủ 15 triệu lắp hệ thống hút bụi lọc mùi triệt để.
  - *Tác động:* `tien_mat`: -15.000.000đ; `quan_he`: +25; `truc_quan_he`: +25; `truc_tich_luy`: -15.
- **Lựa chọn B:** Chỉ che bạt tạm bợ và dời giờ phun sơn sang ban đêm để hàng xóm khó bắt bẻ.
  - *Tác động:* `tien_mat`: -500.000đ; `quan_he`: -30; `truc_quan_he`: -25; `truc_tich_luy`: +15; `flags.hang_xom_kich_bac = true`.
