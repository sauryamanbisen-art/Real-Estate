# MONTGOMERY — Luxury Real Estate Marketplace

A modern, responsive real estate web application built with vanilla HTML5, CSS3, and JavaScript. The platform features an ultra-luxury curated property collection with a focus on India's premier metropolitan and resort enclaves alongside iconic global destinations.

---

## ✨ Features

- **Curated Luxury Property Collection**:
  - **20 Ultra-Luxury Listings**: Exactly balanced with 10 listings in every section (**For Sale**, **For Rent**, **Apartments**, and **Houses**).
  - **80% Indian Trophy Real Estate**: Spanning Worli Sea Face (Mumbai), DLF The Camellias (Gurugram), Pali Hill & Malabar Hill (Mumbai), Assagao & Candolim (Goa), Lutyens' Delhi & Friends Colony (New Delhi), Sadashivnagar & Indiranagar (Bengaluru), Jubilee Hills (Hyderabad), Lake Pichola (Udaipur), and Alibaug.
  - **Global Icons**: Select trophy estates in Beverly Hills, Manhattan, and Mayfair, London.
- **Authentic Architectural Imagery**: High-definition, authentic photography featuring real architectural estates with evening dusk illumination, sea-facing infinity plunge pools, and landscape verandas.
- **Dynamic Category & Purpose Filters**:
  - Instant client-side filtering by **All Properties**, **For Sale**, **For Rent**, **Apartments**, and **Houses**.
  - Dynamic results counter banner showing matching inventory count in real time.
  - Smooth staggered scroll-reveal animations ensuring all newly filtered cards animate seamlessly.
- **Advanced Discovery & Search Engine**:
  - Filter by city/location keywords (e.g. *Mumbai*, *Goa*, *Delhi*, *Bengaluru*, *Hyderabad*), property types (*House*, *Apartment*, *Villa*, *Penthouse*), purpose (*Buy* or *Rent*), price range, and bedroom counts.
- **Mortgage & EMI Financial Calculator**:
  - Interactive luxury slide-out drawer with real-time sliders for property price, down payment, interest rate, and loan tenure (5 to 30 years).
  - Dynamic visual breakdown bar calculating Principal & Interest, estimated property taxes, and home insurance.
  - Quick-launch trigger directly from the navigation bar and from any property detail modal with auto-prefilled price.
- **Property Comparison Engine**:
  - Multi-property comparison matrix allowing users to compare up to 4 luxury estates side by side.
  - Sticky floating comparison dock with quick thumbnail badges and 1-click modal table analyzing Price, Location, Type, Beds, Baths, SqFt, and Amenities.
- **Shortlist & Saved Properties Drawer**:
  - Instant client-side bookmarking with persistent `localStorage` storage.
  - Slide-out drawer with direct detail view launch and one-click removal, with live badge counter in the top navigation bar.
- **Live Dual-Currency Converter (USD / INR)**:
  - Instant toggle between US Dollars (`$`) and Indian Rupees (`₹`) with authentic South Asian numbering formatting (Crores `Cr` and Lakhs `L`).
  - Seamlessly re-renders all property cards, search summaries, and detail modals without full page reloads.
- **Dual-Panel Animated Auth Modal**:
  - Coding Wizard animated glassmorphic modal with glowing diagonal curves and sliding transition between Login and Sign Up.
  - Form validation with localStorage persistence and automatic session synchronization across navbar headers.
- **Interactive Property Detail Modals**:
  - Full-screen property showcase with image galleries, price badges, bed/bath/sqft specifications, verified amenities, direct EMI calculation launch, and client inquiry submission forms.
- **Seller Listing Workflow**:
  - Dedicated `/sell.html` interface with purpose selector (For Sale / For Rent), multi-image upload dropzones, instant client previews, and localStorage property publishing.

---

## 📁 Modular Architecture

The codebase adheres strictly to separation of concerns with dedicated modular CSS and JS bundles:

| Feature / Page | Stylesheet | Script | Purpose |
| :--- | :--- | :--- | :--- |
| **Global Theme & Core** | `assets/css/style.css` | `assets/js/script.js` | Core layout, navbar, property grid & search engine |
| **Authentication Modal** | `assets/css/auth.css` | `assets/js/auth.js` | Glassmorphic dual-panel login & register modal |
| **Seller Portal** | `assets/css/sell.css` | `assets/js/sell.js` | Dedicated `/sell.html` listing creation and image dropzone |
| **Mortgage / EMI Calculator** | `assets/css/calculator.css` | `assets/js/calculator.js` | Financial loan calculator drawer & amortization bars |
| **Comparison Matrix** | `assets/css/compare.css` | `assets/js/compare.js` | Side-by-side spec comparison dock and modal |
| **Saved Shortlist** | `assets/css/saved.css` | `assets/js/saved.js` | Favorite properties drawer and navbar counter badge |
| **Currency Switcher** | `assets/css/currency.css` | `assets/js/currency.js` | Real-time USD ($) / INR (₹ Cr/L) converter |

---

## 🏛️ Property Database Overview

| Section | Total | Indian Listings | Key Locations |
| :--- | :---: | :---: | :--- |
| **For Sale** | 10 | 8 (80%) | Worli Sea Face, DLF Camellias, Pali Hill, Sadashivnagar, Assagao, Lutyens' Delhi, Jubilee Hills, Alibaug |
| **For Rent** | 10 | 8 (80%) | Malabar Hill, Indiranagar, Friends Colony West, Lower Parel, Candolim Beach, Kasauli Chalet, Lake Pichola, Koramangala |
| **Apartments** | 10 | 8 (80%) | Worli Sky Penthouse, Camellias Golf Suite, Pali Hill Duplex, Sadashivnagar Modernist, Malabar Hill Villa, Indiranagar Duplex, etc. |
| **Houses** | 10 | 8 (80%) | Assagao Portuguese Villa, Lutyens' Regal Manor, Jubilee Hills Hilltop Palace, Alibaug Waterfront, Candolim Beach Villa, etc. |

---

## 🛠️ Technology Stack

- **Markup**: Semantic HTML5 with Google Fonts (Playfair Display & Inter) and Google Material Symbols.
- **Styling**: Vanilla CSS3 with CSS custom properties (design tokens), flexbox, grid, glassmorphism, and responsive breakpoints.
- **Logic**: Vanilla ES6+ JavaScript with zero external runtime dependencies.
- **Storage**: Browser LocalStorage for custom listings, user registration, and saved favorites.

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/sauryamanbisen-art/Real-Estate.git
   cd Real-Estate
   ```
2. Open with any local HTTP server (or double click `index.html`):
   ```bash
   python3 -m http.server 8000
   ```
3. Navigate to `http://localhost:8000` in your web browser.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
