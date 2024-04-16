<script lang="ts">
  export let data;
  let { supabase } = data;
  $: ({ supabase } = data);

  let email = "";
  let password = "";

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      alert("Check your email to confirm your signup!");
    } catch (error: any) {
      console.dir(error);
      alert(error.message);
    }
  };
</script>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left">
      <h1 class="text-5xl font-bold">Sign Up</h1>
      <p class="py-6">Great components are built on great design systems.</p>
    </div>
    <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <form class="card-body" on:submit|preventDefault={handleSignIn}>
        <div class="form-control">
          <label class="label" for="email-input">
            <span class="label-text">Email</span>
          </label>
          <input
            type="email"
            id="email-input"
            placeholder="email"
            class="input input-bordered"
            required
            bind:value={email}
          />
        </div>
        <div class="form-control">
          <label class="label" for="password-input">
            <span class="label-text">Password</span>
          </label>
          <input
            type="password"
            id="password-input"
            placeholder="password"
            class="input input-bordered"
            required
            bind:value={password}
          />
          <label
            class="label"
            for="Forgot password and have an account buttons"
          >
            <a href="/forgot-password" class="label-text-alt link link-hover"
              >Forgot password?</a
            >
            <a href="/login" class="label-text-alt link link-hover"
              >Already have an account?</a
            >
          </label>
        </div>
        <div class="form-control mt-6">
          <button class="btn btn-primary" type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  </div>
</div>
