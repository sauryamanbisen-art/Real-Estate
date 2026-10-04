'use strict';

/**
 * MONTGOMERY Real Estate — Sell & Rent Property Submission Script
 * Handles drag-and-drop image upload with live previews, multi-field form validation,
 * local storage persistence for user-created listings, and interactive feedback.
 */

/* ==========================================
   STATE
   ========================================== */

let uploadedImageUrls = [];

/* ==========================================
   INITIALIZATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFileUpload();
  initSellForm();
  prefillUserInfo();
  updateSellHeaderAuth();
  initNavigation();
});

/* ==========================================
   NAVIGATION (FOR SELL PAGE)
   ========================================== */

function initNavigation() {
  const toggler = document.querySelector('[data-nav-toggler]');
  const navbar = document.querySelector('[data-navbar]');

  if (!toggler || !navbar) return;
  if (toggler._hasNavListener) return;
  toggler._hasNavListener = true;

  toggler.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('active');
    toggler.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') &&
        !navbar.contains(e.target) &&
        !toggler.contains(e.target)) {
      navbar.classList.remove('active');
      toggler.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================
   AUTH SYNC FOR HEADER & FORM
   ========================================== */

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('montgomery_current_user') || 'null');
  } catch {
    return null;
  }
}

function updateSellHeaderAuth() {
  const user = getCurrentUser();
  const navbarActions = document.querySelector('.navbar-actions');
  if (!navbarActions || !user) return;

  const firstName = user.name ? user.name.split(' ')[0] : 'Member';
  navbarActions.innerHTML = `
    <span class="user-greeting" style="color: var(--color-gold); font-size: var(--fs-small); font-weight: var(--fw-medium); display: flex; align-items: center; gap: 4px;">
      <span class="material-symbols-rounded" style="font-size: 18px;" aria-hidden="true">account_circle</span>
      <span>${escapeHtml(firstName)}</span>
    </span>
    <button type="button" class="nav-action-link" id="sellSignOutBtn" style="background:none; border:none; cursor:pointer; color: var(--color-text-secondary); font-size: var(--fs-small); transition: color var(--transition-fast);">
      Sign Out
    </button>
  `;

  const btn = document.getElementById('sellSignOutBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.removeItem('montgomery_current_user');
      window.location.reload();
    });
  }
}

function prefillUserInfo() {
  const user = getCurrentUser();
  if (!user) return;

  const nameInput = document.getElementById('sellContactName');
  const emailInput = document.getElementById('sellContactEmail');

  if (nameInput && !nameInput.value && user.name) {
    nameInput.value = user.name;
  }
  if (emailInput && !emailInput.value && user.email) {
    emailInput.value = user.email;
  }
}

/* ==========================================
   FILE UPLOAD (DRAG & DROP + BROWSE)
   ========================================== */

function initFileUpload() {
  const dropArea = document.getElementById('fileUploadArea');
  const fileInput = document.getElementById('sellImages');
  const previewContainer = document.getElementById('filePreview');

  if (!dropArea || !fileInput || !previewContainer) return;

  // Drag and drop event handlers
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.style.borderColor = 'var(--color-gold)';
      dropArea.style.background = 'rgba(201, 168, 76, 0.05)';
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.style.borderColor = '';
      dropArea.style.background = '';
    });
  });

  dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please select valid image files (JPEG, PNG, WebP).');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 5MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        uploadedImageUrls.push(dataUrl);
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPreviews() {
    previewContainer.innerHTML = '';
    uploadedImageUrls.forEach((url, idx) => {
      const item = document.createElement('div');
      item.className = 'file-preview-item';
      item.innerHTML = `
        <img src="${url}" alt="Property image preview ${idx + 1}">
        <button type="button" class="file-preview-remove" title="Remove image" aria-label="Remove image">
          <span class="material-symbols-rounded" style="font-size: 14px;">close</span>
        </button>
      `;

      item.querySelector('.file-preview-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        uploadedImageUrls.splice(idx, 1);
        renderPreviews();
      });

      previewContainer.appendChild(item);
    });
  }
}

/* ==========================================
   SELL FORM VALIDATION & SUBMISSION
   ========================================== */

