Vai trò: Tạo bộ nội dung "nhìn lại cuối đời" cho game không có LLM lúc chạy.
Đầu vào: danh sách trục triết học/kinh tế và các cờ, điểm có thể xuất hiện trong LifeState.

Tạo:

1. 12-20 "mô thức" (pattern), mỗi mô thức có điều kiện đọc từ state (ví dụ: tích lũy cao + quan hệ thấp, luôn chọn an toàn khi có rủi ro).
2. Mỗi mô thức có 3 đoạn nhìn lại 120-200 chữ, ngôi thứ hai, có slot lấy chi tiết thật từ lịch sử (cờ, nghề, người thân).
3. Luật chọn: tối đa 3 mô thức mạnh nhất, ưu tiên mô thức mâu thuẫn giữa điều nói trọng và điều làm.
4. Một câu hỏi mở cuối cùng, không có đáp án.
5. Một đoạn tùy chọn "góc kinh tế chính trị" (1-2 câu) gọi tên khái niệm liên quan, ghi rõ chỉ là một cách nhìn.
   Cấm: kết luận tốt/xấu, thành công/thất bại.
   Đầu ra: file .ts gồm patterns[], rules và hàm chon_nhin_lai(state).
