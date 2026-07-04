// Dining Area / Cat Cafe section only. Other game areas can attach to the map hooks later.
const diningArea = document.getElementById("diningArea");
const catScreen = document.getElementById("catScreen");
const room = document.getElementById("room");
const catLayer = document.getElementById("catLayer");
const narration = document.getElementById("narration");
const mapButton = document.getElementById("mapButton");
const mapMenu = document.getElementById("mapMenu");
const heldItemEl = document.getElementById("heldItem");
const catName = document.getElementById("catName");
const bigCat = document.getElementById("bigCat");
const catReaction = document.getElementById("catReaction");
const hungerMeter = document.getElementById("hungerMeter");
const happyMeter = document.getElementById("happyMeter");
const affectionMeter = document.getElementById("affectionMeter");
const hungerValue = document.getElementById("hungerValue");
const happyValue = document.getElementById("happyValue");
const affectionValue = document.getElementById("affectionValue");

const storyLines = [
  "The cats seem calmer here, far from the forest's whispering trees.",
  "A little star charm sways above the shelves, though no breeze reaches it.",
  "The windows glow faintly with forest magic.",
  "You feel like these cats remember something you don't."
];

const cats = {
  miso: {
    name: "Miso",
    color: "#f0d0a8",
    patch: "#d88a42",
    behavior: "sitting",
    timing: {
      blink: "8.6s",
      tail: "12.8s",
      ear: "19.4s",
      breath: "5.4s",
      delay: "-1.5s"
    },
    x: 32.6,
    y: 78.9,
    scale: 1,
    w: 9.4,
    h: 7.2,
    hunger: 58,
    happiness: 74,
    affection: 42,
    line: "Miso kneads the chair cushion as if it belongs to her now."
  },
  bramble: {
    name: "Bramble",
    color: "#4f4b47",
    patch: "#f6e4cf",
    behavior: "cat-tree",
    timing: {
      blink: "10.7s",
      tail: "14.2s",
      ear: "17.9s",
      stretch: "21s",
      delay: "-4.2s"
    },
    x: 32.4,
    y: 10.4,
    scale: 1,
    w: 8.5,
    h: 6.4,
    hunger: 39,
    happiness: 66,
    affection: 51,
    line: "Bramble watches from the cat tree, tail moving like a spell pendulum."
  },
  luna: {
    name: "Luna",
    color: "#f0a17f",
    patch: "#fff3dc",
    behavior: "window",
    timing: {
      blink: "11.8s",
      tail: "15.4s",
      look: "18.2s",
      breath: "6.2s",
      delay: "-2.7s"
    },
    x: 20.4,
    y: 39.2,
    scale: 1,
    w: 6.4,
    h: 9.2,
    hunger: 47,
    happiness: 61,
    affection: 67,
    line: "Luna stares into the trees. For a second, the trees seem to stare back."
  },
  turnip: {
    name: "Turnip",
    color: "#fff8ea",
    patch: "#c9b09b",
    behavior: "sleeping",
    timing: {
      breath: "6.8s",
      zzz: "5.6s",
      ear: "22s",
      delay: "-3.3s"
    },
    x: 58.7,
    y: 88.6,
    scale: 1,
    w: 14.6,
    h: 7.4,
    hunger: 71,
    happiness: 80,
    affection: 36,
    line: "Turnip sleeps through the soft clink of cups and distant forest whispers."
  },
  cinder: {
    name: "Cinder",
    color: "#2f2b29",
    patch: "#efe1cf",
    behavior: "sitting",
    timing: {
      blink: "9.9s",
      tail: "13.6s",
      ear: "20.8s",
      breath: "5.8s",
      delay: "-6.1s"
    },
    x: 87,
    y: 78.2,
    scale: 1,
    w: 8.1,
    h: 14.3,
    hunger: 44,
    happiness: 52,
    affection: 49,
    line: "Cinder pads around the room like he is checking for invisible guests."
  }
};

