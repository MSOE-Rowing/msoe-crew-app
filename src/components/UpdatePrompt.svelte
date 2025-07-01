<script>
  import { onMount } from 'svelte';
  import * as Button from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';

  let showUpdatePrompt = false;
  let registration = null;

  onMount(() => {
    if ('serviceWorker' in navigator) {
      // Check for updates every 60 seconds when the app is visible
      let updateCheckInterval;
      
      const startUpdateCheck = () => {
        updateCheckInterval = setInterval(() => {
          if (registration) {
            registration.update();
          }
        }, 60000); // Check every minute
      };

      const stopUpdateCheck = () => {
        if (updateCheckInterval) {
          clearInterval(updateCheckInterval);
        }
      };

      // Start checking when page is visible
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          startUpdateCheck();
        } else {
          stopUpdateCheck();
        }
      });

      // Initial check
      if (document.visibilityState === 'visible') {
        startUpdateCheck();
      }

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          registration = reg;
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                showUpdatePrompt = true;
              }
            });
          });
        })
        .catch((error) => {
          console.log('Service worker registration failed:', error);
        });

      return () => {
        stopUpdateCheck();
      };
    }
  });

  function updateApp() {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    showUpdatePrompt = false;
  }

  function dismissUpdate() {
    showUpdatePrompt = false;
  }
</script>

{#if showUpdatePrompt}
  <Card.Card class="mb-4 border-blue-200 bg-blue-50">
    <Card.Content class="pt-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="text-2xl">🔄</div>
          <div>
            <h3 class="font-semibold">Update Available</h3>
            <p class="text-sm text-muted-foreground">A new version of the app is ready to install</p>
          </div>
        </div>
        <div class="flex gap-2">
          <Button.Button size="sm" onclick={updateApp}>
            Update Now
          </Button.Button>
          <Button.Button size="sm" variant="ghost" onclick={dismissUpdate}>
            Later
          </Button.Button>
        </div>
      </div>
    </Card.Content>
  </Card.Card>
{/if}
