# UniPoint Webalkalmazás (Frontend) Dokumentáció

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
9.  [CI/CD és deployment](#cicd-és-deployment)
10. [Felhasználói folyamatok, példák](#felhasználói-folyamatok-példák)
11. [Adatvédelem, biztonság](#adatvédelem-biztonság)

## 1. Áttekintés

A UniPoint frontend egy modern webalkalmazás, amely a UniPoint szolgáltatásfoglaló rendszer felhasználói felületét biztosítja böngészők számára. Lehetővé teszi a felhasználók számára szolgáltatások böngészését, időpontok foglalását, saját profiljuk kezelését, valamint adminisztrátori funkciók elérését. Az alkalmazás Nuxt 3 keretrendszerre épül, Vue 3-at használva a komponensalapú fejlesztéshez.

## 2. Infrastruktúra és technológia

- **Keretrendszer:** [Nuxt 3](https://nuxt.com/)
- **Nyelv:** [TypeScript](https://www.typescriptlang.org/)
- **UI Könyvtár:** [Vue 3](https://vuejs.org/) (Nuxt által integrálva)
- **Stílus:** [Tailwind CSS](https://tailwindcss.com/) (`@nuxtjs/tailwindcss` modul)
- **Állapotkezelés:** [Pinia](https://pinia.vuejs.org/) (`@pinia/nuxt` modul)
- **Hitelesítés:** [Sidebase Nuxt Auth](https://sidebase.io/nuxt-auth/getting-started) (`@sidebase/nuxt-auth` modul)
- **Ikonok:** [Nuxt Icon](https://github.com/nuxt/icon) (`@nuxt/icon` modul, `entypo`, `iconoir` kollekciók)
- **Betűtípusok:** [Google Fonts](https://fonts.google.com/) (`@nuxtjs/google-fonts` modul, Montserrat)
- **Képkezelés:** [Nuxt Image](https://image.nuxt.com/) (`@nuxt/image` modul)
- **API Proxy:** Nitro Development Proxy (fejlesztés alatt)
- **Tesztelés:** [Vitest](https://vitest.dev/) (`vitest.config.ts`)
- **Build Eszköz:** [Vite](https://vitejs.dev/) (Nuxt által integrálva)
- **Containerizáció:** Docker (`Dockerfile`, `nginx.conf`)

## 3. Főbb képernyők és funkciók

- **Kezdőlap (`pages/index.vue`):** Az alkalmazás fő oldala, bemutatja a platformot, kiemelt szolgáltatásokat, működési lépéseket és felhasználói véleményeket. CTA gombok a regisztrációhoz és szolgáltatások böngészéséhez.
- **Szolgáltatások (`pages/services/...`):** Oldalak a szolgáltatások listázására, keresésére és részleteinek megtekintésére (feltételezett).
- **Regisztráció (`pages/register/index.vue`):** Új felhasználói fiók létrehozása felhasználónév, email, jelszó és opcionális helyadatok megadásával.
- **Bejelentkezés (`pages/login/...`):** Meglévő felhasználók bejelentkezése (feltételezett, Nuxt Auth kezeli).
- **Profil (`pages/profile/index.vue`):** Bejelentkezett felhasználó adatainak megjelenítése (felhasználónév, email, szerepkör, hely).
- **Admin Felület (`pages/admin/...`):**
  - **Felhasználók (`pages/admin/users.vue`):** Felhasználók listázása, keresése, szűrése szerepkör szerint. Új felhasználó hozzáadása, meglévő szerkesztése és törlése modális ablakokban.
- **Navigációs Sáv (`components/AppNavbar.vue`):** Globális navigáció a főbb oldalak között, dinamikusan mutatja a bejelentkezés/regisztráció vagy profil/kijelentkezés linkeket a hitelesítési állapottól függően.
- **Lábléc (`components/AppFooter.vue`):** Gyorslinkek, kapcsolati információk, közösségi média linkek, hírlevél feliratkozás és copyright információk.

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
- `Dockerfile`, `nginx.conf`: Docker konfigurációs fájlok a deploymenthez.

## 5. Telepítés és futtatás

1.  **Klónozás:** Klónozd a repository-t a helyi gépedre.
2.  **Navigálás:** Lépj be a `frontend` könyvtárba: `cd frontend`
3.  **Függőségek telepítése:**
    ```bash
    npm install
    ```
4.  **Fejlesztői szerver indítása:**
    ```bash
    npm run dev
    ```
    Az alkalmazás általában a `http://localhost:3000` címen érhető el. A fejlesztői szerver automatikusan újratöltődik a kód módosításakor. A `nuxt.config.ts`-ben definiált Nitro proxy segítségével a `/api` kérések a `process.env.API_BASE_URL`-re irányítódnak át.
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

- **Állapotkezelés:** A globális állapot kezelésére a [Pinia](https://pinia.vuejs.org/) szolgál. A `stores/auth.ts` fájl tartalmazza a hitelesítéssel kapcsolatos állapotokat (pl. `isAuthenticated`, `user`) és akciókat (`login`, `logout`, `register`, `fetchUser`, `setUser`, `clearAuth`).
- **Hitelesítés:** A [Sidebase Nuxt Auth](https://sidebase.io/nuxt-auth/getting-started) modul kezeli a felhasználói hitelesítést (bejelentkezés, regisztráció, munkamenet-kezelés). Konfigurációja a `nuxt.config.ts` fájlban található. Valószínűleg JWT token alapú hitelesítést használ a backend API-val. Az `auth.ts` store szinkronban van a Nuxt Auth állapotával. Middleware-ek (`middleware/`) használhatók az útvonalak védelmére.

## 7. API-hívások és hibakezelés

- **API Kommunikáció:** Az API hívások valószínűleg a `composables/` vagy `services/` könyvtárakban definiált függvények segítségével történnek, amelyek a beépített `$fetch` vagy egy konfigurált Axios instance-t használnak. A `nuxt.config.ts`-ben beállított Nitro dev proxy segíti a backend API elérését fejlesztés közben CORS problémák nélkül.
- **Hibakezelés:** Az API hívások során keletkező hibákat `try...catch` blokkokkal vagy a `$fetch` beépített hibakezelésével kell kezelni. A felhasználói felületen (pl. `pages/admin/users.vue`) hibaüzenetek jelennek meg a felhasználó tájékoztatására.

## 8. Tesztelés

- A projekt [Vitest](https://vitest.dev/) használatára van konfigurálva (`vitest.config.ts`). A tesztek valószínűleg a `test/` vagy a komponensek melletti `*.test.ts`/`*.spec.ts` fájlokban találhatók.
- Unit és komponens tesztek írhatók a Vue komponensek és a logikai függvények helyességének ellenőrzésére.

## 9. CI/CD és deployment

- **Docker:** A projekt tartalmaz egy `Dockerfile`-t és egy `nginx.conf` fájlt, ami arra utal, hogy Docker konténerként deployolható. A `Dockerfile` valószínűleg egy multi-stage buildet definiál, amely először buildeli a Nuxt alkalmazást, majd egy Nginx szerverrel szolgálja ki a statikus fájlokat és kezeli a routingot. A `.dockerignore` fájl minimalizálja a build kontextust.
- **Deployment:** A legenerált Docker image deployolható különböző platformokra (pl. Azure Container Apps, Kubernetes, stb.). A CI/CD folyamat (pl. GitHub Actions) automatizálhatja a buildelést és a deploymentet.

## 10. Felhasználói folyamatok, példák

- **Regisztráció:** A felhasználó a `/register` oldalon megadja adatait, elfogadja a feltételeket, majd a `register` gombra kattint. Sikeres regisztráció után valószínűleg automatikusan bejelentkezteti a rendszer és átirányítja a főoldalra vagy a profil oldalra.
- **Bejelentkezés:** A felhasználó a bejelentkezési oldalon megadja email címét/felhasználónevét és jelszavát. Sikeres hitelesítés után a rendszer beállítja a munkamenetet és átirányítja.
- **Szolgáltatás böngészése:** A felhasználó a főoldalról vagy a navigációs sávról eljut a szolgáltatások listájához, ahol kereshet és szűrhet. Egy szolgáltatásra kattintva megtekintheti annak részleteit.
- **Profil megtekintése:** Bejelentkezés után a felhasználó a navigációs sávon keresztül eljuthat a profil oldalára (`/profile`), ahol láthatja a regisztrált adatait.
- **Felhasználó kezelése (Admin):** Az adminisztrátor a `/admin/users` oldalon láthatja a felhasználók listáját, szerkesztheti vagy törölheti őket, illetve újakat adhat hozzá.

## 11. Adatvédelem, biztonság

- **Adattovábbítás:** Feltételezhetően minden backend kommunikáció HTTPS-en keresztül történik.
- **Beviteli adatok:** A felhasználói űrlapokon (regisztráció, bejelentkezés, admin) validációt kell alkalmazni a kliens- és szerveroldalon is a helytelen vagy rosszindulatú adatok kiszűrésére.
- **Hitelesítési tokenek:** A Nuxt Auth által kezelt tokeneket biztonságosan kell tárolni (pl. `HttpOnly` cookie-k) és kezelni.
- **Jogosultságkezelés:** Middleware-ek és feltételes renderelés segítségével kell biztosítani, hogy a felhasználók csak a jogosultságuknak megfelelő oldalakat és funkciókat érjék el (pl. admin felület).
- **Függőségek:** A projekt függőségeit rendszeresen frissíteni kell a biztonsági rések elkerülése érdekében.
