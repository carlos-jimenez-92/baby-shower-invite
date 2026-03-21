// ===== INICIALIZAR CUANDO CARGUE LA PÁGINA =====
document.addEventListener('DOMContentLoaded', () => {
  cargarDatosConfig();
  iniciarContador();
  iniciarMapa();
  iniciarMusica();
  iniciarRSVP();
});

// ===== 1. CARGAR DATOS DESDE CONFIG.JS =====
function cargarDatosConfig() {
  // Hero
  document.getElementById('hero-baby-name').textContent = CONFIG.nombreBebe;

  // Detalles
  document.getElementById('det-fecha').textContent = CONFIG.fechaTexto;
  document.getElementById('det-hora').textContent = CONFIG.hora;
  document.getElementById('det-lugar').textContent = CONFIG.lugar;
  document.getElementById('det-direccion').textContent = CONFIG.direccion;

  // Mapa
  document.getElementById('mapa-direccion').textContent = CONFIG.direccion;
  document.getElementById('btn-gmaps').href =
    `https://www.google.com/maps?q=${CONFIG.coordenadas.lat},${CONFIG.coordenadas.lng}`;
  document.getElementById('btn-waze').href =
    `https://waze.com/ul?ll=${CONFIG.coordenadas.lat},${CONFIG.coordenadas.lng}&navigate=yes`;

  // Regalos
  document.getElementById('btn-amazon').href = CONFIG.linkAmazon;

  // Footer
  document.getElementById('footer-padres').textContent =
    `Con amor, ${CONFIG.nombreMama} & ${CONFIG.nombrePapa} 💕`;
  document.getElementById('footer-frase').textContent = CONFIG.fraseEspecial;
  document.getElementById('footer-hashtag').textContent = CONFIG.hashtag;

  // Música
  document.getElementById('music-src').src = CONFIG.cancion;
  document.getElementById('bg-music').load();
}

// ===== 2. CONTADOR REGRESIVO =====
function iniciarContador() {
  const fechaEvento = new Date(CONFIG.fecha + 'T16:00:00');

  function actualizar() {
    const ahora = new Date();
    const diff = fechaEvento - ahora;

    if (diff <= 0) {
      document.querySelector('.countdown-label').textContent = '¡Hoy es el gran día! 🎉';
      document.querySelector('.countdown').style.display = 'none';
      return;
    }

    const dias    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent    = String(dias).padStart(2, '0');
    document.getElementById('hours').textContent   = String(horas).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutos).padStart(2, '0');
    document.getElementById('seconds').textContent = String(segundos).padStart(2, '0');
  }

  actualizar();
  setInterval(actualizar, 1000);
}

// ===== 3. MAPA CON LEAFLET.JS =====
function iniciarMapa() {
  const { lat, lng } = CONFIG.coordenadas;

  const map = L.map('map').setView([lat, lng], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Marcador personalizado
  const iconoConejo = L.divIcon({
    html: '<div style="font-size:2rem;line-height:1;">🐰</div>',
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  L.marker([lat, lng], { icon: iconoConejo })
    .addTo(map)
    .bindPopup(`
      <strong>${CONFIG.lugar}</strong><br/>
      ${CONFIG.direccion}<br/>
      <em>${CONFIG.fechaTexto} · ${CONFIG.hora}</em>
    `)
    .openPopup();
}

// ===== 4. MÚSICA DE FONDO =====
function iniciarMusica() {
  const btn   = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.textContent = '🎵';
      btn.classList.remove('playing');
      btn.title = 'Activar música';
    } else {
      audio.play().catch(() => {
        console.log('El usuario debe interactuar primero');
      });
      btn.textContent = '🔊';
      btn.classList.add('playing');
      btn.title = 'Pausar música';
    }
    playing = !playing;
  });
}

// ===== 5. RSVP CON FORMSPREE =====
function iniciarRSVP() {
  const form    = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');

  // Asignar el endpoint de Formspree dinámicamente
  form.action = `https://formspree.io/f/${CONFIG.formspreeId}`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display = 'none';
        success.style.display = 'block';
      } else {
        alert('Hubo un error al enviar. Intenta de nuevo 💕');
      }
    } catch {
      alert('Sin conexión. Intenta de nuevo más tarde.');
    }
  });
  
}

// ===== TRANSFERENCIA BANCARIA =====
    function toggleTransferencia() {
        const div = document.getElementById('transferencia-info');
        document.getElementById('trans-banco').textContent = CONFIG.banco;
        document.getElementById('trans-clabe').textContent = CONFIG.clabe;
        document.getElementById('trans-nombre').textContent = CONFIG.titularCuenta;
        div.style.display = div.style.display === 'none' ? 'block' : 'none';
    }

    function copiarClabe() {
        navigator.clipboard.writeText(CONFIG.clabe).then(() => {
            const msg = document.getElementById('copy-msg');
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 2500);
        });
    }