const itemCopy = {
  food: {
    icon: "Food",
    pickup: "You lift the food bowl. Someone nearby immediately pretends not to notice.",
    drop: "The bowl settles with a cozy little clink."
  },
  toy: {
    icon: "Toy",
    pickup: "You pick up the toy. Several tails begin making thoughtful calculations.",
    drop: "The toy rolls to a stop on the warm wooden floor."
  },
  treat: {
    icon: "Treats",
    pickup: "The treat jar smells faintly of honey, cream, and something moonlit.",
    drop: "The treat jar gives a tiny glassy chime."
  },
  water: {
    icon: "Water",
    pickup: "You lift the water bowl, careful not to spill the moon-bright surface.",
    drop: "The water bowl settles with a soft ceramic tap."
  },
  brush: {
    icon: "Brush",
    pickup: "The cat brush has a few impossible silver hairs caught in it.",
    drop: "You set the brush down where the cats can pretend to ignore it."
  },
  bed: {
    icon: "Bed",
    pickup: "The cushion is warm, as if someone just left a dream behind.",
    drop: "The cushion waits patiently for its next nap."
  }
};

let activeCatId = null;
let heldItem = null;
let lastPointer = { x: 0, y: 0 };

function createCatSprite(catId, cat) {
  const button = document.createElement("button");
  button.type = "button";
  const behaviorClass = `${cat.behavior}-cat`;
  button.className = `cat-sprite cat-hotspot ${behaviorClass}`;
  button.dataset.catId = catId;
  button.dataset.behavior = cat.behavior;
  button.ariaLabel = `${cat.name} the cat`;
  button.style.setProperty("--cat-x", `${cat.x}%`);
  button.style.setProperty("--cat-y", `${cat.y}%`);
  button.style.setProperty("--cat-w", `${cat.w}%`);
  button.style.setProperty("--cat-h", `${cat.h}%`);
  button.style.setProperty("--cat-scale", cat.scale);
  button.style.setProperty("--sprite-fur", cat.color);
  button.style.setProperty("--sprite-patch", cat.patch);
  Object.entries(cat.timing || {}).forEach(([key, value]) => {
    button.style.setProperty(`--${key}-duration`, value);
  });
  button.innerHTML = `
    <span class="idle-cue idle-breath"></span>
    <span class="idle-cue idle-blink"></span>
    <span class="idle-cue idle-tail"></span>
    <span class="idle-cue idle-ear"></span>
    <span class="idle-cue idle-head"></span>
    <span class="idle-cue idle-look"></span>
    <span class="idle-cue idle-paw"></span>
    <span class="idle-cue idle-step"></span>
    <span class="idle-cue idle-zzz">Z</span>
  `;
  return button;
}

function renderCats() {
  catLayer.innerHTML = "";
  Object.entries(cats).forEach(([catId, cat]) => {
    catLayer.appendChild(createCatSprite(catId, cat));
  });
}

function setNarration(text) {
  narration.textContent = text;
}

