import { defineStore } from 'pinia';
import { registerUser } from '@/utils/firebase';

export default defineStore('user', {
  state: () => ({
    isLoggedIn: false
  }),
  actions: {
    async register(formValues) {
      await registerUser(formValues);
      this.isLoggedIn = true;
    }
  }
});
