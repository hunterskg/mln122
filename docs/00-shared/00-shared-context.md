[BỐI CẢNH DỰ ÁN]
Chúng ta biến game triết học hiện tại thành game mô phỏng đời thường:
người chơi được bốc ngẫu nhiên một cuộc đời (nơi sinh, gia đình, hoàn cảnh),
rồi sống qua từng cảnh ngắn bằng các lựa chọn thường ngày.
Luận đề lõi cần giữ: Điều kiện sinh tồn vật chất và vị trí trong quan hệ sản xuất quy định sâu sắc các lựa chọn sinh kế của con người. Mọi quyết định phân bổ thời gian, sức lao động và tích lũy đều mang tính đánh đổi tất yếu giữa lợi ích vật chất trước mắt và giá trị nhân bản lâu dài.

[NGUYÊN TẮC BẤT BIẾN]

1. Triết học nằm NGẦM trong lựa chọn. Văn bản người chơi thấy không chứa thuật ngữ triết học.
2. Không có lựa chọn "đúng". Mỗi lựa chọn đều có cái giá.
3. Không giảng đạo, không kết luận hộ người chơi.
4. Bối cảnh phải đúng thực tế (luật, kinh tế, văn hóa) của quốc gia nhân vật.
5. Khổ đau không được dùng làm trò giải trí hay gây sốc.
6. Không sao chép tên, hình ảnh, văn bản của game nào khác.
7. Ngôn ngữ: tiếng Việt tự nhiên, gần gũi. Đầu ra theo đúng định dạng được yêu cầu, không thêm lời dẫn.

[RÀNG BUỘC KỸ THUẬT - BẮT BUỘC]

- Game chạy 100% frontend (Next.js + TypeScript + zustand), KHÔNG có backend, KHÔNG gọi LLM lúc chạy.
- Mọi nội dung agent tạo ra phải là dữ liệu tĩnh (TS/JSON) đặt trong src/content/ hoặc src/data/ và tuân theo schema ở docs/.
- Mọi ngẫu nhiên đi qua engine/rng.ts (seeded) để cuộc đời tái hiện được từ seed.
- Engine là hàm thuần, không phụ thuộc UI. Không thêm thư viện mới nếu chưa được Orchestrator duyệt.
- Giữ tương thích với engine/save hiện có; nếu đổi schema phải có hàm migrate.
