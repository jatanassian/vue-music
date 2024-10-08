import { defineStore } from 'pinia';
import { registerUser, authenticateUser, signUserOut } from '@/utils/firebase';

export default defineStore('user', {
  state: () => ({
    isLoggedIn: false
  }),
  actions: {
    async register(formValues) {
      await registerUser(formValues);
      this.isLoggedIn = true;
    },
    async authenticate(formValues) {
      await authenticateUser(formValues);
      this.isLoggedIn = true;
    },
    async logout() {
      await signUserOut();
      this.isLoggedIn = false;
    }
  }
});
