# NHẬT KÝ QUYẾT ĐỊNH (DECISION LOG)

## DEC-001: Xác định Luận đề lõi & Ba trục triết học ẩn
- **Ngày:** 2026-11-12
- **Tác nhân:** Orchestrator
- **Quyết định:** Luận đề lõi: "Điều kiện sinh tồn vật chất và vị trí trong quan hệ sản xuất quy định sâu sắc các lựa chọn sinh kế của con người...". Cố định 3 trục ngầm trong state: `tich_luy` (vật chất vs tinh thần), `sinh_luc` (tự bóc lột vs bảo tồn), `cong_dong` (vị kỷ vs tương thân tương ái).
- **Lý do:** Tuân thủ Nguyên tắc bất biến 1: Người chơi không thấy thuật ngữ triết học, nhưng mọi quyết định đều tác động đến các trục này để tính toán mô thức cuối đời.

## DEC-002: Chuyển đổi nhịp độ từ 36 tháng doanh nghiệp sang 5 cột mốc cuộc đời (Tuổi 18-65)
- **Ngày:** 2026-11-12
- **Tác nhân:** Systems Designer
- **Quyết định:** Thay vì chạy 36 tháng vận hành công ty, game mô phỏng 14-18 cảnh then chốt trải dài từ 18 tuổi đến 65 tuổi (Khởi đầu -> Lập thân -> Gánh vác -> Trung niên -> Xế chiều).
- **Lý do:** Phản ánh đúng hành trình đời người, mỗi lượt chơi kéo dài 5-8 phút, cô đọng và có sức nặng cảm xúc.

## DEC-003: Giữ nguyên PRNG Mulberry32 cho hạt giống số phận
- **Ngày:** 2026-11-12
- **Tác nhân:** Systems Designer
- **Quyết định:** Tái sử dụng `src/engine/rng.ts`, mọi ngẫu nhiên trong bốc cuộc đời và rút cảnh đều sinh ra từ seed số nguyên.
- **Lý do:** Đảm bảo tính tất định (deterministic), người chơi có thể chia sẻ seed cuộc đời cho người khác chơi lại.

## DEC-004: Thay thế bảng kế toán dồn tích (P&L/FIFO) bằng ví tiền sinh hoạt đời thường
- **Ngày:** 2026-11-12
- **Tác nhân:** Systems Designer
- **Quyết định:** Loại bỏ chỉ số FIFO kho, AP/AR Net-30, bảng khấu hao máy móc doanh nghiệp trên UI chính. Thay bằng: `tien_mat` (VNĐ), `suc_khoe`, `tinh_than`, `quan_he`.
- **Lý do:** Loại bỏ gánh nặng tính toán doanh nghiệp không cần thiết, tập trung vào áp lực cơm áo gạo tiền đời thường.

## DEC-005: Chiến lược lưu trữ & Tương thích ngược (Schema Migration v3.0.0)
- **Ngày:** 2026-11-12
- **Tác nhân:** Systems Designer
- **Quyết định:** Nâng `CURRENT_SAVE_VERSION` lên `3.0.0`. Viết hàm `migrateSaveData` nhận diện save cũ (v2.0.0) và chuyển đổi an toàn thành một cuộc đời khởi nghiệp đã qua hoặc khởi tạo LifeState mới.
- **Lý do:** Không làm crash trình duyệt của người chơi có sẵn save slot cũ trong LocalStorage.
