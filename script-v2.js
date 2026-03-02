const invitationDataV2 = {
  eventName: "90 Años de Fulvio",
  eventDateISO: "2026-03-28T13:00:00",
  dateText: "Sábado 28 de marzo de 2026",
  timeText: "1:00 PM",
  locationName: "Casino Ganadero de Jalapa, Tabasco",
  gpsQuery: "Casino Ganadero de Jalapa Tabasco",
  gpsUrl: "https://maps.app.goo.gl/6hAVYmdvRXrTMk9J7",
  whatsappNumber: "529932085482",
  horseNeighAudioSrc: "assets/relincho.mp3"
};

const ids = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  date: document.getElementById("eventDateText"),
  time: document.getElementById("eventTimeText"),
  location: document.getElementById("eventLocationText"),
  dateDetail: document.getElementById("eventDateDetail"),
  timeDetail: document.getElementById("eventTimeDetail"),
  locationDetail: document.getElementById("eventLocationDetail"),
  gps: document.getElementById("gpsButton"),
  mapFrame: document.getElementById("mapFrame"),
  form: document.getElementById("rsvpForm"),
  audio: document.getElementById("horseNeighAudio"),
  bgMusic: document.getElementById("bgMusicAudio"),
  musicToggleBtn: document.getElementById("musicToggleBtn"),
  musicVolume: document.getElementById("musicVolume"),
  openingScreen: document.getElementById("openingScreenV2"),
  openButton: document.getElementById("openInviteButtonV2")
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function setupData() {
  if (ids.date) {
    ids.date.textContent = invitationDataV2.dateText;
  }
  if (ids.time) {
    ids.time.textContent = invitationDataV2.timeText;
  }
  if (ids.location) {
    ids.location.textContent = invitationDataV2.locationName;
  }
  if (ids.dateDetail) {
    ids.dateDetail.textContent = invitationDataV2.dateText;
  }
  if (ids.timeDetail) {
    ids.timeDetail.textContent = invitationDataV2.timeText;
  }
  if (ids.locationDetail) {
    ids.locationDetail.textContent = invitationDataV2.locationName;
  }
  if (ids.gps) {
    ids.gps.href = invitationDataV2.gpsUrl;
  }

  if (ids.mapFrame) {
    ids.mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(invitationDataV2.gpsQuery)}&z=14&output=embed`;
  }

  if (invitationDataV2.horseNeighAudioSrc) {
    if (ids.audio) {
      ids.audio.src = invitationDataV2.horseNeighAudioSrc;
      ids.audio.load();
    }
  }
}

function countdownTick() {
  const diff = new Date(invitationDataV2.eventDateISO).getTime() - Date.now();
  if (diff <= 0) {
    ids.days.textContent = "00";
    ids.hours.textContent = "00";
    ids.minutes.textContent = "00";
    ids.seconds.textContent = "00";
    return;
  }

  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  ids.days.textContent = pad(days);
  ids.hours.textContent = pad(hours);
  ids.minutes.textContent = pad(minutes);
  ids.seconds.textContent = pad(seconds);
}

function setupRsvp() {
  ids.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("guestName").value.trim();
    const assignedSeats = Number(document.getElementById("assignedSeats").value || "0");
    const attendingCount = Number(document.getElementById("attendingCount").value || "0");
    const extra = document.getElementById("extraMessage").value.trim();

    if (!name) {
      alert("Por favor escribe tu nombre.");
      return;
    }

    if (assignedSeats <= 0) {
      alert("Por favor indica el número de lugares asignados.");
      return;
    }

    if (attendingCount < 0) {
      alert("Por favor indica cuántas personas asistirán.");
      return;
    }

    if (attendingCount > assignedSeats) {
      alert("El número de personas que asistirán no puede ser mayor a los lugares asignados.");
      return;
    }

    const lines = [
      `¡Hola! Soy ${name}. Muchas gracias por la invitación a ${invitationDataV2.eventName}.`,
      `Me asignaron ${assignedSeats} lugar(es) y con gusto confirmo que asistiremos ${attendingCount} persona(s).`,
      `Evento: ${invitationDataV2.dateText} · ${invitationDataV2.timeText}`,
      `Lugar: ${invitationDataV2.locationName}`
    ];

    if (extra) {
      lines.push(`Mensaje adicional: ${extra}`);
    }

    const msg = encodeURIComponent(lines.join("\n"));
    const wa = `https://wa.me/${invitationDataV2.whatsappNumber}?text=${msg}`;
    window.open(wa, "_blank", "noopener,noreferrer");
  });
}

function setupOpeningExperience() {
  if (!ids.openingScreen || !ids.openButton) {
    document.body.classList.remove("is-locked");
    return;
  }

  const openInvitation = () => {
    document.body.classList.add("opening-reveal");

    if (ids.audio && invitationDataV2.horseNeighAudioSrc) {
      ids.audio.currentTime = 0;
      ids.audio.play().catch(() => {
        // no-op
      });
    }

    if (ids.bgMusic) {
      ids.bgMusic.volume = Number(ids.musicVolume?.value || 0.55);
      ids.bgMusic.play().catch(() => {
        // no-op
      });
    }

    ids.openingScreen.classList.add("hidden");
    document.body.classList.remove("is-locked");

    window.setTimeout(() => {
      ids.openingScreen.setAttribute("aria-hidden", "true");
    }, 720);

    window.setTimeout(() => {
      document.body.classList.remove("opening-reveal");
    }, 1300);
  };

  ids.openButton.addEventListener("click", openInvitation, { once: true });
}

function setupMusicControl() {
  if (!ids.bgMusic || !ids.musicToggleBtn || !ids.musicVolume) {
    return;
  }

  ids.bgMusic.volume = Number(ids.musicVolume.value || 0.55);

  const updateToggleIcon = () => {
    const isPaused = ids.bgMusic.paused;
    ids.musicToggleBtn.textContent = isPaused ? "▶" : "⏸";
    ids.musicToggleBtn.setAttribute("aria-label", isPaused ? "Reproducir música" : "Pausar música");
  };

  ids.musicToggleBtn.addEventListener("click", () => {
    if (ids.bgMusic.paused) {
      ids.bgMusic.play().catch(() => {
        // no-op
      });
    } else {
      ids.bgMusic.pause();
    }
  });

  ids.musicVolume.addEventListener("input", () => {
    ids.bgMusic.volume = Number(ids.musicVolume.value);
  });

  ids.bgMusic.addEventListener("play", updateToggleIcon);
  ids.bgMusic.addEventListener("pause", updateToggleIcon);
  updateToggleIcon();
}

function setupRevealFallback() {
  if (CSS.supports("animation-timeline: view()")) {
    return;
  }

  const items = document.querySelectorAll(".reveal-v2");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          entry.target.style.transition = "opacity .8s ease, transform .8s ease";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });

  if ("caches" in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        if (key.startsWith("invitacion-v2-cache")) {
          caches.delete(key);
        }
      });
    });
  }
}

setupData();
countdownTick();
setInterval(countdownTick, 1000);
setupRsvp();
setupRevealFallback();
setupMusicControl();
setupOpeningExperience();
registerServiceWorker();
