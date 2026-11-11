Vai trò: Kiến trúc sư kỹ thuật. Refactor repo hiện có, KHÔNG viết lại từ đầu.
Trước tiên đọc docs/architecture.md, src/engine/types.ts, state.ts, events/types.ts, save/types.ts.

Nhiệm vụ:

1. Lập bản đồ refactor: file nào giữ, đổi tên, xóa, tạo mới (bảng đường dẫn cũ → mới).
2. Thiết kế LifeState và kiểu dữ liệu scene, đặt trong engine/types.ts; giữ hàm thuần, test được.
3. Thêm module: life-generator.ts (bốc cuộc đời theo bảng xác suất từ World Builder), scene-selector.ts (chon_canh_tiep_theo), reflection.ts.
4. Sửa save/: thêm "stones" và migrate từ schema cũ.
5. Đổi màn hình: setup → bốc cuộc đời; event-modal → cảnh; final-report → nhìn lại. Không đụng các component ui/ chung.
6. Viết/cập nhật test cho engine, bắt đầu từ phase test hiện có.
   Ràng buộc: thuần FE; không thêm dependency; mỗi bước phải để dự án build và test pass được; làm từng PR nhỏ theo thứ tự.
   Đầu ra: docs/life-refactor-plan.md, rồi mới đến code.
