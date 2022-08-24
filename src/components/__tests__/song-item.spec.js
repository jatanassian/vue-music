import SongItem from "@/components/home/SongItem.vue";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import { describe, expect, test } from "vitest";

describe("SongItem.vue", () => {
  test("renders song.display_name", () => {
    const song = {
      display_name: "Test",
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: { "router-link": RouterLinkStub },
      },
    });

    const author = wrapper.find(".text-gray-500");

    expect(author.text()).toBe(song.display_name);
  });

  test("renders song.id in id attribute", () => {
    const song = {
      id: "abc",
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: { "router-link": RouterLinkStub },
      },
    });
    console.log(wrapper.attributes());

    expect(wrapper.attributes()["data-test-id"]).toBe(`song-id-${song.id}`);
  });
});
