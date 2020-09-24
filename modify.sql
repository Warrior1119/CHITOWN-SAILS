ALTER TABLE `elevatedliving_staging`.`training`
ADD COLUMN `image` VARCHAR(255) NULL AFTER `file`;

ALTER TABLE `elevatedliving_staging`.`training`
ADD COLUMN `place` VARCHAR(255) NULL AFTER `file`;

ALTER TABLE `elevatedliving_staging`.`notification`
ADD COLUMN `image` VARCHAR(255) NULL AFTER `file`;

ALTER TABLE `elevatedliving_staging`.`invoice`
ADD COLUMN `packageName` VARCHAR(255) NULL AFTER `user`,
ADD COLUMN `totalPrice` INT(11) NULL AFTER `packageName`;

CREATE TABLE `elevatedliving_staging`.`neighbourhood` (
  `createdAt` BIGINT(20) NULL,
  `updatedAt` BIGINT(20) NULL,
  `id` INT(11) NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `building_id` INT(11) NULL DEFAULT NULL,
  `tag` VARCHAR(255) NULL DEFAULT NULL,
  `image` VARCHAR(255) NULL DEFAULT NULL,
  `logo` VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `link` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);

ALTER TABLE `elevatedliving_staging`.`neighbourhood`
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `elevatedliving_staging`.`neighbourhood`
CHANGE COLUMN `tag` `tag` VARCHAR(7) NULL DEFAULT NULL ;

ALTER TABLE `elevatedliving_staging`.`product`
ADD COLUMN `invoice_path` VARCHAR(255) NULL DEFAULT NULL AFTER `exp_date`;

CREATE TABLE `elevatedliving_staging`.`book` (
  `createdAt` BIGINT(20) NULL DEFAULT NULL,
  `updatedAt` BIGINT(20) NULL DEFAULT NULL,
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(2555) NULL DEFAULT NULL,
  `price` BIGINT(20) NULL DEFAULT NULL,
  `question` BIGINT(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);

ALTER TABLE `elevatedliving_staging`.`book`
CHANGE COLUMN `question` `question` INT(11) NULL DEFAULT NULL ;

ALTER TABLE `elevatedliving_staging`.`book`
CHANGE COLUMN `question` `question_id` INT(11) NULL DEFAULT NULL ;


CREATE TABLE `elevatedliving_staging`.`question` (
  `createdAt` BIGINT(20) NULL DEFAULT NULL,
  `updatedAt` BIGINT(20) NULL DEFAULT NULL,
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `answer` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);

ALTER TABLE `elevatedliving_staging`.`question`
CHANGE COLUMN `answer` `answer_id` INT(11) NULL DEFAULT NULL ;

CREATE TABLE `elevatedliving_staging`.`answer` (
  `createdAt` BIGINT(20) NULL DEFAULT NULL,
  `updatedAt` BIGINT(20) NULL DEFAULT NULL,
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);

ALTER TABLE `elevatedliving_staging`.`answer`
CHANGE COLUMN `name` `answers` VARCHAR(255) NULL DEFAULT NULL ;

ALTER TABLE `elevatedliving_staging`.`book`
DROP COLUMN `question_id`;

ALTER TABLE `elevatedliving_staging`.`question`
CHANGE COLUMN `answer_id` `book_id` INT(11) NULL DEFAULT NULL ;

ALTER TABLE `elevatedliving_staging`.`answer`
ADD COLUMN `question_id` INT(11) NULL DEFAULT NULL AFTER `answers`;

ALTER TABLE `elevatedliving_staging`.`book`
ADD COLUMN `questions` VARCHAR(255) NULL DEFAULT NULL AFTER `price`;

DROP TABLE `elevatedliving_staging`.`answer`;
DROP TABLE `elevatedliving_staging`.`question`;

ALTER TABLE `elevatedliving_staging`.`product`
ADD COLUMN `price` INT(11) NULL DEFAULT NULL AFTER `invoice_path`;

ALTER TABLE `elevatedliving_staging`.`book`
CHANGE COLUMN `questions` `questions` MEDIUMTEXT NULL DEFAULT NULL ;

ALTER TABLE `elevatedliving_staging`.`book`
ADD COLUMN `images` VARCHAR(255) NULL DEFAULT NULL AFTER `questions`;

ALTER TABLE `elevatedliving_staging`.`building`
ADD COLUMN `category` VARCHAR(45) NULL DEFAULT NULL AFTER `postal_code`;

ALTER TABLE `elevatedliving_staging`.`neighbourhood`
ADD COLUMN `category` VARCHAR(255) NULL DEFAULT NULL AFTER `link`,
CHANGE COLUMN `link` `link` VARCHAR(255) NULL DEFAULT NULL ;
