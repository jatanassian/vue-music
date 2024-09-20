<template>
  <Navbar />

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </Transition>
  </RouterView>

  <AudioPlayer />

  <AuthModal />
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AuthModal from '@/components/AuthModal.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import useUserStore from '@/stores/user';
import { mapWritableState } from 'pinia';
import { auth } from '@/utils/firebase';

export default {
  name: 'App',
  components: { Navbar, AuthModal, AudioPlayer },
  computed: {
    ...mapWritableState(useUserStore, ['isLoggedIn'])
  },
  created() {
    if (auth.currentUser) {
      this.isLoggedIn = true;
    }
  }
};
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
