document.addEventListener('DOMContentLoaded', () => {
    console.log("Mobwash Payments Engine: Online");

    // --- 0. BACK NAVIGATION FIX ---
    const backChevron = document.querySelector('.minimal-back');
    if (backChevron) {
        backChevron.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default anchor behavior
            e.stopPropagation(); // Prevent event bubbling
            
           window.location.href = backChevron.getAttribute('href') || 'settings.html';

        });
    }

    // --- 1. ELEMENTS: MOMO ---
    const overlay = document.getElementById('modal-overlay');
    const modalLogo = document.getElementById('modal-provider-logo');
    const confirmBtn = document.getElementById('confirm-momo');
    const removeBtn = document.getElementById('remove-momo');
    const closeBtn = document.getElementById('close-modal');
    const prefixDropdown = document.getElementById('carrier-prefix-dropdown');
    const numInput = document.getElementById('momo-number');
    const nameInput = document.getElementById('momo-name');

    // --- 2. ELEMENTS: CARD ---
    const cardOverlay = document.getElementById('card-modal-overlay');
    const cardMain = document.querySelector('.luxury-credit-card'); 
    const confirmCardBtn = document.getElementById('confirm-card');
    const removeCardBtn = document.getElementById('remove-card');
    const closeCardBtn = document.getElementById('close-card-modal');
    const cardNumInput = document.getElementById('card-num-input');

    // --- 3. ELEMENTS: OTHER METHODS & INFO ---
    const infoOverlay = document.getElementById('info-modal-overlay');
    const bankField = document.querySelector('.luxury-field i.bxs-bank')?.closest('.luxury-field');
    const appleField = document.querySelector('.luxury-field i.bxl-apple')?.closest('.luxury-field');
    const closeInfoBtn = document.getElementById('close-info-modal');

    let activeProviderCard = null;

    const providers = {
        'Airtel': { color: '#ff0000', prefixes: ['097', '077'], textColor: '#ffffff' },
        'MTN': { color: '#ffcc00', prefixes: ['096', '076'], textColor: '#000000' },
        'Zamtel': { color: '#009933', prefixes: ['095', '075'], textColor: '#ffffff' }
    };

    // --- UTILITY: CLEAR ALL SELECTIONS ---
    function clearSelections() {
        document.querySelectorAll('.momo-card, .luxury-credit-card, .luxury-field').forEach(el => {
            el.classList.remove('active');
            const icon = el.querySelector('.status-icon');
            if(icon && el.classList.contains('momo-card') && !el.classList.contains('is-linked')) {
                icon.className = 'bx bx-plus-circle status-icon';
            }
        });
    }

    // --- 4. MOMO LOGIC ---
    document.querySelectorAll('.momo-card').forEach(card => {
        card.addEventListener('click', () => {
            activeProviderCard = card;
            const dataMethod = card.getAttribute('data-method') || "";
            const providerName = dataMethod.split(' ')[0]; 
            const isLinked = card.classList.contains('is-linked');

            if (providers[providerName]) {
                setupMomoModal(providerName, isLinked);
                if (overlay) overlay.classList.add('active');
            }
        });
    });

    function setupMomoModal(name, isLinked) {
        const config = providers[name];
        if (modalLogo) {
            modalLogo.innerText = name;
            modalLogo.style.background = config.color;
            modalLogo.style.color = config.textColor;
        }
        if (confirmBtn) {
            confirmBtn.style.background = config.color;
            confirmBtn.style.color = config.textColor;
        }
        if (prefixDropdown) {
            prefixDropdown.innerHTML = ''; 
            config.prefixes.forEach(pre => {
                const option = document.createElement('option');
                option.value = pre;
                option.innerText = `+260 ${pre.slice(1)}`;
                prefixDropdown.appendChild(option);
            });
        }
        
        const formBody = document.getElementById('modal-form-body');
        const modalTitle = document.getElementById('modal-title');
        
        if (isLinked) {
            if (modalTitle) modalTitle.innerText = `${name} Connected`;
            formBody.classList.add('hide-inputs');
            confirmBtn.style.display = 'none';
            removeBtn.style.display = 'block';
        } else {
            if (modalTitle) modalTitle.innerText = `Link ${name}`;
            formBody.classList.remove('hide-inputs');
            confirmBtn.style.display = 'block';
            removeBtn.style.display = 'none';
        }
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (numInput.value.length < 7 || !nameInput.value) return alert("Enter valid details");
            confirmBtn.innerText = "Linking...";
            setTimeout(() => {
                if (activeProviderCard) {
                    activeProviderCard.classList.add('is-linked');
                    clearSelections();
                    activeProviderCard.classList.add('active');
                    activeProviderCard.querySelector('span').innerText = `Secured • ••• ${numInput.value.slice(-3)}`;
                    activeProviderCard.querySelector('.status-icon').className = 'bx bxs-check-circle status-icon';
                }
                closeMomoModal();
            }, 1200);
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            if (activeProviderCard) {
                activeProviderCard.classList.remove('is-linked', 'active');
                activeProviderCard.querySelector('span').innerText = "Link Account";
                activeProviderCard.querySelector('.status-icon').className = 'bx bx-plus-circle status-icon';
            }
            closeMomoModal();
        });
    }

    const closeMomoModal = () => {
        overlay.classList.remove('active');
        confirmBtn.innerText = "Link Account";
        numInput.value = ''; nameInput.value = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeMomoModal);

    // --- 5. CREDIT CARD LOGIC ---
    if (cardMain) {
        cardMain.addEventListener('click', () => {
            const isLinked = cardMain.classList.contains('is-linked');
            const cardForm = document.getElementById('card-form-body');
            
            if (isLinked) {
                cardForm.classList.add('hide-inputs');
                confirmCardBtn.style.display = 'none';
                removeCardBtn.style.display = 'block';
            } else {
                cardForm.classList.remove('hide-inputs');
                confirmCardBtn.style.display = 'block';
                removeCardBtn.style.display = 'none';
            }
            cardOverlay.classList.add('active');
        });
    }

    if (cardNumInput) {
        cardNumInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
        });
    }

    if (confirmCardBtn) {
        confirmCardBtn.addEventListener('click', () => {
            const rawVal = cardNumInput.value.replace(/\s/g, '');
            if(rawVal.length < 16) return alert("Enter a valid card number");
            confirmCardBtn.innerText = "Authorizing...";
            setTimeout(() => {
                cardMain.classList.add('is-linked');
                clearSelections();
                cardMain.classList.add('active');
                cardMain.querySelector('.card-number').innerText = `**** **** **** ${rawVal.slice(-4)}`;
                cardOverlay.classList.remove('active');
                confirmCardBtn.innerText = "Link Card";
            }, 1500);
        });
    }

    if (removeCardBtn) {
        removeCardBtn.addEventListener('click', () => {
            cardMain.classList.remove('is-linked', 'active');
            cardMain.querySelector('.card-number').innerText = "**** **** **** ****";
            cardOverlay.classList.remove('active');
        });
    }

    if (closeCardBtn) closeCardBtn.addEventListener('click', () => cardOverlay.classList.remove('active'));

    // --- 6. BANK & APPLE PAY LOGIC ---
    if (bankField) {
        bankField.addEventListener('click', () => {
            clearSelections();
            bankField.classList.add('active');
            if (infoOverlay) infoOverlay.classList.add('active');
        });
    }

    if (appleField) {
        appleField.addEventListener('click', () => {
            const appleInput = appleField.querySelector('input');
            const originalVal = appleInput.value;
            appleInput.value = "Verifying...";
            setTimeout(() => {
                clearSelections();
                appleField.classList.add('active');
                appleInput.value = "Apple Pay • Ready";
            }, 800);
        });
    }

    if (closeInfoBtn) closeInfoBtn.addEventListener('click', () => infoOverlay.classList.remove('active'));

    // GLOBAL OVERLAY CLOSE
    window.addEventListener('click', (e) => {
        if (e.target === overlay) closeMomoModal();
        if (e.target === cardOverlay) cardOverlay.classList.remove('active');
        if (e.target === infoOverlay) infoOverlay.classList.remove('active');
    });
});

// COPY FUNCTION (Outside DOMContentLoaded)
function copyText(text) {
    navigator.clipboard.writeText(text);
    alert("Account details copied!");
}