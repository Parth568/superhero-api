let input = document.getElementById("input-box");
let button = document.getElementById("submit-button");
let showContainer = document.getElementById("show-container");
let listContainer = document.querySelector(".list");

let characters = [];

// Load local JSON data
fetch("superhero_characters.json")
  .then((response) => response.json())
  .then((data) => {
    characters = data;
    // Pick a random character and populate the input
    const random = characters[Math.floor(Math.random() * characters.length)];
    input.value = random.name;
  });

function displayWords(value) {
  input.value = value;
  removeElements();
}

function removeElements() {
  listContainer.innerHTML = "";
}

// Autocomplete: filter local data based on user input
input.addEventListener("keyup", () => {
  removeElements();
  if (input.value.length < 2) {
    return;
  }

  const searchTerm = input.value.toLowerCase();
  const matches = characters.filter((c) =>
    c.name.toLowerCase().includes(searchTerm)
  );

  matches.forEach((character) => {
    let name = character.name;
    let div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomplete-items");
    div.setAttribute("onclick", `displayWords('${name.replace(/'/g, "\\'")}')`);
    let word = "<b>" + name.substr(0, input.value.length) + "</b>" + name.substr(input.value.length);
    div.innerHTML = `<p class="item">${word}</p>`;
    listContainer.appendChild(div);
  });
});

// On submit, find the character and display image + info
button.addEventListener("click", () => {
  if (!input.value.trim()) {
    alert("Input cannot be blank");
    return;
  }
  showContainer.innerHTML = "";
  removeElements();

  const searchTerm = input.value.toLowerCase();
  const character = characters.find(
    (c) => c.name.toLowerCase() === searchTerm
  );

  if (!character) {
    showContainer.innerHTML = "<p>Character not found</p>";
    return;
  }

  showContainer.innerHTML = `<div class="card-container">
    <div class="container-character-image">
      <img src="${character.image}" alt="${character.name}" />
    </div>
    <div class="character-name">${character.name}</div>
    <div class="character-description">${character.description}</div>
  </div>`;
});
