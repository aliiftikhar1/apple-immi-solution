/*
  Warnings:

  - Made the column `user` on table `images` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `images` MODIFY `user` VARCHAR(191) NOT NULL;
