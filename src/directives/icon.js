// This code is not really reusable yet, it was more for practising with custom directives
export default {
  beforeMount(el, binding) {
    // Use the v-icon:full argument to specify you're replacing the entire class (useful if szitching away from font awsome)
    const iconClass =
      binding.arg === "full"
        ? binding.value
        : `fa fa-${binding.value} float-right text-green-400 text-xl`;

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
