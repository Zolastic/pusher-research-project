-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "access" STRING[] DEFAULT ARRAY[]::STRING[];
