# Deploy Timeline - Book Shop

## هيكل المشروع
```
Book_Shop/          ← Monorepo (pnpm workspace)
├── server/         ← Express.js API
├── client/         ← Nuxt.js Frontend
├── package.json
└── pnpm-workspace.yaml
```

---

## Server Deploy على Coolify

### المشكلة الأولى: pnpm-lock.yaml قديم
- **السبب:** `nodemon` اتضاف لـ `package.json` بس الـ lockfile ما اتحدثش.
- **الـ Error:**
  ```
  ERR_PNPM_OUTDATED_LOCKFILE: pnpm-lock.yaml is not up to date with package.json
  ```
- **الحل:**
  إنشاء lockfile جديد في مجلد مؤقت معزول عن الـ workspace:
  ```powershell
  $tempDir = "$env:TEMP\pnpm-server-fix"
  New-Item -ItemType Directory -Force $tempDir
  Copy-Item ".\server\package.json" "$tempDir\package.json"
  Set-Location $tempDir
  pnpm install
  Copy-Item "$tempDir\pnpm-lock.yaml" ".\server\pnpm-lock.yaml"
  ```
  ثم commit وpush.

---

## إعدادات Coolify

### General
| Setting | Value |
|---|---|
| Build Pack | Nixpacks |
| Base Directory | `/server` |
| Domains | `https://book-api.beingmomen.com` |

### Network
| Setting | Value |
|---|---|
| Ports Exposes | `6431` |

### Environment Variables
```
NODE_ENV=production
PORT=6431
DATABASE_ATLAS=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=5h
JWT_COOKIE_EXPIRES_IN=5
EMAIL_FROM=...
STAMP_MAIL=...
STAMP_PASSWORD=...
SITE_NAME=Book_Shop
MANAGER=- Book_Shop Org.
```

### DNS
- أضيف A Record على `beingmomen.com`:

| Type | Name | Value |
|---|---|---|
| `A` | `book-api` | IP السيرفر |

---

## خطوات الـ Deploy من الصفر

1. **GitHub** → push الكود على الـ repo
2. **Coolify** → New Project → New Resource → Application
3. ربط الـ GitHub repo واختيار الـ branch
4. تحديد:
   - Base Directory: `/server`
   - Build Pack: Nixpacks
   - Domain: `https://book-api.beingmomen.com`
   - Ports Exposes: `6431`
5. إضافة جميع الـ Environment Variables
6. اضغط **Save** ثم **Deploy**
7. انتظر وتأكد من الـ Logs إن فيه:
   ```
   App running on port 6431....
   DB connection successful!
   ```

---

## ملاحظات مهمة

- **config.env** متحفظش في GitHub (موجود في `.gitignore`) - كل الـ env vars لازم تتضاف يدوي في Coolify.
- **images folder** مش بتتحفظ بين الـ deployments (ephemeral) - لو محتاج file storage في المستقبل استخدم Cloudinary.
- لو عملت تغييرات في الـ Environment Variables في Coolify لازم تضغط **Save** ثم **Redeploy**.

---

## الـ URLs

| Service | URL |
|---|---|
| Server (API) | `https://book-api.beingmomen.com` |
| Client | - |
