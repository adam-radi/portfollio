-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: portfolio_db
-- ------------------------------------------------------
-- Server version	8.0.19

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
-- Table structure for table `certifications`
--

DROP TABLE IF EXISTS `certifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expirationDate` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `credentialId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `credentialUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certifications`
--

LOCK TABLES `certifications` WRITE;
/*!40000 ALTER TABLE `certifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `certifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiences`
--

DROP TABLE IF EXISTS `experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiences` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endDate` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` json NOT NULL,
  `technologies` json NOT NULL,
  `current` tinyint(1) NOT NULL DEFAULT '0',
  `companyLogo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiences`
--

LOCK TABLES `experiences` WRITE;
/*!40000 ALTER TABLE `experiences` DISABLE KEYS */;
INSERT INTO `experiences` VALUES ('cmstljuy20001vp98j9xjolqi','M.S car rental','d├®veloppement digitale','Maroc','2026-04','2026-05','[\"Full-stack development of a car rental management platform.\", \"Designed and developed the frontend with a responsive, modern UI\", \"Implemented vehicle browsing, availability, and booking management.\", \"Developed role-based access for Visitor, Customer, Employee, and Manager.\"]','[\"React.js\", \"JavaScript\", \"Node.js ┬À\", \"Express.js\", \"MongoDB\", \"REST API\"]',0,'https://m-s-car-rent1.vercel.app/static/media/logo.4a6f60884c0704382f15.png',0,'2026-08-14 23:47:13.130','2026-08-14 23:47:13.130'),('cmstll8510002vp989bqce5ro','allofice ','d├®veloppement digitale','Maroc','2026-01','2026-02','[]','[\"React.js\"]',0,NULL,0,'2026-08-14 23:48:16.885','2026-08-14 23:48:16.885'),('smile-clinic','Smile Clinic','IT Support & CAD Dental Technician','Maroc','2026-07',NULL,'[\"Assure le support informatique complet de la clinique : installation, configuration et maintenance des postes de travail, imprimantes et ├®quipements r├®seau.\", \"Conception et mod├®lisation de proth├¿ses dentaires num├®riques (couronnes, bridges, inlays/onlays) ├á l\'aide du logiciel Exocad sur stations CAD/CAM.\", \"Collaboration ├®troite avec les proth├®sistes pour garantir la pr├®cision et la qualit├® des restaurations dentaires num├®riques.\", \"Maintenance pr├®ventive et corrective des ├®quipements dentaires (scanner intra-oral, fraiseuse, four de c├®ramique).\", \"Gestion des sauvegardes, s├®curit├® des donn├®es patients et infrastructure r├®seau interne.\"]','[\"Exocad\", \"CAD/CAM\", \"3D Scanner\", \"Milling\", \"IT Support\", \"Networking\", \"Windows Server\", \"d├®veloppement de solutions digitales\"]',1,'https://smileclinique.netlify.app/assets/img/logo.png',0,'2026-08-14 23:38:41.214','2026-08-14 23:42:40.519');
/*!40000 ALTER TABLE `experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `overview` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `problem` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `solution` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `technologies` json NOT NULL,
  `features` json NOT NULL,
  `challenges` json NOT NULL,
  `lessonsLearned` json NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `githubUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `liveUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `published` tinyint(1) NOT NULL DEFAULT '1',
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('agriflow','AgriFlow','agriflow','A full-stack agricultural marketplace connecting farmers and buyers with real-time inventory, orders, and secure authentication.','AgriFlow is a modern digital marketplace built to streamline the buying and selling of agricultural products. It provides farmers a platform to list their produce and buyers a seamless way to discover, filter, and purchase directly from local producers.','Farmers in Morocco face challenges reaching buyers beyond their immediate region, while buyers have no reliable digital channel to source fresh agricultural products.','AgriFlow provides a structured marketplace with role-based access, real-time inventory management, a secure REST API powered by Laravel Sanctum, and a React/Redux frontend.','[\"Laravel\", \"React\", \"TypeScript\", \"MySQL\", \"Sanctum\", \"Redux Toolkit\", \"REST API\", \"bootstrapCSS\"]','[\"Role-based authentication (farmer, buyer, admin) via Laravel Sanctum\", \"Product listing with categories, stock, and pricing management\", \"Order management dashboard for both buyers and farmers\", \"Shopping cart with checkout flow\", \"Admin panel for platform management\"]','[\"Designing a clean role-based permission system across Laravel + React\", \"Managing real-time inventory synchronization\", \"Keeping the REST API surface minimal while supporting complex business logic\"]','[\"Feature-based architecture in Laravel scales far better than layer-based\", \"Redux Toolkit significantly simplifies async state management\", \"API Resources are essential for predictable frontend/backend contracts\"]','/images/projects/agriflow.png','https://github.com/adam-radi/M.S-car-rent.git','https://m-s-car-rent1.vercel.app/',1,1,0,'2026-08-14 23:38:41.190','2026-08-14 23:50:06.033'),('ms-car-rent','M\'S Car Rent','ms-car-rent','A multi-role car rental platform with bookings, agency management, car tracking, and multilingual support.','M\'S Car Rent is a comprehensive car rental management system designed to handle the full lifecycle of vehicle rental ÔÇö from customer browsing to manager oversight and employee operations.','Traditional car rental agencies rely on manual processes and phone calls, making it difficult to scale, track vehicle availability in real-time, or offer a professional digital experience.','A web platform with distinct interfaces for visitors, customers, employees, and managers ÔÇö centralizing bookings, car tracking, agency management, pricing, and multilingual support.','[\"Next.js\", \"React\", \"TypeScript\", \"Tailwind CSS\", \"Prisma\", \"MySQL\"]','[\"Multi-role system: visitor, customer, employee, manager\", \"Branch and agency management\", \"Real-time car availability and location tracking\", \"Daily pricing with promotional discounts\", \"Multilingual support: Arabic, French, English\", \"Booking management with pickup location selection\", \"Notification system for reservations and returns\"]','[\"Designing a clean multi-role permission system\", \"Managing multilingual content across Arabic (RTL), French, and English\", \"Handling concurrent booking conflicts\"]','[\"Role-based access control requires careful planning at the schema level\", \"Internationalization with RTL support needs early architectural decisions\", \"Real-time status updates improve user trust significantly\"]','/images/projects/ms-car-rent.png','https://github.com/adam-radi/M.S-car-rent','https://m-s-car-rent1.vercel.app/',1,1,1,'2026-08-14 23:38:41.204','2026-08-14 23:52:45.714');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'intermediate',
  `description` text COLLATE utf8mb4_unicode_ci,
  `yearsOfExperience` int DEFAULT '0',
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES ('cadcam','CAD/CAM','dental','ÔÜÖ´©Å','advanced',NULL,0,20,'2026-08-14 23:38:41.383','2026-08-14 23:38:41.383'),('css','CSS3','frontend','­ƒÄ¿','advanced',NULL,0,5,'2026-08-14 23:38:41.272','2026-08-14 23:38:41.272'),('exocad','Exocad','dental','­ƒªÀ','advanced',NULL,0,19,'2026-08-14 23:38:41.376','2026-08-14 23:38:41.376'),('figma','Figma','tools','­ƒÄ¿','intermediate',NULL,0,18,'2026-08-14 23:38:41.368','2026-08-14 23:38:41.368'),('git','Git','devops','­ƒî┐','advanced',NULL,0,12,'2026-08-14 23:38:41.326','2026-08-14 23:38:41.326'),('github','GitHub','devops','­ƒÉÖ','advanced',NULL,0,13,'2026-08-14 23:38:41.333','2026-08-14 23:38:41.333'),('html','HTML5','frontend','­ƒº▒','expert',NULL,0,4,'2026-08-14 23:38:41.263','2026-08-14 23:38:41.263'),('laravel','Laravel','backend','­ƒö┤','advanced',NULL,0,6,'2026-08-14 23:38:41.278','2026-08-14 23:38:41.278'),('linux','Linux','devops','­ƒÉº','intermediate',NULL,0,15,'2026-08-14 23:38:41.347','2026-08-14 23:38:41.347'),('mysql','MySQL','database','­ƒÉ¼','advanced',NULL,0,10,'2026-08-14 23:38:41.306','2026-08-14 23:38:41.306'),('nextjs','Next.js','frontend','Ôû▓','advanced',NULL,0,1,'2026-08-14 23:38:41.239','2026-08-14 23:38:41.239'),('nodejs','Node.js','backend','­ƒƒó','intermediate',NULL,0,8,'2026-08-14 23:38:41.292','2026-08-14 23:38:41.292'),('php','PHP','backend','­ƒÉÿ','advanced',NULL,0,7,'2026-08-14 23:38:41.285','2026-08-14 23:38:41.285'),('postman','Postman','tools','­ƒô«','advanced',NULL,0,17,'2026-08-14 23:38:41.362','2026-08-14 23:38:41.362'),('prisma','Prisma','database','Ôùå','intermediate',NULL,0,11,'2026-08-14 23:38:41.313','2026-08-14 23:38:41.313'),('react','React','frontend','ÔÜø´©Å','advanced',NULL,0,0,'2026-08-14 23:38:41.228','2026-08-14 23:38:41.228'),('restapi','REST API','backend','­ƒöî','advanced',NULL,0,9,'2026-08-14 23:38:41.299','2026-08-14 23:38:41.299'),('scanner3d','3D Scanner','dental','­ƒôí','intermediate',NULL,0,21,'2026-08-14 23:38:41.390','2026-08-14 23:38:41.390'),('tailwind','Tailwind CSS','frontend','­ƒÄ¿','advanced',NULL,0,3,'2026-08-14 23:38:41.256','2026-08-14 23:38:41.256'),('typescript','TypeScript','frontend','­ƒöÀ','advanced',NULL,0,2,'2026-08-14 23:38:41.247','2026-08-14 23:38:41.247'),('vercel','Vercel','devops','Ôû▓','intermediate',NULL,0,14,'2026-08-14 23:38:41.341','2026-08-14 23:38:41.341'),('vscode','VS Code','tools','­ƒöÁ','expert',NULL,0,16,'2026-08-14 23:38:41.354','2026-08-14 23:38:41.354');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cmstl8vwj0000vpkwzopefmzi','adam.radi.2006@gmail.com','adamradi','$2a$12$7loNHM2Q5hzvyqTycOu5b.4wWFOG.RzndQjOzKZ4wwex14Yxgx.cS','Adam Radi','ADMIN','2026-08-14 23:38:41.154','2026-08-14 23:38:41.154');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-15  1:47:51
