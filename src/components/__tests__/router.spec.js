import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import SongItem from "@/components/home/SongItem.vue";

describe("router", () => {
  test("renders router-link", () => {
    const song = {
      id: "abcd",
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: "song",
      params: { id: song.id },
    });
  });
});
