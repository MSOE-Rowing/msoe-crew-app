<script>
  import { authService } from '../services/auth.js';
  import { emailVerificationError } from '../utils/store.js';
  import * as Card from '$lib/components/ui/card';
  import * as Tabs from '$lib/components/ui/tabs';
  import * as HoverCard from '$lib/components/ui/hover-card';
  import { Button, Root } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { NotificationToast } from '$lib/components/ui/notification-toast';

  // Callback props to replace createEventDispatcher
  export let onAuthSuccess = () => {};

  let email = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let activeTab = 'signin';
  let verificationSent = false;
  let resendingVerification = false;
  let accountCreated = false;
  
  // Notification state
  let showSuccess = false;
  let showWarning = false;
  let showError = false;
  let successMessage = '';
  let warningMessage = '';
  let errorMessage = '';

  // Watch for email verification errors from the store
  $: if ($emailVerificationError && !error) {
    error = 'Email verification required! Please check your email and click the verification link before signing in. Check your spam/junk folder if you don\'t see it.';
    loading = false;
  }

  async function handleSignIn() {
    if (!email || !password) {
      error = 'Please fill in all fields';
      return;
    }

    loading = true;
    error = '';

    try {
      const userCredential = await authService.signInWithEmail(email, password);
      console.log('Sign in successful:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified
      });
      
      console.log('Calling onAuthSuccess callback');
      onAuthSuccess({ user: userCredential.user, isNewUser: false });
    } catch (err) {
      console.error('Sign in error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
          error = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          error = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          error = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          error = 'Too many failed attempts. Please try again later';
          break;
        default:
          error = 'Sign in failed. Please try again';
      }
    } finally {
      loading = false;
    }
  }

  async function handleSignUp() {
    console.log('handleSignUp called with:', { email, password: password ? '***' : '', confirmPassword: confirmPassword ? '***' : '' });
    
    if (!email || !password || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }

    // Validate MSOE email address
    if (!email.toLowerCase().endsWith('@msoe.edu')) {
      error = 'Please use your MSOE email address (@msoe.edu)';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters long';
      return;
    }

    // Additional password strength check
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      error = 'Password must contain at least one letter';
      return;
    }

    loading = true;
    error = '';
    console.log('Attempting to create account...');

    try {
      const userCredential = await authService.signUpWithEmail(email, password);
      console.log('Account created successfully:', userCredential.user.uid);
      
      accountCreated = true;
      
      // Send email verification
      try {
        await authService.sendEmailVerification();
        console.log('Verification email sent to:', userCredential.user.email);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        error = 'Account created but failed to send verification email. Please try to resend it.';
      }
      
      // Sign out the user so they can't access the app without verification
      await authService.signOut();
      console.log('User signed out after account creation');
      
      // Show success notification instead of switching tabs immediately
      console.log('Showing account creation success notification');
      showSuccessMessage(
        `🎉 Account created successfully! We've sent a verification email to ${userCredential.user.email}. Please check your inbox (and spam/junk folder) and click the verification link before signing in.`
      );
      
      // Show verification message and switch to sign-in after notification is shown
      setTimeout(() => {
        console.log('Switching to sign-in tab after notification');
        verificationSent = true;
        activeTab = 'signin';
        password = '';
        confirmPassword = '';
      }, 3500); // Slightly longer than notification timeout
      
    } catch (err) {
      console.error('Sign up error details:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          error = 'An account with this email already exists. Please sign in instead or use a different email address.';
          // Switch to sign-in tab to help user
          setTimeout(() => {
            activeTab = 'signin';
            password = '';
            confirmPassword = '';
          }, 2000);
          break;
        case 'auth/invalid-email':
          error = 'Invalid email address format';
          break;
        case 'auth/weak-password':
          error = 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
          break;
        case 'auth/operation-not-allowed':
          error = 'Email/password sign-up is not enabled. Please contact support.';
          break;
        default:
          error = `Sign up failed: ${err.message}`;
      }
    } finally {
      loading = false;
    }
  }

  function handleTabChange(value) {
    activeTab = value;
    error = '';
    verificationSent = false;
    accountCreated = false;
    password = '';
    confirmPassword = '';
  }
  
  
  function showSuccessMessage(message) {
    console.log('showSuccessMessage called:', { message });
    successMessage = message;
    showSuccess = true;
    setTimeout(() => {
      console.log('Hiding success notification');
      showSuccess = false;
    }, 3000);
  }
  
  function showWarningMessage(message) {
    console.log('showWarningMessage called:', { message });
    warningMessage = message;
    showWarning = true;
    setTimeout(() => {
      console.log('Hiding warning notification');
      showWarning = false;
    }, 3000);
  }
  
  function showErrorMessage(message) {
    console.log('showErrorMessage called:', { message });
    errorMessage = message;
    showError = true;
    setTimeout(() => {
      console.log('Hiding error notification');
      showError = false;
    }, 3000);
  }

  async function resendVerification() {
    if (!email || !password) {
      error = 'Please enter both email and password to resend verification';
      return;
    }

    try {
      resendingVerification = true;
      await authService.resendVerificationEmail(email, password);
      console.log('Showing resend verification success notification');
      showSuccessMessage('Verification email sent! Please check your inbox and spam folder.');
      error = ''; // Clear any existing error
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        error = 'Incorrect password. Please enter the correct password to resend verification.';
      } else {
        error = 'Failed to resend verification email. Please try again.';
      }
    } finally {
      resendingVerification = false;
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      if (activeTab === 'signin') {
        handleSignIn();
      } else {
        handleSignUp();
      }
    }
  }
