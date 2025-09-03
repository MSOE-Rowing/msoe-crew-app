<script>
  import { isAuthenticated, authLoading, currentUser } from '../utils/store.js';
  import { authService } from '../services/auth.js';
  import { Button } from '$lib/components/ui/button';
  
  let showDebug = false;
  
  // Toggle debug info
  function toggleDebug() {
    showDebug = !showDebug;
  }
  
  function checkAuthState() {
    console.log('=== AUTH DEBUG ===');
    console.log('isAuthenticated:', $isAuthenticated);
    console.log('authLoading:', $authLoading);
    console.log('currentUser:', $currentUser);
    console.log('Firebase currentUser:', authService.getCurrentUser());
    console.log('=================');
  }
</script>

<!-- Debug toggle button (only in development) -->
{#if import.meta.env.DEV}
  <div class="fixed bottom-4 left-4 z-50">
  <Button size="sm" variant="outline" class="text-xs opacity-60 hover:opacity-100 h-7 px-2" onclick={toggleDebug}>🐛 Auth Debug</Button>
    
    {#if showDebug}
      <div class="mt-2 bg-gray-900 text-white p-3 rounded text-xs max-w-xs">
        <div class="mb-2 font-bold">Auth State:</div>
        <div>Authenticated: {$isAuthenticated ? '✅' : '❌'}</div>
        <div>Loading: {$authLoading ? '⏳' : '✅'}</div>
        <div>User: {$currentUser?.name || 'None'}</div>
        <div>Email: {$currentUser?.email || 'None'}</div>
  <Button size="sm" class="mt-2 h-7 text-xs px-2" onclick={checkAuthState}>Console Log</Button>
      </div>
    {/if}
  </div>
{/if}
