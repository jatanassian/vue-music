<template>
  <!-- Alert -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="alert.show"
    :class="alert.color"
  >
    {{ alert.text }}
  </div>

  <!-- Registration Form -->
  <vee-form
    :validation-schema="schema"
    :initial-values="userData"
    @submit="register"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          type="password"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Canada">Canada</option>
        <option value="France">France</option>
        <option value="Germany">Germany</option>
        <option value="USA">United States</option>
        <option value="Moon">The Moon</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <!-- Submit Button -->
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="loading"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { auth, usersCollection } from "@/includes/firebase";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "RegisterForm",
  data() {
    return {
      schema: {
        name: "required|min:3|max:100|alphaSpaces",
        email: "required|min:3|max:100|email",
        age: "required|minValue:18|maxValue:120",
        password: "required|min:9|max:100|excluded:password",
        confirm_password: "password_mismatch:@password",
        country: "required|country_excluded:Moon",
        tos: "tos",
      },
      userData: {
        country: "Canada",
      },
      loading: false,
      alert: {
        show: false,
        color: "bg-blue-500",
        text: "Your account is being created, please wait.",
      },
    };
  },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  methods: {
    async register(values) {
      this.loading = true;
      this.alert.show = true;
      this.alert.color = "bg-blue-500";
      this.alert.text = "Your account is being created, please wait.";

      let userCred = null;
      try {
        userCred = await auth.createUserWithEmailAndPassword(
          values.email,
          values.password
        );
      } catch (error) {
        this.loading = false;
        this.alert.color = "bg-red-500";
        this.alert.text =
          "An unexpected error occured. Please try again later.";
        return;
      }

      try {
        await usersCollection.add({
          name: values.name,
          email: values.email,
          age: values.age,
          country: values.country,
        });
      } catch (error) {
        this.loading = false;
        this.alert.color = "bg-red-500";
        this.alert.text =
          "An unexpected error occured. Please try again later.";
        return;
      }

      this.userLoggedIn = true;

      this.alert.color = "bg-green-500";
      this.alert.text = "Account created.";
      console.log(userCred);
    },
  },
};
</script>
