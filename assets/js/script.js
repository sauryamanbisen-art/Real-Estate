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
  // ==========================================
  // FOR SALE — APARTMENTS (5 listings)
  // ==========================================
  {
    id: 1,
    title: 'The Imperial Sea-Face Penthouse',
    location: 'Worli Sea Face, South Mumbai, Maharashtra 400030, India',
    price: 6850000,
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 5,
    bathrooms: 6,
    area: 6400,
    image: './assets/images/property-worli-seaface.jpg',
    badge: 'Super Luxury',
    description: 'Commanding panoramic vistas of the Arabian Sea and the Bandra-Worli Sea Link, this signature triplex sky penthouse features cantilevered glass balconies, a private temperature-controlled plunge pool, and bespoke Italian marble interiors.',
    amenities: ['Arabian Sea Views', 'Private Plunge Pool', 'Private Elevator', 'Italian Marble', 'Concierge 24/7', '4-Car Valet Parking', 'Smart Home Automation'],
    featured: true
  },
  {
    id: 2,
    title: 'The Camellias Grand Sky Suite',
    location: 'Golf Course Road, DLF Phase 5, Gurugram, Haryana 122002, India',
    price: 5400000,
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 4,
    bathrooms: 5,
    area: 7200,
    image: './assets/images/property-gurugram-camellias.jpg',
    badge: 'Golf View',
    description: 'Overlooking the championship golf course, this ultra-exclusive residence at The Camellias offers expansive wraparound glass verandas, soaring double-height ceilings, a private wine cellar, and six-star resident club privileges.',
    amenities: ['Championship Golf View', 'Helipad Access', 'Olympic Pool', 'Wine Cellar', 'Spa Sanctuary', 'Private Clubhouse', 'VRV Air Conditioning'],
    featured: true
  },
  {
    id: 3,
    title: 'Pali Hill Celebrity Duplex',
    location: 'Pali Hill, Bandra West, Mumbai, Maharashtra 400050, India',
    price: 3950000,
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 4,
    bathrooms: 4,
    area: 4600,
    image: './assets/images/property-mumbai-palihill.jpg',
    badge: 'Exclusive',
    description: 'Nestled within Bandra’s celebrated Pali Hill enclave, this designer duplex penthouse features a private landscaped terrace pool, imported teak craftsmanship, and serene coastal breezes.',
    amenities: ['Private Terrace Pool', 'Rooftop Lounge', 'Sea Breeze Cross-Ventilation', 'Chef Kitchen', 'Biometric Security', 'Electric Vehicle Charging'],
    featured: true
  },
  {
    id: 4,
    title: 'Sadashivnagar Modernist Residence',
    location: 'Sadashivnagar, Bengaluru, Karnataka 560080, India',
    price: 2750000,
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 4,
    bathrooms: 4,
    area: 4200,
    image: './assets/images/property-bengaluru-modern.jpg',
    badge: 'Architectural',
    description: 'An architectural sanctuary in the green heart of Sadashivnagar. Featuring warm European oak accents, minimalist open-plan living, and lush private balcony courtyards.',
    amenities: ['Private Garden Deck', 'Smart Climate Control', 'European Oak Floors', 'Infinity Pool', '24/7 Security', 'Solar Power Backup'],
    featured: true
  },
  {
    id: 5,
    title: 'Aurora Residences Midtown Penthouse',
    location: '88 Park Avenue South, New York, NY 10016, USA',
    price: 4250000,
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 3,
    bathrooms: 3,
    area: 3100,
    image: './assets/images/property-luxury-2.jpg',
    badge: 'Manhattan',
    description: 'Trophy penthouse in Midtown Manhattan featuring 360-degree skyline vistas, soaring ceilings, Calacatta marble counters, and direct elevator gallery entry.',
    amenities: ['Manhattan Skyline Views', 'Doorman', 'Rooftop Terrace', 'Fitness Center', 'Private Elevator', 'Wine Storage'],
    featured: false
  },

  // ==========================================
  // FOR SALE — HOUSES (5 listings)
  // ==========================================
  {
    id: 6,
    title: 'Assagao Portuguese Heritage Villa',
    location: 'Badem Road, Assagao, North Goa 403507, India',
    price: 3200000,
    type: 'house',
    purpose: 'sale',
    bedrooms: 5,
    bathrooms: 6,
    area: 5800,
    image: './assets/images/property-goa-villa.jpg',
    badge: 'Signature Villa',
    description: 'Set amid swaying coconut groves in sought-after Assagao, this luxury villa marries Indo-Portuguese colonial architecture with chic tropical modernism and a private crystal-clear pool.',
    amenities: ['Private Emerald Pool', 'Tropical Landscaped Gardens', 'Exposed Laterite Veranda', 'Terracotta Courtyard', 'Butler Quarters', 'Gourmet Outdoor Barbecue'],
    featured: true
  },
  {
    id: 7,
    title: 'Lutyens’ Colonial-Modern Manor',
    location: 'Amrita Shergill Marg, Lutyens’ Delhi, New Delhi 110003, India',
    price: 11500000,
    type: 'house',
    purpose: 'sale',
    bedrooms: 6,
    bathrooms: 7,
    area: 9600,
    image: './assets/images/property-delhi-mansion.jpg',
    badge: 'Trophy Estate',
    description: 'One of India’s most prestigious residential addresses. This sprawling private manor features an immaculate 1-acre emerald lawn, grand Roman columns, and a heated garden swimming pool.',
    amenities: ['1-Acre Manicured Lawn', 'Roman Colonnade', 'Private Heated Pool', 'Security Guard Outpost', 'Staff Annexe', 'Ballroom & Banquet Hall'],
    featured: true
  },
  {
    id: 8,
    title: 'Jubilee Hills Hilltop Palatial Villa',
    location: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033, India',
    price: 4800000,
    type: 'house',
    purpose: 'sale',
    bedrooms: 6,
    bathrooms: 6,
    area: 8400,
    image: './assets/images/property-10.jpg',
    badge: 'Hillside Palace',
    description: 'Perched atop an exclusive crest in Jubilee Hills, this white Italian marble villa boasts a resort-scale swimming pool, triple-height glass atriums, and panoramic night views across the city.',
    amenities: ['Hilltop Infinity Pool', 'Private Screening Room', 'Italian Onyx Bar', 'Landscaped Courtyard', 'Zen Water Feature', '8-Car Covered Garage'],
    featured: true
  },
  {
    id: 9,
    title: 'Alibaug Waterfront Tropical Estate',
    location: 'Awas Beach Road, Alibaug, Maharashtra 402201, India',
    price: 3650000,
    type: 'house',
    purpose: 'sale',
    bedrooms: 5,
    bathrooms: 5,
    area: 6700,
    image: './assets/images/property-11.jpg',
    badge: 'Waterfront',
    description: 'A private speedboat retreat from Mumbai. This architectural estate features board-formed concrete pavilions, expansive lawn grounds, and direct private beach access.',
    amenities: ['Direct Beach Access', 'Private Speedboat Jetty', 'Outdoor Dining Pavilion', 'Lap Pool', 'Organic Herb Garden', 'Caretaker Cottage'],
    featured: false
  },
  {
    id: 10,
    title: 'Sunset Ridge Modern Villa',
    location: '1420 Sunset Ridge Dr, Beverly Hills, CA 90210, USA',
    price: 4950000,
    type: 'house',
    purpose: 'sale',
    bedrooms: 5,
    bathrooms: 5,
    area: 5400,
    image: './assets/images/property-luxury-1.jpg',
    badge: 'Beverly Hills',
    description: 'An architectural triumph in the Beverly Hills foothills. Features seamless indoor-outdoor pocket glass doors, cantilevered infinity pool, and dramatic Pacific ocean views.',
    amenities: ['Infinity Pool', 'Home Theater', 'Wine Cellar', 'Smart Home System', 'Panoramic Canyon Views', '3-Car Garage'],
    featured: false
  },

  // ==========================================
  // FOR RENT — APARTMENTS (5 listings)
  // ==========================================
  {
    id: 11,
    title: 'Malabar Hill Oceanfront Sky Villa',
    location: 'Walkeshwar Road, Malabar Hill, Mumbai, Maharashtra 400006, India',
    price: 9500,
    type: 'apartment',
    purpose: 'rent',
    bedrooms: 4,
    bathrooms: 4,
    area: 3800,
    image: './assets/images/property-2.jpg',
    badge: 'Sea View',
    description: 'Prestige sea-facing residence perched high above Back Bay on Malabar Hill. Boasts a private infinity plunge pool, open sunset deck, and white-glove concierge services.',
    amenities: ['Unobstructed Sea View', 'Private Plunge Pool', 'Full Staff Quarters', 'Direct Elevator', 'Clubhouse & Spa Access', '24/7 Power Backup'],
    featured: true
  },
  {
    id: 12,
    title: 'Indiranagar Contemporary Sky Duplex',
    location: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038, India',
    price: 4200,
    type: 'apartment',
    purpose: 'rent',
    bedrooms: 3,
    bathrooms: 3,
    area: 3100,
    image: './assets/images/property-bengaluru-villa.jpg',
    badge: 'Penthouse',
    description: 'Geometric white cantilevered duplex penthouse in prime Indiranagar. Soaring double-height glass atriums, private rooftop entertaining deck, and automated ambient lighting.',
    amenities: ['Terrace Deck', 'Automated Blinds', 'High-speed Fiber', 'Gym & Pool', 'Covered Parking', 'Pet Friendly'],
    featured: false
  },
  {
    id: 13,
    title: 'Friends Colony West Garden Suite',
    location: 'Friends Colony West, New Delhi, Delhi 110065, India',
    price: 5600,
    type: 'apartment',
    purpose: 'rent',
    bedrooms: 4,
    bathrooms: 4,
    area: 3900,
    image: './assets/images/property-delhi-penthouse.jpg',
    badge: 'Garden Residence',
    description: 'Serene luxury floor in an exclusive South Delhi enclave. Features pristine Italian marble, private front and rear courtyard verandas, and diplomatic-grade security.',
    amenities: ['Private Lawn Access', 'Italian Marble Flooring', 'Modular Gourmet Kitchen', '24/7 Gated Security', 'Servant Quarters', '2-Car Covered Garage'],
    featured: true
  },
  {
    id: 14,
    title: 'One Avighna High-Rise Loft',
    location: 'Lower Parel, Mumbai, Maharashtra 400013, India',
    price: 4800,
    type: 'apartment',
    purpose: 'rent',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    image: './assets/images/property-mumbai-loft.jpg',
    badge: 'Designer Loft',
    description: 'Contemporary high-rise loft apartment in Mumbai’s bustling financial hub. Features minimalist Nordic interiors, floor-to-ceiling glass, and city skyline views.',
    amenities: ['Skyline Views', 'Private Elevator', 'Heated Lap Pool', 'Squash Court', 'Concierge Desk', 'Automated Shading'],
    featured: false
  },
  {
    id: 15,
    title: 'Metropolitan Mayfair Suite',
    location: '42 Berkeley Square, Mayfair, London W1J 5AW, United Kingdom',
    price: 7800,
    type: 'apartment',
    purpose: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1750,
    image: './assets/images/property-4.jpg',
    badge: 'Mayfair Luxury',
    description: 'Refined period apartment situated in the epicentre of Mayfair. Features ornate plaster moldings, bespoke oak cabinetry, gas fireplace, and 24-hour uniformed porter.',
    amenities: ['24/7 Uniformed Porter', 'Period Fireplace', 'Private Garden Square Access', 'Bespoke Joinery', 'Climate Control'],
    featured: false
  },

  // ==========================================
  // FOR RENT — HOUSES (5 listings)
  // ==========================================
  {
    id: 16,
    title: 'Candolim Coastal Beachfront Villa',
    location: 'Vaddi Beach Road, Candolim, North Goa 403515, India',
    price: 6800,
    type: 'house',
    purpose: 'rent',
    bedrooms: 4,
    bathrooms: 4,
    area: 4400,
    image: './assets/images/feature-banner-1.jpg',
    badge: 'Beachfront',
    description: 'Step directly onto the golden sands of Candolim. This whitewashed modern beach sanctuary features a private swimming pool, sun deck, and dedicated culinary staff.',
    amenities: ['Direct Beach Access', 'Private Swimming Pool', 'Sun Deck', 'Housekeeping & Chef Included', 'Outdoor Shower', 'Alfresco Barbecue'],
    featured: true
  },
  {
    id: 17,
    title: 'Kasauli Pine Ridge Alpine Chalet',
    location: 'Upper Mall Road, Kasauli, Himachal Pradesh 173204, India',
    price: 3500,
    type: 'house',
    purpose: 'rent',
    bedrooms: 3,
    bathrooms: 3,
    area: 3300,
    image: './assets/images/property-1.jpg',
    badge: 'Hill Station',
    description: 'A warm pine-clad alpine chalet perched on Kasauli’s Upper Mall. Features stone hearths, double-glazed panoramic windows overlooking snow-capped peaks, and an organic apple orchard.',
    amenities: ['Panoramic Himalayan Views', 'Stone Fireplace', 'Spruce Pine Woodwork', 'Glass Sunroom', 'Heated Bedrooms', 'Organic Orchard'],
    featured: false
  },
  {
    id: 18,
    title: 'Udaipur Royal Lakeside Haveli',
    location: 'Haridas Ji Ki Magri, Lake Pichola, Udaipur, Rajasthan 313001, India',
    price: 7200,
    type: 'house',
    purpose: 'rent',
    bedrooms: 4,
    bathrooms: 5,
    area: 5200,
    image: './assets/images/property-udaipur-villa.jpg',
    badge: 'Heritage Luxury',
    description: 'Overlooking the serene waters of Lake Pichola, this regal Rajasthan pool villa showcases authentic hand-carved marble jharokhas, courtyards, and a private azure pool.',
    amenities: ['Lake Pichola Views', 'Private Pool with Courtyard', 'Carved Marble Jharokhas', 'Rooftop Stargazing Terrace', 'Personal Chef on Request'],
    featured: true
  },
  {
    id: 19,
    title: 'Koramangala Modernist Courtyard Villa',
    location: '3rd Block, Koramangala, Bengaluru, Karnataka 560034, India',
    price: 4600,
    type: 'house',
    purpose: 'rent',
    bedrooms: 4,
    bathrooms: 4,
    area: 4800,
    image: './assets/images/property-3.jpg',
    badge: 'Courtyard Villa',
    description: 'An urban sanctuary in Bengaluru’s vibrant Koramangala. Built around an internal tree court with floor-to-ceiling glass walls, timber decks, and private plunge pool.',
    amenities: ['Central Green Courtyard', 'Private Plunge Pool', 'Solar Water Heating', 'Italian Kitchen', 'Servant Quarters', 'Home Automation'],
    featured: false
  },
  {
    id: 20,
    title: 'Riverside Manor & Gardens',
    location: '380 Riverside Drive, Portland, OR 97201, USA',
    price: 4800,
    type: 'house',
    purpose: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area: 3600,
    image: './assets/images/property-12.webp',
    badge: 'Riverside',
    description: 'A charming country manor along the Willamette River with a private deck, modern dark-wood architecture, and walking trails right outside your door.',
    amenities: ['River Views', 'Private Deck', 'In-unit Laundry', 'Covered Porch', 'Central Air', 'Pet Friendly'],
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
      if (e.target.closest('.property-favorite') || e.target.closest('.property-compare-btn')) return;
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

  // Ensure newly rendered cards become visible smoothly
  requestAnimationFrame(() => {
    grid.querySelectorAll('.property-card').forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 0.04, 0.35)}s`;
      card.classList.add('visible');
    });
  });
}

function createPropertyCard(p) {
  const isRental = p.purpose === 'rent';
  const priceStr = window.formatCurrency
    ? window.formatCurrency(p.price, isRental)
    : (isRental
        ? `${p.price.toLocaleString()}<span class="property-price-period">/mo</span>`
        : `${p.price.toLocaleString()}`);
  const badgeClass = isRental ? 'badge-rent' : 'badge-sale';
  const badgeText = p.badge || (isRental ? 'For Rent' : 'For Sale');
  const saved = getSavedProperties().includes(p.id);

  return `
    <article class="property-card reveal" data-id="${p.id}" data-type="${p.type}" data-purpose="${p.purpose}">
      <div class="property-card-image">
        <img src="${p.image}" alt="${p.title}" width="400" height="275" loading="lazy"
             onerror="this.src='./assets/images/property-1.jpg'">
        <span class="property-badge ${badgeClass}">${badgeText}</span>
        <button type="button" class="property-compare-btn" data-property-id="${p.id}" onclick="event.stopPropagation(); toggleCompare(${p.id});" aria-label="Compare property" title="Compare side-by-side">
          <span class="material-symbols-rounded" aria-hidden="true">compare_arrows</span>
        </button>
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
    if (type) {
      if (type === 'penthouse') {
        const isPenthouse = (p.type && p.type.toLowerCase().includes('penthouse')) ||
                            (p.badge && p.badge.toLowerCase().includes('penthouse')) ||
                            (p.title && p.title.toLowerCase().includes('penthouse'));
        if (!isPenthouse) return false;
      } else if (type === 'house') {
        if (p.type !== 'house' && p.type !== 'villa' && p.type !== 'townhouse') return false;
      } else if (type === 'villa') {
        const isVilla = (p.type && p.type.toLowerCase().includes('villa')) ||
                        (p.badge && p.badge.toLowerCase().includes('villa')) ||
                        (p.title && p.title.toLowerCase().includes('villa'));
        if (!isVilla) return false;
      } else if (p.type !== type) {
        return false;
      }
    }
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
    } else if (filter === 'house') {
      filtered = all.filter(p => p.type === 'house' || p.type === 'villa' || p.type === 'townhouse');
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
        if (btn.dataset.filter === cat || (cat === 'villa' && btn.dataset.filter === 'house')) {
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
      } else if (cat === 'house' || cat === 'villa') {
        filtered = all.filter(p => p.type === 'house' || p.type === 'villa' || p.type === 'townhouse');
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
  const priceStr = window.formatCurrency
    ? window.formatCurrency(property.price, isRental)
    : (isRental
        ? `${property.price.toLocaleString()}/mo`
        : `${property.price.toLocaleString()}`);

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
  if (typeof updateSavedBadge === 'function') {
    updateSavedBadge();
  }
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

/* ==========================================
   TOAST NOTIFICATION SYSTEM
   ========================================== */

function showToast(message) {
  let toast = document.getElementById('montgomeryToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'montgomeryToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--color-bg-card);
      border: 1px solid var(--color-gold);
      color: var(--color-text-primary);
      padding: 14px 20px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: var(--fs-small);
      font-family: var(--font-body);
      max-width: 380px;
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(12px);
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="material-symbols-rounded" style="color: var(--color-gold); font-size: 22px;" aria-hidden="true">check_circle</span>
    <span>${escapeHtml(message)}</span>
  `;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
  }, 3800);
}

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
