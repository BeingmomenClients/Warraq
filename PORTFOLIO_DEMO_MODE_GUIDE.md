# 🎭 دليل تطبيق Portfolio Demo Mode

> **الغرض من هذا الملف:** مواصفات تفصيلية لإضافة "وضع العرض التجريبي" لأي مشروع ضمن البورتفوليو، بحيث يستطيع الزوار (recruiters، عملاء، مشاهدو الـ CV) تجربة النظام بسهولة من خلال:
> 1. بيانات تجريبية واقعية مُعبّأة مسبقاً
> 2. بطاقات تسجيل دخول سريع للأدوار المختلفة
> 3. جولة تفاعلية تشرح النظام
> 4. زر مساعدة عائم دائم مع كل المعلومات

عند البدء في مشروع جديد، اعطِ Claude هذا الملف وقل: **"طبّق Portfolio Demo Mode على هذا المشروع حسب الدليل المرفق"**.

---

## ⚙️ خطوات Claude المطلوبة قبل البدء

قبل تنفيذ أي شيء، اسأل المستخدم الأسئلة التالية بـ `AskUserQuestion`:

### السؤال 1: حجم البيانات
- بيانات بسيطة (3-5 لكل نوع، عرض سريع)
- بيانات واقعية متوسطة (10-50 لكل نوع، **افتراضي للبورتفوليو**)
- بيانات كثيفة (100+ لإظهار قدرة pagination)

### السؤال 2: أسلوب الدليل
- جولة تفاعلية فقط (Driver.js)
- زر مساعدة عائم فقط
- **الاثنين معاً (مدمج)** ← الموصى به

### السؤال 3: عرض بيانات الدخول
- **بطاقات في صفحة Login مع نقرة لملء البيانات** ← الموصى به
- Banner بسيط
- Modal ترحيبي

### السؤال 4: اللغة
- عربي فقط
- ثنائي اللغة (يعتمد على نظام i18n الموجود)
- إنجليزي فقط

### السؤال 5: الحماية من العبث
- **لا حاجة الآن** (الافتراضي - أبسط)
- زر "Reset Demo Data" داخل النظام
- Cron job دوري
- الاثنين معاً

### السؤال 6: محتوى الجولة
- ملاحة + وظائف الأقسام
- **جولات مختلفة حسب الدور** ← الأفضل للبورتفوليو الفني
- جولة موحدة + شرح المنطق التجاري

### السؤال 7: الإيميلات الفعلية
- إبقاؤها تعمل (يفترض وجود SMTP configured)
- تعطيلها في Demo Mode وإظهار toast وهمي

### السؤال 8: المستخدمين الموجودين
- مسح كل شيء وإعادة التعبئة (أنظف)
- **إبقاء الموجود وإضافة الجديد فقط** ← الأكثر أماناً

---

## 📋 المراحل الأربع للتنفيذ

```
المرحلة 1: Seeding البيانات
المرحلة 2: بطاقات Quick Login في صفحة Login
المرحلة 3: جولة تفاعلية بـ Driver.js
المرحلة 4: زر مساعدة عائم دائم
```

---

## 🌱 المرحلة 1: Seed Demo Data

### الهدف
ملء قاعدة البيانات بكميات واقعية من البيانات الوهمية بأسماء/تفاصيل عربية مقنعة.

### الخطوات

#### 1.1 افحص النماذج (Models) أولاً
- اقرأ كل الـ models في المشروع لفهم العلاقات والمتطلبات
- لاحظ: الحقول المطلوبة (required)، القيود الفريدة (unique)، العلاقات (refs)
- لاحظ: pre-save hooks، slugify، password hashing
- لاحظ: counters للأرقام التسلسلية (invoices مثلاً)

#### 1.2 أنشئ السكريبت في مجلد utils
المسار المعتاد: `server/utils/seedDemoData.js` أو ما يقابله في الـ stack الحالي.

