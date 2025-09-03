<script>
  import './app.css';
  import { onMount } from 'svelte';
  import Leaderboard from './components/Leaderboard.svelte';
  import LogMeters from './components/LogMeters.svelte';
  import Profile from './components/Profile.svelte';
  import Admin from './components/Admin.svelte';
  import Login from './components/Login.svelte';
  import CreateProfile from './components/CreateProfile.svelte';
  import PWAInstall from './components/PWAInstall.svelte';
  import OnlineStatus from './components/OnlineStatus.svelte';
  import UpdatePrompt from './components/UpdatePrompt.svelte';
  import AuthDebug from './components/AuthDebug.svelte';
  import { 
    initializeApp, 
    initializeAuth, 
    isLoading, 
    authLoading,
    isAuthenticated,
    isAdminUser,
    currentUser,
    signOut
  } from './utils/store.js';
  import { authService } from './services/auth.js';
  import { currentView } from './utils/navigation.js';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Button } from '$lib/components/ui/button';
  import * as Badge from '$lib/components/ui/badge';
  
  let view = 'leaderboard';
  let loading = true;
  let authLoad = true;
  let authenticated = false;
  let isAdmin = false;
  let user = null;
  
  currentView.subscribe(value => view = value);
  isLoading.subscribe(value => loading = value);
  authLoading.subscribe(value => authLoad = value);
  isAuthenticated.subscribe(value => authenticated = value);
  isAdminUser.subscribe(value => isAdmin = value);
  currentUser.subscribe(value => user = value);
  
  onMount(async () => {
    console.log('🚀 App starting...');
    
    // Initialize auth persistence first
    await authService.initializePersistence();
    
    // Check if user is already authenticated
    authService.getCurrentAuthState();
    
    // Initialize authentication listener
    initializeAuth();
    
    // Then initialize the app
    await initializeApp();
    
    console.log('✅ App initialization complete');
  });

  function handleTabChange(value) {
    currentView.set(value);
  }

  function handleAuthSuccess(event) {
    // Authentication successful, auth state will be updated automatically
    // The user might need to create a profile if they're new
  }

  function handleProfileCreated() {
    // Profile created, user data will be updated automatically
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
</script>

<div class="min-h-screen bg-background">
  <OnlineStatus />
  <AuthDebug />
  
  {#if authLoad}
    <!-- Loading authentication state -->
    <div class="flex flex-col items-center justify-center min-h-screen text-muted-foreground">
      <div class="mb-6">
        <img src="/MSOE_logo.svg" alt="MSOE Logo" class="h-16 w-auto animate-pulse" />
      </div>
      <div class="text-xl font-semibold mb-2">MSOE Rowing</div>
      <p class="text-sm mb-4">DAY BY DAY!</p>
      <div class="text-sm">Loading...</div>
    </div>
  {:else if !authenticated}
    <!-- Not authenticated - show login -->
    <Login onAuthSuccess={handleAuthSuccess} />
  {:else if !user}
    <!-- Authenticated but no profile - show create profile -->
    <CreateProfile onProfileCreated={handleProfileCreated} />
  {:else}
    <!-- Authenticated with profile - show main app -->
    <header class="border-b bg-card shadow-sm">
      <div class="container mx-auto px-4 py-3 md:py-4">
        <div class="flex items-center justify-between">
          <!-- Left side - Logo and title -->
          <div class="flex items-center gap-2 md:gap-3">
            <img src="/MSOE_logo.svg" alt="MSOE Logo" class="h-6 md:h-8 w-auto" />
            <div class="flex flex-col">
              <h1 class="text-lg md:text-xl font-bold text-foreground">MSOE Rowing</h1>
              <p class="text-xs md:text-sm text-muted-foreground font-medium hidden sm:block">DAY BY DAY!</p>
            </div>
          </div>
          
          <!-- Right side - User info and actions -->
          <div class="flex items-center gap-2 md:gap-4">
            <!-- Welcome message - hidden on very small screens -->
            <span class="text-xs md:text-sm text-muted-foreground hidden md:block">Welcome, {user.name}!</span>
            
            <!-- Admin badge -->
            {#if isAdmin}
              <Badge.Badge variant="destructive" class="text-xs">
                🛡️ <span class="hidden sm:inline">Admin</span>
              </Badge.Badge>
            {/if}
            
            <!-- Sign out button -->
            <Button variant="outline" size="sm" onclick={handleSignOut} class="text-xs md:text-sm px-2 md:px-3 flex items-center gap-1" title="Sign Out">
              <span class="hidden sm:inline">Sign Out</span>
              <span class="sm:hidden">🚪</span>
            </Button>
            
            <!-- Raiders logo - smaller on mobile -->
            <img src="/raiders_logo.svg" alt="Raiders Logo" class="h-6 md:h-10 w-auto" />
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-3 md:px-4 py-4 md:py-6">
      {#if loading}
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
          <div class="mb-6">
            <!-- Use public root asset path instead of src/ path for production correctness -->
            <img src="/MSOE_logo.svg" alt="MSOE Logo" class="h-16 w-auto animate-pulse" />
          </div>
          <div class="text-xl font-semibold mb-2">MSOE Rowing</div>
          <p class="text-sm">DAY BY DAY!</p>
          <div class="mt-4 text-sm">Loading...</div>
        </div>
      {:else}
        <PWAInstall />
        <UpdatePrompt />
        
        <Tabs.Root value={view} onValueChange={handleTabChange} class="w-full">
          <div class="flex justify-center mb-4 md:mb-6">
            <div class="bg-muted text-muted-foreground rounded-lg p-1 inline-block">
              <div class="flex flex-wrap justify-center gap-1">
                <Tabs.Trigger value="leaderboard" class="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 px-3 md:px-4 min-w-[80px] rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                  <span>🏆</span>
                  <span class="hidden sm:inline">Leaderboard</span>
                  <span class="sm:hidden">Board</span>
                </Tabs.Trigger>
                <Tabs.Trigger value="log" class="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 px-3 md:px-4 min-w-[80px] rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                  <span>➕</span>
                  <span class="hidden sm:inline">Log Meters</span>
                  <span class="sm:hidden">Log</span>
                </Tabs.Trigger>
                <Tabs.Trigger value="profile" class="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 px-3 md:px-4 min-w-[80px] rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                  <span>👤</span>
                  <span class="hidden sm:inline">Profile</span>
                  <span class="sm:hidden">Profile</span>
                </Tabs.Trigger>
                {#if isAdmin}
                  <Tabs.Trigger value="admin" class="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 px-3 md:px-4 min-w-[80px] rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                    <span>🛡️</span>
                    <span class="hidden sm:inline">Admin</span>
                    <span class="sm:hidden">Admin</span>
                  </Tabs.Trigger>
                {/if}
              </div>
            </div>
          </div>
          
          <Tabs.Content value="leaderboard">
            <Leaderboard />
          </Tabs.Content>
          
          <Tabs.Content value="log">
            <LogMeters />
          </Tabs.Content>
          
          <Tabs.Content value="profile">
            <Profile />
          </Tabs.Content>
          
          {#if isAdmin}
            <Tabs.Content value="admin">
              <Admin />
            </Tabs.Content>
          {/if}
        </Tabs.Root>
      {/if}
    </main>
  {/if}
</div>


