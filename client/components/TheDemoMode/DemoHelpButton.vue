<template>
  <div data-tour="help-button" class="demo-help-wrapper">
    <UButton
      v-if="!isOpen"
      icon="i-heroicons-question-mark-circle"
      color="primary"
      size="xl"
      :ui="{ rounded: 'rounded-full' }"
      class="shadow-2xl demo-help-fab"
      title="مساعدة Demo Mode"
      @click="isOpen = true"
    />

    <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-md' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'px-5 py-4' }, footer: { padding: 'px-5 py-3' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-beaker" class="w-5 h-5 text-primary-500" />
              <span class="font-bold text-base">وضع العرض التجريبي</span>
              <UBadge color="amber" variant="subtle" size="xs">Demo</UBadge>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              size="xs"
              @click="isOpen = false"
            />
          </div>
        </template>

        <div class="divide-y dark:divide-gray-700">
          <!-- ترحيب -->
          <div class="px-5 py-4">
            <UAlert
              icon="i-heroicons-information-circle"
              color="primary"
              variant="subtle"
              title="هذا عرض تجريبي"
              description="البيانات المعروضة وهمية لأغراض العرض. يمكنك استكشاف كل وظائف النظام بحرية."
              :ui="{ description: 'text-xs mt-1' }"
            />
          </div>

          <!-- زر الجولة -->
          <div class="px-5 py-4">
            <UButton
              icon="i-heroicons-play-circle"
              color="primary"
              variant="outline"
              block
              @click="startTour"
            >
              ابدأ الجولة التفاعلية
            </UButton>
          </div>

          <!-- بيانات الدخول -->
          <div class="px-5 py-4">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              بيانات الدخول التجريبية
            </p>
            <div class="space-y-2">
              <div
                v-for="acc in accounts"
                :key="acc.email"
                class="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div :class="[acc.iconBg, 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0']">
                  <UIcon :name="acc.icon" :class="[acc.iconColor, 'w-4 h-4']" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ acc.label }}</p>
                  <p class="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate">{{ acc.email }}</p>
                </div>
                <UButton
                  icon="i-heroicons-clipboard-document"
                  color="gray"
                  variant="ghost"
                  size="2xs"
                  :title="`نسخ ${acc.email}`"
                  @click="copyToClipboard(acc.email)"
                />
              </div>
            </div>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-2 text-center">
              كلمة المرور لجميع الحسابات:
              <span class="font-mono font-semibold text-gray-600 dark:text-gray-300 select-all">Demo@1234</span>
              <UButton
                icon="i-heroicons-clipboard-document"
                color="gray"
                variant="ghost"
                size="2xs"
                class="ms-1"
                @click="copyToClipboard('Demo@1234')"
              />
            </p>
          </div>

          <!-- نصائح الصفحة الحالية -->
          <div v-if="pageTips.length" class="px-5 py-4">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              💡 نصائح هذه الصفحة
            </p>
            <ul class="space-y-1.5">
              <li
                v-for="(tip, i) in pageTips"
                :key="i"
                class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
              >
                <span class="text-primary-500 mt-0.5">•</span>
                {{ tip }}
              </li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-gray-400 dark:text-gray-500">
              بُني بـ ❤️ لعرض المشاريع
            </span>
            <UButton
              icon="i-heroicons-arrow-right-on-rectangle"
              color="red"
              variant="ghost"
              size="xs"
              @click="logout"
            >
              تسجيل الخروج
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { startTour: launchTour } = useTour();
const { data, signOut } = useAuth();
const route = useRoute();
const toast = useToast();
const isOpen = ref(false);

const accounts = [
  { label: 'المسؤول (Admin)', email: 'admin@demo.com', icon: 'i-heroicons-shield-check', iconBg: 'bg-blue-100 dark:bg-blue-900/40', iconColor: 'text-blue-600 dark:text-blue-400' },
  { label: 'المندوب (Representative)', email: 'rep@demo.com', icon: 'i-heroicons-user-circle', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'المستخدم (User)', email: 'user@demo.com', icon: 'i-heroicons-user', iconBg: 'bg-gray-100 dark:bg-gray-700', iconColor: 'text-gray-600 dark:text-gray-300' },
];

const pageTipsByRoute: Record<string, string[]> = {
  '/': ['الإحصائيات تتغير حسب دور المستخدم المسجّل', 'جرّب تسجيل دخول كمندوب لرؤية إحصائيات مختلفة'],
  '/books': ['يمكنك إضافة كتاب جديد من زر "إضافة كتاب"', 'اضغط على أي كتاب لعرض تفاصيله وتعديله'],
  '/bookstore': ['كل مكتبة مرتبطة بمندوب واحد أو أكثر', 'يمكنك عرض فواتير كل مكتبة من صفحتها'],
  '/representative': ['يمكنك تتبع رصيد كل مندوب ومبيعاته', 'اضغط على المندوب لعرض تفاصيله وفواتيره'],
  '/purchase-invoices': ['الفاتورة تحتوي على الكتب والمبالغ المدفوعة والمتبقية', 'يمكنك الفلترة حسب المندوب أو المكتبة'],
  '/admins': ['يمكن إضافة مسؤولين أو مطورين جدد من هنا'],
  '/all-books': ['عرض شامل لجميع الكتب المتاحة في النظام'],
};

const pageTips = computed(() => pageTipsByRoute[route.path] ?? []);

const userRole = computed<string>(() => (data.value as any)?.data?.data?.role ?? 'user');

const startTour = () => {
  isOpen.value = false;
  setTimeout(() => launchTour(userRole.value), 300);
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ title: 'تم النسخ', icon: 'i-heroicons-check-circle', color: 'green', timeout: 2000 });
  } catch {
    toast.add({ title: 'تعذّر النسخ', color: 'red', timeout: 2000 });
  }
};

const logout = async () => {
  isOpen.value = false;
  await signOut({ callbackUrl: '/login', redirect: true });
};
</script>

<style scoped>
.demo-help-wrapper {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 50;
}

.demo-help-fab {
  animation: demo-pulse 3s ease-in-out infinite;
}

@keyframes demo-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--color-primary-500), 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(var(--color-primary-500), 0); }
}
</style>
