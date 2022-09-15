<template>
  <main class="pb-20">
    <!-- User Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/user-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          id="cypress-play-btn"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">Username</div>
          <div>Country</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      user: {},
    };
  },
};
</script>
