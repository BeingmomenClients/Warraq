# Warraq / ورّاق — Book Distribution & Bookstore Management System

> نظام إدارة توزيع الكتب بالجملة + المحاسبة (ERP) — ليس متجراً إلكترونياً، بل أداة تشغيل كاملة للموزِّع والمندوب والمالك.

---

## 🏷️ الاسم والسطر التعريفي (Tagline)

- **Brand:** `Warraq` / `ورّاق`
- **Tagline (AR):** نظام إدارة توزيع الكتب والمكتبات
- **Tagline (EN):** Book Distribution & Bookstore Management System
- **One-liner (EN):** The back-office that runs a book wholesaler — from warehouse shelf to bookstore ledger.
- **One-liner (AR):** المكتب الخلفي الذي يدير موزِّع كتب — من رفّ المستودع إلى دفتر المكتبة.

### لماذا "ورّاق"؟
لقب تاريخي عربي أصيل لمن يحترف نسخ الكتب وبيعها وتوزيعها — أي تاجر/موزِّع الكتب بالضبط. اسم قصير، سهل النطق، يحمل عمقاً ثقافياً، ويصلح كهوية منتج احترافية.

---

## 🎯 ما المشكلة التي يحلّها؟

موزِّعو الكتب بالجملة يواجهون فوضى تشغيلية حقيقية:

- **من أخذ كم كتاب؟ ومتى؟** → فواتير ضائعة، إيصالات ورقية، خلافات مع المكتبات.
- **من دفع ومن لم يدفع؟** → ديون متراكمة، لا يوجد متابعة موحَّدة للتحصيل.
- **كم رصيد كل مكتبة؟** → لا توجد لوحة واحدة تبيّن المديونيات والمستحقات.
- **كم باع كل مندوب؟** → لا توجد KPIs واضحة للمبيعات والتوزيع.

**ورّاق** يحلّ هذا عبر نظام موحَّد يربط الفواتير، التحصيلات، الأرصدة، والديون في مكان واحد — مع صلاحيات لكل دور.

---

## 👥 الأدوار (User Roles)

| الدور | الوصف | الصلاحيات الأساسية |
|------|------|-----------------|
| **Admin** | مالك/مدير النظام | إدارة كاملة: مكتبات، مندوبين، كتب، فواتير، تحصيلات، مستخدمين |
| **Dev** | مطوِّر/مدير تقني | وصول كامل + وصول لإعدادات النظام |
| **Representative** (مندوب) | موزِّع ميداني | إدارة فواتير المكتبات المخصصة له، تحصيلات من المكتبات، عرض الكتب |
| **User** | مستخدم قراءة | عرض البيانات والتقارير (وصول محدود) |

---

## 🧱 الوحدات الأساسية (Core Modules)

### 1. 📚 Books (الكتب)
كتالوج الكتب: العنوان، ISBN، المؤلف، سعر الوحدة، الكمية في المخزون.
- عرض/إضافة/تعديل/حذف الكتب.
- البحث والفلترة.

### 2. 🏪 Bookstores (المكتبات)
العملاء (المكتبات) التي يوزِّع عليها المندوب الكتب. لكل مكتبة:
- بيانات تعريفية (اسم، عنوان، هاتف).
- **رصيد حساب** (Account Balance) — إجمالي المستحق.
- **عدد الكتب** الإجمالي المشتراة.
- **الديون المستحقة** + تاريخ آخر دفعة.
- فواتير مرتبطة + تحصيلات.

### 3. 🚚 Representatives (المندوبون)
الموزعون الميدانيون. لكل مندوب:
- منطقة التوزيع.
- **رصيد تحصيل** — مبالغ تحصّلها ولم يُسجَّل دفعها.
- **عدد المكتبات** المخصصة له.
- فواتير أنشأها + تحصيلات سجّلها.

