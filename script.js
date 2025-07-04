document.addEventListener("DOMContentLoaded", () => {
  // Animate bouquet and flowers

  // H1 comes in first
  gsap.from("h1", {
    y: -50,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power2.out",
  });

  // Bouquet comes in after h1
  gsap.from(".bouquet", {
    y: 100,
    opacity: 0,
    duration: 0.8,
    delay: 1.6,
    ease: "back.out(1.7)",
  });

  // Flowers bloom after bouquet
  gsap.to(".flower", {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    delay: 1.5,
    ease: "back.out(1.7)",
    stagger: 0.2,
  });

  // Floating hearts on click
  function createFloatingHeart(x, y) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = x - 10 + "px";
    heart.style.top = y - 20 + "px";
    heart.innerHTML = "💖";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1400);
  }

  // Sparkles on hover
  function createSparkles(flower) {
    const rect = flower.getBoundingClientRect();

    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.setProperty("--x", Math.random());
      sparkle.style.setProperty("--y", Math.random());
      sparkle.style.left = rect.left + rect.width / 2 + "px";
      sparkle.style.top = rect.top + rect.height / 2 + "px";
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1200);
    }
  }

  // Fireflies
  const fireflyContainer = document.querySelector(".firefly-container");
  for (let i = 0; i < 25; i++) {
    const firefly = document.createElement("div");
    firefly.className = "firefly";
    firefly.style.left = `${Math.random() * 100}%`;
    firefly.style.top = `${Math.random() * 100}%`;
    firefly.style.setProperty("--delay", `${Math.random() * 5}s`);
    firefly.style.animationDuration = `${8 + Math.random() * 5}s`;
    fireflyContainer.appendChild(firefly);
  }

  // Butterflies
  function createButterfly() {
    const container = document.querySelector(".butterfly-container");
    const butterfly = document.createElement("div");
    butterfly.className = "butterfly";
    butterfly.style.left = Math.random() * window.innerWidth + "px";
    butterfly.style.bottom = "-40px";
    butterfly.innerHTML = `
      <div class="wing left"></div>
      <div class="wing right"></div>
      <div class="body"></div>
    `;
    container.appendChild(butterfly);
    setTimeout(() => butterfly.remove(), 10000);
  }
  setInterval(() => {
    if (Math.random() < 0.6) createButterfly();
  }, 5000);

  // Envelope modal logic
  window.toggleModal = function () {
    const modal = document.getElementById("modal");
    const modalContent = modal.querySelector(".modal-content");
    const envelope = document.getElementById("envelope");
    const letterAudio = document.getElementById("letterAudio");

    if (modal.classList.contains("show")) {
      modalContent.classList.add("hide");

      modalContent.addEventListener(
        "animationend",
        () => {
          modal.classList.remove("show");
          modalContent.classList.remove("hide");
          envelope.classList.remove("hidden");

          // Stop and reset the letter music
          letterAudio.pause();
          letterAudio.currentTime = 0;
        },
        { once: true }
      );
    } else {
      modal.classList.add("show");
      envelope.classList.add("hidden");
      modalContent.classList.remove("hide");
      void modalContent.offsetWidth;
      modalContent.classList.add("showing");

      // Play the letter music when opening
      letterAudio.currentTime = 0;
      letterAudio.play();
    }
  };

  // Audio controls
  const audio = document.getElementById("audio");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const seekBar = document.getElementById("seekBar");
  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("duration");
  const muteBtn = document.getElementById("muteBtn");

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPauseBtn.textContent = "⏸";
    } else {
      audio.pause();
      playPauseBtn.textContent = "▶";
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    seekBar.max = audio.duration;
    durationDisplay.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    seekBar.value = audio.currentTime;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
  });

  seekBar.addEventListener("input", () => {
    audio.currentTime = seekBar.value;
  });

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";
  });

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  // Flower click: Play song
  document.querySelectorAll(".flower").forEach((flower) => {
    flower.addEventListener("mouseenter", () => createSparkles(flower));

    flower.addEventListener("click", (e) => {
      const songSrc = flower.getAttribute("data-song");
      const songTitle = flower.getAttribute("data-title");
      const imgSrc = flower.getAttribute("data-img");
      playTrack(songSrc, songTitle, imgSrc);
      createFloatingHeart(e.pageX, e.pageY);
    });
  });
});

// Outside DOMContentLoaded
function playTrack(src, title, imgSrc) {
  const audio = document.getElementById("audio");
  const musicPlayer = document.getElementById("musicPlayer");
  const trackTitle = document.getElementById("trackTitle");
  const trackImage = document.getElementById("trackImage");

  audio.src = src;
  audio.currentTime = 0;
  audio.play();

  trackTitle.innerHTML = `<span>${title}</span>`;
  trackImage.src = imgSrc;
  trackImage.style.display = "block";

  musicPlayer.classList.add("show");
}

function closeMusic() {
  const musicPlayer = document.getElementById("musicPlayer");
  const audio = document.getElementById("audio");
  musicPlayer.classList.remove("show");
  audio.pause();
}
