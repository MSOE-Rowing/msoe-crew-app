<script>
  import { onMount } from 'svelte';
  import { users, sessions, refreshUsers, refreshLeaderboard, logMeters, deleteSession } from '../utils/store.js';
  import { db } from '../services/database.js';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Badge from '$lib/components/ui/badge';
  import ProfileCard from './ProfileCard.svelte';

  let allUsers = [];
  let allSessions = [];
  let selectedUser = null;
  let userSessions = [];
  let isLoading = false;
  let activeTab = 'add-workout';

  // Add workout form
  let newWorkoutMeters = '';
  let isAddingWorkout = false;
  
  // Delete workout state
  let deletingSessionId = null;

  // Quick preset distances
  const presets = [
    { label: '2K', meters: 2000 },
    { label: '5K', meters: 5000 },
    { label: '6K', meters: 6000 },
    { label: '10K', meters: 10000 }
  ];

  users.subscribe(value => allUsers = value);

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      isLoading = true;
      await refreshUsers();
      await loadAllSessions();
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      isLoading = false;
    }
  }

  async function loadAllSessions() {
    try {
      allSessions = await db.getSessions();
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }

  function selectUser(user) {
    selectedUser = user;
    updateUserSessions();
  }

  function updateUserSessions() {
    if (selectedUser) {
      userSessions = allSessions.filter(session => session.userId === selectedUser.id);
      // Sort by date, newest first
      userSessions.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
    } else {
      userSessions = [];
    }
  }

  async function addWorkout() {
    if (!selectedUser || !newWorkoutMeters || isAddingWorkout) return;

    const meters = parseInt(newWorkoutMeters);
    if (isNaN(meters) || meters <= 0) {
      alert('Please enter a valid number of meters');
      return;
    }

    try {
      isAddingWorkout = true;
      await logMeters(selectedUser.id, meters);
      
      // Update sessions immediately for smoother UX
      await loadAllSessions();
      updateUserSessions();
      
      newWorkoutMeters = '';
      showSuccessMessage(`Successfully added ${meters.toLocaleString()} meters to ${selectedUser.name}`);
    } catch (error) {
      console.error('Failed to add workout:', error);
      alert('Failed to add workout. Please try again.');
    } finally {
      isAddingWorkout = false;
    }
  }

  async function removeWorkout(sessionId) {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
      deletingSessionId = sessionId;
      console.log('Admin deleting session:', sessionId);
      await deleteSession(sessionId);
      
      // Update local state immediately for smoother UX
      userSessions = userSessions.filter(session => session.id !== sessionId);
      
      // Refresh data in background
      loadData();
      
      console.log('Session deleted successfully');
      // Use a non-blocking notification instead of alert
      showSuccessMessage('Workout deleted successfully');
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert(`Failed to delete workout: ${error.message}`);
    } finally {
      deletingSessionId = null;
    }
  }
  
  // Success message state
  let successMessage = '';
  let showSuccess = false;
  
  function showSuccessMessage(message) {
    successMessage = message;
    showSuccess = true;
    setTimeout(() => {
      showSuccess = false;
    }, 3000);
  }

  function setPreset(meters) {
    newWorkoutMeters = meters.toString();
  }

  function handleKeypress(event) {
    if (event.key === 'Enter') {
      addWorkout();
    }
  }

  function formatDate(date) {
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
</script>

<div class="container mx-auto p-2 md:p-4 max-w-4xl">
  <!-- Success notification -->
  {#if showSuccess}
    <div class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right duration-300">
      <span class="text-sm">✅</span>
      <span class="text-sm font-medium">{successMessage}</span>
    </div>
  {/if}

  <!-- Compact header for mobile -->
  <div class="mb-4 md:mb-6">
    <div class="flex items-center gap-2 md:gap-3 mb-2">
      <Badge.Badge variant="destructive" class="text-xs md:text-sm font-bold">
        🛡️ <span class="hidden sm:inline">ADMIN</span>
      </Badge.Badge>
      <h2 class="text-xl md:text-3xl font-bold">Admin Panel</h2>
    </div>
    <p class="text-sm md:text-base text-muted-foreground">Manage workouts for all users</p>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center p-8">
      <div class="text-center">
        <div class="text-lg">Loading admin data...</div>
      </div>
    </div>
  {:else}
    <!-- User Selection -->
    <Card.Root class="mb-6">
      <Card.Header>
        <Card.Title>Select User</Card.Title>
        <Card.Description>Choose a user to manage their workouts</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {#each allUsers as user}
            <button
              class="text-left transition-all duration-200 rounded-lg border-2 {selectedUser?.id === user.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
              onclick={() => selectUser(user)}
            >
              <div class="p-4">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🚣</span>
                  <div class="flex-1">
                    <div class="font-semibold">{user.name}</div>
                    <div class="text-sm text-primary font-medium">
                      {user.totalMeters.toLocaleString()} meters
                    </div>
                    <div class="text-xs text-muted-foreground">{user.status}</div>
                  </div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>

    {#if selectedUser}
      <!-- Selected User Profile -->
      <div class="mb-6">
        <ProfileCard user={selectedUser} variant="profile" />
      </div>

      <!-- Admin Actions -->
      <Tabs.Root value={activeTab} onValueChange={(value) => activeTab = value} class="w-full">
        <Tabs.List class="grid w-full grid-cols-2 mb-4 md:mb-6 gap-1">
          <Tabs.Trigger value="add-workout" class="text-xs md:text-sm">
            <span>➕</span>
            <span class="hidden sm:inline ml-1">Add Workout</span>
            <span class="sm:hidden ml-1">Add</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="manage-workouts" class="text-xs md:text-sm">
            <span>🗑️</span>
            <span class="hidden sm:inline ml-1">Manage Workouts</span>
            <span class="sm:hidden ml-1">Manage</span>
          </Tabs.Trigger>
        </Tabs.List>

        <!-- Add Workout Tab -->
        <Tabs.Content value="add-workout">
          <Card.Root>
            <Card.Header>
              <Card.Title>Add Workout for {selectedUser.name}</Card.Title>
              <Card.Description>Add meters rowed to this user's account</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
              <div class="space-y-2">
                <label for="admin-meters" class="text-sm font-medium">Meters Rowed</label>
                <Input 
                  id="admin-meters"
                  type="number" 
                  bind:value={newWorkoutMeters}
                  on:keypress={handleKeypress}
                  placeholder="Enter meters..."
                  min="1"
                  step="1"
                  disabled={isAddingWorkout}
                />
              </div>
              
              <div class="space-y-3">
                <span class="text-sm font-medium">Quick distances:</span>
                <div class="flex flex-wrap gap-2">
                  {#each presets as preset}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onclick={() => setPreset(preset.meters)}
                      disabled={isAddingWorkout}
                    >
                      {preset.label}
                    </Button>
                  {/each}
                </div>
              </div>

              <Button 
                class="w-full"
                onclick={addWorkout}
                disabled={!newWorkoutMeters || isAddingWorkout}
              >
                {#if isAddingWorkout}
                  Adding Workout...
                {:else}
                  Add Workout to {selectedUser.name}
                {/if}
              </Button>
            </Card.Content>
          </Card.Root>
        </Tabs.Content>

        <!-- Manage Workouts Tab -->
        <Tabs.Content value="manage-workouts">
          <Card.Root>
            <Card.Header>
              <Card.Title>Manage {selectedUser.name}'s Workouts</Card.Title>
              <Card.Description>{userSessions.length} workout{userSessions.length !== 1 ? 's' : ''} found</Card.Description>
            </Card.Header>
            <Card.Content>
              {#if userSessions.length === 0}
                <div class="text-center py-8 text-muted-foreground">
                  <div class="text-4xl mb-4">🚣</div>
                  <p>No workouts found for this user.</p>
                </div>
              {:else}
                <div class="space-y-3">
                  {#each userSessions as session}
                    <div class="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div class="flex items-center gap-4">
                        <Badge.Badge variant="outline" class="font-mono">
                          {session.meters.toLocaleString()}m
                        </Badge.Badge>
                        <div>
                          <div class="text-sm text-muted-foreground">
                            {formatDate(session.date)}
                          </div>
                          <div class="text-xs text-muted-foreground font-mono">
                            ID: {session.id}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onclick={() => removeWorkout(session.id)}
                        disabled={deletingSessionId === session.id}
                      >
                        {#if deletingSessionId === session.id}
                          <span class="animate-spin mr-1">⏳</span>
                          Deleting...
                        {:else}
                          Delete
                        {/if}
                      </Button>
                    </div>
                  {/each}
                </div>
              {/if}
            </Card.Content>
          </Card.Root>
        </Tabs.Content>
      </Tabs.Root>
    {:else}
      <Card.Root>
        <Card.Content class="text-center py-8">
          <div class="text-4xl mb-4">👆</div>
          <p class="text-muted-foreground">Select a user above to manage their workouts</p>
        </Card.Content>
      </Card.Root>
    {/if}
  {/if}
</div>
