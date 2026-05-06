const input = document.getElementById("input-box");
const button = document.getElementById("submit-button");
const showContainer = document.getElementById("show-container");
const listContainer = document.querySelector(".list");

let heroesCache = [];

function removeElements() {
  listContainer.innerHTML = "";
}

function setInputValue(value) {
  input.value = value;
  removeElements();
}

function renderHero(hero) {
  const description =
    hero.description && hero.description.trim().length > 0
      ? hero.description
      : "No description available.";

  showContainer.innerHTML = `<div class="card-container">
    <div class="container-character-image">
      <img src="/api/proxy-image?url=${encodeURIComponent(hero.image)}" alt="${hero.name}" />
    </div>
    <div class="character-name">${hero.name}</div>
    <div class="character-description">${description}</div>
  </div>`;
}

function renderNoResult(message) {
  showContainer.innerHTML = `<div class="character-description">${message}</div>`;
}

async function fetchHeroes() {
  if (heroesCache.length > 0) return heroesCache;

  const response = await fetch("/api/heroes");
  if (!response.ok) {
    throw new Error("Unable to fetch superheroes from backend API.");
  }

  heroesCache = await response.json();
  return heroesCache;
}

function renderSuggestions(term, heroes) {
  removeElements();

  if (term.length < 2) return;

  const matches = heroes
    .filter(
      (hero) =>
        hero.name && hero.name.toLowerCase().startsWith(term.toLowerCase()),
    )
    .slice(0, 8);

  matches.forEach((hero) => {
    const div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomplete-items");

    const name = hero.name;
    const word = `<b>${name.substring(0, term.length)}</b>${name.substring(term.length)}`;

    div.innerHTML = `<p class="item">${word}</p>`;
    div.addEventListener("click", () => setInputValue(name));

    listContainer.appendChild(div);
  });
}

async function getResult() {
  const searchTerm = input.value.trim();

  if (!searchTerm) {
    alert("Input cannot be blank");
    return;
  }

  showContainer.innerHTML = "";

  try {
    const heroes = await fetchHeroes();
    const hero = heroes.find(
      (item) =>
        item.name && item.name.toLowerCase() === searchTerm.toLowerCase(),
    );

    if (!hero) {
      renderNoResult("No superhero found with that name.");
      return;
    }

    renderHero(hero);
  } catch (error) {
    renderNoResult(error.message);
  }
}

input.addEventListener("keyup", async () => {
  try {
    const heroes = await fetchHeroes();
    renderSuggestions(input.value.trim(), heroes);
  } catch (error) {
    removeElements();
  }
});

button.addEventListener("click", getResult);

window.onload = () => {
  getResult();
};
