// A component may be more reusable, but I wanted to practice with directives
export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-xl`;

    // Use the full argument to specify you're replacing the entire class - useful if switching away from font awesome (v-icon:full)
    if (binding.arg === "full") iconClass = binding.value;

    // Use the modifiers to specify any alignment or color (v-icon.right.red)
    if (binding.modifiers.right) iconClass += " float-right";
    if (binding.modifiers.left) iconClass += " float-left";
    if (binding.modifiers.yellow) iconClass += " text-yellow-400";
    if (binding.modifiers.green) iconClass += " text-green-400";
    if (binding.modifiers.red) iconClass += " text-red-400";
    if (binding.modifiers.blue) iconClass += " text-blue-400";

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
