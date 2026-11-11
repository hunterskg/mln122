---
name: kinh-te-chinh-tri-quiz
description: Chuyên gia phát triển Web App trắc nghiệm và chẩn đoán tư duy Kinh tế chính trị Mác - Lênin (Next.js, Tailwind, JSON-based). Sử dụng khi cần sinh câu hỏi tình huống thực tế, xây dựng logic tính điểm, tra cứu chuẩn xác giáo trình Bộ GD&ĐT và hoàn thiện giao diện người dùng.
---

# KINH TẾ CHÍNH TRỊ MÁC - LÊNIN: QUIZ & DIAGNOSTIC ENGINE

Skill này hướng dẫn quy trình xây dựng, biên soạn nội dung và lập trình ứng dụng trắc nghiệm tình huống sáng tạo cho môn Kinh tế chính trị Mác - Lênin bậc đại học (Bộ GD&ĐT).

## 1. NGUYÊN TẮC LÝ LUẬN CỐT LÕI (BẮT BUỘC TUÂN THỦ)

Mọi câu hỏi, tình huống và giải thích phải bám sát hệ thống khái niệm của Giáo trình 2021:
1. **Chương 1 (Đối tượng & Phương pháp):** Bản chất quy luật kinh tế khách quan vs chính sách chủ quan; phương pháp trừu tượng hóa khoa học; không nhầm lẫn giữa hiện tượng bề mặt và bản chất.
2. **Chương 2 (Hàng hóa & Thị trường):**
   - Hàng hóa có 2 thuộc tính (giá trị sử dụng, giá trị) do tính 2 mặt của lao động (cụ thể, trừu tượng).
   - Bản chất của tiền tệ và quy luật lưu thông tiền tệ ($M = \frac{P \cdot Q}{V}$).
   - Các yếu tố đặc biệt: Quyền sử dụng đất, thương hiệu, chứng khoán (tư bản giả) – không phải hàng hóa thông thường do không có hao phí lao động trực tiếp tạo ra.
   - Các quy luật: Giá trị, Cung - cầu, Lưu thông tiền tệ, Cạnh tranh.
3. **Chương 3 (Giá trị thặng dư):**
   - Hàng hóa sức lao động: Nguồn gốc duy nhất của giá trị thặng dư ($m$).
   - Tư bản bất biến ($c$) vs Tư bản khả biến ($v$). Máy móc không tự sinh ra giá trị mới.
   - Sản xuất $m$ tuyệt đối (kéo dài ngày làm việc / OT) & $m$ tương đối (tăng năng suất lao động xã hội rút ngắn thời gian tất yếu).
   - Bản chất tiền lương, tích lũy tư bản, địa tô tư bản chủ nghĩa.
4. **Chương 4 (Cạnh tranh & Độc quyền):**
   - Sự chuyển hóa từ tự do cạnh tranh sang độc quyền; độc quyền nhà nước; giá cả độc quyền; lợi nhuận độc quyền.
5. **Chương 5 (KTTT định hướng XHCN tại Việt Nam):**
   - Đa dạng hình thức sở hữu, thành phần kinh tế; phân phối theo kết quả lao động và hiệu quả kinh tế; hài hòa lợi ích cá nhân - tập thể - xã hội.
6. **Chương 6 (CNH - HĐH & Hội nhập quốc tế):**
   - Tác động của CMCN 4.0; vị trí của người lao động trong thời đại số; hội nhập kinh tế quốc tế.

## 2. QUY CHUẨN BIÊN SOẠN CÂU HỎI TÌNH HUỐNG

Mỗi câu hỏi phải cấu trúc theo định dạng sau:
1. **Tình huống (Dilemma / Scenario):** Bối cảnh thực tế gắn liền với sinh viên/giới trẻ (săn sale, nhảy việc, OT, mua BĐS, giá xăng, AI, tiền số).
2. **4 Phương án lựa chọn:**
   - 1 phương án **Chuẩn Mácxít** (nắm đúng bản chất chiều sâu).
   - 1 phương án **Ngụy biện cảm tính / Dân gian** (nhìn hiện tượng bề ngoài).
   - 1 phương án **Tư sản sơ khai / Cổ điển** (đồng nhất giá trị với giá cả/sở thích).
   - 1 phương án **Nhầm lẫn yếu tố kỹ thuật / Máy móc**.
3. **Giải thích chi tiết (Explanation):** Vì sao chọn phương án đó, vạch rõ sai lầm của các phương án còn lại.
4. **Trích dẫn giáo trình (Textbook Reference):** Ghi rõ Chương, Mục và số trang.

## 3. LOGIC TÍNH ĐIỂM & ĐÁNH GIÁ (DIAGNOSTIC ALGORITHM)

- **Điểm từng chương:** Tính theo tỷ lệ % câu trả lời đúng trên tổng số câu thuộc chương đó.
- **Tiêu chí Đạt (Nắm vững):** >= 75% điểm của chương.
- **Tiêu chí Cần ôn lại:** < 50% điểm của chương.
- **Xác định Archetype:** Dựa trên tổng điểm và ma trận thiên hướng tư duy của người dùng.
