<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <RouterLink
        :to="{ name: 'song', params: { id: song.id } }"
        class="font-bold block text-gray-600"
      >
        {{ song.modified_name }}
      </RouterLink>
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <RouterLink
        custom
        :to="{ name: 'song', params: { id: song.id }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comments_count }}
        </span>
      </RouterLink>
    </div>
  </li>
</template>

<script>
export default {
  name: 'SongItem',
  props: { song: { type: Object, required: true } }
};
</script>
