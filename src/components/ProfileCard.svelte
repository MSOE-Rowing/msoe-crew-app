<script>
  import * as Card from '$lib/components/ui/card';
  import * as Button from '$lib/components/ui/button';
  import * as Badge from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { updateUserStatus } from '../utils/store.js';

  // Props
  export let user;
  export let variant = 'profile'; // 'leaderboard', 'profile', 'log', 'select'
  export let rank = null;
  export let onUserSelect = () => {};
  export let isCurrentUser = false; // Highlight if this is the current user

  // Status editing state
  let editingStatus = false;
  let newStatus = '';
  let isUpdatingStatus = false;

  // Variant configuration
  $: config = {
    leaderboard: {
      container: `flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${isCurrentUser ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`,
      isCard: false,
      avatarSize: 'text-2xl',
      nameSize: `font-semibold text-lg ${isCurrentUser ? 'text-primary font-bold' : ''}`,
      showRank: true,
      showMeters: true,
      clickable: false,
      showLogoutButton: false,
    },
    select: {
      container: 'flex items-center gap-3 p-4 h-auto text-left justify-start hover:bg-accent w-full',
      isCard: false,
      isButton: true,
      avatarSize: 'text-2xl',
      nameSize: 'font-semibold',
      showRank: false,
      showMeters: false,
      clickable: true,
      showLogoutButton: false,
    },
    log: {
      container: '',
      isCard: true,
      avatarSize: 'text-2xl',
      nameSize: 'font-semibold text-lg',
      showRank: false,
      showMeters: true,
      clickable: false,
      showLogoutButton: false,
    },
    profile: {
      container: '',
      isCard: true,
      avatarSize: 'text-4xl',
      nameSize: 'font-semibold text-lg',
      showRank: false,
      showMeters: true,
      clickable: false,
      allowStatusEdit: true,
    }
  };

  $: currentConfig = config[variant];

  // Variant-specific formatting
  function formatMeters(meters) {
    if (variant === 'leaderboard' && meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}k`;
    }
    return meters.toLocaleString();
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

  // Status editing functions
  function startEditingStatus() {
    newStatus = user.status || 'Ready to row! 🚣';
    editingStatus = true;
  }

  function cancelEditingStatus() {
    editingStatus = false;
    newStatus = '';
  }

  async function saveStatus() {
    if (!user || !newStatus.trim() || isUpdatingStatus) return;

    try {
      isUpdatingStatus = true;
      await updateUserStatus(user.id, newStatus.trim());
      editingStatus = false;
      newStatus = '';
    } catch (error) {
      alert('Failed to update status. Please try again.');
    } finally {
      isUpdatingStatus = false;
    }
  }

  function handleStatusKeypress(event) {
    if (event.key === 'Enter') {
      saveStatus();
    } else if (event.key === 'Escape') {
      cancelEditingStatus();
    }
  }

  function handleClick() {
    if (currentConfig.clickable) {
      onUserSelect(user);
    }
  }

  // Common content components
  $: userNameDisplay = user.name;
  $: userStatus = user.status || 'Ready to row! 🚣';
  $: shouldShowMeters = currentConfig.showMeters && user.totalMeters;
</script>

<!-- Unified content component -->
{#snippet userContent()}
  <span class={currentConfig.avatarSize}>🚣</span>
  <div class="flex-1">
    <div class={currentConfig.nameSize}>{userNameDisplay}</div>
    
    {#if shouldShowMeters}
      <p class="text-primary font-semibold text-lg">
        {formatMeters(user.totalMeters)} meters total
      </p>
    {/if}
    
    <!-- Status section -->
    {#if variant === 'profile' && currentConfig.allowStatusEdit}
      {#if editingStatus}
        <div class="mt-2 flex gap-2 items-center">
          <Input
            bind:value={newStatus}
            on:keypress={handleStatusKeypress}
            placeholder="Enter your status..."
            maxlength="100"
            disabled={isUpdatingStatus}
            class="text-sm"
          />
          <Button.Button size="sm" onclick={saveStatus} disabled={isUpdatingStatus || !newStatus.trim()}>
            {#if isUpdatingStatus}⏳{:else}✓{/if}
          </Button.Button>
          <Button.Button size="sm" variant="outline" onclick={cancelEditingStatus} disabled={isUpdatingStatus}>
            ✕
          </Button.Button>
        </div>
      {:else}
        <div class="mt-1 flex items-center gap-2">
          <span class="text-sm text-muted-foreground italic">{userStatus}</span>
          <Button.Button size="sm" variant="ghost" onclick={startEditingStatus} class="h-6 px-2 text-xs">
            Edit
          </Button.Button>
        </div>
      {/if}
    {:else}
      <div class="text-sm text-muted-foreground">{userStatus}</div>
    {/if}
  </div>
{/snippet}

<!-- Main structure -->
{#if currentConfig.isButton}
  <Button.Button variant="outline" class={currentConfig.container} onclick={handleClick}>
    {@render userContent()}
  </Button.Button>
{:else if currentConfig.isCard}
  <Card.Card>
    <Card.Header>
      <div class="flex items-center gap-3">
        {@render userContent()}
      </div>
    </Card.Header>
  </Card.Card>
{:else}
  <!-- Leaderboard variant -->
  <div class={currentConfig.container}>
    {#if currentConfig.showRank}
      <div class="flex items-center justify-center w-12">
        <Badge.Badge variant={getRankVariant(rank)} class="text-sm font-bold">
          {getRankEmoji(rank)}
        </Badge.Badge>
      </div>
    {/if}
    
    {@render userContent()}
    
    {#if variant === 'leaderboard' && shouldShowMeters}
      <div class="text-right">
        <div class="text-xl font-bold text-primary">{user.totalMeters.toLocaleString()}</div>
        <div class="text-sm text-muted-foreground">meters</div>
      </div>
    {/if}
  </div>
{/if}
