'use strict';

/**
 * MONTGOMERY Real Estate — Saved / Shortlisted Properties Drawer Engine
 * Manages bookmarking, live badge count updates, and slide-out shortlist view.
 */

(function () {
  function initSavedDrawerDOM() {
    if (document.getElementById('savedDrawerBackdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'savedDrawerBackdrop';
    backdrop.className = 'saved-drawer-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Saved listings shortlist drawer');

    backdrop.innerHTML = `
      <div class="saved-drawer" id="savedDrawer">
        <div class="saved-drawer-header">
          <div class="saved-drawer-title-group">
            <span class="material-symbols-rounded" style="color: var(--color-gold);" aria-hidden="true">favorite</span>
            <h2 class="saved-drawer-title">Saved Listings</h2>
            <span class="saved-count-badge" id="savedDrawerCountBadge">0</span>
          </div>
          <button type="button" class="saved-drawer-close" id="savedDrawerCloseBtn" aria-label="Close saved drawer">
            <span class="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
        </div>

        <div class="saved-drawer-body" id="savedDrawerBody">
          <!-- Populated by JS -->
        </div>

        <div class="saved-drawer-footer" id="savedDrawerFooter" style="display:none;">
          <button type="button" class="btn btn-outline" style="font-size: var(--fs-xs); padding: 8px 14px;" id="clearAllSavedBtn">Clear All</button>
          <button type="button" class="btn btn-primary" style="font-size: var(--fs-xs); padding: 8px 16px;" onclick="closeSavedDrawer(); document.getElementById('properties')?.scrollIntoView({behavior:'smooth'});">Browse More</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    document.getElementById('savedDrawerCloseBtn').addEventListener('click', closeSavedDrawer);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeSavedDrawer();
    });

    document.getElementById('clearAllSavedBtn')?.addEventListener('click', clearAllSaved);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeSavedDrawer();
      }
    });

    updateSavedBadge();
  }

  function getSavedIds() {
    try {
      return JSON.parse(localStorage.getItem('montgomery_saved') || '[]');
    } catch {
      return [];
    }
  }

  function getProperty(id) {
    if (typeof getAllProperties === 'function') {
      return getAllProperties().find(p => p.id === id);
    }
    return null;
  }

  function updateSavedBadge() {
    const ids = getSavedIds();
    const count = ids.length;

    // Header counter pills
    document.querySelectorAll('.saved-count-badge, #headerSavedBadge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }

  function renderSavedList() {
    const body = document.getElementById('savedDrawerBody');
    const footer = document.getElementById('savedDrawerFooter');
    if (!body) return;

    const ids = getSavedIds();
    const countBadge = document.getElementById('savedDrawerCountBadge');
    if (countBadge) countBadge.textContent = ids.length;

    if (ids.length === 0) {
      if (footer) footer.style.display = 'none';
      body.innerHTML = `
        <div class="saved-drawer-empty">
          <span class="material-symbols-rounded saved-empty-icon" aria-hidden="true">favorite_border</span>
          <h3 class="saved-empty-title">No Saved Properties Yet</h3>
          <p class="saved-empty-desc">Click the heart icon on any property card to save your favorite luxury residences here.</p>
          <button type="button" class="btn btn-primary" style="font-size: var(--fs-small); padding: 10px 20px;" onclick="closeSavedDrawer(); document.getElementById('properties')?.scrollIntoView({behavior:'smooth'});">
            Explore Properties
          </button>
        </div>
      `;
      return;
    }

    if (footer) footer.style.display = 'flex';

    const isINR = window.activeCurrency === 'INR';
    const rate = window.currencyExchangeRate || 83.5;

    const fmtPrice = (p) => {
      let val = p.price;
      let symbol = '$';
      if (isINR) {
        val = Math.round(val * rate);
        symbol = '₹';
        return `${symbol}${val.toLocaleString('en-IN')}${p.purpose === 'rent' ? '/mo' : ''}`;
      }
      return `${symbol}${val.toLocaleString('en-US')}${p.purpose === 'rent' ? '/mo' : ''}`;
    };

    body.innerHTML = ids.map(id => {
      const p = getProperty(id);
      if (!p) return '';
      return `
        <article class="saved-item-card">
          <img src="${p.image}" alt="${escapeHtml(p.title)}" class="saved-item-img">
          <div class="saved-item-content">
            <div>
              <h4 class="saved-item-title">${escapeHtml(p.title)}</h4>
              <p class="saved-item-location">${escapeHtml(p.location)}</p>
            </div>
            <div class="saved-item-price">${fmtPrice(p)}</div>
            <div class="saved-item-actions">
              <button type="button" class="saved-item-view-btn" onclick="closeSavedDrawer(); openPropertyModal(${p.id});">
                View Listing
              </button>
              <button type="button" class="saved-item-remove-btn" onclick="removeSavedProperty(${p.id});" aria-label="Remove from saved">
                Remove
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  window.removeSavedProperty = function (id) {
    id = Number(id);
    let ids = getSavedIds().filter(i => i !== id);
    localStorage.setItem('montgomery_saved', JSON.stringify(ids));

    // Update heart icons on cards
    const cardHeart = document.querySelector(`.property-favorite[data-property-id="${id}"]`);
    if (cardHeart) {
      cardHeart.classList.remove('saved');
      const icon = cardHeart.querySelector('.material-symbols-rounded');
      if (icon) icon.textContent = 'favorite_border';
    }

    renderSavedList();
    updateSavedBadge();
    if (typeof showToast === 'function') {
      showToast('Property removed from saved listings.');
    }
  };

  function clearAllSaved() {
    localStorage.setItem('montgomery_saved', JSON.stringify([]));
    document.querySelectorAll('.property-favorite.saved').forEach(btn => {
      btn.classList.remove('saved');
      const icon = btn.querySelector('.material-symbols-rounded');
      if (icon) icon.textContent = 'favorite_border';
    });
    renderSavedList();
    updateSavedBadge();
    if (typeof showToast === 'function') {
      showToast('All saved properties cleared.');
    }
  }

  window.openSavedDrawer = function () {
    initSavedDrawerDOM();
    renderSavedList();
    const backdrop = document.getElementById('savedDrawerBackdrop');
    if (backdrop) {
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeSavedDrawer = function () {
    const backdrop = document.getElementById('savedDrawerBackdrop');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  window.updateSavedBadge = updateSavedBadge;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSavedDrawerDOM();
  });
})();
