import { reactive } from 'vue';

export const store = reactive({
  score: 0,
  lives: 3,
  level: 1,
  difficulty: 1,
  combo: 0,
  coins: 0,
  bestScore: 0,
  currentWorld: 'void',
  unlockedWorlds: ['volcano'], // Liste des mondes débloqués
  isGameOver: false,
  isPlaying: false,

  // Définition des mondes (pour faciliter l'évolution plus tard)
  worlds: {
    void: { name: 'The Void', preset: 'default', groundColor: '#111', skyColor: '#000', rockColor: '#333' },
    volcano: { name: 'Volcano', preset: 'volcano', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    contact: { name: 'Contact', preset: 'contact', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    egypt: { name: 'Egypt', preset: 'egypt', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    checkerboard: { name: 'Checkerboard', preset: 'checkerboard', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    forest: { name: 'Forest', preset: 'forest', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    goaland: { name: 'Goaland', preset: 'goaland', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    yavapai: { name: 'Yavapai', preset: 'yavapai', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    goldmine: { name: 'Goldmine', preset: 'goldmine', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    threetowers: { name: 'Three Towers', preset: 'threetowers', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    poison: { name: 'Poison', preset: 'poison', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    arches: { name: 'Arches', preset: 'arches', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    tron: { name: 'Tron', preset: 'tron', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    japan: { name: 'Japan', preset: 'japan', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    dream: { name: 'Dream', preset: 'dream', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    starry: { name: 'Starry', preset: 'starry', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    osiris: { name: 'Osiris', preset: 'osiris', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
    moon: { name: 'Moon', preset: 'moon', groundColor: '#440000', skyColor: 'atmosphere', rockColor: '#aa3300' },
  },

  reset() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.difficulty = 1;
    this.combo = 0;
    this.isGameOver = false;
    // Quand on reset, si on était dans le hub (void), on bascule sur le monde par défaut pour jouer
    if (this.currentWorld === 'void') {
      this.currentWorld = 'volcano';
    }
  },

  startGame() {
    this.reset();
    this.isPlaying = true;
  },

  addScore(points) {
    if (this.isGameOver) return;
    this.score += points;
  },

  removeLife() {
    if (this.isGameOver || !this.isPlaying) return;
    this.lives--;
    this.combo = 0; // Réinitialiser le combo quand on prend un coup/rate
    if (this.lives <= 0) {
      this.isGameOver = true;
      this.isPlaying = false;
      this.currentWorld = 'void'; // On retourne dans le Hub à la mort
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
      }
    }
  },

  addLife() {
    if (this.isGameOver || !this.isPlaying) return;
    if (this.lives < 3) {
      this.lives++;
      return true; // Vie rajoutée avec succès
    }
    return false; // Déjà max vies
  },

  addCoin(amount = 1) {
    if (this.isGameOver || !this.isPlaying) return;
    this.coins += amount;
  },

  removeCoin(amount = 1) {
    if (this.coins >= amount) {
      this.coins -= amount;
    }
  },

  incrementCombo() {
    this.combo++;
  },

  resetCombo() {
    this.combo = 0;
  }
});

