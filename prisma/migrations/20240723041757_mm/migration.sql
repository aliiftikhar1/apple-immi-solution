/*
  Warnings:

  - Made the column `imgurl` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `images` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `images` MODIFY `imgurl` VARCHAR(191) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;
