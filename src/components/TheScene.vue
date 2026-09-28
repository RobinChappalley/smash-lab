<template>
  <a-scene @loaded="$emit('loaded')" background="color: black" bloom="strength: 0.2; radius: 0.5; threshold: 0.6">


    <a-assets @loaded="allAssetsLoaded = true">
      <a-asset-item id="heart-model" src="assets/love_low_poly.glb"></a-asset-item>
      <a-asset-item id="gloves-model" src="assets/boxing_gloves.glb"></a-asset-item>
    </a-assets>


    <template v-if="allAssetsLoaded">


      <!-- ENVIRONNEMENT & LUMIERE (Gérés dynamiquement par le store) -->
      <a-entity
        :environment="`preset: ${store.worlds[store.currentWorld].preset}; groundColor: ${store.worlds[store.currentWorld].groundColor}; skyColor: ${store.worlds[store.currentWorld].skyColor}; skyType: atmosphere; lighting: distant; lightPosition: 0 1 1`">
      </a-entity>





      <!-- SÉLECTEUR DE MONDES (Hub) - RESTE FIXÉ AU CENTRE -->
      <TheWorlds v-if="!store.isPlaying && store.isSelectingWorld" position="0 1.8 0" />

      <!-- ARÈNE DE JEU - S'ORIENTE VERS LE MONDE SÉLECTIONNÉ -->
      <a-entity :rotation="`0 ${store.gameAngle} 0`">

        <!-- MENU DE DÉPART / GAME OVER -->
        <TheGameMenu v-if="!store.isPlaying && !store.isSelectingWorld" position="0 1.2 -1.2" rotation="-15 0 0 " />

        <!-- ÉCLAIRAGE D'APPOINT (Puits de lumière dynamique en partie) -->
        <a-entity v-if="store.isPlaying">
          <!-- Lumière chaude (droite) -->
          <a-light type="directional" position="5 3 2" color="#FFD700" intensity="0.5"></a-light>
          <!-- Lumière froide de contraste (gauche) -->
          <a-light type="directional" position="-5 3 -2" color="#00ffff" intensity="0.3"></a-light>
        </a-entity>

        <!-- ZONE DE JEU -->
        <a-ring position="0 0.1 0" rotation="-90 0 0" radius-inner="0.8" radius-outer="1" color="#ff8800"
          material="emissive: #ff4400"></a-ring>

        <TheRockSpawner />
      </a-entity>
    </template>
    <TheCameraRig />

  </a-scene>

</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { store } from '../store.js';
import { soundService } from '../sound.js';
import TheCameraRig from './TheCameraRig.vue';
import TheRockSpawner from './TheRockSpawner.vue';
import TheGameMenu from './TheGameMenu.vue';
import TheWorlds from './TheWorlds.vue';
const allAssetsLoaded = ref(false);

onMounted(() => {
  // Précharger tous les sons en mémoire (Web Audio API)
  soundService.preload();

  const sceneEl = document.querySelector('a-scene');
  if (sceneEl) {
    sceneEl.addEventListener('full-life-warning', () => {
      soundService.play('fullLife', { volume: 2.0 });
    });
  }
});

// Gérer la musique d'ambiance
watch(() => store.isPlaying, (isPlaying) => {
  if (isPlaying) {
    soundService.playMusic(0.6);
  } else {
    soundService.stopMusic();
  }
});

// Gérer les effets sonores de perte/gain de vie
watch(() => store.lives, (newLives, oldLives) => {
  // Gain de vie (Coeur)
  if (newLives > oldLives && oldLives > 0) {
    soundService.play('newLife', { volume: 1.5 });
  }
  // Perte de vie (Roche ratée)
  else if (newLives < oldLives && oldLives <= 3) {
    const livesLostCount = 3 - newLives;
    soundService.play(`loss${livesLostCount}`, { volume: 1.5 });
  }
});

</script>
