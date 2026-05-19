# Lakóközösségi és Ingatlankezelő Platform (NeighbourHub)

## Projektleírás

Az alkalmazás célja, hogy a lakók, tulajdonosok és az ingatlankezelők (pl. közös képviselő) egy közös online felületen egyszerűen és átláthatóan tudják kezelni a mindennapi lakóközösségi folyamatokat, a belső kommunikációt és az épületüzemeltetést. A rendszer támogatja a digitális közösségi döntéshozatalt, a közös helyiségek foglalását, a hivatalos dokumentumok archiválását, valamint a műszaki hibák bejelentését és nyomon követését. Ezáltal egy modern, reszponzív és könnyen használható digitális lakókörnyezet jön létre, ahol a fontos információk és statisztikák egy központi irányítópulton (Dashboard) azonnal elérhetők.

---

## Fő funkciók

### Felhasználói (Lakói) funkciók

- **Regisztráció és bejelentkezés**
  - E-mail alapú regisztráció lakásadatok megadásával (lakásszám, státusz mint bérlő vagy tulajdonos).
  - Biztonságos, JWT token alapú hitelesítés és bejelentkezés (kliensoldali payload dekódolással).
- **Központi Dashboard (Irányítópult)**
  - Gyors, összesített áttekintés az aktív szavazásokról, olvasatlan üzenetekről, függőben lévő foglalásokról és a legfrissebb közleményekről.
  - Heti felhasználói aktivitási statisztikák grafikus megjelenítése.
- **Szavazások kezelése (Voting)**
  - Közösségi szavazások indítása leírással és határidő megadásával.
  - Aktív szavazásokon való részvétel három opcióval: Igen / Nem / Tartózkodik.
  - Az eredmények és szavazási statisztikák valós idejű megjelenítése.
  - Saját indítású szavazások törlésének lehetősége.
- **Hibabejelentés (Issues)**
  - Műszaki problémák, karbantartási igények és közös területi hibák gyors rögzítése.
  - Cím, leírás, kategória (pl. elektromos, gépészet) és prioritási szint megadása.
  - A bejelentett hibajegyek aktuális állapotának (pl. függőben, folyamatban, lezárva) és a tervezett javítási dátumnak a nyomon követése.
- **Közösségi helyiségek foglalása (Bookings)**
  - Közös használatú helyiségek és létesítmények (pl. konditerem, mosókonyha, közösségi szoba) időszakos lefoglalása.
  - Valós idejű foglaltsági naptár az idősávok és a szabad helyek ellenőrzésére.
  - Saját foglalások áttekintése és lemondása.
- **Alaprajz és lakónyilvántartás (Floor Plans & Residents)**
  - Az emeletek interaktív, vizuális alaprajzának megtekintése.
  - Az egyes lakásokhoz tartozó interaktív jelölők, amelyek megmutatják az ott lakó szomszédok közvetlen elérhetőségeit (pl. név, telefonszám).
  - A lépcsőházban/épülettömbben élő lakók transzparens jegyzéke (lakásszám, parkolóhely, tároló száma szerint).
- **Dokumentumtár (Documents)**
  - Biztonságos digitális archívum a fontos társasházi dokumentumok eléréséhez (pl. SZMSZ, alapító okirat, közgyűlési jegyzőkönyvek, pénzügyi kimutatások).
  - Dokumentumok listázása, keresése és letöltése.
- **Privát üzenetküldés (Messages)**
  - Közvetlen, kétoldalú szöveges üzenetváltás a lakótársak vagy az adminisztrátorok között.
  - Beérkező és elküldött üzenetek kezelése, közvetlen válaszadási lehetőség és üzenetek puha törlése (soft delete).

### Adminisztrátori (Ingatlankezelői) funkciók

- **Regisztrációk jóváhagyása (Pending Users)**
  - Új lakók regisztrációs kérelmeinek ellenőrzése, jóváhagyása vagy elutasítása az épület biztonságának megőrzése érdekében.
- **Közlemények kezelése (Announcements)**
  - Fontos lakóközösségi információk, karbantartási értesítések és hivatalos hirdetmények közzététele.
  - A közlemények látványos, lapozható (carousel) módban való kiemelése a felhasználók számára.
- **Hibabejelentések menedzselése**
  - A lakók által beküldött hibajegyek állapotának frissítése (pl. "Folyamatban" státuszra állítás).
  - Plusz információk, megjegyzések és a tervezett javítási dátum hozzárendelése a bejelentésekhez.
- **Épület- és létesítménykezelés**
  - Új közösségi helyiségek hozzáadása a foglalási rendszerhez.
  - Emeleti alaprajzok kezelése és a lakók hozzárendelése az egyes ingatlanokhoz.
- **Dokumentumkezelés**
  - Hivatalos PDF dokumentumok és fájlok feltöltése a közös digitális archívumba.
- **Moderálás**
  - Bármely szavazás, hozzászólás vagy tartalom törlésének joga, amennyiben az sérti a közösségi szabályzatot vagy irreleváns.

---

## Extra / Technikai funkciók

- **Valós idejű statisztikák**
  - Rendszerszintű és lakói aktivitási statisztikák aggregálása és kiszolgálása az API szintjén a Dashboard modulhoz.
- **Fájl preview és biztonság**
  - Dokumentum előnézete (beágyazott PDF nézegető) kliensoldalon, szigorú és megfelelő CSP (Content Security Policy) beállítások mellett.
  - Optimalizált és megnövelt fájlfeltöltési méretkorlát a backend oldalon, kliensoldali validációval kiegészítve.
- **Reszponzív UI és technikai stukkó**
  - Teljesen reszponzív, modern Bootstrap 5 és Bootstrap Icons alapú felhasználói felület.
  - Swagger UI alapú, transzparens módon dokumentált REST API.

---

## Alkalmazott technológiák

- **Frontend:** Angular 19 (Core, CLI & Router), TypeScript 5.7, RxJS, @ngneat/until-destroy, Bootstrap 5
- **Backend:** ASP.NET Core Web API
- **Adatbázis:** MSSQL / LocalDB, Entity Framework Core (ORM)
- **Hitelesítés:** JWT Token alapú biztonságos autentikáció
- **Fejlesztési módszertan:** GitHub Projects, SCRUM (SCRUM poker feladatbecsléssel) és automatizált unit tesztelés (Jasmine & Karma)