function clampStat(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStats() {
  const cat = cats[activeCatId];
  if (!cat) return;
  hungerMeter.value = cat.hunger;
  happyMeter.value = cat.happiness;
  affectionMeter.value = cat.affection;
  hungerValue.textContent = cat.hunger;
  happyValue.textContent = cat.happiness;
  affectionValue.textContent = cat.affection;
}

function openCat(catId) {
  const cat = cats[catId];
  if (!cat) return;
  activeCatId = catId;
  catName.textContent = cat.name;
  bigCat.dataset.cat = catId;
  bigCat.style.setProperty("--active-cat-color", cat.color);
  catReaction.textContent = "";
  updateStats();
  diningArea.classList.add("hidden");
  catScreen.classList.remove("hidden");
  setNarration(cat.line);
}

function closeCat() {
  activeCatId = null;
  delete bigCat.dataset.cat;
  catScreen.classList.add("hidden");
  diningArea.classList.remove("hidden");
  setNarration(storyLines[Math.floor(Math.random() * storyLines.length)]);
}

function showReaction(text) {
  catReaction.textContent = text;
  catReaction.classList.remove("pop");
  void catReaction.offsetWidth;
  catReaction.classList.add("pop");
}

function feedCat(catId, fromDrop = false) {
  const cat = cats[catId];
  if (!cat) return;
  cat.hunger = clampStat(cat.hunger - 18);
  cat.affection = clampStat(cat.affection + 5);
  if (catId === activeCatId) {
    updateStats();
    showReaction("purr... snack accepted");
  }
  setNarration(fromDrop ? `${cat.name} enjoys the offering and looks much more settled.` : `${cat.name} eats daintily, then licks one paw.`);
}

function petCat() {
  const cat = cats[activeCatId];
  if (!cat) return;
  cat.affection = clampStat(cat.affection + 12);
  cat.happiness = clampStat(cat.happiness + 4);
  updateStats();
  showReaction("hearts rise... purr...");
  setNarration(`${cat.name} leans into your hand like you have done this before.`);
}

function playWithCat(catId, fromDrop = false) {
  const cat = cats[catId];
  if (!cat) return;
  cat.happiness = clampStat(cat.happiness + 16);
  cat.affection = clampStat(cat.affection + 4);
  if (catId === activeCatId) {
    updateStats();
    showReaction("happy little wiggle!");
  }
  setNarration(fromDrop ? `${cat.name} pounces with sudden cafe-floor courage.` : `${cat.name} bats at the toy with bright eyes.`);
}

function startHolding(itemButton) {
  const itemType = itemButton.dataset.item;
  const copy = itemCopy[itemType];
  if (!copy) return;
  heldItem = itemType;
  heldItemEl.textContent = itemButton.dataset.heldLabel || copy.icon;
  heldItemEl.classList.remove("hidden");
  positionHeldItem(lastPointer.x, lastPointer.y);
  setNarration(copy.pickup);
}

function stopHolding(message) {
  if (message) setNarration(message);
  heldItem = null;
  heldItemEl.classList.add("hidden");
  heldItemEl.textContent = "";
}

function positionHeldItem(x, y) {
  heldItemEl.style.left = `${x}px`;
  heldItemEl.style.top = `${y}px`;
}

function handleDrop(target) {
  if (!heldItem) return false;
  const catButton = target.closest("[data-cat-id]");
  if (catButton) {
    const catId = catButton.dataset.catId;
    if (heldItem === "food" || heldItem === "treat" || heldItem === "water") feedCat(catId, true);
    else if (heldItem === "toy") playWithCat(catId, true);
    else if (heldItem === "brush") {
      const cat = cats[catId];
      cat.affection = clampStat(cat.affection + 8);
      setNarration(`${cat.name} accepts one careful brush stroke, then acts like it was their idea.`);
    }
    stopHolding();
    return true;
  }
  const copy = itemCopy[heldItem];
  stopHolding(copy ? copy.drop : "You set the item down.");
  return true;
}

room.addEventListener("click", (event) => {
  if (heldItem && handleDrop(event.target)) return;

  const catButton = event.target.closest("[data-cat-id]");
  if (catButton) {
    openCat(catButton.dataset.catId);
    return;
  }

  const itemButton = event.target.closest("[data-item]");
  if (!itemButton) return;

  const itemType = itemButton.dataset.item;
  if (itemButton.dataset.holdable === "true") {
    startHolding(itemButton);
    return;
  }

  if (itemType === "cat-tree") setNarration("The cat tree is scratched all over, including marks too neat to be claws.");
  else if (itemType === "windowsill") setNarration("The windowsill is warm, though no sunlight touches it.");
  else if (itemType === "bed") setNarration("The cushion has a little hollow where many naps have slowly become one.");
});

document.querySelectorAll(".scenery").forEach((element) => {
  element.addEventListener("click", () => setNarration(element.dataset.message));
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setNarration(element.dataset.message);
    }
  });
});

document.addEventListener("pointermove", (event) => {
  lastPointer = { x: event.clientX, y: event.clientY };
  if (heldItem) positionHeldItem(event.clientX, event.clientY);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && heldItem) stopHolding("You set the item back before the cats can negotiate terms.");
});

mapButton.addEventListener("click", () => {
  const isOpen = !mapMenu.classList.contains("hidden");
  mapMenu.classList.toggle("hidden", isOpen);
  mapButton.setAttribute("aria-expanded", String(!isOpen));
});

mapMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const area = button.dataset.area;
  mapMenu.classList.add("hidden");
  mapButton.setAttribute("aria-expanded", "false");
  if (area === "Dining Area") setNarration("You are already in the Dining Area, where warm cups and warmer cats gather.");
  else setNarration(`${area} is coming soon.`);
});

document.getElementById("backButton").addEventListener("click", closeCat);
document.getElementById("feedButton").addEventListener("click", () => feedCat(activeCatId));
document.getElementById("petButton").addEventListener("click", petCat);
document.getElementById("playButton").addEventListener("click", () => playWithCat(activeCatId));

renderCats();

// Rotate ambient text gently so this section feels alive before larger story systems exist.
setInterval(() => {
  if (!activeCatId && !heldItem) setNarration(storyLines[Math.floor(Math.random() * storyLines.length)]);
}, 14000);
