/*
  Warnings:

  - You are about to drop the column `part` on the `Question` table. All the data in the column will be lost.
  - Added the required column `order` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "part";
ALTER TABLE "Question" ADD COLUMN     "order" INT4 NOT NULL;
