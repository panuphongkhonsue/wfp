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
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fund` decimal(10,2) DEFAULT NULL,
  `per_times` decimal(10,2) DEFAULT NULL,
  `per_years` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `welfare_types_id` bigint(20) NOT NULL,
  `per_users` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_categories_welfare_types1_idx` (`welfare_types_id`),
  CONSTRAINT `fk_categories_welfare_types1` FOREIGN KEY (`welfare_types_id`) REFERENCES `welfare_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'ตรวจสุขภาพ',5000.00,3900.00,NULL,'2025-01-25 11:03:47','2025-03-11 23:54:22',1,NULL),(2,'ทำฟัน',2000.00,2000.00,3,'2025-01-25 11:03:47','2025-03-02 12:12:35',1,NULL),(3,'กรณีเจ็บป่วย',NULL,NULL,NULL,'2025-01-25 11:03:47','2025-01-25 11:03:47',1,NULL),(4,'สมรส',3000.00,NULL,NULL,'2025-01-25 11:05:38','2025-03-11 23:36:51',2,1),(5,'อุปสมบทหรือประกอบพิธีฮัจน์',2000.00,NULL,NULL,'2025-01-25 11:05:38','2025-03-11 23:31:44',2,1),(6,'รับขวัญบุตร',1000.00,NULL,NULL,'2025-01-25 11:05:38','2025-03-12 15:50:01',2,NULL),(7,'ประสบภัยพิบัติ',20000.00,NULL,NULL,'2025-01-25 11:05:38','2025-03-12 15:50:01',2,NULL),(8,'เสียชีวิตคนในครอบครัว',NULL,NULL,NULL,'2025-01-25 11:05:38','2025-01-25 11:05:38',2,NULL),(9,'ผู้ปฏิบัติงานเสียชีวิต',NULL,10000.00,NULL,'2025-01-25 11:11:12','2025-02-20 09:31:08',3,NULL),(10,'สนับสนุนพวงหรีดในนามส่วนบุคคล',NULL,2000.00,NULL,'2025-01-25 11:11:12','2025-02-20 09:34:44',3,NULL),(11,'สนับสนุนพวงหรีดในนามมหาวิทยาลัยบูรพา',NULL,2000.00,NULL,'2025-01-25 11:11:12','2025-02-20 09:34:44',3,NULL),(12,'พาหนะเหมาจ่าย',NULL,20000.00,NULL,'2025-01-25 11:11:12','2025-02-20 09:34:44',3,NULL),(13,'ก',NULL,NULL,NULL,'2025-01-25 11:11:11','2025-02-05 11:29:13',4,NULL),(14,'ข',NULL,NULL,NULL,'2025-01-25 11:11:11','2025-02-05 11:30:12',4,NULL),(15,'ค พิบูลบำเพ็ญ',NULL,NULL,NULL,'2025-01-25 11:11:11','2025-03-12 09:12:07',4,NULL),(16,'ก (พิบูลบำเพ็ญ นานาชาติ)',NULL,NULL,NULL,'2025-01-25 11:11:12','2025-02-19 10:27:24',4,NULL),(17,'ข (พิบูลบำเพ็ญ นานาชาติ)',NULL,NULL,NULL,'2025-01-25 11:11:12','2025-02-19 10:27:24',4,NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `children`
--

DROP TABLE IF EXISTS `children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `children` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  `users_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`,`users_id`),
  KEY `fk_children_users1_idx` (`users_id`),
  CONSTRAINT `fk_children_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children`
--

