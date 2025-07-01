<script>
  import { addNewUser, setCurrentUser } from '../utils/store.js';
  import { db } from '../services/database.js';
  import * as Card from '$lib/components/ui/card';
  import * as Button from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  export let onUserCreated = () => {};
  export let onCancel = () => {};

  let newUserName = '';
  let isAddingUser = false;

  async function addUser() {
    if (!newUserName.trim() || isAddingUser) return;

    try {
      isAddingUser = true;
      const userId = await addNewUser(newUserName.trim());
      
      const users = await db.getUsers();
      const newUser = users.find(u => u.id === userId);
      setCurrentUser(newUser);
      
      newUserName = '';
      onUserCreated(newUser);
    } catch (error) {
      alert('Failed to add user. Please try again.');
    } finally {
      isAddingUser = false;
    }
  }

  function handleKeypress(event) {
    if (event.key === 'Enter') {
      addUser();
    }
  }

  function handleCancel() {
    newUserName = '';
    onCancel();
  }
</script>

<Card.Card>
  <Card.Header>
    <Card.Title>Create Your Profile</Card.Title>
    <Card.Description>Enter your name to create a new profile</Card.Description>
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
    <div class="flex gap-2">
      <Button.Button 
        class="flex-1"
        onclick={addUser}
        disabled={!newUserName.trim() || isAddingUser}
      >
        {#if isAddingUser}
          Creating...
        {:else}
          Create Profile
        {/if}
      </Button.Button>
      <Button.Button 
        variant="outline"
        onclick={handleCancel}
        disabled={isAddingUser}
      >
        Cancel
      </Button.Button>
    </div>
  </Card.Content>
</Card.Card>
