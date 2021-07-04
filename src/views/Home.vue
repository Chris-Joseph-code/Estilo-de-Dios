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
      <div class="img-div">
        <img
          style="width: 450px"
          class="logo"
          src="https://imgproxy.zenomedia.com/insecure/fit/500/500/ce/0/plain/https://proxy.zeno.fm/content/stations/agxzfnplbm8tc3RhdHNyMgsSCkF1dGhDbGllbnQYgICQo7zvzwgMCxIOU3RhdGlvblByb2ZpbGUYgICQw8n1swoMogEEemVubw/image/%3Fresize=500x500&v=1"
        />
      </div>
      <div class="img-div">
        <vue-slider
          heigth="75px"
          id="v_slide"
          v-on:change="volumen()"
          direction="btt"
          v-model="volume"
        ></vue-slider>
        <v-icon @click="f == true ? vold() : voldNeg()" id="v_icon">volume_up</v-icon>
        <img class="pause" v-on:click="play()" v-if="playing" src="@/assets/pause.svg" />
        <img class="pause" v-on:click="play()" v-else src="@/assets/play.svg" />
        <img
          src="@/assets/chat.svg"
          style="width: 40px; margin: 7px 0 0 7px; display: inline-block"
          @click="home()"
        />
      </div>
      <audio id="radio" src="https://stream.zenolive.com/1bhx4nnmg5zuv.aac"></audio>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      f: true,
      op: false,
      playing: false,
      dialog: true,
      chat: false,
      logs: [],
      msg: "",
      esFlat: "flat",
      volume: 100,
      mySelf: JSON.parse(localStorage.getItem("mySelf")) || {
        name: "Usuario",
        photo: randomPicture(),
      },
    };
  },
  methods: {
    home() {
      this.$router.push("/chat");
    },
    play() {
      this.playing = !this.playing;
      if (this.playing) {
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
    volumen() {
      let volumen = this.volume / 100;
      let radio = document.getElementById("radio");
      radio.volume = volumen;
      console.log(volumen);
    },
    vold() {
      this.f = !this.f;
      let vIcon = document.getElementById("v_icon");
      let vSlide = document.getElementById("v_slide");
      vIcon.style.top = "50px";
      vSlide.style.left = "30px";
      vSlide.style.display = "block";
      console.log("Vold", this.f);
    },
    voldNeg() {
      this.f = !this.f;
      let vIcon = document.getElementById("v_icon");
      let vSlide = document.getElementById("v_slide");
      vIcon.style.top = "7px";
      vIcon.style.right = "7px";
      vSlide.style.display = "none";

      console.log("voldNeg", this.f);
    },
    watch: {
      logs() {
        setTimeout(() => {
          this.$refs.chat.$el.scrollTop = this.$refs.chat.$el.scrollHeight;
        }, 0);
      },
    },
    mounted() {
      let chats = [];
      let db = firebase.firestore();
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
  },
};
</script>

<style>
#v_slide {
  position: relative;
  display: none;
}
.v-icon {
  color: black !important;
  font-size: 40px !important;
  top: 7px;
  right: 7px;
}
#v-icon {
  color: rgb(0, 0, 0) !important;
  font-size: 60px !important;
}
.upV {
  max-width: 60px !important;
  display: inline-block !important;
}
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
.img-div {
  display: flex;
  justify-content: center;
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
