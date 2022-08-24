import SongItem from "@/components/home/SongItem.vue";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import { describe, expect, test } from "vitest";

describe("SongItem.vue", () => {
  test("render song.display_name", () => {
    const song = {
      display_name: "Test",
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: { "router-link": RouterLinkStub },
      },
    });

    expect(wrapper.text()).toContain(song.display_name);
  });
});
