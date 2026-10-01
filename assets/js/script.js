'use strict';

/**
 * MONTGOMERY Real Estate — Main Application Script
 * Handles: Navigation, Property Data, Search, Filters, Category Cards,
 * Property Detail Modal, Inquiry Submissions, Agents, Saved Favorites,
 * LocalStorage Custom Listings & Auth Session Sync, and Scroll Animations.
 */

/* ==========================================
   CONFIGURATION
   ========================================== */

const BRAND_NAME = 'MONTGOMERY';

/* ==========================================
   DEMO PROPERTY DATA
   Note: All properties below are demonstration data for development.
   They do not represent real listings.
   ========================================== */

const properties = [
  {
    id: 1,
    title: 'Sunset Ridge Modern Villa',
    location: '1420 Sunset Ridge Dr, Beverly Hills, CA 90210',
    price: 2450000,
    type: 'house',
    purpose: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    area: 3800,
    image: './assets/images/property-luxury-1.jpg',
    badge: 'Featured',
    description: 'A stunning contemporary villa featuring floor-to-ceiling windows, an infinity pool, and panoramic views. This architectural masterpiece blends indoor and outdoor living seamlessly.',
    amenities: ['Swimming Pool', 'Home Theater', 'Wine Cellar', 'Smart Home System', 'Heated Floors', '3-Car Garage', 'Outdoor Kitchen', 'Security System'],
    featured: true
  },
  {
    id: 2,
    title: 'Aurora Residences Penthouse',
    location: '88 Park Avenue South, New York, NY 10016',
    price: 1850000,
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    image: './assets/images/property-luxury-2.jpg',
    badge: 'New',
    description: 'Luxury penthouse in the heart of Manhattan with breathtaking skyline views. Features premium finishes, a gourmet kitchen, and a private terrace overlooking the city.',
    amenities: ['Concierge', 'Rooftop Terrace', 'Fitness Center', 'Doorman', 'Private Elevator', 'Central Air', 'Built-in Storage', 'Pet Friendly'],
    featured: true
  },
  {
    id: 3,
    title: 'Oakwood Family Residence',
    location: '2715 Oakwood Lane, Greenwich, CT 06830',
    price: 985000,
    type: 'house',
    purpose: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    image: './assets/images/property-1.jpg',
    description: 'A beautifully renovated family home with a spacious backyard, modern kitchen, and cozy fireplace. Located in a quiet neighborhood with top-rated schools nearby.',
    amenities: ['Fireplace', 'Garden', 'Attached Garage', 'Central Heating', 'Hardwood Floors', 'Updated Kitchen', 'Patio', 'Storage Room'],
    featured: true
  },
  {
    id: 4,
    title: 'Metropolitan Loft Studio',
    location: '445 West 19th Street, Chicago, IL 60616',
    price: 2800,
    type: 'apartment',
    purpose: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    image: './assets/images/property-2.jpg',
    description: 'A stylish loft apartment in the vibrant West Loop neighborhood. Exposed brick, high ceilings, and industrial-chic design. Walking distance to restaurants and transit.',
    amenities: ['In-unit Laundry', 'High Ceilings', 'Exposed Brick', 'Bike Storage', 'Package Room', 'Rooftop Access'],
    featured: true
  },
  {
    id: 5,
    title: 'Seaside Villa Retreat',
    location: '1200 Ocean Front Walk, Santa Monica, CA 90401',
    price: 3200000,
    type: 'villa',
    purpose: 'sale',
    bedrooms: 6,
    bathrooms: 5,
    area: 4500,
    image: './assets/images/property-3.jpg',
    badge: 'Premium',
    description: 'An extraordinary oceanfront villa offering direct beach access, a resort-style pool, and multiple entertainment areas. Perfect for those seeking the ultimate coastal lifestyle.',
    amenities: ['Ocean View', 'Private Beach Access', 'Infinity Pool', 'Guest House', 'Home Office', 'Outdoor Shower', 'Fire Pit', 'Solar Panels'],
    featured: true
  },
  {
    id: 6,
    title: 'Riverside Townhouse',
    location: '380 Riverside Drive, Portland, OR 97201',
    price: 3500,
    type: 'townhouse',
    purpose: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: './assets/images/property-4.jpg',
    description: 'A charming townhouse along the Willamette River with a private deck, modern interiors, and walking trails right outside your door. Ideal for families and nature lovers.',
    amenities: ['River Views', 'Private Deck', 'In-unit Laundry', 'Parking Included', 'Central Air', 'Dishwasher', 'Pets Allowed'],
    featured: true
  },
  {
    id: 7,
    title: 'Heritage Square Apartment',
    location: '1055 Heritage Square, Boston, MA 02109',
    price: 4200,
    type: 'apartment',
    purpose: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: './assets/images/property-5.jpg',
    description: 'Elegant apartment in historic Back Bay with classic brownstone charm and modern updates. Close to the Charles River Esplanade and fine dining.',
    amenities: ['Gym Access', 'Concierge', 'Hardwood Floors', 'Crown Molding', 'Bay Windows', 'Controlled Entry'],
    featured: false
  },
  {
    id: 8,
    title: 'Mountain View Estate',
    location: '8900 Alpine Ridge Rd, Aspen, CO 81611',
    price: 4750000,
    type: 'house',
    purpose: 'sale',
    bedrooms: 7,
    bathrooms: 6,
    area: 6200,
    image: './assets/images/property-6.jpg',
    badge: 'Luxury',
    description: 'A magnificent mountain estate with ski-in access, a heated outdoor pool, and world-class views of the Rockies. Features a spa, wine cellar, and home theater.',
    amenities: ['Mountain Views', 'Ski-in Access', 'Heated Pool', 'Home Spa', 'Wine Cellar', 'Theater Room', 'Mudroom', 'Elevator'],
    featured: false
  }
];

