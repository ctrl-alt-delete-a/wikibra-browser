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

    // När man klickar "➕ Lägg till ny sida"
    window.createSite = function() {
      document.getElementById('new-site-form').style.display = 'block';
    }

    window.saveNewSite = function() {
      const newTitle = document.getElementById('new-title').value.trim();
      const newUrl = document.getElementById('new-url').value.trim();
      const newDescription = document.getElementById('new-description').value.trim();
      const newContributor = document.getElementById('new-contributor').value.trim() || "Anonym";

      if (!newTitle || !newUrl || !newDescription) {
        alert("⚠️ Fyll i alla fält!");
        return;
      }

      siteData.push({
        title: newTitle,
        url: newUrl,
        description: newDescription,
        contributor: newContributor
      });

      alert("✅ Sidan '" + newTitle + "' skapad!");

      document.getElementById('searchbar').value = newTitle;
      document.getElementById('searchbar').dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));

      cancelNewSite();
    }

    window.cancelNewSite = function() {
      document.getElementById('new-site-form').style.display = 'none';
      document.getElementById('new-title').value = '';
      document.getElementById('new-url').value = '';
      document.getElementById('new-description').value = '';
      document.getElementById('new-contributor').value = '';
    }

    window.editSite = function(title) {
      const page = siteData.find(p => p.title === title);
      if (!page) {
        alert("❌ Kunde inte hitta sidan.");
        return;
      }

      const newDescription = prompt("Ny beskrivning för " + title + ":", page.description);
      if (newDescription) {
        page.description = newDescription;
        alert("✅ Beskrivning uppdaterad!");
        input.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
      }
    }
  })
  .catch(error => {
    console.error('🚨 Fel vid laddning av sitedata.json:', error);
  });
