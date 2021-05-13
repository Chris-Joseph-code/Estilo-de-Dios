<template>
  <v-container style="padding-top: 40px">
    <div class="home">
      <v-row justify="center"> </v-row>
      <h2>¡Bienvenido(a), {{ mySelf.name }}!!!</h2>
      <p v-if="isOnline">
        <v-icon color="red" style="margin: 0 2px 3px 0px">fiber_manual_record</v-icon>En
        linea
      </p>
      <p v-if="isOffline">
        <v-icon style="margin: 0 2px 3px 0px">fiber_manual_record</v-icon>Conexión a
        internet perdida
      </p>
      <img class="logo" src="@/assets/logo.png" />
      <v-icon style="font-size: 40px; margin: 0 14px 29px 14px" color="black"
        >info</v-icon
      >
      <img class="pause" v-on:click="play()" v-if="playing" src="@/assets/pause.svg" />
      <img class="pause" v-on:click="play()" v-else src="@/assets/play.svg" />
      <img
        src="@/assets/chat.svg"
        style="width: 40px; margin: 7px 0 0 7px; display: inline-block"
        v-on:click="home()"
      />
      <audio id="radio" src="https://stream.zenolive.com/1bhx4nnmg5zuv.aac"></audio>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      playing: false,
      dialog: true,
      chat: false,
      logs: [],
      msg: "",
      mySelf: JSON.parse(localStorage.getItem("mySelf")) || { name: "Usuario" },
    };
  },
  methods: {
    home() {
      window.location.replace("/chat");
    },
    play() {
      this.playing = !this.playing;
      if (this.playing) {
        var radio = document.getElementById("radio");
        document.getElementById("radio").play();
      } else {
        document.getElementById("radio").pause();
      }
    },
    login() {
      if (localStorage.getItem("user") !== "") {
        this.dialog = false;
        localStorage.setItem("user", this.user);
      }
    },
    async submit() {
      if (this.msg !== "") {
        // Condicional para evaluar si el mensaje es mio
        if (localStorage.getItem("user") == this.user) {
          this.colorMine = "Cm";
        } else {
          this.colorMine = "Cnm";
        }
        var db = firebase.firestore();
        db.collection("chat").add({
          m: this.msg,
          u: this.user,
          cm: this.colorMine,
          d: Date.now(),
        });
        this.msg = "";
        db.collection("chat").orderBy(Date.now());
        db.collection("chat").onSnapshot((query) => {
          query.forEach((doc) => {
            console.log(doc.data());
            if (doc.data().u == this.user) {
              doc.data().cm = "Cm";
              this.logs.push(doc.data());
            } else {
              this.logs.push(doc.data());
              doc.data().cm = "Cnm";
            }
          });
        });
      }
    },
  },
  watch: {
    logs() {
      setTimeout(() => {
        this.$refs.chat.$el.scrollTop = this.$refs.chat.$el.scrollHeight;
      }, 0);
    },
  },
  mounted() {
    var chats = [];
    var db = firebase.firestore();
    db.collection("chat")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          chats.push(doc.data());
          this.logs = chats;
        });
      });
    //Tiempo real
    db.collection("chat").onSnapshot((query) => {
      query.forEach((doc) => {
        console.log(doc.data());
        if (doc.data().u == this.user) {
          this.logs.push(doc.data());
        } else {
          this.logs.push(doc.data());
        }
      });
    });
    this.login();
  },
  computed: {
    networkStatus() {
      return this.isOnline ? "My network is fine" : "I am offline";
    },
  },
};
</script>

<style>
.pause {
  max-width: 50px;
  margin: 0 7px 0 7px;
}
.chat {
  max-width: 40px;
  align-self: left;
  margin: 0 14px 0 14px;
}
.usering {
  fill: black;
}
.logo {
  display: block;
  max-width: 90%;
  border-radius: 10px;
  margin: 0 5% 5% 5%;
}

.michat {
  height: 400px;
}
.Cm {
  background: #fa8072;
  margin-left: 50%;
}
.Cnm {
  background: #2b9dff;
}
#no-background-hover::before {
  background-color: transparent !important;
  color: transparent !important;
  width: 0;
}
@media (min-width: 768px) {
  .logo {
    width: 60%;
    border-radius: 10px;
    margin: 0 15% 5% 19%;
    display: block;
  }
}
</style>