/* ==========================================
   CUSTOM PROPERTIES FROM LOCALSTORAGE
   ========================================== */

function getCustomProperties() {
  try {
    return JSON.parse(localStorage.getItem('montgomery_custom_properties') || '[]');
  } catch (e) {
    console.error('Failed to parse custom properties', e);
    return [];
  }
}

function getAllProperties() {
  return [...getCustomProperties(), ...properties];
}

/* ==========================================
   DEMO AGENTS DATA
   ========================================== */

const agents = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Senior Real Estate Agent',
    bio: 'Specializing in luxury residential properties with over 12 years of experience in premium markets.',
    avatar: './assets/images/avatar-1.jpg'
  },
  {
    id: 2,
    name: 'James Anderson',
    role: 'Commercial Specialist',
    bio: 'Expert in commercial and investment properties. Helping clients maximize returns since 2015.',
    avatar: './assets/images/avatar-2.jpg'
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Residential Advisor',
    bio: 'Passionate about helping families find their perfect home. Focused on suburban and family properties.',
    avatar: './assets/images/avatar-3.jpg'
  },
  {
    id: 4,
    name: 'Michael Torres',
    role: 'Rental Market Expert',
    bio: 'Dedicated to matching tenants with ideal rental properties. Deep knowledge of urban rental markets.',
    avatar: './assets/images/avatar-4.jpg'
  }
];

/* ==========================================
   DOM READY
   ========================================== */

function initApp() {
  initNavigation();
  initHeader();
  renderProperties(getAllProperties());
  renderAgents();
  initSearch();
  initPropertyFilters();
  initCategoryCards();
  initModal();
  initScrollReveal();
  initStartSearching();
  initSavedProperties();
  updateHeaderAuth();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================
   USER AUTH SESSION HEADER
   ========================================== */

function updateHeaderAuth() {
  try {
    const user = JSON.parse(localStorage.getItem('montgomery_current_user') || 'null');
    const actions = document.querySelector('.navbar-actions');
    if (!actions || !user) return;

    const firstName = user.name ? user.name.split(' ')[0] : 'Member';
    actions.innerHTML = `
      <span class="user-greeting" style="color: var(--color-gold); font-size: var(--fs-small); font-weight: var(--fw-medium); display: flex; align-items: center; gap: 6px;">
        <span class="material-symbols-rounded" style="font-size: 20px;" aria-hidden="true">account_circle</span>
        <span>${escapeHtml(firstName)}</span>
      </span>
      <button type="button" class="nav-action-link" id="mainSignOutBtn" style="background:none; border:none; cursor:pointer; color: var(--color-text-secondary); font-size: var(--fs-small); transition: color var(--transition-fast);">
        Sign Out
      </button>
    `;

    document.getElementById('mainSignOutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('montgomery_current_user');
      window.location.reload();
    });
  } catch (e) {
    console.error('Error in updateHeaderAuth', e);
  }
}

