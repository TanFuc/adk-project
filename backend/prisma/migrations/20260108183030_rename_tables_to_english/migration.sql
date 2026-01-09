/*
  Warnings:

  - You are about to drop the `cau_hinh` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dang_ky` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hoi_dap_hop_tac` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mo_hinh_kinh_doanh` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `noi_dung` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `phan_muc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quan_tri_vien` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `su_kien` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "banner_popup" ALTER COLUMN "image_url" DROP DEFAULT,
ALTER COLUMN "redirect_url" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "cau_hinh";

-- DropTable
DROP TABLE "dang_ky";

-- DropTable
DROP TABLE "hoi_dap_hop_tac";

-- DropTable
DROP TABLE "mo_hinh_kinh_doanh";

-- DropTable
DROP TABLE "noi_dung";

-- DropTable
DROP TABLE "phan_muc";

-- DropTable
DROP TABLE "quan_tri_vien";

-- DropTable
DROP TABLE "su_kien";

-- DropEnum
DROP TYPE "LoaiBoCuc";

-- DropEnum
DROP TYPE "LoaiNoiDung";

-- DropEnum
DROP TYPE "TrangThai";

-- DropEnum
DROP TYPE "VaiTro";
