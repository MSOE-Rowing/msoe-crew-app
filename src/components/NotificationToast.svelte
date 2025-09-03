<script>
  export let show = false;
  export let message = '';
  export let variant = 'success'; // success | warning | error
  export let timeout = 3000; // not used internally (parent controls show) but documented

  const variants = {
    success: { bar: 'bg-emerald-500', icon: '✅', label: 'Success', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    warning: { bar: 'bg-amber-500', icon: '⚠️', label: 'Warning', iconColor: 'text-amber-600 dark:text-amber-400' },
    error:   { bar: 'bg-red-500', icon: '❌', label: 'Error', iconColor: 'text-red-600 dark:text-red-400' }
  };

  $: v = variants[variant] || variants.success;
</script>

{#if show && message}
  <div role="status" aria-live="polite"
    class="fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg flex items-start gap-3 animate-in slide-in-from-right duration-300 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border border-border relative"
  >
    <span class={`absolute inset-y-0 left-0 w-1 rounded-l-md ${v.bar}`} aria-hidden="true"></span>
    <span class={`text-base leading-none mt-[1px] ${v.iconColor}`} aria-hidden="true">{v.icon}</span>
    <span class="text-sm font-medium pr-1 text-foreground">{message}</span>
  </div>
{/if}
