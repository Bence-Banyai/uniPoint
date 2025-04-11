                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                     UNIPOINT BACKEND DOKUMENTÁCIÓ
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


Table of Contents
─────────────────

1. Mysql Szerver
2. Adatbázis felépítése
.. 1. user tábla
.. 2. services tábla
.. 3. categories tábla
.. 4. appointments tábla
.. 5. reviews tábla
.. 6. EntityFramework és IdentityUser által létrehozott táblák
3. Végpontok
.. 1. Auth
..... 1. Register
..... 2. Login
..... 3. Logout


1 Mysql Szerver
═══════════════

  • Admin login
    • Username: uniPointAdmin
    • Password: AK$p9r-))p@HD^+


2 Adatbázis felépítése
══════════════════════

  Az adatbázis elkészítését az EntityFramework kezeli, tehát a model
  osztályokból készíti a táblákat és a kapcsolatokat. Az adatbázis MySQL
  alapú, ezt a Pomelo.EntityFrameworkCore.MySql NuGet package valósítja
  meg.


2.1 user tábla
──────────────

  • Id: PK, VARCHAR(255), not null, unique
  • UserName: LONGTEXT, not null, 1-30 hosszú
  • Email: VARCHAR(255), email validáció
  • PhoneNumber: LONGTEXT, telefonszám validáció
  • ProfilePictureUrl: VARCHAR(255), not null, default:
    "<https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg>"
  • CreatedAt: DATETIME(6), not null, timestamp validáció, default:
    létrehozás dátuma UTC
  • PasswordHash: LONGTEXT, not null, automatikus titkosítás
  • Location: VARCHAR(255)
  • IsPushNotificationsEnabled: TINYINT(1), (Entityframework bool)
  • UserSelectedLanguage: LONGTEXT, Lehetséges értékek: "magyar",
    "angol"

  IdentityUser által létrehozott, közvetlenül nem használt
  • AccessFailedCount: INT(11), not null
  • ConcurrencyStamp: LONGTEXT
  • EmailConfirmed: TINYINT(1), not null
  • LockoutEnabled: TINYINT(1), not null
  • LockoutEnd: DATETIME(6)
  • NormalizedEmail: LONGTEXT
  • NormalizedUserName: LONGTEXT
  • PhoneNumberConfirmed: TINYINT(1), not null
  • SecurityStamp: LONGTEXT
  • TwoFactorEnabled: TINYINT(1), not null


2.2 services tábla
──────────────────

  • ServiceId: PK, INT(11), not null, unique
  • UserId: VARCHAR(255), not null, FK: user.Id, (Szolgáltató Id)
  • ServiceName: VARCHAR(255), not null
  • Price: INT(11), not null
  • Description: VARHCHAR(2000), not null
  • Address: VARCHAR(255), not null
  • Duration: INT(11), not null
  • CategoryId: INT, not null
  • ImageUrls: LONGTEXT (Entityframework string list)
  • OpeningHours: INT


2.3 categories tábla
────────────────────

  • CategoryId: PK, INT, not null
  • Name: VARCHAR(255), not null
  • IconUrl: LONGTEXT


2.4 appointments tábla
──────────────────────

  • Id: PK, INT(11), not null, unique
  • UserId: VARCHAR(255), FK: user.Id, (Foglaló Id)
  • ServiceId: INT(11), not null, FK: services.ServiceId
  • appointmentDate: DATETIME(6), not null, timestamp validáció
  • Status: INT(11), not null
    • az EF kezeli, igazából enum
    • lehetséges értékei: OPEN, SCHEDULED, DONE, CANCELLED_BY_USER,
      CANCELLED_BY_SERVICE
    • default: OPEN


2.5 reviews tábla
─────────────────

  • ReviewId: PK, INT(11), not null, unique
  • UserId: VARCHAR(255), FK: user.Id, (Értékelő Id)
  • ServiceId: INT(11), not null, FK: services.ServiceId
  • Score: INT(11), not null, értéke 1-5
  • Description: VARHCHAR(2000), not null
  • CreatedAt: DATETIME(6), not null, timestamp validáció, default:
    létrehozás dátuma UTC


2.6 EntityFramework és IdentityUser által létrehozott táblák
────────────────────────────────────────────────────────────

  • roleclaims
    • Id: PK, INT(11), not null, unique
    • RoleId: LONGTEXT
    • ClaimType: LONGTEXT
    • ClaimValue: LONGTEXT
  • roles
    • Id: PK, VARCHAR(255), not null, unique
    • Name: LONGTEXT
    • NormailzedName: LONGTEXT
    • ConcurrencyStamp: LONGTEXT
  • userclaims
    • Id: PK, INT(11), not null, unique
    • UserId: LONGTEXT
    • ClaimType: LONGTEXT
    • ClaimValue: LONGTEXT
  • userlogins
    • LoginProvider: PK, VARCHAR(255), not null, unique
    • ProviderKey: PK, VARCHAR(255), not null, unique
    • ProviderDisplayName: LONGTEXT
    • UserId: LONGTEXT
  • userroles
    • UserId: PK, VARCHAR(255), not null, unique
    • RoleId: PK, VARCHAR(255), not null, unique
  • usertokens
    • UserId: PK, VARCHAR(255), not null, unique
    • LoginProvider: PK, VARCHAR(255), not null, unique
    • Name: PK, VARCHAR(255), not null, unique
    • Value: LONGTEXT
  • __efmigrationhistory
    • MigrationId: PK, VARCHAR(150), not null, unique
    • ProductVersion: VARCHAR(32), not null


3 Végpontok
═══════════

3.1 Auth
────────

3.1.1 Register
╌╌╌╌╌╌╌╌╌╌╌╌╌╌

  • url: /api/Auth/register
  • POST request:
  ┌────
  │ {
  │   "userName": "jeno",
  │   "email": "jeno@example.com",
  │   "phoneNumber": "06701323454",
  │   "password": "Jeno123",
  │   "role": "User"
  │ }
  └────
  • Response:
    • StatusCode: 200
  ┌────
  │ {
  │   "message": "User registered successfully!"
  │ }
  └────


3.1.2 Login
╌╌╌╌╌╌╌╌╌╌╌

  • url: /api/Auth/login
  • POST request:
  ┌────
  │ {
  │   "userNameOrEmail": "jeno",
  │   "password": "Jeno123"
  │ }
  └────
  • Response:
    • StatusCode: 200
  ┌────
  │ {
  │   "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjhjYjNhMC00MWVjLTRmYjctOGVhYi1lOWZkYTFiMzVkMjQiLCJlbWFpbCI6Implbm9AZXhhbXBsZS5jb20iLCJ1bmlxdWVfbmFtZSI6Implbm8iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzQxMzQ5MTgxLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSJ9.rc1SfKdnQCIqoZpdTbDq-hj7xLPmzmKtbfql92G_1wE",
  │   "message": "Login successful",
  │   "userId": "bf8cb3a0-41ec-4fb7-8eab-e9fda1b35d24"
  │ }
  └────


3.1.3 Logout
╌╌╌╌╌╌╌╌╌╌╌╌

  • url: /api/Auth/logout
  • POST request
  • Response:
    • StatusCode: 200
  ┌────
  │ {
  │   "message": "Logout successful."
  │ }
  └────