### 4. 🧾 Purchase Invoices (فواتير البيع)
فواتير بيع بأرقام تسلسلية، تُنشأ من المندوب أو الإدارة:
- **النوع:** نقدي (Cash) / آجل (Credit).
- **الحالة:** مدفوع بالكامل / متبقٍّ (مع مبلغ متبقٍّ).
- **العناصر:** كتب + كميات + أسعار + إجمالي.
- ربط بـ: المكتبة + المندوب (الذي أنشأ الفاتورة).
- **عرض/تعديل/حذف** حسب الدور.

### 5. 💰 Collections (التحصيلات)
- تحصيل مبلغ من **مكتبة** (يخصم من رصيد المكتبة).
- تحصيل مبلغ من **مندوب** (يخصم من رصيد المندوب).
- كل تحصيل مرتبط بفاتورة أو كدفعة عامة، ويُسجَّل التاريخ والمبلغ والملاحظات.

### 6. 📊 Dashboard & KPIs (لوحة المعلومات)
صفحة رئيسية ديناميكية تتغير حسب دور المستخدم:
- **للمسؤول/المطوِّر:** إجمالي المبيعات، أرصدة المكتبات، الديون، أداء المندوبين، أحدث الفواتير.
- **للمندوب:** مكتباته، تحصيلاته، فواتيره، أهدافه.

### 7. 👤 Profile (الملف الشخصي)
إدارة بيانات المستخدم، الصورة، كلمة المرور.

---

## ✨ المميزات الجوهرية (Highlights)

- 🌐 **واجهة عربية كاملة (RTL)** — صُمِّمت أصالةً للعالم العربي.
- 🎨 **Dark Mode** — تبديل سلس بين الفاتح والداكن.
- 🌍 **i18n** — دعم العربية والإنجليزية قابل للتوسعة.
- 🔐 **JWT Authentication** — عبر `@sidebase/nuxt-auth`.
- 🧭 **Onboarding Tour** — جولة تعريفية تفاعلية عبر `driver.js` للمستخدمين الجدد (لكل دور).
- 🛡️ **Role-based Authorization** — حماية المسارات والـ API حسب الدور.
- 🖼️ **رفع الصور** — صور المستخدمين وغلاف الكتب.
- 🧪 **Demo Mode** — وضع تجريبي يعمل بدون Backend حقيقي (لـ portfolio/معاينة).
- 📱 **Responsive** — يعمل على الجوال والتابلت وسطح المكتب.
- ⚡ **Nuxt 3 + SSR** — أداء عالٍ وSEO-friendly.

---

## 🏗️ المعمارية (Tech Stack)

### Client (الواجهة) — `client/`
- **Nuxt 3** (Vue 3) — مع SSR/SSG.
- **TypeScript** + ESLint.
- **Pinia** — لإدارة الحالة.
- **@nuxt/ui** + **PrimeVue** — مكتبة UI.
- **@nuxtjs/i18n** — تعدد اللغات.
- **@vueuse/nuxt** — composables جاهزة.
- **driver.js** — جولات تعريفية.
- **v-calendar** + **@primevue/nuxt-module** — التقويم والمكونات.
- **Tailwind CSS / SCSS** — للتنسيق.
- **Joi** — للتحقق من النماذج.

### Server (الواجهة الخلفية) — `server/`
- **Node.js + Express** — REST API.
- **MongoDB + Mongoose** — قاعدة البيانات.
- **JWT** (jsonwebtoken) — للمصادقة.
- **bcryptjs** — لتشفير كلمات المرور.
- **helmet + hpp + cors + express-rate-limit + express-mongo-sanitize + xss-clean** — طبقات الأمان.
- **multer + sharp** — رفع ومعالجة الصور.
- **nodemailer** — إرسال البريد (نسيت كلمة المرور).
- **pug** — قوالب البريد.
- **slugify** — Slugs للـ URLs.
- **compression + morgan** — أداء وسجلات.
- **dotenv** — متغيرات البيئة.
- **ESLint (airbnb)** — جودة الكود.