#### 1.3 هيكل السكريبت

```javascript
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
// ... استورد كل الـ models

const DEMO_PASSWORD = 'Demo@1234'; // ثابت لكل الحسابات

// مولّدات عشوائية مساعدة
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[randInt(0, arr.length - 1)];
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// مجموعات البيانات العربية الواقعية
const arabicFirstNames = ['أحمد', 'محمد', 'فاطمة', /* ... */];
const arabicLastNames = ['الشاطوري', 'المصري', /* ... */];
const egyptCities = ['القاهرة', 'الإسكندرية', /* ... */];
// مولّدات حسب نوع الكيان (كتب، منتجات، مكتبات، ...)
```

#### 1.4 قاعدة "أبقِ الموجود وأضف الجديد"

```javascript
const seedUsers = async () => {
  const targetUsers = [
    { email: 'admin@demo.com', role: 'admin', /* ... */ },
    // ... باقي الحسابات
  ];

  const emails = targetUsers.map(u => u.email);
  const existing = await User.find({ email: { $in: emails } });
  const existingEmails = new Set(existing.map(u => u.email));
  const newUsers = targetUsers.filter(u => !existingEmails.has(u.email));

  for (const user of newUsers) {
    await User.create(user); // .create() لتفعيل pre-save hooks (password hash)
  }
};
```

#### 1.5 الحسابات الأساسية (Primary Demo Accounts)

دائماً أنشئ حساباً أساسياً بإيميل واضح لكل دور موجود في النظام:

```
admin@demo.com    / Demo@1234   (admin)
dev@demo.com      / Demo@1234   (dev)
rep@demo.com      / Demo@1234   (representative أو ما يقابله)
user@demo.com     / Demo@1234   (user عادي)
manager@demo.com  / Demo@1234   (إن كان فيه دور manager)
hr@demo.com       / Demo@1234   (إن كان فيه دور HR)
```

ثم أضف 2-10 حسابات إضافية لكل دور بأسماء عربية واقعية.

#### 1.6 الكيانات التشغيلية - حافظ على الاتساق

عند إنشاء فواتير/مبيعات/معاملات، **حدّث الإجماليات المرتبطة** يدوياً:

```javascript
// مثال: عند إنشاء فاتورة، يجب تحديث:
// - رصيد المكتبة (balance)
// - عدد الكتب لديها (booksCount)
// - أرصدة المندوب
// - المبيعات الإجمالية

const bookstoreUpdates = new Map();
for (const invoice of invoices) {
  const key = String(invoice.bookstoreId);
  const u = bookstoreUpdates.get(key) || { balance: 0, booksCount: 0 };
  u.balance -= invoice.remainingAmount;
  u.booksCount += invoice.orderBooksCount;
  bookstoreUpdates.set(key, u);
}

for (const [id, update] of bookstoreUpdates) {
  await Bookstore.findByIdAndUpdate(id, { $inc: update });
}
```

#### 1.7 Counters

لو فيه counter للأرقام التسلسلية (مثل serialNumber للفواتير):
```javascript
const maxSerial = (await Invoice.findOne().sort({ serialNumber: -1 })) || { serialNumber: 0 };
let serial = maxSerial.serialNumber;
// ... استخدم serial++ في كل فاتورة جديدة
await Counter.findOneAndUpdate(
  { name: 'invoiceSerial' },
  { value: serial },
  { upsert: true }
);
```

#### 1.8 أضف ملخص في النهاية

```javascript
console.log('📊 SUMMARY');
console.log(`Users: ${await User.countDocuments()}`);
// ... باقي الإحصائيات
console.log('\n🔐 Demo Credentials:');
console.log(`   admin@demo.com / ${DEMO_PASSWORD}`);
// ...
```

#### 1.9 شغّل السكريبت

```bash
cd server && node utils/seedDemoData.js
```

