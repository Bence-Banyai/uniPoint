# UniPoint Webalkalmazás Frontend Rész Dokumentáció

**Szerző:** Bányai Bence
**Dátum:** 2025. április 27.

## Tartalomjegyzék

1.  [Áttekintés](#áttekintés)
2.  [Infrastruktúra és technológia](#infrastruktúra-és-technológia)
3.  [Főbb képernyők és funkciók](#főbb-képernyők-és-funkciók)
4.  [Projektstruktúra](#projektstruktúra)
5.  [Telepítés és futtatás](#telepítés-és-futtatás)
6.  [Állapotkezelés és hitelesítés](#állapotkezelés-és-hitelesítés)
7.  [API-hívások és hibakezelés](#api-hívások-és-hibakezelés)
8.  [Tesztelés](#tesztelés)
9.  [Felhasználói folyamatok, példák](#felhasználói-folyamatok-példák)
10. [Adatvédelem, biztonság](#adatvédelem-biztonság)

## 1. Áttekintés

A UniPoint frontend egy modern webalkalmazás, amely a UniPoint szolgáltatásfoglaló rendszer felhasználói felületét biztosítja webböngészők számára. Lehetővé teszi a felhasználóknak szolgáltatások böngészését, időpontok foglalását, saját profiljuk kezelését, valamint adminisztrátori funkciók elérését. Az alkalmazás Nuxt 3 keretrendszerre épül, Vue 3-at használva a komponensalapú fejlesztéshez, Vitest alapú tesztekkel.

## 2. Infrastruktúra és technológia

- **Keretrendszer:** Nuxt 3
- **Nyelv:** TypeScript, Vue
- **UI Könyvtár:** Vue 3 (Nuxt által integrálva)
- **Stílus:** Tailwind CSS (`@nuxtjs/tailwindcss` modul)
- **Állapotkezelés:** Pinia (`@pinia/nuxt` modul)
- **Hitelesítés:** Sidebase Nuxt Auth (`@sidebase/nuxt-auth` modul)
- **Ikonok:** Nuxt Icon (`@nuxt/icon` modul, `entypo`, `iconoir` kollekciók)
- **Betűtípusok:** Google Fonts (`@nuxtjs/google-fonts` modul, Montserrat)
- **Képkezelés:** Nuxt Image (`@nuxt/image` modul)
- **API Proxy:** Nitro Development Proxy (fejlesztés alatt)
- **Tesztelés:** Vitest (`vitest.config.ts`)
- **Build Eszköz:** Vite (Nuxt által integrálva)

## 3. Főbb képernyők és funkciók

- **Kezdőlap (`pages/index.vue`):** Az alkalmazás fő oldala, bemutatja a platformot, kiemelt szolgáltatásokat, működési lépéseket és felhasználói véleményeket. CTA gombok a regisztrációhoz és szolgáltatások böngészéséhez.
- **Szolgáltatások (`pages/services/...`):** Oldalak a szolgáltatások listázására, keresésére, szűrés kategóriákra, szöveg alapú keresés, rendezés ár alapján és szolgáltatás részleteinek megtekintése.
- **Regisztráció (`pages/register/index.vue`):** Új felhasználói fiók létrehozása felhasználónév, email, jelszó és opcionális helyadatok megadásával.
- **Bejelentkezés (`pages/login/...`):** Meglévő felhasználók bejelentkezése (Nuxt Auth kezeli).
- **Profil (`pages/profile/index.vue`):** Bejelentkezett felhasználó adatainak megjelenítése (felhasználónév, email, szerepkör, hely). Felhasználóhoz tartozó foglalások (appointments) megjelenítése, szűrés eljövendő és múltbéli időpontokra, foglalás lemondása lehetőség.
- \*\*Admin Felület (`pages/admin/...`):
  - **Irányítópult (`pages/admin/index.vue`):** Áttekintő oldal kártyákkal, amelyek a különböző adminisztrációs aloldalakra navigálnak (Felhasználók, Szolgáltatások, Kategóriák, Időpontok).
  - **Felhasználók (`pages/admin/users.vue`):** Felhasználók listázása táblázatos formában, keresési és szerepkör szerinti szűrési lehetőséggel. Új felhasználó hozzáadása, meglévő szerkesztése és törlése modális ablakokban. Visszajelzés toast üzenetekkel a műveletek sikerességéről vagy hibájáról.
  - **Szolgáltatások (`pages/admin/services.vue`):** Szolgáltatások kezelésére szolgáló felület (a lista és a hozzáadás gomb implementált, a további funkcionalitás hiányos).
  - **Kategóriák (`pages/admin/categories.vue`):** Szolgáltatáskategóriák kezelésére szolgáló felület (hiányos implementáció).
  - **Időpontok (`pages/admin/appointments.vue`):** Időpontok listázása táblázatos formában (szolgáltatás, dátum/idő, státusz, foglaló). Lehetőség új, nyitott időpont hozzáadására (szolgáltatás, dátum, idő megadásával) és meglévő időpontok törlésére modális ablakokban. Visszajelzés toast üzenetekkel.
- **Navigációs Sáv (`components/AppNavbar.vue`):** Globális navigáció a főbb oldalak között, dinamikusan mutatja a bejelentkezés/regisztráció, admin felület, vagy a profil/kijelentkezés linkeket a hitelesítési állapottól függően.
- **Lábléc (`components/AppFooter.vue`):** Gyorslinkek, kapcsolati információk, közösségi média linkek, hírlevél feliratkozás és copyright információk. (Részük csak stíluselem, rendes funkciót nem lát el)

## 4. Projektstruktúra

A projekt a Nuxt 3 konvencióit követi:

- `assets/`: Statikus erőforrások (CSS, képek), amelyeket a build folyamat feldolgoz.
- `components/`: Újrafelhasználható Vue komponensek (pl. `AppNavbar.vue`, `AppFooter.vue`).
- `composables/`: Újrafelhasználható kompozíciós függvények (pl. API hívások logikája).
- `layouts/`: Oldalelrendezések (pl. `default.vue`, `register.vue`).
- `middleware/`: Útvonal middleware-ek (pl. hitelesítés ellenőrzése).
- `models/`: Adatmodellek TypeScript interfészei.
- `pages/`: Az alkalmazás útvonalai és oldalai. A fájlstruktúra határozza meg az útvonalakat.
- `plugins/`: Nuxt pluginek.
- `public/`: Statikus fájlok, amelyek közvetlenül a gyökérkönyvtárba másolódnak (pl. `favicon.ico`, `images/`).
- `server/`: Szerveroldali API végpontok vagy middleware-ek (Nitro).
- `services/`: Külső API-kkal kommunikáló szolgáltatások.
- `stores/`: Pinia store modulok (pl. `auth.ts`).
- `utils/`: Segédfüggvények.
- `nuxt.config.ts`: A Nuxt alkalmazás fő konfigurációs fájlja.
- `tailwind.config.js`: A Tailwind CSS konfigurációja.
- `tsconfig.json`: TypeScript konfiguráció.
- `package.json`: Projekt függőségek és szkriptek.

## 5. Telepítés és futtatás

1.  **Klónozás:** Klónozd a repository-t a helyi gépedre:
    ```bash
    https://github.com/Bence-Banyai/uniPoint.git
    ```
2.  **Navigálás:** Lépj be a `frontend` könyvtárba:
    ```bash
    cd frontend
    ```
3.  **Függőségek telepítése:**
    ```bash
    npm install
    ```
4.  **Fejlesztői szerver indítása:**
    ```bash
    npm run dev
    ```
    Az alkalmazás általában a `http://localhost:3000` címen érhető el. A fejlesztői szerver automatikusan újratöltődik módosításkor. A `nuxt.config.ts`-ben definiált Nitro proxy segítségével az `/api` kérések a `process.env.API_BASE_URL`-re irányítódnak át.
5.  **Build készítése:**
    ```bash
    npm run build
    ```
    Ez legenerálja a production-ready buildet a `.output` könyvtárba.
6.  **Production szerver indítása:**
    ```bash
    npm run start
    # Vagy: node .output/server/index.mjs
    ```
    Ez elindítja a buildelt alkalmazást.

## 6. Állapotkezelés és hitelesítés

- **Állapotkezelés:** A globális állapot kezelésére a Pinia szolgál. A `stores/auth.ts` fájl tartalmazza a hitelesítéssel kapcsolatos állapotokat (pl. `isAuthenticated`, `user`) és akciókat (`login`, `logout`, `register`, `fetchUser`, `setUser`, `clearAuth`).
- **Hitelesítés:** A Sidebase Nuxt Auth modul kezeli a felhasználói hitelesítést (bejelentkezés, regisztráció, munkamenet-kezelés). Konfigurációja a `nuxt.config.ts` fájlban található. JWT token alapú hitelesítést használ a backend API-val. Az `auth.ts` store szinkronban van a Nuxt Auth állapotával. Middleware-ek (`middleware/`) az útvonalak védelmére szolgálnak.

## 7. API-hívások és hibakezelés

- **API Kommunikáció:** Az API hívások a `composables/` és `services/` könyvtárakban definiált függvények segítségével történnek, amelyek a beépített `$fetch` függvényt használják. A `nuxt.config.ts`-ben beállított Nitro dev proxy segíti a backend API elérését CORS problémák nélkül.
- **Hibakezelés:** Az API hívások során keletkező hibákat `try...catch` blokkokkal vagy a `$fetch` beépített hibakezelésével kezeli. A felhasználói felületen (pl. `pages/admin/users.vue`) hibaüzenetek jelennek meg a felhasználó tájékoztatására.

## 8. Tesztelés

- A projekt Vitest használatára van konfigurálva (`vitest.config.ts`). A tesztek a komponensek melletti `*.test.ts`/`*.spec.ts` fájlokban találhatók. A teszt konfiguráció a `test/setup-vitest-env.ts` és a `vitest.config.ts` fájlokban találhatók.
- Unit és komponens tesztek ellenőrzik a Vue komponensek és a logikai függvények helyességét a Login, Register, Services és ServiceDetails oldalakon.

## 9. Felhasználói folyamatok, példák

- **Regisztráció:** A felhasználó a `/register` oldalon megadja adatait, elfogadja a feltételeket, majd a `register` gombra kattint. Sikeres regisztráció után automatikusan bejelentkezteti a rendszer és átirányítja a profil oldalra.
- **Bejelentkezés:** A felhasználó a bejelentkezési oldalon megadja email címét/felhasználónevét és jelszavát. Sikeres hitelesítés után a rendszer beállítja a munkamenetet és átirányítja.
- **Szolgáltatás böngészése:** A felhasználó a főoldalról vagy a navigációs sávról eljut a szolgáltatások listájához, ahol kereshet és szűrhet. Egy szolgáltatásra kattintva megtekintheti annak részleteit.
- **Profil megtekintése:** Bejelentkezés után a felhasználó a navigációs sávon keresztül eljuthat a profil oldalára (`/profile`), ahol láthatja a regisztrált adatait, és a hozzá tartozó foglalásokat és azokhoz tartozó információkat.
- **Felhasználó kezelése (Admin):** Az adminisztrátor a `/admin/` oldalakon láthatja az adatok listáit, szerkesztheti vagy törölheti őket, illetve újakat adhat hozzá.

## 10. Adatvédelem, biztonság

- **Beviteli adatok:** A felhasználói űrlapokon (regisztráció, bejelentkezés, admin) validációt kell alkalmazni a kliens- és szerveroldalon is a helytelen vagy rosszindulatú adatok kiszűrésére.
- **Hitelesítési tokenek:** A Nuxt Auth által kezelt tokenek biztonságosan vannak tárolva és kezelve.
- **Jogosultságkezelés:** Middleware-ek és feltételes renderelés segítségével van biztosítva, hogy a felhasználók csak a jogosultságuknak megfelelő oldalakat és funkciókat érjék el (pl. admin felület).
- **Függőségek:** A projekt függőségei a legfrisebb verziókat igénylik, ezzel elkerülve potenciális sebezhetőségeket.
