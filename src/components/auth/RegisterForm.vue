<template>
  <!-- Alert -->
  <div
    v-if="alert.show"
    :class="`text-white text-center font-bold p-4 rounded mb-4 ${alert.variant}`"
  >
    {{ alert.message }}
  </div>

  <!-- Form -->
  <VeeForm :validation-schema="schema" @submit="register">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <VeeField
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        type="text"
        name="name"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>

    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>

    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField name="password" :bails="false" v-slot="{ field, errors }">
        <input
          v-bind="field"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <div v-for="error in errors" :key="error" class="text-red-600">{{ error }}</div>
      </VeeField>
    </div>

    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <VeeField
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>

    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="" disabled selected>Select your country</option>
        <option value="Canada">Canada</option>
        <option value="USA">USA</option>
        <option value="France">France</option>
      </VeeField>
      <ErrorMessage class="text-red-600" name="country" />
    </div>

    <!-- TOS -->
    <div class="mb-3 pl-6">
      <VeeField
        name="tos"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        value="1"
      />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600 block" name="tos" />
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
import { registerUser } from '@/utils/firebase';
import { mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:130',
        password: 'required|min:3|max:100',
        confirm_password: 'password_mismatch:@password',
        country: 'required',
        tos: 'tos'
      },
      isLoading: false,
      alert: {
        show: false,
        variant: 'bg-blue-500',
        message: 'Your account is being created, please wait.'
      }
    };
  },
  computed: {
    ...mapWritableState(useUserStore, ['isLoggedIn'])
  },
  methods: {
    /**
     * Register the user in the database
     */
    async register(formValues) {
      this.isLoading = true;
      this.alert.show = true;
      this.alert.variant = 'bg-blue-500';
      this.alert.message = 'Your account is being created, please wait.';

      try {
        await registerUser(formValues);

        this.alert.variant = 'bg-green-500';
        this.alert.message = 'Account created successfully.';
        this.isLoggedIn = true;
      } catch {
        this.alert.variant = 'bg-red-500';
        this.alert.message = 'Unable to register the account, please try again later.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
