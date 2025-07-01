<script>
  import { onMount } from 'svelte';
  import { currentUser, setCurrentUser } from '../utils/store.js';
  import { db } from '../services/database.js';
  import * as Card from '$lib/components/ui/card';   import * as Button from '$lib/components/ui/button';
  import * as Badge from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import UserSelect from './UserSelect.svelte';
  import CreateProfile from './CreateProfile.svelte';
  import ProfileCard from './ProfileCard.svelte';

  let user = null;
  let sessions = [];
  let showCreateProfile = false;

  currentUser.subscribe(value => {
    user = value;
    if (user) loadUserSessions();
  });

  async function loadUserSessions() {
    if (!user) return;
    try {
      sessions = await db.getSessions(user.id);
      sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatMeters(meters) {
    return meters.toLocaleString();
  }

  function logout() {
    setCurrentUser(null);
    showCreateProfile = false;
  }

  function handleUserSelected(selectedUser) {
    // User was selected, component will handle the rest
  }

  function handleUserCreated(newUser) {
    // User was created and set as current, hide create form
    showCreateProfile = false;
  }

  function handleCreateCancel() {
    showCreateProfile = false;
  }

  function showCreateForm() {
    showCreateProfile = true;
  }
</script>

<div class="container mx-auto p-4 max-w-2xl">
  {#if user}
    <div class="space-y-6">
      <ProfileCard 
        {user} 
        variant="profile" 
        showLogoutButton={true}
        onLogout={logout}
      />

      <Card.Card>
        <Card.Header>
          <Card.Title>Recent Sessions</Card.Title>
        </Card.Header>
        <Card.Content>
          {#if sessions.length === 0}
            <div class="text-center py-8">
              <p class="text-muted-foreground">No sessions logged yet. Start rowing!</p>
            </div>
          {:else}
            <div class="space-y-3">
              {#each sessions.slice(0, 10) as session, index}
                <div class="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div class="flex items-center gap-3">
                    <Badge.Badge variant="outline">
                      #{index + 1}
                    </Badge.Badge>
                    <span class="font-medium">{formatDate(session.date)}</span>
                  </div>
                  <div class="text-right">
                    <span class="font-semibold text-primary">{formatMeters(session.meters)}m</span>
                  </div>
                </div>
                {#if index < Math.min(sessions.length, 10) - 1}
                  <Separator />
                {/if}
              {/each}
            </div>
          {/if}
        </Card.Content>
      </Card.Card>
    </div>  {:else}
    <div class="space-y-6">
      <Card.Card>
        <Card.Header class="text-center">
          <div class="text-6xl mb-4">🚣</div>
          <Card.Title class="text-3xl">Welcome to MSOE Rowing!</Card.Title>
          <Card.Description class="text-lg">
            Select your profile or create a new one to get started.
          </Card.Description>
          <div class="mt-2">
            <Badge.Badge variant="secondary" class="text-sm font-semibold">
              DAY BY DAY!
            </Badge.Badge>
          </div>
        </Card.Header>
      </Card.Card>

      <UserSelect onUserSelected={handleUserSelected} />

      {#if !showCreateProfile}
        <div class="text-center">
          <Button.Button onclick={showCreateForm}>
            Create New Profile
          </Button.Button>
        </div>
      {/if}

      {#if showCreateProfile}
        <CreateProfile 
          onUserCreated={handleUserCreated}
          onCancel={handleCreateCancel}
        />
      {/if}
    </div>
  {/if}
</div>
