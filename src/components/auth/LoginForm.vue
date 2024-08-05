<template>
  <!-- Alert -->
  <div
    v-if="isLoading"
    :class="`text-white text-center font-bold p-4 rounded mb-4 ${alert.variant}`"
  >
    {{ alert.message }}
  </div>

  <!-- Form -->
  <VeeForm :validation-schema="schema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>

    <!-- Submit button -->
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="isLoading"
    >
      Submit
    </button>
  </VeeForm>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      schema: {
        email: 'required|email',
        password: 'required'
      },
      isLoading: false,
      alert: {
        show: false,
        variant: 'bg-blue-500',
        message: 'Logging in, please wait.'
      }
    };
  },
  methods: {
    login(values) {
      this.isLoading = true;
      this.alert.show = true;
      this.alert.variant = 'bg-blue-500';
      this.alert.message = 'Loading...';

      setTimeout(() => {
        this.alert.variant = 'bg-green-500';
        this.alert.message = 'Logged in succesfully';
        console.log(values);
      }, 1000);
    }
  }
};
</script>
