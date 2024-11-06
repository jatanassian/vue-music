<template>
  <!-- Alert -->
  <div
    v-if="alert.show"
    :class="`text-white text-center font-bold p-4 rounded mb-4 ${alert.variant}`"
  >
    {{ alert.message }}
  </div>

  <!-- Form -->
  <VeeForm :validation-schema="schema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.login.email') }}</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.login.email_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.login.password') }}</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.login.password_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="password" />
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
  computed: {
    ...mapWritableState(useModalStore, { isModalOpen: 'isOpen' })
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    async login(formValues) {
      this.isLoading = true;
      this.alert.show = true;
      this.alert.variant = 'bg-blue-500';
      this.alert.message = 'Logging in, please wait.';

      try {
        await this.authenticate(formValues);
        this.alert.variant = 'bg-green-500';
        this.alert.message = 'Logged in successfully.';
        this.isModalOpen = false;
      } catch {
        this.alert.variant = 'bg-red-500';
        this.alert.message = 'Unable to login, please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
