<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDraggedOver }"
        @dragover.prevent.stop="isDraggedOver = true"
        @dragleave.prevent.stop="isDraggedOver = false"
        @drop.prevent.stop="upload"
      >
        <h5>Drop your files here</h5>
      </div>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div v-for="upload in uploads" :key="upload.name" class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm">{{ upload.name }}</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '@/utils/firebase';
export default {
  name: 'Upload',
  data() {
    return {
      isDraggedOver: false,
      uploads: []
    };
  },
  methods: {
    upload(event) {
      const files = [...event.dataTransfer.files];
      for (const file of files) {
        if (file.type !== 'audio/mp3' && file.type !== 'audio/mpeg') {
          return;
        }
        const uploadTask = uploadFile(file);

        const uploadIndex =
          this.uploads.push({
            task: uploadTask,
            currentProgress: 0,
            name: file.name
          }) - 1; // .push() returns the length of the array, so we substract 1 to get the index

        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIndex].currentProgress = progress;
        });
      }
      this.isDraggedOver = false;
    }
  }
};
</script>
