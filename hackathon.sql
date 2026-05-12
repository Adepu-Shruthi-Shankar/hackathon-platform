-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: hackathon_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `hackathon_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `hackathon_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `hackathon_db`;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Admin','admin@hackathon.com','admin123','2026-04-23 07:01:13');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `college_verifications`
--

DROP TABLE IF EXISTS `college_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `college_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `professor_id` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `college_verifications`
--

LOCK TABLES `college_verifications` WRITE;
/*!40000 ALTER TABLE `college_verifications` DISABLE KEYS */;
INSERT INTO `college_verifications` VALUES (1,'college@edu.com','Information Technology','uploads/1777110531962-738124544.png','2026-04-25 09:48:51'),(2,'college@edu.com','Information Technology','uploads/1777111806296-352482822.png','2026-04-25 10:10:06'),(3,'college@edu.com','Electrical Engineering','uploads/1777113099456-142975370.png','2026-04-25 10:31:39'),(4,'college@edu.com','Electrical Engineering','uploads/1777113550995-319530916.png','2026-04-25 10:39:11'),(5,'dean@edu.in','Computer Science & Engineering','uploads/1777113959407-766864186.png','2026-04-25 10:45:59'),(6,'dean@edu.in','Administration','uploads/1777141219990-584128141.png','2026-04-25 18:20:20'),(7,'dean@edu.in','Information Technology','uploads/1777292452580-789264566.pdf','2026-04-27 12:20:52'),(8,'dean@edu.in','Information Technology','uploads/1777293937934-785539028.docx','2026-04-27 12:45:38'),(9,'dean@edu.in','Administration','uploads/1777405884640-164838983.jpeg','2026-04-28 19:51:24'),(10,'dean@edu.in','Information Technology','uploads/1777466308088-714769252.jpeg','2026-04-29 12:38:28'),(11,'dean@edu.in','Computer Science & Engineering','uploads/1777470265721-907906693.jpeg','2026-04-29 13:44:25'),(12,'dean@edu.in','Administration','uploads/1777643117667-410766072.jpeg','2026-05-01 13:45:17'),(13,'dean@edu.in','Information Technology','uploads/1777643818509-349147965.jsx','2026-05-01 13:56:58'),(14,'dean@edu.in','Electrical Engineering','uploads/1777892560511-695387299.png','2026-05-04 11:02:40'),(15,'dean@edu.in','Computer Science & Engineering','uploads/1777911138029-777561778.png','2026-05-04 16:12:18'),(16,'college@gmail.com','Computer Science & Engineering','uploads/1778222307743-632967766.png','2026-05-08 06:38:27'),(17,'dean@edu.in','Information Technology','uploads/1778225916589-241211551.png','2026-05-08 07:38:36'),(18,'dean@edu.in','Information Technology','uploads/1778227698996-505332563.png','2026-05-08 08:08:19'),(19,'dean@edu.in','Information Technology','uploads/1778229239303-702758499.png','2026-05-08 08:33:59'),(20,'dean@edu.in','Information Technology','uploads/1778247621403-583830621.png','2026-05-08 13:40:21');
/*!40000 ALTER TABLE `college_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hackathons`
--

DROP TABLE IF EXISTS `hackathons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hackathons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `fee` decimal(10,2) DEFAULT '0.00',
  `eligibility` varchar(255) NOT NULL,
  `status` enum('active','pending','ended') DEFAULT 'active',
  `registered_count` int DEFAULT '0',
  `submitted_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hackathons`
--

LOCK TABLES `hackathons` WRITE;
/*!40000 ALTER TABLE `hackathons` DISABLE KEYS */;
INSERT INTO `hackathons` VALUES (1,'Test Hack','Test desc','2026-05-01','2026-05-02',100.00,'All students','active',5,5,'2026-04-23 16:22:15'),(3,'Test Hack','Testing ','2026-04-30','2026-05-01',0.00,'All students','active',0,0,'2026-04-28 10:41:53'),(4,'Smart City Innovation Challenge 2026','Build innovative technology solutions to solve real-world urban problems such as waste management, traffic monitoring, public safety, sustainability, and smart governance. Participants will work in teams to design, develop, and present their prototypes.','2026-05-15','2026-05-17',200.00,'All engineering students, developers, designers, and tech enthusiasts.','active',0,0,'2026-05-07 17:17:14'),(5,'GreenTech Sustainability Challenge 2026','A 36-hour innovation hackathon focused on creating technology solutions for environmental sustainability, renewable energy, smart agriculture, water conservation, waste reduction, and climate action. Teams will build impactful prototypes for a greener future.','2026-08-04','2026-08-06',150.00,'Engineering students, environmental researchers, developers, designers, innovators,  startup teams.','active',0,0,'2026-05-08 07:29:34');
/*!40000 ALTER TABLE `hackathons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury`
--

DROP TABLE IF EXISTS `jury`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `hackathon_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury`
--

LOCK TABLES `jury` WRITE;
/*!40000 ALTER TABLE `jury` DISABLE KEYS */;
/*!40000 ALTER TABLE `jury` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury_evaluations`
--

DROP TABLE IF EXISTS `jury_evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury_evaluations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_id` int NOT NULL,
  `jury_id` int NOT NULL,
  `rating` int NOT NULL,
  `feedback` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_evaluations`
--

LOCK TABLES `jury_evaluations` WRITE;
/*!40000 ALTER TABLE `jury_evaluations` DISABLE KEYS */;
INSERT INTO `jury_evaluations` VALUES (1,7,9,10,'Excellent','2026-05-08 08:05:55');
/*!40000 ALTER TABLE `jury_evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury_members`
--

DROP TABLE IF EXISTS `jury_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `expertise` varchar(150) NOT NULL,
  `organization` varchar(150) NOT NULL,
  `designation` varchar(150) NOT NULL DEFAULT '',
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `password_changed` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_members`
--

LOCK TABLES `jury_members` WRITE;
/*!40000 ALTER TABLE `jury_members` DISABLE KEYS */;
INSERT INTO `jury_members` VALUES (1,'John Smith','adepushruthis@gmail.com','Full Stack Developer','Google','Technical Judge','jury.john.smith.7351','$2b$10$00EmAhJZAOg7kCbmp.vmlebZV6LlnJZnq/lLiATXpQzQZGk4b6W1K',0,'2026-04-24 05:28:26'),(2,'Prema','Prema@gmail.com','Ai developer','TCS','Senior Evaluator','jury.prema.4898','$2b$10$GH8iVpCyH79XHbLzxBdjgOC/azXkRefMrm397Fx2SfxIeXsXOJLWW',0,'2026-04-24 05:34:24'),(3,'Meera','meera@gmail.com','Digital Marketing','IIT Madras','Chief Jury','jury.meera.8048','$2b$10$gKTyUdom.VUh4rAiZCzFvetPPbkCf4IWxKjvwmXOrEg.cG6daXcXW',0,'2026-04-24 05:38:43'),(4,'Dona','dona@gmail.com','Networkig','SRM','Academic Advisor','dona','$2b$10$eyJe1hAQBNigyv8pasl74eTtuRfVMRjprJVkZoARtgge3GgwQAY8W',0,'2026-04-24 05:39:35'),(5,'Mary','adepushruthi4867.21@gmail.com','Devops','COgnizant','Technical Judge','mary','$2b$10$oMqigeauNuVN4wXl95Z1neGUIzJ5ua6h0zROeqtz2Fy3GZJo3oGRy',1,'2026-04-25 11:40:29'),(6,'Shruthi','as8738@srmist.edu.in','Web','IIT','Senior Evaluator','shruthi','$2b$10$CuCbhGZvXzsmEIQCRR7sY.COfBSOyEpuJc9ptY0aso9qOcGYe986a',0,'2026-05-07 15:20:14'),(7,'Seetha','seetha@gmail.com','ML','TCS','Technical Judge','seetha','$2b$10$oHYdkH9FKyVJTmDXLehqlu6BZhS8KccP2KtnjyRFkYxwJgX9qm1Tm',0,'2026-05-08 07:32:51');
/*!40000 ALTER TABLE `jury_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury_results`
--

DROP TABLE IF EXISTS `jury_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hackathon_id` int NOT NULL,
  `team_id` int NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `leader_name` varchar(100) NOT NULL,
  `project_title` varchar(200) NOT NULL,
  `announced` tinyint(1) DEFAULT '0',
  `announced_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `hackathon_id` (`hackathon_id`),
  CONSTRAINT `jury_results_ibfk_1` FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_results`
--

LOCK TABLES `jury_results` WRITE;
/*!40000 ALTER TABLE `jury_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `jury_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `hackathon_id` int NOT NULL,
  `team_details` text,
  `payment_status` enum('pending','paid') DEFAULT 'pending',
  `approval_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `submission_file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (1,1,1,'{\"teamName\":\"codeers\",\"projectName\":\"models\",\"leaderEmail\":\"asthaasingh011@gmail.com\"}','pending','rejected',NULL,'2026-04-28 19:16:13'),(2,1,2,'{\"teamName\":\"Coders\",\"projectName\":\"LIFI\",\"leaderEmail\":\"leader@email.com\"}','pending','rejected',NULL,'2026-04-28 19:32:23'),(3,6,4,'{\"teamName\":\"infnity\",\"projectName\":\"SmartinternshipPortal\",\"leaderEmail\":\"hello@gmail.com\"}','paid','approved','uploads/1777405183232-618172673.pptx','2026-04-28 19:38:46'),(4,1,4,'{\"teamName\":\"hey\",\"projectName\":\"hacakthon\",\"leaderEmail\":\"hey@gmail.com\"}','paid','approved','uploads/1777466845230-18319788.docx','2026-04-29 12:40:59'),(5,1,3,'{\"teamName\":\"ai\",\"projectName\":\"hacakthon\",\"leaderEmail\":\"leader@edu.com\"}','pending','rejected',NULL,'2026-04-29 12:46:38'),(6,3,3,'{\"teamName\":\"beet\",\"projectName\":\"Hello World\",\"leaderEmail\":\"katie@gmail.com\"}','paid','approved',NULL,'2026-05-07 15:45:48'),(7,1,5,'{\"teamName\":\"Code Titans\",\"projectName\":\"AgroSense – AI-Powered Smart Farming Assistant\",\"leaderEmail\":\"arjun.krishnan2026@gmail.com\"}','paid','approved','uploads/1778225973992-238235015.png','2026-05-08 07:37:10');
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hackathon_id` int NOT NULL,
  `team_id` int DEFAULT NULL,
  `student_name` varchar(100) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `leader_name` varchar(100) DEFAULT '',
  `project_title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `file_link` varchar(255) DEFAULT '',
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `is_winner` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `hackathon_id` (`hackathon_id`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES (6,1,NULL,'Arjun Sharma','Team Alpha','','AI Resume Screener','An AI powered tool that screens resumes and ranks candidates automatically using NLP.','https://github.com/arjun/ai-resume','approved',0,'2026-04-27 12:10:39'),(7,1,NULL,'Priya Nair','CodeCraft','','Smart Traffic System','IoT based smart traffic management system that reduces congestion using real time data.','https://github.com/priya/traffic','rejected',0,'2026-04-27 12:10:39'),(8,1,NULL,'Rahul Kumar','ByteBuilders','','MediTrack','A patient health tracking app with AI diagnosis suggestions for rural healthcare.','https://github.com/rahul/meditrack','pending',0,'2026-04-27 12:10:39'),(9,1,NULL,'Sneha Patel','DevSquad','','EcoRoute','Carbon footprint calculator and route optimizer for daily commuters using maps API.','https://github.com/sneha/ecoroute','rejected',0,'2026-04-27 12:10:39'),(10,1,NULL,'Kiran Raj','HackHeroes','','LearnFlow','Personalized learning path generator using machine learning based on student performance.','https://github.com/kiran/learnflow','approved',0,'2026-04-27 12:10:39');
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `college` varchar(150) NOT NULL,
  `role` varchar(50) DEFAULT 'Member',
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` VALUES (1,1,'Arjun Sharma','arjun@college.edu','IIT Madras','Leader'),(2,1,'Rohan Singh','rohan@college.edu','IIT Madras','Member'),(3,1,'Aisha Khan','aisha@college.edu','IIT Madras','Member'),(4,1,'Dev Patel','dev@college.edu','IIT Madras','Member'),(5,2,'Priya Nair','priya@college.edu','NIT Trichy','Leader'),(6,2,'Sam Thomas','sam@college.edu','NIT Trichy','Member'),(7,2,'Meera Iyer','meera@college.edu','NIT Trichy','Member'),(8,3,'Rahul Kumar','rahul@college.edu','VIT Vellore','Leader'),(9,3,'Neha Gupta','neha@college.edu','VIT Vellore','Member'),(10,3,'Ankit Joshi','ankit@college.edu','VIT Vellore','Member'),(11,3,'Riya Shah','riya@college.edu','VIT Vellore','Member'),(12,4,'Sneha Patel','sneha@college.edu','Anna University','Leader'),(13,4,'Vikram Das','vikram@college.edu','Anna University','Member'),(14,4,'Pooja Rao','pooja@college.edu','Anna University','Member'),(15,5,'Kiran Raj','kiran@college.edu','BITS Pilani','Leader'),(16,5,'Suresh Nair','suresh@college.edu','BITS Pilani','Member'),(17,5,'Divya Menon','divya@college.edu','BITS Pilani','Member'),(18,5,'Amit Sharma','amit@college.edu','BITS Pilani','Member');
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hackathon_id` int NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `leader_name` varchar(100) NOT NULL,
  `leader_email` varchar(100) NOT NULL,
  `member_count` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `hackathon_id` (`hackathon_id`),
  CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,1,'Team Alpha','Arjun Sharma','arjun@college.edu',4,'2026-04-29 11:25:41'),(2,1,'CodeCraft','Priya Nair','priya@college.edu',3,'2026-04-29 11:25:41'),(3,1,'ByteBuilders','Rahul Kumar','rahul@college.edu',4,'2026-04-29 11:25:41'),(4,1,'DevSquad','Sneha Patel','sneha@college.edu',3,'2026-04-29 11:25:41'),(5,1,'HackHeroes','Kiran Raj','kiran@college.edu',4,'2026-04-29 11:25:41');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Astha','astha@gmail.com','1234','student'),(2,'College Admin','college@gmail.com','1234','college'),(3,'astha','asthasingh11@gmail.com','1234','student'),(5,'college2','college2@gmail.com','4567','college'),(6,'hello','hello@gmail.com','12345','student'),(7,'alice','alice@gmail.com','9876','student'),(8,'Carry','carry@gmail.com','abcd','college'),(9,'Jury Member','jury@hackathon.com','1234','jury'),(10,'Ana','ana@gmail.com','4321','student'),(11,'Devi','devi@gmail.com','devi','college');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `winners`
--

DROP TABLE IF EXISTS `winners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `winners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hackathon_id` int NOT NULL,
  `team_name` varchar(255) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `feedback` text,
  `announced_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `winners`
--

LOCK TABLES `winners` WRITE;
/*!40000 ALTER TABLE `winners` DISABLE KEYS */;
INSERT INTO `winners` VALUES (1,5,'Code Titans','AgroSense – AI-Powered Smart Farming Assistant',10,'Excellent','2026-05-08 08:32:58');
/*!40000 ALTER TABLE `winners` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-12 21:52:30
