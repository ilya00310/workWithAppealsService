-- CreateEnum
CREATE TYPE "ProcessingWorkProcess" AS ENUM ('new', 'atWork', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "Appeal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reasonForCancellation" TEXT NOT NULL DEFAULT '',
    "problemSolving" TEXT NOT NULL DEFAULT '',
    "processingWork" "ProcessingWorkProcess" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appeal_pkey" PRIMARY KEY ("id")
);