### Infra / DevOps
- **pnpm workspaces** — monorepo.
- **Dockerfiles** — للـ client والـ server.
- **Nixpacks** سابقاً → Dockerfiles حالياً.
- **PM2** — `ecosystem.config.cjs` للنشر.

---

## 🚀 تشغيل المشروع (Getting Started)

```bash
# 1) ثبّت الاعتماديات
pnpm install

# 2) جهّز متغيرات البيئة
cp client/.env.example client/.env
cp server/.env.example server/.env

# 3) شغّل في وضع التطوير (الواجهة + الخادم معاً)
pnpm dev
```

- الواجهة: `http://localhost:1909`
- الخادم: `http://localhost:6431/api/v1`

> راجع [DEPLOY_TIMELINE.md](DEPLOY_TIMELINE.md) لتفاصيل النشر.

---

## 📦 Demo Mode (وضع العرض)

النظام يدعم **وضع العرض التوضيحي** ليعمل بدون backend — مناسب لـ:
- صفحة الـ portfolio (معاينة تفاعلية للزوار).
- عروض تقديمية للعملاء.
- اختبار الواجهة بسرعة.

راجع [PORTFOLIO_DEMO_MODE_GUIDE.md](PORTFOLIO_DEMO_MODE_GUIDE.md) للتفاصيل الكاملة.

---

## 📂 بنية المشروع (Project Structure)

```
Book_Shop/
├── client/                 # Nuxt 3 + Vue 3 (Frontend)
│   ├── assets/             # SCSS, صور
│   ├── components/         # TheBase, TheDashboard, TheStats, TheWrap, ...
│   │   ├── TheBase/
│   │   ├── TheDashboard/   # Sidebar, Navbar, AuthModules
│   │   ├── TheDemoMode/    # Demo help, credentials cards
│   │   ├── TheStats/       # Admin/Representative stats
│   │   └── TheWrap/        # Form atoms (Input, Select, Quill, ...)
│   ├── composables/        # useActionRequest, useTableModule, useFormModule, ...
│   ├── i18n/               # ملفات الترجمة
│   ├── layouts/            # auth, dashboard, default
│   ├── locales/            # ar.json, en.json
│   ├── middleware/         # auth guard
│   ├── pages/              # admins, all-books, books, bookstore, ...
│   ├── plugins/            # Nuxt plugins
│   ├── public/             # شعار، ملفات ثابتة
│   ├── stores/             # Pinia stores
│   ├── app.config.ts
│   ├── app.vue
│   ├── nuxt.config.ts
│   ├── package.json
│   └── Dockerfile
├── server/                 # Express + MongoDB (Backend)
│   ├── config.env
│   ├── controllers/        # منطق endpoints
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST routes
│   ├── utils/              # helpers
│   ├── views/              # قوالب pug للبريد
│   ├── images/             # صور مرفوعة
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── pnpm-workspace.yaml
├── package.json            # root
├── DEPLOY_TIMELINE.md
├── PORTFOLIO_DEMO_MODE_GUIDE.md
└── PROJECT_NAME_AND_IMAGE_PROMPT.md
```

---

## 🎓 ما يميّزه كـ Portfolio Project

1. **مشكلة حقيقية في سوق حقيقي** — ليس TODO app، بل نظام تشغيل لمجال محدد (توزيع الكتب).
2. **Full-stack متكامل** — Frontend (Nuxt) + Backend (Express) + Database (Mongo).
3. **هوية عربية أصيلة** — اسم "ورّاق"، واجهة RTL، مصطلحات المجال بالعربية.
4. **ميزات متقدمة فعلاً** — i18n، Dark mode، Onboarding tour لكل دور، Role-based auth، رفع صور، JWT، Demo mode.
5. **DevOps** — Docker، PM2، pnpm workspaces، نشر موثَّق.
6. **جودة الكود** — ESLint (airbnb للـ backend)، TypeScript للـ frontend، فصل واضح للمسؤوليات.

---

## 📜 الترخيص

ISC (انظر [server/package.json](server/package.json)).
