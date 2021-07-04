<template>
  <v-container style="padding-top: 40px; display: grid">
    <v-img
      style="display: inline-block; width: 132px; margin: auto; grid-column: 1 / 3"
      src="../assets/red.png"
    ></v-img>

    <h2 style="margin: 12px; text-align: left; grid-column-start: 1; grid-column-end: 3">
      Iniciar sesion
    </h2>
    <h3 style="margin: 12px; text-align: center; grid-column: 1 / 3">Nombre</h3>
    <v-text-field
      v-model="name"
      filled
      label="Tu nombre"
      style="grid-column: 1 / 3"
      prepend-icon="attachment"
    ></v-text-field>
    <v-btn
      color="primary"
      style="grid-column: 1 / 3; margin-bottom: 15px"
      @click="addUsers()"
      :disabled="name === ''"
      >Iniciar sesion</v-btn
    >
    <v-btn color="grey" style="grid-column: 1 / 3" to="home">Usuario invitado</v-btn>
  </v-container>
</template>

<script>
import uniqid from "uniqid";
import coolImages from "cool-images";

export default {
  data() {
    return {
      name: "",
      id: uniqid(),
      profilePicture: coolImages.one(),
    };
  },
  methods: {
    addUsers() {
      console.log(this.profilePicture);
      const db = firebase.firestore();
      db.collection("users")
        .doc(this.id)
        .set({
          name: this.name,
          id: this.id,
          profilePicture: coolImages.one(),
        })
        .then(() => {
          var mySelf = {
            name: this.name,
            id: this.id,
            profilePicture: this.profilePicture,
          };
          localStorage.setItem("mySelf", JSON.stringify(mySelf));
          this.$router.push("/home");
          console.log("Todo esta bien");
        })
        .catch((error) => {
          console.error("Hay un error: ", error);
        });
    },
  },
  created() {
    if (localStorage.getItem("mySelf")) {
      this.$router.push("/home");
    }
  },
};
</script>