</script>

<div class="min-h-screen bg-background flex items-center justify-center p-4">
  <NotificationToast show={showSuccess} message={successMessage} variant="success" />
  <NotificationToast show={showWarning} message={warningMessage} variant="warning" />
  <NotificationToast show={showError} message={errorMessage} variant="error" />

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

    <!-- Auth Card -->
    <Card.Root class="w-full">
      <Card.Header>
        <Card.Title class="text-center">Welcome</Card.Title>
        <Card.Description class="text-center">
          Sign in to your account or create a new one
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        <Tabs.Root value={activeTab} onValueChange={handleTabChange} class="w-full">
          <Tabs.List class="grid w-full grid-cols-2 mb-6">
            <Tabs.Trigger value="signin">Sign In</Tabs.Trigger>
            <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
          </Tabs.List>

          <!-- Sign In Tab -->
          <Tabs.Content value="signin" class="space-y-4">
            {#if verificationSent}
              <div class="text-sm text-green-600 bg-green-50 border border-green-200 p-3 rounded-md">
                <div class="font-medium mb-2">🎉 Account created successfully!</div>
                <div class="mb-2">📧 Verification email sent to: <span class="font-mono text-xs">{email}</span></div>
                <div class="text-xs">
                  <strong>Next steps:</strong>
                  <ol class="list-decimal list-inside mt-1 space-y-1">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the verification link in the email</li>
                    <li>Return here and sign in with your credentials</li>
                  </ol>
                </div>
              </div>
            {/if}

            <div class="space-y-2">
              <label for="signin-email" class="text-sm font-medium">Email</label>
              <Input
                id="signin-email"
                type="email"
                placeholder="your.email@msoe.edu"
                bind:value={email}
                on:keydown={handleKeyDown}
                disabled={loading}
              />
            </div>
            
            <div class="space-y-2">
              <label for="signin-password" class="text-sm font-medium">Password</label>
              <Input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                bind:value={password}
                on:keydown={handleKeyDown}
                disabled={loading}
              />
            </div>

            {#if error}
              <div class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
                {#if error.includes('Email verification required')}
                  <div class="mt-2">
                    <HoverCard.Root>
                      <HoverCard.Trigger asChild>
                      <span>
                        <Button 
                        variant="outline" 
                        size="sm"
                        onclick={resendVerification}
                        disabled={resendingVerification || !email || !password}
                        >
                        {resendingVerification ? 'Sending...' : 'Resend Verification Email'}
                        </Button>
                      </span>
                      </HoverCard.Trigger>
                      {#if !email || !password}
                      <HoverCard.Content side="top" align="center" class="bg-background border p-2 rounded shadow text-xs max-w-xs">
                        Please enter both your email and password to resend the verification email.
                      </HoverCard.Content>
                      {/if}
                    </HoverCard.Root>
                  </div>
                {/if}
              </div>
            {/if}

            <Button 
              onclick={handleSignIn} 
              disabled={loading || !email || !password}
              class="w-full"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Tabs.Content>

          <!-- Sign Up Tab -->
          <Tabs.Content value="signup" class="space-y-4">
            <div class="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <div class="font-medium mb-1">Account Requirements:</div>
              <ul class="text-xs space-y-1">
                <li>• Must use your MSOE email address (@msoe.edu)</li>
                <li>• Email verification required before sign in</li>
                <li>• Password must be at least 6 characters with letters</li>
                <li>• One account per email address</li>
              </ul>
            </div>

            <div class="space-y-2">
              <label for="signup-email" class="text-sm font-medium">MSOE Email</label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your.email@msoe.edu"
                bind:value={email}
                on:keydown={handleKeyDown}
                disabled={loading}
              />
            </div>
            
            <div class="space-y-2">
              <label for="signup-password" class="text-sm font-medium">Password</label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                bind:value={password}
                on:keydown={handleKeyDown}
                disabled={loading}
              />
            </div>

            <div class="space-y-2">
              <label for="confirm-password" class="text-sm font-medium">Confirm Password</label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                bind:value={confirmPassword}
                on:keydown={handleKeyDown}
                disabled={loading}
              />
            </div>

            {#if error}
              <div class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            {/if}

            <Button 
              onclick={handleSignUp} 
              disabled={loading || !email || !password || !confirmPassword}
              class="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Tabs.Content>
        </Tabs.Root>
      </Card.Content>
    </Card.Root>

    <!-- Footer -->
    <div class="text-center mt-6 text-sm text-muted-foreground">
      <p>MSOE Rowing Team Companion</p>
      <p>Track your meters, climb the leaderboard!</p>
    </div>
  </div>
</div>
