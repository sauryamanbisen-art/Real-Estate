'use strict';

/**
 * MONTGOMERY Real Estate — Mortgage & Investment Loan Calculator
 * Calculates monthly EMI, down payment, interest rates, property tax, and insurance.
 */

(function () {
  let calcState = {
    price: 1500000,
    downPaymentPercent: 20,
    termYears: 30,
    interestRate: 6.5,
    propertyTitle: 'MONTGOMERY Residence'
  };

  function initCalculatorDOM() {
    let backdrop = document.getElementById('calcModalBackdrop');
    if (backdrop) return;

    backdrop = document.createElement('div');
    backdrop.id = 'calcModalBackdrop';
    backdrop.className = 'calc-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Mortgage and EMI Calculator');

    backdrop.innerHTML = `
      <div class="calc-card">
        <button type="button" class="calc-close-btn" id="calcCloseBtn" aria-label="Close calculator">
          <span class="material-symbols-rounded" aria-hidden="true">close</span>
        </button>

        <div class="calc-header">
          <p class="calc-subtitle">Financial Planning</p>
          <h2 class="calc-title">Mortgage &amp; EMI Estimator</h2>
          <p id="calcPropertyRef" style="color: var(--color-text-secondary); font-size: var(--fs-small); margin-top: 4px;"></p>
        </div>

        <div class="calc-result-box">
          <p class="calc-monthly-label">Estimated Monthly Payment</p>
          <div class="calc-monthly-amount" id="calcMonthlyTotal">$0</div>
          <p class="calc-monthly-period">Principal, Interest, Taxes &amp; Insurance</p>

          <div class="calc-bar-wrapper">
            <div class="calc-bar">
              <div class="calc-bar-segment calc-bar-pi" id="calcBarPI" style="width: 75%;"></div>
              <div class="calc-bar-segment calc-bar-tax" id="calcBarTax" style="width: 18%;"></div>
              <div class="calc-bar-segment calc-bar-ins" id="calcBarIns" style="width: 7%;"></div>
            </div>
            <div class="calc-legend">
              <span class="calc-legend-item"><span class="calc-legend-dot pi"></span>Principal &amp; Interest (<span id="calcValPI">$0</span>)</span>
              <span class="calc-legend-item"><span class="calc-legend-dot tax"></span>Property Tax (<span id="calcValTax">$0</span>)</span>
              <span class="calc-legend-item"><span class="calc-legend-dot ins"></span>Home Insurance (<span id="calcValIns">$0</span>)</span>
            </div>
          </div>
        </div>

        <div class="calc-controls-grid">
          <!-- Home Price -->
          <div class="calc-control-group">
            <div class="calc-control-header">
              <label for="calcPriceSlider" class="calc-control-label">Home Price</label>
              <span class="calc-control-val" id="calcPriceDisplay">$1,500,000</span>
            </div>
            <input type="range" class="calc-slider" id="calcPriceSlider" min="50000" max="15000000" step="25000" value="1500000">
          </div>

          <!-- Down Payment -->
          <div class="calc-control-group">
            <div class="calc-control-header">
              <label for="calcDownSlider" class="calc-control-label">Down Payment (<span id="calcDownPercentLabel">20%</span>)</label>
              <span class="calc-control-val" id="calcDownDisplay">$300,000</span>
            </div>
            <input type="range" class="calc-slider" id="calcDownSlider" min="0" max="50" step="5" value="20">
          </div>

          <!-- Interest Rate -->
          <div class="calc-control-group">
            <div class="calc-control-header">
              <label for="calcRateSlider" class="calc-control-label">Interest Rate</label>
              <span class="calc-control-val" id="calcRateDisplay">6.5%</span>
            </div>
            <input type="range" class="calc-slider" id="calcRateSlider" min="2.5" max="12.0" step="0.1" value="6.5">
          </div>

          <!-- Loan Term -->
          <div class="calc-control-group">
            <div class="calc-control-header">
              <span class="calc-control-label">Loan Duration</span>
              <span class="calc-control-val" id="calcTermDisplay">30 Years</span>
            </div>
            <div class="calc-term-options">
              <button type="button" class="calc-term-btn" data-term="15">15 Yrs</button>
              <button type="button" class="calc-term-btn" data-term="20">20 Yrs</button>
              <button type="button" class="calc-term-btn active" data-term="30">30 Yrs</button>
            </div>
          </div>
        </div>

        <div class="calc-metrics-row">
          <div class="calc-metric-item">
            <div class="calc-metric-title">Loan Amount</div>
            <div class="calc-metric-number" id="calcMetricLoan">$1,200,000</div>
          </div>
          <div class="calc-metric-item">
            <div class="calc-metric-title">Total Interest Paid</div>
            <div class="calc-metric-number" id="calcMetricInterest">$1,536,000</div>
          </div>
          <div class="calc-metric-item">
            <div class="calc-metric-title">Total Loan Cost</div>
            <div class="calc-metric-number" id="calcMetricTotalCost">$2,736,000</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Event listeners
    document.getElementById('calcCloseBtn').addEventListener('click', closeMortgageCalculator);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeMortgageCalculator();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeMortgageCalculator();
      }
    });

    const priceSlider = document.getElementById('calcPriceSlider');
    const downSlider = document.getElementById('calcDownSlider');
    const rateSlider = document.getElementById('calcRateSlider');

    priceSlider.addEventListener('input', (e) => {
      calcState.price = Number(e.target.value);
      updateCalculations();
    });

    downSlider.addEventListener('input', (e) => {
      calcState.downPaymentPercent = Number(e.target.value);
      updateCalculations();
    });

    rateSlider.addEventListener('input', (e) => {
      calcState.interestRate = Number(e.target.value);
      updateCalculations();
    });

    document.querySelectorAll('.calc-term-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.calc-term-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        calcState.termYears = Number(btn.dataset.term);
        updateCalculations();
      });
    });
  }

  function updateCalculations() {
    const isINR = window.activeCurrency === 'INR';
    const rate = window.currencyExchangeRate || 83.5;

    const price = calcState.price;
    const downAmount = price * (calcState.downPaymentPercent / 100);
    const loanAmount = Math.max(0, price - downAmount);

    const monthlyInterestRate = (calcState.interestRate / 100) / 12;
    const totalMonths = calcState.termYears * 12;

    let monthlyPI = 0;
    if (loanAmount > 0 && monthlyInterestRate > 0) {
      monthlyPI = loanAmount * (
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
      );
    }

    // Property tax estimate (approx 0.8% annually / 12)
    const monthlyTax = (price * 0.008) / 12;
    // Insurance estimate ($120/mo baseline scaled lightly)
    const monthlyIns = Math.round(80 + (price / 50000));

    const totalMonthly = monthlyPI + monthlyTax + monthlyIns;
    const totalPayments = monthlyPI * totalMonths;
    const totalInterest = Math.max(0, totalPayments - loanAmount);
    const totalCost = loanAmount + totalInterest;

    // Helper format
    const fmt = (num) => {
      if (isINR) {
        return '₹' + Math.round(num * rate).toLocaleString('en-IN');
      }
      return '$' + Math.round(num).toLocaleString('en-US');
    };

    // Update text
    document.getElementById('calcPriceDisplay').textContent = fmt(price);
    document.getElementById('calcDownDisplay').textContent = fmt(downAmount);
    document.getElementById('calcDownPercentLabel').textContent = calcState.downPaymentPercent + '%';
    document.getElementById('calcRateDisplay').textContent = calcState.interestRate.toFixed(1) + '%';
    document.getElementById('calcTermDisplay').textContent = calcState.termYears + ' Years';

    document.getElementById('calcMonthlyTotal').textContent = fmt(totalMonthly);
    document.getElementById('calcValPI').textContent = fmt(monthlyPI);
    document.getElementById('calcValTax').textContent = fmt(monthlyTax);
    document.getElementById('calcValIns').textContent = fmt(monthlyIns);

    document.getElementById('calcMetricLoan').textContent = fmt(loanAmount);
    document.getElementById('calcMetricInterest').textContent = fmt(totalInterest);
    document.getElementById('calcMetricTotalCost').textContent = fmt(totalCost);

    // Update bar segments
    if (totalMonthly > 0) {
      const piPct = ((monthlyPI / totalMonthly) * 100).toFixed(1);
      const taxPct = ((monthlyTax / totalMonthly) * 100).toFixed(1);
      const insPct = (100 - piPct - taxPct).toFixed(1);

      document.getElementById('calcBarPI').style.width = piPct + '%';
      document.getElementById('calcBarTax').style.width = taxPct + '%';
      document.getElementById('calcBarIns').style.width = insPct + '%';
    }
  }

  window.openMortgageCalculator = function (price, title) {
    initCalculatorDOM();
    if (price && Number(price) > 0) {
      calcState.price = Number(price);
      const slider = document.getElementById('calcPriceSlider');
      if (slider) {
        slider.value = calcState.price;
        if (calcState.price > Number(slider.max)) slider.max = calcState.price * 1.2;
      }
    }
    if (title) {
      calcState.propertyTitle = title;
      const refEl = document.getElementById('calcPropertyRef');
      if (refEl) refEl.textContent = 'Calculating for: ' + title;
    } else {
      const refEl = document.getElementById('calcPropertyRef');
      if (refEl) refEl.textContent = 'Custom property valuation';
    }

    updateCalculations();
    const backdrop = document.getElementById('calcModalBackdrop');
    if (backdrop) {
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeMortgageCalculator = function () {
    const backdrop = document.getElementById('calcModalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initCalculatorDOM();
  });
})();

// Exported for luxury real estate mortgage calculations
