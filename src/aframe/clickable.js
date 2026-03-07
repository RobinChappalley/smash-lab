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
    this.changeCursorColor(this.savedColor);
  },

  changeCursorColor: function (color, saveLast = false) {
    if (this.cursor.getAttribute('raycaster').showLine) {
      if (saveLast) this.savedColor = this.cursor.getAttribute('raycaster').lineColor;
      this.cursor.setAttribute('raycaster', 'lineColor', color);
    } else {
      if (!this.cursor.getAttribute('material')) return;
      if (saveLast) this.savedColor = this.cursor.getAttribute('material').color;
      this.cursor.setAttribute('material', 'color', color);
    }
  },

  remove: function () {
    this.changeCursorColor(this.savedColor);
    this.el.removeEventListener('mouseenter', this.onEnter);
    this.el.removeEventListener('mouseleave', this.onLeave);
    this.el.removeEventListener('click', this.onClick);
  },

});