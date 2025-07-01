<script>
  import { onMount } from 'svelte';
  import { users, refreshUsers, setCurrentUser } from '../utils/store.js';
  import * as Card from '$lib/components/ui/card';
  import * as Button from '$lib/components/ui/button';

  export let onUserSelected = () => {};

  let usersList = [];

  onMount(() => refreshUsers());
  
  users.subscribe(value => usersList = value);

  function selectUser(user) {
    setCurrentUser(user);
    onUserSelected(user);
  }
</script>

<Card.Card>
  <Card.Header>
    <Card.Title>Select Your Profile</Card.Title>
    <Card.Description>Choose your profile to continue</Card.Description>
  </Card.Header>
  <Card.Content>
    {#if usersList.length === 0}
      <p class="text-center text-muted-foreground py-8">
        No profiles found. Create your profile below to get started.
      </p>
    {:else}
      <div class="grid gap-3">
        {#each usersList as user}
          <Button.Button 
            variant="outline" 
            class="flex items-center gap-3 p-4 h-auto text-left justify-start hover:bg-accent"
            onclick={() => selectUser(user)}
          >
            <div class="text-2xl">🚣</div>
            <div class="flex-1">
              <div class="font-semibold">{user.name}</div>
              <div class="text-sm text-muted-foreground">
                {user.totalMeters.toLocaleString()}m total
              </div>
            </div>
          </Button.Button>
        {/each}
      </div>
    {/if}
  </Card.Content>
</Card.Card>
