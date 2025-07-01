<script>
  import { onMount } from 'svelte';
  import { users, refreshUsers, setCurrentUser } from '../utils/store.js';
  import * as Card from '$lib/components/ui/card';
  import ProfileCard from './ProfileCard.svelte';

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
          <ProfileCard 
            {user} 
            variant="select" 
            onUserSelect={selectUser}
          />
        {/each}
      </div>
    {/if}
  </Card.Content>
</Card.Card>
