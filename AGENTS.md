# AGENTS.md — PakeLagi Frontend

## 1. Project Overview

PakeLagi adalah platform katalog dan penjualan pakaian preloved / second-hand.

Frontend dibangun menggunakan:

- Next.js
- TypeScript
- React
- Tailwind CSS
- App Router
- REST API dari Laravel sebagai backend

### Business Flow Utama

PakeLagi **BUKAN marketplace dengan checkout internal**.

Alur pembelian:

```text
User
  ↓
Browse katalog
  ↓
Melihat detail produk
  ↓
Tertarik dengan produk
  ↓
Klik "Tanya via WhatsApp"
  ↓
WhatsApp penjual/admin
  ↓
Transaksi dilanjutkan di WhatsApp
```

Jangan membuat:

- shopping cart
- checkout page
- payment gateway
- order tracking
- alamat pengiriman
- sistem pembayaran internal

kecuali diminta secara eksplisit.

Website berfungsi sebagai **katalog produk + discovery platform + product showcase**, sedangkan komunikasi dan transaksi dilakukan melalui WhatsApp.

---

# 2. Product Personality

PakeLagi harus terasa seperti brand fashion preloved yang:

- modern
- clean
- youthful
- approachable
- authentic
- curated
- sedikit editorial
- tidak terlalu korporat
- tidak terlihat seperti template e-commerce generik

PakeLagi bukan:

- marketplace besar seperti Shopee
- dashboard SaaS
- website corporate
- template Bootstrap
- landing page startup AI
- website dengan terlalu banyak gradient
- website yang seluruh elemennya berbentuk card

UI harus memberikan kesan:

> "Ini toko preloved yang dikurasi dengan serius, bukan website CRUD yang diberi Tailwind."

---

# 3. Anti AI-Slop Rules

Ini adalah aturan penting.

## Jangan membuat UI yang terasa AI-generated atau generic.

Hindari kombinasi berikut kecuali memang memiliki alasan desain:

- gradient ungu/biru generik
- background `#f8fafc` di seluruh halaman
- rounded card berlebihan
- glassmorphism tanpa alasan
- shadow besar di setiap card
- hero section dengan heading besar + subtitle + dua button + gradient blob
- terlalu banyak pill/badge
- semua elemen dibuat `rounded-xl` atau `rounded-2xl`
- icon di dalam lingkaran untuk setiap fitur
- layout dashboard SaaS
- statistik angka yang tidak memiliki nilai bagi user
- section "Why Choose Us" yang generik
- testimonial palsu
- logo cloud / trusted by / company logos palsu
- penggunaan emoji sebagai elemen UI utama
- copywriting generik seperti:
  - "Elevate Your Style"
  - "Discover Your Perfect Style"
  - "Shop Smarter"
  - "Your Fashion Journey Starts Here"
  - "Experience Fashion Like Never Before"

Gunakan bahasa yang natural dan relevan dengan produk.

---

# 4. Design Before Components

Jangan langsung membuat komponen hanya karena komponen tersebut umum digunakan.

Sebelum membuat UI, pahami:

1. Siapa user halaman tersebut?
2. Apa tujuan utama halaman?
3. Informasi apa yang paling penting?
4. Apa tindakan utama yang diharapkan?
5. Apa yang tidak perlu ditampilkan?
6. Bagaimana user berpindah ke langkah berikutnya?

Setiap elemen harus memiliki alasan.

Jika sebuah elemen tidak membantu user:

> remove it.

---

# 5. Visual Direction

PakeLagi harus memiliki visual hierarchy yang jelas.

Prioritas:

```text
1. Product photography
2. Product name
3. Price
4. Product condition / important attributes
5. Product discovery
6. CTA
7. Supporting information
```

Produk adalah fokus utama.

Jangan membuat UI yang membuat dekorasi lebih menonjol daripada foto produk.

---

# 6. Typography

Typography harus terasa seperti brand fashion modern, bukan dashboard enterprise.

Gunakan maksimal:

- 1 primary font family
- 1 optional display font jika memang dibutuhkan

Hindari menggunakan terlalu banyak font.

Hierarchy harus jelas:

```text
Display
↓
Heading
↓
Subheading
↓
Body
↓
Caption
```

Jangan menggunakan ukuran font besar hanya agar halaman terlihat "premium".

Ukuran harus mengikuti hierarchy dan content.

---

# 7. Color System

Gunakan palet warna yang konsisten dan memiliki alasan.

Jangan membuat setiap halaman memiliki warna berbeda.

Primary color harus digunakan untuk:

