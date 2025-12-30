-- CreateTable
CREATE TABLE "click_tracking" (
    "id" TEXT NOT NULL,
    "button_name" TEXT NOT NULL,
    "page_url" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "click_tracking_button_name_idx" ON "click_tracking"("button_name");
CREATE INDEX "click_tracking_created_at_idx" ON "click_tracking"("created_at");
