<template>
  <!-- 🚀 LES ROCHES VOLCANIQUES (BOUCLE VUE) -->

  <!-- On utilise v-for pour afficher chaque roche du tableau 'rocks' -->
  <a-entity v-for="rock in rocks" :key="rock.id" :position="`${rock.x} ${rock.y} -20`"
    :fly-forward="`speed: ${rock.speed}`" hand-collision @hit="removeRock(rock.id, true)"
    @out-of-bounds="removeRock(rock.id, false)">
    <!-- Visuel de la roche -->
    <a-dodecahedron radius="0.4" color="#330000" material="roughness: 1; emissive: #ff4400; emissiveIntensity: 0.5">
      <!-- Ajout d'une particule ou d'un coeur lumineux -->
      <a-entity light="type: point; color: #ff0000; distance: 2; intensity: 2"></a-entity>
    </a-dodecahedron>
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
  // Position X aléatoire (gauche/droite) entre -1.5 et 1.5
  const x = (Math.random() * GAME_WIDTH) - (GAME_WIDTH / 2);
  // Position Y aléatoire (hauteur) entre 1 et 2 (niveau tête/torse)
  const y = 1 + Math.random();
  // Vitesse aléatoire
  const speed = 4 + Math.random() * 4; // Entre 4 et 8 m/s

  rocks.value.push({ id, x, y, speed });
};

// Supprimer une roche
const removeRock = (id, hit = false) => {
  // On filtre le tableau pour garder tout sauf l'ID donné
  const rockIndex = rocks.value.findIndex(rock => rock.id === id);
  if (rockIndex !== -1) {
    if (hit) {
      store.addScore(1);
    } else {
      store.removeLife();
    }
    rocks.value.splice(rockIndex, 1);
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