function initSellForm() {
  const form = document.getElementById('sellForm');
  if (!form) return;

  const fields = [
    { id: 'sellTitle', errorId: 'sellTitleError', validate: val => val.length >= 5 ? '' : 'Title must be at least 5 characters.' },
    { id: 'sellType', errorId: 'sellTypeError', validate: val => val ? '' : 'Please select a property type.' },
    { id: 'sellLocation', errorId: 'sellLocationError', validate: val => val.length >= 5 ? '' : 'Please provide a valid address or area.' },
    { id: 'sellPrice', errorId: 'sellPriceError', validate: val => Number(val) > 0 ? '' : 'Please enter a valid asking price.' },
    { id: 'sellBedrooms', errorId: 'sellBedroomsError', validate: val => val !== '' && Number(val) >= 0 ? '' : 'Bedrooms count is required.' },
    { id: 'sellBathrooms', errorId: 'sellBathroomsError', validate: val => val !== '' && Number(val) >= 0 ? '' : 'Bathrooms count is required.' },
    { id: 'sellArea', errorId: 'sellAreaError', validate: val => Number(val) >= 50 ? '' : 'Area must be at least 50 sqft.' },
    { id: 'sellContactName', errorId: 'sellContactNameError', validate: val => val.trim().length >= 2 ? '' : 'Contact name is required.' },
    { id: 'sellContactEmail', errorId: 'sellContactEmailError', validate: val => isValidEmail(val) ? '' : 'Valid contact email is required.' }
  ];

  // Clear errors on input
  fields.forEach(field => {
    const el = document.getElementById(field.id);
    const errEl = document.getElementById(field.errorId);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        if (errEl) errEl.textContent = '';
      });
      el.addEventListener('change', () => {
        el.classList.remove('error');
        if (errEl) errEl.textContent = '';
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate each field
    fields.forEach(field => {
      const el = document.getElementById(field.id);
      const errEl = document.getElementById(field.errorId);
      if (el) {
        const errorMsg = field.validate(el.value);
        if (errorMsg) {
          el.classList.add('error');
          if (errEl) errEl.textContent = errorMsg;
          if (isValid) {
            el.focus();
            isValid = false;
          }
        }
      }
    });

    if (!isValid) return;

    const statusEl = document.getElementById('sellStatus');
    const submitBtn = document.getElementById('sellSubmit');

    setButtonLoading(submitBtn, true);
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }

    // Simulate saving listing
    setTimeout(() => {
      const title = document.getElementById('sellTitle').value.trim();
      const type = document.getElementById('sellType').value;
      const location = document.getElementById('sellLocation').value.trim();
      const price = Number(document.getElementById('sellPrice').value);
      const bedrooms = Number(document.getElementById('sellBedrooms').value);
      const bathrooms = Number(document.getElementById('sellBathrooms').value);
      const area = Number(document.getElementById('sellArea').value);
      const description = document.getElementById('sellDescription')?.value.trim();
      const contactName = document.getElementById('sellContactName').value.trim();
      const contactEmail = document.getElementById('sellContactEmail').value.trim();
      const contactPhone = document.getElementById('sellContactPhone')?.value.trim();

      const newListing = {
        id: Date.now(),
        title,
        location,
        price,
        type,
        purpose: 'sale',
        bedrooms,
        bathrooms,
        area,
        image: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : './assets/images/property-luxury-1.jpg',
        badge: 'New Listing',
        description: description || 'Beautifully presented luxury property featuring high-end finishes, spacious layout, and premium location.',
        amenities: ['Recently Listed', 'Verified Seller', 'Virtual Tour Ready'],
        featured: true,
        seller: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone || 'Direct Inquiry'
        },
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      saveCustomProperty(newListing);

      setButtonLoading(submitBtn, false);

      if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.innerHTML = `
          <span>Listing published successfully! Your property is now active in the catalogue.</span>
          <a href="index.html#properties" style="margin-left: 12px; color: var(--color-gold); font-weight: bold; text-decoration: underline;">View on Homepage &rarr;</a>
        `;
      }

      // Reset form
      form.reset();
      uploadedImageUrls = [];
      const previewContainer = document.getElementById('filePreview');
      if (previewContainer) previewContainer.innerHTML = '';
      prefillUserInfo();

      // Scroll status into view
      statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 800);
  });
}

function saveCustomProperty(property) {
  try {
    const existing = JSON.parse(localStorage.getItem('montgomery_custom_properties') || '[]');
    existing.unshift(property);
    localStorage.setItem('montgomery_custom_properties', JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving custom property to localStorage:', e);
  }
}

/* ==========================================
   HELPERS
   ========================================== */

function setButtonLoading(btn, isLoading) {
  if (!btn) return;
  const textEl = btn.querySelector('.btn-text');
  const loaderEl = btn.querySelector('.btn-loader');

  btn.disabled = isLoading;
  if (textEl) textEl.style.opacity = isLoading ? '0' : '1';
  if (loaderEl) loaderEl.style.display = isLoading ? 'inline-block' : 'none';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
