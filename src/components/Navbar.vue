<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <RouterLink
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</RouterLink
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <RouterLink class="px-2 text-white" :to="{ name: 'about' }">{{
              $t('navbar.about')
            }}</RouterLink>
          </li>
          <li v-if="!isLoggedIn">
            <a class="px-2 text-white" href="#" @click="toggleAuthModal">{{
              $t('navbar.login_register')
            }}</a>
          </li>
          <template v-else>
            <li>
              <RouterLink class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t('navbar.manage')
              }}</RouterLink>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click="logout">{{ $t('navbar.logout') }}</a>
            </li>
          </template>
        </ul>
        <!-- Language Change -->
        <ul class="ml-auto">
          <li>
            <a href="#" class="px-2 text-white" @click="changeLocale">{{ currentLocale }}</a>
          </li>
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
    ...mapState(useUserStore, ['isLoggedIn']),
    currentLocale() {
      return this.$i18n.locale === 'fr' ? 'Français' : 'English';
    }
  },
  methods: {
    ...mapActions(useUserStore, { logUserOut: 'logout' }),
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
    async logout() {
      await this.logUserOut();
      this.$route.meta.requiresAuth && this.$router.push({ name: 'home' });
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'fr' ? 'en' : 'fr';
    }
  }
};
</script>
