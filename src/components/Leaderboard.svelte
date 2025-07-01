<script>
  import { onMount } from 'svelte';
  import { leaderboard, isLoading, refreshLeaderboard } from '../utils/store.js';
  import * as Card from '$lib/components/ui/card';
  import * as Badge from '$lib/components/ui/badge';
  import * as Button from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';

  let leaderboardData = [];
  let loading = false;

  onMount(() => refreshLeaderboard());

  leaderboard.subscribe(value => leaderboardData = value);
  isLoading.subscribe(value => loading = value);

  function formatMeters(meters) {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}k`;
    }
    return meters.toString();
  }

  function getRankEmoji(rank) {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈'; 
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  }

  function getRankVariant(rank) {
    switch(rank) {
      case 1: return 'default';
      case 2: return 'secondary';
      case 3: return 'outline';
      default: return 'outline';
    }
  }
</script>

<Card.Root class="max-w-4xl mx-auto">
  <Card.Header>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Card.Title class="text-2xl">Season Leaderboard</Card.Title>
        <Badge.Badge variant="outline" class="text-xs">
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
          <div class="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <div class="flex items-center justify-center w-12">
              <Badge.Badge variant={getRankVariant(user.rank)} class="text-sm font-bold">
                {getRankEmoji(user.rank)}
              </Badge.Badge>
            </div>
            
            <div class="flex-1">
              <div class="font-semibold text-lg">{user.name}</div>
              <div class="text-sm text-muted-foreground">{formatMeters(user.totalMeters)} meters total</div>
            </div>
            
            <div class="text-right">
              <div class="text-xl font-bold text-primary">{user.totalMeters.toLocaleString()}</div>
              <div class="text-sm text-muted-foreground">meters</div>
            </div>
          </div>
          
          {#if index < leaderboardData.length - 1}
            <Separator />
          {/if}
        {/each}
      </div>
    {/if}
  </Card.Content>
</Card.Root>
