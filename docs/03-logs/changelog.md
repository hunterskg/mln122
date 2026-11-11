# NHẬT KÝ THAY ĐỔI (CHANGELOG)

## [2026-11-12] - Khởi động Dự án Chuyển đổi sang Life Sim

### Hoàn thành:
1. **Phase 1: Source Analysis**
   - Phân tích toàn diện game doanh nghiệp cũ (`docs/02-outputs/01-source-analysis.md`).
   - Xác lập luận đề lõi và 3 trục triết học ẩn.
   - Cập nhật Tài liệu nguồn (`docs/00-shared/01-source-of-truth.md`) và Bối cảnh chia sẻ (`docs/00-shared/00-shared-context.md`).
2. **Phase 2: Reference Teardown & Concept-Situation Matrix**
   - Đánh giá cơ chế từ Real Lives, BitLife, Reigns, Cart Life, Spent (`docs/02-outputs/02-reference-teardown.md`).
   - Xây dựng ma trận 8 khái niệm Kinh tế chính trị Mác - Lênin chuyển hóa thành tình huống đời thường Việt Nam không dùng thuật ngữ (`docs/02-outputs/03-concept-situation-matrix.md`).
3. **Phase 3: World Model**
   - Xác lập bảng nhân khẩu học Việt Nam: 3 vùng miền, 3 tầng lớp xuất thân, tiền mặt và nợ khởi điểm, bảng tên họ, chi phí và thu nhập thực tế (`docs/02-outputs/04-world-model.md`).
4. **Phase 4: Systems Design & Refactor Plan**
   - Hoàn thiện Tài liệu thiết kế game cuộc đời (`docs/02-outputs/05-game-design-doc.md`).
   - Hoàn thiện Bản đồ refactor kỹ thuật chi tiết (`docs/life-refactor-plan.md`).
   - Khởi tạo kiểu dữ liệu lõi `src/engine/life-types.ts`.
5. **Phase 5: Engine, Narrative Content & UI Refactor**
   - Xây dựng trình tạo nhân vật tất định `src/engine/life-generator.ts` (3 vùng miền, 3 xuất thân, PRNG seeded).
   - Xây dựng kho 19 cảnh đời thực Việt Nam từ tuổi 18 đến 68 (`src/content/scenes/index.ts`), gồm 15 cảnh mốc thời gian và 4 cảnh hệ quả điều kiện.
   - Xây dựng bộ máy chọn cảnh và chuyển đổi trạng thái `src/engine/scene-selector.ts`.
   - Xây dựng bộ máy đúc kết nhân sinh 12 mô thức `src/engine/reflection.ts`.
   - Tích hợp Zustand store `src/store/game-store.ts` với cơ chế migrate phiên bản v3.0.0 và lưu trữ kỷ vật `lifeStones`.
   - Cập nhật các màn hình UI: `setup-screen.tsx` (Bốc cuộc đời), `event-modal.tsx` (Cảnh đời), `dashboard-screen.tsx` (Bảng điều khiển nhân sinh), `final-report-screen.tsx` (Nhìn lại), `main-menu-screen.tsx`, `tutorial-modal.tsx`, và `src/app/page.tsx`.
6. **Phase 6: Playtest Swarm & QA Verification**
   - Hoàn thiện bộ test tự động và 300 lượt mô phỏng Playtest Swarm qua 6 chính sách hành vi (`src/engine/life-engine.test.ts`).
   - Xuất báo cáo cân bằng và kiểm thử chất lượng (`docs/balancing-and-qa-report.md` và `docs/02-outputs/06-playtest-report-v1.md`).

