Wie lange interessiert uns noch der Krieg?

# Verzeichnisse und Dateien

- `bin/`: Skripte
  - `bin/1_scrape.js`: Scraped die neuen Frontseiten
  - `bin/2_check.js`: Führt einige Plausibilitätschecks durch, insbesondere, ob das HTML-Element mit dem Text-Content angegeben ist, und ob alle gesuchten Begriffe in allen Sprachen vorhanden sind.
  - `bin/3_analyze.js`: Scannt alle HTML-Dokumente, zählt die gesuchten Begriffe, und speichert das Ergebnis unter `docs/data.json`
- `data/`: Hier landen alle HTML-Dateien mit Brotli komprimiert. Ich pushe sich aufgrund der absehbaren Dateigröße nicht nach GitHub, bin aber offen, wie ich sie anderweitig zur Verfügung stellen kann.
- `docs/`: Hier liegt das Webfrontend
- `config.js`: Die zentrale Konfigurationsdatei.

