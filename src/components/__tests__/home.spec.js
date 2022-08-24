import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import Icon from "@/directives/icon";
import SongItem from "@/components/home/SongItem.vue";

describe("Home.vue", () => {
  test("renders list of songs", () => {
    const songs = [{}, {}, {}];

    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
      directives: { Icon },
    });

    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);
  });
});
