-- Data Migration Script: Vietnamese to English
-- Run this BEFORE applying the Prisma migration to preserve data

-- Migrate banner_popup Vietnamese columns to English
UPDATE "banner_popup" 
SET 
  "image_url" = COALESCE("hinhAnh", ''),
  "redirect_url" = COALESCE("duongDan", ''),
  "is_active" = COALESCE("hoatDong", true),
  "display_delay" = COALESCE("doTreHienThi", 3000),
  "priority" = COALESCE("thuTuUuTien", 0),
  "created_at" = COALESCE("createdAt", CURRENT_TIMESTAMP),
  "updated_at" = COALESCE("updatedAt", CURRENT_TIMESTAMP)
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_name = 'banner_popup' AND column_name = 'hinhAnh'
);

-- Migrate dang_ky -> registration
INSERT INTO "registration" (
  "id", "full_name", "phone", "province", "district", "address", 
  "status", "source", "created_at", "updated_at"
)
SELECT 
  "id",
  "hoTen",
  "soDienThoai",
  "tinhThanh",
  "quanHuyen",
  "diaChi",
  CASE 
    WHEN "trangThai" = 'CHO_XU_LY' THEN 'PENDING'::"RegistrationStatus"
    WHEN "trangThai" = 'DA_LIEN_HE' THEN 'CONTACTED'::"RegistrationStatus"
    WHEN "trangThai" = 'THANH_CONG' THEN 'SUCCESS'::"RegistrationStatus"
    WHEN "trangThai" = 'TU_CHOI' THEN 'REJECTED'::"RegistrationStatus"
    ELSE 'PENDING'::"RegistrationStatus"
  END,
  COALESCE("nguonGoc", 'landing_page'),
  "createdAt",
  "updatedAt"
FROM "dang_ky"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dang_ky')
ON CONFLICT (id) DO NOTHING;

-- Migrate hoi_dap_hop_tac -> partnership_faq
INSERT INTO "partnership_faq" (
  "id", "question", "answer", "sort_order", "is_visible", 
  "created_at", "updated_at"
)
SELECT 
  "id",
  "cauHoi",
  "cauTraLoi",
  COALESCE("thuTu", 0),
  COALESCE("hienThi", true),
  "createdAt",
  "updatedAt"
FROM "hoi_dap_hop_tac"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hoi_dap_hop_tac')
ON CONFLICT (id) DO NOTHING;

-- Migrate mo_hinh_kinh_doanh -> business_model
INSERT INTO "business_model" (
  "id", "name", "description", "icon_url", "profit_potential",
  "sort_order", "is_visible", "created_at", "updated_at"
)
SELECT 
  "id",
  "ten",
  "moTa",
  "iconUrl",
  "tiemNangLoiNhuan",
  COALESCE("thuTu", 0),
  COALESCE("hienThi", true),
  "createdAt",
  "updatedAt"
FROM "mo_hinh_kinh_doanh"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mo_hinh_kinh_doanh')
ON CONFLICT (id) DO NOTHING;

-- Migrate noi_dung -> content
INSERT INTO "content" (
  "id", "type", "title", "description", "content",
  "sort_order", "is_visible", "created_at", "updated_at"
)
SELECT 
  "id",
  CASE 
    WHEN "loai" = 'HERO' THEN 'HERO'::"ContentType"
    WHEN "loai" = 'TINH_NANG' THEN 'FEATURE'::"ContentType"
    WHEN "loai" = 'THONG_KE' THEN 'STATISTIC'::"ContentType"
    WHEN "loai" = 'CAU_HOI' THEN 'FAQ'::"ContentType"
    WHEN "loai" = 'DOI_TAC' THEN 'PARTNER'::"ContentType"
    WHEN "loai" = 'DANH_GIA' THEN 'TESTIMONIAL'::"ContentType"
    ELSE 'HERO'::"ContentType"
  END,
  "tieuDe",
  "moTa",
  "noiDung",
  COALESCE("thuTu", 0),
  COALESCE("hienThi", true),
  "createdAt",
  "updatedAt"
FROM "noi_dung"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noi_dung')
ON CONFLICT (id) DO NOTHING;

-- Migrate phan_muc -> section
INSERT INTO "section" (
  "id", "key", "layout_type", "content", "images", "cta_link",
  "sort_order", "is_visible", "created_at", "updated_at"
)
SELECT 
  "id",
  "khoa",
  CASE 
    WHEN "loaiBoCuc" = 'VIDEO_HERO' THEN 'HERO_VIDEO'::"LayoutType"
    WHEN "loaiBoCuc" = 'ANH_HERO' THEN 'HERO_IMAGE'::"LayoutType"
    WHEN "loaiBoCuc" = 'ANH_VAN_BAN_TACH' THEN 'SPLIT_IMAGE_TEXT'::"LayoutType"
    WHEN "loaiBoCuc" = 'LUOI_BENTO' THEN 'BENTO_GRID'::"LayoutType"
    WHEN "loaiBoCuc" = 'CAROUSEL' THEN 'CAROUSEL'::"LayoutType"
    WHEN "loaiBoCuc" = 'LUOI_MASONRY' THEN 'MASONRY_GRID'::"LayoutType"
    WHEN "loaiBoCuc" = 'VAN_BAN_DON' THEN 'TEXT_ONLY'::"LayoutType"
    WHEN "loaiBoCuc" = 'BANNER_CTA' THEN 'CTA_BANNER'::"LayoutType"
    ELSE 'TEXT_ONLY'::"LayoutType"
  END,
  "noiDung",
  "hinhAnh",
  "lienKetCta",
  COALESCE("thuTu", 0),
  COALESCE("hienThi", true),
  "createdAt",
  "updatedAt"
FROM "phan_muc"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'phan_muc')
ON CONFLICT (id) DO NOTHING;

-- Migrate quan_tri_vien -> admin_user
INSERT INTO "admin_user" (
  "id", "email", "password", "full_name", "role", "is_active",
  "created_at", "updated_at"
)
SELECT 
  "id",
  "email",
  "matKhau",
  "hoTen",
  CASE 
    WHEN "vaiTro" = 'SUPER_ADMIN' THEN 'SUPER_ADMIN'::"AdminRole"
    WHEN "vaiTro" = 'ADMIN' THEN 'ADMIN'::"AdminRole"
    ELSE 'ADMIN'::"AdminRole"
  END,
  COALESCE("hoatDong", true),
  "createdAt",
  "updatedAt"
FROM "quan_tri_vien"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quan_tri_vien')
ON CONFLICT (id) DO NOTHING;

-- Migrate su_kien -> event
INSERT INTO "event" (
  "id", "title", "description", "start_date", "end_date", 
  "cover_image", "gallery", "content", "is_featured", "is_visible",
  "created_at", "updated_at"
)
SELECT 
  "id",
  "tieuDe",
  "moTa",
  "ngayBatDau",
  "ngayKetThuc",
  "anhBia",
  "boSuuTap",
  "noiDung",
  COALESCE("noiBat", false),
  COALESCE("hienThi", true),
  "createdAt",
  "updatedAt"
FROM "su_kien"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'su_kien')
ON CONFLICT (id) DO NOTHING;

-- Migrate cau_hinh -> configuration
INSERT INTO "configuration" ("id", "key", "value", "description")
SELECT 
  gen_random_uuid(), 
  "khoa", 
  to_jsonb("giaTri"), 
  "moTa"
FROM "cau_hinh"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cau_hinh')
ON CONFLICT (key) DO NOTHING;