LOCK TABLES `children` WRITE;
/*!40000 ALTER TABLE `children` DISABLE KEYS */;
INSERT INTO `children` VALUES (1,'การบูรณ์ เรืองไทย','2012-07-09','2025-01-25 11:46:46','2025-02-01 08:53:27',NULL,0,0,1),(6,'นาย สุทะพัด เรืองไทย','2002-05-12','2025-02-02 05:38:41','2025-02-25 14:34:22',NULL,0,1,2),(12,'ด.ช ทรงโปรด แวงดงบังไพศาล','2010-02-01','2025-02-14 18:39:21','2025-03-05 09:00:22',NULL,1,1,43),(51,'นาย เกสร แวงดงบังไพศาล','2002-05-12','2025-02-07 16:47:30','2025-02-25 14:34:22',NULL,1,1,2),(52,'นีน่า มิซีลี้','2002-05-12','2025-02-10 16:37:40','2025-02-14 19:00:59',NULL,1,1,56),(53,'สาหรัน เหลืองชมพู','2025-02-04','2025-02-11 13:52:40','2025-02-11 13:52:40',NULL,2,2,64),(54,'ใจดี สีสมร','2025-02-03','2025-02-11 14:05:41','2025-02-11 14:05:41',NULL,2,2,65),(55,'บุตรคนที่ 1','2025-02-03','2025-02-11 14:08:43','2025-02-11 14:08:43',NULL,2,2,66),(56,'บุตรคนที่ 2','2025-02-03','2025-02-11 14:08:43','2025-02-24 01:18:24',NULL,2,2,1),(57,'กันตนา แวงดงบังไพศาล','2002-05-12','2025-02-11 14:11:42','2025-02-15 07:57:18','2025-02-15 07:57:18',2,1,43),(58,'นฤนา แวงดงบังไพศาล','2002-05-12','2025-02-11 14:11:42','2025-02-15 06:48:50','2025-02-15 06:48:50',2,1,43),(78,'บุตรคนที่ 3','2025-02-06','2025-02-11 14:37:00','2025-02-11 14:37:00',NULL,2,2,66),(81,'ภูริน ภูริช','2025-02-12','2025-02-11 14:41:09','2025-02-11 16:19:06','2025-02-11 16:19:05',2,2,67),(82,'ภูริน แจ่มใส','2025-02-04','2025-02-11 14:41:09','2025-02-11 16:19:20','2025-02-11 16:19:19',2,2,67),(83,'ภูริช แจ่มศรี','2025-02-02','2025-02-11 14:41:26','2025-02-11 16:14:55','2025-02-11 16:14:54',2,2,67),(86,'บุตร ทดสอบก่อนใคร','2025-02-03','2025-02-11 15:45:18','2025-02-11 15:45:18',NULL,2,2,70),(87,'เบนจี้ มิน','2026-02-13','2025-02-12 17:04:12','2025-02-12 17:06:43','2025-02-12 17:06:43',1,1,71),(88,'เบนเบน มิน','2028-02-11','2025-02-12 17:05:55','2025-02-12 17:08:20','2025-02-12 17:08:20',1,1,71),(90,'เบนจี้ มิน','2027-02-05','2025-02-12 17:07:51','2025-02-12 17:07:51',NULL,1,1,71),(92,'เพิ่มลูก ทดสอบ','2025-02-02','2025-02-12 18:15:04','2025-02-12 18:15:04',NULL,1,1,72),(93,'นฤนา แวงดงบังไพศาล','2002-05-12','2025-02-14 07:32:18','2025-02-15 06:43:24','2025-02-15 06:43:24',1,1,43),(98,'นฤนา แวงดงบังไพศาล','2002-05-12','2025-02-14 13:52:29','2025-02-15 06:43:24','2025-02-15 06:43:24',1,1,43),(104,'ลูก คนแรก','2024-02-01','2025-02-19 15:43:48','2025-02-19 15:48:02','2025-02-19 15:48:02',1,1,74),(105,'ลูก คนแรก','2024-02-05','2025-02-19 15:46:22','2025-02-19 15:46:46','2025-02-19 15:46:46',1,1,75),(106,'ลูก คนสาม','2025-02-06','2025-02-19 15:46:22','2025-02-19 15:51:32',NULL,1,1,75),(107,'ลูก คนสาม','2025-02-18','2025-02-19 15:47:08','2025-02-19 15:47:08',NULL,1,1,75),(109,'ลูก คนสอง','2025-02-03','2025-02-19 15:47:47','2025-02-19 15:47:47',NULL,1,1,74),(110,'ลูก คนสาม','2025-02-06','2025-02-19 15:47:47','2025-02-19 15:47:47',NULL,1,1,74),(112,'ลูก คนสาม','2025-02-18','2025-02-19 15:49:09','2025-02-19 15:49:09',NULL,1,1,75),(113,'One เบรค','2020-02-01','2025-02-24 00:05:01','2025-02-24 00:05:01',NULL,1,1,76),(114,'ทู เบรค','2023-02-28','2025-02-24 00:05:01','2025-02-24 00:05:01',NULL,1,1,76),(115,'ทรี เบรค','2029-02-24','2025-02-24 00:07:57','2025-02-24 00:07:57',NULL,1,1,76),(116,'ลูก ทดสอบ','2021-02-01','2025-02-25 07:30:34','2025-02-25 07:30:34',NULL,1,1,34),(117,'ทดสอบ ลูก','2015-02-03','2025-02-25 07:32:11','2025-02-25 07:32:11',NULL,1,1,35),(118,'สัก ชาย','2020-02-01','2025-02-25 08:40:16','2025-02-25 08:40:16',NULL,1,1,77),(119,'ลูก คนที่สอง','2020-02-15','2025-02-25 08:40:16','2025-02-25 08:40:16',NULL,1,1,77),(120,'ด.ช การบูร แวงดงบังไพศาล','2025-02-03','2025-02-25 14:34:22','2025-02-25 14:34:22',NULL,1,1,2),(121,'ด.ช ทรงรัก แวงดงบังไพศาล','2014-03-22','2025-03-05 08:52:16','2025-03-05 09:00:22',NULL,1,1,43),(123,'ด.ญ ทรงฤทัย แวงดงบังไพศาล','2016-03-16','2025-03-05 09:02:24','2025-03-05 09:02:42',NULL,1,1,43),(124,'ด.ญ. ชมพู ใหม่','2015-03-15','2025-03-11 03:54:07','2025-03-11 03:55:00','2025-03-11 03:55:00',43,43,78),(125,'ด.ช. บลู ใหม่','2016-03-16','2025-03-11 03:54:07','2025-03-11 03:55:00',NULL,43,43,78),(126,'ด.ช. ทีล ใหม่','2017-03-17','2025-03-11 03:55:00','2025-03-11 03:55:00',NULL,43,43,78),(128,'ด.ช. ดำ คนดี','2019-03-05','2025-03-11 08:12:00','2025-03-11 08:12:00',NULL,1,1,79),(129,'ด.ญ. ชมพู คนดี','2024-10-06','2025-03-11 08:12:00','2025-03-11 08:12:00',NULL,1,1,79),(130,'ด.ช. เขียว คนดี','2015-03-09','2025-03-11 08:12:00','2025-03-11 08:12:00',NULL,1,1,79),(131,'ด.ญ. ส้ม คนดี','2006-12-10','2025-03-11 08:12:00','2025-03-11 08:12:00',NULL,1,1,79);
/*!40000 ALTER TABLE `children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `children_infomation`
--

DROP TABLE IF EXISTS `children_infomation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `children_infomation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fund_receipt` decimal(10,2) NOT NULL,
  `fund_eligible` decimal(10,2) NOT NULL,
  `fund_sum_request` decimal(10,2) NOT NULL,
  `child_name` varchar(255) NOT NULL,
  `child_number` int(11) NOT NULL,
  `child_birth_day` date NOT NULL,
  `child_father_number` int(11) NOT NULL,
  `child_mother_number` int(11) NOT NULL,
  `child_type` enum('DELEGATE','COMMON') NOT NULL,
  `school_name` varchar(255) NOT NULL,
  `school_type` enum('ทั่วไป','สาธิตพิบูลบําเพ็ญ') NOT NULL,
  `district` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `delegate_name` varchar(255) DEFAULT NULL,
  `delegate_number` int(11) DEFAULT NULL,
  `delegate_birth_day` date DEFAULT NULL,
  `delegate_death_day` date DEFAULT NULL,
  `fund_university` decimal(10,2) DEFAULT NULL,
  `fund_sub_university` decimal(10,2) DEFAULT NULL,
  `fund_other` decimal(10,2) DEFAULT NULL,
  `sub_categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_children_infomation_sub_categories1_idx` (`sub_categories_id`),
  CONSTRAINT `fk_children_infomation_sub_categories1` FOREIGN KEY (`sub_categories_id`) REFERENCES `sub_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children_infomation`
--

LOCK TABLES `children_infomation` WRITE;
/*!40000 ALTER TABLE `children_infomation` DISABLE KEYS */;
INSERT INTO `children_infomation` VALUES (128,1000.00,0.00,1800.00,'กันตนา แวงดงบังไพศาล',0,'2002-05-12',1,1,'COMMON','อนุบาลหนองใหญ่','ทั่วไป','เมือง','ชลบุรี',NULL,NULL,NULL,NULL,2000.00,NULL,200.00,10),(133,10000.00,0.00,-14000.00,'กันตนา แวงดงบังไพศาล',0,'2002-05-12',1,1,'COMMON','พิบูลบำเพ็ญ','ทั่วไป','เมือง','ชลบุรี',NULL,NULL,NULL,NULL,3000.00,NULL,17000.00,27),(134,15000.00,0.00,2000.00,'สุทะพัด เรืองไทย',0,'2002-05-12',1,1,'COMMON','มัธยมพระราชทานนายาว','ทั่วไป','สนามชัยเขต','ฉะเชิงเทรา',NULL,NULL,NULL,NULL,3000.00,NULL,1000.00,10),(137,1000.00,0.00,1800.00,'นาย เกสร แวงดงบังไพศาล',0,'2002-05-12',1,1,'COMMON','ุถะััีะั','ทั่วไป','kmkm',', ,k ;,,',NULL,NULL,NULL,NULL,2000.00,NULL,200.00,10),(138,1000.00,0.00,-450.00,'ด.ช ทรงโปรด แวงดงบังไพศาล',0,'2010-02-01',1,1,'COMMON','พิบูลบำเพ็ญ','ทั่วไป','แสนสุข','ชลบุรี',NULL,NULL,NULL,NULL,50.00,NULL,500.00,22),(144,10000.00,0.00,2000.00,'การบูรณ์ เรืองไทย',1,'2012-07-09',1,1,'COMMON','โรงเรียนหนองคิมิโนโต๊ะ','ทั่วไป','เมืองสมุทรปราการ','สมุทรปราการ',NULL,NULL,NULL,NULL,2000.00,0.00,200.00,10),(145,10000.00,0.00,5000.00,'การบูรณ์ เรืองไทย',1,'2012-07-09',1,1,'COMMON','โรงเรียนหนองคิมิโนโต๊ะ','ทั่วไป','ไชโย','อ่างทอง',NULL,NULL,NULL,NULL,5000.00,0.00,2000.00,10),(146,60000.00,0.00,20000.00,'การบูรณ์ เรืองไทย',1,'2012-07-09',1,1,'COMMON','โรงเรียนหนองคิมิโนโต๊ะ','สาธิตพิบูลบําเพ็ญ','เมืองชลบุรี','ชลบุรี',NULL,NULL,NULL,NULL,20000.00,0.00,1000.00,22),(147,5000.00,0.00,4000.00,'บุตรคนที่ 2',2,'2025-02-03',2,2,'COMMON','โรงเรียนบ้านหนองบึง','ทั่วไป','บ้านบึง','ชลบุรี',NULL,NULL,NULL,NULL,4000.00,0.00,200.00,11);
/*!40000 ALTER TABLE `children_infomation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
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
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_types`
--

LOCK TABLES `employee_types` WRITE;
/*!40000 ALTER TABLE `employee_types` DISABLE KEYS */;
INSERT INTO `employee_types` VALUES (1,'ข้าราชการ / ลูกจ้างประจำ','2025-01-24 10:07:46','2025-02-19 08:40:33'),(2,'พนักงานมหาวิทยาลัย (สิทธิข้าราชการบำนาญ)','2025-01-25 10:56:51','2025-01-25 10:56:51'),(3,'พนักงานมหาวิทยาลัย','2025-01-25 10:56:51','2025-01-25 10:56:51'),(4,'ลูกจ้างมหาวิทยาลัย','2025-01-25 10:56:51','2025-01-25 10:56:51');
/*!40000 ALTER TABLE `employee_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_category`
--

DROP TABLE IF EXISTS `log_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fund_old` decimal(10,2) DEFAULT NULL,
  `fund_new` decimal(10,2) DEFAULT NULL,
  `per_times_old` decimal(10,2) DEFAULT NULL,
  `per_times_new` decimal(10,2) DEFAULT NULL,
  `per_years_old` int(11) DEFAULT NULL,
  `per_years_new` int(11) DEFAULT NULL,
  `per_users_old` int(11) DEFAULT NULL,
  `per_users_new` int(11) DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_log_category_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_log_category_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_category`
--

LOCK TABLES `log_category` WRITE;
/*!40000 ALTER TABLE `log_category` DISABLE KEYS */;
INSERT INTO `log_category` VALUES (3,'ตรวจสุขภาพ',4000.00,5000.00,NULL,100.00,3,4,NULL,NULL,43,'2025-02-06 03:59:03','2025-02-06 03:59:03',1),(4,'ตรวจสุขภาพ',5000.00,5000.00,100.00,NULL,4,NULL,NULL,NULL,43,'2025-02-06 04:45:36','2025-02-06 04:45:36',1),(5,'ตรวจสุขภาพ',5000.00,5000.00,NULL,NULL,4,NULL,NULL,NULL,43,'2025-02-06 04:46:34','2025-02-06 04:46:34',1),(6,'ทำฟัน',3000.00,3000.00,NULL,NULL,3,NULL,NULL,NULL,1,'2025-02-06 05:54:12','2025-02-06 05:54:12',2),(7,'ตรวจสุขภาพ',5000.00,3000.00,NULL,NULL,NULL,NULL,NULL,NULL,1,'2025-02-06 06:56:03','2025-02-06 06:56:03',1),(8,'ตรวจสุขภาพ',3000.00,3000.00,NULL,1500.00,NULL,2,NULL,NULL,1,'2025-02-06 06:56:34','2025-02-06 06:56:34',1),(9,'ตรวจสุขภาพ',3000.00,3000.00,1500.00,NULL,2,NULL,NULL,NULL,1,'2025-02-06 07:02:44','2025-02-06 07:02:44',1),(10,'ตรวจสุขภาพ',9500.00,9500.00,900.00,1000.00,NULL,NULL,NULL,NULL,1,'2025-02-06 08:37:20','2025-02-06 08:37:20',1),(11,'ตรวจสุขภาพ',9500.00,10000.00,1000.00,9500.00,NULL,NULL,NULL,NULL,1,'2025-02-06 08:43:55','2025-02-06 08:43:55',1),(12,'ตรวจสุขภาพ',10000.00,10000.00,9500.00,11000.00,NULL,NULL,NULL,NULL,1,'2025-02-06 08:44:01','2025-02-06 08:44:01',1),(13,'ตรวจสุขภาพ',10000.00,10000.00,11000.00,9000.00,NULL,NULL,NULL,NULL,1,'2025-02-06 08:44:07','2025-02-06 08:44:07',1),(14,'ตรวจสุขภาพ',10000.00,5000.00,9000.00,3000.00,NULL,NULL,NULL,NULL,1,'2025-02-06 08:44:50','2025-02-06 08:44:50',1),(15,'ตรวจสุขภาพ',5000.00,6000.00,3000.00,5000.00,NULL,NULL,NULL,NULL,1,'2025-02-06 08:44:57','2025-02-06 08:44:57',1),(16,'ตรวจสุขภาพ',6000.00,7000.00,5000.00,6000.00,NULL,NULL,NULL,NULL,1,'2025-02-06 08:45:17','2025-02-06 08:45:17',1),(17,'ตรวจสุขภาพ',7000.00,8000.00,6000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-22 11:16:53','2025-02-22 11:16:53',1),(18,'ตรวจสุขภาพ',8000.00,9000.00,6000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-22 11:17:05','2025-02-22 11:17:05',1),(19,'ตรวจสุขภาพ',7000.00,8000.00,6000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-22 11:24:22','2025-02-22 11:24:22',1),(20,'ตรวจสุขภาพ',6000.00,8000.00,6000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-22 11:27:20','2025-02-22 11:27:20',1),(21,'ทำฟัน',2000.00,4000.00,1000.00,NULL,3,NULL,NULL,NULL,2,'2025-02-22 11:42:20','2025-02-22 11:42:20',2),(22,'ทำฟัน',4000.00,4000.00,1000.00,NULL,3,4,NULL,NULL,2,'2025-02-22 11:42:42','2025-02-22 11:42:42',2),(23,'ทำฟัน',4000.00,2000.00,1000.00,NULL,4,3,NULL,NULL,1,'2025-02-24 10:11:24','2025-02-24 10:11:24',2),(24,'ตรวจสุขภาพ',8000.00,3000.00,6000.00,NULL,NULL,NULL,NULL,NULL,1,'2025-02-24 17:40:36','2025-02-24 17:40:36',1),(25,'ตรวจสุขภาพ',3000.00,3000.00,NULL,NULL,NULL,3,NULL,NULL,43,'2025-02-24 17:41:32','2025-02-24 17:41:32',1),(26,'ตรวจสุขภาพ',3000.00,3000.00,NULL,NULL,3,NULL,NULL,NULL,43,'2025-02-24 17:42:04','2025-02-24 17:42:04',1),(27,'ตรวจสุขภาพ',3000.00,3000.00,NULL,100.00,NULL,NULL,NULL,NULL,43,'2025-02-24 17:44:45','2025-02-24 17:44:45',1),(28,'ตรวจสุขภาพ',3000.00,3000.00,100.00,NULL,NULL,NULL,NULL,NULL,43,'2025-02-24 17:45:23','2025-02-24 17:45:23',1),(29,'ตรวจสุขภาพ',3000.00,3000.00,NULL,100.00,NULL,NULL,NULL,NULL,43,'2025-02-24 17:46:25','2025-02-24 17:46:25',1),(30,'ตรวจสุขภาพ',3000.00,8000.00,100.00,NULL,NULL,NULL,NULL,NULL,1,'2025-02-25 07:01:45','2025-02-25 07:01:45',1),(31,'ตรวจสุขภาพ',8000.00,8000.00,100.00,NULL,NULL,NULL,NULL,NULL,1,'2025-02-25 07:01:54','2025-02-25 07:01:54',1),(32,'ตรวจสุขภาพ',8000.00,7000.00,NULL,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 08:56:11','2025-02-25 08:56:11',1),(33,'ตรวจสุขภาพ',7000.00,7000.00,NULL,5000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 13:58:11','2025-02-25 13:58:11',1),(34,'ตรวจสุขภาพ',7000.00,7000.00,5000.00,300.00,NULL,NULL,NULL,NULL,2,'2025-02-25 13:58:20','2025-02-25 13:58:20',1),(35,'ตรวจสุขภาพ',7000.00,7000.00,300.00,7100.00,NULL,NULL,NULL,NULL,2,'2025-02-25 13:58:26','2025-02-25 13:58:26',1),(36,'ตรวจสุขภาพ',7000.00,7000.00,7100.00,7200.00,NULL,NULL,NULL,NULL,2,'2025-02-25 13:58:35','2025-02-25 13:58:35',1),(37,'ตรวจสุขภาพ',7000.00,7000.00,7200.00,5000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:04:38','2025-02-25 14:04:38',1),(38,'ตรวจสุขภาพ',7000.00,7000.00,5000.00,6000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:04:48','2025-02-25 14:04:48',1),(39,'ตรวจสุขภาพ',7000.00,7000.00,6000.00,5000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:08:51','2025-02-25 14:08:51',1),(40,'ตรวจสุขภาพ',7000.00,7000.00,5000.00,7000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:13:19','2025-02-25 14:13:19',1),(41,'ตรวจสุขภาพ',7000.00,7000.00,7000.00,6000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:14:20','2025-02-25 14:14:20',1),(42,'ตรวจสุขภาพ',7000.00,7000.00,6000.00,7000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:23:04','2025-02-25 14:23:04',1),(43,'ตรวจสุขภาพ',7000.00,7000.00,7000.00,6900.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:23:10','2025-02-25 14:23:10',1),(44,'ทำฟัน',2000.00,2000.00,NULL,2000.00,3,NULL,NULL,NULL,2,'2025-02-25 14:25:39','2025-02-25 14:25:39',2),(45,'ทำฟัน',2000.00,2000.00,2000.00,NULL,3,NULL,NULL,NULL,2,'2025-02-25 14:25:44','2025-02-25 14:25:44',2),(46,'ตรวจสุขภาพ',7000.00,7000.00,6900.00,5500.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:27:02','2025-02-25 14:27:02',1),(47,'ตรวจสุขภาพ',7000.00,7000.00,5500.00,4000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:27:07','2025-02-25 14:27:07',1),(48,'ตรวจสุขภาพ',7000.00,7000.00,4000.00,3000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:27:46','2025-02-25 14:27:46',1),(49,'ตรวจสุขภาพ',7000.00,7000.00,3000.00,5000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:28:38','2025-02-25 14:28:38',1),(50,'ทำฟัน',2000.00,2000.00,NULL,1100.00,3,NULL,NULL,NULL,2,'2025-02-25 14:46:51','2025-02-25 14:46:51',2),(51,'ทำฟัน',2000.00,2000.00,1100.00,NULL,3,NULL,NULL,NULL,2,'2025-02-25 14:46:57','2025-02-25 14:46:57',2),(52,'ทำฟัน',2000.00,0.00,NULL,NULL,3,NULL,NULL,NULL,2,'2025-02-25 14:48:34','2025-02-25 14:48:34',2),(53,'ตรวจสุขภาพ',7000.00,5000.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 14:52:36','2025-02-25 14:52:36',1),(54,'ตรวจสุขภาพ',5000.00,7000.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 14:53:49','2025-02-25 14:53:49',1),(55,'ตรวจสุขภาพ',7000.00,NULL,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:09:19','2025-02-25 15:09:19',1),(56,'ตรวจสุขภาพ',NULL,7000.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:09:23','2025-02-25 15:09:23',1),(57,'ทำฟัน',NULL,200.00,NULL,NULL,3,NULL,NULL,NULL,2,'2025-02-25 15:09:27','2025-02-25 15:09:27',2),(58,'ทำฟัน',200.00,NULL,NULL,NULL,3,NULL,NULL,NULL,2,'2025-02-25 15:09:31','2025-02-25 15:09:31',2),(59,'ทำฟัน',NULL,2000.00,NULL,1000.00,3,NULL,NULL,NULL,2,'2025-02-25 15:09:45','2025-02-25 15:09:45',2),(60,'ตรวจสุขภาพ',7000.00,7000.00,5000.00,100.00,NULL,NULL,NULL,NULL,1,'2025-02-26 15:36:38','2025-02-26 15:36:38',1),(61,'ตรวจสุขภาพ',7000.00,8000.00,100.00,NULL,NULL,NULL,NULL,NULL,43,'2025-02-26 16:06:41','2025-02-26 16:06:41',1),(62,'ตรวจสุขภาพ',8000.00,8000.00,100.00,NULL,NULL,1,NULL,NULL,43,'2025-02-26 16:07:06','2025-02-26 16:07:06',1),(63,'ตรวจสุขภาพ',8000.00,8000.00,100.00,1.00,1,NULL,NULL,NULL,43,'2025-02-26 16:08:27','2025-02-26 16:08:27',1),(64,'ประสบภัยพิบัติ',10000.00,20000.00,NULL,NULL,NULL,NULL,NULL,NULL,1,'2025-03-01 08:25:12','2025-03-01 08:25:12',7),(65,'สมรส',2000.00,3000.00,NULL,NULL,1,NULL,NULL,NULL,43,'2025-03-01 08:34:19','2025-03-01 08:34:19',4),(66,'ตรวจสุขภาพ',8000.00,7000.00,NULL,NULL,NULL,NULL,NULL,NULL,2,'2025-03-02 12:12:14','2025-03-02 12:12:14',1),(67,'ตรวจสุขภาพ',7000.00,6000.00,NULL,NULL,NULL,NULL,NULL,NULL,2,'2025-03-02 12:12:19','2025-03-02 12:12:19',1),(68,'ทำฟัน',2000.00,2000.00,1000.00,2000.00,3,NULL,NULL,NULL,2,'2025-03-02 12:12:35','2025-03-02 12:12:35',2),(69,'ตรวจสุขภาพ',6000.00,6000.00,NULL,10.00,NULL,NULL,NULL,NULL,2,'2025-03-02 12:12:58','2025-03-02 12:12:58',1),(70,'ตรวจสุขภาพ',6000.00,6000.00,10.00,NULL,NULL,3,NULL,NULL,2,'2025-03-02 12:13:40','2025-03-02 12:13:40',1),(71,'ตรวจสุขภาพ',6000.00,10000.00,10.00,NULL,3,NULL,NULL,NULL,2,'2025-03-02 12:14:50','2025-03-02 12:14:50',1),(72,'ตรวจสุขภาพ',10000.00,10000.00,10.00,NULL,3,2000,NULL,NULL,2,'2025-03-02 12:16:25','2025-03-02 12:16:25',1),(73,'ตรวจสุขภาพ',10000.00,10000.00,10.00,NULL,2000,3000,NULL,NULL,2,'2025-03-02 12:18:10','2025-03-02 12:18:10',1),(74,'ตรวจสุขภาพ',10000.00,10000.00,10.00,5000.00,3000,NULL,NULL,NULL,2,'2025-03-02 12:18:17','2025-03-02 12:18:17',1),(75,'ตรวจสุขภาพ',10000.00,10000.00,5000.00,7000.00,3000,NULL,NULL,NULL,2,'2025-03-02 12:20:11','2025-03-02 12:20:11',1),(76,'ตรวจสุขภาพ',10000.00,10000.00,7000.00,NULL,3000,2,NULL,NULL,2,'2025-03-02 12:21:01','2025-03-02 12:21:01',1),(77,'ตรวจสุขภาพ',10000.00,200.00,7000.00,NULL,2,NULL,NULL,NULL,2,'2025-03-04 06:08:10','2025-03-04 06:08:10',1),(78,'ตรวจสุขภาพ',200.00,10000.00,7000.00,NULL,2,NULL,NULL,NULL,2,'2025-03-04 06:08:44','2025-03-04 06:08:44',1),(79,'ตรวจสุขภาพ',10000.00,10000.00,7000.00,8000.00,2,NULL,NULL,NULL,2,'2025-03-04 06:17:51','2025-03-04 06:17:51',1),(80,'ตรวจสุขภาพ',10000.00,9000.00,8000.00,NULL,2,NULL,NULL,NULL,2,'2025-03-04 06:18:21','2025-03-04 06:18:21',1),(81,'ตรวจสุขภาพ',9000.00,4000.00,8000.00,3900.00,2,NULL,NULL,NULL,2,'2025-03-04 06:19:18','2025-03-04 06:19:18',1),(82,'ตรวจสุขภาพ',4000.00,2000.00,3900.00,1900.00,2,2,NULL,NULL,2,'2025-03-04 06:19:44','2025-03-04 06:19:44',1),(83,'ตรวจสุขภาพ',2000.00,10000.00,1900.00,9900.00,2,1,NULL,NULL,2,'2025-03-04 06:19:58','2025-03-04 06:19:58',1),(84,'ตรวจสุขภาพ',10000.00,10000.00,9900.00,NULL,1,2,NULL,NULL,2,'2025-03-04 06:33:35','2025-03-04 06:33:35',1),(85,'ตรวจสุขภาพ',10000.00,10000.00,9900.00,NULL,2,3,NULL,NULL,2,'2025-03-04 06:33:45','2025-03-04 06:33:45',1),(86,'ตรวจสุขภาพ',10000.00,8000.00,9900.00,7900.00,3,NULL,NULL,NULL,2,'2025-03-04 06:34:00','2025-03-04 06:34:00',1),(87,'ตรวจสุขภาพ',8000.00,9000.00,7900.00,8900.00,3,2,NULL,NULL,2,'2025-03-04 06:34:17','2025-03-04 06:34:17',1),(88,'ตรวจสุขภาพ',9000.00,8000.00,8900.00,NULL,2,NULL,NULL,NULL,2,'2025-03-04 06:34:27','2025-03-04 06:34:27',1),(89,'ตรวจสุขภาพ',8000.00,7000.00,8900.00,6900.00,2,NULL,NULL,NULL,2,'2025-03-04 06:34:48','2025-03-04 06:34:48',1),(90,'ตรวจสุขภาพ',7000.00,7000.00,6900.00,NULL,2,3,NULL,NULL,2,'2025-03-04 06:34:56','2025-03-04 06:34:56',1),(91,'ตรวจสุขภาพ',7000.00,7000.00,6900.00,6500.00,3,NULL,NULL,NULL,2,'2025-03-04 06:35:04','2025-03-04 06:35:04',1),(92,'ตรวจสุขภาพ',7000.00,6200.00,6500.00,NULL,3,NULL,NULL,NULL,2,'2025-03-04 06:38:57','2025-03-04 06:38:57',1),(93,'ตรวจสุขภาพ',6200.00,6300.00,6500.00,NULL,3,NULL,NULL,NULL,2,'2025-03-04 06:40:06','2025-03-04 06:40:06',1),(94,'ตรวจสุขภาพ',6300.00,7000.00,6500.00,NULL,3,NULL,NULL,NULL,2,'2025-03-04 06:41:00','2025-03-04 06:41:00',1),(95,'ตรวจสุขภาพ',7000.00,7200.00,6500.00,NULL,3,NULL,NULL,NULL,2,'2025-03-04 06:41:51','2025-03-04 06:41:51',1),(96,'ตรวจสุขภาพ',7200.00,7200.00,6500.00,1000.00,NULL,NULL,NULL,NULL,43,'2025-03-05 11:14:43','2025-03-05 11:14:43',1),(97,'ตรวจสุขภาพ',7200.00,7000.00,1000.00,NULL,NULL,NULL,NULL,NULL,43,'2025-03-05 11:15:10','2025-03-05 11:15:10',1),(98,'ตรวจสุขภาพ',7000.00,3000.00,1000.00,2000.00,NULL,2,NULL,NULL,2,'2025-03-07 06:33:48','2025-03-07 06:33:48',1),(99,'ตรวจสุขภาพ',3000.00,7000.00,2000.00,NULL,2,NULL,NULL,NULL,2,'2025-03-07 06:34:06','2025-03-07 06:34:06',1),(100,'ตรวจสุขภาพ',7000.00,7000.00,2000.00,3000.00,NULL,NULL,NULL,NULL,34,'2025-03-11 08:13:32','2025-03-11 08:13:32',1),(101,'ตรวจสุขภาพ',7000.00,3000.00,3000.00,NULL,NULL,NULL,NULL,NULL,34,'2025-03-11 08:13:52','2025-03-11 08:13:52',1),(102,'ตรวจสุขภาพ',3000.00,4000.00,3000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-03-11 22:07:36','2025-03-11 22:07:36',1),(103,'ตรวจสุขภาพ',4000.00,4000.00,3000.00,3900.00,NULL,NULL,NULL,NULL,2,'2025-03-11 22:07:46','2025-03-11 22:07:46',1),(104,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,NULL,1,NULL,NULL,2,'2025-03-11 22:07:51','2025-03-11 22:07:51',1),(105,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,1,2,NULL,NULL,2,'2025-03-11 22:45:51','2025-03-11 22:45:51',1),(106,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,2,3,NULL,NULL,2,'2025-03-11 22:57:53','2025-03-11 22:57:53',1),(107,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,3,4,NULL,NULL,2,'2025-03-11 22:58:06','2025-03-11 22:58:06',1),(108,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,4,5,NULL,NULL,2,'2025-03-11 22:58:30','2025-03-11 22:58:30',1),(109,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,5,6,NULL,NULL,2,'2025-03-11 23:00:27','2025-03-11 23:00:27',1),(110,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,6,1,NULL,NULL,2,'2025-03-11 23:01:34','2025-03-11 23:01:34',1),(111,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,1,3,NULL,NULL,2,'2025-03-11 23:03:16','2025-03-11 23:03:16',1),(112,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,3,6,NULL,NULL,2,'2025-03-11 23:06:37','2025-03-11 23:06:37',1),(113,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,6,7,NULL,NULL,2,'2025-03-11 23:10:15','2025-03-11 23:10:15',1),(114,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,7,6,NULL,NULL,2,'2025-03-11 23:28:48','2025-03-11 23:28:48',1),(115,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,6,2,NULL,NULL,2,'2025-03-11 23:30:36','2025-03-11 23:30:36',1),(116,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,2,NULL,NULL,NULL,2,'2025-03-11 23:30:58','2025-03-11 23:30:58',1),(117,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,2,NULL,NULL,NULL,2,'2025-03-11 23:31:03','2025-03-11 23:31:03',1),(118,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,2,NULL,NULL,NULL,2,'2025-03-11 23:31:08','2025-03-11 23:31:08',1),(119,'สมรส',3000.00,3000.00,NULL,NULL,1,NULL,NULL,NULL,2,'2025-03-11 23:31:35','2025-03-11 23:31:35',4),(120,'อุปสมบทหรือประกอบพิธีฮัจน์',2000.00,2000.00,NULL,NULL,1,NULL,NULL,NULL,2,'2025-03-11 23:31:44','2025-03-11 23:31:44',5),(121,'รับขวัญบุตร',1000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,2,'2025-03-11 23:31:51','2025-03-11 23:31:51',6),(122,'ประสบภัยพิบัติ',20000.00,20000.00,NULL,NULL,NULL,NULL,NULL,NULL,2,'2025-03-11 23:32:00','2025-03-11 23:32:00',7),(123,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,2,NULL,1,NULL,2,'2025-03-11 23:35:59','2025-03-11 23:35:59',1),(124,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,2,NULL,NULL,1,2,'2025-03-11 23:36:30','2025-03-11 23:36:30',1),(125,'สมรส',3000.00,3000.00,NULL,NULL,NULL,NULL,1,NULL,2,'2025-03-11 23:36:47','2025-03-11 23:36:47',4),(126,'สมรส',3000.00,3000.00,NULL,NULL,NULL,NULL,NULL,1,2,'2025-03-11 23:36:51','2025-03-11 23:36:51',4),(127,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,2,NULL,1,NULL,2,'2025-03-11 23:39:31','2025-03-11 23:39:31',1),(128,'ตรวจสุขภาพ',4000.00,4000.00,3900.00,NULL,NULL,NULL,1,NULL,2,'2025-03-11 23:39:43','2025-03-11 23:39:43',1),(129,'ตรวจสุขภาพ',4000.00,3000.00,3900.00,1500.00,NULL,NULL,NULL,NULL,2,'2025-03-11 23:53:48','2025-03-11 23:53:48',1),(130,'ตรวจสุขภาพ',3000.00,5000.00,1500.00,3900.00,NULL,NULL,NULL,NULL,2,'2025-03-11 23:54:22','2025-03-11 23:54:22',1);
/*!40000 ALTER TABLE `log_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_sub_category`
--

DROP TABLE IF EXISTS `log_sub_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_sub_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fund_old` decimal(10,2) DEFAULT NULL,
  `fund_new` decimal(10,2) DEFAULT NULL,
  `per_times_old` decimal(10,2) DEFAULT NULL,
  `per_times_new` decimal(10,2) DEFAULT NULL,
  `per_years_old` int(11) DEFAULT NULL,
  `per_years_new` int(11) DEFAULT NULL,
  `per_users_old` int(11) DEFAULT NULL,
  `per_users_new` int(11) DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sub_categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_log_sub_category_sub_categories1_idx` (`sub_categories_id`),
  CONSTRAINT `fk_log_sub_category_sub_categories1` FOREIGN KEY (`sub_categories_id`) REFERENCES `sub_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_sub_category`
--

LOCK TABLES `log_sub_category` WRITE;
/*!40000 ALTER TABLE `log_sub_category` DISABLE KEYS */;
INSERT INTO `log_sub_category` VALUES (12,'เยี่ยมไข้',3000.00,4000.00,1000.00,NULL,3,NULL,NULL,NULL,2,'2025-02-22 11:20:07','2025-02-22 11:20:07',2),(13,'เยี่ยมไข้',5000.00,4000.00,1000.00,NULL,3,NULL,NULL,NULL,2,'2025-02-22 11:28:49','2025-02-22 11:28:49',2),(14,'เยี่ยมไข้',5000.00,4000.00,1000.00,NULL,3,NULL,NULL,NULL,2,'2025-02-22 11:29:03','2025-02-22 11:29:03',2),(15,'เยี่ยมไข้',4000.00,3000.00,1000.00,NULL,3,NULL,NULL,NULL,1,'2025-02-24 08:22:48','2025-02-24 08:22:48',2),(16,'เยี่ยมไข้',3000.00,3000.00,1000.00,2000.00,3,NULL,NULL,NULL,2,'2025-02-25 14:24:17','2025-02-25 14:24:17',2),(17,'เยี่ยมไข้',3000.00,3000.00,2000.00,1000.00,3,NULL,NULL,NULL,2,'2025-02-25 14:24:22','2025-02-25 14:24:22',2),(18,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,NULL,2000.00,3000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:46:28','2025-02-25 14:46:28',1),(19,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,NULL,3000.00,1000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:46:34','2025-02-25 14:46:34',1),(20,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,5000.00,1000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 14:47:32','2025-02-25 14:47:32',1),(21,'ประสบอุบัติเหตุขณะปฏิบัติงาน',5000.00,0.00,1000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 14:48:01','2025-02-25 14:48:01',1),(22,'เยี่ยมไข้',3000.00,3000.00,1000.00,200.00,3,NULL,NULL,NULL,2,'2025-02-25 14:51:35','2025-02-25 14:51:35',2),(23,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,NULL,1000.00,5000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 14:56:35','2025-02-25 14:56:35',1),(24,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,3000.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 14:56:42','2025-02-25 14:56:42',1),(25,'ประสบอุบัติเหตุขณะปฏิบัติงาน',3000.00,0.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 14:56:50','2025-02-25 14:56:50',1),(26,'ประสบอุบัติเหตุขณะปฏิบัติงาน',0.00,200.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 14:57:28','2025-02-25 14:57:28',1),(27,'ประสบอุบัติเหตุขณะปฏิบัติงาน',200.00,0.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:02:59','2025-02-25 15:02:59',1),(28,'ประสบอุบัติเหตุขณะปฏิบัติงาน',0.00,200.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:03:16','2025-02-25 15:03:16',1),(29,'ประสบอุบัติเหตุขณะปฏิบัติงาน',200.00,0.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:03:20','2025-02-25 15:03:20',1),(30,'ประสบอุบัติเหตุขณะปฏิบัติงาน',0.00,200.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:04:54','2025-02-25 15:04:54',1),(31,'ประสบอุบัติเหตุขณะปฏิบัติงาน',200.00,0.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:04:57','2025-02-25 15:04:57',1),(32,'ประสบอุบัติเหตุขณะปฏิบัติงาน',0.00,200.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:05:54','2025-02-25 15:05:54',1),(33,'ประสบอุบัติเหตุขณะปฏิบัติงาน',200.00,0.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:05:58','2025-02-25 15:05:58',1),(34,'ประสบอุบัติเหตุขณะปฏิบัติงาน',0.00,200.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:06:50','2025-02-25 15:06:50',1),(35,'ประสบอุบัติเหตุขณะปฏิบัติงาน',200.00,5000.00,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:08:19','2025-02-25 15:08:19',1),(36,'ประสบอุบัติเหตุขณะปฏิบัติงาน',5000.00,NULL,5000.00,NULL,NULL,NULL,NULL,NULL,2,'2025-02-25 15:10:26','2025-02-25 15:10:26',1),(37,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,NULL,5000.00,2000.00,NULL,NULL,NULL,NULL,2,'2025-02-25 15:15:35','2025-02-25 15:15:35',1),(38,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,NULL,2000.00,500.00,NULL,NULL,NULL,NULL,1,'2025-03-01 08:26:51','2025-03-01 08:26:51',1),(39,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,NULL,500.00,2000.00,NULL,NULL,NULL,NULL,1,'2025-03-01 08:27:26','2025-03-01 08:27:26',1),(40,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,NULL,2000.00,3000.00,NULL,NULL,NULL,NULL,43,'2025-03-05 11:26:13','2025-03-05 11:26:13',1),(41,'บิดา',5000.00,5000.00,NULL,NULL,NULL,NULL,NULL,NULL,2,'2025-03-11 23:32:05','2025-03-11 23:32:05',3),(42,'มารดา',5000.00,5000.00,NULL,NULL,NULL,NULL,NULL,1,2,'2025-03-11 23:37:14','2025-03-11 23:37:14',4),(43,'คู่สมรส',5000.00,5000.00,NULL,NULL,NULL,NULL,NULL,1,2,'2025-03-11 23:37:24','2025-03-11 23:37:24',5),(44,'บุตร',5000.00,5000.00,NULL,NULL,NULL,NULL,NULL,1,2,'2025-03-11 23:37:30','2025-03-11 23:37:30',6);
/*!40000 ALTER TABLE `log_sub_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
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
INSERT INTO `permissions_has_roles` VALUES (1,1),(2,1),(3,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(1,3),(2,3),(3,3),(4,3),(1,4),(2,4),(3,4),(4,4),(6,4),(7,4),(8,4);
/*!40000 ALTER TABLE `permissions_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `positions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'อาจารย์','2025-01-24 10:07:30','2025-01-24 10:07:30'),(2,'คณบดี','2025-02-18 17:06:10','2025-02-18 17:06:10'),(3,'อธิการบดี','2025-02-18 17:06:10','2025-02-18 17:06:10');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_assist`
--

DROP TABLE IF EXISTS `reimbursements_assist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_assist` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `reim_number` varchar(45) NOT NULL,
  `fund_receipt` decimal(10,2) NOT NULL,
  `fund_sum_request` decimal(10,2) NOT NULL,
  `fund_sum_receipt` decimal(10,2) NOT NULL,
  `fund_eligible` decimal(10,2) NOT NULL,
  `fund_decease` decimal(10,2) DEFAULT NULL,
  `fund_wreath_university` decimal(10,2) DEFAULT NULL,
  `fund_wreath_arrange` decimal(10,2) DEFAULT NULL,
  `fund_receipt_wreath` decimal(10,2) DEFAULT NULL,
  `fund_receipt_vechicle` decimal(10,2) DEFAULT NULL,
  `fund_vechicle` decimal(10,2) DEFAULT NULL,
  `status` enum('บันทึกฉบับร่าง','รอตรวจสอบ','อนุมัติ','ไม่อนุมัติ') NOT NULL,
  `deceased` varchar(255) DEFAULT NULL,
  `deceased_type` int(11) DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reimbursements_assist_categories1_idx` (`categories_id`),
  KEY `fk_reimbursements_assist_users1_idx` (`created_by`),
  CONSTRAINT `fk_reimbursements_assist_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_assist_users1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_assist`
--

LOCK TABLES `reimbursements_assist` WRITE;
/*!40000 ALTER TABLE `reimbursements_assist` DISABLE KEYS */;
INSERT INTO `reimbursements_assist` VALUES (1,'0001',2000.00,3000.00,0.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'อนุมัติ','Mikama Toyota',2,'2025-01-25','2025-02-04 07:06:50','2025-01-13 09:47:23',1,2,8),(27,'68020627',2200.00,300.00,0.00,300.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-02-15','2025-02-13 09:20:37','2025-02-15 10:08:35',1,1,6),(28,'68020728',12000.00,5000.00,12000.00,5000.00,NULL,NULL,NULL,NULL,NULL,NULL,'อนุมัติ',NULL,NULL,'2025-02-13','2025-02-13 09:51:51','2025-03-15 12:38:15',34,1,7),(33,'68020733',10.00,5.00,10.00,5.00,NULL,NULL,NULL,NULL,NULL,NULL,'อนุมัติ',NULL,NULL,'2025-02-15','2025-02-15 10:12:51','2024-11-18 16:01:16',2,1,7),(36,'68020736',2000.00,1000.00,2000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-02-15','2025-02-15 12:38:31','2025-02-18 16:10:55',2,1,7),(49,'68020849',10000.00,9000.00,22000.00,0.00,3000.00,2000.00,2000.00,6000.00,6000.00,2000.00,'รอตรวจสอบ','NOMO MONO',3,'2025-02-18','2025-02-18 05:25:59','2025-02-18 09:11:34',1,1,8),(64,'68020850',5000.00,2000.00,5000.00,0.00,2000.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','est gimo',5,'2025-02-18','2025-02-18 14:19:47','2025-02-18 14:19:47',1,1,8),(65,'68020865',2000.00,4900.00,6000.00,0.00,1900.00,1000.00,1000.00,2000.00,2000.00,1000.00,'ไม่อนุมัติ','ทดสอบ นะ',5,'2025-02-18','2025-02-18 14:21:14','2025-03-18 09:33:46',2,1,8),(66,'68020866',5000.00,3200.00,10000.00,0.00,1200.00,1000.00,1000.00,5000.00,NULL,NULL,'อนุมัติ','memo',5,'2025-02-18','2025-02-18 14:22:53','2025-03-04 08:17:50',2,1,8),(70,'68020670',900.00,250.00,1000.00,250.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-02-24','2025-02-24 16:53:29','2025-02-24 16:58:13',43,43,6),(71,'68020771',2000.00,1000.00,2000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-02-24','2025-02-24 17:06:39','2025-02-24 17:07:02',43,43,7),(72,'68020772',3000.00,150.00,3000.00,150.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง',NULL,NULL,NULL,'2025-02-24 17:07:38','2025-02-24 17:07:38',43,43,7),(73,'68020873',1000.00,1500.00,1000.00,0.00,1500.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','แฟน ทดสอบ',NULL,'2025-02-24','2025-02-24 17:16:45','2025-02-24 17:35:30',43,43,8),(74,'68020874',1000.00,200.00,1000.00,0.00,200.00,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','ลูก ทดสอบ',NULL,NULL,'2025-02-24 17:35:16','2025-02-24 17:35:16',43,43,8),(76,'68020876',500.00,200.00,500.00,0.00,200.00,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','ลูก ทดสอบ',NULL,NULL,'2025-02-25 07:27:41','2025-02-25 07:27:41',34,34,8),(77,'68020477',1000.00,1000.00,1000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-01','2025-02-25 09:00:48','2025-03-01 08:41:25',2,2,4),(80,'68020780',1000.00,1000.00,1000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-02-26','2025-02-26 09:51:00','2025-02-26 09:51:25',1,1,7),(81,'68020781',1000.00,200.00,1000.00,200.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-02-26','2025-02-26 10:24:07','2025-02-26 10:24:13',1,1,7),(82,'68020882',5000.00,6200.00,13000.00,0.00,1000.00,200.00,1000.00,3000.00,5000.00,4000.00,'รอตรวจสอบ','test test',4,'2025-02-28','2025-02-26 10:48:39','2025-02-28 13:46:54',1,1,8),(83,'68020883',5000.00,1200.00,7000.00,0.00,1000.00,100.00,100.00,2000.00,NULL,NULL,'รอตรวจสอบ','test',3,'2025-02-27','2025-02-27 06:13:31','2025-02-27 08:38:55',1,1,8),(84,'68020784',2000.00,100.00,2000.00,100.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-02-27','2025-02-27 06:13:53','2025-02-27 08:35:31',1,1,7),(90,'68020790',100000.00,100.00,100000.00,100.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง',NULL,NULL,NULL,'2025-03-01 08:30:14','2025-03-01 08:30:14',43,43,7),(91,'68020491',20000.00,2000.00,20000.00,2000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-01','2025-03-01 08:33:18','2025-03-01 08:33:18',43,44,4),(92,'68020892',10000.00,100.00,10000.00,0.00,100.00,NULL,NULL,NULL,NULL,NULL,'อนุมัติ','นางลิลิน คนซื่อ',5,'2025-03-01','2025-03-01 09:17:41','2025-03-02 12:13:14',2,2,8),(94,'68020494',3000.00,2000.00,3000.00,2000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-03','2025-03-03 11:46:34','2025-03-03 11:46:34',2,3,4),(96,'68020695',500.00,200.00,500.00,200.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-03','2025-03-03 14:04:23','2025-03-03 14:04:23',2,2,6),(98,'68020897',2000.00,1750.00,3300.00,0.00,950.00,200.00,500.00,1000.00,300.00,100.00,'รอตรวจสอบ','ทดสอบ',5,'2025-03-04','2025-03-04 06:45:17','2025-03-04 06:45:33',1,1,8),(100,'680207100',500.00,100.00,500.00,100.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-05','2025-03-04 19:38:13','2025-03-04 19:38:40',1,1,7),(101,'680206101',1000.00,700.00,1000.00,700.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-05','2025-03-05 08:23:15','2025-03-05 08:23:33',1,1,6),(102,'680208102',10000.00,1090.00,15000.00,0.00,90.00,0.00,1000.00,5000.00,NULL,NULL,'บันทึกฉบับร่าง','test',5,NULL,'2025-03-05 16:15:08','2025-03-07 10:58:26',1,1,8),(103,'680205103',1000.00,990.50,1000.00,990.50,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-07','2025-03-07 06:53:38','2025-03-07 06:53:38',2,2,5),(104,'680208104',4000.00,1000.00,4000.00,0.00,1000.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','สมแดง คนซื่อ',3,'2025-03-07','2025-03-07 06:56:58','2025-03-07 14:27:11',2,2,8),(105,'680208105',4000.00,6000.00,5000.00,0.00,4000.00,1000.00,1000.00,1000.00,NULL,NULL,'รอตรวจสอบ','สมดำ คนซื่อ',4,'2025-03-07','2025-03-07 06:57:59','2025-03-07 06:57:59',2,2,8),(106,'680208106',100.00,223.12,300.00,0.00,100.00,0.00,123.12,200.00,NULL,NULL,'บันทึกฉบับร่าง','test',6,NULL,'2025-03-07 07:09:33','2025-03-07 07:09:33',2,2,8),(107,'680208107',2002.00,2001.00,2002.00,0.00,2001.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','test',3,'2025-03-07','2025-03-07 07:57:39','2025-03-07 07:57:39',2,3,8),(108,'680208108',2000.22,1201.22,5000.22,0.00,1000.67,200.55,0.00,3000.00,NULL,NULL,'บันทึกฉบับร่าง','test',6,NULL,'2025-03-07 11:03:24','2025-03-07 13:35:36',1,1,8),(111,'680207109',1000.00,1000.00,1000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง',NULL,NULL,NULL,'2025-03-11 04:43:32','2025-03-11 04:43:32',43,43,7),(112,'680204112',3001.00,3000.00,3001.00,3000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-11','2025-03-11 04:45:42','2025-03-11 04:47:03',43,43,4),(113,'680208113',6000.00,19000.00,30000.00,0.00,5000.00,2000.00,2000.00,4000.00,20000.00,10000.00,'รอตรวจสอบ','ทรงโปรด แวงดงบังไพศาล',6,'2025-03-11','2025-03-11 04:50:57','2025-03-11 04:51:49',43,43,8),(114,'680205114',3000.00,2000.00,3000.00,2000.00,NULL,NULL,NULL,NULL,NULL,NULL,'อนุมัติ',NULL,NULL,'2025-03-11','2025-03-11 08:32:00','2025-03-11 09:17:53',34,1,5),(115,'680208115',3000.00,12950.00,22000.00,0.00,950.00,1000.00,1000.00,4000.00,15000.00,10000.00,'รอตรวจสอบ','ณเคช คุกิมิยะ',5,'2025-03-11','2025-03-11 08:36:21','2025-03-11 09:17:33',34,1,8),(116,'680204116',2000.00,1000.00,2000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-12','2025-03-12 16:11:36','2025-03-12 16:11:36',2,4,4),(117,'680204117',2000.00,1000.00,2000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'ไม่อนุมัติ',NULL,NULL,'2025-03-12','2025-03-12 16:31:50','2025-03-12 16:35:54',2,2,4),(118,'680207118',2000.00,1000.00,2000.00,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-12','2025-03-12 16:37:23','2025-03-12 16:37:23',2,2,7),(119,'680208119',4000.00,4000.00,4000.00,0.00,4000.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','test',3,'2025-03-13','2025-03-12 17:33:39','2025-03-12 17:33:39',1,1,8),(120,'680208120',1000.00,1000.00,1000.00,0.00,1000.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','test',3,'2025-03-13','2025-03-12 18:29:52','2025-03-12 18:29:52',2,2,8),(121,'680208121',2000.00,1000.00,2000.00,0.00,1000.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','test',3,'2025-03-13','2025-03-12 18:32:06','2025-03-12 18:32:06',2,2,8),(122,'680208122',5000.00,5000.00,5000.00,0.00,5000.00,NULL,NULL,NULL,NULL,NULL,'ไม่อนุมัติ','test',4,'2025-03-13','2025-03-13 11:11:41','2025-03-13 15:00:11',34,36,8),(123,'680208123',0.00,100.00,100.00,0.00,0.00,0.00,100.00,100.00,NULL,NULL,'ไม่อนุมัติ','test',4,'2025-03-13','2025-03-13 11:21:14','2025-03-14 10:58:36',34,35,8),(124,'680204124',3000.00,2500.00,3000.00,2500.00,NULL,NULL,NULL,NULL,NULL,NULL,'ไม่อนุมัติ',NULL,NULL,'2025-03-13','2025-03-13 13:39:19','2025-03-13 13:39:57',34,1,4),(125,'680208125',5000.00,5000.00,5000.00,0.00,5000.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','test2',3,'2025-03-13','2025-03-13 15:02:09','2025-03-13 15:02:09',36,36,8),(126,'680208126',2000.00,1000.00,2000.00,0.00,1000.00,NULL,NULL,NULL,NULL,NULL,'อนุมัติ','test',4,'2025-03-14','2025-03-14 10:33:25','2025-03-17 13:05:34',34,36,8),(127,'680208127',0.00,4000.00,6000.00,0.00,0.00,2000.00,2000.00,6000.00,NULL,NULL,'อนุมัติ',NULL,NULL,'2025-03-14','2025-03-14 10:38:18','2025-03-14 11:07:22',34,35,8),(128,'680208128',0.00,2500.00,3000.00,0.00,0.00,2000.00,500.00,3000.00,NULL,NULL,'รอตรวจสอบ',NULL,NULL,'2025-03-14','2025-03-14 11:12:19','2025-03-14 11:12:19',35,35,8);
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
INSERT INTO `reimbursements_assist_has_sub_categories` VALUES (83,3),(104,3),(107,3),(119,3),(120,3),(121,3),(125,3),(1,4),(82,4),(105,4),(122,4),(123,4),(126,4),(65,5),(66,5),(73,5),(92,5),(98,5),(102,5),(115,5),(74,6),(76,6),(106,6),(108,6),(113,6),(1,7),(49,7),(66,7),(82,7),(83,7),(98,7),(102,7),(105,7),(106,7),(108,7),(113,7),(115,7),(128,7),(1,8),(49,8),(66,8),(82,8),(83,8),(98,8),(102,8),(105,8),(106,8),(108,8),(113,8),(115,8),(128,8),(1,9),(49,9),(82,9),(98,9),(113,9),(115,9);
/*!40000 ALTER TABLE `reimbursements_assist_has_sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_children_education`
--

DROP TABLE IF EXISTS `reimbursements_children_education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_children_education` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `reim_number` varchar(45) NOT NULL,
  `fund_receipt` decimal(10,2) NOT NULL,
  `fund_eligible` decimal(10,2) NOT NULL,
  `fund_sum_request` decimal(10,2) NOT NULL,
  `fund_sum_receipt` decimal(10,2) NOT NULL,
  `fund_university` decimal(10,2) NOT NULL,
  `fund_other` decimal(10,2) DEFAULT NULL,
  `status` enum('บันทึกฉบับร่าง','รอตรวจสอบ','อนุมัติ','ไม่อนุมัติ') NOT NULL,
  `spouse` varchar(255) NOT NULL,
  `marry_regis` enum('YES','NO') NOT NULL,
  `role` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `eligible` enum('ตามสิทธิ','เฉพาะส่วนที่ยังขาดจากสิทธิ') DEFAULT NULL,
  `parental_status` enum('บิดา','มารดา') NOT NULL,
  `eligible_benefits` enum('ก','ข','ค') DEFAULT NULL,
  `eligible_sub_benefits` enum('ก','ข','ค') DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `categories_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reimbursements_children_education_users1_idx` (`created_by`),
  KEY `fk_reimbursements_children_education_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_reimbursements_children_education_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_children_education_users1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_children_education`
--

LOCK TABLES `reimbursements_children_education` WRITE;
/*!40000 ALTER TABLE `reimbursements_children_education` DISABLE KEYS */;
INSERT INTO `reimbursements_children_education` VALUES (130,'6804130',1000.00,0.00,1800.00,0.00,2000.00,200.00,'รอตรวจสอบ','joo','YES','ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ',NULL,NULL,'ตามสิทธิ','บิดา','ก','ข','2025-02-24','2025-02-24 12:15:55','2025-03-12 10:14:00',2,43,13),(136,'6804136',1000.00,0.00,1800.00,0.00,2000.00,200.00,'รอตรวจสอบ','bisminla','YES','ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ',NULL,NULL,'ตามสิทธิ','บิดา','ข','ค','2025-02-24','2025-02-24 16:48:53','2025-03-12 10:14:00',2,2,13),(137,'6804137',10000.00,0.00,-14000.00,0.00,3000.00,17000.00,'รอตรวจสอบ','แฟน ทดสอบ','YES','ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ',NULL,NULL,'ตามสิทธิ','บิดา','ก','ข','2025-02-24','2025-02-24 18:41:05','2025-03-12 10:14:00',43,43,16),(138,'6804138',15000.00,0.00,2000.00,0.00,3000.00,1000.00,'อนุมัติ','ซูซี่ หวัง','YES','ข้าราชการ','ครู','กระ','ตามสิทธิ','บิดา','ก','ค','2025-02-25','2025-02-25 09:11:44','2025-03-12 10:14:00',2,2,13),(141,'6804139',1000.00,0.00,1800.00,0.00,2000.00,200.00,'บันทึกฉบับร่าง',',kmlk','YES','ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ',NULL,NULL,'ตามสิทธิ','บิดา','ข','ค',NULL,'2025-03-04 13:51:43','2025-03-12 10:14:00',2,2,13),(142,'6804142',1000.00,0.00,-450.00,0.00,50.00,500.00,'บันทึกฉบับร่าง','ทรงพันธุ์ แวงดงบังไพศาล','YES','ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ',NULL,NULL,'ตามสิทธิ','บิดา','ก','ข',NULL,'2025-03-05 09:10:49','2025-03-12 10:14:00',43,43,15),(150,'6804150',10000.00,0.00,1800.00,0.00,2000.00,200.00,'บันทึกฉบับร่าง','นาย จันเจ้า จันหว้า','YES','ลูกจ้างประจำ',NULL,NULL,'ตามสิทธิ','บิดา','ก',NULL,NULL,'2025-03-17 08:28:13','2025-03-18 09:11:25',1,1,NULL),(151,'6804151',10000.00,0.00,3000.00,0.00,5000.00,2000.00,'บันทึกฉบับร่าง','นาย ราปิ พิบูณนน','YES','ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ',NULL,NULL,'ตามสิทธิ','บิดา','ก',NULL,NULL,'2025-03-18 09:34:38','2025-03-18 09:40:19',1,1,NULL),(152,'6804152',65000.00,0.00,22800.00,0.00,24000.00,1200.00,'รอตรวจสอบ','นาย จันแจ่ม แจ้มจ้า','YES','ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ',NULL,NULL,'ตามสิทธิ','บิดา','ก','ค','2025-03-18','2025-03-18 10:06:38','2025-03-18 10:08:21',1,1,NULL);
/*!40000 ALTER TABLE `reimbursements_children_education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_children_education_has_children_infomation`
--

DROP TABLE IF EXISTS `reimbursements_children_education_has_children_infomation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_children_education_has_children_infomation` (
  `reimbursements_children_education_id` bigint(20) NOT NULL,
  `children_infomation_id` bigint(20) NOT NULL,
  PRIMARY KEY (`reimbursements_children_education_id`,`children_infomation_id`),
  KEY `fk_reimbursements_children_education_has_children_infomatio_idx` (`children_infomation_id`),
  KEY `fk_reimbursements_children_education_has_children_infomatio_idx1` (`reimbursements_children_education_id`),
  CONSTRAINT `fk_reimbursements_children_education_has_children_infomation_1` FOREIGN KEY (`reimbursements_children_education_id`) REFERENCES `reimbursements_children_education` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_children_education_has_children_infomation_2` FOREIGN KEY (`children_infomation_id`) REFERENCES `children_infomation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_children_education_has_children_infomation`
--

LOCK TABLES `reimbursements_children_education_has_children_infomation` WRITE;
/*!40000 ALTER TABLE `reimbursements_children_education_has_children_infomation` DISABLE KEYS */;
INSERT INTO `reimbursements_children_education_has_children_infomation` VALUES (130,128),(137,133),(138,134),(141,137),(142,138),(150,144),(151,145),(152,146),(152,147);
/*!40000 ALTER TABLE `reimbursements_children_education_has_children_infomation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_employee_deceased`
--

DROP TABLE IF EXISTS `reimbursements_employee_deceased`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_employee_deceased` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `reim_number` varchar(45) NOT NULL,
  `fund_receipt` decimal(10,2) NOT NULL,
  `fund_request` decimal(10,2) NOT NULL,
  `fund_sum_request` decimal(10,2) NOT NULL,
  `fund_sum_receipt` decimal(10,2) NOT NULL,
  `fund_wreath_university` decimal(10,2) DEFAULT NULL,
  `fund_wreath_arrange` decimal(10,2) DEFAULT NULL,
  `fund_receipt_wreath` decimal(10,2) DEFAULT NULL,
  `fund_receipt_vehicle` decimal(10,2) DEFAULT NULL,
  `fund_vehicle` decimal(10,2) DEFAULT NULL,
  `status` enum('บันทึกฉบับร่าง','รอตรวจสอบ','อนุมัติ','ไม่อนุมัติ') NOT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `deceased` bigint(20) NOT NULL,
  `request_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reimbursements_employee_deceased_users1_idx` (`created_by`),
  CONSTRAINT `fk_reimbursements_employee_deceased_users1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_employee_deceased`
--

LOCK TABLES `reimbursements_employee_deceased` WRITE;
/*!40000 ALTER TABLE `reimbursements_employee_deceased` DISABLE KEYS */;
INSERT INTO `reimbursements_employee_deceased` VALUES (1,'0002',1000.00,0.00,0.00,0.00,NULL,NULL,NULL,NULL,NULL,'อนุมัติ','Sarun',1,'2025-02-02','2025-02-04 06:57:17','2025-08-19 17:18:55',1,1),(5,'68030905',10000.00,5000.00,5100.00,10200.00,NULL,NULL,NULL,200.00,100.00,'อนุมัติ','test test',3,'2025-02-28','2025-02-20 06:19:14','2025-03-04 08:09:56',2,1),(20,'68030906',10000.00,4888.00,5088.00,12000.00,100.00,100.00,2000.00,NULL,NULL,'อนุมัติ','test',34,'2025-02-20','2025-02-20 10:01:50','2025-02-23 12:47:10',1,1),(21,'68030921',5000.00,5000.00,15300.00,15500.00,300.00,500.00,1000.00,9500.00,9500.00,'อนุมัติ','สมพง ยงยุศ',3,'2023-02-20','2023-02-20 10:29:32','2023-09-20 10:47:56',2,1),(22,'68030922',6000.00,3000.00,3000.00,6000.00,NULL,NULL,NULL,NULL,NULL,'อนุมัติ','สมพง ยิ่งยง',3,'2025-02-20','2025-02-20 11:06:46','2024-10-20 12:35:19',2,1),(26,'68030925',10000.00,10000.00,33000.00,35500.00,2000.00,2000.00,2500.00,23000.00,19000.00,'อนุมัติ','เทมปุระ ยม',5,'2025-02-25','2025-02-25 09:22:37','2025-02-25 10:07:46',2,2),(29,'68030928',1000.00,150.50,153.15,1100.00,NULL,NULL,NULL,100.00,2.65,'ไม่อนุมัติ','นายมนัส สวี',43,'2025-03-05','2025-03-01 07:44:30','2025-03-18 15:02:32',2,1),(30,'68030930',5000.00,5000.00,14000.50,15000.00,NULL,NULL,NULL,10000.00,9000.50,'อนุมัติ','ประธาน บริษัท',71,'2025-03-07','2025-03-07 07:02:17','2025-03-18 15:10:14',2,35),(31,'68030931',20000.00,10000.00,11000.00,22000.00,NULL,1000.00,2000.00,NULL,NULL,'ไม่อนุมัติ','test',2,'2025-03-07','2025-03-07 11:45:28','2025-03-18 15:09:49',2,1),(32,'68030932',10001.00,10000.00,34000.00,44001.00,2000.00,2000.00,4000.00,30000.00,20000.00,'อนุมัติ','บลู ใหม่',78,'2025-03-11','2025-03-11 04:55:59','2025-03-18 15:20:58',2,43),(33,'68030933',30000.00,10000.00,34000.00,95000.00,2000.00,2000.00,40000.00,25000.00,20000.00,'รอตรวจสอบ','bktjvkgjvgt',49,'2025-03-11','2025-03-11 08:40:05','2025-03-11 08:40:05',35,35),(34,'68030934',200.00,200.00,200.00,200.00,NULL,NULL,NULL,NULL,NULL,'อนุมัติ','test',40,'2025-03-14','2025-03-14 12:22:30','2025-03-14 13:00:32',34,34),(35,'68030935',0.00,0.00,300.00,3000.00,100.00,200.00,3000.00,NULL,NULL,'อนุมัติ',NULL,76,'2025-03-14','2025-03-14 12:52:35','2025-03-14 13:00:13',34,35),(36,'68030936',10000.00,8000.00,8000.00,10000.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','test',69,'2025-03-14','2025-03-14 12:55:19','2025-03-14 12:55:19',34,34),(37,'68030937',10000.00,10000.00,10000.00,10000.00,NULL,NULL,NULL,NULL,NULL,'อนุมัติ','test',69,'2025-03-18','2025-03-18 15:18:42','2025-03-18 15:22:43',34,35),(38,'68030938',10000.00,10000.00,10000.00,10000.00,NULL,NULL,NULL,NULL,NULL,'รอตรวจสอบ','test',78,'2025-03-18','2025-03-18 15:23:29','2025-03-18 15:23:29',34,34);
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
INSERT INTO `reimbursements_employee_deceased_has_categories` VALUES (1,9),(5,9),(20,9),(21,9),(22,9),(26,9),(33,9),(36,9),(38,9),(1,10),(20,10),(21,10),(26,10),(33,10),(1,11),(20,11),(21,11),(26,11),(33,11),(5,12),(21,12),(26,12),(33,12);
/*!40000 ALTER TABLE `reimbursements_employee_deceased_has_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements_general`
--

DROP TABLE IF EXISTS `reimbursements_general`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements_general` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `reim_number` varchar(45) NOT NULL,
  `fund_receipt` decimal(10,2) DEFAULT NULL,
  `fund_eligible` decimal(10,2) DEFAULT NULL,
  `fund_sum_request` decimal(10,2) NOT NULL,
  `fund_decree` decimal(10,2) DEFAULT NULL,
  `fund_university` decimal(10,2) DEFAULT NULL,
  `fund_eligible_name` varchar(255) DEFAULT NULL,
  `fund_eligible_sum` decimal(10,2) DEFAULT NULL,
  `fund_receipt_patient_visit` decimal(10,2) DEFAULT NULL,
  `fund_sum_request_patient_visit` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `date_receipt` date DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `status` enum('บันทึกฉบับร่าง','รอตรวจสอบ','อนุมัติ','ไม่อนุมัติ') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `categories_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reimbursements_general_users1_idx` (`created_by`),
  KEY `fk_reimbursements_general_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_reimbursements_general_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_reimbursements_general_users1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements_general`
--

LOCK TABLES `reimbursements_general` WRITE;
/*!40000 ALTER TABLE `reimbursements_general` DISABLE KEYS */;
INSERT INTO `reimbursements_general` VALUES (1,'0003',2000.00,200.00,601.00,200.00,200.00,'หมอพร้อม',3200.00,1200.00,400.00,'2025-02-09','2025-02-11',NULL,'2024-10-01','อนุมัติ','2025-02-04 07:08:35','2025-02-25 16:57:57',2,3,3),(2,'0004',300.00,300.00,600.00,NULL,NULL,NULL,800.00,500.00,300.00,'2025-02-09','2025-02-11',NULL,NULL,'บันทึกฉบับร่าง','2025-02-07 07:40:29','2025-02-25 17:18:06',2,2,3),(3,'68010103',300.00,NULL,400.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-08','อนุมัติ','2025-02-08 10:45:58','2025-06-13 16:12:55',1,1,1),(5,'68010104',2000.00,NULL,100.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-10','ไม่อนุมัติ','2025-02-09 14:50:03','2025-03-18 09:29:09',2,1,1),(6,'68010106',2000.00,NULL,1754.00,123.00,123.00,NULL,246.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-09 17:41:56','2025-02-13 16:12:55',1,1,1),(7,'68010107',50.40,NULL,50.40,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-09 17:44:33','2025-02-26 09:28:46',1,1,1),(8,'68010108',50.00,NULL,50.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-12','รอตรวจสอบ','2025-02-09 18:22:49','2025-02-13 07:24:26',2,1,1),(9,'68010109',200.00,NULL,200.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,'2025-02-12','2025-02-10','อนุมัติ','2025-02-09 18:22:52','2025-02-25 15:33:19',2,1,1),(10,'68010110',300.00,NULL,210.00,70.00,20.00,NULL,90.00,NULL,NULL,NULL,NULL,NULL,'2025-02-11','รอตรวจสอบ','2025-02-09 18:30:46','2025-02-11 12:57:45',2,1,1),(11,'68010111',100.00,NULL,100.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-10','อนุมัติ','2025-02-09 18:35:22','2025-03-04 07:40:35',2,1,1),(13,'68010113',100.00,NULL,100.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-12','รอตรวจสอบ','2025-02-09 18:38:43','2025-02-12 13:50:45',1,1,1),(15,'68010115',500.00,NULL,200.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,'2025-02-11',NULL,'บันทึกฉบับร่าง','2025-02-09 19:06:00','2025-02-20 15:19:01',2,4,2),(16,'68010116',500.00,100.00,200.00,100.00,100.00,'หมอพร้อม',300.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-09 19:06:15','2025-02-09 19:06:15',1,1,1),(17,'68010117',1500.00,NULL,1500.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-10','อนุมัติ','2025-02-10 05:36:08','2025-07-10 12:34:14',1,3,1),(18,'68010118',100.00,NULL,100.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-10','อนุมัติ','2025-02-10 05:36:48','2025-02-10 09:23:02',1,3,1),(19,'68010119',1000.00,NULL,1000.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-10 05:37:37','2025-02-10 05:37:37',2,3,1),(20,'68010120',123123.00,NULL,123123.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-10 05:39:23','2025-02-10 05:39:23',2,3,1),(21,'68010121',890.00,NULL,890.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-10','อนุมัติ','2025-02-10 06:02:04','2025-02-10 09:19:56',1,3,1),(22,'68010122',0.00,NULL,0.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-10','อนุมัติ','2025-02-10 06:13:25','2025-02-23 12:43:47',1,2,1),(23,'68010123',3000.00,NULL,3000.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-10','ไม่อนุมัติ','2025-02-10 15:37:11','2025-03-18 09:28:49',2,3,1),(24,'68010124',100.52,NULL,100.52,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-10','อนุมัติ','2025-02-10 16:51:09','2025-03-07 14:26:46',2,1,1),(25,'68010125',5000.00,NULL,5000.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-11','รอตรวจสอบ','2025-02-10 17:20:29','2025-02-10 17:20:29',2,2,1),(26,'68010126',500.00,NULL,500.00,0.00,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-02-11','รอตรวจสอบ','2025-02-10 17:20:46','2025-02-11 13:28:30',2,2,1),(27,'68010127',500.00,50.00,250.00,100.00,100.00,'เมียตำรวจ',250.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-12 17:22:12','2025-02-12 18:52:08',1,1,1),(29,'68020228',1500.00,NULL,300.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-04','2025-02-13','อนุมัติ','2025-02-13 07:07:25','2025-03-04 07:56:24',2,1,2),(30,'68020230',1000.00,NULL,200.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-09','2025-02-13','อนุมัติ','2025-02-13 07:09:25','2025-02-16 16:01:33',2,1,2),(33,'68010331',300.00,200.00,300.00,NULL,NULL,NULL,600.00,300.00,100.00,'2025-02-12','2025-02-12',NULL,'2025-02-14','อนุมัติ','2025-02-14 11:25:28','2025-03-04 07:50:41',2,2,3),(35,'68010234',5000.00,NULL,200.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-12','2025-02-16','อนุมัติ','2025-02-16 15:35:59','2025-02-25 15:34:22',2,2,2),(36,'68010236',300.00,NULL,300.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-02','2025-02-19','อนุมัติ','2025-02-19 15:58:25','2025-03-07 14:28:48',2,36,2),(37,'68010237',200.00,NULL,200.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-17','2025-02-19','รอตรวจสอบ','2025-02-19 16:04:53','2025-02-19 16:04:53',43,74,2),(38,'68010238',200.00,NULL,200.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-02','2025-02-19','รอตรวจสอบ','2025-02-19 16:06:29','2025-02-19 16:06:29',43,43,2),(39,'68010139',250.00,20.00,180.00,50.00,0.00,'เมียตำรวจ',70.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-19 16:16:30','2025-02-20 08:49:10',1,1,1),(40,'68010240',500.00,NULL,250.50,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-19',NULL,'บันทึกฉบับร่าง','2025-02-20 08:27:22','2025-02-26 09:29:32',1,1,2),(42,'68010341',300.00,200.00,400.00,NULL,NULL,NULL,800.00,500.00,200.00,'2025-02-03','2025-02-04',NULL,'2025-02-20','อนุมัติ','2025-02-20 09:22:01','2025-03-07 14:29:00',2,1,3),(43,'68010343',200.00,100.00,100.00,NULL,NULL,NULL,200.00,NULL,NULL,NULL,NULL,NULL,'2025-02-20','รอตรวจสอบ','2025-02-20 09:22:34','2025-02-20 09:35:10',1,1,3),(44,'68010344',500.00,200.00,350.00,NULL,NULL,NULL,800.00,300.00,150.00,'2025-01-01','2025-02-02',NULL,NULL,'บันทึกฉบับร่าง','2025-02-20 09:42:38','2025-02-20 14:29:41',1,1,3),(45,'68010245',100.00,NULL,90.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-02','2025-02-20','รอตรวจสอบ','2025-02-20 15:16:51','2025-03-04 18:56:37',2,3,2),(46,'68010246',200.00,NULL,20.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-04',NULL,'บันทึกฉบับร่าง','2025-02-20 15:21:32','2025-02-20 15:21:40',2,3,2),(47,'68010247',100.00,NULL,30.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-05','2025-02-20','อนุมัติ','2025-02-20 15:25:06','2025-02-21 14:18:07',2,3,2),(48,'68010248',100.00,NULL,20.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-05',NULL,'บันทึกฉบับร่าง','2025-02-20 15:28:35','2025-02-20 15:28:35',2,2,2),(49,'68010349',123.00,111.00,222.00,NULL,NULL,NULL,246.00,123.00,111.00,'2025-02-04','2025-02-05',NULL,'2025-02-20','รอตรวจสอบ','2025-02-20 15:52:36','2025-02-20 15:52:48',1,1,3),(50,'68010350',NULL,NULL,111.00,NULL,NULL,NULL,123.00,123.00,111.00,'2025-02-11','2025-02-11',NULL,NULL,'บันทึกฉบับร่าง','2025-02-20 15:57:41','2025-02-20 15:57:41',1,1,3),(51,'68010351',NULL,NULL,200.00,NULL,NULL,NULL,500.00,500.00,200.00,'2025-02-02','2025-02-05',NULL,NULL,'บันทึกฉบับร่าง','2025-02-21 08:19:21','2025-02-21 08:22:07',1,1,3),(52,'68010152',500.00,NULL,500.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-22 00:34:05','2025-02-22 00:34:05',3,3,1),(53,'68010153',2000.00,50.00,1950.00,NULL,NULL,'อื่น ๆ',50.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-24 07:59:30','2025-02-28 14:19:32',1,1,1),(54,'68010354',200.00,100.00,300.00,NULL,NULL,'อื่น ๆ',500.00,300.00,200.00,'2025-02-13','2025-02-13',NULL,NULL,'บันทึกฉบับร่าง','2025-02-24 08:29:37','2025-02-28 14:19:32',1,1,3),(55,'68010155',30.00,10.00,20.00,NULL,NULL,'อื่น ๆ',10.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-24 16:13:16','2025-02-28 14:19:32',43,43,1),(56,'68010156',500.00,200.00,300.00,NULL,NULL,'เมียตำรวจ',200.00,NULL,NULL,NULL,NULL,NULL,'2025-02-24','รอตรวจสอบ','2025-02-24 16:21:32','2025-02-24 16:21:32',34,43,1),(57,'68010157',500.00,200.00,300.00,NULL,NULL,'ภรรยาตำรวจ',200.00,NULL,NULL,NULL,NULL,NULL,'2025-02-24','รอตรวจสอบ','2025-02-24 16:22:53','2025-02-24 16:22:53',34,43,1),(58,'68010258',300.00,NULL,200.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-02-25',NULL,'บันทึกฉบับร่าง','2025-02-25 02:47:01','2025-02-25 02:47:01',43,43,2),(59,'68010159',500.00,NULL,200.00,100.00,200.00,NULL,300.00,NULL,NULL,NULL,NULL,NULL,'2025-02-25','รอตรวจสอบ','2025-02-25 08:45:00','2025-02-25 08:45:32',1,1,1),(61,'68010161',300.35,NULL,100.00,100.00,100.35,NULL,200.35,NULL,NULL,NULL,NULL,NULL,'2025-02-26','รอตรวจสอบ','2025-02-26 15:08:52','2025-02-26 15:10:40',1,1,1),(62,'68010362',3000.00,0.10,0.10,NULL,NULL,NULL,3000.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-26 15:13:58','2025-02-26 15:24:11',1,1,3),(63,'68010363',200.00,200.00,200.00,NULL,NULL,NULL,200.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-02-26 15:55:27','2025-02-26 15:55:27',43,43,3),(64,'68010164',100.00,NULL,40.00,60.00,NULL,NULL,60.00,NULL,NULL,NULL,NULL,NULL,'2025-02-28','รอตรวจสอบ','2025-02-28 11:42:26','2025-02-28 11:43:18',1,1,1),(65,'68010165',100.00,50.00,50.00,NULL,NULL,'อื่น ๆ',50.00,NULL,NULL,NULL,NULL,NULL,'2025-02-28','รอตรวจสอบ','2025-02-28 11:47:29','2025-02-28 14:19:32',1,1,1),(66,'68010166',100.00,40.00,50.00,10.00,NULL,'-',50.00,NULL,NULL,NULL,NULL,NULL,'2025-03-01','รอตรวจสอบ','2025-03-01 07:21:05','2025-03-01 07:21:45',1,1,1),(67,'68010167',400.00,100.00,100.00,100.00,100.00,'ได้รับพิเศษ',300.00,NULL,NULL,NULL,NULL,NULL,'2025-03-05','รอตรวจสอบ','2025-03-05 15:29:34','2025-03-05 15:29:56',1,1,1),(68,'68010168',1200.00,NULL,1200.00,NULL,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL,'2025-03-07','รอตรวจสอบ','2025-03-07 06:37:08','2025-03-07 06:37:08',2,2,1),(69,'68010369',2000.00,1000.00,1200.00,NULL,NULL,NULL,5000.00,3000.00,200.00,'2025-03-04','2025-03-06',NULL,'2025-03-07','อนุมัติ','2025-03-07 06:40:28','2025-03-07 07:12:50',2,2,3),(70,'68010270',2000.00,NULL,1300.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-06','2025-03-07','รอตรวจสอบ','2025-03-07 06:40:43','2025-03-07 06:40:43',2,2,2),(71,'68010171',400.00,NULL,100.00,300.00,NULL,NULL,300.00,NULL,NULL,NULL,NULL,NULL,NULL,'บันทึกฉบับร่าง','2025-03-10 21:24:51','2025-03-10 21:24:51',2,2,1),(72,'68010172',300.00,50.00,50.00,100.00,100.00,'พิเศษ',250.00,NULL,NULL,NULL,NULL,NULL,'2025-03-11','รอตรวจสอบ','2025-03-11 03:56:37','2025-03-11 03:56:59',43,43,1),(73,'68010373',500.00,300.00,500.00,NULL,NULL,NULL,1000.00,500.00,200.00,'2025-03-02','2025-03-02',NULL,'2025-03-11','รอตรวจสอบ','2025-03-11 03:58:57','2025-03-11 03:59:09',43,43,3),(74,'68010374',NULL,NULL,1000.00,NULL,NULL,NULL,1002.00,1002.00,1000.00,'2025-03-03','2025-03-03',NULL,'2025-03-11','อนุมัติ','2025-03-11 04:25:59','2025-03-11 04:29:44',43,43,3),(75,'68010375',4000.00,3000.00,3700.00,NULL,NULL,NULL,5000.00,1000.00,700.00,'2025-03-05','2025-03-05',NULL,'2025-03-11','ไม่อนุมัติ','2025-03-11 04:27:05','2025-03-11 04:30:29',43,43,3),(76,'68010376',1000.00,1000.00,1000.00,NULL,NULL,NULL,1000.00,NULL,NULL,NULL,NULL,NULL,'2025-03-11','รอตรวจสอบ','2025-03-11 04:27:42','2025-03-11 04:27:56',43,43,3),(77,'68010277',500.00,NULL,300.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-04','2025-03-11','ไม่อนุมัติ','2025-03-11 04:34:24','2025-03-11 04:37:55',43,43,2),(78,'68010278',1000.00,NULL,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-07','2025-03-11','รอตรวจสอบ','2025-03-11 04:35:33','2025-03-11 04:36:29',43,43,2),(79,'68010379',NULL,NULL,1000.00,NULL,NULL,NULL,2000.00,2000.00,1000.00,'2025-03-02','2025-03-05',NULL,'2025-03-11','อนุมัติ','2025-03-11 08:27:54','2025-03-11 09:14:21',34,1,3),(80,'68010380',4000.00,3000.00,3000.00,NULL,NULL,NULL,4000.00,NULL,NULL,NULL,NULL,NULL,'2025-03-11','รอตรวจสอบ','2025-03-11 08:29:48','2025-03-11 08:29:48',1,1,3),(81,'68010281',3000.00,NULL,1000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-02','2025-03-11','อนุมัติ','2025-03-11 08:30:50','2025-03-11 09:03:29',34,1,2),(82,'68010182',500.00,100.00,300.00,100.00,300.00,'หมอพร้อม',500.00,NULL,NULL,NULL,NULL,NULL,'2025-03-16','รอตรวจสอบ','2025-03-16 12:28:42','2025-03-16 12:28:42',1,1,1);
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
INSERT INTO `reimbursements_general_has_sub_categories` VALUES (1,1),(2,1),(33,1),(42,1),(43,1),(44,1),(49,1),(54,1),(62,1),(63,1),(69,1),(73,1),(76,1),(80,1),(1,2),(2,2),(33,2),(42,2),(44,2),(49,2),(50,2),(51,2),(54,2),(69,2),(73,2);
/*!40000 ALTER TABLE `reimbursements_general_has_sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'บุคลากรทั่วไป','2025-01-24 10:06:52','2025-01-24 10:06:52'),(2,'เจ้าหน้าที่การเงิน','2025-01-25 10:58:31','2025-03-07 08:02:32'),(3,'ตัวแทนผู้เบิก','2025-01-25 10:58:31','2025-01-25 10:58:31'),(4,'ผู้ดูแลระบบ','2025-01-28 07:00:56','2025-01-28 07:00:56');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector`
--

DROP TABLE IF EXISTS `sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sector` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
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
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fund` decimal(10,2) DEFAULT NULL,
  `per_times` decimal(10,2) DEFAULT NULL,
  `per_years` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `categories_id` bigint(20) DEFAULT NULL,
  `per_users` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sub_categories_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_sub_categories_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,'ประสบอุบัติเหตุขณะปฏิบัติงาน',NULL,3000.00,NULL,'2025-01-25 11:14:34','2025-03-05 11:26:13',3,NULL),(2,'เยี่ยมไข้',NULL,1000.00,3,'2025-01-25 11:15:34','2025-03-10 21:09:01',3,NULL),(3,'บิดา',5000.00,NULL,NULL,'2025-01-25 11:19:39','2025-03-11 23:32:05',8,1),(4,'มารดา',5000.00,NULL,NULL,'2025-01-25 11:19:39','2025-03-11 23:37:14',8,1),(5,'คู่สมรส',5000.00,NULL,NULL,'2025-01-25 11:19:39','2025-03-11 23:37:24',8,1),(6,'บุตร',5000.00,NULL,NULL,'2025-01-25 11:19:39','2025-03-11 23:37:30',8,1),(7,'สนับสนุนพวงหรีดในนามส่วนบุคคล',NULL,2000.00,NULL,'2025-02-05 11:19:15','2025-02-20 09:34:39',8,NULL),(8,'สนับสนุนพวงหรีดในนามมหาวิทยาลัยบูรพา',NULL,2000.00,NULL,'2025-02-05 11:19:15','2025-02-20 09:34:39',8,NULL),(9,'พาหนะเหมาจ่าย',NULL,10000.00,NULL,'2025-02-05 11:19:15','2025-02-20 09:34:39',8,NULL),(10,'ระดับมัธยมศึกษาปีที่ 1 - 3',7700.00,3850.00,2,'2025-01-25 11:23:37','2025-02-05 11:43:38',13,NULL),(11,'ระดับมัธยมศึกษาปีที่ 4 - 6',7700.00,3850.00,2,'2025-01-25 11:23:37','2025-02-05 11:43:38',13,NULL),(12,'ระดับปฐมวัย',6000.00,3000.00,2,'2025-01-25 11:23:37','2025-02-05 11:43:38',14,NULL),(13,'ระดับมัธยมศึกษาปีที่ 4 – 6 (หรือเทียบเท่า)',13300.00,6650.00,2,'2025-01-25 11:23:38','2025-02-05 11:30:25',14,NULL),(14,'ระดับปฐมศึกษาปีที่ 1 - 3',6400.00,3200.00,2,'2025-01-25 11:23:37','2025-02-05 11:39:52',14,NULL),(15,'ระดับปฐมศึกษาปีที่ 4 - 6',7100.00,3550.00,2,'2025-01-25 11:23:37','2025-02-05 11:39:52',14,NULL),(16,'ระดับมัธยมศึกษาปีที่ 1 - 3',10300.00,5150.00,2,'2025-01-25 11:23:38','2025-02-05 11:39:52',14,NULL),(17,'ระดับปฐมวัยโปรแกรมทั่วไป',14400.00,7200.00,2,'2025-01-25 11:31:16','2025-02-09 12:00:33',15,NULL),(18,'ระดับปฐมวัยโปรแกรมเน้นความสามารถทางภาษา',23400.00,11700.00,2,'2025-01-25 11:31:16','2025-02-05 11:41:23',15,NULL),(19,'ระดับปฐมศึกษาปีที่ 1 – 6 โปรแกรมทั่วไป',9000.00,4500.00,2,'2025-01-25 11:31:16','2025-02-19 10:25:49',15,NULL),(20,'ระดับปฐมศึกษาปีที่ 1 – 6 โปรแกรมเน้นความสามารถทางภาษา',18000.00,9000.00,2,'2025-01-25 11:31:16','2025-02-19 10:25:49',15,NULL),(21,'ระดับปฐมศึกษาปีที่ 1 – 6 โปรแกรมศึกษาพิเศษแบบบูรณาการ',39000.00,19500.00,2,'2025-01-25 11:31:16','2025-02-19 10:25:49',15,NULL),(22,'ระดับมัธยมศึกษาโปรแกรมทั่วไป',9000.00,4500.00,2,'2025-01-25 11:31:16','2025-02-19 10:25:49',15,NULL),(23,'ระดับมัธยมศึกษาโปรแกรมเน้นความสามารถทางภาษา',21000.00,10500.00,2,'2025-01-25 11:31:17','2025-02-19 10:25:49',15,NULL),(24,'ระดับมัธยมศึกษาโปรแกรมเน้นความสามารถทางคณิต-วิทย์',21000.00,10500.00,2,'2025-01-25 11:31:17','2025-02-19 10:25:49',15,NULL),(25,'ระดับมัธยมศึกษาโปรแกรมศึกษาพิเศษแบบบูรณาการ',39000.00,19500.00,2,'2025-01-25 11:31:17','2025-02-19 10:25:49',15,NULL),(26,'ระดับปฐมศึกษาปีที่ 1 – 6',37300.00,18650.00,2,'2025-01-25 11:33:44','2025-02-19 10:27:52',16,NULL),(27,'ระดับมัธยมศึกษาปีที่ 1 - 6',37300.00,18650.00,2,'2025-01-25 11:33:44','2025-02-19 10:27:53',16,NULL),(28,'ระดับปฐมศึกษาปีที่ 1 - 3',38600.00,19300.00,2,'2025-01-25 11:33:44','2025-02-19 10:27:53',17,NULL),(29,'ระดับปฐมศึกษาปีที่ 4 - 6',37900.00,18950.00,2,'2025-01-25 11:33:44','2025-02-19 10:27:53',17,NULL),(30,'ระดับมัธยมศึกษาปีที่ 1 - 3',34700.00,17350.00,2,'2025-01-25 11:33:44','2025-02-19 10:27:53',17,NULL),(31,'ระดับมัธยมศึกษาปีที่ 4 - 6',31700.00,15850.00,2,'2025-01-25 11:33:44','2025-02-19 10:27:53',17,NULL);
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
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `house_number` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `sub_district` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'นาย แอดมินจ้า เอาไว้ทดสอบ','64160289@buu.ac.th','admin','$2a$12$uwYPIKhfw0dtYNC36DOuAu0aJ2J11Tt.O1jJLW3fuc5XBjgDTWEd.','2025-01-24',0,0,'2025-01-24 10:10:32','2025-02-25 14:10:21',NULL,'205','-','เมืองชลบุรี','แสนสุข','ชลบุรี','12345',1,1,1,4,1),(2,'นาย ภานุพงศ์ คนซื่อ','64160282@buu.ac.th','64160282','$2a$12$uwYPIKhfw0dtYNC36DOuAu0aJ2J11Tt.O1jJLW3fuc5XBjgDTWEd.','2024-01-01',0,1,'2025-01-28 07:08:54','2025-03-07 07:02:38',NULL,'205','-','เมืองชลบุรี','แสนสุข','ชลบุรี','12345',3,1,1,2,1),(3,'นาย สุดทะพัด บุญทัน','64160284@go.buu.ac.th','64160284',NULL,'2024-12-25',0,0,'2025-01-28 07:08:54','2025-02-25 14:10:21',NULL,'','','','','','',2,1,1,1,1),(4,'นาย ภูริน ลามากุล','6416290@go.buu.ac.th','64160290',NULL,'2025-02-03',0,0,'2025-01-28 07:08:54','2025-02-25 14:10:21',NULL,'','','','','','',4,1,1,1,1),(5,'นาง สุกันยา ยมเสถียรกุล','64160173@go.buu.ac.th','64160173',NULL,'2024-09-15',0,0,'2025-01-28 07:11:05','2025-02-25 14:10:21',NULL,'','','','','','',1,1,1,1,1),(6,'นาย รวิช พิบูล','64160283@buu.ac.th','64160283',NULL,'2025-01-29',0,0,'2025-01-29 17:00:31','2025-02-25 14:10:21',NULL,'','','','','','',1,1,1,1,1),(34,'นาย เจ้าหน้าที่ฝ่ายการเงิน','financial@buu.ac.th','financial','$2a$12$uwYPIKhfw0dtYNC36DOuAu0aJ2J11Tt.O1jJLW3fuc5XBjgDTWEd.','2025-01-29',0,1,'2025-02-02 05:27:58','2025-02-25 14:10:21',NULL,'111','-','สนามชัยเขต','ท่ากระดาน','ฉะเชิงเทรา','24160',1,1,1,2,1),(35,'นาย เจ้าหน้าที่ตัวแทน','staff@buu.ac.th','staff','$2a$12$uwYPIKhfw0dtYNC36DOuAu0aJ2J11Tt.O1jJLW3fuc5XBjgDTWEd.','2025-01-29',0,1,'2025-02-02 05:29:05','2025-02-25 14:10:21',NULL,'111','-','สนามชัยเขต','ท่ากระดาน','ฉะเชิงเทรา','24160',1,1,1,3,1),(36,'นาย บุลากรทั่วไป','111113@buu.ac.th','user','$2a$12$uwYPIKhfw0dtYNC36DOuAu0aJ2J11Tt.O1jJLW3fuc5XBjgDTWEd.','2025-01-29',0,0,'2025-02-02 05:30:17','2025-02-25 14:10:21',NULL,'','','','','','',1,1,1,1,1),(37,'นาย ฉุดคิด มียังน้า','111114@buu.ac.th','111114',NULL,'2025-01-29',0,0,'2025-02-02 05:31:12','2025-02-25 14:10:21','2025-02-02 15:49:13','','','','','','',1,1,1,1,1),(38,'นาย สุขใจ ใจสมุด','111115@buu.ac.th','111115',NULL,'2025-01-29',0,0,'2025-02-02 05:34:04','2025-02-25 14:10:21','2025-02-07 10:10:44','','','','','','',1,1,1,1,1),(39,'นาย สุขใจ คนดี','111116@buu.ac.th','111116',NULL,'2025-01-29',0,0,'2025-02-02 05:36:06','2025-02-25 14:10:21','2025-02-02 15:49:25','','','','','','',1,1,1,1,1),(40,'นาย กวิช เรืองไทย','111117@buu.ac.th','111117',NULL,'2025-01-29',0,0,'2025-02-02 05:36:59','2025-02-25 14:10:21',NULL,'','','','','','',1,1,1,1,1),(41,'นาย ภูริน เรืองไทย','111118@buu.ac.th','111118',NULL,'2025-01-29',0,0,'2025-02-02 05:37:51','2025-02-25 14:10:21','2025-02-07 10:11:24','','','','','','',1,1,1,1,1),(42,'นาย สุทะพัด เรืองไทย','111119@buu.ac.th','111119',NULL,'2025-01-29',0,0,'2025-02-02 05:38:41','2025-02-25 14:10:21','2025-02-02 16:47:59','','','','','','',1,1,1,1,1),(43,'นางสาว นฤมล แวงดงบังไพศาล','64160061@buu.ac.th','64160061',NULL,'2025-02-04',0,1,'2025-02-04 06:01:55','2025-02-28 11:35:25',NULL,'185','-','สนามชัยเขต','ท่ากระดาน','ฉะเชิงเทรา','24160',1,1,1,2,1),(44,'นาย ปะวี แสงสีเสียง','ุ64160300@buu.ac.th','ุ64160300',NULL,'2025-02-06',43,43,'2025-02-06 06:04:12','2025-02-25 14:10:21',NULL,'','','','','','',3,1,1,1,1),(45,'นาย ทด สอบ','Test@buu.ac.th','Test',NULL,'2025-02-02',43,43,'2025-02-06 06:08:19','2025-02-25 14:10:21','2025-02-06 06:21:59','','','','','','',1,1,1,1,1),(46,'นาย ปะวี แสงจ้า','64160300@buu.ac.th','64160300',NULL,'2025-02-06',43,1,'2025-02-06 06:23:06','2025-02-25 14:10:21','2025-02-10 16:37:06','','','','','','',3,1,1,2,1),(47,'นาย สุกัญญา พิมพ์ตีข้อ','uuii@buu.ac.th','uuii',NULL,'2024-05-05',1,1,'2025-02-06 06:57:49','2025-02-25 14:10:21',NULL,'','','','','','',3,1,1,2,1),(49,'นาย ภานุพงศ์ คนจ้า','64160284@buu.ac.th','64160284',NULL,'2025-02-12',1,1,'2025-02-07 10:16:36','2025-02-25 14:10:21',NULL,'','','','','','',1,1,1,2,1),(56,'นาย สุดา มิซีลี้','ghvvc@buu.ac.th','ghvvc',NULL,'2024-11-11',1,1,'2025-02-10 16:35:22','2025-02-25 14:10:21',NULL,'','','','','','',4,1,1,1,1),(64,'นาย สาหรัน เหลืองชมพู','641600000@buu.ac.th','641600000',NULL,'2025-02-11',2,2,'2025-02-11 13:52:40','2025-02-25 14:10:21',NULL,'','','','','','',4,1,1,2,1),(65,'สุทะพัด บุญครอง','641602222@buu.ac.th','641602222',NULL,'2025-02-04',2,2,'2025-02-11 14:05:41','2025-02-11 14:05:41',NULL,'','','','','','',2,1,1,1,1),(66,'ทดสอบ เพิ่มบุตร','46345325@buu.ac.th','46345325',NULL,'2025-02-11',2,2,'2025-02-11 14:08:42','2025-02-11 14:08:42',NULL,'','','','','','',2,1,1,1,1),(67,'ภูริช ภูริน','6416060606060@buu.ac.th','6416060606060',NULL,'2025-02-12',2,2,'2025-02-11 14:41:09','2025-02-11 14:41:09',NULL,'','','','','','',1,1,1,2,1),(68,'ทดสอบ ภูริน','641601929292@buu.ac.th','641601929292',NULL,'2025-02-10',2,2,'2025-02-11 15:18:38','2025-02-11 15:18:38',NULL,'','','','','','',3,1,1,1,1),(69,'นฤมล แวงๆๆๆๆๆ','64122222222@buu.ac.th','64122222222',NULL,'2025-02-04',2,2,'2025-02-11 15:32:30','2025-02-11 15:32:30',NULL,'','','','','','',1,1,1,2,1),(70,'ทดสอบ ก่อนใคร','640101010@buu.ac.th','640101010',NULL,'2025-02-19',2,2,'2025-02-11 15:45:18','2025-02-11 15:45:18',NULL,'','','','','','',2,1,1,2,1),(71,'เบนจา มิน','64160165@buu.ac.th','64160165',NULL,'2025-02-11',1,1,'2025-02-12 17:04:12','2025-02-12 17:04:12',NULL,'','','','','','',1,1,1,1,1),(72,'รัน เทส','123456@buu.ac.th','123456',NULL,'2025-02-13',1,1,'2025-02-12 18:15:04','2025-02-12 19:00:55','2025-02-12 19:00:55','','','','','','',3,1,1,1,1),(74,'ทดสอบ ลบบุตร','0000000000@buu.ac.th','0000000000',NULL,'2025-02-18',1,1,'2025-02-19 15:43:48','2025-02-19 15:43:48',NULL,'','','','','','',2,3,1,1,1),(75,'ทดสอบ เพิ่มลูกสองคน','0000000001@buu.ac.th','0000000001',NULL,'2025-02-02',1,1,'2025-02-19 15:46:22','2025-02-19 15:46:22',NULL,'','','','','','',3,1,1,1,1),(76,'เอเม่ก้า เบรค','64160111@buu.ac.th','64160111',NULL,'2025-02-02',1,1,'2025-02-24 00:05:01','2025-02-24 00:05:01',NULL,'185/15','-','เมือง','แสนสุข','ชลบุรี','20130',1,1,1,1,1),(77,'แก้ไข เพิ่มใบ','011111@buu.ac.th','011111',NULL,'2025-02-25',1,1,'2025-02-25 08:40:16','2025-02-25 08:42:58',NULL,'11','-','สนามชัยเขต','ท่ากระดาน','ฉะเชิงเทรา','24160',2,1,1,1,1),(78,'นางสาว ฟ้า ใหม่','654321@buu.ac.th','654321',NULL,'2024-03-04',43,43,'2025-03-11 03:54:07','2025-03-11 03:54:07',NULL,'123','-','พานทอง','บ้านเก่า','ชลบุรี','20131',1,1,1,2,1),(79,'นาย แดง คนดี','aa1234@buu.ac.th','aa1234',NULL,'2018-09-10',1,1,'2025-03-11 08:12:00','2025-03-11 08:12:00',NULL,'63/2','-','แปลงยาว','วังเย็น','ฉะเชิงเทรา','24190',1,1,1,1,1);
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
  1 AS `category_name`,
  1 AS `category_per_times`,
  1 AS `category_per_users`,
  1 AS `category_per_years`,
  1 AS `category_fund`,
  1 AS `sub_category_id`,
  1 AS `sub_category_name`,
  1 AS `sub_category_per_times`,
  1 AS `sub_category_per_users`,
  1 AS `sub_category_per_years`,
  1 AS `sub_category_fund` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_dashboard`
--

DROP TABLE IF EXISTS `view_dashboard`;
/*!50001 DROP VIEW IF EXISTS `view_dashboard`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_dashboard` AS SELECT
 1 AS `welfare_type`,
  1 AS `id`,
  1 AS `reim_number`,
  1 AS `fund_sum_request`,
  1 AS `created_by`,
  1 AS `request_date`,
  1 AS `updated_at`,
  1 AS `status`,
  1 AS `category_id`,
  1 AS `sub_category_id`,
  1 AS `created_by_user_name`,
  1 AS `category_name`,
  1 AS `sub_category_name`,
  1 AS `created_by_name`,
  1 AS `employee_types_id`,
  1 AS `employee_types_name` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_reimbursements`
--

DROP TABLE IF EXISTS `view_reimbursements`;
/*!50001 DROP VIEW IF EXISTS `view_reimbursements`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_reimbursements` AS SELECT
 1 AS `welfare_type`,
  1 AS `id`,
  1 AS `reim_number`,
  1 AS `created_by`,
  1 AS `request_date`,
  1 AS `updated_at`,
  1 AS `status`,
  1 AS `category_id`,
  1 AS `sub_category_id`,
  1 AS `created_by_user_name`,
  1 AS `category_name`,
  1 AS `sub_category_name` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `welfare_types`
--

DROP TABLE IF EXISTS `welfare_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `welfare_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
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
/*!50001 VIEW `view_category_welfare_sub` AS select `category_welfare_type`.`welfare_id` AS `welfare_id`,`category_welfare_type`.`welfare_name` AS `welfare_name`,`category_welfare_type`.`category_id` AS `category_id`,`category_welfare_type`.`category_name` AS `category_name`,`category_welfare_type`.`category_per_times` AS `category_per_times`,`category_welfare_type`.`category_per_users` AS `category_per_users`,`category_welfare_type`.`category_per_years` AS `category_per_years`,`category_welfare_type`.`category_fund` AS `category_fund`,`sub`.`id` AS `sub_category_id`,`sub`.`name` AS `sub_category_name`,`sub`.`per_times` AS `sub_category_per_times`,`sub`.`per_users` AS `sub_category_per_users`,`sub`.`per_years` AS `sub_category_per_years`,`sub`.`fund` AS `sub_category_fund` from ((select `welfare`.`id` AS `welfare_id`,`welfare`.`name` AS `welfare_name`,`cat`.`id` AS `category_id`,`cat`.`name` AS `category_name`,`cat`.`per_times` AS `category_per_times`,`cat`.`per_users` AS `category_per_users`,`cat`.`per_years` AS `category_per_years`,`cat`.`fund` AS `category_fund` from (`welfare_types` `welfare` left join `categories` `cat` on(`welfare`.`id` = `cat`.`welfare_types_id`))) `category_welfare_type` left join `sub_categories` `sub` on(`category_welfare_type`.`category_id` = `sub`.`categories_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_dashboard`
--

/*!50001 DROP VIEW IF EXISTS `view_dashboard`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_dashboard` AS select 'สวัสดิการค่าสงเคราะห์ต่าง ๆ' collate utf8mb4_unicode_ci AS `welfare_type`,`ra`.`id` AS `id`,`ra`.`reim_number` AS `reim_number`,`ra`.`fund_sum_request` AS `fund_sum_request`,`ra`.`created_by` AS `created_by`,`ra`.`request_date` AS `request_date`,`ra`.`updated_at` AS `updated_at`,`ra`.`status` AS `status`,`ra`.`categories_id` AS `category_id`,`ras`.`sub_categories_id` AS `sub_category_id`,`u`.`name` AS `created_by_user_name`,`c`.`name` AS `category_name`,`sc`.`name` AS `sub_category_name`,`u`.`name` AS `created_by_name`,`u`.`employee_types_id` AS `employee_types_id`,`em`.`name` AS `employee_types_name` from (((((`reimbursements_assist` `ra` join `users` `u` on(`ra`.`created_by` = `u`.`id`)) left join `categories` `c` on(`ra`.`categories_id` = `c`.`id`)) left join `reimbursements_assist_has_sub_categories` `ras` on(`ra`.`id` = `ras`.`reimbursements_assist_id`)) left join `sub_categories` `sc` on(`ras`.`sub_categories_id` = `sc`.`id`)) left join `employee_types` `em` on(`u`.`employee_types_id` = `em`.`id`)) where `ra`.`status` = 3 union all select 'สวัสดิการเกี่ยวกับการศึกษาของบุตร' collate utf8mb4_unicode_ci AS `welfare_type`,`rce`.`id` AS `id`,`rce`.`reim_number` AS `reim_number`,`rce`.`fund_sum_request` AS `fund_sum_request`,`rce`.`created_by` AS `created_by`,`rce`.`request_date` AS `request_date`,`rce`.`updated_at` AS `updated_at`,`rce`.`status` AS `status`,NULL AS `category_id`,`rcec`.`children_infomation_id` AS `sub_category_id`,`u`.`name` AS `created_by_user_name`,NULL AS `category_name`,NULL AS `sub_category_name`,`u`.`name` AS `created_by_name`,`u`.`employee_types_id` AS `employee_types_id`,`em`.`name` AS `employee_types_name` from (((`reimbursements_children_education` `rce` join `users` `u` on(`rce`.`created_by` = `u`.`id`)) left join `reimbursements_children_education_has_children_infomation` `rcec` on(`rce`.`id` = `rcec`.`reimbursements_children_education_id`)) left join `employee_types` `em` on(`u`.`employee_types_id` = `em`.`id`)) where `rce`.`status` = 3 union all select 'สวัสดิการค่าสงเคราะห์การเสียชีวิต' collate utf8mb4_unicode_ci AS `welfare_type`,`red`.`id` AS `id`,`red`.`reim_number` AS `reim_number`,`red`.`fund_sum_request` AS `fund_sum_request`,`red`.`created_by` AS `created_by`,`red`.`request_date` AS `request_date`,`red`.`updated_at` AS `updated_at`,`red`.`status` AS `status`,NULL AS `category_id`,`rec`.`categories_id` AS `sub_category_id`,`u`.`name` AS `created_by_user_name`,NULL AS `category_name`,NULL AS `sub_category_name`,`u`.`name` AS `created_by_name`,`u`.`employee_types_id` AS `employee_types_id`,`em`.`name` AS `employee_types_name` from ((((`reimbursements_employee_deceased` `red` join `users` `u` on(`red`.`created_by` = `u`.`id`)) left join `reimbursements_employee_deceased_has_categories` `rec` on(`red`.`id` = `rec`.`reimbursements_employee_deceased_id`)) left join `categories` `c` on(`rec`.`categories_id` = `c`.`id`)) left join `employee_types` `em` on(`u`.`employee_types_id` = `em`.`id`)) where `red`.`status` = 3 union all select 'สวัสดิการทั่วไป' collate utf8mb4_unicode_ci AS `welfare_type`,`rg`.`id` AS `id`,`rg`.`reim_number` AS `reim_number`,`rg`.`fund_sum_request` AS `fund_sum_request`,`rg`.`created_by` AS `created_by`,`rg`.`request_date` AS `request_date`,`rg`.`updated_at` AS `updated_at`,`rg`.`status` AS `status`,`rg`.`categories_id` AS `category_id`,`rgs`.`sub_categories_id` AS `sub_category_id`,`u`.`name` AS `created_by_user_name`,`c`.`name` AS `category_name`,`sc`.`name` AS `sub_category_name`,`u`.`name` AS `created_by_name`,`u`.`employee_types_id` AS `employee_types_id`,`em`.`name` AS `employee_types_name` from (((((`reimbursements_general` `rg` join `users` `u` on(`rg`.`created_by` = `u`.`id`)) left join `categories` `c` on(`rg`.`categories_id` = `c`.`id`)) left join `reimbursements_general_has_sub_categories` `rgs` on(`rg`.`id` = `rgs`.`reimbursements_general_id`)) left join `sub_categories` `sc` on(`rgs`.`sub_categories_id` = `sc`.`id`)) left join `employee_types` `em` on(`u`.`employee_types_id` = `em`.`id`)) where `rg`.`status` = 3 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_reimbursements`
--

/*!50001 DROP VIEW IF EXISTS `view_reimbursements`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_reimbursements` AS select 'สวัสดิการค่าสงเคราะห์ต่าง ๆ' collate utf8mb4_unicode_ci AS `welfare_type`,`ra`.`id` AS `id`,`ra`.`reim_number` AS `reim_number`,`ra`.`created_by` AS `created_by`,`ra`.`request_date` AS `request_date`,`ra`.`updated_at` AS `updated_at`,`ra`.`status` AS `status`,`ra`.`categories_id` AS `category_id`,NULL AS `sub_category_id`,`u`.`name` AS `created_by_user_name`,`c`.`name` AS `category_name`,NULL AS `sub_category_name` from ((`reimbursements_assist` `ra` join `users` `u` on(`ra`.`created_by` = `u`.`id`)) left join `categories` `c` on(`ra`.`categories_id` = `c`.`id`)) where `ra`.`status` <> 1 union all select 'สวัสดิการเกี่ยวกับการศึกษาของบุตร' collate utf8mb4_unicode_ci AS `welfare_type`,`rce`.`id` AS `id`,`rce`.`reim_number` AS `reim_number`,`rce`.`created_by` AS `created_by`,`rce`.`request_date` AS `request_date`,`rce`.`updated_at` AS `updated_at`,`rce`.`status` AS `status`,NULL AS `category_id`,NULL AS `sub_category_id`,`u`.`name` AS `created_by_user_name`,NULL AS `category_name`,NULL AS `sub_category_name` from (`reimbursements_children_education` `rce` join `users` `u` on(`rce`.`created_by` = `u`.`id`)) where `rce`.`status` <> 1 union all select 'สวัสดิการค่าสงเคราะห์การเสียชีวิต' collate utf8mb4_unicode_ci AS `welfare_type`,`red`.`id` AS `id`,`red`.`reim_number` AS `reim_number`,`red`.`created_by` AS `created_by`,`red`.`request_date` AS `request_date`,`red`.`updated_at` AS `updated_at`,`red`.`status` AS `status`,NULL AS `category_id`,NULL AS `sub_category_id`,`u`.`name` AS `created_by_user_name`,NULL AS `category_name`,NULL AS `sub_category_name` from (`reimbursements_employee_deceased` `red` join `users` `u` on(`red`.`created_by` = `u`.`id`)) where `red`.`status` <> 1 union all select 'สวัสดิการทั่วไป' collate utf8mb4_unicode_ci AS `welfare_type`,`rg`.`id` AS `id`,`rg`.`reim_number` AS `reim_number`,`rg`.`created_by` AS `created_by`,`rg`.`request_date` AS `request_date`,`rg`.`updated_at` AS `updated_at`,`rg`.`status` AS `status`,`rg`.`categories_id` AS `category_id`,NULL AS `sub_category_id`,`u`.`name` AS `created_by_user_name`,`c`.`name` AS `category_name`,NULL AS `sub_category_name` from ((`reimbursements_general` `rg` join `users` `u` on(`rg`.`created_by` = `u`.`id`)) left join `categories` `c` on(`rg`.`categories_id` = `c`.`id`)) where `rg`.`status` <> 1 */;
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

-- Dump completed on 2025-03-19  4:09:31
