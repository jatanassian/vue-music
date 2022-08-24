import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import SongItem from "@/components/home/SongItem.vue";

describe("Snapshots SongItem.vue", () => {
  test("renders correctly", () => {
    const song = {
      id: "abc",
      modified_name: "test",
      display_name: "test",
      comments_count: 5,
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: { "router-link": RouterLinkStub },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
