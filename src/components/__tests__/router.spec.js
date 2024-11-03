import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '../home/SongItem.vue';

describe('Router', () => {
  test('Renders router link', () => {
    const song = {
      id: 'abc'
    };

    const component = shallowMount(SongItem, {
      props: { song },
      global: {
        components: { RouterLink: RouterLinkStub }
      }
    });

    expect(component.findComponent(RouterLinkStub).props().to).toEqual({
      name: 'song',
      params: { id: song.id }
    });
  });
});
