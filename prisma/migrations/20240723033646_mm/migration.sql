/*
  Warnings:

  - You are about to drop the column `Uploaded_Files` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `Uploaded_Files`,
    ADD COLUMN `Note` VARCHAR(191) NULL;
