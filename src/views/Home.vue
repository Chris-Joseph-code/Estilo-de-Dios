<template>
  <div class="home">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">¿Cual es tu nombre?</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="user"
                    label="Escribe tu nombre"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false"> Cerrar </v-btn>
            <v-btn color="blue darken-1" text @click="login()"> Guardar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <h2>¡Bienvenido(a), {{ user }}!!!</h2>
    <p v-if="isOnline">
      <v-icon color="red" style="margin: 0 2px 3px 0px">fiber_manual_record</v-icon>En
      linea
    </p>
    <p v-if="isOffline">
      <v-icon style="margin: 0 2px 3px 0px">fiber_manual_record</v-icon>Conexión a
      internet perdida
    </p>
    <img class="logo" src="@/assets/logo.png" />
    <v-icon style="font-size: 40px; margin: 0 14px 29px 14px" color="black">info</v-icon>
    <img class="pause" v-on:click="play()" v-if="playing" src="@/assets/pause.svg" />
    <img class="pause" v-on:click="play()" v-else src="@/assets/play.svg" />
    <img class="chat" v-on:click="chat = true" src="@/assets/chat.svg" />
    <div>
      <v-dialog
        v-model="chat"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-layout align-center justify-center>
            <v-flex xs12>
              <v-toolbar dark color="primary darken-1">
                <v-toolbar-title>Chat</v-toolbar-title>
                <v-icon style="position: absolute; left: 92vw" @click="chat = !chat"
                  >close</v-icon
                >
              </v-toolbar>
              <v-card-text color="primary">
                <v-list ref="chat" id="logs">
                  <p v-if="isOffline">
                    <v-icon style="margin: 0 2px 3px 0px">fiber_manual_record</v-icon
                    >Conexión a internet perdida
                  </p>
                  <template v-for="(item, index) in logs">
                    <v-subheader
                      :class="item.cm"
                      style="
                        margin-block: 3px;
                        border-radius: 20px;
                        height: auto;
                        max-width: 60%;
                      "
                      v-if="item"
                      :key="index"
                    >
                      <small
                        style="
                          padding-bottom: 20px;
                          font-weight: 600;
                          color: white;
                          font-size: 16px;
                        "
                        >{{ item.u }}</small
                      >
                      <p
                        style="
                          padding: 20px 0 0 10px;
                          max-width: 60%;
                          color: #000000;
                          font-weight: 500;
                        "
                      >
                        {{ item.m }}
                      </p></v-subheader
                    >
                  </template>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-form @submit.prevent="submit">
                  <v-text-field
                    solo-inverted
                    v-model="msg"
                    label="Comentario"
                    v-on:enter="submit()"
                    style="width: 95vw"
                  ></v-text-field>
                  <v-btn fab dark small color="primary" type="submit">
                    <v-icon dark>send</v-icon>
                  </v-btn>
                </v-form>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
    </div>
    <audio id="radio" src="https://stream.zenolive.com/1bhx4nnmg5zuv.aac"></audio>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      playing: false,
      user: localStorage.getItem("user") || "",
      dialog: true,
      chat: false,
      logs: [],
      msg: "",
      colorMine: "Cm",
    };
  },
  methods: {
    play() {
      this.playing = !this.playing;
      if (this.playing) {
        var radio = document.getElementById("radio");
        document.getElementById("radio").play();
        document.getElementById("radio").onloadedmetadata(radio.metadata);
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
</style>
