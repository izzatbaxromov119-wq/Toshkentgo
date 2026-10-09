# TashkentGo — "Yaxshi joylar – yaqinroq"

Toshkentdagi do'konlar, o'quv markazlari, sport zallari, ijaradagi joylar va turistik
obyektlar ma'lumotnomasi. Har bir joy xaritada ko'rsatiladi, narxiga qarab
**Budjet / Standart / Premium** toifasiga bo'linadi.

**Texnologiyalar:** Django 6 · Django REST Framework · PostgreSQL · JWT (SimpleJWT) · React 19 (Vite) · Leaflet

---

## 1. Arxitektura

```
 ┌──────────────────────┐   HTTPS / JSON    ┌───────────────────────────┐
 │  React (Vite)        │ ────────────────► │  Django + DRF (API)       │
 │  - sahifalar         │ ◄──────────────── │  - accounts  (JWT kirish) │
 │  - Leaflet xaritasi  │  Authorization:   │  - places    (asosiy)     │
 │  - AuthContext       │  Bearer <token>   └─────────────┬─────────────┘
 └──────────┬───────────┘                                 │ ORM
            │                                             ▼
            ▼                                   ┌───────────────────┐
   OpenStreetMap (xarita plitkalari)            │   PostgreSQL      │
   OSRM (yo'l chizish)                          └───────────────────┘
```

**Asosiy qoida:** frontend va backend bir-biridan to'liq ajratilgan. React faqat `/api/...`
manzillariga so'rov yuboradi. Shu sababli keyinchalik mobil ilova ham xuddi shu API'dan foydalana oladi.

### Papkalar

```
tashkentgo/
├── backend/
│   ├── config/            settings.py, urls.py
│   ├── accounts/          ro'yxatdan o'tish, kirish (JWT)
│   └── places/
│       ├── models.py      ← ma'lumotlar bazasi jadvallari
│       ├── serializers.py ← model -> JSON
│       ├── views.py       ← API mantiqi (filtr, sevimli, sharh)
│       └── management/commands/seed_data.py  ← demo ma'lumotlar
└── frontend/src/
    ├── api/client.js      ← Django bilan gaplashuv + JWT
    ├── context/           ← AuthContext (kim kirgan)
    ├── hooks/usePlaces.js ← ma'lumot yuklash
    ├── components/        ← Header, Hero, PlaceCard, PlaceMap, ...
    ├── pages/             ← Home, Places, Map, PlaceDetail, About, Contact
    └── styles.css         ← barcha ranglar va dizayn
```

---

## 2. Ma'lumotlar bazasi sxemasi (PostgreSQL)

| Jadval | Muhim ustunlar | Izoh |
|---|---|---|
| `auth_user` | id, username, email, password | Django'ning tayyor foydalanuvchi jadvali |
| `places_category` | id, name, slug, **parent_id**, order, **standard_from, premium_from** | 2 daraja: guruh (Ovqatlanish) → tur (Fast food). Narx chegaralari guruhda beriladi |
| `places_amenity` | id, name, icon | Wi-Fi, avtoturargoh, konditsioner |
| `places_place` | id, name, slug, **category_id**, description, offerings, region, district, address, **latitude, longitude**, phone, **call_center, call_center_hours**, website, working_hours, **price_from, price_unit, price_level**, **discount_percent, discount_text, discount_until**, **email, instagram, telegram, facebook**, rating_avg, reviews_count, is_active | Asosiy jadval |
| `places_place_amenities` | place_id, amenity_id | Ko'p-ko'pga bog'lanish |
| `places_placeimage` | id, place_id, image, is_main | Rasmlar |
| `places_review` | id, place_id, user_id, rating (1–5), comment | Bitta user – bitta joyga bitta sharh |
| `places_favorite` | id, user_id, place_id | Sevimlilar (yurakcha) |
| `places_notification` | id, kind, title, message, place_id, created_at | Bildirishnomalar (qo'ng'iroqcha). Chegirma yozilganda avtomatik yaratiladi |

**Aloqalar:** `Category 1—* Place`, `Place *—* Amenity`, `Place 1—* PlaceImage`,
`Place 1—* Review *—1 User`, `User 1—* Favorite *—1 Place`.

**Indekslar:** `(latitude, longitude)`, `(region, price_level)`, `price_level` — filtr va xarita tez ishlashi uchun.

