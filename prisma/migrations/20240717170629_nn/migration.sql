/*
  Warnings:

  - You are about to drop the column `SelectedFileType` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `SelectedFileType`,
    ADD COLUMN `selectedFileType` VARCHAR(191) NULL;
