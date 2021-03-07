<template>
  <div class="home">
    <v-col cols="12" md="4">
      <h2>Chat</h2>
      <audio autoplay src="https://stream.zenolive.com/1bhx4nnmg5zuv.aac"></audio>
    </v-col>
  </div>
</template>

<script>
//Autoplay de audio
window.onload = function () {
  var context = new AudioContext();
};

export default {
  name: "Chat",
  data: function () {
    return {
      message: {},
    };
  },
};
</script>