- CTA utama
- active state
- link penting
- interactive state

Secondary/accent color digunakan secara terbatas.

Hindari:

- rainbow gradients
- neon colors tanpa alasan
- terlalu banyak accent color
- warna berbeda untuk setiap kategori hanya demi variasi visual

Pastikan contrast accessibility tetap baik.

---

# 8. Spacing

Gunakan sistem spacing yang konsisten.

Hindari:

```text
mt-7
ml-13
px-[37px]
gap-[19px]
```

jika tidak benar-benar diperlukan.

Prioritaskan spacing scale Tailwind.

Contoh:

```text
gap-4
gap-6
gap-8
py-12
py-16
py-20
```

Whitespace adalah bagian dari desain.

Jangan memenuhi seluruh layar hanya karena ada ruang kosong.

---

# 9. Border Radius

Jangan membuat semua elemen:

```text
rounded-xl
rounded-2xl
rounded-full
```

Gunakan radius berdasarkan fungsi.

Contoh:

```text
Button       → rounded-md / rounded-lg
Input        → rounded-md / rounded-lg
Product card → rounded-lg jika sesuai desain
Badge        → rounded-full
Image        → sesuai art direction
```

Tidak semua komponen harus rounded.

---

# 10. Shadows

Shadow harus digunakan dengan hemat.

Jangan memberikan shadow kepada:

- setiap card
- setiap button
- setiap section
- navbar
- input
- badge

Jika layout dapat bekerja tanpa shadow, pertimbangkan untuk menghilangkannya.

Gunakan border dan contrast untuk separation jika lebih cocok.

---

# 11. Product Cards

Product card adalah komponen penting PakeLagi.

Product card minimal dapat menampilkan:

- foto produk
- nama produk
- harga
- kondisi
- optional category/size
- availability status jika relevan

Prioritas visual:

```text
IMAGE
  ↓
PRODUCT NAME
  ↓
PRICE
  ↓
CONDITION / METADATA
```

Jangan membuat card terlalu padat.

Foto produk harus mendapatkan area visual terbesar.

---

# 12. Product Photography

Foto produk adalah bagian utama dari brand.

Jangan:

- menggunakan placeholder generik sebagai final UI
- menggunakan random stock photo
- menggunakan gambar yang tidak relevan
- menggunakan gradient sebagai pengganti product image
- memotong foto secara agresif tanpa alasan

Jika gambar belum tersedia saat development, gunakan placeholder yang jelas dan mudah diganti.

Gunakan `next/image`.

Perhatikan:

- aspect ratio
- object positioning
- loading
- responsive sizing
- image quality

---

# 13. Homepage

Homepage tidak harus mengikuti template:

```text
Navbar
↓
Huge Hero
↓
Features
↓
Testimonials
↓
CTA
↓
Footer
```

Jangan membuat section hanya karena landing page biasanya memiliki section tersebut.

Homepage PakeLagi harus membantu user:

1. memahami apa itu PakeLagi
2. melihat produk
3. menemukan kategori
4. menemukan produk yang menarik
5. masuk ke detail produk
6. menghubungi penjual

Contoh struktur yang diperbolehkan:

```text
Navbar
↓
Intro / Hero
↓
Featured Products
↓
Categories / Discovery
↓
Recently Added
↓
About PakeLagi
↓
Footer
```

Tetapi struktur tersebut tidak wajib.

Sesuaikan dengan kebutuhan konten.

---

# 14. Product Detail Page

Product detail merupakan salah satu halaman terpenting.

Prioritas:

```text
Product Images
        +
Product Information
        +
Price
        +
Condition
        +
Size / Measurements
        +
Availability
        +
WhatsApp CTA
```

CTA utama:

> Tanya via WhatsApp

Jangan gunakan:

- Add to Cart
- Buy Now
- Checkout
- Pay Now

CTA harus menjelaskan tindakan sebenarnya.

Contoh:

```text
Tanya via WhatsApp
```

lebih baik daripada:

```text
Buy Now
```

---

# 15. WhatsApp Integration

WhatsApp adalah bagian dari business flow utama.

Ketika user menekan CTA WhatsApp, frontend dapat membuat pesan yang sudah diprefill.

Contoh:

```text
Halo PakeLagi, saya tertarik dengan produk:

Nama: Vintage Denim Jacket
Harga: Rp150.000

Apakah produknya masih tersedia?
```

Jangan membuat sistem chat internal.

Jangan membuat WhatsApp button hanya sebagai decorative button.

CTA harus benar-benar mengarah ke WhatsApp.

---

# 16. Navigation

