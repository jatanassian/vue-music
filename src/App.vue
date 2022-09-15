<template>
  <navbar></navbar>

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <player></player>

  <auth />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Auth from "@/components/Auth.vue";
import Player from "@/components/Player.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "./includes/firebase";

export default {
  components: { Navbar, Auth, Player },
  name: "App",
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    if (auth.currentUser) this.userLoggedIn = true;
  },
};
</script>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-to {
  transition: all 0.5s linear;
}
</style>
