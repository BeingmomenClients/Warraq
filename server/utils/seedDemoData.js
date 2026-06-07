require('dotenv').config({ path: './config.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Bookstore = require('../models/bookstoreModel');
const PurchaseInvoices = require('../models/purchaseInvoicesModel');
const CollectRepresentative = require('../models/collectRepresentativeModel');
const CollectBookstore = require('../models/collectBookstoreModel');
const Counter = require('../models/counterModel');

const DB = process.env.DATABASE_ATLAS;

const DEMO_PASSWORD = 'Demo@1234';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[randInt(0, arr.length - 1)];
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// ============================================================
// بيانات عربية واقعية
// ============================================================

const arabicFirstNames = [
  'أحمد', 'محمد', 'عمر', 'علي', 'خالد', 'يوسف', 'إبراهيم', 'عبدالله',
  'فاطمة', 'مريم', 'سارة', 'نور', 'هنا', 'رنا', 'دينا', 'ريم',
  'حسام', 'طارق', 'وليد', 'ماجد', 'هاني', 'رامي', 'سامي', 'ناصر'
];

const arabicLastNames = [
  'الشاطوري', 'المصري', 'العربي', 'الحسيني', 'السيد', 'محمود', 'إبراهيم',
  'عبدالرحمن', 'الجزار', 'البدوي', 'الحداد', 'النجار', 'الصياد', 'الغزالي',
  'منصور', 'خليل', 'سلامة', 'رشيد', 'فاروق', 'زيدان'
];

const egyptCities = ['القاهرة', 'الإسكندرية', 'الجيزة', 'المنصورة', 'أسيوط', 'طنطا', 'الفيوم', 'المنيا', 'سوهاج', 'الزقازيق', 'بني سويف', 'دمياط'];

const egyptStreets = ['شارع التحرير', 'شارع مصطفى كامل', 'شارع النيل', 'شارع فيصل', 'شارع عباس العقاد', 'شارع مكرم عبيد', 'شارع الهرم'];

const bookTitles = [
  'رحلة في الأعماق', 'أسرار الكون', 'الطريق إلى النجاح', 'حكايات من التاريخ',
  'العقل الباطن', 'فن الحياة', 'مع الناس', 'أنا وأنت والعالم',
  'خطوات نحو القمة', 'الحب والحياة', 'في بلاد الأحلام', 'ليالي القاهرة',
  'صوت الصحراء', 'نهر الزمن', 'بوابة المستقبل', 'عالم بلا حدود',
  'قلب المدينة', 'أمواج البحر', 'ظلال الشجرة', 'الفجر الجديد',
  'رسائل إلى الغد', 'في ساعة العسرة', 'جسر الأيام', 'مدينة الأسرار',
  'طريق الحرير', 'نافذة على الماضي', 'الحلم الضائع', 'أرض الأجداد',
  'صمت الليل', 'حروف من ذهب'
];

const bookAuthors = [
  'نجيب محفوظ', 'طه حسين', 'يوسف إدريس', 'إحسان عبد القدوس',
  'أنيس منصور', 'مصطفى محمود', 'جمال الغيطاني', 'إبراهيم عبد المجيد',
  'علاء الأسواني', 'صنع الله إبراهيم', 'محمد المنسي قنديل', 'رضوى عاشور'
];

const bookstoreNames = [
  'مكتبة النيل', 'مكتبة الفجر', 'مكتبة النور', 'مكتبة الحرية', 'مكتبة العلم',
  'مكتبة المعرفة', 'مكتبة الفكر', 'مكتبة الأمل', 'مكتبة الهدى', 'مكتبة الإشراق',
  'مكتبة الرواد', 'مكتبة الثقافة', 'مكتبة الوطن', 'مكتبة المستقبل', 'مكتبة النهضة',
  'مكتبة السلام', 'مكتبة الإبداع', 'مكتبة الريادة', 'مكتبة القمة', 'مكتبة العصر'
];

const collectNotes = [
  'تحصيل دوري', 'سداد مستحقات', 'دفعة جزئية', 'تسوية الحساب', 'تحصيل شهري',
  'سداد الرصيد المتبقي', 'دفعة مقدمة', 'تحصيل متأخرات'
];

// ============================================================
// الحسابات الأساسية
// ============================================================

const targetUsers = [
  { name: 'مسؤول النظام', email: 'admin@demo.com', role: 'admin', phone: '01000000001', country: 'مصر' },
  { name: 'مطور النظام', email: 'dev@demo.com', role: 'dev', phone: '01000000002', country: 'مصر' },
  { name: 'أحمد الشاطوري', email: 'rep@demo.com', role: 'representative', phone: '01000000003', country: 'مصر' },
  { name: 'مستخدم تجريبي', email: 'user@demo.com', role: 'user', phone: '01000000004', country: 'مصر' },
];

// ============================================================
// Seeding المستخدمين
// ============================================================

const seedUsers = async () => {
  console.log('👥 Seeding users...');

  const emails = targetUsers.map(u => u.email);
  const existing = await User.find({ email: { $in: emails } });
  const existingEmails = new Set(existing.map(u => u.email));
  const newPrimary = targetUsers.filter(u => !existingEmails.has(u.email));

  for (const user of newPrimary) {
    await User.create({ ...user, password: DEMO_PASSWORD, passwordConfirm: DEMO_PASSWORD });
  }

  // إضافة مندوبين إضافيين (10 مندوبين)
  const repEmails = Array.from({ length: 10 }, (_, i) => `rep${i + 1}@demo.com`);
  const existingReps = await User.find({ email: { $in: repEmails } });
  const existingRepEmails = new Set(existingReps.map(u => u.email));

  for (let i = 0; i < 10; i++) {
    const email = `rep${i + 1}@demo.com`;
    if (existingRepEmails.has(email)) continue;
    const firstName = arabicFirstNames[i % arabicFirstNames.length];
    const lastName = arabicLastNames[i % arabicLastNames.length];
    await User.create({
      name: `${firstName} ${lastName}`,
      email,
      role: 'representative',
      phone: `010${String(10000010 + i).padStart(8, '0')}`,
      country: 'مصر',
      password: DEMO_PASSWORD,
      passwordConfirm: DEMO_PASSWORD,
    });
  }

  console.log(`   ✅ Done. Total users: ${await User.countDocuments()}`);
};

// ============================================================
// Seeding الكتب
// ============================================================

const seedBooks = async adminId => {
  console.log('📚 Seeding books...');

  const existingTitles = new Set((await Book.find({}, 'title')).map(b => b.title));
  let created = 0;

  for (let i = 0; i < bookTitles.length; i++) {
    if (existingTitles.has(bookTitles[i])) continue;
    const purchasePrice = randInt(20, 80);
    const price = purchasePrice + randInt(10, 40);
    await Book.create({
      title: bookTitles[i],
      author: pick(bookAuthors),
      price: String(price),
      purchasePrice: String(purchasePrice),
      availableQuantity: randInt(50, 500),
      user: adminId,
      createdAt: randomDate(new Date('2023-01-01'), new Date()),
    });
    created++;
  }

  console.log(`   ✅ Created ${created} new books. Total: ${await Book.countDocuments()}`);
};

// ============================================================
// Seeding المكتبات
// ============================================================

const seedBookstores = async (adminId, representatives) => {
  console.log('🏪 Seeding bookstores...');

  const existingNames = new Set((await Bookstore.find({}, 'name')).map(b => b.name));
  let created = 0;

  for (let i = 0; i < bookstoreNames.length; i++) {
    if (existingNames.has(bookstoreNames[i])) continue;
    const city = pick(egyptCities);
    const street = pick(egyptStreets);
    // كل مكتبة لها 1-2 مندوب
    const repCount = randInt(1, 2);
    const repIds = [];
    for (let r = 0; r < repCount; r++) {
      const rep = representatives[(i + r) % representatives.length];
      if (!repIds.includes(String(rep._id))) repIds.push(rep._id);
    }
    await Bookstore.create({
      name: bookstoreNames[i],
      address: `${street}، ${city}`,
      phone: `03${String(10000000 + i).padStart(8, '0')}`,
      representativeIds: repIds,
      user: adminId,
      createdAt: randomDate(new Date('2023-01-01'), new Date()),
    });
    created++;
  }

  console.log(`   ✅ Created ${created} new bookstores. Total: ${await Bookstore.countDocuments()}`);
};

// ============================================================
// Seeding الفواتير
// ============================================================

const seedInvoices = async (adminId, representatives, bookstores, books) => {
  console.log('🧾 Seeding purchase invoices...');

  const counterDoc = await Counter.findOne({ name: 'invoiceSerial' });
  let serial = counterDoc ? counterDoc.value : 0;

  // كم فاتورة موجودة
  const existingCount = await PurchaseInvoices.countDocuments();
  const targetCount = 50;
  const toCreate = Math.max(0, targetCount - existingCount);

  if (toCreate === 0) {
    console.log('   ⏭ Invoices already at target count.');
    return;
  }

  const bookstoreUpdates = new Map();
  const repUpdates = new Map();

  for (let i = 0; i < toCreate; i++) {
    serial++;
    const rep = pick(representatives);
    const bookstore = pick(bookstores);
    // 2-5 كتب في كل فاتورة
    const bookCount = randInt(2, 5);
    const selectedBooks = [];
    const usedBookIds = new Set();

    for (let b = 0; b < bookCount; b++) {
      let book;
      let attempts = 0;
      do {
        book = pick(books);
        attempts++;
      } while (usedBookIds.has(String(book._id)) && attempts < 20);
      if (usedBookIds.has(String(book._id))) continue;
      usedBookIds.add(String(book._id));
      const count = randInt(1, 10);
      const price = Number(book.price);
      selectedBooks.push({ bookId: book._id, price, count, total: price * count });
    }

    if (selectedBooks.length === 0) { serial--; continue; }

    const orderBooksCount = selectedBooks.reduce((s, b) => s + b.count, 0);
    const totalPrice = selectedBooks.reduce((s, b) => s + b.total, 0);
    const totalCost = selectedBooks.reduce((s, b) => s + (Number(books.find(bk => String(bk._id) === String(b.bookId)).purchasePrice) * b.count), 0);
    const paymentType = pick(['cash', 'credit']);
    const paymentStatus = paymentType === 'cash' ? 'paid' : pick(['paid', 'unpaid']);
    const paidAmount = paymentStatus === 'paid' ? totalPrice : randInt(0, totalPrice - 1);
    const remainingAmount = totalPrice - paidAmount;

    await PurchaseInvoices.create({
      serialNumber: serial,
      representativeId: rep._id,
      bookstoreId: bookstore._id,
      bookIds: selectedBooks,
      paymentType,
      paymentStatus,
      totalCost,
      totalPrice,
      paidAmount,
      remainingAmount,
      orderBooksCount,
      user: adminId,
      createdAt: randomDate(new Date('2023-06-01'), new Date()),
    });

    // تجميع التحديثات للمكتبات
    const bsKey = String(bookstore._id);
    const bsU = bookstoreUpdates.get(bsKey) || { balance: 0, booksCount: 0 };
    bsU.balance -= remainingAmount;
    bsU.booksCount += orderBooksCount;
    bookstoreUpdates.set(bsKey, bsU);

    // تجميع التحديثات للمندوبين
    const repKey = String(rep._id);
    const repU = repUpdates.get(repKey) || { balance: 0, booksCount: 0, totalOutstandingSales: 0 };
    repU.balance -= remainingAmount;
    repU.booksCount += orderBooksCount;
    repU.totalOutstandingSales += totalPrice;
    repUpdates.set(repKey, repU);
  }

  // تطبيق التحديثات على المكتبات
  for (const [id, update] of bookstoreUpdates) {
    await Bookstore.findByIdAndUpdate(id, { $inc: update });
  }

  // تطبيق التحديثات على المندوبين
  for (const [id, update] of repUpdates) {
    await User.findByIdAndUpdate(id, { $inc: update });
  }

  // تحديث الـ counter
  await Counter.findOneAndUpdate(
    { name: 'invoiceSerial' },
    { value: serial },
    { upsert: true }
  );

  console.log(`   ✅ Created ${toCreate} new invoices. Total: ${await PurchaseInvoices.countDocuments()}`);
};

// ============================================================
// Seeding تحصيلات المندوبين
// ============================================================

const seedCollectRepresentatives = async (adminId, representatives) => {
  console.log('💰 Seeding representative collections...');

  const existing = await CollectRepresentative.countDocuments();
  const toCreate = Math.max(0, 15 - existing);

  for (let i = 0; i < toCreate; i++) {
    const rep = pick(representatives);
    const amount = randInt(500, 5000);
    await CollectRepresentative.create({
      amount,
      note: pick(collectNotes),
      representativeId: rep._id,
      user: adminId,
      createdAt: randomDate(new Date('2023-06-01'), new Date()),
    });
    await User.findByIdAndUpdate(rep._id, { $inc: { balance: amount } });
  }

  console.log(`   ✅ Created ${toCreate} new rep collections. Total: ${await CollectRepresentative.countDocuments()}`);
};

// ============================================================
// Seeding تحصيلات المكتبات
// ============================================================

const seedCollectBookstores = async (adminId, bookstores) => {
  console.log('🏦 Seeding bookstore collections...');

  const existing = await CollectBookstore.countDocuments();
  const toCreate = Math.max(0, 10 - existing);

  for (let i = 0; i < toCreate; i++) {
    const bookstore = pick(bookstores);
    const amount = randInt(1000, 8000);
    await CollectBookstore.create({
      amount,
      note: pick(collectNotes),
      bookstoreId: bookstore._id,
      user: adminId,
      createdAt: randomDate(new Date('2023-06-01'), new Date()),
    });
    await Bookstore.findByIdAndUpdate(bookstore._id, { $inc: { balance: amount } });
  }

  console.log(`   ✅ Created ${toCreate} new bookstore collections. Total: ${await CollectBookstore.countDocuments()}`);
};

// ============================================================
// Main
// ============================================================

const seed = async () => {
  try {
    console.log('\n🔌 Connecting to database...');
    await mongoose.connect(DB);
    console.log('✅ Connected!\n');

    await seedUsers();

    const admin = await User.findOne({ email: 'admin@demo.com' });
    const representatives = await User.find({ role: 'representative' });
    const books = await Book.find();
    let bookstores = await Bookstore.find();

    await seedBooks(admin._id);
    await seedBookstores(admin._id, representatives);

    const allBooks = await Book.find();
    const allBookstores = await Bookstore.find();
    const allReps = await User.find({ role: 'representative' });

    await seedInvoices(admin._id, allReps, allBookstores, allBooks);
    await seedCollectRepresentatives(admin._id, allReps);
    await seedCollectBookstores(admin._id, allBookstores);

    console.log('\n📊 ملخص قاعدة البيانات:');
    console.log(`   المستخدمون: ${await User.countDocuments()}`);
    console.log(`   الكتب: ${await Book.countDocuments()}`);
    console.log(`   المكتبات: ${await Bookstore.countDocuments()}`);
    console.log(`   الفواتير: ${await PurchaseInvoices.countDocuments()}`);
    console.log(`   تحصيلات المندوبين: ${await CollectRepresentative.countDocuments()}`);
    console.log(`   تحصيلات المكتبات: ${await CollectBookstore.countDocuments()}`);

    console.log('\n🔐 بيانات الدخول التجريبية:');
    console.log(`   admin@demo.com     / ${DEMO_PASSWORD}  (مسؤول)`);
    console.log(`   dev@demo.com       / ${DEMO_PASSWORD}  (مطور)`);
    console.log(`   rep@demo.com       / ${DEMO_PASSWORD}  (مندوب)`);
    console.log(`   user@demo.com      / ${DEMO_PASSWORD}  (مستخدم)`);
    console.log('\n✅ تم إنشاء البيانات التجريبية بنجاح!\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seed();
