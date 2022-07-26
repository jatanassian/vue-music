<template>
  <!-- Alert -->
  <div
    class="text-white text-center font-bold p-4 mb-4"
    v-if="alert.show"
    :class="alert.color"
  >
    {{ alert.text }}
  </div>

  <!-- Login form -->
  <vee-form :validation-schema="schema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <!-- Submit Button -->
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="loading"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      schema: {
        email: "required|email",
        password: "required|max:100",
      },
      loading: false,
      alert: {
        show: false,
        color: "bg-blue-500",
        text: "Logging in, please wait.",
      },
    };
  },
  methods: {
    login(values) {
      this.loading = true;
      this.alert.show = true;
      this.alert.color = "bg-blue-500";
      this.alert.text = "Logging in, please wait.";

      this.alert.color = "bg-green-500";
      this.alert.text = "You are now logged in.";
      console.log(values);
    },
  },
};
</script>
