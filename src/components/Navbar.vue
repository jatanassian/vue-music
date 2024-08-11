<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <RouterLink class="text-white font-bold uppercase text-2xl mr-4" to="/">Music</RouterLink>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!isLoggedIn">
            <RouterLink class="px-2 text-white" to="/about">About</RouterLink>
          </li>
          <li v-if="!isLoggedIn">
            <a class="px-2 text-white" href="#" @click="toggleAuthModal">Login / Register</a>
          </li>
          <template v-else>
            <li>
              <RouterLink class="px-2 text-white" to="/manage">Manage</RouterLink>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click="logout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapState, mapStores } from 'pinia';
import useModalStore from '@/stores/modal';
import useUserStore from '@/stores/user';

export default {
  name: 'Navbar',
  computed: {
    ...mapStores(useModalStore),
    ...mapState(useUserStore, ['isLoggedIn'])
  },
  methods: {
    ...mapActions(useUserStore, { logUserOut: 'logout' }),
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
    async logout() {
      await this.logUserOut();
    }
  }
};
</script>
