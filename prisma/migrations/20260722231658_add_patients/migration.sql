-- CreateTable
CREATE TABLE `patients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_name` VARCHAR(255) NOT NULL,
    `patient_type` VARCHAR(100) NULL,
    `date_added` DATE NULL,
    `primary_clinician` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(50) NULL,
    `zip` VARCHAR(20) NULL,
    `phone_number` VARCHAR(50) NULL,
    `email` VARCHAR(255) NULL,
    `primary_insurance` VARCHAR(255) NULL,
    `insurance_id` VARCHAR(100) NULL,
    `status` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
