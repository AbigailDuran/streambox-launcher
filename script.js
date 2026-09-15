const tiles = [...document.querySelectorAll(".tile")];
let activeIndex = 0;

function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });

  document.getElementById("date").textContent =
    now.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
}

function focusTile(index) {
  activeIndex = (index + tiles.length) % tiles.length;
  tiles[activeIndex].focus();
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (["ArrowRight", "ArrowDown"].includes(key)) {
    event.preventDefault();
    focusTile(activeIndex + 1);
  }

  if (["ArrowLeft", "ArrowUp"].includes(key)) {
    event.preventDefault();
    focusTile(activeIndex - 1);
  }

  if (key === "Escape") {
    window.history.back();
  }
});

tiles.forEach((tile, index) => {
  tile.addEventListener("focus", () => {
    activeIndex = index;
  });
});

// Basic Gamepad API support.
// Works best in Chromium once the controller is paired.
let previousButtons = [];

function pollGamepad() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp = [...gamepads].find(Boolean);

  if (gp) {
    const pressed = gp.buttons.map((b) => b.pressed);

    // D-pad: buttons 12/13/14/15 on most standard gamepads
    if (pressed[13] && !previousButtons[13]) focusTile(activeIndex + 1);
    if (pressed[15] && !previousButtons[15]) focusTile(activeIndex + 1);
    if (pressed[12] && !previousButtons[12]) focusTile(activeIndex - 1);
    if (pressed[14] && !previousButtons[14]) focusTile(activeIndex - 1);

    // Cross / A button is typically button 0
    if (pressed[0] && !previousButtons[0]) tiles[activeIndex].click();

    // Circle / B button is typically button 1
    if (pressed[1] && !previousButtons[1]) window.history.back();

    previousButtons = pressed;
  }

  requestAnimationFrame(pollGamepad);
}

updateClock();
setInterval(updateClock, 1000);
window.addEventListener("load", () => focusTile(0));
requestAnimationFrame(pollGamepad);
