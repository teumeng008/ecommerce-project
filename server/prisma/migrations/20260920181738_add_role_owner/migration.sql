-- AlterTable
ALTER TABLE `Product` MODIFY `thumbnail` TEXT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'ADMIN', 'OWNER') NOT NULL DEFAULT 'USER';