/* ==========================================
   NAVIGATION
   ========================================== */

function initNavigation() {
  const toggler = document.querySelector('[data-nav-toggler]');
  const navbar = document.querySelector('[data-navbar]');
  const backdrop = document.querySelector('[data-nav-backdrop]');

  if (!toggler || !navbar) return;
  if (toggler._hasNavListener) return;
  toggler._hasNavListener = true;

  const closeMenu = () => {
    navbar.classList.remove('active');
    toggler.classList.remove('active');
    toggler.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navbar.classList.add('active');
    toggler.classList.add('active');
    toggler.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  toggler.addEventListener('click', () => {
    if (navbar.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Close on link click & update active state
  const navLinks = navbar.querySelectorAll('.nav-link, .nav-action-link, .nav-contact-btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link.classList.contains('nav-link')) {
        navbar.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
      closeMenu();
    });
  });

  // Dynamic active link indicator on scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 160;
    const propsSec = document.getElementById('properties');
    const agentsSec = document.getElementById('agents');

    let currentSection = 'hero';
    if (agentsSec && scrollPos >= agentsSec.offsetTop) {
      currentSection = 'agents';
    } else if (propsSec && scrollPos >= propsSec.offsetTop) {
      currentSection = 'properties';
    } else {
      currentSection = 'hero';
    }

    navbar.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      } else if (href && href.startsWith('#')) {
        link.classList.remove('active');
      }
    });
  }, { passive: true });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') &&
        !navbar.contains(e.target) &&
        !toggler.contains(e.target)) {
      closeMenu();
    }
  });

  // Escape key closes mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
      closeMenu();
      toggler.focus();
    }
  });
}

/* ==========================================
   HEADER SCROLL
   ========================================== */

function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================
   RENDER PROPERTIES
   ========================================== */

function renderProperties(list) {
  const grid = document.getElementById('propertyGrid');
  const empty = document.getElementById('propertyEmpty');
  if (!grid) return;

  if (list.length === 0) {
    grid.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  if (empty) empty.style.display = 'none';

  grid.innerHTML = list.map(p => createPropertyCard(p)).join('');

  // Attach card click handlers
  grid.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.property-favorite')) return;
      const id = parseInt(card.dataset.id);
      openPropertyModal(id);
    });
  });

  // Attach favorite handlers
  grid.querySelectorAll('.property-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn);
    });
  });
}

