document.addEventListener("DOMContentLoaded", () => {
  const prices = {
    essentials: 25,
    business: 45,
    tech: 35,
    linen: 55,
    footwear: 30,
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
  const orderBtn = document.getElementById("order-pickup-btn");
  const successOverlay = document.getElementById("success-overlay");

  const addressInput = document.getElementById("address");
  const dateInput = document.getElementById("pickup-date");
  const timeInput = document.getElementById("pickup-time");

  const summaryItems = document.getElementById("summary-items");
  const summaryLocation = document.getElementById("summary-location");
  const summaryLogistics = document.getElementById("summary-logistics");

  // =========================
  // BASKET CONTROLS
  // =========================
  document.querySelectorAll(".express-basket-card").forEach((card) => {
    const type = card.classList[1];
    const qtyDisplay = card.querySelector(".qty-display");
    const plusBtn = card.querySelector(".plus");
    const minusBtn = card.querySelector(".minus");

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
  // CALCULATE TOTAL + SUMMARY
  // =========================
  function calculateTotal() {
    let total = 0;
    let itemsSummary = [];

    for (const [key, count] of Object.entries(counts)) {
      if (count > 0) {
        total += count * prices[key];
        itemsSummary.push(
          `${count}x ${key.charAt(0).toUpperCase() + key.slice(1)}`
        );
      }
    }

    grandTotalDisplay.innerText = `K${total.toFixed(2)}`;
    summaryItems.innerText =
      itemsSummary.length > 0 ? itemsSummary.join(", ") : "None Selected";
  }

  // =========================
  // LIVE SUMMARY UPDATES
  // =========================
  addressInput.addEventListener("input", () => {
    summaryLocation.innerText =
      addressInput.value || "Not Set";
  });

  dateInput.addEventListener("change", updateLogistics);
  timeInput.addEventListener("change", updateLogistics);

  function updateLogistics() {
    const date = dateInput.value;
    const time = timeInput.value;

    if (date && time) {
      summaryLogistics.innerText = `${date} • ${time}`;
    }
  }

  // =========================
  // ORDER BUTTON
  // =========================
  orderBtn.addEventListener("click", () => {
    const totalValue = parseFloat(
      grandTotalDisplay.innerText.replace("K", "")
    );

    const selectedTime = timeInput.value;

    // ❌ No items
    if (totalValue <= 0) {
      alert("Please select at least one basket.");
      return;
    }

    // ❌ Missing inputs
    if (!addressInput.value || !dateInput.value || !timeInput.value) {
      alert("Please complete all logistics fields.");
      return;
    }

    // ❌ Time validation
    const hour = parseInt(selectedTime.split(":")[0]);

    if (hour < 6 || hour >= 18) {
      alert("⚠️ Our operation hours are from 06:00 to 18:00.");
      return;
    }

    // ✅ SUCCESS
    successOverlay.classList.add("active");

    // Reset AFTER showing success
    setTimeout(resetOrder, 2000);
  });

  // =========================
  // RESET FUNCTION
  // =========================
  function resetOrder() {
    // reset counts
    for (let key in counts) counts[key] = 0;

    // reset UI numbers
    document.querySelectorAll(".qty-display").forEach((el) => {
      el.innerText = "0";
    });

    // reset inputs
    addressInput.value = "";
    dateInput.value = "";
    timeInput.value = "";

    // reset summary
    summaryItems.innerText = "None Selected";
    summaryLocation.innerText = "Not Set";
    summaryLogistics.innerText = "Select Date & Time";
    grandTotalDisplay.innerText = "K0.00";

    // hide overlay after a bit
    setTimeout(() => {
      successOverlay.classList.remove("active");
    }, 1500);
  }
});
