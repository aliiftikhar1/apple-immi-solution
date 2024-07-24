-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_addedby_fkey` FOREIGN KEY (`addedby`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