> ⚠️ **تنبيه**: لو الـ DATABASE_URL في الـ env file، استخدم `dotenv` مع المسار الصحيح. تحقّق من الاتصال قبل عمليات الكتابة.

---

## 🎴 المرحلة 2: بطاقات Quick Login

### الهدف
تحت نموذج الدخول، عرض بطاقات لكل دور. النقر يملأ الحقول ويسجّل دخول تلقائي.

### الخطوات

#### 2.1 أنشئ المكوّن
المسار: `client/components/TheDemoMode/DemoCredentialsCards.vue`

#### 2.2 هيكل المكوّن

```vue
<template>
  <div class="demo-credentials-cards">
    <!-- Divider بنص "أو جرّب حساباً تجريبياً" -->
    <div class="flex items-center gap-3 my-5">
      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      <span class="text-xs text-gray-500 font-semibold">
        أو جرّب حساباً تجريبياً
      </span>
      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>

    <!-- بطاقات الأدوار -->
    <div class="grid grid-cols-1 gap-2.5">
      <button
        v-for="account in accounts"
        :key="account.email"
        type="button"
        :disabled="loading"
        class="demo-card flex items-center gap-3 p-3 rounded-lg border ..."
        @click="$emit('select', { email: account.email, password: account.password })"
      >
        <!-- أيقونة + لون مميز لكل دور -->
        <!-- اسم الدور + شارة + إيميل -->
        <!-- سهم -->
      </button>
    </div>

    <p class="text-[11px] text-center mt-3">
      اضغط على أي بطاقة للدخول التلقائي • كلمة المرور: <span class="font-mono">Demo@1234</span>
    </p>
  </div>
</template>
```

#### 2.3 ألوان مميزة لكل دور

```javascript
const accounts = [
  { label: "المسؤول (Admin)", role: "admin", email: "admin@demo.com",
    icon: "i-heroicons-shield-check", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { label: "المندوب (Representative)", role: "representative", email: "rep@demo.com",
    icon: "i-heroicons-user-circle", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { label: "المطور (Developer)", role: "dev", email: "dev@demo.com",
    icon: "i-heroicons-code-bracket", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  { label: "المستخدم (User)", role: "user", email: "user@demo.com",
    icon: "i-heroicons-user", iconBg: "bg-gray-100", iconColor: "text-gray-600" },
];
```

#### 2.4 ضمّن المكوّن في صفحة Login

```vue
<!-- في pages/login.vue، تحت زر تسجيل الدخول -->
<TheDemoModeDemoCredentialsCards :loading="loading" @select="handleDemoSelect" />
```

#### 2.5 منطق Auto-fill + Auto-submit

```typescript
const handleDemoSelect = async (account: { email: string; password: string }) => {
  state.email = account.email;
  state.password = account.password;
  try {
    loading.value = true;
    await signIn(
      { email: account.email, password: account.password },
      { callbackUrl: "/" }
    );
  } catch (error: any) {
    loading.value = false;
    toast.add({ title: "تعذّر الدخول التجريبي", color: "red" });
  }
};
```

---

## 🎯 المرحلة 3: الجولة التفاعلية بـ Driver.js

### الهدف
عند أول دخول لكل دور، تشغيل جولة خطوة بخطوة تشرح النظام. لا تتكرر بفضل localStorage.

### الخطوات

#### 3.1 ثبّت Driver.js

```bash
pnpm add driver.js
# أو
npm install driver.js
```

#### 3.2 أنشئ composable الجولة
المسار: `client/composables/useTour.ts`

#### 3.3 هيكل composable

