<script>
  export let show = false;
  export let message = '';
  export let variant = 'success'; // success | warning | error
  export let timeout = 3000; // informational only (parent handles lifecycle)

  // Accessible color system: neutral surface + colored accent bar for contrast
  const variants = {
    success: { bar: 'bg-emerald-500', icon: '✅', label: 'Success', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    warning: { bar: 'bg-amber-500', icon: '⚠️', label: 'Warning', iconColor: 'text-amber-600 dark:text-amber-400' },
    error:   { bar: 'bg-red-500', icon: '❌', label: 'Error', iconColor: 'text-red-600 dark:text-red-400' }
  };

  $: v = variants[variant] || variants.success;
</script>

{#if show && message}
  <div class="pointer-events-none fixed inset-0 z-[100] flex items-start justify-end p-4 sm:p-6">
    <div role="status" aria-live="polite"
      class="pointer-events-auto relative px-4 py-3 rounded-md shadow-xl ring-1 ring-black/10 flex items-start gap-3 animate-in slide-in-from-right fade-in duration-300 bg-background/90 dark:bg-neutral-900/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 border border-border/60 max-w-sm"
    >
      <span class={`absolute inset-y-0 left-0 w-1 rounded-l-md ${v.bar}`} aria-hidden="true"></span>
      <span class={`text-base leading-none mt-[1px] ${v.iconColor}`} aria-hidden="true">{v.icon}</span>
      <span class="text-sm font-medium pr-1 text-foreground">{message}</span>
    </div>
  </div>
{/if}
