const revealItems = document.querySelectorAll("[data-reveal]");
const modal = document.querySelector("[data-video-modal]");
const modalVideo = document.getElementById("modal-video");
const heroVideo = document.getElementById("hero-video");
const openButtons = document.querySelectorAll("[data-open-video]");
const closeButtons = document.querySelectorAll("[data-close-video]");
const toggleButtons = document.querySelectorAll("[data-video-toggle]");
const tiltTarget = document.querySelector("[data-tilt-target]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const syncToggleLabel = (video, button) => {
  if (!video || !button) {
    return;
  }

  button.textContent = video.paused ? "Resume motion" : "Pause motion";
};

toggleButtons.forEach((button) => {
  const target = document.getElementById(button.dataset.target);

  syncToggleLabel(target, button);

  button.addEventListener("click", () => {
    if (!target) {
      return;
    }

    if (target.paused) {
      target.play();
    } else {
      target.pause();
    }

    syncToggleLabel(target, button);
  });
});

const openModal = async () => {
  if (!modal) {
    return;
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  if (heroVideo && modalVideo) {
    modalVideo.currentTime = heroVideo.currentTime;
  }

  try {
    await modalVideo?.play();
  } catch {
    // Ignore autoplay restrictions; controls are available.
  }
};

const closeModal = () => {
  if (!modal) {
    return;
  }

  modal.hidden = true;
  document.body.style.overflow = "";
  modalVideo?.pause();
};

openButtons.forEach((button) => button.addEventListener("click", openModal));
closeButtons.forEach((button) => button.addEventListener("click", closeModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

if (tiltTarget && window.matchMedia("(pointer: fine)").matches) {
  const maxTilt = 6;

  tiltTarget.addEventListener("pointermove", (event) => {
    const rect = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - y) * maxTilt * 2;

    tiltTarget.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltTarget.addEventListener("pointerleave", () => {
    tiltTarget.style.transform = "";
  });
}

// Sign-up form handler
function handleSignup(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector("#signup-email").value;
  const confirmation = document.getElementById("signup-confirmation");

  // Hide the form, show confirmation
  form.hidden = true;
  confirmation.hidden = false;

  // In production, replace this with an actual API call
  console.log("Early access signup:", email);
}
