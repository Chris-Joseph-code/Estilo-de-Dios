<template>
  <div class="about">
    <h1>Al estilo de Dios</h1>
    <v-btn class="ma-2" color="primary" dark />
    <audio autoplay src="https://stream.zenolive.com/1bhx4nnmg5zuv.aac"></audio>
  </div>
</template>

<script>
//Autoplay de audio
window.onload = function () {
  var context = new AudioContext();
};
export default {
  name: "About",
};
</script>
