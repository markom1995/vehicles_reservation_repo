-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.3.8-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.5.0.5289
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for vehicles_reservation_db
DROP DATABASE IF EXISTS `vehicles_reservation_db`;
CREATE DATABASE IF NOT EXISTS `vehicles_reservation_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `vehicles_reservation_db`;

-- Dumping structure for table vehicles_reservation_db.company
CREATE TABLE IF NOT EXISTS `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `logo` longblob NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.location
CREATE TABLE IF NOT EXISTS `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `address` varchar(128) NOT NULL,
  `longitude` float(10,6) NOT NULL,
  `latitude` float(10,6) NOT NULL,
  `description` text DEFAULT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_location_company` (`company_id`),
  CONSTRAINT `FK_location_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.logger
CREATE TABLE IF NOT EXISTS `logger` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_type` varchar(128) NOT NULL,
  `action_details` text NOT NULL,
  `table_name` varchar(128) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  `atomic` tinyint(4) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_logger_user` (`user_id`),
  KEY `FK_logger_company` (`company_id`),
  CONSTRAINT `FK_logger_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `FK_logger_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.mail_status
CREATE TABLE IF NOT EXISTS `mail_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.reservation
CREATE TABLE IF NOT EXISTS `reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `start_km` int(11) DEFAULT NULL,
  `end_km` int(11) DEFAULT NULL,
  `direction` text NOT NULL,
  `reservation_status_id` int(11) NOT NULL,
  `deleted` tinyint(4) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reservation_user` (`user_id`),
  KEY `FK_reservation_vehicle` (`vehicle_id`),
  KEY `FK_reservation_company` (`company_id`),
  KEY `FK?reservation_reservation_status` (`reservation_status_id`),
  CONSTRAINT `FK?reservation_reservation_status` FOREIGN KEY (`reservation_status_id`) REFERENCES `reservation_status` (`id`),
  CONSTRAINT `FK_reservation_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `FK_reservation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_reservation_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.reservation_status
CREATE TABLE IF NOT EXISTS `reservation_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.role
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `username` varchar(128) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `first_name` varchar(128) DEFAULT NULL,
  `last_name` varchar(128) DEFAULT NULL,
  `photo` longblob DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  `request` tinyint(4) NOT NULL,
  `token` char(16) DEFAULT NULL,
  `token_time` datetime DEFAULT NULL,
  `mail_status_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_user_company` (`company_id`),
  KEY `FK_user_role` (`role_id`),
  KEY `FK_user_mail_status` (`mail_status_id`),
  KEY `FK_user_location` (`location_id`),
  CONSTRAINT `FK_user_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `FK_user_location` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  CONSTRAINT `FK_user_mail_status` FOREIGN KEY (`mail_status_id`) REFERENCES `mail_status` (`id`),
  CONSTRAINT `FK_user_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.vehicle
CREATE TABLE IF NOT EXISTS `vehicle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `license_plate` varchar(128) NOT NULL,
  `vehicle_model_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `engine` varchar(128) NOT NULL,
  `fuel` varchar(128) NOT NULL,
  `photo` longblob DEFAULT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  `location_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_vehicle_vehicle_model` (`vehicle_model_id`),
  KEY `FK_vehicle_location` (`location_id`),
  KEY `FK_vehicle_company` (`company_id`),
  CONSTRAINT `FK_vehicle_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `FK_vehicle_location` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  CONSTRAINT `FK_vehicle_vehicle_model` FOREIGN KEY (`vehicle_model_id`) REFERENCES `vehicle_model` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.vehicle_maintenance
CREATE TABLE IF NOT EXISTS `vehicle_maintenance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vehicle_maintenance_type_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `price` float(7,2) NOT NULL,
  `date` date NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  `vehicle_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_vehicle_maintenance_vehicle_maintenance_type` (`vehicle_maintenance_type_id`),
  KEY `FK_vehicle_maintenance_vehicle` (`vehicle_id`),
  KEY `FK_vehicle_maintenance_company` (`company_id`),
  CONSTRAINT `FK_vehicle_maintenance_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `FK_vehicle_maintenance_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`id`),
  CONSTRAINT `FK_vehicle_maintenance_vehicle_maintenance_type` FOREIGN KEY (`vehicle_maintenance_type_id`) REFERENCES `vehicle_maintenance_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.vehicle_maintenance_type
CREATE TABLE IF NOT EXISTS `vehicle_maintenance_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.vehicle_manufacturer
CREATE TABLE IF NOT EXISTS `vehicle_manufacturer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_vehicle_manufacturer_company` (`company_id`),
  CONSTRAINT `FK_vehicle_manufacturer_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table vehicles_reservation_db.vehicle_model
CREATE TABLE IF NOT EXISTS `vehicle_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `vehicle_manufacturer_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_vehicle_model_vehicle_manufacturer` (`vehicle_manufacturer_id`),
  CONSTRAINT `FK_vehicle_model_vehicle_manufacturer` FOREIGN KEY (`vehicle_manufacturer_id`) REFERENCES `vehicle_manufacturer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
