import SongItem from '@/components/home/SongItem.vue';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';

describe('SongItem.vue', () => {
  test('Renders song.display_name', () => {
    const song = { display_name: 'Test' };
    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: { RouterLink: RouterLinkStub }
      }
    });

    const spanElement = wrapper.find('.text-gray-500');

    expect(spanElement.text()).toBe(song.display_name);
  });
});
