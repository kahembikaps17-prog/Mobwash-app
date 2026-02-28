document.addEventListener("DOMContentLoaded", () => {
  // 1. BASE PRICES
  const basePrices = {
    essentials: 97.99,
    business: 0, 
    tech: 0,     
    linen: 0,    
    footwear: 34.99,
  };

  // 2. INDIVIDUAL ITEM PRICES
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
    
    // Listen for custom item selections
    card.querySelectorAll('input[type="checkbox"]').forEach(check => {
        check.addEventListener('change', () => {
            updateCardPriceDisplay(card, type);
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

    // Initialize display on load
    updateCardPriceDisplay(card, type);
  });

  // Calculates unit cost based on checked items
  function getBasketUnitCost(card, type) {
    const checkedItems = Array.from(card.querySelectorAll('input[type="checkbox"]:checked'));
    if (checkedItems.length > 0) {
        return checkedItems.reduce((sum, checkbox) => sum + (itemPrices[checkbox.value] || 0), 0);
    } 
    return basePrices[type];
  }

  // DYNAMIC PRICE PILL LOGIC
  function updateCardPriceDisplay(card, type) {
    let pricePill = card.querySelector(".price-pill");
    const checkboxes = card.querySelectorAll('input[type="checkbox"]');
    const isCustomBasket = checkboxes.length > 0;

    // If the price pill was deleted from HTML, create it dynamically
    if (!pricePill) {
      pricePill = document.createElement("div");
      pricePill.className = "price-pill";
      // Inject it right into the basket-header
      const header = card.querySelector(".basket-header");
      if (header) header.appendChild(pricePill);
    }

    if (isCustomBasket) {
      const checkedItems = Array.from(card.querySelectorAll('input[type="checkbox"]:checked'));
      
      if (checkedItems.length > 0) {
        const totalCost = getBasketUnitCost(card, type);
        // Show item name if 1 is selected, or "X Items" if multiple
        const labelText = checkedItems.length === 1 ? checkedItems[0].value : `${checkedItems.length} Items`;
        
        pricePill.innerText = `${labelText} • K${totalCost.toFixed(2)}`;
        pricePill.style.display = "block"; // Reveal the pill
      } else {
        pricePill.style.display = "none"; // Hide if nothing is checked
      }
    } else {
      // Essentials & Footwear stay visible permanently
      pricePill.innerText = `K${basePrices[type].toFixed(2)}`;
      pricePill.style.display = "block";
    }
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

  // (Your existing orderBtn click listener and resetOrder logic remain here...)
});