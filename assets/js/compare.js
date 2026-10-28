'use strict';

/**
 * MONTGOMERY Real Estate — Side-by-Side Property Comparison Engine
 * Allows users to select up to 3 properties, view in a floating dock,
 * and compare pricing, sqft, beds, baths, and amenities side-by-side.
 */

(function () {
  let compareIds = [];

  function initCompareEngine() {
    createCompareDockDOM();
    createCompareModalDOM();
    updateCompareButtons();
  }

  function getPropertyById(id) {
    if (typeof getAllProperties === 'function') {
      return getAllProperties().find(p => p.id === id);
    }
    return null;
  }

  function createCompareDockDOM() {
    if (document.getElementById('compareDock')) return;

    const dock = document.createElement('aside');
    dock.id = 'compareDock';
    dock.className = 'compare-dock';
    dock.setAttribute('aria-label', 'Property comparison bar');

    dock.innerHTML = `
      <div class="compare-dock-items" id="compareDockThumbs"></div>
      <div class="compare-dock-info">
        <span class="compare-dock-title">Compare Listings</span>
        <span class="compare-dock-count" id="compareDockCount">0/3 Selected</span>
      </div>
      <div class="compare-dock-actions">
        <button type="button" class="btn btn-primary compare-dock-btn" id="openCompareModalBtn">
          <span class="material-symbols-rounded" style="font-size: 18px;" aria-hidden="true">compare_arrows</span>
          <span>Compare Now</span>
        </button>
        <button type="button" class="compare-clear-btn" id="clearCompareBtn">Clear</button>
      </div>
    `;

    document.body.appendChild(dock);

    document.getElementById('openCompareModalBtn').addEventListener('click', openCompareModal);
    document.getElementById('clearCompareBtn').addEventListener('click', clearCompare);
  }

  function createCompareModalDOM() {
    if (document.getElementById('compareModalBackdrop')) return;

    const modal = document.createElement('div');
    modal.id = 'compareModalBackdrop';
    modal.className = 'compare-modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Side-by-side property comparison');

    modal.innerHTML = `
      <div class="compare-modal-card">
        <div class="compare-modal-header">
          <h2 class="compare-modal-title">Property Comparison Matrix</h2>
          <button type="button" class="calc-close-btn" id="closeCompareModalBtn" aria-label="Close comparison">
            <span class="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
        </div>
        <div class="compare-modal-body" id="compareModalBody">
          <!-- Populated by JS -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeCompareModalBtn').addEventListener('click', closeCompareModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCompareModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeCompareModal();
      }
    });
  }

  window.toggleCompare = function (id) {
    id = Number(id);
    const index = compareIds.indexOf(id);

    if (index > -1) {
      compareIds.splice(index, 1);
      if (typeof showToast === 'function') {
        showToast('Property removed from comparison.');
      }
    } else {
      if (compareIds.length >= 3) {
        if (typeof showToast === 'function') {
          showToast('You can compare a maximum of 3 properties at once.');
        }
        return;
      }
      compareIds.push(id);
      if (typeof showToast === 'function') {
        showToast(`Property added to comparison (${compareIds.length}/3).`);
      }
    }

    renderDock();
    updateCompareButtons();
  };

  function updateCompareButtons() {
    document.querySelectorAll('.property-compare-btn').forEach(btn => {
      const pid = Number(btn.dataset.propertyId);
      const isSelected = compareIds.includes(pid);
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-label', isSelected ? 'Remove from compare' : 'Add to compare');
      const icon = btn.querySelector('.material-symbols-rounded');
      if (icon) {
        icon.textContent = isSelected ? 'check' : 'compare_arrows';
      }
    });
  }

  function renderDock() {
    const dock = document.getElementById('compareDock');
    const thumbsContainer = document.getElementById('compareDockThumbs');
    const countEl = document.getElementById('compareDockCount');

    if (!dock || !thumbsContainer) return;

    if (compareIds.length === 0) {
      dock.classList.remove('is-visible');
      return;
    }

    countEl.textContent = `${compareIds.length}/3 Selected`;

    thumbsContainer.innerHTML = compareIds.map(id => {
      const p = getPropertyById(id);
      if (!p) return '';
      return `
        <div class="compare-dock-thumb" title="${escapeHtml(p.title)}">
          <img src="${p.image}" alt="${escapeHtml(p.title)}">
          <button type="button" class="compare-dock-thumb-remove" onclick="toggleCompare(${p.id});" aria-label="Remove ${escapeHtml(p.title)}">✕</button>
        </div>
      `;
    }).join('');

    dock.classList.add('is-visible');
  }

  function clearCompare() {
    compareIds = [];
    renderDock();
    updateCompareButtons();
    closeCompareModal();
    if (typeof showToast === 'function') {
      showToast('Comparison list cleared.');
    }
  }

  function openCompareModal() {
    if (compareIds.length === 0) return;
    const body = document.getElementById('compareModalBody');
    const modal = document.getElementById('compareModalBackdrop');
    if (!body || !modal) return;

    const list = compareIds.map(id => getPropertyById(id)).filter(Boolean);
    if (list.length === 0) return;

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

    const fmtPerSqft = (p) => {
      let perSqft = Math.round(p.price / p.area);
      let symbol = '$';
      if (isINR) {
        perSqft = Math.round(perSqft * rate);
        symbol = '₹';
        return `${symbol}${perSqft.toLocaleString('en-IN')}/sqft`;
      }
      return `${symbol}${perSqft.toLocaleString('en-US')}/sqft`;
    };

    body.innerHTML = `
      <table class="compare-table">
        <tbody>
          <tr>
            <th>Property</th>
            ${list.map(p => `
              <td>
                <div class="compare-prop-card">
                  <img src="${p.image}" alt="${escapeHtml(p.title)}" class="compare-prop-img">
                  <h3 class="compare-prop-name">${escapeHtml(p.title)}</h3>
                  <div class="compare-prop-price">${fmtPrice(p)}</div>
                  <span class="compare-tag" style="margin-top: 6px;">${p.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
                </div>
              </td>
            `).join('')}
          </tr>

          <tr>
            <th>Location</th>
            ${list.map(p => `<td>${escapeHtml(p.location)}</td>`).join('')}
          </tr>

          <tr>
            <th>Price per Sq Ft</th>
            ${list.map(p => `<td><strong>${fmtPerSqft(p)}</strong></td>`).join('')}
          </tr>

          <tr>
            <th>Type</th>
            ${list.map(p => `<td>${p.type.charAt(0).toUpperCase() + p.type.slice(1)}</td>`).join('')}
          </tr>

          <tr>
            <th>Bedrooms</th>
            ${list.map(p => `<td><strong>${p.bedrooms}</strong> Bedrooms</td>`).join('')}
          </tr>

          <tr>
            <th>Bathrooms</th>
            ${list.map(p => `<td><strong>${p.bathrooms}</strong> Bathrooms</td>`).join('')}
          </tr>

          <tr>
            <th>Total Area</th>
            ${list.map(p => `<td><strong>${p.area.toLocaleString()}</strong> sqft</td>`).join('')}
          </tr>

          <tr>
            <th>Key Amenities</th>
            ${list.map(p => `
              <td>
                ${(p.amenities || []).map(a => `<span class="compare-amenity-pill">${escapeHtml(a)}</span>`).join('')}
              </td>
            `).join('')}
          </tr>

          <tr>
            <th>Action</th>
            ${list.map(p => `
              <td>
                <button type="button" class="btn btn-primary" style="width: 100%; font-size: var(--fs-xs); padding: 8px 12px;" onclick="closeCompareModal(); openPropertyModal(${p.id});">
                  View Full Details
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCompareModal() {
    const modal = document.getElementById('compareModalBackdrop');
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.openCompareModal = openCompareModal;
  window.closeCompareModal = closeCompareModal;
  window.clearCompare = clearCompare;
  window.initCompareEngine = initCompareEngine;

  document.addEventListener('DOMContentLoaded', () => {
    initCompareEngine();
  });
})();
