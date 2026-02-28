// Data Object for all plans
const planData = {
    small: {
        title: "Small Basket",
        price: "K150",
        capacity: "5kg Capacity",
        service: "Signature Fold",
        icon: "bx-closet",
        desc: "Perfect for singles or students. Includes high-quality washing and our signature space-saving fold."
    },
    medium: {
        title: "Medium Basket",
        price: "K250",
        capacity: "12kg Capacity",
        service: "Wash, Fold & Steam",
        icon: "bx-package",
        desc: "Ideal for couples. Includes priority scheduling and light steaming to reduce wrinkles."
    },
    large: {
        title: "Large Basket",
        price: "K400",
        capacity: "25kg Capacity",
        service: "Full Valet Service",
        icon: "bxs-truck",
        desc: "The ultimate family care plan. Includes heavyweight item handling (duvets) and premium hangers."
    }
};

// 1. Logic for clicking 'Select' on the main subscription page
if (document.querySelector('.plans-grid-executive')) {
    document.querySelectorAll('.select-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const tiers = ['small', 'large', 'medium']; // Matches your HTML order
            localStorage.setItem('selectedPlan', tiers[index]);
            window.location.href = 'plan-detail.html';
        });
    });
}

// 2. Logic for the Detail Page
if (document.getElementById('plan-view')) {
    const selected = localStorage.getItem('selectedPlan') || 'medium';
    const data = planData[selected];

    document.getElementById('plan-title').innerText = data.title;
    document.getElementById('plan-price').innerText = `${data.price}/week`;
    document.getElementById('spec-capacity').innerText = data.capacity;
    document.getElementById('spec-service').innerText = data.service;
    document.getElementById('plan-description').innerText = data.desc;
    document.getElementById('plan-icon-large').innerHTML = `<i class='bx ${data.icon}'></i>`;

    // Payment Trigger
    document.getElementById('activate-payment-btn').addEventListener('click', function() {
        this.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Initializing Gateway...";
        this.style.opacity = "0.7";
        
        // This is where we will hook up your Payment API
        console.log(`Initializing payment for ${data.title} at ${data.price}`);
        
        // Placeholder for the next step
        setTimeout(() => {
            alert("Payment Gateway Integration Pending...");
            this.innerHTML = "Confirm & Initialize Payment";
            this.style.opacity = "1";
        }, 2000);
    });
}