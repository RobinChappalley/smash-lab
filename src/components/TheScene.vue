<template>
  <a-scene @loaded="$emit('loaded')" background="color: black" bloom="strength: 0.2; radius: 0.5; threshold: 0.6">


    <a-assets @loaded="allAssetsLoaded = true">
      <a-asset-item id="heart-model" src="assets/love_low_poly.glb"></a-asset-item>
      <audio id="hit-sound" src="assets/hit.mp3"></audio>
      <audio id="bg-music" src="assets/music.mp3" loop="true" preload="auto"></audio>
    </a-assets>


    <template v-if="allAssetsLoaded">


      <!-- ENVIRONNEMENT & LUMIERE -->
      <a-entity
        environment="preset: volcano; groundColor: #440000; dressingAmount: 10; skyType: atmosphere; lighting: point"></a-entity>


      <TheScoreBoard position="-2 2 -3" rotation="0 45 0" />

      <TheScoreBoard position="2 2 -3" rotation="0 -45 0" />

      <!-- MENU DE DÉPART -->
      <TheGameMenu v-if="!store.isPlaying" position="0 1.2 -1.2" rotation="-30 0 0 " />

      <!-- ZONE DE JEU -->

      <a-ring position="0 0.1 0" rotation="-90 0 0" radius-inner="0.8" radius-outer="1" color="#ff8800"
        material="emissive: #ff4400"></a-ring>
      <a-entity id="ambient-music" sound="src: #bg-music; autoplay: false; loop: true; volume: 0.8"></a-entity>
      <TheRockSpawner />
    </template>
    <TheCameraRig />

  </a-scene>

</template>

<script setup>
import { ref, watch } from 'vue';
import { store } from '../store.js';
import TheCameraRig from './TheCameraRig.vue';
import TheRockSpawner from './TheRockSpawner.vue';
import TheScoreBoard from './TheScoreBoard.vue';
import TheGameMenu from './TheGameMenu.vue';
const allAssetsLoaded = ref(false);

// Gérer la musique d'ambiance
watch(() => store.isPlaying, (isPlaying) => {
  const musicEl = document.querySelector('#ambient-music');
  if (!musicEl || !musicEl.components.sound) return;

  if (isPlaying) {
    musicEl.components.sound.playSound();
  } else {
    musicEl.components.sound.stopSound();
    // Réinitialiser la vitesse en cas de Game Over
    const audioNode = musicEl.components.sound.pool.children[0];
    if (audioNode && audioNode.setPlaybackRate) {
      audioNode.setPlaybackRate(1.0);
    }
  }
});

</script>