Navbar harus sederhana.

Prioritaskan:

- Logo / brand
- Produk / katalog
- Kategori
- About
- Search jika memang dibutuhkan
- CTA WhatsApp jika relevan

Jangan membuat navbar penuh dengan:

- Dashboard
- Analytics
- Wishlist
- Cart
- Orders
- Notifications
- Messages

jika fitur tersebut belum ada.

---

# 17. Search & Filtering

Search dan filter harus membantu user menemukan produk.

Filter yang relevan dapat meliputi:

- category
- size
- condition
- price range
- availability

Jangan membuat filter hanya karena backend memiliki field tertentu.

Pertimbangkan apakah filter tersebut benar-benar berguna untuk user.

---

# 18. Responsive Design

Mobile-first.

PakeLagi kemungkinan besar akan dikunjungi melalui smartphone.

Setiap halaman wajib diuji minimal pada:

```text
Mobile
Tablet
Desktop
```

Jangan hanya mengecilkan desktop layout.

Responsive layout harus benar-benar didesain.

Contoh:

Desktop:

```text
[ Product ] [ Product ] [ Product ] [ Product ]
```

Mobile:

```text
[ Product ] [ Product ]
[ Product ] [ Product ]
```

atau single-column jika desain lebih cocok.

---

# 19. Interaction Design

UI harus terasa hidup tetapi tidak berlebihan.

Gunakan motion untuk:

- hover
- page transition jika diperlukan
- image interaction
- feedback
- loading state
- modal/drawer
- navigation

Hindari:

- animasi pada setiap element
- excessive parallax
- infinite bouncing
- unnecessary spinning
- animation hanya untuk terlihat keren

Motion harus memberikan feedback atau membantu memahami interface.

---

# 20. Hover States

Interactive element harus memiliki state yang jelas:

```text
Default
Hover
Focus
Active
Disabled
Loading
```

Jangan hanya mengandalkan perubahan warna.

Untuk product card, contoh interaction yang diperbolehkan:

- image zoom ringan
- image swap
- subtle elevation
- text color change
- arrow/icon movement

Jangan menggunakan transform berlebihan.

---

# 21. Loading State

Jangan membuat halaman terlihat kosong ketika API sedang loading.

Gunakan:

- skeleton
- loading indicator
- progressive rendering

Skeleton harus menyerupai bentuk konten sebenarnya.

Jangan menggunakan spinner besar di tengah halaman untuk setiap request kecil.

---

# 22. Empty State

Empty state harus informatif.

Contoh:

```text
Belum ada produk di kategori ini.

Coba lihat kategori lainnya.
```

Jangan:

```text
No Data Found
```

tanpa konteks.

Jika memungkinkan, berikan tindakan berikutnya.

---

# 23. Error State

Error harus membantu user.

Jangan hanya:

```text
Something went wrong.
```

Gunakan pesan yang manusiawi:

```text
Produk belum bisa dimuat.

Coba lagi beberapa saat lagi.
```

Jika aman dilakukan, berikan:

```text
Coba lagi
```

---

# 24. Accessibility

Accessibility bukan fitur tambahan.

Wajib memperhatikan:

- semantic HTML
- keyboard navigation
- focus state
- alt text
- color contrast
- button vs link semantics
- form labels
- aria attributes jika diperlukan

Jangan menggunakan `<div>` sebagai button.

Jangan menggunakan icon-only button tanpa accessible label.

---

# 25. SEO

Karena PakeLagi adalah website publik, SEO penting.

Gunakan Next.js metadata untuk:

- title
- description
- Open Graph
- Twitter/X metadata jika relevan

Product detail page harus memiliki metadata yang relevan dengan produk.

Jangan menggunakan title yang sama untuk semua halaman.

Contoh:

```text
PakeLagi — Preloved Fashion Pilihan
```

dan:

```text
Vintage Denim Jacket — PakeLagi
```

---

# 26. Next.js Architecture

Gunakan App Router.

Prioritaskan Server Components secara default.

Gunakan Client Components hanya ketika membutuhkan:

- browser APIs
- state interaktif
- event handlers
- hooks tertentu
- client-side libraries

Jangan menambahkan:

```tsx
"use client";
```

ke setiap component.

Jika sebuah component tidak membutuhkan client-side behavior, biarkan menjadi Server Component.

---

# 27. API Communication

Backend Laravel adalah source of truth untuk:

- product
- category
- authentication
- product status
- product images
- product metadata

Frontend tidak boleh menduplikasi business logic yang seharusnya berada di backend.

Frontend bertanggung jawab terhadap:

