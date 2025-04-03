-- CreateEnum
CREATE TYPE "ProcessingWorkProcess" AS ENUM ('new', 'atWork', 'completed', 'canceled');

-- CreateTable
CREATE TABLE "Appeal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "feedbackMessage" TEXT,
    "processingWork" "ProcessingWorkProcess" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appeal_pkey" PRIMARY KEY ("id")
);
