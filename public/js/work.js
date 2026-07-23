/**
 * GraphicCity — Work Page
 * Gallery overlay, keyboard navigation, body scroll lock
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── Expose gallery data to Alpine ─── */
  var projectData = null;

  try {
    var scriptTag = document.getElementById('project-data');
    if (scriptTag) projectData = JSON.parse(scriptTag.textContent);
  } catch (e) {
    console.warn('GraphicCity: Could not parse project data for gallery.');
  }

  /* ─── Alpine gallery component (registered globally) ─── */
  window.gallery = function () {
    return {
      open: false,
      currentProject: null,
      currentImage: 0,
      projects: projectData || [],

      openGallery: function (projectId) {
        this.currentProject = this.projects.find(function (p) { return p.id === projectId; }) || null;
        if (!this.currentProject) return;
        this.currentImage = 0;
        this.open = true;
        document.body.style.overflow = 'hidden';
      },

      next: function () {
        if (!this.currentProject || !this.currentProject.gallery) return;
        this.currentImage = (this.currentImage + 1) % this.currentProject.gallery.length;
      },

      prev: function () {
        if (!this.currentProject || !this.currentProject.gallery) return;
        this.currentImage = (this.currentImage - 1 + this.currentProject.gallery.length) % this.currentProject.gallery.length;
      },

      close: function () {
        this.open = false;
        document.body.style.overflow = '';
      }
    };
  };

  /* ─── Click handlers for project cards ─── */
  // When a project card is clicked, open the gallery via Alpine
  document.addEventListener('click', function (e) {
    var card = e.target.closest('.project-card');
    if (card) {
      var projectId = card.getAttribute('data-project-id');
      if (projectId && window.Alpine) {
        var galleryEl = document.getElementById('gallery-overlay');
        if (galleryEl && galleryEl.__x) {
          galleryEl.__x.$data.openGallery(projectId);
        } else {
          // Fallback: use the global function
          if (window.openGallery) window.openGallery(projectId);
        }
      }
    }
  });

  /* ─── Expose openGallery globally for @click use ─── */
  var galleryEl = document.getElementById('gallery-overlay');
  if (galleryEl && window.Alpine) {
    // Alpine will handle via the x-data binding
  }

  /* ─── HTMX: re-bind project cards after swap ─── */
  document.body.addEventListener('htmx:afterSwap', function (evt) {
    // Reinit Alpine on swapped content
    if (window.Alpine) {
      Alpine.initTree(evt.detail.target);
    }

    // Trigger entrance animations
    evt.detail.target.querySelectorAll('.project-card').forEach(function (el, idx) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      setTimeout(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 50 + idx * 60);
    });
  });

});