- presentation
- interaction
- client validation
- UX

Backend bertanggung jawab terhadap:

- authorization
- business rules
- database
- data integrity
- server validation

---

# 28. Environment Variables

Jangan hardcode URL API.

Gunakan:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

Production:

```env
NEXT_PUBLIC_API_URL=https://api.pakelagi.com/api/v1
```

Jangan commit secret ke repository.

Jangan menaruh:

- API secret
- private key
- database credential
- token
- password

di frontend.

Ingat:

> Semua `NEXT_PUBLIC_*` variable dianggap dapat dilihat oleh browser.

---

# 29. Component Architecture

Buat component berdasarkan kebutuhan nyata.

Contoh:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   └── category/
├── lib/
├── services/
├── types/
└── hooks/
```

Jangan membuat 50 component abstrak hanya untuk terlihat "clean architecture".

Abstraksi harus dibuat ketika:

- digunakan kembali
- memiliki tanggung jawab jelas
- mengurangi duplikasi
- meningkatkan readability

---

# 30. Naming

Gunakan nama yang menjelaskan fungsi.

Bagus:

```text
ProductCard
ProductGallery
ProductPrice
WhatsAppButton
ProductFilters
EmptyProductState
```

Hindari:

```text
Box1
Card2
ComponentA
FancySection
ModernCard
Thing
```

---

# 31. Data Fetching

Jangan fetch API secara acak di berbagai component.

Pisahkan API logic dari UI jika kompleksitas mulai meningkat.

Contoh:

```text
services/
└── product-service.ts
```

Kemudian UI menggunakan fungsi yang jelas:

```ts
getProducts()
getProductBySlug()
getCategories()
```

Jangan menulis URL API berulang kali di component.

---

# 32. TypeScript

TypeScript wajib digunakan dengan benar.

Hindari:

```ts
any
```

kecuali ada alasan yang benar-benar kuat.

Buat type/interface untuk API response.

Contoh:

```ts
type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  condition: string;
};
```

Type harus merepresentasikan data sebenarnya dari Laravel API.

---

# 33. Security

Frontend bukan security boundary.

Jangan mengandalkan:

```text
hidden button
```

untuk mengamankan fitur admin.

Authorization harus dilakukan Laravel.

Frontend hanya mengontrol visibility/UX.

Jangan menyimpan sensitive credential di localStorage tanpa alasan yang kuat.

---

# 34. Admin UI

Admin interface boleh menggunakan pola dashboard karena memang konteksnya berbeda.

Namun admin UI tetap harus:

- sederhana
- jelas
- functional
- mudah digunakan

Admin tidak membutuhkan dekorasi berlebihan.

Prioritaskan:

```text
Data
Actions
Status
Feedback
```

---

# 35. Forms

Form harus memiliki:

- label
- validation
- error message
- loading state
- success feedback
- disabled state ketika submit

Jangan hanya mengandalkan placeholder sebagai label.

Contoh buruk:

```text
[ Enter product name... ]
```

Contoh lebih baik:

```text
Nama Produk
[ Vintage Denim Jacket ]
```

---

# 36. Confirmation & Destructive Actions

Untuk tindakan seperti:

- delete product
- delete category
- delete image

gunakan confirmation.

Jelaskan tindakan yang akan terjadi.

Jangan membuat destructive action mudah terpencet secara tidak sengaja.

---

# 37. Content Rules

Gunakan bahasa Indonesia sebagai bahasa utama interface kecuali ada kebutuhan khusus.

Gunakan wording yang:

- singkat
- natural
- jelas
- tidak terlalu formal
- tidak terasa seperti hasil terjemahan mesin

Contoh:

```text
Tambah Produk
Ubah Produk
Hapus Produk
Tandai Terjual
Tanya via WhatsApp
Lihat Produk
Cari produk...
```

Lebih baik daripada wording yang terlalu formal atau marketing-heavy.

---

# 38. Fake Data Policy

Jangan membuat data palsu yang terlihat seperti data production dan lupa menghapusnya.

Jika membutuhkan mock data:

- beri nama yang jelas
- simpan terpisah
- tandai sebagai mock
- jangan gunakan testimonial palsu
- jangan gunakan angka penjualan palsu
- jangan membuat social proof palsu

---

# 39. Do Not Overengineer

PakeLagi adalah portfolio project.

Jangan menambahkan teknologi hanya untuk terlihat kompleks.

Jangan menambahkan:

- microservices
- GraphQL
- WebSocket
- Redux
- Kubernetes
- complex state machines

jika kebutuhan produk belum memerlukannya.

Prefer:

> simple architecture that solves the actual problem.

---

# 40. Dependencies

Sebelum menambahkan dependency baru, tanyakan:

1. Apakah Next.js/React/Tailwind sudah bisa menyelesaikan kebutuhan ini?
2. Apakah library ini benar-benar diperlukan?
3. Apakah library ini maintained?
4. Apakah dependency tersebut menambah complexity?
5. Apakah manfaatnya lebih besar daripada maintenance cost?

Jangan install library hanya karena populer.

---

# 41. Performance

Perhatikan:

- image optimization
- unnecessary client components
- unnecessary JavaScript
- bundle size
- API request duplication
- loading performance
- layout shift

Gunakan:

```tsx
next/image
```

untuk product images.

Gunakan lazy loading jika relevan.

Jangan mengorbankan UX hanya demi performance metrics.

---

# 42. Design Consistency

Sebelum membuat komponen baru, cek apakah komponen serupa sudah ada.

Jangan membuat:

```text
ProductCard
ProductCardNew
ProductCardV2
ProductCardModern
ProductCardAlternative
```

Jika terdapat variasi, pertimbangkan:

```tsx
<ProductCard variant="featured" />
```

tetapi hanya jika variasinya memang memiliki alasan.

---

# 43. Avoid Premature Abstraction

Jangan melakukan abstraction sebelum pola penggunaannya jelas.

Lebih baik:

```text
buat → gunakan → lihat pola → abstraksikan
```

daripada:

```text
buat abstraction kompleks → belum tentu dipakai
```

---

# 44. Before Implementing a Page

Sebelum membuat halaman baru, AI harus memahami:

### User

Siapa yang menggunakan halaman?

### Goal

Apa tujuan utama halaman?

### Content

Informasi apa yang diperlukan?

### Action

Apa tindakan utama?

### State

Bagaimana tampilan:

- loading
- success
- empty
- error
- disabled

### Responsive

Bagaimana layout pada:

- mobile
- tablet
- desktop

---

# 45. Before Writing UI Code

AI wajib:

1. Memeriksa component yang sudah ada.
2. Memeriksa design system yang sudah digunakan.
3. Memeriksa API/type yang tersedia.
4. Memastikan halaman tersebut memang dibutuhkan.
5. Menghindari membuat komponen duplikat.
6. Memastikan UI sesuai business flow PakeLagi.

Jangan langsung menghasilkan kode hanya berdasarkan asumsi.

---

# 46. AI Design Decision Rules

Ketika diminta membuat UI, jangan otomatis memilih design yang paling umum ditemukan pada website AI-generated.

Jangan berpikir:

> "Modern website = gradient + huge heading + cards + rounded corners."

Sebaliknya:

> "Apa visual language yang paling cocok untuk brand preloved fashion PakeLagi?"

Prioritaskan:

```text
Brand
↓
Product
↓
Content
↓
Usability
↓
Accessibility
↓
Aesthetics
```

Bukan:

```text
Aesthetics
↓
Trend
↓
Animation
↓
Everything else
```

---

# 47. If Design Reference Is Provided

Jika user memberikan:

- screenshot
- Figma
- image reference
- website reference
- design specification

ikuti reference tersebut sebagai sumber utama.

Jangan mengganti desain hanya karena AI menganggap desain lain lebih modern.

Jika ingin mengusulkan perubahan besar, jelaskan alasannya terlebih dahulu.

---

# 48. If Requirements Are Ambiguous

Jangan mengarang fitur.

Jika ambiguity tidak menghalangi implementasi, gunakan solusi paling sederhana yang sesuai dengan product direction.

Jika ambiguity berpengaruh terhadap:

- business flow
- database
- authentication
- security
- architecture

tanyakan terlebih dahulu.

---

# 49. Definition of Done

Sebuah halaman belum dianggap selesai hanya karena:

```text
npm run build
```

berhasil.

Minimal harus diperiksa:

- visual hierarchy
- responsive layout
- loading state
- empty state
- error state
- hover state
- focus state
- accessibility
- API integration
- error handling
- SEO metadata jika halaman publik
- mobile layout
- desktop layout

---

# 50. Final Rule

Setiap keputusan frontend harus menjawab pertanyaan:

> "Apakah ini membuat PakeLagi lebih mudah digunakan, lebih jelas, atau lebih menarik secara intentional?"

Jika jawabannya tidak:

**jangan tambahkan.**

PakeLagi tidak membutuhkan lebih banyak UI.

PakeLagi membutuhkan **UI yang tepat.**