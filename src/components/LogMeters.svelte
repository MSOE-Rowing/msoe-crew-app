<script>
  import { currentUser, logMeters } from '../utils/store.js';
  import { currentView } from '../utils/navigation.js';
  import * as Card from '$lib/components/ui/card';
  import * as Button from '$lib/components/ui/button';
  import * as Badge from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import ProfileCard from './ProfileCard.svelte';

  let selectedUser = null;
  let metersInput = '';
  let isSubmitting = false;
  
  // Success message state
  let successMessage = '';
  let showSuccess = false;

  const presets = [
    { label: '2K', meters: 2000 },
    { label: '5K', meters: 5000 },
    { label: '6K', meters: 6000 },
    { label: '10K', meters: 10000 }
  ];
  
  currentUser.subscribe(value => selectedUser = value);

  async function submitMeters() {
    if (!selectedUser || !metersInput || isSubmitting) return;

    const meters = parseInt(metersInput);
    if (isNaN(meters) || meters <= 0) {
      alert('Please enter a valid number of meters');
      return;
    }

    try {
      isSubmitting = true;
      await logMeters(selectedUser.id, meters);
      
      showSuccessMessage(`Successfully logged ${meters.toLocaleString()} meters!`);
      metersInput = '';
    } catch (error) {
      alert('Failed to log meters. Please try again.');
    } finally {
      isSubmitting = false;
    }
  }
  
  function showSuccessMessage(message) {
    successMessage = message;
    showSuccess = true;
    setTimeout(() => {
      showSuccess = false;
    }, 3000);
  }

  function handleKeypress(event) {
    if (event.key === 'Enter') {
      submitMeters();
    }
  }

  function setPreset(meters) {
    metersInput = meters.toString();
  }
</script>

<div class="container mx-auto p-4 max-w-2xl">
  <!-- Success notification -->
  {#if showSuccess}
    <div class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right duration-300">
      <span class="text-sm">✅</span>
      <span class="text-sm font-medium">{successMessage}</span>
    </div>
  {/if}

  <h2 class="text-3xl font-bold text-center mb-6">Log Meters</h2>

  {#if !selectedUser}
    <Card.Card>
      <Card.Header class="text-center">
        <div class="text-4xl mb-4">🚣</div>
        <Card.Title>Select Your Profile First</Card.Title>
        <Card.Description>
          Go to the Profile tab to select or create your profile before logging meters.
        </Card.Description>
        <div class="mt-3">
          <Badge.Badge variant="secondary" class="text-xs">
            DAY BY DAY!
          </Badge.Badge>
        </div>
      </Card.Header>
    </Card.Card>
  {:else}
    <div class="space-y-6">
      <ProfileCard 
        user={selectedUser} 
        variant="log" 
      />

      <Card.Card>
        <Card.Header>
          <Card.Title>Log Meters</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div class="space-y-2">
            <label for="meters" class="text-sm font-medium">Meters Rowed</label>
            <Input 
              id="meters"
              type="number" 
              bind:value={metersInput}
              on:keypress={handleKeypress}
              placeholder="Enter meters..."
              min="1"
              step="1"
            />
          </div>
          
          <div class="space-y-3">
            <span class="text-sm font-medium">Quick distances:</span>
            <div class="flex flex-wrap gap-2">
              {#each presets as preset}
                <Button.Button 
                  variant="outline" 
                  size="sm"
                  onclick={() => setPreset(preset.meters)}
                >
                  {preset.label}
                </Button.Button>
              {/each}
            </div>
          </div>

          <Button.Button 
            class="w-full"
            onclick={submitMeters}
            disabled={!metersInput || isSubmitting}
          >
            {#if isSubmitting}
              Logging...
            {:else}
              Log Meters
            {/if}
          </Button.Button>
        </Card.Content>
      </Card.Card>
    </div>
  {/if}
</div>
