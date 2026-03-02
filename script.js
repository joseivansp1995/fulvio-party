const invitationData = {
  eventName: "90 Años de Fulvio",
  eventDateISO: "2026-03-28T13:00:00",
  dateText: "Sábado 28 de marzo de 2026",
  timeText: "1:00 PM",
  locationName: "Casino Ganadero de Jalapa, Tabasco",
  gpsQuery: "Casino Ganadero de Jalapa Tabasco",
  gpsUrl: "https://maps.app.goo.gl/6hAVYmdvRXrTMk9J7",
  whatsappNumber: "529932085482",
  horseNeighAudioSrc: ""
};

const countdownEls = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

const eventDateText = document.getElementById("eventDateText");
const eventTimeText = document.getElementById("eventTimeText");
const eventLocationText = document.getElementById("eventLocationText");
const gpsButton = document.getElementById("gpsButton");
const mapFrame = document.getElementById("mapFrame");
const rsvpForm = document.getElementById("rsvpForm");
const openingScreen = document.getElementById("openingScreen");
const openInviteButton = document.getElementById("openInviteButton");
const horseNeighAudio = document.getElementById("horseNeighAudio");

window.addEventListener("securitypolicyviolation", (event) => {
  console.warn("[CSP] Violación detectada", {
    blockedURI: event.blockedURI,
    sourceFile: event.sourceFile,
    effectiveDirective: event.effectiveDirective,
    violatedDirective: event.violatedDirective,
    originalPolicy: event.originalPolicy,
    lineNumber: event.lineNumber,
    columnNumber: event.columnNumber,
    sample: event.sample
  });
});

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const target = new Date(invitationData.eventDateISO).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    countdownEls.days.textContent = "00";
    countdownEls.hours.textContent = "00";
    countdownEls.minutes.textContent = "00";
    countdownEls.seconds.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownEls.days.textContent = pad(days);
  countdownEls.hours.textContent = pad(hours);
  countdownEls.minutes.textContent = pad(minutes);
  countdownEls.seconds.textContent = pad(seconds);
}

function setupDynamicData() {
  eventDateText.textContent = invitationData.dateText;
  eventTimeText.textContent = invitationData.timeText;
  eventLocationText.textContent = invitationData.locationName;
  gpsButton.href = invitationData.gpsUrl;

  if (mapFrame) {
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(invitationData.gpsQuery)}&z=14&output=embed`;
  }
}

function setupRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function setupRsvpForm() {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const guestName = document.getElementById("guestName").value.trim();
    const companions = document.getElementById("companions").value || "0";
    const extraMessage = document.getElementById("extraMessage").value.trim();

    if (!guestName) {
      alert("Por favor ingresa tu nombre para confirmar.");
      return;
    }

    const messageLines = [
      `¡Hola! Quiero confirmar mi asistencia a ${invitationData.eventName}.`,
      `Nombre: ${guestName}`,
      `Acompañantes: ${companions}`,
      `Evento: ${invitationData.dateText}`,
      `Lugar: ${invitationData.locationName}`
    ];

    if (extraMessage) {
      messageLines.push(`Mensaje: ${extraMessage}`);
    }

    const message = encodeURIComponent(messageLines.join("\n"));
    const whatsappUrl = `https://wa.me/${invitationData.whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

function playHorseNeighFallbackSynth() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;

  if (!AudioCtx) {
    return;
  }

  const audioContext = new AudioCtx();
  const now = audioContext.currentTime;

  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.08);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
  masterGain.connect(audioContext.destination);

  const oscillators = [
    { type: "sawtooth", start: 710, mid: 520, end: 320 },
    { type: "triangle", start: 450, mid: 680, end: 260 },
    { type: "square", start: 330, mid: 270, end: 180 }
  ];

  oscillators.forEach((tone, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = tone.type;
    oscillator.frequency.setValueAtTime(tone.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(tone.mid, now + 0.36 + index * 0.05);
    oscillator.frequency.exponentialRampToValueAtTime(tone.end, now + 1.05);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16 - index * 0.03, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.03);

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start(now + index * 0.015);
    oscillator.stop(now + 1.1);
  });

  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 1.2, audioContext.sampleRate);
  const channelData = noiseBuffer.getChannelData(0);
  for (let index = 0; index < channelData.length; index += 1) {
    channelData[index] = (Math.random() * 2 - 1) * 0.18;
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(1200, now);
  bandpass.Q.value = 2.4;

  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.05, now + 0.2);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(masterGain);
  noise.start(now);
  noise.stop(now + 1.0);
}

function playHorseNeigh() {
  if (!horseNeighAudio || !invitationData.horseNeighAudioSrc) {
    playHorseNeighFallbackSynth();
    return;
  }

  horseNeighAudio.currentTime = 0;
  horseNeighAudio
    .play()
    .catch(() => {
      playHorseNeighFallbackSynth();
    });
}

function setupHorseNeighAudio() {
  if (!horseNeighAudio || !invitationData.horseNeighAudioSrc) {
    return;
  }

  horseNeighAudio.src = invitationData.horseNeighAudioSrc;
  horseNeighAudio.load();
}

function setupOpeningScreen() {
  if (!openingScreen) {
    document.body.classList.remove("is-locked");
    return;
  }

  if (openingScreen.classList.contains("hidden")) {
    document.body.classList.remove("is-locked");
    return;
  }

  const unlockInvitation = () => {
    playHorseNeigh();
    openingScreen.classList.add("hidden");
    document.body.classList.remove("is-locked");
  };

  if (!openInviteButton) {
    document.body.classList.remove("is-locked");
    return;
  }

  openInviteButton.addEventListener("click", unlockInvitation, { once: true });

  openingScreen.addEventListener("click", (event) => {
    if (event.target === openingScreen) {
      unlockInvitation();
    }
  });
}

setupDynamicData();
setupRevealOnScroll();
setupRsvpForm();
setupHorseNeighAudio();
setupOpeningScreen();
updateCountdown();
setInterval(updateCountdown, 1000);
