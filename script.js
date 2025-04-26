let siteData = [];

// 🚀 Ladda från LocalStorage om det finns
if (localStorage.getItem('wikibraData')) {
  siteData = JSON.parse(localStorage.getItem('wikibraData'));
} else {
  fetch('sitedata.json')
    .then(response => response.json())
    .then(data => {
      siteData = data;
      saveToLocalStorage(); // spara originalen också i LocalStorage
    });
}

// 🧠 Funktion som alltid sparar till LocalStorage
function saveToLocalStorage() {
  localStorage.setItem('wikibraData', JSON.stringify(siteData));
}

// --------------------
// Sökning
// --------------------

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchbar');
  const resultsDiv = document.getElementById('results');

  const fuse = new Fuse(siteData, {
    keys: ['title', 'description'],
    threshold: 0.4
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = input.value.trim();
      const results = fuse.search(query);

      resultsDiv.innerHTML = '';

      if (results.length === 0) {
        resultsDiv.innerHTML += `<p>❌ Inga sidor hittades...</p>`;
      }

      results.forEach(result => {
        const item = result.item;
        resultsDiv.innerHTML += `
          <div class="result">
            <a href="${item.url}" target="_blank">${item.title}</a>
            <p>${item.description}</p>
            <p><em>Bidrag av: ${item.contributor}</em></p>
            <button class="edit-button" onclick="editSite('${item.title}')">✏️ Redigera</button>
          </div>
        `;
      });

      resultsDiv.innerHTML += `
        <div style="margin-top: 20px;">
          <button class="edit-button" onclick="createSite()">➕ Lägg till ny sida</button>
        </div>
      `;
    }
  });
});

// --------------------
// Skapa och redigera sidor
// --------------------

function editSite(title) {
  const page = siteData.find(p => p.title === title);
  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = `
    <div class="result">
      <input id="edit-title" value="${page.title}" style="width: 90%; font-size: 20px; margin-bottom: 10px;"><br>
      <input id="edit-url" value="${page.url}" style="width: 90%; font-size: 16px; margin-bottom: 10px;"><br>
      <textarea id="edit-description" style="width: 90%; height: 100px; font-size: 16px;">${page.description}</textarea><br>
      <input id="edit-contributor" value="${page.contributor}" style="width: 90%; font-size: 14px; margin-bottom: 10px;"><br>
      <button class="edit-button" onclick="saveEdit('${title}')">💾 Spara ändringar</button>
    </div>
  `;
}

function saveEdit(oldTitle) {
  const page = siteData.find(p => p.title === oldTitle);

  page.title = document.getElementById('edit-title').value;
  page.url = document.getElementById('edit-url').value;
  page.description = document.getElementById('edit-description').value;
  page.contributor = document.getElementById('edit-contributor').value;

  saveToLocalStorage(); // 🛟 SPARA ÄNDRINGEN!

  alert("✅ Sidan uppdaterad!");

  const input = document.getElementById('searchbar');
  input.value = page.title;
  input.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
}

function createSite() {
  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = `
    <div class="result">
      <input id="edit-title" placeholder="Titel..." style="width: 90%; font-size: 20px; margin-bottom: 10px;"><br>
      <input id="edit-url" placeholder="URL (https://...)" style="width: 90%; font-size: 16px; margin-bottom: 10px;"><br>
      <textarea id="edit-description" placeholder="Beskrivning..." style="width: 90%; height: 100px; font-size: 16px;"></textarea><br>
      <input id="edit-contributor" placeholder="Ditt namn..." style="width: 90%; font-size: 14px; margin-bottom: 10px;"><br>
      <button class="edit-button" onclick="saveNewSite()">💾 Skapa sidan</button>
    </div>
  `;
}

function saveNewSite() {
  const newTitle = document.getElementById('edit-title').value;
  const newUrl = document.getElementById('edit-url').value;
  const newDescription = document.getElementById('edit-description').value;
  const newContributor = document.getElementById('edit-contributor').value || "Anonym";

  if (!newTitle || !newUrl || !newDescription) {
    alert("⚠️ Du måste fylla i alla fält!");
    return;
  }

  siteData.push({
    title: newTitle,
    url: newUrl,
    description: newDescription,
    contributor: newContributor
  });

  saveToLocalStorage(); // 🛟 SPARA NYA SIDAN!

  alert("✅ Ny sida skapad!");

  const input = document.getElementById('searchbar');
  input.value = newTitle;
  input.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
}

// --------------------
// Wikibra egen översättare
// --------------------

function ownTranslate() {
  const inputText = document.getElementById('translate-input').value.trim();
  const outputField = document.getElementById('translate-output');

  if (!inputText) {
    alert("⚠️ Skriv något att översätta!");
    return;
  }

  // Enkel ordlista
  const dictionary = {
    "hej": "hello",
    "värld": "world",
    "hur mår du": "how are you",
    "bra": "good",
    "dåligt": "bad",
    "tack": "thank you",
    "snälla": "please",
    "jag älskar dig": "i love you",
    "huset": "the house",
    "katten": "the cat"
  };

  let translated = inputText.toLowerCase();

  for (let key in dictionary) {
    const regex = new RegExp("\\b" + key + "\\b", "gi");
    translated = translated.replace(regex, dictionary[key]);
  }

  outputField.value = translated;
}

function saveTranslation() {
  const original = document.getElementById('translate-input').value.trim();
  const translated = document.getElementById('translate-output').value.trim();

  if (!original || !translated) {
    alert("⚠️ Båda fälten måste vara ifyllda!");
    return;
  }

  siteData.push({
    title: `Översättning: ${original.slice(0, 20)}...`,
    url: "#",
    description: translated,
    contributor: "Översättare"
  });

  saveToLocalStorage(); // 🛟 SPARA ÖVERSÄTTNINGEN!

  alert("✅ Översättning sparad!");

  const input = document.getElementById('searchbar');
  input.value = original;
  input.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
}
