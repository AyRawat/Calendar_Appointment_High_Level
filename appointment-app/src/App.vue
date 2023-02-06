<template>
  <div id="app">
    <b-container class="vh-100 text-center" align-v="center">
      <HeaderComponent/>
      <CalendarComponent msg="Welcome to Your Vue.js App" />
    </b-container>
  </div>
</template>

<script>
import CalendarComponent from "./components/CalendarComponent.vue";
import HeaderComponent from "./components/HeaderComponent.vue";

export default {
  name: "App",
  components: {
    CalendarComponent,
    HeaderComponent
  },
};
</script>

<style></style>
