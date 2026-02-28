document.addEventListener("DOMContentLoaded", () => {
  const prices = {
    essentials: 97.99,
    business: 129.99,
    tech: 85,
    linen: 145,
    footwear: 34.99,
  };

  let counts = {
    essentials: 0,
    business: 0,
    tech: 0,
    linen: 0,
    footwear: 0,
  };

  // ELEMENTS
  const grandTotalDisplay = document.getElementById("grand-total");
  const addressInput = document.getElementById("address");
  const dateInput = document.getElementById("pickup-date");
  const timeInput = document.getElementById("pickup-time");
  const summaryItems = document.getElementById("summary-items");

  // =========================
  // BASKET CONTROLS
  // =========================
  document.querySelectorAll(".express-basket-card").forEach((card) => {
    const type = card.classList[1]; // essentials, business, etc.
    const qtyDisplay = card.querySelector(".qty-display");
    const plusBtn = card.querySelector(".plus");
    const minusBtn = card.querySelector(".minus");
    
    // Listen for checkbox changes to trigger summary update
    card.querySelectorAll('input[type="checkbox"]').forEach(check => {
        check.addEventListener('change', calculateTotal);
    });

    plusBtn.addEventListener("click", () => {
      counts[type]++;
      updateUI();
    });

    minusBtn.addEventListener("click", () => {
      if (counts[type] > 0) {
        counts[type]--;
        updateUI();
      }
    });

    function updateUI() {
      qtyDisplay.innerText = counts[type];
      calculateTotal();
    }
  });

  // =========================
  // CALCULATE TOTAL + ENHANCED SUMMARY
  // =========================
  function calculateTotal() {
    let total = 0;
    let itemsSummary = [];

    for (const [key, count] of Object.entries(counts)) {
      if (count > 0) {
        total += count * prices[key];
        
        // Find selected items within this specific card
        const card = document.querySelector(`.express-basket-card.${key}`);
        const selectedItems = Array.from(card.querySelectorAll('input[type="checkbox"]:checked'))
                                   .map(cb => cb.value);
        
        let label = `${count}x ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        
        // If items are selected, append them in brackets
        if (selectedItems.length > 0) {
            label += ` (${selectedItems.join(", ")})`;
        }
        
        itemsSummary.push(label);
      }
    }

    grandTotalDisplay.innerText = `K${total.toFixed(2)}`;
    summaryItems.innerText = itemsSummary.length > 0 ? itemsSummary.join(" | ") : "None Selected";
  }

  // Rest of your logistics listeners (address, date, time) remain the same...
  // [Keep your existing updateLogistics and orderBtn logic here]
});