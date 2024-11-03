import { createPinia, setActivePinia } from 'pinia';
import useUserStore from '@/stores/user';

vi.mock('@/utils/firebase', () => ({
  authenticateUser: () => Promise.resolve()
}));

describe('Stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia()); // Set a unique instance of Pinia
  });

  test('Authenticates user', async () => {
    const store = useUserStore();

    expect(store.isLoggedIn).not.toBe(true);
    await store.authenticate({});
    expect(store.isLoggedIn).toBe(true);
  });
});
