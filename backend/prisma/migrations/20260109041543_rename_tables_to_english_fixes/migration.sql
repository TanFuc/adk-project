-- CreateTable
CREATE TABLE "photo_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photo_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "photo_category_slug_key" ON "photo_category"("slug");

-- CreateIndex
CREATE INDEX "photo_category_slug_idx" ON "photo_category"("slug");

-- CreateIndex
CREATE INDEX "photo_category_sort_order_idx" ON "photo_category"("sort_order");

-- CreateIndex
CREATE INDEX "photo_category_id_idx" ON "photo"("category_id");

-- CreateIndex
CREATE INDEX "photo_sort_order_idx" ON "photo"("sort_order");

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "photo_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
