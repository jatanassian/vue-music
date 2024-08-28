<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showEditForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click="showEditForm = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showEditForm">
      <div
        v-if="alert.show"
        class="text-white text-center fond-bold p-4 mb-4"
        :class="alert.variant"
      >
        {{ alert.message }}
      </div>
      <VeeForm @submit="editSong">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            :value="song.modified_name"
            rules="required"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :value="song.genre"
            placeholder="Enter Genre"
          />
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
          :disabled="loading"
          @click="showEditForm = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script>
import { deleteSong, updateSong } from '@/utils/firebase';

export default {
  name: 'SongItem',
  props: {
    song: { type: Object, required: true },
    songIndex: { type: Number, required: true }
  },
  emits: ['updateSong', 'deleteSong'],
  data() {
    return {
      showEditForm: false,
      loading: false,
      alert: {
        show: false,
        variant: 'bg-blue-500',
        message: 'Updating song, please wait.'
      }
    };
  },
  methods: {
    async editSong(formValues) {
      this.loading = true;
      this.alert = {
        show: true,
        variant: 'bg-blue-500',
        message: 'Updating song, please wait.'
      };

      try {
        await updateSong(this.song.id, formValues);
        this.$emit('updateSong', this.songIndex, formValues);
        this.alert = {
          show: true,
          variant: 'bg-green-500',
          message: 'Song successfully updated.'
        };
      } catch (error) {
        this.alert = {
          show: true,
          variant: 'bg-red-500',
          message: 'Something went wrong.'
        };
      } finally {
        this.loading = false;
      }
    },
    async deleteSong() {
      await deleteSong(this.song);
      this.$emit('deleteSong', this.song.id);
    }
  },
  watch: {
    showEditForm(show) {
      if (!show) {
        this.alert.show = false;
      }
    }
  }
};
</script>
