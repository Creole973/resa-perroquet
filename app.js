// =============================================
// PARTICULES DORÉES FLOTTANTES (fond décoratif)
// =============================================
function createGoldParticles() {
    const container = document.getElementById('goldParticles');
    const count = 180;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'gold-particle';
        const size = 4 + Math.random() * 18;
        const left = Math.random() * 100;
        const duration = 6 + Math.random() * 14;
        const delay = Math.random() * 12;
        const opacity = 0.3 + Math.random() * 0.7;
        particle.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
        `;
        container.appendChild(particle);
    }
}
createGoldParticles();

// =============================================
// Désactiver le téléphone si déjà inscrit sur WhatsApp
// =============================================
document.getElementById('whatsapp').addEventListener('change', function () {
    const telInput = document.getElementById('telephone');
    const telWrapper = telInput.closest('.input-wrapper');
    if (this.value === 'OUI') {
        telInput.disabled = true;
        telInput.value = '';
        telInput.placeholder = 'Non requis (déjà sur WhatsApp)';
        telWrapper.classList.add('input-disabled');
        telInput.removeAttribute('required');
    } else {
        telInput.disabled = false;
        telInput.placeholder = '06 XX XX XX XX';
        telWrapper.classList.remove('input-disabled');
        telInput.setAttribute('required', 'required');
    }
});

// =============================================
// SOUMISSION DU FORMULAIRE
// =============================================
document.getElementById('perroquetForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('statusMessage');

    // Disable button to prevent double submit
    btn.disabled = true;
    btn.textContent = "TRAITEMENT...";
    statusMsg.textContent = "";

    // Collect form data
    const rawDate = document.getElementById('dateSoiree').value;
    // Formater la date en DD/MM/YYYY pour l'affichage
    const dateParts = rawDate.split('-');
    const dateSoireeFormatted = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

    const formData = {
        dateSoiree: dateSoireeFormatted,
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        whatsapp: document.getElementById('whatsapp').value,
        telephone: document.getElementById('telephone').value,
        activites: document.getElementById('activites').value,
        positionnement: document.getElementById('positionnement').value
    };

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZcTrBbfrVyxfkeMRr1FeyC_g5uFrJulTh3s53WkbRfydZCWyjDOlsBiq1XwtZRgCr/exec";

    // ========================================
    // MÉTHODE IFRAME : contourne 100% du CORS
    // (même méthode éprouvée que RESA CLUNY)
    // ========================================

    // Créer un iframe caché
    const iframeName = 'hidden_iframe_' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Créer un formulaire caché qui cible l'iframe
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'GET';
    hiddenForm.action = SCRIPT_URL;
    hiddenForm.target = iframeName;
    hiddenForm.style.display = 'none';

    // Ajouter chaque champ comme input hidden
    Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        hiddenForm.appendChild(input);
    });

    document.body.appendChild(hiddenForm);

    // Soumettre le formulaire vers l'iframe
    hiddenForm.submit();

    // Attendre un peu puis montrer le succès et nettoyer
    setTimeout(() => {
        showSuccessOverlay();
        document.getElementById('perroquetForm').reset();
        btn.disabled = false;
        btn.textContent = "S'INSCRIRE";

        // Nettoyer les éléments temporaires
        document.body.removeChild(iframe);
        document.body.removeChild(hiddenForm);
    }, 3000);
});

// =====================
// OVERLAY DE SUCCÈS
// =====================
function showSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    overlay.classList.remove('hidden');
    launchConfetti();
}

function launchConfetti() {
    const container = document.getElementById('confettiContainer');
    // Palette or/ambre/cuivre pour correspondre au thème
    const colors = ['#c9982e', '#d4a833', '#e8c547', '#a07a1a', '#8b6914', '#f5d76e', '#b8860b', '#daa520'];
    const count = 80;

    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = 2 + Math.random() * 2.5;
        const delay = Math.random() * 1.5;
        const size = 8 + Math.random() * 10;
        const isCircle = Math.random() > 0.5;

        piece.style.cssText = `
            left: ${left}%;
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: ${isCircle ? '50%' : '2px'};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        container.appendChild(piece);
    }

    // Nettoyer après la fin de l'animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// =============================================
// LOGIQUE ESPACE ADMIN
// =============================================