**Narx darajasi qoidasi** — kategoriya guruhiga qarab (admin panelda `Kategoriyalar` da o'zgartiriladi):

| Guruh | Narx nimani bildiradi | Budjet | Standart | Premium |
|---|---|---|---|---|
| Ovqatlanish | bir kishiga o'rtacha chek | < 80 000 | 80 000 – 200 000 | ≥ 200 000 |
| Kiyim-kechak | bitta buyum | < 200 000 | 200 000 – 600 000 | ≥ 600 000 |
| Boshqalar (ijara, sport, ta'lim, ...) | odatda oyiga / kechasiga | < 300 000 | 300 000 – 700 000 | ≥ 700 000 |

`price_level` bo'sh qoldirilsa, narxga qarab avtomatik aniqlanadi.

---

## 3. API

| Metod | Manzil | Tavsif |
|---|---|---|
| POST | `/api/auth/register/` | Ro'yxatdan o'tish |
| POST | `/api/auth/login/` | Kirish → `access` + `refresh` token |
| POST | `/api/auth/refresh/` | Yangi `access` token olish |
| GET | `/api/auth/me/` | Kirgan foydalanuvchi |
| GET | `/api/categories/` | Kategoriyalar |
| GET | `/api/places/` | Ro'yxat (12 tadan sahifalanadi) |
| GET | `/api/places/<slug>/` | Batafsil |
| GET | `/api/places/map/` | Xarita nuqtalari (yengil) |
| GET | `/api/notifications/` | Bildirishnomalar (qo'ng'iroqcha uchun, oxirgi 20 ta) |
| GET | `/api/places/favorites/` | Mening sevimlilarim 🔒 |
| POST | `/api/places/<slug>/favorite/` | Sevimliga qo'shish/olib tashlash 🔒 |
| GET/POST | `/api/places/<slug>/reviews/` | Sharhlar (yozish 🔒) |

**Filtr parametrlari** (`/api/places/` va `/api/places/map/` uchun):
`q`, `region` (`city`/`province`), `category` (slug), `price_level` (`budget`/`standard`/`premium`),
`min_price`, `max_price`, `has_discount=1` (faqat chegirmalilar), `ordering` (`rating`/`cheap`/`expensive`/`new`/`discount`).

Masalan: `/api/places/?category=sport&price_level=budget&region=city`

---

## 4. Ishga tushirish

### Eng oson yo'l — bitta fayl, hech narsa sozlash shart emas

Talab qilinadi: [Python 3.10+](https://www.python.org/downloads/) o'rnatilganda **"Add python.exe to PATH"** katagini belgilang, va [Node.js](https://nodejs.org/) (LTS versiya).

**Windows:** `backend` papkasidagi `start.bat` ni ikki marta bosing. Alohida oynada `frontend` papkasidagi `start.bat` ni ham ikki marta bosing (ikkalasi ham ochiq turishi kerak).
**macOS / Linux:** terminalda `./backend/start.sh`, boshqa terminalda `./frontend/start.sh`.

Shu bitta amal bilan: mos Python avtomatik topiladi, virtual muhit (`venv`) yaratiladi, kerakli paketlar o'rnatiladi, baza (SQLite — hech narsa o'rnatish shart emas) tayyorlanadi, demo ma'lumot va sinov uchun admin (`admin` / `admin12345`) yaratiladi va server ishga tushadi. Keyingi safar ikki marta bosganingizda hammasi tayyor bo'lgani uchun bir necha soniyada ochiladi.

- Sayt: http://localhost:5173
- Admin panel: http://localhost:8000/admin/  (login: `admin`, parol: `admin12345` — bu faqat sinov uchun, production'da o'zgartiring)

**PyCharm ishlatsangiz:** bu skriptlar PyCharm'ning "interpreter tanlash" oynasiga ehtiyoj qoldirmaydi — PyCharm'ning pastki terminalida (yoki oddiy Explorer'da ikki marta bosib) shunchaki `start.bat` ni ishga tushiring, run-konfiguratsiya sozlash shart emas.

**Xato chiqsa:** oyna o'zi to'xtamaydi — tushunarli xabar bilan kutib turadi. PostgreSQL bilan bog'liq xato chiqsa, pastdagi "PostgreSQL muammolarini tekshirish" bo'limiga qarang.

**"Python topilmadi" chiqsa-yu, Python aslida o'rnatilgan bo'lsa** (masalan, PyCharm'da ishlayotgan bo'lsa):
`start.bat` Python'ni to'rt xil usulda qidiradi — `py` launcher, PATH, eng ko'p uchraydigan o'rnatish papkalari
(`%LocalAppData%\Programs\Python\...`) va Windows reestri — shuning uchun PATH'ga qo'shilmagan bo'lsa ham
odatda topadi. Baribir topa olmasa: PyCharm'da **Settings → Project → Python Interpreter** ga kiring, interpreter
yo'lini (masalan `C:\Users\...\python.exe`) nusxalab oling va bizga yuboring — skriptni shunga moslab beramiz.

### Qo'lda ishga tushirish (ilg'or foydalanuvchilar uchun)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt  # Python versiyasiga qarab mos Django o'zi tanlanadi (5.2 yoki 6.x)

python manage.py migrate
python manage.py seed_data --if-empty   # demo joylar (ixtiyoriy)
python manage.py ensure_admin           # sinov admin: admin / admin12345
python manage.py runserver              # http://localhost:8000
```

```bash
cd frontend
npm install
npm run dev                             # http://localhost:5173
```

### Baza: SQLite (standart) yoki PostgreSQL

Standart holatda hech narsa sozlamasangiz ham ishlaydi — ma'lumotlar `backend/db.sqlite3` faylida saqlanadi. PostgreSQL ishlatmoqchi bo'lsangiz:

1. `backend/.env.example` ni `backend/.env` nomi bilan nusxalang (yoki `start.bat`/`start.sh` buni birinchi ishga tushirishda o'zi qiladi).
2. `.env` faylida `DB_ENGINE=postgres` qiling va `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` qiymatlarini to'ldiring.
3. PostgreSQL drayverini o'rnating: `pip install -r requirements-postgres.txt`.
4. Tekshiring: `python manage.py dbcheck` — ulanish, parol, baza mavjudligini tekshirib, muammo bo'lsa tushunarli tilda sababini aytadi. `python manage.py dbcheck --create` baza hali yo'q bo'lsa, uni yaratadi.

### PostgreSQL muammolarini tekshirish

`python manage.py dbcheck` buyrug'i quyidagilarni avtomatik aniqlaydi va nima qilish kerakligini aytadi:
- PostgreSQL drayveri o'rnatilmagan — qaysi buyruqni yuritish kerakligini ko'rsatadi.
- PostgreSQL serveri ishlamayapti — Windows xizmatlarini qanday tekshirish va yoqishni tushuntiradi.
- Parol yoki foydalanuvchi noto'g'ri — qaysi `.env` qiymatini tekshirish kerakligini aytadi.
- Baza hali yaratilmagan — `--create` bilan avtomatik yaratish mumkinligini aytadi.

Eng oson yo'l — PostgreSQL bilan umuman ovora bo'lmaslik: `.env` da `DB_ENGINE=sqlite` qoldiring (standart shunday).

## 5. Call-markaz

Call-markaz alohida kategoriya emas: har bir do'kon va mehmonxonaning O'ZINING call-markaz (hotline) raqami bor.
Admin panelda joyning "Call-markaz raqami" va "Call-markaz ish vaqti" maydonlarini to'ldiring — batafsil sahifada
telefon ostida ko'rinadi, kartochkada esa quloqchin belgisi chiqadi.

## 6. Chegirma va bildirishnomalar

- Admin panelda joyga **Chegirma (%)**, matn va tugash sanasini yozing → hamma foydalanuvchining
  qo'ng'iroqchasida avtomatik yangi xabar paydo bo'ladi (soni qizil belgida).
- Muddati o'tgan chegirma ro'yxatlardan, bannerlardan va xabarlardan o'zi yo'qoladi.
- Qaysi xabar o'qilganini brauzer eslab qoladi (kirmagan foydalanuvchilarda ham ishlaydi).
- Kartochkada chegirma nishoni, eski narx (chizilgan) va yangi narx ko'rsatiladi.

## 7. Bosqichma-bosqich rivojlantirish

**1-bosqich (hozir, MVP)** — shu arxivdagi kod: ro'yxat, filtr, xarita, kirish, sharh, sevimlilar.

**2-bosqich (foydalanuvchilar ko'payganda):**
- Rasm yuklash uchun S3/Cloudinary, statik fayllar uchun WhiteNoise/Nginx.
- Qidiruv: PostgreSQL `pg_trgm` / to'liq matnli qidiruv (`SearchVector`).
- Redis kesh: `/api/places/map/` va bosh sahifa ro'yxati.
- Biznes egalari uchun kabinet (o'z joyini qo'shish, `Place.owner`).

**3-bosqich (katta yuklama):**
- Yaqin joylarni topish (“menga yaqin”): **PostGIS** + `PointField` (hozirgi `latitude/longitude` shunga oson o'tkaziladi).
- Gunicorn + Nginx, Docker, CDN, Celery (fon vazifalari).
- Xarita: OSRM/Google Directions'ni o'z serveringizga o'tkazish.

---

## 8. Muhim eslatmalar

- **Demo ma'lumotlar to'qima.** `seed_data` dagi nomlar, telefonlar va koordinatalar namuna;
  haqiqiy ma'lumotni admin panelda kiriting.
- **Xarita:** hozir Leaflet + OpenStreetMap (bepul, API kalitsiz). Barcha xarita kodi
  `components/PlaceMap.jsx` da — Google Maps'ga o'tsangiz, faqat shu faylni almashtirasiz.
- **Yo'l ko'rsatish:** foydalanuvchi joylashuviga ruxsat berganda OSRM demo serveri orqali chiziladi
  (faqat sinov uchun; ishlab chiqarishda o'z servisingizni ishlating). "Google Maps" tugmasi ham bor.
- **Hero fon:** Toshkent silueti (Tashkent City + Teleminora) SVG ko'rinishida chizilgan
  (`components/Skyline.jsx`). Haqiqiy foto qo'ymoqchi bo'lsangiz, `.hero-bg` ichiga `<img>` qo'ying.
- **Sana maydoni** qidiruvda bor, lekin hozircha backend uni ishlatmaydi (keyingi bosqichda bron qilish uchun).
- **Xavfsizlik (ishga tushirishdan oldin):** `DJANGO_SECRET_KEY` ni almashtiring, `DJANGO_DEBUG=False`,
  `DJANGO_ALLOWED_HOSTS` va `FRONTEND_URL` ni haqiqiy domenga o'zgartiring, HTTPS yoqing.
- **`admin` / `admin12345` faqat sinov uchun.** `ensure_admin` buyrug'i shu login bilan admin yaratadi, lekin
  FAQAT `DJANGO_DEBUG=True` bo'lsa ishlaydi (ya'ni faqat o'z kompyuteringizda sinayotganda). `DJANGO_DEBUG=False`
  qilinganda bu buyruq hech narsa qilmaydi — ishlab chiqarishda `python manage.py createsuperuser` bilan o'zingiz
  xavfsiz login/parol yarating.

---

## 9. Rasmlar va xarita

**Joy rasmlari.** Admin panelda (`/admin/` → Joylar → "Rasmlar") foto yuklasangiz, kartochkada shu foto chiqadi
(`Asosiy rasm` belgilangani birinchi). Foto yuklanmagan joylarda kategoriya va NOMga qarab avtomatik
vektor rasm ko'rsatiladi (burger, palov, doner, kostyum, bokschi qo'lqop, ...). Fon rangi narx darajasiga mos.
Barcha rasmlarni ko'rish: `npm run dev` → `http://localhost:5173/art-gallery`.
Yangi rasm qo'shish: `frontend/src/components/art/scenes.jsx` (chizish) va `PlaceArt.jsx` (`pickScene` — qaysi joyga qaysi rasm).

**Xarita.** Lokal ishga tushirilganda CARTO plitkalari (OpenStreetMap ma'lumotlari) ishlatiladi: kunduzgi (Voyager)
va tungi (Dark) uslub qurilma sozlamasiga qarab o'zi almashadi. CARTO bepul rejasi kam yuklamali va notijorat
loyihalar uchun; ommaviy ishga tushirishda MapTiler / Mapbox yoki o'z plitka serveringizga o'ting
(`components/PlaceMap.jsx` dagi `TILES`).

**Demo xarita.** Claude'da e'lon qilingan sahifa tashqi xarita rasmlarini yuklamaydi, shuning uchun demoda
Toshkentning haqiqiy tuman chegaralari vektor ko'rinishida chiziladi (`components/DemoBasemap.jsx`).
Chegaralar: github.com/akbartus/GeoJSON-Uzbekistan (GPL-3.0), © OpenStreetMap contributors (ODbL).
Bu faqat demo uchun; ishga tushirilgan saytda haqiqiy xarita chiqadi.

## 10. Demo rejim (backendsiz)

Frontendni Django va PostgreSQL'siz, namuna ma'lumotlar bilan ko'rsatish uchun:

```bash
cd frontend
VITE_DEMO=1 npm run build      # dist/index.html — bitta fayl (Windows: set VITE_DEMO=1 && npm run build)
```

Demo rejimda ma'lumotlar `src/api/demoData.json` dan olinadi, kirish uchun istalgan login/parol yaroqli,
xaritada plitka fon va "Yo'l ko'rsatish" yo'q. Oddiy `npm run dev` / `npm run build` ga ta'sir qilmaydi.
