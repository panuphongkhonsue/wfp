-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: wfpdb
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `fund` decimal(10,0) DEFAULT NULL,
  `per_times` decimal(10,0) DEFAULT NULL,
  `per_years` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `welfare_types_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_categories_welfare_types1_idx` (`welfare_types_id`),
  CONSTRAINT `fk_categories_welfare_types1` FOREIGN KEY (`welfare_types_id`) REFERENCES `welfare_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'ตรวจสุขภาพ',3000,NULL,NULL,'2025-01-25 11:03:47','2025-01-25 11:36:50',1),(2,'ทำฟัน',2000,NULL,3,'2025-01-25 11:03:47','2025-01-25 11:36:51',1),(3,'กรณีเจ็บป่วย',NULL,NULL,NULL,'2025-01-25 11:03:47','2025-01-25 11:03:47',1),(4,'สมรส',2000,NULL,1,'2025-01-25 11:05:38','2025-01-25 11:37:14',2),(5,'อุปสมบทหรือประกอบพิธีฮัจน์',2000,NULL,1,'2025-01-25 11:05:38','2025-01-25 11:37:14',2),(6,'รับขวัญบุตร',1000,NULL,NULL,'2025-01-25 11:05:38','2025-01-25 11:38:13',2),(7,'ประสบภัยพิบัติ',10000,NULL,NULL,'2025-01-25 11:05:38','2025-01-25 11:38:13',2),(8,'เสียชีวิตคนในครอบครัว',NULL,NULL,NULL,'2025-01-25 11:05:38','2025-01-25 11:05:38',2),(9,'สนับสนุนพวงหรีดในนามส่วนบุคคล',2000,NULL,NULL,'2025-01-25 11:05:38','2025-01-25 11:38:13',2),(10,'สนับสนุนพวงหรีดในนามมหาวิทยาลัยบูรพา',2000,NULL,NULL,'2025-01-25 11:05:38','2025-01-25 11:38:13',2),(11,'พาหนะเหมาจ่าย',10000,NULL,NULL,'2025-01-25 11:05:38','2025-01-25 11:38:14',2),(12,'ผู้ปฏิบัติงานสียชีวิต',10000,NULL,NULL,'2025-01-25 11:11:12','2025-01-25 11:38:14',3),(13,'สนับสนุนพวงหรีดในนามส่วนบุคคล',2000,NULL,NULL,'2025-01-25 11:11:12','2025-01-25 11:38:14',3),(14,'สนับสนุนพวงหรีดในนามมหาวิทยาลัย',2000,NULL,NULL,'2025-01-25 11:11:12','2025-01-25 11:38:14',3),(15,'พาหนะเหมาจ่าย',20000,NULL,NULL,'2025-01-25 11:11:12','2025-01-25 11:38:14',3),(16,'ก',NULL,NULL,NULL,'2025-01-25 11:11:11','2025-01-25 11:11:11',4),(17,'ข',NULL,NULL,NULL,'2025-01-25 11:11:11','2025-01-25 11:11:11',4),(18,'ก (พิบูลบำเพ็ญ)',NULL,NULL,NULL,'2025-01-25 11:11:11','2025-01-25 11:11:11',4),(19,'ข (พิบูลบำเพ็ญ)',NULL,NULL,NULL,'2025-01-25 11:11:11','2025-01-25 11:11:11',4),(20,'ค (พิบูลบำเพ็ญ)',NULL,NULL,NULL,'2025-01-25 11:11:12','2025-01-25 11:11:12',4),(21,'ก (พิบูลบำเพ็ญ นานาชาติ)',NULL,NULL,NULL,'2025-01-25 11:11:12','2025-01-25 11:11:12',4),(22,'ข (พิบูลบำเพ็ญ นานาชาติ)',NULL,NULL,NULL,'2025-01-25 11:11:12','2025-01-25 11:11:12',4);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `children`
--

DROP TABLE IF EXISTS `children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `children` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `users_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`,`users_id`),
  KEY `fk_children_users1_idx` (`users_id`),
  CONSTRAINT `fk_children_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children`
--

