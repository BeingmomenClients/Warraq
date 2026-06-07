import { driver } from "driver.js";
import type { DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

const STORAGE_KEY = "demo-tour-seen-roles";

const driverOptions = {
  showProgress: true,
  progressText: "{{current}} من {{total}}",
  nextBtnText: "التالي ←",
  prevBtnText: "→ السابق",
  doneBtnText: "إنهاء الجولة",
  smoothScroll: true,
  allowClose: true,
  overlayOpacity: 0.55,
  popoverClass: "demo-tour-popover",
};

// ============================================================
// جولة المسؤول (Admin) - 10 خطوات
// ============================================================
const adminSteps: DriveStep[] = [
  {
    popover: {
      title: "👋 أهلاً بك في نظام المكتبة!",
      description:
        "هذه جولة سريعة تشرح وظائف النظام. أنت مسجّل دخول كـ <strong>مسؤول</strong> ولديك صلاحيات كاملة.",
      side: "over",
      align: "center",
    },
  },
  {
    element: '[data-tour="sidebar"]',
    popover: {
      title: "🗂 القائمة الجانبية",
      description:
        "من هنا يمكنك التنقل بين جميع أقسام النظام: الكتب، المكتبات، المندوبين، والفواتير.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="stats"]',
    popover: {
      title: "📊 لوحة الإحصائيات",
      description:
        "تعرض ملخصاً شاملاً: إجمالي المبيعات، الأرصدة، عدد المكتبات والمندوبين.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: 'aside a[href$="/books"]',
    popover: {
      title: "📚 إدارة الكتب",
      description:
        "أضف كتباً جديدة، حدّث الأسعار، وتتبع الكميات المتاحة لكل كتاب.",
      side: "left",
      align: "start",
    },
  },
  {
    element: 'aside a[href*="/bookstore"]',
    popover: {
      title: "🏪 إدارة المكتبات",
      description:
        "أدر قائمة المكتبات، اربط كل مكتبة بمندوب، وتتبع رصيدها وعدد الكتب المستلمة.",
      side: "left",
      align: "start",
    },
  },
  {
    element: 'aside a[href*="/representative"]',
    popover: {
      title: "👤 إدارة المندوبين",
      description:
        "تابع أداء كل مندوب: مبيعاته، رصيده، والمكتبات التابعة له.",
      side: "left",
      align: "start",
    },
  },
  {
    element: 'aside a[href*="/purchase-invoices"]',
    popover: {
      title: "🧾 فواتير المبيعات",
      description:
        "أنشئ فواتير بيع جديدة، تتبع المدفوع والمتبقي، وراجع سجل جميع العمليات.",
      side: "left",
      align: "start",
    },
  },
  {
    element: 'aside a[href*="/admins"]',
    popover: {
      title: "🛡 إدارة المسؤولين",
      description:
        "أضف مسؤولين جدد أو مطورين للنظام وحدّد صلاحياتهم.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="help-button"]',
    popover: {
      title: "💡 زر المساعدة",
      description:
        "في أي وقت يمكنك الضغط على هذا الزر لمشاهدة بيانات الدخول لجميع الأدوار وإعادة هذه الجولة.",
      side: "top",
      align: "start",
    },
  },
  {
    popover: {
      title: "🎉 جاهز للاستكشاف!",
      description:
        "لقد تعرّفت على أقسام النظام. يمكنك الآن استكشاف البيانات التجريبية بحرية. جرّب أدواراً مختلفة من زر المساعدة!",
      side: "over",
      align: "center",
    },
  },
];

// ============================================================
// جولة المندوب (Representative) - 5 خطوات
// ============================================================
const repSteps: DriveStep[] = [
  {
    popover: {
      title: "👋 أهلاً بك أيها المندوب!",
      description:
        "أنت مسجّل دخول كـ <strong>مندوب مبيعات</strong>. ستجد هنا كل ما يخص عملك اليومي.",
      side: "over",
      align: "center",
    },
  },
  {
    element: '[data-tour="sidebar"]',
    popover: {
      title: "🗂 قائمة المندوب",
      description:
        "تتيح لك قائمتك الوصول إلى المكتبات التابعة لك، الفواتير، والكتب المتاحة.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="stats"]',
    popover: {
      title: "📈 إحصائياتك الشخصية",
      description:
        "تجد هنا رصيدك الحالي، إجمالي مبيعاتك، وعدد الكتب التي وزّعتها.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="help-button"]',
    popover: {
      title: "💡 زر المساعدة",
      description:
        "اضغط هنا لاستعراض بيانات دخول الأدوار الأخرى (كالمسؤول) وتجربتها.",
      side: "top",
      align: "start",
    },
  },
  {
    popover: {
      title: "✅ أنت جاهز!",
      description:
        "يمكنك الآن تصفح مكتباتك وفواتيرك. لتجربة صلاحيات أوسع، استخدم زر المساعدة للدخول كمسؤول.",
      side: "over",
      align: "center",
    },
  },
];

// ============================================================
// جولة المطور (Dev) - نفس جولة الـ Admin
// ============================================================
const devSteps: DriveStep[] = adminSteps;

// ============================================================
// جولة المستخدم العادي (User) - 3 خطوات
// ============================================================
const userSteps: DriveStep[] = [
  {
    popover: {
      title: "👋 مرحباً!",
      description:
        "أنت مسجّل دخول كـ <strong>مستخدم عادي</strong>. صلاحياتك محدودة في هذا النظام.",
      side: "over",
      align: "center",
    },
  },
  {
    element: '[data-tour="help-button"]',
    popover: {
      title: "🔑 جرّب أدواراً أخرى",
      description:
        "اضغط على زر المساعدة هذا لتجربة النظام بصلاحيات أوسع (مسؤول، مندوب، مطور) — نقرة واحدة تكفي!",
      side: "top",
      align: "start",
    },
  },
  {
    popover: {
      title: "💡 نصيحة",
      description:
        "أفضل تجربة للنظام هي بتسجيل دخول كـ <strong>مسؤول</strong>. استخدم زر المساعدة للانتقال إليه.",
      side: "over",
      align: "center",
    },
  },
];

const TOURS: Record<string, DriveStep[]> = {
  admin: adminSteps,
  dev: devSteps,
  representative: repSteps,
  user: userSteps,
};

const getSeenRoles = (): string[] => {
  if (!import.meta.client) return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
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
    if (!import.meta.client) return;
    const steps = TOURS[role] ?? TOURS.user;
    const d = driver({
      ...driverOptions,
      steps,
      onDestroyed: () => markRoleSeen(role),
    });
    d.drive();
  };

  const maybeAutoStart = (role: string) => {
    if (!import.meta.client) return;
    if (getSeenRoles().includes(role)) return;
    setTimeout(() => startTour(role), 900);
  };

  const resetTour = () => {
    if (!import.meta.client) return;
    localStorage.removeItem(STORAGE_KEY);
  };

  return { startTour, maybeAutoStart, resetTour };
};
