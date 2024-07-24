/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `images_user_key` ON `images`(`user`);
