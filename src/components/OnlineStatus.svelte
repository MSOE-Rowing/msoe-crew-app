<script>
  import { onMount } from 'svelte';

  let isOnline = true;

  onMount(() => {
    // Set initial state
    isOnline = navigator.onLine;

    // Listen for online/offline events
    const handleOnline = () => {
      isOnline = true;
    };

    const handleOffline = () => {
      isOnline = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });
</script>

{#if !isOnline}
  <div class="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 text-center py-2 text-sm font-medium">
    📡 You're offline - Changes will sync when reconnected
  </div>
{/if}