```typescript
import { driver } from "driver.js";
import type { DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

const driverOptions = {
  showProgress: true,
  progressText: "{{current}} من {{total}}",
  nextBtnText: "التالي ←",
  prevBtnText: "→ السابق",
  doneBtnText: "إنهاء",
  smoothScroll: true,
  allowClose: true,
  overlayOpacity: 0.6,
};

// تعريف جولة لكل دور
const adminTour = {
  steps: [
    { popover: { title: "أهلاً بك 👋", description: "..." } },
    { element: '[data-tour="sidebar"]', popover: { title: "...", side: "left" } },
    { element: '[data-tour="stats"]', popover: { title: "...", side: "bottom" } },
    { element: 'aside a[href*="/admins"]', popover: { title: "...", side: "left" } },
    // ... 10 خطوات كحد أقصى لكل جولة
  ],
};

const TOURS = { admin: adminTour, dev: adminTour, representative: repTour, user: userTour };

const STORAGE_KEY = "demo-tour-seen-roles";

const getSeenRoles = (): string[] => {
  if (!import.meta.client) return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
};

const markRoleSeen = (role: string) => {
  if (!import.meta.client) return;
  const seen = getSeenRoles();
  if (!seen.includes(role)) {
    seen.push(role);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
  }
};

export const useTour = () => {
  const startTour = (role: string) => {
    const config = TOURS[role] || TOURS.user;
    driver({ ...driverOptions, steps: config.steps, onDestroyed: () => markRoleSeen(role) }).drive();
  };

  const maybeAutoStart = (role: string) => {
    if (!import.meta.client) return;
    if (getSeenRoles().includes(role)) return;
    setTimeout(() => startTour(role), 800); // تأخير لضمان تحميل العناصر
  };

  const resetTour = () => localStorage.removeItem(STORAGE_KEY);

  return { startTour, maybeAutoStart, resetTour };
};
```

#### 3.4 أضف `data-tour` للعناصر المستهدفة

```vue
<!-- Sidebar -->
<aside data-tour="sidebar">...</aside>

<!-- Stats wrapper -->
<div data-tour="stats" class="stats-container">...</div>
```

> **نصيحة:** للقوائم الديناميكية، استخدم selectors بـ href بدلاً من data-tour:
> ```typescript
> element: 'aside a[href*="/admins"]'
> ```

#### 3.5 شغّل الجولة تلقائياً في الـ layout

```vue
<!-- layouts/dashboard.vue -->
<script setup>
const { data } = useAuth();
const { maybeAutoStart } = useTour();

onMounted(() => {
  const role = data.value?.data?.data?.role;
  if (role) maybeAutoStart(role);
});
</script>
```

#### 3.6 محتوى الجولات (Tour Content)

**جولة Admin (10 خطوات):**
1. ترحيب
2. القائمة الجانبية
3. الإحصائيات
4-8. شرح كل قسم (المسؤولين، المندوبين، العملاء، المنتجات، الفواتير)
9. زر المساعدة
10. ختام

**جولة Representative/Limited Role (5 خطوات):**
1. ترحيب
2. القائمة الجانبية (محدودة)
3. الإحصائيات الشخصية
4. زر المساعدة
5. ختام

**جولة User العادي (2-3 خطوات):**
1. ترحيب + إخبارهم أن صلاحياتهم محدودة
2. توجيههم لاستخدام بطاقات Login السريعة للأدوار الأخرى

---

## 💡 المرحلة 4: زر المساعدة العائم

### الهدف
زر دائري ثابت في زاوية الشاشة (bottom-left) يفتح modal فيه:
- تنبيه Demo Mode
- زر إعادة الجولة التفاعلية
- بيانات الدخول لكل الأدوار مع نسخ
- نصائح ديناميكية حسب الصفحة الحالية
- زر تسجيل الخروج

### الخطوات

#### 4.1 أنشئ المكوّن
المسار: `client/components/TheDemoMode/DemoHelpButton.vue`

#### 4.2 هيكل المكوّن

