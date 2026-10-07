'use strict';

/**
 * MONTGOMERY Real Estate — Currency Switcher Module
 * Allows instantaneous conversion between USD ($) and INR (₹).
 */

(function () {
  window.activeCurrency = localStorage.getItem('montgomery_currency') || 'USD';
  window.currencyExchangeRate = 83.5;

  window.formatCurrency = function (usdAmount, isRental = false) {
    if (window.activeCurrency === 'INR') {
      const inrVal = Math.round(usdAmount * window.currencyExchangeRate);
      if (inrVal >= 10000000) {
        const cr = (inrVal / 10000000).toFixed(2);
        return `₹${cr} Cr${isRental ? '<span class="property-price-period">/mo</span>' : ''}`;
      } else if (inrVal >= 100000) {
        const lakh = (inrVal / 100000).toFixed(2);
        return `₹${lakh} Lakh${isRental ? '<span class="property-price-period">/mo</span>' : ''}`;
      }
      return `₹${inrVal.toLocaleString('en-IN')}${isRental ? '<span class="property-price-period">/mo</span>' : ''}`;
    }

    return `$${usdAmount.toLocaleString('en-US')}${isRental ? '<span class="property-price-period">/mo</span>' : ''}`;
  };

  window.setCurrency = function (curr) {
    if (curr !== 'USD' && curr !== 'INR') return;
    window.activeCurrency = curr;
    localStorage.setItem('montgomery_currency', curr);

    document.querySelectorAll('.currency-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.currency === curr);
    });

    // Re-render properties if function is defined
    if (typeof refreshPropertyView === 'function') {
      refreshPropertyView();
    } else if (typeof renderProperties === 'function' && typeof getAllProperties === 'function') {
      renderProperties(getAllProperties());
    }

    // Refresh saved drawer if open
    if (typeof updateSavedBadge === 'function') {
      updateSavedBadge();
    }

    if (typeof showToast === 'function') {
      showToast(`Currency updated to ${curr === 'INR' ? 'Indian Rupee (₹)' : 'US Dollar ($)'}`);
    }
  };

  function initCurrencySwitcher() {
    document.querySelectorAll('.currency-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.setCurrency(btn.dataset.currency);
      });
      btn.classList.toggle('active', btn.dataset.currency === window.activeCurrency);
    });
  }

  document.addEventListener('DOMContentLoaded', initCurrencySwitcher);
})();
