/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.10-MariaDB, for Linux (x86_64)
--
-- Host: unipoint.mysql.database.azure.com    Database: unipoint
-- ------------------------------------------------------
-- Server version	8.0.40-azure

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` VALUES
('20250216145300_InitialCreate','8.0.13'),
('20250216151239_addtables','8.0.13'),
('20250216161312_addtables2','8.0.13'),
('20250216161533_addtables333333','8.0.13'),
('20250216170046_addtables9','8.0.13'),
('20250217154621_fk','8.0.13'),
('20250301154315_identity_jwt','8.0.13'),
('20250307080254_appointment_bookerid_nullable','8.0.13'),
('20250329153617_ffsdsfdgds','8.0.13'),
('20250401110103_category','8.0.13'),
('20250413144119_iconurl_optional_with_default','8.0.15'),
('20250419105733_service_openinghours','8.0.15'),
('20250422213548_RemoveAppointmentTimestamp','8.0.15'),
('20250423102455_RemoveTimestamp','8.0.15'),
('20250423103557_AppointmentDateNullable','8.0.15'),
('20250423103836_AppointmentDateNullable2','8.0.15'),
('20250423104040_AppointmentDateNullable3','8.0.15'),
('20250423104224_AppointmentDateNullable4','8.0.15'),
('20250423104805_AppointmentDateNullable5','8.0.15'),
('20250423104847_AppointmentDateNullable6','8.0.15');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ServiceId` int NOT NULL,
  `appointmentDate` datetime(6) DEFAULT NULL,
  `Status` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Appointments_ServiceId` (`ServiceId`),
  KEY `IX_Appointments_UserId` (`UserId`),
  CONSTRAINT `FK_Appointments_Services_ServiceId` FOREIGN KEY (`ServiceId`) REFERENCES `services` (`ServiceId`) ON DELETE CASCADE,
  CONSTRAINT `FK_Appointments_User_UserId` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES
(4,'e71892bc-d7bc-4bc3-9894-6ab02d5bcfee',1,'2025-04-13 15:27:23.223197',1),
(24,'c3fc99ce-995a-41d9-8729-acfbbcdc5a14',2,'2025-04-22 22:40:18.196226',1),
(25,'0e23ad89-24a8-4ed6-ad2b-529fa0063412',4,'2025-04-23 09:03:33.438589',1),
(26,'0e23ad89-24a8-4ed6-ad2b-529fa0063412',4,'2025-04-23 09:31:04.531759',1),
(27,'0e23ad89-24a8-4ed6-ad2b-529fa0063412',4,'2025-04-23 09:39:21.423040',1),
(28,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',1,'2025-04-23 09:48:52.177673',3),
(29,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',2,'2025-04-23 10:34:29.119040',3),
(30,'0e23ad89-24a8-4ed6-ad2b-529fa0063412',4,'2025-04-23 10:12:00.913377',1),
(31,'0e23ad89-24a8-4ed6-ad2b-529fa0063412',4,'2025-04-23 10:19:36.103018',1),
(32,'0e23ad89-24a8-4ed6-ad2b-529fa0063412',4,'2025-04-23 10:27:33.426524',1),
(33,'0e23ad89-24a8-4ed6-ad2b-529fa0063412',4,'2025-12-23 10:44:31.026000',1),
(34,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',4,'2025-05-08 17:53:00.000000',3),
(35,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',1,'2025-05-16 19:58:00.000000',3),
(36,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',4,'2025-04-27 09:32:00.000000',3),
(37,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',1,'2025-05-17 20:15:00.000000',3),
(38,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',2,'2025-05-15 20:42:00.000000',3),
(39,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',1,'2025-05-01 21:44:00.000000',3),
(40,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',4,'2025-05-24 23:35:00.000000',3),
(41,'397d33c6-0213-4a1b-838a-a44ddc9c5fc2',1,'2025-04-25 10:55:00.000000',1),
(43,'0e23ad89-24a8-4ed6-ad2b-529fa0063412',4,'2025-05-24 14:37:18.462000',3),
(44,'c3fc99ce-995a-41d9-8729-acfbbcdc5a14',2,'2025-04-28 13:00:00.000000',3),
(45,'c3fc99ce-995a-41d9-8729-acfbbcdc5a14',2,'2025-04-29 10:00:00.000000',3);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `CategoryId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IconUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`CategoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES
(1,'Hajvágás','https://tiszolczijacint.blob.core.windows.net/img/7addb194-b06e-492f-8be0-47a1f03de298.png'),
(2,'Szerelés','https://tiszolczijacint.blob.core.windows.net/img/ef1431cf-2236-4214-b261-46b83a4fcc9a.png');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `ReviewId` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ServiceId` int NOT NULL,
  `Score` int NOT NULL,
  `Description` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`ReviewId`),
  KEY `IX_Reviews_ServiceId` (`ServiceId`),
  KEY `IX_Reviews_UserId` (`UserId`),
  CONSTRAINT `FK_Reviews_Services_ServiceId` FOREIGN KEY (`ServiceId`) REFERENCES `services` (`ServiceId`) ON DELETE CASCADE,
  CONSTRAINT `FK_Reviews_User_UserId` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES
