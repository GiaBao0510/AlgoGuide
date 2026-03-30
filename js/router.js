/* ============================================
   router.js — Hash-based routing for 
   algorithm selection
   ============================================ */

const AlgoRouter = {
  listeners: [],

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    if (window.location.hash) {
      this.handleRoute();
    }
  },

  navigate(algorithmId) {
    window.location.hash = algorithmId;
  },

  handleRoute() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    this.listeners.forEach(fn => fn(hash));
  },

  onRouteChange(callback) {
    this.listeners.push(callback);
  },

  getCurrentRoute() {
    return window.location.hash.slice(1) || null;
  }
};
