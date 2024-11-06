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
      <label class="inline-block mb-2">{{ $t('auth.register.name') }}</label>
      <VeeField
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        type="text"
        name="name"
        :placeholder="$t('auth.register.name_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>

    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.register.email') }}</label>
      <VeeField
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.register.email_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>

    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.register.age') }}</label>
      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.register.password') }}</label>
      <VeeField name="password" :bails="false" v-slot="{ field, errors }">
        <input
          v-bind="field"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('auth.register.password_placeholder')"
        />
        <div v-for="error in errors" :key="error" class="text-red-600">{{ error }}</div>
      </VeeField>
    </div>

    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.register.confirm') }}</label>
      <VeeField
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.register.password_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>

    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.register.country') }}</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="" disabled selected>{{ $t('auth.register.country_select') }}</option>
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
      <label class="inline-block">{{ $t('auth.register.tos') }}</label>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>

    <!-- Submit button -->
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="isLoading"
    >
      {{ $t('shared.submit') }}
    </button>
  </VeeForm>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';
import useModalStore from '@/stores/modal';

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
    ...mapWritableState(useModalStore, { isModalOpen: 'isOpen' })
  },
  methods: {
    ...mapActions(useUserStore, { createUser: 'register' }),
    /**
     * Register the user in the database
     */
    async register(formValues) {
      this.isLoading = true;
      this.alert.show = true;
      this.alert.variant = 'bg-blue-500';
      this.alert.message = 'Your account is being created, please wait.';

      try {
        await this.createUser(formValues);
        this.alert.variant = 'bg-green-500';
        this.alert.message = 'Account created successfully.';
      } catch {
        this.alert.variant = 'bg-red-500';
        this.alert.message = 'Unable to register the account, please try again later.';
      } finally {
        this.isLoading = false;
        this.isModalOpen = false;
      }
    }
  }
};
</script>
