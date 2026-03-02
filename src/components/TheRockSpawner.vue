<template>
  <!-- 🚀 LES ROCHES VOLCANIQUES (BOUCLE VUE) -->
  <!-- On utilise v-for pour afficher chaque roche du tableau 'rocks' -->
  <a-entity v-for="rock in rocks" :key="rock.id" :position="`${rock.x} ${rock.y} -20`"
    :fly-forward="`speed: ${rock.isHit ? 0 : rock.speed}`" :hand-collision="rock.isHit ? null : ''"
    @hit="removeRock(rock.id, true)" @out-of-bounds="removeRock(rock.id, false)">

    <!-- Visuel de la roche (Si pas touchée) -->
    <a-dodecahedron v-if="!rock.isHit" radius="0.4" color="#330000"
      material="roughness: 1; emissive: #ff4400; emissiveIntensity: 0.5">
      <a-entity light="type: point; color: #ff0000; distance: 2; intensity: 2"></a-entity>
    </a-dodecahedron>

    <!-- EFFET D'EXPLOSION (Si touchée) - On l'éloigne de 0.5m pour qu'il ne soit pas "dans les yeux" -->
    <a-entity v-else explode position="0 0 -0.5"
      :sound="`src: #hit-sound; autoplay: true; volume: 2; positional: true`"></a-entity>
  </a-entity>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { store } from '../store.js';

// --- ÉTAT DU JEU ---
const rocks = ref([]);
let gameLoop;

const GAME_WIDTH = 2;

// Créer une roche
const spawnRock = () => {
  if (store.isGameOver) return;

  const id = Date.now();
  const x = (Math.random() * GAME_WIDTH) - (GAME_WIDTH / 2);
  const y = 1 + Math.random();
  const speed = 4 + Math.random() * 4;

  rocks.value.push({ id, x, y, speed, isHit: false });
};

// Supprimer une roche
const removeRock = (id, hit = false) => {
  const rockIndex = rocks.value.findIndex(rock => rock.id === id);
  if (rockIndex !== -1) {
    if (hit) {
      store.addScore(1);
      // On marque la roche comme touchée au lieu de la supprimer
      rocks.value[rockIndex].isHit = true;

      // On attend la fin de l'effet d'explosion pour la supprimer du DOM
      setTimeout(() => {
        const finalIdx = rocks.value.findIndex(rock => rock.id === id);
        if (finalIdx !== -1) rocks.value.splice(finalIdx, 1);
      }, 1000);
    } else {
      store.removeLife();
      rocks.value.splice(rockIndex, 1);
    }
  }
};

// --- CYCLE DE VIE VUE ---
onMounted(() => {
  // On ne lance plus l'intervalle ici, on attend isPlaying
});

onUnmounted(() => {
  // Nettoyer l'intervalle si on quitte la page
  clearInterval(gameLoop);
});

// Gérer le démarrage et l'arrêt du jeu
watch(() => store.isPlaying, (isPlaying) => {
  if (isPlaying) {
    // Vider les roches restantes d'une partie précédente
    rocks.value = [];
    // Lancer le générateur
    gameLoop = setInterval(spawnRock, 1000);
  } else {
    clearInterval(gameLoop);
  }
});
</script>