```vue
<template>
  <div data-tour="help-button" class="demo-help-button-wrapper">
    <!-- الزر العائم -->
    <UButton
      v-if="!isOpen"
      icon="i-heroicons-question-mark-circle"
      color="primary"
      size="xl"
      :ui="{ rounded: 'rounded-full' }"
      class="shadow-xl"
      @click="isOpen = true"
    />

    <UModal v-model="isOpen">
      <UCard>
        <!-- Header: عنوان + Demo Mode notice + زر إغلاق -->
        <!-- Body: -->
        <!--   1. Alert ترحيب -->
        <!--   2. زر "ابدأ الجولة" -->
        <!--   3. قائمة Credentials لكل الأدوار مع زر copy -->
        <!--   4. نصائح حسب الصفحة (computed من useRoute) -->
        <!-- Footer: اسمك + زر تسجيل الخروج -->
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
.demo-help-button-wrapper {
  position: fixed;
  bottom: 24px;
  left: 24px; /* أو right حسب اتجاه اللغة */
  z-index: 50;
}
</style>
```

#### 4.3 منطق المكوّن

```typescript
const { startTour: launchTour } = useTour();
const { data, signOut } = useAuth();
const route = useRoute();
const toast = useToast();
const isOpen = ref(false);

// نصائح ديناميكية حسب الصفحة
const pageTipsByRoute: Record<string, string[]> = {
  "/": ["نصيحة 1", "نصيحة 2"],
  "/admins": ["..."],
  "/representative": ["..."],
  // ... لكل route
};

const pageTips = computed(() => pageTipsByRoute[route.path] || ["نصائح عامة"]);

const userRole = computed<string>(() => (data.value as any)?.data?.data?.role || "user");

const startTour = () => {
  isOpen.value = false;
  setTimeout(() => launchTour(userRole.value), 300);
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast.add({ title: "تم النسخ", color: "green" });
};

const logout = async () => {
  isOpen.value = false;
  await signOut({ callbackUrl: "/login", redirect: true });
};
```

#### 4.4 ضمّن الزر في الـ Layout

```vue
<!-- layouts/dashboard.vue -->
<template>
  <div class="...">
    <!-- باقي الـ layout -->
    <ClientOnly>
      <TheDemoModeDemoHelpButton />
    </ClientOnly>
  </div>
</template>
```

> ⚠️ **مهم**: استخدم `<ClientOnly>` لتجنب hydration mismatch مع localStorage.

---

## ⚡ نصائح وأخطاء شائعة

### تحذيرات SSR
- استخدم `import.meta.client` قبل أي وصول لـ `localStorage` أو `window`
- استخدم `<ClientOnly>` للمكونات التي تعتمد على state عميل فقط
- لا تضع `await fetch` بدون توكن في `script setup` (سيفشل أثناء SSR)

### تكامل Auth Library
- **@sidebase/nuxt-auth**: التوكن يأتي بصيغة `Bearer xxx` بالفعل، **لا تضف Bearer مرة أخرى**:
  ```typescript
  // ❌ خطأ
  headers: { Authorization: `Bearer ${token.value}` }
  // ✅ صح
  headers: { Authorization: token.value ?? "" }
  ```
- استخدم `{ callbackUrl: "/login", redirect: true }` مع `signOut` لتجنب خطأ "Navigating to external URL"

### Driver.js
- لا تنسَ استيراد الـ CSS: `import "driver.js/dist/driver.css"`
- للـ RTL، أضف هذه إلى الـ CSS الخاص بك (اختياري):
  ```css
  .driver-popover { direction: rtl; text-align: right; }
  ```

### تنسيق البيانات
- بيانات `useToLocaleString` أو ما يقابلها: تأكد من التعامل مع `undefined/NaN`
- ابدأ بـ `0` كقيمة افتراضية في الـ stats عشان متطلعش `undefined` في الـ console

### بطاقات Login والـ Auth Flow
- لو الـ auth library بتعمل redirect تلقائي بعد signIn، استخدم `callbackUrl`
- استخدم `unauthenticatedOnly: true` في middleware عشان المسجّل دخول ميشوفش صفحة Login

---

## 🎨 Customization Points حسب المشروع

