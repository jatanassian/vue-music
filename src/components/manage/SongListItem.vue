<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <!-- Song Info -->
    <div v-show="!editable">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click="editable = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <!-- Song Edit Form -->
    <div v-show="editable">
      <div
        v-if="alert.show"
        class="text-white text-center font-bold p-4 mb-4"
        :class="alert.color"
      >
        {{ alert.text }}
      </div>
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="loading"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="editable = false"
          :disabled="loading"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection } from "@/includes/firebase";

export default {
  name: "SongListItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      editable: false,
      schema: {
        modified_name: "songTitle",
        genre: "alphaSpaces",
      },
      loading: false,
      alert: {
        show: false,
        color: "bg-blue-500",
        text: "Updating song info, please wait.",
      },
    };
  },
  methods: {
    async edit(values) {
      this.loading = true;

      this.alert.show = true;
      this.alert.color = "bg-blue-500";
      this.alert.text = "Updating song info, please wait.";

      try {
        await songsCollection.doc(this.song.id).update(values);
      } catch (error) {
        this.alert.color = "bg-red-500";
        this.alert.text = "Something went wrong, please try again.";
      }
      this.updateSong(this.index, values);

      this.loading = false;
      this.alert.color = "bg-green-500";
      this.alert.text = "Song successfully updated.";
    },
  },
};
</script>

<style></style>
