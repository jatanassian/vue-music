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
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragOver }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragOver = false"
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textClass">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.color"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from "@/includes/firebase";

export default {
  name: "Upload",
  data() {
    return {
      isDragOver: false,
      uploads: [],
    };
  },
  methods: {
    // Upload file to Firebase storage and add sond data to Firestore
    upload(event) {
      this.isDragOver = false;

      const files = event.dataTransfer
        ? [...event.dataTransfer.files]
        : [...event.target.files];

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }

        const storageRef = storage.ref();
        const songsRef = storageRef.child(`songs/${file.name}`);
        const uploadingFile = songsRef.put(file);

        const uploadsLength = this.uploads.push({
          uploadingFile,
          currentProgress: 0,
          name: file.name,
          color: "bg-blue-400",
          icon: "fas fa-spinner fa-spin",
          textClass: "",
        });

        uploadingFile.on(
          "state_changed",
          // During upload
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            this.uploads[uploadsLength - 1].currentProgress = progress;
          },
          // Upload failed
          () => {
            this.uploads[uploadsLength - 1].color = "bg-red-400";
            this.uploads[uploadsLength - 1].icon = "fas fa-times";
            this.uploads[uploadsLength - 1].textClass = "text-red-400";
          },
          // Upload succeeded
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: uploadingFile.snapshot.ref.name,
              modified_name: uploadingFile.snapshot.ref.name,
              genre: "",
              comments_count: "",
            };

            song.url = await uploadingFile.snapshot.ref.getDownloadURL();

            await songsCollection.add(song);

            this.uploads[uploadsLength - 1].color = "bg-green-400";
            this.uploads[uploadsLength - 1].icon = "fas fa-check";
            this.uploads[uploadsLength - 1].textClass = "text-green-400";
          }
        );
      });
    },
  },
};
</script>
