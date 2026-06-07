<template>
  <div class="demo-credentials-cards mt-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      <span class="text-xs text-gray-500 dark:text-gray-400 font-semibold whitespace-nowrap">
        أو جرّب حساباً تجريبياً
      </span>
      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>

    <div class="grid grid-cols-1 gap-2">
      <button
        v-for="account in accounts"
        :key="account.email"
        type="button"
        :disabled="loading"
        class="demo-card group flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-sm transition-all duration-200 text-right w-full disabled:opacity-60 disabled:cursor-not-allowed"
        @click="$emit('select', { email: account.email, password: account.password })"
      >
        <div
          :class="[account.iconBg, 'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center']"
        >
          <UIcon :name="account.icon" :class="[account.iconColor, 'w-5 h-5']" />
        </div>

        <div class="flex-1 min-w-0 text-start">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {{ account.label }}
            </span>
            <span
              :class="[account.badgeBg, account.badgeColor, 'text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden sm:inline']"
            >
              {{ account.role }}
            </span>
          </div>
          <p class="text-[11px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 truncate">
            {{ account.email }}
          </p>
        </div>

        <UIcon
          name="i-heroicons-arrow-left-16-solid"
          class="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0"
        />
      </button>
    </div>

    <p class="text-[11px] text-center text-gray-400 dark:text-gray-500 mt-3">
      اضغط على أي بطاقة للدخول التلقائي &bull; كلمة المرور:
      <span class="font-mono font-semibold text-gray-600 dark:text-gray-300">Demo@1234</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ loading: boolean }>();
defineEmits<{ select: [account: { email: string; password: string }] }>();

const accounts = [
  {
    label: 'المسؤول (Admin)',
    role: 'admin',
    email: 'admin@demo.com',
    password: 'Demo@1234',
    icon: 'i-heroicons-shield-check',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
    badgeColor: 'text-blue-700 dark:text-blue-300',
  },
  {
    label: 'المندوب (Representative)',
    role: 'representative',
    email: 'rep@demo.com',
    password: 'Demo@1234',
    icon: 'i-heroicons-user-circle',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    badgeColor: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    label: 'المستخدم (User)',
    role: 'user',
    email: 'user@demo.com',
    password: 'Demo@1234',
    icon: 'i-heroicons-user',
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-gray-600 dark:text-gray-300',
    badgeBg: 'bg-gray-100 dark:bg-gray-700',
    badgeColor: 'text-gray-700 dark:text-gray-300',
  },
];
</script>
