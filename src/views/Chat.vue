<template>
  <div>
    <img class="pause" v-on:click="play()" v-if="playing" src="@/assets/pause.svg" />
    <img class="pause" v-on:click="play()" v-else src="@/assets/play.svg" />
    <audio id="radio" src="https://stream.zenolive.com/1bhx4nnmg5zuv.aac"></audio>
    <Chat
      v-if="visible"
      :participants="participants"
      :myself="myself"
      :messages="messages"
      :chat-title="chatTitle"
      :placeholder="placeholder"
      :colors="colors"
      :border-style="borderStyle"
      :hide-close-button="hideCloseButton"
      :close-button-icon-size="closeButtonIconSize"
      :submit-icon-size="submitIconSize"
      :submit-image-icon-size="submitImageIconSize"
      :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
      :async-mode="asyncMode"
      :scroll-bottom="scrollBottom"
      :display-header="true"
      :send-images="true"
      :profile-picture-config="profilePictureConfig"
      :link-options="linkOptions"
      :accept-image-types="'.png, .jpeg'"
      @onImageClicked="onImageClicked"
      @onImageSelected="onImageSelected"
      @onMessageSubmit="onMessageSubmit"
      @onType="onType"
      @onClose="onClose"
    />
  </div>
</template>

<script>
import { Chat } from "vue-quick-chat";
import "vue-quick-chat/dist/vue-quick-chat.css";
import uniqid from "uniqid";
var participantes = [];
import coolImages from "cool-images";
const { DateTime } = require("luxon");
const db = firebase.firestore();

db.collection("users")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.data().id == JSON.parse(localStorage.getItem("mySelf")).id) {
        console.log("Ya estas aqui: ", doc.data());
      } else {
        // doc.data() will be undefined in this case
        participantes.push(doc.data());
        console.log("No such document!", doc.data());
      }
    });
  });
export default {
  components: {
    Chat,
  },
  data() {
    return {
      playing: false,
      visible: true,
      participants: participantes,
      myself: JSON.parse(localStorage.getItem("mySelf")) || {
        name: "Usuario anonimo",
        id: uniqid(),
        profilePicture: coolImages.one(),
      },
      messages: [],
      chatTitle: "Radio Estilo de Dios",
      placeholder: "Enviar mensaje",
      colors: {
        header: {
          bg: "#36b3fb",
          text: "#fff",
        },
        message: {
          myself: {
            bg: "#fff",
            text: "#bdb8b8",
          },
          others: {
            bg: "#fb4141",
            text: "#fff",
          },
          messagesDisplay: {
            bg: "#f7f3f3",
          },
        },
        submitIcon: "#b91010",
        submitImageIcon: "#b91010",
      },
      borderStyle: {
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "10px",
        bottomRight: "10px",
      },
      hideCloseButton: false,
      submitIconSize: 25,
      closeButtonIconSize: "20px",
      asyncMode: false,
      toLoad: [],
      scrollBottom: {
        messageSent: true,
        messageReceived: false,
      },
      displayHeader: true,
      profilePictureConfig: {
        others: true,
        myself: true,
        styles: {
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        },
      },
      // there are other options, you can check them here
      // https://soapbox.github.io/linkifyjs/docs/options.html
      linkOptions: {
        myself: {
          className: "myLinkClass",
          events: {
            click: function (e) {
              alert("Link clicked!");
            },
            mouseover: function (e) {
              alert("Link hovered!");
            },
          },
          format: function (value, type) {
            if (type === "url" && value.length > 50) {
              value = value.slice(0, 50) + "…";
            }
            return value;
          },
        },
        others: {
          className: "othersLinkClass",
          events: {
            click: function (e) {
              alert("Link clicked!");
            },
            mouseover: function (e) {
              alert("Link hovered!");
            },
          },
          format: function (value, type) {
            if (type === "url" && value.length > 50) {
              value = value.slice(0, 50) + "…";
            }
            return value;
          },
        },
      },
    };
  },
  methods: {
    play() {
      this.playing = !this.playing;
      if (this.playing) {
        document.getElementById("radio").play();
      } else {
        document.getElementById("radio").pause();
      }
    },
    onType: function (event) {
      //here you can set any behavior
    },
    loadMoreMessages(resolve) {
      setTimeout(() => {
        resolve(this.toLoad); //We end the loading state and add the messages
        //Make sure the loaded messages are also added to our local messages copy or they will be lost
        this.messages.unshift(...this.toLoad);
        this.toLoad = [];
      }, 1000);
    },
    onMessageSubmit: function (message) {
      /*
       * example simulating an upload callback.
       * It's important to notice that even when your message wasn't send
       * yet to the server you have to add the message into the array
       */
      message.timestamp = new Date().toString();
      this.messages.push(message);
      db.collection("messages")
        .doc()
        .set({
          ...message,
        })
        .then(() => {
          console.log("Se subio :)");
        })
        .catch((e) => {
          console.log("No funciono :(");
        });
      console.log(new Date());
      /*
       * you can update message state after the server response
       */
      // timeout simulating the request
      setTimeout(() => {
        message.uploaded = true;
      }, 2000);
    },
    onClose() {
      this.$router.push("/home");
    },
    onImageSelected(files, message) {
      let src =
        "https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg";
      this.messages.push(message);
      /**
       * This timeout simulates a requisition that uploads the image file to the server.
       * It's up to you implement the request and deal with the response in order to
       * update the message status and the message URL
       */
      setTimeout(
        (res) => {
          message.uploaded = true;
          message.src = res.src;
        },
        3000,
        { src }
      );
    },
    onImageClicked(message) {
      /**
       * This is the callback function that is going to be executed when some image is clicked.
       * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
       */
      console.log("Image clicked", message.src);
    },
  },
};
</script>

<style>
.pause {
  position: absolute !important;
  right: 40px;
  top: 10px;
  z-index: 100;
}
</style>
