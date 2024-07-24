/*
  Warnings:

  - Made the column `Email` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `Email` VARCHAR(191) NOT NULL;
