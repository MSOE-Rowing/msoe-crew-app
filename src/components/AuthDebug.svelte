<script>
  import { isAuthenticated, authLoading, currentUser } from '../utils/store.js';
  import { authService } from '../services/auth.js';
  
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
    <button 
      class="bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-50 hover:opacity-100"
      onclick={toggleDebug}
    >
      🐛 Auth Debug
    </button>
    
    {#if showDebug}
      <div class="mt-2 bg-gray-900 text-white p-3 rounded text-xs max-w-xs">
        <div class="mb-2 font-bold">Auth State:</div>
        <div>Authenticated: {$isAuthenticated ? '✅' : '❌'}</div>
        <div>Loading: {$authLoading ? '⏳' : '✅'}</div>
        <div>User: {$currentUser?.name || 'None'}</div>
        <div>Email: {$currentUser?.email || 'None'}</div>
        <button 
          class="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
          onclick={checkAuthState}
        >
          Console Log
        </button>
      </div>
    {/if}
  </div>
{/if}
