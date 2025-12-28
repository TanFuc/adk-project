-- CreateEnum
CREATE TYPE "TrangThai" AS ENUM ('CHO_XU_LY', 'DA_LIEN_HE', 'THANH_CONG', 'TU_CHOI');

-- CreateEnum
CREATE TYPE "LoaiBoCuc" AS ENUM ('HERO_VIDEO', 'HERO_IMAGE', 'SPLIT_IMAGE_TEXT', 'BENTO_GRID', 'CAROUSEL', 'MASONRY_GRID', 'TEXT_ONLY', 'CTA_BANNER');

-- CreateEnum
CREATE TYPE "LoaiNoiDung" AS ENUM ('HERO', 'FEATURE', 'STATISTIC', 'FAQ', 'PARTNER', 'TESTIMONIAL');

-- CreateEnum
CREATE TYPE "VaiTro" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "dang_ky" (
    "id" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "soDienThoai" TEXT NOT NULL,
    "tinhThanh" TEXT NOT NULL,
    "quanHuyen" TEXT NOT NULL,
    "diaChi" TEXT,
    "trangThai" "TrangThai" NOT NULL DEFAULT 'CHO_XU_LY',
    "nguonDangKy" TEXT NOT NULL DEFAULT 'landing_page',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dang_ky_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phan_muc" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "loaiBoCuc" "LoaiBoCuc" NOT NULL,
    "noiDung" JSONB NOT NULL,
    "hinhAnh" TEXT[],
    "ctaLink" TEXT,
    "thuTu" INTEGER NOT NULL DEFAULT 0,
    "hienThi" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phan_muc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_popup" (
    "id" TEXT NOT NULL,
    "hinhAnh" TEXT NOT NULL,
    "duongDan" TEXT NOT NULL,
    "hoatDong" BOOLEAN NOT NULL DEFAULT true,
    "doTreHienThi" INTEGER NOT NULL DEFAULT 3000,
    "thuTuUuTien" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_popup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "su_kien" (
    "id" TEXT NOT NULL,
    "tieuDe" TEXT NOT NULL,
    "moTa" TEXT,
    "ngayBatDau" TIMESTAMP(3) NOT NULL,
    "ngayKetThuc" TIMESTAMP(3),
    "anhBia" TEXT NOT NULL,
    "boSuuTapAnh" TEXT[],
    "noiDung" JSONB,
    "noiBat" BOOLEAN NOT NULL DEFAULT false,
    "hienThi" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "su_kien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mo_hinh_kinh_doanh" (
    "id" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "moTa" TEXT NOT NULL,
    "anhIcon" TEXT,
    "tiemNangLoiNhuan" TEXT,
    "thuTu" INTEGER NOT NULL DEFAULT 0,
    "hienThi" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mo_hinh_kinh_doanh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hoi_dap_hop_tac" (
    "id" TEXT NOT NULL,
    "cauHoi" TEXT NOT NULL,
    "traLoi" TEXT NOT NULL,
    "thuTu" INTEGER NOT NULL DEFAULT 0,
    "hienThi" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoi_dap_hop_tac_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noi_dung" (
    "id" TEXT NOT NULL,
    "loai" "LoaiNoiDung" NOT NULL,
    "tieuDe" TEXT NOT NULL,
    "moTa" TEXT,
    "noiDung" JSONB NOT NULL,
    "thuTu" INTEGER NOT NULL DEFAULT 0,
    "hienThi" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "noi_dung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cau_hinh" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "moTa" TEXT,

    CONSTRAINT "cau_hinh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quan_tri_vien" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matKhau" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "vaiTro" "VaiTro" NOT NULL DEFAULT 'ADMIN',
    "hoatDong" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quan_tri_vien_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dang_ky_soDienThoai_idx" ON "dang_ky"("soDienThoai");

-- CreateIndex
CREATE INDEX "dang_ky_trangThai_idx" ON "dang_ky"("trangThai");

-- CreateIndex
CREATE INDEX "dang_ky_createdAt_idx" ON "dang_ky"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "phan_muc_key_key" ON "phan_muc"("key");

-- CreateIndex
CREATE INDEX "phan_muc_key_idx" ON "phan_muc"("key");

-- CreateIndex
CREATE INDEX "phan_muc_loaiBoCuc_thuTu_idx" ON "phan_muc"("loaiBoCuc", "thuTu");

-- CreateIndex
CREATE INDEX "banner_popup_hoatDong_thuTuUuTien_idx" ON "banner_popup"("hoatDong", "thuTuUuTien");

-- CreateIndex
CREATE INDEX "su_kien_ngayBatDau_idx" ON "su_kien"("ngayBatDau");

-- CreateIndex
CREATE INDEX "su_kien_noiBat_hienThi_idx" ON "su_kien"("noiBat", "hienThi");

-- CreateIndex
CREATE INDEX "mo_hinh_kinh_doanh_thuTu_idx" ON "mo_hinh_kinh_doanh"("thuTu");

-- CreateIndex
CREATE INDEX "hoi_dap_hop_tac_thuTu_idx" ON "hoi_dap_hop_tac"("thuTu");

-- CreateIndex
CREATE INDEX "noi_dung_loai_thuTu_idx" ON "noi_dung"("loai", "thuTu");

-- CreateIndex
CREATE UNIQUE INDEX "cau_hinh_key_key" ON "cau_hinh"("key");

-- CreateIndex
CREATE UNIQUE INDEX "quan_tri_vien_email_key" ON "quan_tri_vien"("email");
