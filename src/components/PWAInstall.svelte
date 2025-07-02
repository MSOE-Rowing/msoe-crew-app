<script>
  import { onMount } from 'svelte';
  import * as Button from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';

  let deferredPrompt = null;
  let showInstallCard = false;
  let isInstalled = false;

  onMount(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      isInstalled = true;
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Save the event for later use
      deferredPrompt = e;
      showInstallCard = true;
    });

    // Listen for the app to be installed
    window.addEventListener('appinstalled', () => {
      isInstalled = true;
      showInstallCard = false;
      deferredPrompt = null;
    });
  });

  async function installApp() {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
    showInstallCard = false;
  }

  function dismissInstall() {
    showInstallCard = false;
    deferredPrompt = null;
  }
</script>

{#if showInstallCard && !isInstalled}
  <Card.Card class="mb-4 border-primary/20 bg-primary/5">
    <Card.Content class="pt-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="text-2xl">📱</div>
          <div>
            <h3 class="font-semibold">Install MSOE Rowing App</h3>
            <p class="text-sm text-muted-foreground">Add to your home screen for quick access and stay logged in</p>
          </div>
        </div>
        <div class="flex gap-2">
          <Button.Button size="sm" onclick={installApp}>
            Install
          </Button.Button>
          <Button.Button size="sm" variant="ghost" onclick={dismissInstall}>
            ✕
          </Button.Button>
        </div>
      </div>
    </Card.Content>
  </Card.Card>
{/if}
