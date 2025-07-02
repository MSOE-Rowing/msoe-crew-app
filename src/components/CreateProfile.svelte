<script>
  import { addNewUser } from '../utils/store.js';
  import { authUser } from '../utils/store.js';
  import { get } from 'svelte/store';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  // Callback props to replace createEventDispatcher
  export let onProfileCreated = () => {};

  let newUserName = '';
  let isAddingUser = false;
  let error = '';

  async function createProfile() {
    if (!newUserName.trim() || isAddingUser) return;

    const auth = get(authUser);
    if (!auth) {
      error = 'Authentication required';
      return;
    }

    try {
      isAddingUser = true;
      error = '';
      
      const userId = await addNewUser(newUserName.trim(), 'Ready to row! 🚣', auth.uid);
      
      onProfileCreated();
    } catch (error) {
      console.error('Failed to create profile:', error);
      error = 'Failed to create profile. Please try again.';
    } finally {
      isAddingUser = false;
    }
  }

  function handleKeypress(event) {
    if (event.key === 'Enter') {
      createProfile();
    }
  }
</script>

<div class="min-h-screen bg-background flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-4">
        <img src="/MSOE_logo.svg" alt="MSOE Logo" class="h-12 w-auto" />
        <img src="/raiders_logo.svg" alt="Raiders Logo" class="h-12 w-auto" />
      </div>
      <h1 class="text-2xl font-bold text-foreground">MSOE Rowing</h1>
      <p class="text-muted-foreground font-medium">DAY BY DAY!</p>
    </div>

    <Card.Root>
      <Card.Header>
        <Card.Title>Create Your Profile</Card.Title>
        <Card.Description>Enter your name to start tracking your rowing progress</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Your Name</label>
          <Input
            id="name"
            type="text"
            bind:value={newUserName}
            on:keypress={handleKeypress}
            placeholder="Enter your name..."
            maxlength="50"
            disabled={isAddingUser}
          />
        </div>

        {#if error}
          <div class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        {/if}

        <Button 
          class="w-full"
          onclick={createProfile}
          disabled={!newUserName.trim() || isAddingUser}
        >
          {#if isAddingUser}
            Creating Profile...
          {:else}
            Create Profile
          {/if}
        </Button>
      </Card.Content>
    </Card.Root>

    <!-- Footer -->
    <div class="text-center mt-6 text-sm text-muted-foreground">
      <p>Welcome to the MSOE Rowing Team!</p>
    </div>
  </div>
</div>
