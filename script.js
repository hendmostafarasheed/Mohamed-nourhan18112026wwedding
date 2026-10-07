const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");

openBtn.addEventListener("click", () => {
  cover.style.display = "none";
  invitation.classList.remove("hidden");
  window.scrollTo({top:0, behavior:"smooth"});
});

const weddingDate = new Date("2026-11-18T19:00:00+02:00").getTime();

function updateCountdown(){
  const now = Date.now();
  let diff = weddingDate - now;
  if(diff < 0) diff = 0;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2,"0");
  document.getElementById("hours").textContent = String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,1000);


const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

function updateMusicButton() {
  if (!musicToggle || !bgMusic) return;
  const playing = !bgMusic.paused;
  musicToggle.textContent = playing ? "♫" : "▶";
  musicToggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  musicToggle.title = playing ? "Pause music" : "Play music";
  musicToggle.classList.toggle("playing", playing);
}

if (openBtn && bgMusic) {
  openBtn.addEventListener("click", async () => {
    try {
      await bgMusic.play();
    } catch (e) {
      // The music button remains available if the browser blocks playback.
    }
    updateMusicButton();
  });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", async () => {
    if (bgMusic.paused) {
      try { await bgMusic.play(); } catch (e) {}
    } else {
      bgMusic.pause();
    }
    updateMusicButton();
  });
}

if (bgMusic) {
  bgMusic.addEventListener("play", updateMusicButton);
  bgMusic.addEventListener("pause", updateMusicButton);
}


// Shared attendance click counter. It stores only one number: total confirmations.
const confirmAttendanceBtn = document.getElementById("confirmAttendanceBtn");
const attendanceCount = document.getElementById("attendanceCount");
const rsvpNote = document.getElementById("rsvpNote");

async function updateAttendanceCount() {
  if (!attendanceCount || typeof Counter === "undefined") return;

  try {
    const counter = new Counter({ workspace: "muhammed-nourhan-wedding-2026" });
    const result = await counter.get("confirmed-attendance");
    attendanceCount.textContent = Number(result.value || 0).toLocaleString();
  } catch (error) {
    console.error("Attendance counter error:", error);
    attendanceCount.textContent = "—";
  }
}

if (confirmAttendanceBtn) {
  confirmAttendanceBtn.addEventListener("click", async () => {
    if (typeof Counter === "undefined") {
      rsvpNote.textContent = "Please check your internet connection and try again.";
      return;
    }

    confirmAttendanceBtn.disabled = true;
    confirmAttendanceBtn.textContent = "✓ Confirmed";

    try {
      const counter = new Counter({ workspace: "muhammed-nourhan-wedding-2026" });
      const result = await counter.up("confirmed-attendance");
      attendanceCount.textContent = Number(result.value || 0).toLocaleString();
      rsvpNote.textContent = "Thank you! Your attendance has been counted ♥";
    } catch (error) {
      console.error("Attendance counter error:", error);
      confirmAttendanceBtn.disabled = false;
      confirmAttendanceBtn.textContent = "♥ Confirm Attendance";
      rsvpNote.textContent = "Something went wrong. Please try again.";
    }
  });
}

updateAttendanceCount();
