/**
 * GraphicCity — Firebase Client-side Initialization
 * Analytics & future client features.
 */

(function () {
  'use strict';

  if (typeof firebase === 'undefined') return;

  var firebaseConfig = {
    apiKey: "AIzaSyBNgwEqtSW4VfywhCHqxMofccRhmpVobfg",
    authDomain: "creativecity-86634.firebaseapp.com",
    projectId: "creativecity-86634",
    storageBucket: "creativecity-86634.firebasestorage.app",
    messagingSenderId: "211743234228",
    appId: "1:211743234228:web:dc64630ae7665838751fe1",
    measurementId: "G-6VE27BLZX6"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  var analytics = firebase.analytics();

  // Track page views
  analytics.logEvent('page_view', {
    page_title: document.title,
    page_path: window.location.pathname
  });

  // Track HTMX navigation
  document.body.addEventListener('htmx:afterSwap', function () {
    analytics.logEvent('page_view', {
      page_title: document.title,
      page_path: window.location.pathname
    });
  });

})();