// Identifiants codés en dur (tel : pin)
const ADMIN_CREDENTIALS = {
    '0650178078': '7291', // GERMAIN JOHNNY
    '0766281613': '4538', // ERWAN
    '0782832500': '6174', // BEMOUSS
    '0667466669': '3826'  // MELANIE
};

// UI Elements Admin
const adminBtn = document.getElementById('adminBtn');
const loginModal = document.getElementById('loginModal');
const loginClose = document.getElementById('loginClose');
const adminPhone = document.getElementById('adminPhone');
const adminPass = document.getElementById('adminPass');
const loginSubmit = document.getElementById('loginSubmit');
const loginError = document.getElementById('loginError');

const adminDashboard = document.getElementById('adminDashboard');
const adminLogout = document.getElementById('adminLogout');
const adminDateSelect = document.getElementById('adminDateSelect');

const statTotal = document.getElementById('statTotal');
const statLeader = document.getElementById('statLeader');
const statFollower = document.getElementById('statFollower');
const noDataMsg = document.getElementById('noDataMsg');

// Données des stats (qui seront récupérées du Google Sheet)
let dashboardData = {};

// Ouvrir la modal de login
adminBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
    adminPhone.value = '';
    adminPass.value = '';
    loginError.textContent = '';
});

// Fermer la modal
loginClose.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

// Tentative de connexion
loginSubmit.addEventListener('click', attemptLogin);

function attemptLogin() {
    const phone = adminPhone.value.trim().replace(/\s/g, ''); // enlever les espaces
    const pass = adminPass.value.trim();

    if (!phone || !pass) {
        loginError.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    // Vérifier les credentials
    if (ADMIN_CREDENTIALS[phone] && ADMIN_CREDENTIALS[phone] === pass) {
        // Connexion réussie
        loginError.textContent = "";
        loginModal.classList.add('hidden');
        openDashboard();
    } else {
        // Échec
        loginError.textContent = "Identifiants incorrects.";
        // Petit effet de secousse
        loginModal.querySelector('.modal-card').animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ], { duration: 400, easing: 'ease-in-out' });
        adminPass.value = '';
    }
}

// Gérer la touche "Entrée"
adminPass.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptLogin();
});

// Ouvrir le dashboard
function openDashboard() {
    adminDashboard.classList.remove('hidden');
    // Mettre la date d'aujourd'hui par défaut si possible
    const today = new Date().toISOString().split('T')[0];
    adminDateSelect.value = today;

    // Charger les données depuis le Google Script
    fetchDashboardStats();
}

// Déconnexion
adminLogout.addEventListener('click', () => {
    adminDashboard.classList.add('hidden');
});

// Changement de date sur le dashboard
adminDateSelect.addEventListener('change', updateDashboardUI);

// Fonction pour récupérer les stats depuis le Sheet
function fetchDashboardStats() {
    loginSubmit.textContent = "CHARGEMENT...";

    // On ajoute ?action=getStats à l'URL pour demander les statistiques
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZcTrBbfrVyxfkeMRr1FeyC_g5uFrJulTh3s53WkbRfydZCWyjDOlsBiq1XwtZRgCr/exec";

    fetch(SCRIPT_URL + "?action=getStats")
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                dashboardData = data.stats;
                updateDashboardUI();
            } else {
                console.error("Erreur stats:", data);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

// Mettre à jour l'affichage selon la date sélectionnée
function updateDashboardUI() {
    const rawDate = adminDateSelect.value;
    if (!rawDate) return;

    // Format DD/MM/YYYY pour correspondre aux clés retournées par le script
    const dateParts = rawDate.split('-');
    const formattedDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

    const stats = dashboardData[formattedDate];

    if (stats) {
        // Il y a des données pour cette date
        noDataMsg.classList.add('hidden');
        document.querySelector('.stats-grid').style.display = 'grid';

        // Animation des compteurs
        animateValue(statTotal, 0, stats.total, 1000);
        animateValue(statLeader, 0, stats.leader, 1000);
        animateValue(statFollower, 0, stats.follower, 1000);
    } else {
        // Pas de données
        document.querySelector('.stats-grid').style.display = 'none';
        noDataMsg.classList.remove('hidden');
    }
}

// Animation ludique pour incrémenter les chiffres
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}
