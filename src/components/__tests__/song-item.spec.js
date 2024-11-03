import SongItem from '@/components/home/SongItem.vue';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';

describe('SongItem.vue', () => {
  test('Renders song.display_name', () => {
    const song = { display_name: 'Test' };
    const component = shallowMount(SongItem, {
      props: { song },
      global: {
        components: { RouterLink: RouterLinkStub }
      }
    });

    const spanElement = component.find('.text-gray-500');

    expect(spanElement.text()).toBe(song.display_name);
  });

  test('Renders song.id in data-testid attribute', () => {
    const song = { id: 'abc' };
    const component = shallowMount(SongItem, {
      props: { song },
      global: {
        components: { RouterLink: RouterLinkStub }
      }
    });

    expect(component.attributes()['data-testid']).toBe(`song-id-${song.id}`);
  });
});