(1,'e71892bc-d7bc-4bc3-9894-6ab02d5bcfee',1,5,'jo','2025-04-13 15:30:23.285305'),
(2,'e46ffda0-5900-438a-adee-5f010ec388b3',1,2,'szar','2025-04-13 15:33:28.268816');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roleclaims`
--

DROP TABLE IF EXISTS `roleclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roleclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roleclaims`
--

LOCK TABLES `roleclaims` WRITE;
/*!40000 ALTER TABLE `roleclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `roleclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `NormalizedName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES
('5ea55d8b-e044-4a17-a45f-55c50d944f68','Admin','ADMIN',NULL),
('9f852c3b-7ad3-4b34-8531-ab8403ea70c7','Provider','PROVIDER',NULL),
('cf220a36-414d-4f1b-ae96-8e58ba7381f5','User','USER',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `ServiceId` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ServiceName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Price` int NOT NULL,
  `Description` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Duration` int NOT NULL,
  `ImageUrls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CategoryId` int NOT NULL DEFAULT '0',
  `ClosesAt` time(6) NOT NULL DEFAULT '00:00:00.000000',
  `OpensAt` time(6) NOT NULL DEFAULT '00:00:00.000000',
  PRIMARY KEY (`ServiceId`),
  KEY `IX_Services_UserId` (`UserId`),
  KEY `IX_Services_CategoryId` (`CategoryId`),
  CONSTRAINT `FK_Services_Categories_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`CategoryId`) ON DELETE CASCADE,
  CONSTRAINT `FK_Services_User_UserId` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
(1,'5b02dd18-efa6-49e4-bb14-72956dfd92fb','Férfi hajvágás',5000,'Donec pretium posuere tellus.  Nullam rutrum.  Praesent augue.  Aliquam erat volutpat.  Nunc eleifend leo vitae magna.  In id erat non orci commodo lobortis.  Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.  Sed diam.  Praesent fermentum tempor tellus.  Nullam tempus.  Mauris ac felis vel velit tristique imperdiet.  Donec at pede.  Etiam vel neque nec dui dignissim bibendum.  Vivamus id enim.  Phasellus neque orci, porta a, aliquet quis, semper a, massa.  Phasellus purus.  Pellentesque tristique imperdiet tortor.  Nam euismod tellus id erat.','Győr Budai Út 83',20,'[\"https://tiszolczijacint.blob.core.windows.net/img/cda0f295-d78b-40f0-a5cc-d2b224b5cc46.jpg\",\"https://tiszolczijacint.blob.core.windows.net/img/3edda464-8ae6-481d-ba57-7b271cce2ec4.jpg\"]',1,'00:00:00.000000','00:00:00.000000'),
(2,'35a3407f-5d3f-4715-a6b6-51f154c40511','Mobiltelefon szerelés',20000,'Donec pretium posuere tellus.  Nullam rutrum.  Praesent augue.  Aliquam erat volutpat.  Nunc eleifend leo vitae magna.  In id erat non orci commodo lobortis.  Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.  Sed diam.  Praesent fermentum tempor tellus.  Nullam tempus.  Mauris ac felis vel velit tristique imperdiet.  Donec at pede.  Etiam vel neque nec dui dignissim bibendum.  Vivamus id enim.  Phasellus neque orci, porta a, aliquet quis, semper a, massa.  Phasellus purus.  Pellentesque tristique imperdiet tortor.  Nam euismod tellus id erat.','Budapest Váci út 93',100,'[\"https://tiszolczijacint.blob.core.windows.net/img/b351255a-1ad5-48dd-b6ef-8c15a1644b81.jpg\",\"https://tiszolczijacint.blob.core.windows.net/img/f1771efb-a476-4e48-a52f-f8c5c211669a.jpg\"]',2,'00:00:00.000000','00:00:00.000000'),
(4,'677e7b94-d191-4db7-8af8-ab22b32ff2ed','Autó szerelés',30000,'Praesent a eros sit amet eros hendrerit semper in quis purus. Aenean sagittis felis vitae iaculis fermentum. Etiam tempus imperdiet mollis. Vivamus pretium mi non nibh iaculis venenatis. Donec pellentesque, felis a pharetra ultricies, ante enim consectetur lectus, nec vestibulum nisi augue sit amet dolor. Aenean vitae tempor mauris. Cras volutpat hendrerit neque id ultrices. ','Gyor Szent Istvan ut 95',120,NULL,2,'17:00:00.000000','08:00:00.000000');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `PhoneNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ProfilePictureUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `AccessFailedCount` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `EmailConfirmed` tinyint(1) NOT NULL DEFAULT '0',
  `LockoutEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `NormalizedEmail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `NormalizedUserName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL DEFAULT '0',
  `SecurityStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `TwoFactorEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `UserName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `IsPushNotificationsEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `Location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `UserSelectedLanguage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_User_Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
('jeno@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-23 08:59:33.553494','0e23ad89-24a8-4ed6-ad2b-529fa0063412','16b0804f-8ca5-4f00-bf6e-5beea33eabc0',0,1,NULL,'JENO@EXAMPLE.COM','JENO','AQAAAAIAAYagAAAAEH/7QrUUP+Kd1TjkPpVqb1e/TCQddSPEuRQ6E/HkJgM5YirYTZ5aWl5VpLLPzyJ/ZQ==',0,'6BBNA43SOT4D4SAYCQ4KRQSSOJAWKZPA',0,'jeno',0,'Gyor','magyar'),
('fiatalkege@gmail.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-19 14:45:51.526230','147f0f2c-1b16-4a43-b987-02cb032e656b','325d25ba-f7ce-41da-a66b-9a443837596f',0,1,NULL,'FIATALKEGE@GMAIL.COM','YUNGKEGE','AQAAAAIAAYagAAAAEBcOU80Qvm0obaLfwBrplTHFkcT4ocrRqrzBE4Dv+M8hKBQdcVhg2wQPPFmGNtr11A==',0,'X5YX2MCKALWAK4VHFSH6RGINVP5PYMK7',0,'yungkege',0,'África do Sul','magyar'),
('habos@babos.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-17 20:51:50.777376','1e91fee3-a2ef-42ce-8dd7-1212772d9ac5','eee15753-ae6d-4883-98fe-47e521d1eaad',0,1,NULL,'HABOS@BABOS.COM','HABOSBABOS','AQAAAAIAAYagAAAAEEvuVl+L3ai7OMDsaQ1k3z1pdHsqyJVif7s+kTDugQa6cbkgKWdncQBtwsvW92bFJw==',0,'UZ3STKAJHV7RAVUZHOE2RO4W7S4T5HN4',0,'HabosBabos',0,'habos','magyar'),
('kisjeno@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/20055bcd-ed28-4e8c-acbe-9be90e14f4d3.jpg',0,'2025-04-13 14:59:16.945711','35a3407f-5d3f-4715-a6b6-51f154c40511','5abddc37-0804-451d-a34f-7ba4e096ad04',0,1,NULL,'KISJENO@EXAMPLE.COM','KISJENO','AQAAAAIAAYagAAAAEHbc9EFGpH3mACqDgGyprgNyoKenMiyOJ7C/6lRvhU5vORZSzgsjTvfxMsOYHy7i/w==',0,'ITNBHSTXYRK2ECUNO27ZXLRANYKZAOV4',0,'KisJeno',0,'Budapest Váci út 93','magyar'),
('kegerino@gmail.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-18 16:46:55.107599','397d33c6-0213-4a1b-838a-a44ddc9c5fc2','415bf410-a96a-425b-b8c9-d196accca7de',0,1,NULL,'KEGERINO@GMAIL.COM','KEGERITO','AQAAAAIAAYagAAAAEH19acD5T/n2V2RyWfPtllFNauWLygaBSngmj+O7ZFWO6aPgfG4jVx+8gkuM/lSyJg==',0,'XSLNL7C4NVP5ME3TY5HMNGPHD5X33XW6',0,'kegerito',0,'Afganisztán','magyar'),
('admin@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-12 10:42:12.426650','3e5b5572-0351-493a-9122-6928b837b8e7','d5ffe307-a506-4aa9-b7a1-3450907bfe28',0,1,NULL,'ADMIN@EXAMPLE.COM','ADMIN','AQAAAAIAAYagAAAAEDieFGVR4QgMbY4YxpIdt2sNMHw+lXcnf0tM/61m1r1OSibjbcv7fTJ8MKi8eWJ45Q==',0,'JASATMCZNBFBSMLP2OMHMSRBZ7F6LWRE',0,'admin',0,NULL,'magyar'),
('nagyferenc@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/ab68b3c7-6e09-4a8b-a9c0-f587cc95d214.jpg',0,'2025-04-13 15:24:35.218111','5b02dd18-efa6-49e4-bb14-72956dfd92fb','b920a27e-ef85-4209-8dd5-982fa7343bdf',0,1,NULL,'NAGYFERENC@EXAMPLE.COM','NAGYFERENC','AQAAAAIAAYagAAAAEG2Xk3XkMTX0tFKunxRzDg0ujbMokPANAXP054TyegNgwb1eyE9rq4hdqQlLtwEXbg==',0,'5LSWVA6V5P5SFPY6XDNKZB333RLIKSRZ',0,'NagyFerenc',0,'Győr Budai Út 23','magyar'),
('gabor@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-22 13:15:59.351845','677e7b94-d191-4db7-8af8-ab22b32ff2ed','a0b6e919-46d0-4b4a-9e48-9cce2c52290d',0,1,NULL,'GABOR@EXAMPLE.COM','GABOR','AQAAAAIAAYagAAAAECT4gCUf0yBvP/brZ1qwPt9ujlutjFzOc4FvGqWGoL8/yMYy7z+eP/0E/Qqe1jIcJQ==',0,'Y6N2RZ7SREWVQGWQRLDRI7YMB62WSXVI',0,'gabor',0,'Gypr','magyar'),
('asdf@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/7cd66c2f-334b-4051-9391-42882e5e7320.jpg',0,'2025-04-16 20:20:46.046062','752b053e-250a-466d-8c11-fdb641fbb017','ecf98aec-eb2f-4a39-99c0-60f050dd665e',0,1,NULL,'ASDF@EXAMPLE.COM','ASDF','AQAAAAIAAYagAAAAEC1U4mL1MYmb5Djssn7uA0N4+fhVHe+BSWCWLmw2Ykb1hhz6ES56cUUhRboFNLk9mw==',0,'O5YTXDQGY74JWS6YBMENOVZSYTYN5YFJ',0,'asdf',0,'Budapest','magyar'),
('pelda@bela.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-13 19:56:19.370846','7e74cbf2-ad0e-498c-8bae-cb25a4ff8053','e9133cf9-0d77-48a3-95d3-de62a92f5494',0,1,NULL,'PELDA@BELA.COM','PELDABELA','AQAAAAIAAYagAAAAEAHWEHUCoIEkx5ug3uKEHRLv/xntrdOQ1ipeJrGVG5er5B8w8keG/M3qtcI5zOOMAQ==',0,'ZDNLG2SDTG7WGVCFHTEEKNEPUE6SDZHU',0,'PeldaBela',0,'Budapest','magyar'),
('csar@antal.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-11 16:39:19.818033','c3fc99ce-995a-41d9-8729-acfbbcdc5a14','cd37292d-1648-4e68-9681-68c41ccf0e24',0,1,NULL,'CSAR@ANTAL.COM','CSARANTAL','AQAAAAIAAYagAAAAEEf1hio8zPH3/+tseZ7ISKuUks2ZmyCTmJmt3IieBGjIwfP4S0nruh+Y5D3FEa6dog==',0,'ECCTXK2BC55KVR52EPN4RX7FL4FOWYBT',0,'CsarAntal',0,'Budapest','magyar'),
('lucskos@ficko.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-15 17:01:24.623091','c8e3a83e-0a83-4f76-814f-51f948f86d27','41a4ba62-0808-4537-a3d6-7506337121e3',0,1,NULL,'LUCSKOS@FICKO.COM','LUCSKOSFICKO','AQAAAAIAAYagAAAAEKK8xSKpQLN2bi6sw905cBdmpbMA2qX+LUfuwvZElWXwxqfLnLKew9+rO4wgZzhjhA==',0,'MB5SQT7LM2WQ4VXMYV42KJGJJX2SD4E6',0,'LucskosFicko',0,'lugos','magyar'),
('kovacsistvan@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-13 14:14:41.554482','dc3e4b90-ab1a-42f9-9a22-dcfa02922029','1a2427e2-cbf6-4e32-aab0-1a4cc221ce17',0,1,NULL,'KOVACSISTVAN@EXAMPLE.COM','KOVACSISVAN','AQAAAAIAAYagAAAAEOBFIjhPXTW43xkaIurrofss8Qk++PHrftKPf5NEMisrFPWMDK0d9bJZIW0qjHe0Kg==',0,'IVY26S5ZFQHQO6VH4UDVM2PCW24W5IW6',0,'KovacsIsvan',0,'Budapest Váci út 234','magyar'),
('bela@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-11 07:26:58.308227','e328d17a-f80f-4886-90ec-04e09e56c5b7','6f680894-740e-4c82-9cde-86e91ec6031a',0,1,NULL,'BELA@EXAMPLE.COM','BELA','AQAAAAIAAYagAAAAEGzLkYpZ0l+Xb/hPkZlmTo5sF9vYze85segUbnNzbGBy3gpQFnKu3T8S6ebjW5ASFQ==',0,'ODVB4OPPPZ67DC23C7ZN4ZLQC5UIVYX3',0,'bela',0,'Győr','magyar'),
('kisbela@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg',0,'2025-04-13 14:13:58.911089','e46ffda0-5900-438a-adee-5f010ec388b3','7ea09e3b-14b5-40fa-86b5-6d3bfd26727a',0,1,NULL,'KISBELA@EXAMPLE.COM','KISBELA','AQAAAAIAAYagAAAAEBMUdSxjBB6fDYvWsW8bCZ0gaNeYbmOEyJo2FC8jS7uATUAygySMRAe2pSo+yIAkkQ==',0,'T3GPAITXXITIY6KDQIOH4FU6OV6I5DG6',0,'KisBela',0,'Győr Szent István út 49','magyar'),
('nagyjanos@example.com',NULL,'https://tiszolczijacint.blob.core.windows.net/img/97ffcfbe-b0df-437e-9437-dab0c109b036.jpg',0,'2025-04-13 15:26:59.383911','e71892bc-d7bc-4bc3-9894-6ab02d5bcfee','7f19c5aa-b9dc-4b5b-92cd-9e24a784ea4c',0,1,NULL,'NAGYJANOS@EXAMPLE.COM','NAGY_JANOS','AQAAAAIAAYagAAAAENzhxIJ+oYZv1StEBKzkSj9nhwukugBKaO4Pmz6loePSAfCEdVb2WIHK1yTl+9KmqA==',0,'GILY2DFHJOYQXTVV4532GIIAWRQDLIWS',0,'Nagy_Janos',0,'Győr Baross út 34','magyar');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userclaims`
--

DROP TABLE IF EXISTS `userclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userclaims`
--

LOCK TABLES `userclaims` WRITE;
/*!40000 ALTER TABLE `userclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `userclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userlogins`
--

DROP TABLE IF EXISTS `userlogins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userlogins` (
  `LoginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProviderKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProviderDisplayName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `UserId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`LoginProvider`,`ProviderKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userlogins`
--

LOCK TABLES `userlogins` WRITE;
/*!40000 ALTER TABLE `userlogins` DISABLE KEYS */;
/*!40000 ALTER TABLE `userlogins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userroles` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userroles`
--

LOCK TABLES `userroles` WRITE;
/*!40000 ALTER TABLE `userroles` DISABLE KEYS */;
INSERT INTO `userroles` VALUES
('0e23ad89-24a8-4ed6-ad2b-529fa0063412','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('147f0f2c-1b16-4a43-b987-02cb032e656b','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('1e91fee3-a2ef-42ce-8dd7-1212772d9ac5','9f852c3b-7ad3-4b34-8531-ab8403ea70c7'),
('35a3407f-5d3f-4715-a6b6-51f154c40511','9f852c3b-7ad3-4b34-8531-ab8403ea70c7'),
('397d33c6-0213-4a1b-838a-a44ddc9c5fc2','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('3e5b5572-0351-493a-9122-6928b837b8e7','5ea55d8b-e044-4a17-a45f-55c50d944f68'),
('5b02dd18-efa6-49e4-bb14-72956dfd92fb','9f852c3b-7ad3-4b34-8531-ab8403ea70c7'),
('5bc50972-53df-456a-8e60-c37222ad103d','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('677e7b94-d191-4db7-8af8-ab22b32ff2ed','9f852c3b-7ad3-4b34-8531-ab8403ea70c7'),
('752b053e-250a-466d-8c11-fdb641fbb017','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('7e74cbf2-ad0e-498c-8bae-cb25a4ff8053','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('c3fc99ce-995a-41d9-8729-acfbbcdc5a14','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('c8e3a83e-0a83-4f76-814f-51f948f86d27','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('dc3e4b90-ab1a-42f9-9a22-dcfa02922029','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('e328d17a-f80f-4886-90ec-04e09e56c5b7','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('e46ffda0-5900-438a-adee-5f010ec388b3','cf220a36-414d-4f1b-ae96-8e58ba7381f5'),
('e71892bc-d7bc-4bc3-9894-6ab02d5bcfee','cf220a36-414d-4f1b-ae96-8e58ba7381f5');
/*!40000 ALTER TABLE `userroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usertokens`
--

DROP TABLE IF EXISTS `usertokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usertokens` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LoginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usertokens`
--

LOCK TABLES `usertokens` WRITE;
/*!40000 ALTER TABLE `usertokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `usertokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-27 13:39:41
