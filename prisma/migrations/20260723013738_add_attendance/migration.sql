-- CreateTable
CREATE TABLE `attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` INTEGER NOT NULL,
    `date_of_service` DATE NOT NULL,
    `location` VARCHAR(255) NULL,
    `clinician_name` VARCHAR(255) NULL,
    `status` ENUM('SHOW', 'NO_SHOW', 'CANCELED', 'LATE_CANCELED', 'CLINICIAN_CANCELED') NOT NULL,

    INDEX `attendance_patient_id_idx`(`patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
