/**
 * وضع العرض التجريبي (Demo Mode).
 *
 * مقفول افتراضياً — يُفعَّل فقط بضبط `NUXT_PUBLIC_DEMO_MODE=true`.
 * أي قيمة أخرى (false / 1 / yes / فاضية / غير موجودة) تعني مقفول.
 *
 * لما يكون مفعّلاً بيظهر:
 *   - الجولة التفاعلية التلقائية (useTour)
 *   - زر المساعدة العائم (TheDemoModeDemoHelpButton)
 *   - كروت بيانات الدخول التجريبية في صفحة اللوجين
 */
export const useDemoMode = (): boolean =>
  useRuntimeConfig().public.demoMode === true;