LOCK TABLES `children` WRITE;
/*!40000 ALTER TABLE `children` DISABLE KEYS */;
INSERT INTO `children` VALUES (1,'','2012-07-09','2025-01-25 11:46:46','2025-01-25 11:46:46',1),(6,'','2025-12-29','2025-01-29 19:54:19','2025-01-29 19:54:19',31),(7,'','2025-12-30','2025-01-29 19:54:19','2025-01-29 19:54:19',31),(8,'','2025-12-29','2025-01-29 19:55:19','2025-01-29 19:55:19',32),(9,'','2025-12-30','2025-01-29 19:55:19','2025-01-29 19:55:19',32);
/*!40000 ALTER TABLE `children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'สถาบันการศึกษา','2025-01-24 10:10:29','2025-01-24 10:10:29');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_types`
--

DROP TABLE IF EXISTS `employee_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee_types` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_types`
--

LOCK TABLES `employee_types` WRITE;
/*!40000 ALTER TABLE `employee_types` DISABLE KEYS */;
INSERT INTO `employee_types` VALUES (1,'ข้าราชการ','2025-01-24 10:07:46','2025-01-24 10:07:46'),(2,'พนักงานมหาวิทยาลัย (สิทธิข้าราชการบำนาญ)','2025-01-25 10:56:51','2025-01-25 10:56:51'),(3,'พนักงานมหาวิทยาลัย','2025-01-25 10:56:51','2025-01-25 10:56:51'),(4,'ลูกจ้างมหาวิทยาลัย','2025-01-25 10:56:51','2025-01-25 10:56:51');
/*!40000 ALTER TABLE `employee_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_category`
--

DROP TABLE IF EXISTS `log_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `fund_old` decimal(10,0) NOT NULL,
  `fund_new` decimal(10,0) NOT NULL,
  `per_times_old` decimal(10,0) NOT NULL,
  `per_times_new` decimal(10,0) NOT NULL,
  `per_years_old` int(11) NOT NULL,
  `per_years_new` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_log_category_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_log_category_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_category`
--

LOCK TABLES `log_category` WRITE;
/*!40000 ALTER TABLE `log_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_sub_category`
--

DROP TABLE IF EXISTS `log_sub_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_sub_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `fund_old` decimal(10,0) NOT NULL,
  `fund_new` decimal(10,0) NOT NULL,
  `per_times_old` decimal(10,0) NOT NULL,
  `per_times_new` decimal(10,0) NOT NULL,
  `per_years_old` int(11) NOT NULL,
  `per_years_new` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sub_categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_log_sub_category_sub_categories1_idx` (`sub_categories_id`),
  CONSTRAINT `fk_log_sub_category_sub_categories1` FOREIGN KEY (`sub_categories_id`) REFERENCES `sub_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_sub_category`
--

LOCK TABLES `log_sub_category` WRITE;
/*!40000 ALTER TABLE `log_sub_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_sub_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'สวัสดิการทั่วไป','2025-01-25 11:44:03','2025-01-25 11:44:03'),(2,'สวัสดิการค่าสงเคราะห์ต่าง ๆ','2025-01-25 11:44:03','2025-01-25 11:44:03'),(3,'สวัสดิการเกี่ยวกับการศึกษาบุตร','2025-01-25 11:44:03','2025-01-25 11:44:03'),(4,'สวัสดิการค่าสงเคราะห์การเสียชีวิต','2025-01-25 11:44:03','2025-01-25 11:44:03'),(5,'จัดการข้อมูลการเบิกสวัสดิการ','2025-01-25 11:44:03','2025-01-25 11:44:03'),(6,'จัดการข้อมูลสวัสดิการ','2025-01-25 11:44:04','2025-01-25 11:44:04'),(7,'จัดการข้อมูลบุคลากร','2025-01-25 11:44:04','2025-01-28 09:09:34'),(8,'รายงาน','2025-01-28 09:09:34','2025-01-28 09:09:34');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions_has_roles`
--

DROP TABLE IF EXISTS `permissions_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions_has_roles` (
  `permissions_id` bigint(20) NOT NULL,
  `roles_id` bigint(20) NOT NULL,
  PRIMARY KEY (`permissions_id`,`roles_id`),
  KEY `fk_permissions_has_roles_roles1_idx` (`roles_id`),
  KEY `fk_permissions_has_roles_permissions1_idx` (`permissions_id`),
  CONSTRAINT `fk_permissions_has_roles_permissions1` FOREIGN KEY (`permissions_id`) REFERENCES `permissions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_permissions_has_roles_roles1` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions_has_roles`
--

LOCK TABLES `permissions_has_roles` WRITE;
/*!40000 ALTER TABLE `permissions_has_roles` DISABLE KEYS */;
INSERT INTO `permissions_has_roles` VALUES (1,1),(2,1),(3,1),(4,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(1,4),(2,4),(3,4),(4,4),(5,4),(6,4),(7,4);
/*!40000 ALTER TABLE `permissions_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `positions` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'อาจารย์','2025-01-24 10:07:30','2025-01-24 10:07:30');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_assist`
--

DROP TABLE IF EXISTS `reimbursements_assist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_assist` (
  `id` bigint(20) NOT NULL,
  `reim_number` varchar(45) NOT NULL,
  `fund_receipt` decimal(10,0) NOT NULL,
  `fund_sum_request` decimal(10,0) NOT NULL,
  `status` enum('DRAFT','WAIT_VERIFY','APPROVED') NOT NULL,
  `deceased` varchar(255) DEFAULT NULL,
  `deceased_type` int(11) DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `draft_date` datetime DEFAULT NULL,
  `send_date` datetime DEFAULT NULL,
  `approve_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) NOT NULL,
  `created_by_children` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reimbursements_assist_users1_idx` (`created_by`,`created_by_children`),
  KEY `fk_reimbursements_assist_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_reimbursements_assist_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_assist_users1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_assist`
--

LOCK TABLES `reimbursements_assist` WRITE;
/*!40000 ALTER TABLE `reimbursements_assist` DISABLE KEYS */;
/*!40000 ALTER TABLE `reimbursements_assist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_assist_has_sub_categories`
--

DROP TABLE IF EXISTS `reimbursements_assist_has_sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_assist_has_sub_categories` (
  `reimbursements_assist_id` bigint(20) NOT NULL,
  `sub_categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`reimbursements_assist_id`,`sub_categories_id`),
  KEY `fk_reimbursements_assist_has_sub_categories_sub_categories1_idx` (`sub_categories_id`),
  KEY `fk_reimbursements_assist_has_sub_categories_reimbursements__idx` (`reimbursements_assist_id`),
  CONSTRAINT `fk_reimbursements_assist_has_sub_categories_reimbursements_as1` FOREIGN KEY (`reimbursements_assist_id`) REFERENCES `reimbursements_assist` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_assist_has_sub_categories_sub_categories1` FOREIGN KEY (`sub_categories_id`) REFERENCES `sub_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_assist_has_sub_categories`
--

LOCK TABLES `reimbursements_assist_has_sub_categories` WRITE;
/*!40000 ALTER TABLE `reimbursements_assist_has_sub_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `reimbursements_assist_has_sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_children_education`
--

DROP TABLE IF EXISTS `reimbursements_children_education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_children_education` (
  `id` bigint(20) NOT NULL,
  `reim_number` varchar(45) NOT NULL,
  `fund_receipt` decimal(10,0) NOT NULL,
  `fund_sum_request` decimal(10,0) NOT NULL,
  `fund_university` decimal(10,0) NOT NULL,
  `fund_other` decimal(10,0) NOT NULL,
  `status` enum('DRAFT','WAIT_VERIFY','APPROVED') NOT NULL,
  `spouse` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `welfare_type` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `child_type` enum('DELEGATE','COMMON') NOT NULL,
  `school` varchar(45) DEFAULT NULL,
  `education_level` varchar(45) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `father_child` varchar(255) NOT NULL,
  `mother_child` varchar(255) NOT NULL,
  `request_date` date DEFAULT NULL,
  `draft_date` datetime DEFAULT NULL,
  `send_date` datetime DEFAULT NULL,
  `approve_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) NOT NULL,
  `created_by_children` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `sub_categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `child_type_UNIQUE` (`child_type`),
  KEY `fk_reimbursements_children_education_users1_idx` (`created_by`,`created_by_children`),
  KEY `fk_reimbursements_children_education_sub_categories1_idx` (`sub_categories_id`),
  CONSTRAINT `fk_reimbursements_children_education_sub_categories1` FOREIGN KEY (`sub_categories_id`) REFERENCES `sub_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_children_education_users1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_children_education`
--

LOCK TABLES `reimbursements_children_education` WRITE;
/*!40000 ALTER TABLE `reimbursements_children_education` DISABLE KEYS */;
/*!40000 ALTER TABLE `reimbursements_children_education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_employee_deceased`
--

DROP TABLE IF EXISTS `reimbursements_employee_deceased`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_employee_deceased` (
  `id` bigint(20) NOT NULL,
  `reim_number` varchar(45) NOT NULL,
  `fund_receipt` decimal(10,0) NOT NULL,
  `fund_eligible` decimal(10,0) NOT NULL,
  `fund_sum_request` decimal(10,0) NOT NULL,
  `status` enum('DRAFT','WAIT_VERIFY','APPROVED') NOT NULL,
  `organizer` varchar(255) NOT NULL,
  `deceased` bigint(20) NOT NULL,
  `request_date` date DEFAULT NULL,
  `daft_date` datetime DEFAULT NULL,
  `send_date` datetime DEFAULT NULL,
  `approve_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_by_children` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reimbursements_employee_deceased_users1_idx` (`created_by`,`created_by_children`),
  CONSTRAINT `fk_reimbursements_employee_deceased_users1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_employee_deceased`
--

LOCK TABLES `reimbursements_employee_deceased` WRITE;
/*!40000 ALTER TABLE `reimbursements_employee_deceased` DISABLE KEYS */;
/*!40000 ALTER TABLE `reimbursements_employee_deceased` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_employee_deceased_has_categories`
--

DROP TABLE IF EXISTS `reimbursements_employee_deceased_has_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_employee_deceased_has_categories` (
  `reimbursements_employee_deceased_id` bigint(20) NOT NULL,
  `categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`reimbursements_employee_deceased_id`,`categories_id`),
  KEY `fk_reimbursements_employee_deceased_has_categories_categori_idx` (`categories_id`),
  KEY `fk_reimbursements_employee_deceased_has_categories_reimburs_idx` (`reimbursements_employee_deceased_id`),
  CONSTRAINT `fk_reimbursements_employee_deceased_has_categories_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_employee_deceased_has_categories_reimbursem1` FOREIGN KEY (`reimbursements_employee_deceased_id`) REFERENCES `reimbursements_employee_deceased` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_employee_deceased_has_categories`
--

LOCK TABLES `reimbursements_employee_deceased_has_categories` WRITE;
/*!40000 ALTER TABLE `reimbursements_employee_deceased_has_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `reimbursements_employee_deceased_has_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_general`
--

DROP TABLE IF EXISTS `reimbursements_general`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_general` (
  `id` bigint(20) NOT NULL,
  `reim_number` varchar(45) NOT NULL,
  `fund_receipt` decimal(10,0) NOT NULL,
  `fund_sum_request` decimal(10,0) NOT NULL,
  `fund_receipt_patient_visit` decimal(10,0) DEFAULT NULL,
  `fund_sum_request_patient_visit` decimal(10,0) DEFAULT NULL,
  `status` enum('DRAFT','WAIT_VERIFY','APPROVED') NOT NULL,
  `fund_decree` decimal(10,0) DEFAULT NULL,
  `fund_university` decimal(10,0) DEFAULT NULL,
  `fund_other` decimal(10,0) DEFAULT NULL,
  `date_receipt` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `draft_date` datetime DEFAULT NULL,
  `send_date` datetime DEFAULT NULL,
  `approve_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) NOT NULL,
  `created_by_children` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reimbursements_general_users1_idx` (`created_by`,`created_by_children`),
  KEY `fk_reimbursements_general_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_reimbursements_general_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_general_users1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_general`
--

LOCK TABLES `reimbursements_general` WRITE;
/*!40000 ALTER TABLE `reimbursements_general` DISABLE KEYS */;
/*!40000 ALTER TABLE `reimbursements_general` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_general_has_sub_categories`
--

DROP TABLE IF EXISTS `reimbursements_general_has_sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_general_has_sub_categories` (
  `reimbursements_general_id` bigint(20) NOT NULL,
  `sub_categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`reimbursements_general_id`,`sub_categories_id`),
  KEY `fk_reimbursements_general_has_sub_categories_sub_categories_idx` (`sub_categories_id`),
  KEY `fk_reimbursements_general_has_sub_categories_reimbursements_idx` (`reimbursements_general_id`),
  CONSTRAINT `fk_reimbursements_general_has_sub_categories_reimbursements_g1` FOREIGN KEY (`reimbursements_general_id`) REFERENCES `reimbursements_general` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_general_has_sub_categories_sub_categories1` FOREIGN KEY (`sub_categories_id`) REFERENCES `sub_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_general_has_sub_categories`
--

LOCK TABLES `reimbursements_general_has_sub_categories` WRITE;
/*!40000 ALTER TABLE `reimbursements_general_has_sub_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `reimbursements_general_has_sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'บุคลากรทั่วไป','2025-01-24 10:06:52','2025-01-24 10:06:52'),(2,'เจ้าหน้าที่ตรวจสอบ','2025-01-25 10:58:31','2025-01-25 10:58:31'),(3,'ตัวแทนผู้เบิก','2025-01-25 10:58:31','2025-01-25 10:58:31'),(4,'ผู้ดูแลระบบ','2025-01-28 07:00:56','2025-01-28 07:00:56');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector`
--

DROP TABLE IF EXISTS `sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sector` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector`
--

LOCK TABLES `sector` WRITE;
/*!40000 ALTER TABLE `sector` DISABLE KEYS */;
INSERT INTO `sector` VALUES (1,'วิศวกรรมซอฟต์แวร์','2025-01-24 10:07:09','2025-01-24 10:07:09');
/*!40000 ALTER TABLE `sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_categories`
--

DROP TABLE IF EXISTS `sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sub_categories` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `fund` decimal(10,0) NOT NULL,
  `per_times` decimal(10,0) DEFAULT NULL,
  `per_years` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `categories_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sub_categories_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_sub_categories_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,'ประสบอุบัติเหตุขณะปฏิบัติงาน',1000,NULL,NULL,'2025-01-25 11:14:34','2025-01-25 11:14:34',3),(2,'เยี่ยมไข้',1000,1000,3,'2025-01-25 11:15:34','2025-01-25 11:16:19',3),(3,'บิดา',5000,NULL,NULL,'2025-01-25 11:19:39','2025-01-25 11:19:39',8),(4,'มารดา',5000,NULL,NULL,'2025-01-25 11:19:39','2025-01-25 11:19:39',8),(5,'คู่สมรส',5000,NULL,NULL,'2025-01-25 11:19:39','2025-01-25 11:19:39',8),(6,'บุตร',5000,NULL,NULL,'2025-01-25 11:19:39','2025-01-25 11:19:39',8),(7,'ระดับมัธยมศึกษาปีที่ 1 - 3',7700,3850,2,'2025-01-25 11:23:37','2025-01-25 11:23:37',16),(8,'ระดับมัธยมศึกษาปีที่ 4 - 6',7700,3850,2,'2025-01-25 11:23:37','2025-01-25 11:23:37',16),(9,'ระดับปฐมวัย',6000,3000,2,'2025-01-25 11:23:37','2025-01-25 11:23:37',17),(10,'ระดับปฐมศึกษาปีที่ 1 - 3',6400,3200,2,'2025-01-25 11:23:37','2025-01-25 11:31:17',17),(11,'ระดับปฐมศึกษาปีที่ 4 - 6',7100,3550,2,'2025-01-25 11:23:37','2025-01-25 11:31:17',17),(12,'ระดับมัธยมศึกษาปีที่ 1 - 3',10300,5150,2,'2025-01-25 11:23:38','2025-01-25 11:31:17',17),(13,'ระดับมัธยมศึกษาปีที่ 4 – 6 (หรือเทียบเท่า)',13300,6650,2,'2025-01-25 11:23:38','2025-01-25 11:31:17',17),(14,'ระดับปฐมวัยโปรแกรมทั่วไป',14400,7200,2,'2025-01-25 11:31:16','2025-01-25 11:31:16',18),(15,'ระดับปฐมวัยโปรแกรมเน้นความสามารถทางภาษา',23400,11700,2,'2025-01-25 11:31:16','2025-01-25 11:31:16',18),(16,'ระดับปฐมศึกษาปีที่ 1 – 6 โปรแกรมทั่วไป',9000,4500,2,'2025-01-25 11:31:16','2025-01-25 11:31:16',19),(17,'ระดับปฐมศึกษาปีที่ 1 – 6 โปรแกรมเน้นความสามารถทางภาษา',18000,9000,2,'2025-01-25 11:31:16','2025-01-25 11:31:16',19),(18,'ระดับปฐมศึกษาปีที่ 1 – 6 โปรแกรมศึกษาพิเศษแบบบูรณาการ',39000,19500,2,'2025-01-25 11:31:16','2025-01-25 11:31:16',19),(19,'ระดับมัธยมศึกษาโปรแกรมทั่วไป',9000,4500,2,'2025-01-25 11:31:16','2025-01-25 11:31:16',20),(20,'ระดับมัธยมศึกษาโปรแกรมเน้นความสามารถทางภาษา',21000,10500,2,'2025-01-25 11:31:17','2025-01-25 11:31:17',20),(21,'ระดับมัธยมศึกษาโปรแกรมเน้นความสามารถทางคณิต-วิทย์',21000,10500,2,'2025-01-25 11:31:17','2025-01-25 11:31:17',20),(22,'ระดับมัธยมศึกษาโปรแกรมศึกษาพิเศษแบบบูรณาการ',39000,19500,2,'2025-01-25 11:31:17','2025-01-25 11:31:17',20),(23,'ระดับปฐมศึกษาปีที่ 1 – 6',37300,18650,2,'2025-01-25 11:33:44','2025-01-25 11:33:44',21),(24,'ระดับมัธยมศึกษาปีที่ 1 - 6',37300,18650,2,'2025-01-25 11:33:44','2025-01-25 11:33:44',21),(25,'ระดับปฐมศึกษาปีที่ 1 - 3',38600,19300,2,'2025-01-25 11:33:44','2025-01-25 11:33:44',22),(26,'ระดับปฐมศึกษาปีที่ 4 - 6',37900,18950,2,'2025-01-25 11:33:44','2025-01-25 11:33:44',22),(27,'ระดับมัธยมศึกษาปีที่ 1 - 3',34700,17350,2,'2025-01-25 11:33:44','2025-01-25 11:33:44',22),(28,'ระดับมัธยมศึกษาปีที่ 4 - 6',31700,15850,2,'2025-01-25 11:33:44','2025-01-25 11:33:44',22);
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_working_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `employee_types_id` bigint(20) NOT NULL,
  `positions_id` bigint(20) NOT NULL,
  `departments_id` bigint(20) NOT NULL,
  `roles_id` bigint(20) NOT NULL,
  `sector_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_users_employee_types1_idx` (`employee_types_id`),
  KEY `fk_users_positions1_idx` (`positions_id`),
  KEY `fk_users_departments1_idx` (`departments_id`),
  KEY `fk_users_roles1_idx` (`roles_id`),
  KEY `fk_users_sector1_idx` (`sector_id`),
  CONSTRAINT `fk_users_departments1` FOREIGN KEY (`departments_id`) REFERENCES `departments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_employee_types1` FOREIGN KEY (`employee_types_id`) REFERENCES `employee_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_positions1` FOREIGN KEY (`positions_id`) REFERENCES `positions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_roles1` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_sector1` FOREIGN KEY (`sector_id`) REFERENCES `sector` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'','','admin','$2a$12$uwYPIKhfw0dtYNC36DOuAu0aJ2J11Tt.O1jJLW3fuc5XBjgDTWEd.','2025-01-24','2025-01-24 10:10:32','2025-01-28 07:45:15',NULL,1,1,1,4,1),(2,'','64160282@go.buu.ac.th','64160282',NULL,'2024-01-01','2025-01-28 07:08:54','2025-01-28 07:08:54',NULL,3,1,1,2,1),(3,'','64160284@go.buu.ac.th','64160284',NULL,'2024-12-25','2025-01-28 07:08:54','2025-01-28 07:08:54',NULL,2,1,1,3,1),(4,'','6416290@go.buu.ac.th','64160290',NULL,'2025-02-03','2025-01-28 07:08:54','2025-01-28 07:08:54',NULL,4,1,1,1,1),(5,'','64160173@go.buu.ac.th','64160173',NULL,'2024-09-15','2025-01-28 07:11:05','2025-01-29 09:30:49','2025-01-28 07:11:05',1,1,1,1,1),(6,'','64160283@buu.ac.th','64160283',NULL,'2025-01-29','2025-01-29 17:00:31','2025-01-29 17:00:31',NULL,1,1,1,1,1),(31,'','6411123123@buu.ac.th','6411123123',NULL,'2025-01-29','2025-01-29 19:54:19','2025-01-29 19:54:19',NULL,1,1,1,1,1),(32,'','6411123123123@buu.ac.th','6411123123123',NULL,'2025-01-29','2025-01-29 19:55:19','2025-01-29 19:55:19',NULL,1,1,1,1,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `view_category_welfare_sub`
--

DROP TABLE IF EXISTS `view_category_welfare_sub`;
/*!50001 DROP VIEW IF EXISTS `view_category_welfare_sub`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_category_welfare_sub` AS SELECT
 1 AS `welfare_id`,
  1 AS `welfare_name`,
  1 AS `category_id`,
  1 AS `catgory_name`,
  1 AS `category_per_times`,
  1 AS `category_per_years`,
  1 AS `sub_category_id`,
  1 AS `sub_category_name`,
  1 AS `sub_category_per_times`,
  1 AS `sub_category_per_years` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `welfare_types`
--

DROP TABLE IF EXISTS `welfare_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `welfare_types` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `welfare_types`
--

LOCK TABLES `welfare_types` WRITE;
/*!40000 ALTER TABLE `welfare_types` DISABLE KEYS */;
INSERT INTO `welfare_types` VALUES (1,'ประเภทสวัสดิการทั่วไป','2025-01-25 11:02:18','2025-01-25 11:02:18'),(2,'ประเภทสวัสดิการค่าสงเคราะห์ต่าง ๆ','2025-01-25 11:02:18','2025-01-25 11:02:18'),(3,'ประเภทสวัสดิการค่าสงเคราะห์การเสียชีวิตของผู้ปฏิบัติงาน','2025-01-25 11:02:18','2025-01-25 11:43:04'),(4,'ประเภทสวัสดิการเกี่ยวกับการศึกษาของบุตร','2025-01-25 11:02:18','2025-01-25 11:43:04');
/*!40000 ALTER TABLE `welfare_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `view_category_welfare_sub`
--

/*!50001 DROP VIEW IF EXISTS `view_category_welfare_sub`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_category_welfare_sub` AS select `category_welfare_type`.`welfare_id` AS `welfare_id`,`category_welfare_type`.`welfare_name` AS `welfare_name`,`category_welfare_type`.`category_id` AS `category_id`,`category_welfare_type`.`catgory_name` AS `catgory_name`,`category_welfare_type`.`category_per_times` AS `category_per_times`,`category_welfare_type`.`category_per_years` AS `category_per_years`,`sub`.`id` AS `sub_category_id`,`sub`.`name` AS `sub_category_name`,`sub`.`per_times` AS `sub_category_per_times`,`sub`.`per_years` AS `sub_category_per_years` from ((select `welfare`.`id` AS `welfare_id`,`welfare`.`name` AS `welfare_name`,`cat`.`id` AS `category_id`,`cat`.`name` AS `catgory_name`,`cat`.`per_times` AS `category_per_times`,`cat`.`per_years` AS `category_per_years` from (`welfare_types` `welfare` left join `categories` `cat` on(`welfare`.`id` = `cat`.`welfare_types_id`))) `category_welfare_type` left join `sub_categories` `sub` on(`category_welfare_type`.`category_id` = `sub`.`categories_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-31 19:52:48
