const PI = Math.PI;
const TAU = 2 * PI;
const ctx = document.querySelector("#wheel").getContext("2d");
const spinEl = document.querySelector("#spin");
const friction = 0.984;
let angVel = 0;
let ang = 0;

const sectors = [
  { enabled: true, color: "#f82", label: "Viktor" },
  { enabled: true, color: "#0bf", label: "Tomas B" },
  { enabled: true, color: "#fb0", label: "Tomas F" },
  { enabled: true, color: "#b0f", label: "Jozef" },
  { enabled: true, color: "#f0b", label: "Tibor" },
  { enabled: true, color: "#bf0", label: "Boris" },
  { enabled: true, color: "#1c7", label: "Daniel" },
];

const getEnabledSectors = () => sectors.filter((sector) => sector.enabled);

const togleSector = (label) => {
  const sector = sectors.find((sector) => sector.label == label);
  sector.enabled = !sector.enabled;
  init();
};

const drawParticipantsSelector = () => {
  const box = document.querySelector("#participantsSelector");
  box.innerHTML = "";
  sectors.forEach((sector) => {
    const button = document.createElement("button");
    button.textContent = sector.label;
    button.style.backgroundColor = sector.enabled ? sector.color : "white";
    button.classList = ["participantButton"];
    button.addEventListener("click", () => togleSector(sector.label));
    box.appendChild(button);
  });
};

const getIndex = () =>
  Math.floor(
    getEnabledSectors().length - (ang / TAU) * getEnabledSectors().length
  ) % getEnabledSectors().length;

function drawSector(sector, i) {
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const arc = TAU / getEnabledSectors().length;
  const ang = arc * i;
  ctx.clearRect(0, 0, ctx.width, ctx.height);
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);
  //
  ctx.restore();
}

function rotate() {
  const sector = getEnabledSectors()[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  spinEl.textContent = sector.label;
  spinEl.style.background = sector.color;
}

function frame() {
  if (!angVel) return;
  angVel *= friction; // Decrement velocity by friction
  if (angVel < 0.002) angVel = 0; // Bring to stop
  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function init() {
  drawParticipantsSelector();
  getEnabledSectors().forEach(drawSector);
  rotate(); // Initial rotation
  engine(); // Start engine
  spinEl.addEventListener("click", () => {
    angVel = Math.random() * (0.45 - 0.25) + 0.25;
  });
}

init();
