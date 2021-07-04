<template>
  <div id="app">
    <!-- Provides the appl

      <!- If using vue-router -->
    <v-app>
      <router-view></router-view>
      
    
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playing: false,
    };
  },
  methods: {
    
  },
  mounted() {
    if (!localStorage.getItem("mySelf")) {
      this.$router.push("/");
      console.log(localStorage.getItem("mySelf"));
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
