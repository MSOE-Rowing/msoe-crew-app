<script>
  import { onMount } from 'svelte';
  import { leaderboard, isLoading, refreshLeaderboard, currentUser } from '../utils/store.js';
  import * as Card from '$lib/components/ui/card';
  import * as Badge from '$lib/components/ui/badge';
  import * as Button from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';
  import ProfileCard from './ProfileCard.svelte';

  let leaderboardData = [];
  let loading = false;
  let selectedUser = null;

  onMount(() => refreshLeaderboard());

  leaderboard.subscribe(value => leaderboardData = value);
  isLoading.subscribe(value => loading = value);
  currentUser.subscribe(value => selectedUser = value);
</script>

<Card.Root class="max-w-4xl mx-auto">
  <Card.Header>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Card.Title class="text-2xl">Season Leaderboard</Card.Title>
        <Badge.Badge variant="secondary" class="text-xs">
          DAY BY DAY!
        </Badge.Badge>
      </div>
      <Button.Button 
        variant="outline" 
        size="icon"
        onclick={refreshLeaderboard} 
        disabled={loading}
      >
        <span class:animate-spin={loading}>🔄</span>
      </Button.Button>
    </div>
  </Card.Header>
  
  <Card.Content>
    {#if loading}
      <div class="flex items-center justify-center py-8 text-muted-foreground">
        Loading leaderboard...
      </div>
    {:else if leaderboardData.length === 0}
      <div class="text-center py-8 text-muted-foreground">
        <p>No data yet! Start logging meters to see the leaderboard.</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each leaderboardData as user, index}
          <ProfileCard 
            {user} 
            variant="leaderboard" 
            rank={user.rank}
            isCurrentUser={selectedUser && selectedUser.id === user.id}
          />
          
          {#if index < leaderboardData.length - 1}
            <Separator />
          {/if}
        {/each}
      </div>
    {/if}
  </Card.Content>
</Card.Root>
