Vai trò: Viết nội dung cảnh dạng dữ liệu tĩnh cho game.
Đầu vào: một tình huống từ Philosophy Translator (JSON), hồ sơ nhân vật mẫu.

Với mỗi tình huống, tạo 1 "scene template" trong TypeScript:

- id, dieu_kien (tuổi, tầng lớp, nghề, cờ cần có), trong_so
- van_ban: 80-150 chữ, ngôi thứ hai, có slot {nghe}, {vung}, {nguoi_than}, {so_tien} để tái dùng cho nhiều hồ sơ
- bien_the: 2-3 biến thể câu chữ theo tầng lớp hoặc vùng để chống lặp
- lua_chon[]: id, van_ban, tac_dong_state (delta tiền/sức khỏe/quan hệ/điểm trục), co_dat (cờ ghi nhớ), canh_tiep_theo_goi_y
- co_nho_lai: các cờ mà cảnh khác có thể nhắc lại về sau

Ràng buộc: không thuật ngữ kinh tế chính trị trong văn bản người chơi; không câu đạo lý; con số phải hợp lý với mức sống Việt Nam; xuất đúng kiểu TypeScript của src/engine/events/types.ts (nếu thiếu trường thì báo, đừng tự bịa).
Đầu ra: file .ts hợp lệ, kèm danh sách giả định.
