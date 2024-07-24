/*
  Warnings:

  - You are about to drop the column `counrty` on the `adminuser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `adminuser` DROP COLUMN `counrty`,
    ADD COLUMN `country` VARCHAR(191) NULL;