function createPropertyCard(p) {
  const isRental = p.purpose === 'rent';
  const priceStr = isRental
    ? `$${p.price.toLocaleString()}<span class="property-price-period">/mo</span>`
    : `$${p.price.toLocaleString()}`;
  const badgeClass = isRental ? 'badge-rent' : 'badge-sale';
  const badgeText = p.badge || (isRental ? 'For Rent' : 'For Sale');
  const saved = getSavedProperties().includes(p.id);

  return `
    <article class="property-card reveal" data-id="${p.id}" data-type="${p.type}" data-purpose="${p.purpose}">
      <div class="property-card-image">
        <img src="${p.image}" alt="${p.title}" width="400" height="275" loading="lazy"
             onerror="this.src='./assets/images/property-1.jpg'">
        <span class="property-badge ${badgeClass}">${badgeText}</span>
        <button class="property-favorite ${saved ? 'saved' : ''}" aria-label="${saved ? 'Remove from saved' : 'Save property'}" data-property-id="${p.id}">
          <span class="material-symbols-rounded" aria-hidden="true">${saved ? 'favorite' : 'favorite_border'}</span>
        </button>
      </div>
      <div class="property-card-body">
        <p class="property-price">${priceStr}</p>
        <h3 class="property-name">${escapeHtml(p.title)}</h3>
        <p class="property-location">
          <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
          ${escapeHtml(p.location)}
        </p>
        <div class="property-meta">
          <span class="property-meta-item">
            <span class="material-symbols-rounded" aria-hidden="true">bed</span>
            ${p.bedrooms} Bed
          </span>
          <span class="property-meta-item">
            <span class="material-symbols-rounded" aria-hidden="true">bathtub</span>
            ${p.bathrooms} Bath
          </span>
          <span class="property-meta-item">
            <span class="material-symbols-rounded" aria-hidden="true">straighten</span>
            ${p.area.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================
   RENDER AGENTS
   ========================================== */

function renderAgents() {
  const grid = document.getElementById('agentsGrid');
  if (!grid) return;

  grid.innerHTML = agents.map(a => `
    <div class="agent-card reveal">
      <img src="${a.avatar}" alt="${a.name}" class="agent-avatar" width="80" height="80" loading="lazy"
           onerror="this.style.background='var(--color-bg-elevated)'">
      <h3 class="agent-name">${escapeHtml(a.name)}</h3>
      <p class="agent-role">${escapeHtml(a.role)}</p>
      <p class="agent-bio">${escapeHtml(a.bio)}</p>
      <button type="button" class="agent-contact-btn" data-agent-name="${escapeHtml(a.name)}" data-agent-role="${escapeHtml(a.role)}">
        <span class="material-symbols-rounded" aria-hidden="true">mail</span>
        Contact
      </button>
    </div>
  `).join('');

  grid.querySelectorAll('.agent-contact-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.agentName;
      const role = btn.dataset.agentRole;
      contactAgent(name, role);
    });
  });
}

function contactAgent(name, role) {
  showToast(`Inquiry sent to ${name} (${role}). An agent will reach out to you shortly.`);
}

/* ==========================================
   SEARCH FUNCTIONALITY
   ========================================== */

function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearFiltersBtn');

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', resetAllFilters);
  }

  // Allow enter key in search inputs
  document.querySelectorAll('#searchBar input, #searchBar select').forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  });
}

function performSearch() {
  const location = (document.getElementById('searchLocation')?.value || '').toLowerCase().trim();
  const type = document.getElementById('searchType')?.value || '';
  const purpose = document.getElementById('searchPurpose')?.value || '';
  const minPrice = parseInt(document.getElementById('searchMinPrice')?.value) || 0;
  const maxPrice = parseInt(document.getElementById('searchMaxPrice')?.value) || Infinity;
  const bedrooms = parseInt(document.getElementById('searchBedrooms')?.value) || 0;

  const all = getAllProperties();

  const filtered = all.filter(p => {
    if (location && !p.location.toLowerCase().includes(location) && !p.title.toLowerCase().includes(location)) return false;
    if (type && p.type !== type) return false;
    if (purpose && p.purpose !== purpose) return false;
    if (p.price < minPrice) return false;
    if (p.price > maxPrice) return false;
    if (bedrooms && p.bedrooms < bedrooms) return false;
    return true;
  });

  // Reset property filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');

  renderProperties(filtered);

  // Scroll smoothly to results
  document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetAllFilters() {
  const inputs = ['searchLocation', 'searchMinPrice', 'searchMaxPrice'];
  const selects = ['searchType', 'searchPurpose', 'searchBedrooms'];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  selects.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });

  // Reset filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');

  renderProperties(getAllProperties());
}

/* ==========================================
   PROPERTY FILTERS
   ========================================== */

function initPropertyFilters() {
  const filterContainer = document.getElementById('propertyFilters');
  if (!filterContainer) return;

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const all = getAllProperties();
    let filtered;

    if (filter === 'all') {
      filtered = all;
    } else if (filter === 'sale' || filter === 'rent') {
      filtered = all.filter(p => p.purpose === filter);
    } else {
      filtered = all.filter(p => p.type === filter);
    }

    renderProperties(filtered);
  });
}

/* ==========================================
   CATEGORY CARDS
   ========================================== */

function initCategoryCards() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.dataset.category;
      if (!cat) return;

      // Update active filter button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === cat) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Filter properties
      const all = getAllProperties();
      let filtered;
      if (cat === 'sale' || cat === 'rent') {
        filtered = all.filter(p => p.purpose === cat);
      } else {
        filtered = all.filter(p => p.type === cat);
      }

      renderProperties(filtered);

      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ==========================================
   PROPERTY DETAIL MODAL
   ========================================== */

function initModal() {
  const modal = document.getElementById('propertyModal');
  const closeBtn = document.getElementById('modalClose');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display !== 'none') {
      closeModal();
    }
  });
}

function openPropertyModal(id) {
  const all = getAllProperties();
  const property = all.find(p => p.id === id);
  if (!property) return;

  const modal = document.getElementById('propertyModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  const isRental = property.purpose === 'rent';
  const priceStr = isRental
    ? `$${property.price.toLocaleString()}/mo`
    : `$${property.price.toLocaleString()}`;

  body.innerHTML = `
    <div class="modal-gallery">
      <img src="${property.image}" alt="${escapeHtml(property.title)}" width="900" height="506"
           onerror="this.src='./assets/images/property-1.jpg'">
    </div>
    <div class="modal-content">
      <h2 class="modal-property-title" id="modalTitle">${escapeHtml(property.title)}</h2>
      <p class="modal-property-location">
        <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
        ${escapeHtml(property.location)}
      </p>

      <div class="modal-price-row">
        <span class="modal-price">${priceStr}</span>
        <span class="modal-status status-available">Available</span>
      </div>

      <div class="modal-meta">
        <div class="modal-meta-item">
          <span class="material-symbols-rounded" aria-hidden="true">bed</span>
          <span class="modal-meta-value">${property.bedrooms}</span>
          <span class="modal-meta-label">Bedrooms</span>
        </div>
        <div class="modal-meta-item">
          <span class="material-symbols-rounded" aria-hidden="true">bathtub</span>
          <span class="modal-meta-value">${property.bathrooms}</span>
          <span class="modal-meta-label">Bathrooms</span>
        </div>
        <div class="modal-meta-item">
          <span class="material-symbols-rounded" aria-hidden="true">straighten</span>
          <span class="modal-meta-value">${property.area.toLocaleString()}</span>
          <span class="modal-meta-label">Sq Ft</span>
        </div>
        <div class="modal-meta-item">
          <span class="material-symbols-rounded" aria-hidden="true">category</span>
          <span class="modal-meta-value">${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
          <span class="modal-meta-label">Type</span>
        </div>
      </div>

      <h3 class="modal-section-title">Description</h3>
      <p class="modal-description">${escapeHtml(property.description)}</p>

      ${property.amenities && property.amenities.length > 0 ? `
        <h3 class="modal-section-title">Amenities & Features</h3>
        <div class="modal-amenities">
          ${property.amenities.map(a => `
            <div class="amenity-item">
              <span class="material-symbols-rounded" aria-hidden="true">check_circle</span>
              ${escapeHtml(a)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="inquiry-form" id="inquiryContainer">
        <h3 class="modal-section-title" style="border:none; padding:0; margin-bottom: var(--space-md);">Inquire About This Property</h3>
        <div id="inquiryFeedback" style="display:none;"></div>
        <form id="inquiryForm">
          <div class="form-group">
            <label for="inquiryName" class="form-label">Your Name</label>
            <input type="text" id="inquiryName" class="form-input" placeholder="Full name" required>
          </div>
          <div class="form-group">
            <label for="inquiryEmail" class="form-label">Email</label>
            <input type="email" id="inquiryEmail" class="form-input" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label for="inquiryMessage" class="form-label">Message</label>
            <textarea id="inquiryMessage" class="form-input form-textarea" placeholder="I'm interested in scheduling a viewing for this property..." rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full" id="inquirySubmit">Send Inquiry</button>
          <p class="demo-notice" style="text-align:center; margin-top: 10px;">This inquiry will be logged securely for demo purposes.</p>
        </form>
      </div>

      <p class="demo-notice" style="text-align:center; margin-top:var(--space-xl);">
        * This property listing is demonstration data for development purposes.
      </p>
    </div>
  `;

  // Pre-fill user data if available
  try {
    const user = JSON.parse(localStorage.getItem('montgomery_current_user') || 'null');
    if (user) {
      const nInp = document.getElementById('inquiryName');
      const eInp = document.getElementById('inquiryEmail');
      if (nInp && user.name) nInp.value = user.name;
      if (eInp && user.email) eInp.value = user.email;
    }
  } catch (err) {
    console.error(err);
  }

  // Bind inquiry submission
  const inqForm = document.getElementById('inquiryForm');
  if (inqForm) {
    inqForm.addEventListener('submit', (e) => {
      handleInquiry(e, property.title);
    });
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close')?.focus();
}

function closeModal() {
  const modal = document.getElementById('propertyModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function handleInquiry(e, propertyTitle) {
  e.preventDefault();
  const name = document.getElementById('inquiryName')?.value.trim();
  const email = document.getElementById('inquiryEmail')?.value.trim();
  const message = document.getElementById('inquiryMessage')?.value.trim();
  const feedback = document.getElementById('inquiryFeedback');
  const submitBtn = document.getElementById('inquirySubmit');

  if (!name || !email) return;

  if (!isValidEmail(email)) {
    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div style="background: rgba(239,83,80,0.12); border: 1px solid var(--color-error); color: var(--color-error); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: var(--fs-small);">
          Please enter a valid email address.
        </div>
      `;
    }
    return;
  }

  if (submitBtn) submitBtn.disabled = true;

  // Save inquiry to localStorage
  try {
    const inquiries = JSON.parse(localStorage.getItem('montgomery_inquiries') || '[]');
    inquiries.push({
      propertyTitle,
      name,
      email,
      message,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('montgomery_inquiries', JSON.stringify(inquiries));
  } catch (err) {
    console.error(err);
  }

  if (feedback) {
    feedback.style.display = 'block';
    feedback.innerHTML = `
      <div style="background: rgba(76,175,80,0.12); border: 1px solid var(--color-success); color: var(--color-success); padding: 14px 16px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: var(--fs-small);">
        <strong>Inquiry Sent!</strong> Thank you ${escapeHtml(name)}, our agent will get in touch at ${escapeHtml(email)} regarding "${escapeHtml(propertyTitle)}".
      </div>
    `;
  }

  e.target.reset();
  if (submitBtn) submitBtn.disabled = false;
  showToast(`Inquiry sent for "${propertyTitle}"!`);
}

/* ==========================================
   SAVED PROPERTIES (localStorage)
   ========================================== */

function initSavedProperties() {
  // Handled during property rendering
}

function getSavedProperties() {
  try {
    return JSON.parse(localStorage.getItem('montgomery_saved') || '[]');
  } catch {
    return [];
  }
}

function toggleFavorite(btn) {
  const id = parseInt(btn.dataset.propertyId);
  let saved = getSavedProperties();
  const icon = btn.querySelector('.material-symbols-rounded');

  if (saved.includes(id)) {
    saved = saved.filter(s => s !== id);
    btn.classList.remove('saved');
    if (icon) icon.textContent = 'favorite_border';
    btn.setAttribute('aria-label', 'Save property');
    showToast('Property removed from saved listings.');
  } else {
    saved.push(id);
    btn.classList.add('saved');
    if (icon) icon.textContent = 'favorite';
    btn.setAttribute('aria-label', 'Remove from saved');
    showToast('Property added to your saved listings!');
  }

  localStorage.setItem('montgomery_saved', JSON.stringify(saved));
}

/* ==========================================
   START SEARCHING BUTTON
   ========================================== */

function initStartSearching() {
  const triggers = [
    document.getElementById('explorePropertiesBtn'),
    document.getElementById('heroScrollIndicator'),
    document.getElementById('startSearchingBtn')
  ].filter(Boolean);

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const searchSec = document.getElementById('search');
      if (searchSec) {
        searchSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          document.getElementById('searchLocation')?.focus();
        }, 500);
      }
    });
  });
}

/* ==========================================
   SCROLL REVEAL
   ========================================== */

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  // Observe elements with .reveal
  const revealElements = document.querySelectorAll('.reveal, .section-header, .category-card, .feature-card, .agent-card');
  revealElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Re-observe after property render
  setTimeout(() => {
    document.querySelectorAll('.property-card.reveal:not(.visible)').forEach(el => {
      observer.observe(el);
    });
  }, 100);
}

