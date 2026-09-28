AFRAME.registerComponent('clickable', {
  schema: {
    color: {type: 'color', default: 'black'}
  },

  init: function () {
    this.cursor = null;
    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.el.addEventListener('mouseenter', this.onEnter);
    this.el.addEventListener('mouseleave', this.onLeave);
    this.el.addEventListener('click', this.onClick);
  },

  onClick: function (evt) {
    if (this.cursor && this.cursor.components.haptics) {
      this.cursor.components.haptics.pulse(1.0, 40); // Pulse fort au clic
    }
  },

  onEnter: function (evt) {
    this.cursor = evt.detail.cursorEl;
    if (this.cursor && this.cursor.components.haptics) {
      this.cursor.components.haptics.pulse(0.5, 15); // Pulse léger au survol
    }
    this.changeCursorColor(this.data.color, true);
  },

  onLeave: function (evt) {
    this.cursor = evt.detail.cursorEl;
    if (this.savedColor) {
      this.changeCursorColor(this.savedColor);
    }
    this.cursor = null;
    this.savedColor = null;
  },

  changeCursorColor: function (color, saveLast = false) {
    if (!this.cursor) return;
    const raycaster = this.cursor.getAttribute('raycaster');
    if (raycaster && raycaster.showLine) {
      if (saveLast) this.savedColor = raycaster.lineColor;
      if (color) this.cursor.setAttribute('raycaster', 'lineColor', color);
    } else {
      const material = this.cursor.getAttribute('material');
      if (!material) return;
      if (saveLast) this.savedColor = material.color;
      if (color) this.cursor.setAttribute('material', 'color', color);
    }
  },

  remove: function () {
    if (this.cursor && this.savedColor) {
      this.changeCursorColor(this.savedColor);
    }
    this.el.removeEventListener('mouseenter', this.onEnter);
    this.el.removeEventListener('mouseleave', this.onLeave);
    this.el.removeEventListener('click', this.onClick);
  },

});