document.addEventListener("DOMContentLoaded", () => {
  // 1. BASE PRICES (For baskets without custom selections like Essentials/Footwear)
  const basePrices = {
    essentials: 97.99,
    business: 0, // Now starts at 0, builds based on selection
    tech: 0,     // Now starts at 0, builds based on selection
    linen: 0,    // Now starts at 0, builds based on selection
    footwear: 34.99,
  };

  // 2. INDIVIDUAL ITEM PRICES (Edit these values to match your business!)
  const itemPrices = {
    "Suit": 85.00,
    "Blazer": 45.00,
    "Dress Shirt": 25.00,
    "Silk Scarf": 15.00,
    "Gym Kit": 40.00,
    "Sports Attire": 35.00,
    "Compression": 20.00,
    "Windbreaker": 30.00,
    "Duvet": 120.00,
    "Blanket": 80.00,
    "Curtains": 150.00,
    "Cushions": 25.00
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
  // BASKET & SELECTION CONTROLS
  // =========================
  document.querySelectorAll(".express-basket-card").forEach((card) => {
    const type = card.classList[1]; 
    const qtyDisplay = card.querySelector(".qty-display");
    const plusBtn = card.querySelector(".plus");
    const minusBtn = card.querySelector(".minus");
    const pricePill = card.querySelector(".price-pill");
    
    // Listen for checkbox changes (User selecting specific items)
    card.querySelectorAll('input[type="checkbox"]').forEach(check => {
        check.addEventListener('change', () => {
            updateCardPriceDisplay(card, type, pricePill);
            calculateTotal();
        });
    });

    plusBtn.addEventListener("click", () => {
      counts[type]++;
      qtyDisplay.innerText = counts[type];
      calculateTotal();
    });

    minusBtn.addEventListener("click", () => {
      if (counts[type] > 0) {
        counts[type]--;
        qtyDisplay.innerText = counts[type];
        calculateTotal();
      }
    });

    // Initialize display prices on load
    updateCardPriceDisplay(card, type, pricePill);
  });

  // Calculates the price for a SINGLE basket based on what is checked
  function getBasketUnitCost(card, type) {
    const checkedItems = Array.from(card.querySelectorAll('input[type="checkbox"]:checked'));
    
    // If it's a customizable basket AND items are selected, sum them up
    if (checkedItems.length > 0) {
        return checkedItems.reduce((sum, checkbox) => sum + (itemPrices[checkbox.value] || 0), 0);
    } 
    // Otherwise, fall back to the base price
    return basePrices[type];
  }

  // Updates the visual "K..." pill on the card itself
  function updateCardPriceDisplay(card, type, pricePill) {
      if(!pricePill) return;
      const currentUnitCost = getBasketUnitCost(card, type);
      pricePill.innerText = `K${currentUnitCost.toFixed(2)}`;
  }

  // =========================
  // CALCULATE GRAND TOTAL + SUMMARY
  // =========================
  function calculateTotal() {
    let total = 0;
    let itemsSummary = [];

    for (const [key, count] of Object.entries(counts)) {
      if (count > 0) {
        const card = document.querySelector(`.express-basket-card.${key}`);
        const unitCost = getBasketUnitCost(card, key);
        
        total += count * unitCost;
        
        // Build the summary string
        const selectedItemNames = Array.from(card.querySelectorAll('input[type="checkbox"]:checked'))
                                   .map(cb => cb.value);
        
        let label = `${count}x ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        if (selectedItemNames.length > 0) {
            label += ` (${selectedItemNames.join(", ")})`;
        }
        itemsSummary.push(label);
      }
    }

    grandTotalDisplay.innerText = `K${total.toFixed(2)}`;
    summaryItems.innerText = itemsSummary.length > 0 ? itemsSummary.join(" | ") : "None Selected";
  }

  // (Your existing Success Overlay and Validation code remains here...)
});