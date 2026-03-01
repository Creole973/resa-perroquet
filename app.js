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
