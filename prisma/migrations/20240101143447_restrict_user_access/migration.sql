/*
  Warnings:

  - You are about to drop the column `access` on the `Question` table. All the data in the column will be lost.
  - Added the required column `sectionId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "access";
ALTER TABLE "Question" ADD COLUMN     "sectionId" STRING NOT NULL;

-- CreateTable
CREATE TABLE "UserSection" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "sectionId" STRING NOT NULL,

    CONSTRAINT "UserSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" STRING NOT NULL,
    "order" INT4 NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" STRING NOT NULL,
    "order" INT4 NOT NULL,
    "name" STRING NOT NULL,
    "partId" STRING NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSection" ADD CONSTRAINT "UserSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSection" ADD CONSTRAINT "UserSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
