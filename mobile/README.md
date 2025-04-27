# UniPoint mobilalkalmazás dokumentáció

**Szerző:** Sándor Kevin

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
11. [Adatvédelem, biztonság, GDPR](#adatvédelem-biztonság-gdpr)
12. [Tipikus felhasználói szcenáriók,
    GYIK](#tipikus-felhasználói-szcenáriók-gyik)
13. [Képernyőképek](#képernyőképek)
14. [Verziókövetés](#verziókövetés)

## Áttekintés

A UniPoint egy modern szolgáltatásfoglaló rendszer, amely lehetővé teszi
különböző szolgáltatások (pl. fodrász, szerelő, egészségügyi vizsgálat
stb.) böngészését, időpontfoglalást, értékelések írását és
profilkezelést. Az alkalmazás Expo/React Native alapú, így Androidon,
iOS-en és weben is futtatható.

## Infrastruktúra és technológia

- **Frontend:** Expo, React Native, TypeScript
- **Backend:** .NET Core, REST API, MySQL, Azure Blob Storage (képek)
- **Állapotkezelés:** Context API, SecureStore
- **Navigáció:** Expo Router (file-alapú)
- **Stílus:** StyleSheet, LinearGradient, egyedi színpaletta
- **Képek:** expo-image, Azure Blob Storage URL-ek
- **Platform:** Android, iOS, web

## Főbb képernyők és funkciók

### Kezdőlap (Home)

- Üdvözlő szöveg, felhasználónév
- Kiemelt bannerek (akciók, ajánlatok)
- Következő időpont
- Gyors elérés: foglalás, időpontok, előzmények, profil
- Kategóriák böngészése
- Népszerű szolgáltatások
- Új időpont foglalása

### Keresés (Search)

- Szolgáltatók és szolgáltatások keresése
- Kategória szűrők
- Keresési előzmények, népszerű keresések
- Szolgáltató/szolgáltatás kártyák, értékelések
- Időpontfoglalás

### Időpontjaim (Appointments)

- Közelgő és múltbeli időpontok
- Időpont státuszok: Foglalt, teljesített, lemondott
- Időpont lemondása
- Kategória szerinti szűrés
- Statisztikák

### Szolgáltatás részletei (Service Details)

- Leírás, képek, ár, időtartam, cím
- Szolgáltató adatai
- Elérhető időpontok
- Foglalás lehetősége
- Vélemények, értékelések

### Profil (Profile)

- Felhasználói adatok megjelenítése, szerkesztése
- Profilkép feltöltése
- Email, név, lakcím, regisztráció dátuma
- Statisztikák
- Kijelentkezés

### Bejelentkezés/Regisztráció (Login/Register)

- Email/jelszó vagy felhasználónév/jelszó alapú bejelentkezés
- Új fiók létrehozása
- Regisztrációkor helyadat megadása (Google Places integráció)

### Üdvözlő képernyő (Welcome)

- Alkalmazás bemutatása
- Bejelentkezés és regisztráció gombok

## Projektstruktúra

- `app/` -- oldalak, képernyők, navigáció
- `services/` -- API-hívások, backend kommunikáció
- `components/` -- újrafelhasználható UI-elemek
- `constants/` -- színek, stílusok, fix adatok
- `context/` -- AuthContext, globális állapot
- `assets/` -- képek, ikonok

## Telepítés és futtatás

1.  Függőségek telepítése:

- npm install

2.  Indítás:

- npx expo start

3.  Válaszd ki a kívánt platformot (Android/iOS emulátor, Expo Go, web)

## Állapotkezelés és hitelesítés

- Context API és SecureStore használata a tokenek, felhasználói adatok
  tárolására
- Bejelentkezéskor a JWT token a SecureStore-ba kerül, minden
  API-hívásnál automatikusan bekerül a fejlécbe
- Kijelentkezéskor minden érzékeny adat törlődik a tárolóból

## API-hívások és hibakezelés

- Minden API-hívás try/catch blokkal van körülvéve, hibák esetén
  felhasználóbarát üzenet jelenik meg
- A backend REST API végpontjai részletesen dokumentáltak (lásd:
  backend/README.org)
- Példa API-hívás:

<!-- -->

    import api from '../services/api';

    export const fetchServices = async () => {
      try {
        const response = await api.get('/api/Service');
        return response.data;
      } catch (error) {
        console.error('Szolgáltatások lekérdezése sikertelen:', error);
        throw error;
      }
    };

## Tesztelés

- Manuális tesztelés Expo Go-val, Android/iOS emulátorral
- Backend oldali tesztek: xUnit, automatikus tesztek

## CI/CD és deployment

- A mobil app fejlesztése után Expo CLI-vel lehet buildelni, publikálni
- A backend automatikusan deployolódik Azure-ra

## Felhasználói folyamatok, példák

### Regisztráció és bejelentkezés folyamata

- A felhasználó az üdvözlő képernyőn választhat a regisztráció és
  bejelentkezés között.
- Regisztráció során meg kell adni a nevet, e-mail címet, jelszót,
  lakcímet (Google Places integrációval).
- Sikeres regisztráció után automatikus bejelentkezés történik, a
  felhasználó a kezdőlapra kerül.
- Bejelentkezéskor a rendszer JWT tokent generál, amelyet
  SecureStore-ban tárol.

#### Példa regisztrációs folyamatra:

1.  Üdvözlő képernyő → Regisztráció gomb
2.  Adatok megadása (név, e-mail, jelszó, lakcím)
3.  Regisztráció elküldése → Sikeres válasz → Automatikus bejelentkezés
4.  Kezdőlap megjelenítése

### Szolgáltatás keresése és foglalás

- A keresőoldalon kategóriák, népszerű keresések, szűrők segítik a
  böngészést.
- A szolgáltatás részletei oldalon a felhasználó megtekintheti a
  szolgáltató adatait, képeket, árakat, értékeléseket.
- Időpontfoglaláskor a rendszer csak a szabad időpontokat jeleníti meg.

#### Példa foglalási folyamatra:

1.  Keresés → Szolgáltatás kiválasztása
2.  Időpont kiválasztása → Foglalás gomb
3.  Sikeres foglalás → Következő időpont megjelenik a kezdőlapon

### Saját időpontok kezelése

- A felhasználó a Közelgő és Múltbeli időpontok között válthat.
- Időpont lemondása esetén a rendszer visszaigazolást kér.
- A lemondott időpontok statisztikában is megjelennek.

### Profil szerkesztése, profilkép feltöltése

- A profil oldalon a felhasználó módosíthatja adatait, feltöltheti vagy
  frissítheti profilképét.
- A profilkép feltöltésekor csak jpg, png formátum engedélyezett, max.
  15MB méretig.
- A módosítások után a rendszer visszajelzést ad.

### Vélemények írása és olvasása

- Minden szolgáltatásnál lehetőség van értékelés írására (1-5 csillag,
  szöveges vélemény).
- A szolgáltatások átlagos értékelése automatikusan frissül.

## Adatvédelem, biztonság, GDPR

- Minden felhasználói adat titkosított csatornán (HTTPS) keresztül kerül
  továbbításra
- A jelszavak soha nem kerülnek tárolásra vagy továbbításra titkosítás
  nélkül
- A profilképek, személyes adatok csak a felhasználó és az
  adminisztrátor számára elérhetők
- Az alkalmazás megfelel a GDPR előírásainak

[]{#tipikus-felhasználói-szcenáriók-gyik .anchor}

## Képernyőképek

### Profil oldal
![Profil oldal](attachments/profile.png)

### Időpontjaim oldal
![Időpontjaim oldal](attachments/appointments.png)

### Keresés oldal
![Keresés oldal](attachments/search.png)

### Kezdőlap
![Kezdőlap](attachments/home.png)

## Verziókövetés

- Verziókövetés: Git, minden főbb változás commitban dokumentálva
