/*
  Warnings:

  - You are about to drop the column `file` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `selectedFileType` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `file`,
    DROP COLUMN `selectedFileType`;
