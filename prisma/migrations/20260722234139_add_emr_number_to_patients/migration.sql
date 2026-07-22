-- AlterTable
ALTER TABLE `patients` ADD COLUMN `emr_number` VARCHAR(100) NULL,
    MODIFY `address` TEXT NULL,
    MODIFY `primary_insurance` TEXT NULL;
