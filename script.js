let siteData = [];

fetch('sitedata.json')
  .then(response => response.json())
  .then(data => {
    siteData = data;

    const fuse = new Fuse(siteData, {
      keys: ['title', 'description'],
      threshold: 0.4
    });

    const input = document.getElementById('searchbar');
    const resultsDiv = document.getElementById('results');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value;
        const results = fuse.search(query);

        resultsDiv.innerHTML = '';

        // 🔥 Filtrera bort dåliga träffar
const filteredResults = results.filter(r => r.score < 0.5);

        if (filteredResults.length === 0) {
          resultsDiv.innerHTML = `
            <p>❌ Inga sidor hittades...</p>
            <button class="edit-button" onclick="createSite()">➕ Lägg till ny sida</button>
          `;
        } else {
          filteredResults.forEach(result => {
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
        }
      }
    });

    function createSite() {
      const newTitle = prompt("Titel på sidan:");
      if (!newTitle) return;

      const newUrl = prompt("URL till sidan (börja med https://):");
      if (!newUrl) return;

      const newDescription = prompt("Beskrivning av sidan:");
      if (!newDescription) return;

      const newContributor = prompt("Ditt namn? 😎") || "Anonym";

      siteData.push({
        title: newTitle,
        url: newUrl,
        description: newDescription,
        contributor: newContributor
      });

      alert("✅ Sidan '" + newTitle + "' skapad!");
      input.value = newTitle;
      input.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
    }

    function editSite(title) {
      const page = siteData.find(p => p.title === title);
      const newDescription = prompt("Ny beskrivning för " + title + ":", page.description);
      if (newDescription) {
        page.description = newDescription;
        alert("✅ Uppdaterad!");
        input.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
      }
    }
  });
