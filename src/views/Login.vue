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
    <h3 style="margin: 12px; text-align: center; grid-column: 1 / 3">Foto de perfil</h3>
    <v-file-input
      style="grid-column: 1 / 3"
      label="Foto de perfil"
      filled
      prepend-icon="camera"
    ></v-file-input>
    <v-btn
      color="primary"
      style="grid-column: 1 / 3; margin-bottom: 15px"
      @click="addUsers()"
      >Iniciar sesion</v-btn
    >
    <v-btn color="grey" style="grid-column: 1 / 3" @click="login()"
      >Usuario invitado</v-btn
    >
  </v-container>
</template>

<script>
import uniqid from "uniqid";

export default {
  data() {
    return {
      name: "",
      photo: "",
      id: uniqid(),
    };
  },
  methods: {
    async addUsers() {
      const db = firebase.firestore();
      var mySelf = { name: this.name, id: this.id };
      await db
        .collection("users")
        .doc(this.id)
        .set({
          name: this.name,
          id: this.id,
        })
        .then(() => {
          localStorage.setItem("mySelf", JSON.stringify(mySelf));
          window.location.replace("/home");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },
    login() {
      window.location.replace("/home");
    },
  },
  created() {
    if (localStorage.getItem("mySelf")) {
      window.location.replace("/home");
    }
  },
};
</script>
