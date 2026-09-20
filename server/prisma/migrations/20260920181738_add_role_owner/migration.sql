-- AlterTable
ALTER TABLE `product` MODIFY `thumbnail` TEXT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN', 'OWNER') NOT NULL DEFAULT 'USER';