| النقطة | الافتراضي | كيف تعدّلها |
|--------|----------|-------------|
| **كلمة المرور الافتراضية** | `Demo@1234` | غيّر `DEMO_PASSWORD` في seed script |
| **الإيميلات الأساسية** | `<role>@demo.com` | غيّر في seed script و DemoCredentialsCards |
| **عدد الكيانات** | 100 books، 50 stores، 200 invoices | غيّر `targetCount` في كل دالة seeding |
| **محتوى الجولات** | الأدوار الموجودة في النظام | عدّل `TOURS` في `useTour.ts` |
| **النصائح لكل صفحة** | حسب routes النظام | عدّل `pageTipsByRoute` |
| **الـ data-tour selectors** | يعتمد على بنية الـ DOM | عدّل في الـ tour config |
| **اللغة** | عربي | استخدم i18n لو ثنائي اللغة |
| **اتجاه الزر العائم** | `bottom-left` | غيّر CSS حسب اتجاه اللغة |

---

## 📦 المخرجات النهائية

ملفات يجب أن تكون موجودة بعد التطبيق:

```
server/utils/
└── seedDemoData.js                    # المرحلة 1

client/components/TheDemoMode/
├── DemoCredentialsCards.vue           # المرحلة 2
└── DemoHelpButton.vue                 # المرحلة 4

client/composables/
└── useTour.ts                         # المرحلة 3

client/pages/login.vue                 # ← مُعدّل لاستخدام DemoCredentialsCards
client/layouts/dashboard.vue           # ← مُعدّل لاستخدام DemoHelpButton + auto-tour
```

---

## ✅ Checklist الاختبار النهائي

بعد التطبيق، استخدم Playwright (أو افتح المتصفح يدوياً) للتحقق من:

- [ ] صفحة Login تعرض 4 بطاقات لكل دور بألوان مختلفة
- [ ] النقر على بطاقة يسجّل دخول تلقائي
- [ ] بعد أول دخول، جولة تفاعلية تبدأ تلقائياً
- [ ] الجولة تظلل العناصر الصحيحة (sidebar، stats، nav items)
- [ ] إغلاق الجولة يحفظها في localStorage (لا تظهر مرة أخرى)
- [ ] زر المساعدة العائم يظهر في زاوية الشاشة
- [ ] الـ modal يحتوي على: ترحيب + زر جولة + بيانات دخول + نصائح + خروج
- [ ] زر النسخ (clipboard) يعمل ويعرض toast نجاح
- [ ] زر تسجيل الخروج يعمل ولا يسبب أخطاء navigation
- [ ] Console نظيف - لا errors ولا warnings
- [ ] الإحصائيات تعرض أرقاماً واقعية (ليست 0 أو undefined)
- [ ] الجداول مليئة بالبيانات مع pagination صحيح
- [ ] جميع الأدوار: Admin، Dev، Representative، User تعمل بشكل مختلف
- [ ] الجولة تختلف حسب الدور

---

## 🎯 ملاحظة لـ Claude

عند تطبيق هذا الدليل في مشروع جديد:

1. **اسأل المستخدم أولاً** الأسئلة الـ 8 المذكورة أعلاه باستخدام `AskUserQuestion`
2. **افحص بنية المشروع** قبل البدء (models، routes، layouts، auth)
3. **لا تفترض** stack معين - اسأل عن أي شيء غامض (نوع DB، auth library، CSS framework)
4. **استخدم Playwright** أو تشغيل المشروع للتحقق بعد كل مرحلة
5. **اتبع الترتيب**: seeding → login cards → tour → help button
6. **تأكد من Console نظيف** في النهاية - أصلح أي SSR/hydration/auth issues
7. **لاحظ Authorization Header**: في بعض الـ auth libraries (مثل @sidebase/nuxt-auth) التوكن يأتي مع Bearer جاهز

استخدم todo list لتتبع المراحل، وقدّم summary واضح في النهاية.
