<script>
  import './app.css';
  import { onMount } from 'svelte';
  import Leaderboard from './components/Leaderboard.svelte';
  import LogMeters from './components/LogMeters.svelte';
  import Profile from './components/Profile.svelte';
  import PWAInstall from './components/PWAInstall.svelte';
  import OnlineStatus from './components/OnlineStatus.svelte';
  import UpdatePrompt from './components/UpdatePrompt.svelte';
  import { initializeApp, isLoading } from './utils/store.js';
  import { currentView } from './utils/navigation.js';
  import * as Tabs from '$lib/components/ui/tabs';
  
  let view = 'leaderboard';
  let loading = true;
  
  currentView.subscribe(value => view = value);
  isLoading.subscribe(value => loading = value);
  
  onMount(() => initializeApp());

  function handleTabChange(value) {
    currentView.set(value);
  }
</script>

<div class="min-h-screen bg-background">
  <OnlineStatus />
  
  <header class="border-b bg-card shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/src/assets/MSOE_logo.svg" alt="MSOE Logo" class="h-8 w-auto" />
          <div class="flex flex-col">
            <h1 class="text-xl font-bold text-foreground">MSOE Rowing</h1>
            <p class="text-sm text-muted-foreground font-medium">DAY BY DAY!</p>
          </div>
        </div>
        <img src="/src/assets/raiders_logo.svg" alt="Raiders Logo" class="h-10 w-auto" />
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-6">
    {#if loading}
      <div class="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <div class="mb-6">
          <img src="/src/assets/MSOE_logo.svg" alt="MSOE Logo" class="h-16 w-auto animate-pulse" />
        </div>
        <div class="text-xl font-semibold mb-2">MSOE Rowing</div>
        <p class="text-sm">DAY BY DAY!</p>      <div class="mt-4 text-sm">Loading...</div>
    </div>
  {:else}
    <PWAInstall />
    <UpdatePrompt />
    
    <Tabs.Root value={view} onValueChange={handleTabChange} class="w-full">
        <Tabs.List class="grid w-full grid-cols-3 mb-6">
          <Tabs.Trigger value="leaderboard" class="flex items-center gap-2">
            🏆 Leaderboard
          </Tabs.Trigger>
          <Tabs.Trigger value="log" class="flex items-center gap-2">
            ➕ Log Meters
          </Tabs.Trigger>
          <Tabs.Trigger value="profile" class="flex items-center gap-2">
            👤 Profile
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="leaderboard">
          <Leaderboard />
        </Tabs.Content>
        
        <Tabs.Content value="log">
          <LogMeters />
        </Tabs.Content>
        
        <Tabs.Content value="profile">
          <Profile />
        </Tabs.Content>
      </Tabs.Root>
    {/if}
  </main>
</div>


