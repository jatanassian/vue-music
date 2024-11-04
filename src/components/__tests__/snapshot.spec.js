import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '../home/SongItem.vue';

describe('Snapshots SongItem.vue', () => {
  test('Renders correctly', () => {
    const song = {
      id: 'abc',
      display_name: 'Test',
      modifier_name: 'Test',
      comments_count: 5
    };

    const component = shallowMount(SongItem, {
      props: { song },
      global: {
        components: { RouterLink: RouterLinkStub }
      }
    });

    expect(component.element).toMatchSnapshot();
  });
});
