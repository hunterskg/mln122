# TÀI LIỆU NGUỒN (SOURCE OF TRUTH)

## 1. Luận đề lõi
Điều kiện sinh tồn vật chất và vị trí trong quan hệ sản xuất quy định sâu sắc các lựa chọn sinh kế của con người. Mọi quyết định phân bổ thời gian, sức lao động và tích lũy đều mang tính đánh đổi tất yếu giữa lợi ích vật chất trước mắt và giá trị nhân bản lâu dài.

## 2. Ba trục triết học ngầm định (Ẩn trong State)
- **Tư bản hóa / Tích lũy** (`truc_tich_luy`: -100 đến +100):
  - `-100`: Trải nghiệm, tinh thần, không màng của cải, dễ tổn thương tài chính.
  - `+100`: Thực dụng, tích lũy tiền tệ tối đa, tính toán thiệt hơn từng đồng.
- **Sức lao động / Sinh lực** (`truc_sinh_luc`: -100 đến +100):
  - `-100`: Tự bóc lột, làm việc kiệt cùng, đánh đổi sức khỏe lấy tiền công.
  - `+100`: Bảo toàn thân thể, từ chối tăng ca độc hại, tôn trọng giới hạn sinh học.
- **Xã hội hóa / Quan hệ** (`truc_quan_he`: -100 đến +100):
  - `-100`: Vị kỷ, cô lập, cạnh tranh cá nhân, cắt đứt ràng buộc gánh nặng thân tộc.
  - `+100`: Tương thân tương ái, gánh vác gia đình, hy sinh vì tập thể, tình làng nghĩa xóm.

## 3. Schema LifeState
- `profile`:
  - `id`: string
  - `ten`: string
  - `nam_sinh`: number
  - `tuoi`: number
  - `gioi_tinh`: 'nam' | 'nu'
  - `vung_mien`: 'bac' | 'trung' | 'nam'
  - `xuat_than`: 'nong_thon_ngheo' | 'lao_dong_do_thi' | 'tieu_tu_san'
  - `nghe_nghiep`: string
- `stats`:
  - `tien_mat`: number (VNĐ, cho phép âm ngắn hạn dưới dạng nợ)
  - `suc_khoe`: number (0 - 100)
  - `tinh_than`: number (0 - 100)
  - `quan_he`: number (0 - 100)
- `axes`:
  - `tich_luy`: number (-100..100)
  - `sinh_luc`: number (-100..100)
  - `quan_he`: number (-100..100)
- `flags`: Record<string, boolean | number | string>
- `history`: { turn: number; sceneId: string; choiceId: string }[]

## 4. Quy ước đặt tên
- ID cảnh: `scene_{tuoi}_{chu_de}_{stt}` (vd: `scene_20_hoc_nghe_01`)
- ID lựa chọn: `opt_{hanh_dong}` (vd: `opt_lam_them_dem`)
- Cờ ghi nhớ: `flag_{chu_de}_{chi_tiet}` (vd: `flag_no_tien_nha`, `flag_bo_hoc_nghe`)
