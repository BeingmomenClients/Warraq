# اسم المشروع + برومبت صورة البورتفوليو

> ملف يجمع طلبين: (1) اقتراح اسم أنسب للمشروع بدل "المكتبة / Book"، و(2) برومبت جاهز لـ Gemini (Nano Banana) لتوليد صورة تعبّر عن فكرة المشروع لوضعها في البورتفوليو.

---

## 🧭 ما هو هذا المشروع فعلاً؟ (ملخص لتأسيس الاسم والصورة)

بعد فحص الـ models والكود، اتضح أن المشروع **ليس متجر كتب (Bookshop)** بل **نظام إدارة توزيع كتب بالجملة + محاسبة (Book Distribution / Wholesale ERP)**:

- **المكتبات (Bookstores):** العملاء، لكل مكتبة رصيد (balance) وعدد كتب وديون مستحقة.
- **المندوبون (Representatives):** يوزّعون الكتب على المكتبات ولهم أرصدة وتحصيلات.
- **فواتير البيع (Purchase Invoices):** بأرقام تسلسلية، نقدي/آجل، مدفوع/متبقٍّ.
- **التحصيل (Collections):** من المكتبات ومن المندوبين.
- **متابعة مالية:** أرصدة، ديون، إجمالي مبيعات مستحقة، عدّادات.
- **أدوار:** admin، dev، representative، user.

الخلاصة: المنتج هو **نظام تشغيل وتوزيع ومحاسبة للكتب**، وهذا ما يجب أن يعكسه الاسم والصورة — لا واجهة متجر إلكتروني.

---

## 1) اقتراح الاسم

### ✅ الاسم الموصى به: **Warraq — ورّاق**

- **لماذا:** "الورّاق" لقب تاريخي عربي أصيل لمن يحترف نسخ الكتب وبيعها وتوزيعها — أي **تاجر/موزّع الكتب** بالضبط. يحمل عمقاً ثقافياً، فريد، سهل النطق، ويصلح كاسم منتج/برَند احترافي في البورتفوليو.
- **الصياغة المقترحة:** `Warraq` (لاتيني) / `ورّاق` (عربي).
- **سطر تعريفي (tagline):** "نظام إدارة توزيع الكتب والمكتبات" — *Book Distribution & Bookstore Management System*.

### بدائل قوية (إن لم يعجبك "ورّاق")

| الاسم | بالعربي | الفكرة | يناسب لو |
|------|---------|--------|----------|
| **Rufoof** | رفوف | "الرفوف" — استعارة للمخزون والتنظيم | تريد اسماً بصرياً يوحي بالكتب فوراً |
| **Tawzee** | توزيع | يصرّح بوظيفة النظام مباشرة (توزيع) | تفضّل الوضوح الوظيفي على الرمزية |
| **Kotobi / Kutubi** | كُتُبي | "بائع/تاجر الكتب" | تريد اسماً ودوداً قصيراً |
| **BookFlow** | بوك فلو | يوحي بتدفّق الكتب من المورد للمكتبة | جمهور البورتفوليو إنجليزي تقني |
| **Daftar** | دفتر | يوحي بالجانب المحاسبي/الدفاتر | تريد إبراز المحاسبة والأرصدة |

> توصية عملية: استخدم **Warraq / ورّاق** كاسم البرَند، مع السطر التعريفي بالأسفل ليفهم الزائر الوظيفة فوراً.

---

## 2) برومبت صورة البورتفوليو (لـ Gemini / Nano Banana)

استخدم الإنجليزية فهي الأفضل لنماذج توليد الصور. بالأسفل نسختان — اختر واحدة (الأولى موصى بها لبطاقة بورتفوليو نظيفة).

### 🎨 النسخة A — مشهد تصويري (Isometric Illustration) — موصى بها

```text
A clean, modern isometric 3D illustration representing a "book distribution and
bookstore management system" called Warraq. Center: a stylized open dashboard/control
panel floating above a desk, showing simplified analytics — bar charts, a balance/debt
gauge, and an invoice card with a serial number. Around it, connected by thin glowing
lines (a distribution network): a small warehouse with stacked book crates on shelves,
a delivery representative figure carrying books, and two small bookstore storefronts.
Floating book icons and coin/payment icons travel along the connecting lines to show
the flow from warehouse → representative → bookstores. Soft, professional color palette:
deep indigo and teal with warm amber accents (books/paper tones). Subtle long shadows,
soft studio lighting, light neutral background with a faint grid. Flat-but-dimensional
vector style, high detail, no text labels, no watermark, balanced composition with
generous negative space. Portfolio hero image, 16:9.
```

### 🖥️ النسخة B — موك-أب واجهة (App UI Mockup) — لو تفضّل إظهار المنتج نفسه

```text
A polished portfolio mockup of a SaaS web admin dashboard for a book-distribution and
wholesale management system named "Warraq". Show a laptop and a smartphone, both
displaying a clean RTL Arabic-friendly dashboard UI: a left sidebar with navigation
icons (books, bookstores, representatives, invoices, collections), KPI stat cards
(total sales, outstanding balances, books in stock, active representatives), a sales
line chart, and a data table of invoices with paid/unpaid status badges. Modern flat
design, rounded cards, soft shadows, indigo–teal accent color with amber highlights.
Neutral studio background, soft top lighting, slight perspective. Crisp, high
resolution, realistic device frames, no real text needed (use placeholder bars and
simple icons). Professional product-shot composition, 16:9.
```

### ⚙️ ملاحظات استخدام البرومبت

- **النِّسب:** للبورتفوليو استخدم `16:9` (بطاقة/هيرو) أو `1:1` (شبكة المشاريع). أضف الطلب في نهاية البرومبت أو من إعدادات الأداة.
- **الألوان:** لو لديك ألوان هوية محددة، استبدل `deep indigo and teal with warm amber` بألوانك.
- **النص داخل الصورة:** تركتُه `no text` لأن نماذج الصور تُخطئ في الحروف العربية غالباً. لو أردت كلمة "Warraq / ورّاق" مكتوبة، أضِفها يدوياً لاحقاً في Figma/Canva لضمان الإملاء.
- **تكرار/تحسين:** إن خرجت الصورة مزدحمة، أضِف `minimalist, fewer elements, more negative space`. وإن أردت طابعاً أدفأ، أضِف `paper texture, warm vintage book tones`.
```

