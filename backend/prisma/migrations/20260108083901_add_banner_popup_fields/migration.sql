/*
  Migration: Add English table and column names
  
  This migration creates new English tables and updates banner_popup columns.
  Data migration from Vietnamese tables should be done separately after this migration.
*/

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONTACTED', 'SUCCESS', 'REJECTED');

-- CreateEnum
CREATE TYPE "LayoutType" AS ENUM ('HERO_VIDEO', 'HERO_IMAGE', 'SPLIT_IMAGE_TEXT', 'BENTO_GRID', 'CAROUSEL', 'MASONRY_GRID', 'TEXT_ONLY', 'CTA_BANNER');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('HERO', 'FEATURE', 'STATISTIC', 'FAQ', 'PARTNER', 'TESTIMONIAL');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE IF NOT EXISTS "registration" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "source" TEXT NOT NULL DEFAULT 'landing_page',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "section" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "layout_type" "LayoutType" NOT NULL,
    "content" JSONB NOT NULL,
    "images" TEXT[],
    "cta_link" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "cover_image" TEXT NOT NULL,
    "gallery" TEXT[],
    "content" JSONB,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "business_model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "profit_potential" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "partnership_faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partnership_faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "content" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "configuration" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,

    CONSTRAINT "configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "admin_user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_user_pkey" PRIMARY KEY ("id")
);

-- AlterTable banner_popup: Add English columns
ALTER TABLE "banner_popup" 
ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "display_delay" INTEGER NOT NULL DEFAULT 3000,
ADD COLUMN IF NOT EXISTS "image_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "redirect_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Drop old Vietnamese columns from banner_popup (if they exist)
ALTER TABLE "banner_popup" 
DROP COLUMN IF EXISTS "createdAt",
DROP COLUMN IF EXISTS "doTreHienThi",
DROP COLUMN IF EXISTS "duongDan",
DROP COLUMN IF EXISTS "hinhAnh",
DROP COLUMN IF EXISTS "hoatDong",
DROP COLUMN IF EXISTS "thuTuUuTien",
DROP COLUMN IF EXISTS "updatedAt";

-- Drop old Vietnamese indexes (if they exist)
DROP INDEX IF EXISTS "banner_popup_hoatDong_thuTuUuTien_idx";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "registration_phone_idx" ON "registration"("phone");
CREATE INDEX IF NOT EXISTS "registration_status_idx" ON "registration"("status");
CREATE INDEX IF NOT EXISTS "registration_created_at_idx" ON "registration"("created_at");

CREATE UNIQUE INDEX IF NOT EXISTS "section_key_key" ON "section"("key");
CREATE INDEX IF NOT EXISTS "section_key_idx" ON "section"("key");
CREATE INDEX IF NOT EXISTS "section_layout_type_sort_order_idx" ON "section"("layout_type", "sort_order");

CREATE INDEX IF NOT EXISTS "event_start_date_idx" ON "event"("start_date");
CREATE INDEX IF NOT EXISTS "event_is_featured_is_visible_idx" ON "event"("is_featured", "is_visible");

CREATE INDEX IF NOT EXISTS "business_model_sort_order_idx" ON "business_model"("sort_order");

CREATE INDEX IF NOT EXISTS "partnership_faq_sort_order_idx" ON "partnership_faq"("sort_order");

CREATE INDEX IF NOT EXISTS "content_type_sort_order_idx" ON "content"("type", "sort_order");

CREATE UNIQUE INDEX IF NOT EXISTS "configuration_key_key" ON "configuration"("key");

CREATE UNIQUE INDEX IF NOT EXISTS "admin_user_email_key" ON "admin_user"("email");

CREATE INDEX IF NOT EXISTS "banner_popup_is_active_priority_idx" ON "banner_popup"("is_active", "priority");

