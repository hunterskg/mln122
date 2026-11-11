# KẾ HOẠCH BẢN ĐỊA HÓA TOÀN DIỆN (VIETNAMESE LOCALIZATION PLAN)

---

## 1. Mục tiêu và Nguyên tắc
1. **Ngôn ngữ duy nhất:** 100% giao diện, thông báo, nút bấm, hướng dẫn, thẻ sự kiện, bảng số liệu, tooltip hiển thị bằng tiếng Việt chuẩn xác, tự nhiên.
2. **Quy chuẩn định dạng:**
   - **Tiền tệ:** VNĐ (`₫` hoặc `VNĐ`).
   - **Số học:** Định dạng theo chuẩn Việt Nam (dấu chấm phân cách hàng nghìn, ví dụ: `1.500.000 ₫`).
   - **Thời gian:** Tháng 1 / 36 Tháng, ngày giờ `DD/MM/YYYY HH:mm`.
3. **Typography & Bố cục:** Đảm bảo toàn bộ thẻ, nút bấm, tiêu đề không bị tràn viền (overflow), đứt chữ hoặc chồng lấn trên các độ phân giải màn hình từ mobile (375px) đến desktop 4K.

---

## 2. Danh mục màn hình và phạm vi Việt hóa

| STT | File / Component | Chức năng chính | Phạm vi chuỗi ký tự Việt hóa |
| :--- | :--- | :--- | :--- |
| 1 | `src/components/screens/main-menu-screen.tsx` | Menu chính | Tiêu đề, slogan, nút Chơi tiếp, Khởi tạo công ty, Quản lý lưu game, Cẩm nang, Xóa dữ liệu. |
| 2 | `src/components/screens/setup-screen.tsx` | Khởi tạo công ty | Tên doanh nghiệp, ngành nghề (Cà phê, May mặc, SaaS), mô hình (B2C, B2B), tư chất sáng lập viên, mức vốn. |
| 3 | `src/components/screens/dashboard-screen.tsx` | Bảng điều khiển | KPI tổng hợp, doanh thu, lợi nhuận, tiền mặt, cảnh báo nợ, nút kết thúc tháng, thẻ sự kiện điều hành. |
| 4 | `src/components/screens/financials-screen.tsx` | Báo cáo tài chính | Báo cáo P&L dồn tích, Lưu chuyển tiền tệ, phân tích chi phí, biên lợi nhuận, biểu đồ tài chính. |
| 5 | `src/components/screens/suppliers-screen.tsx` | Nhà cung cấp & Đơn hàng | Bảng nhà cung cấp, đơn giá, chất lượng, độ tin cậy, thời gian giao hàng, điều khoản trả ngay / Net-30. |
| 6 | `src/components/screens/inventory-screen.tsx` | Kho hàng & FIFO | Danh sách lô hàng nhập kho, số lượng, giá vốn đơn vị, phí lưu kho, định giá tồn kho. |
| 7 | `src/components/screens/employees-screen.tsx` | Quản trị nhân sự | Danh sách nhân sự, phân loại vị trí (Bán hàng, Vận hành, CSKH), năng suất, tinh thần, đào tạo, sa thải. |
| 8 | `src/components/screens/market-overview-screen.tsx` | Thị trường & Giá bán | Giá bán đơn vị, giá đối thủ, ngân sách tiếp thị, tỷ lệ co giãn, thị phần, mức độ thỏa mãn. |
| 9 | `src/components/screens/event-history-screen.tsx` | Lịch sử sự kiện | Nhật ký toàn bộ các biến động kinh tế đã xảy ra qua các tháng vận hành. |
| 10 | `src/components/screens/company-history-screen.tsx` | Sổ cái & Thành tựu | Sổ cái kế toán hàng tháng, các cột mốc doanh thu, huy hiệu đạt được. |
| 11 | `src/components/screens/final-report-screen.tsx` | Báo cáo tổng kết | Báo cáo kiểm toán cuối cùng, lý do kết thúc (phá sản, mua lại, IPO), định giá, điểm xếp hạng. |
| 12 | `src/components/screens/saves-screen.tsx` | Quản lý lưu game | 4 vị trí lưu (Tự động, Khe 1, 2, 3), xuất/nhập tệp JSON, thông tin sao lưu. |
| 13 | `src/components/layout/game-layout.tsx` | Thanh điều hướng & Header | Menu bên, thanh trạng thái trên cùng, số dư tiền mặt, tháng hoạt động, nút Hướng dẫn. |
| 14 | `src/components/guide/tutorial-modal.tsx` | Cẩm nang khởi nghiệp | Giải thích quy luật P&L vs Dòng tiền, Kho FIFO, Quá tải nhân viên, Thấu chi tín dụng. |
| 15 | `src/components/events/event-modal.tsx` | Hộp thoại sự kiện | Tiêu đề, tình huống, các lựa chọn trade-off, hộp kiến thức kinh tế và trích dẫn giáo trình. |
