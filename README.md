# Planetvolumer

En liten Flask-nettside på norsk som sammenligner volumet til planetene med Jorden og Solen. Klikk på et planetnavn for å åpne NASA-fakta. Bakgrunnen har en animert stjernehimmel.

## Funksjoner

- Tabell over volumet til de åtte planetene, med volum sammenlignet med Jorden.
- Summering av planetenes samlede volum sammenlignet med Solen.
- Klikkbare planetnavn med fakta, diameter, omløpstid, planettype og lenke til NASA.
- Bevegelige stjerner, stjerneskudd og pauseknapp.
- Tilpasset smale skjermer og innstillingen for redusert bevegelse.
- Egen solsystemside med baner rundt Solen, fartskontroll og klikkbare planeter.
- Måneside med beskrivelser og NASA-lenker for et utvalg av månene.
- Interaktiv Melkevei-side med animasjon, zoom og panorering.
- Selvrettende quiz som henter spørsmål fra nettsidens sider og unngår gjentakelser før bunken er brukt opp.

## Kom i gang

Krever Python 3.9 eller nyere.

### Windows (PowerShell)

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

Åpne deretter [http://127.0.0.1:5000](http://127.0.0.1:5000) i nettleseren. Stopp serveren med `Ctrl+C` i terminalen.

## Prosjektstruktur

```text
Planets/
├── app.py
├── requirements.txt
├── templates/
│   ├── index.html
│   └── orbits.html
└── static/
    ├── css/
    │   ├── style.css
    │   └── orbits.css
    └── js/
        ├── script.js
        └── orbits.js
```

## NASA-kilder

Faktaene i dialogene er skrevet inn i `static/js/script.js` og lenker videre til NASAs planetfakta. Innholdet hentes ikke automatisk fra en NASA-API.

- [Mercury](https://science.nasa.gov/mercury/facts/)
- [Venus](https://science.nasa.gov/venus/venus-facts/)
- [Earth](https://science.nasa.gov/earth/facts/)
- [Mars](https://science.nasa.gov/mars/facts/)
- [Jupiter](https://science.nasa.gov/jupiter/jupiter-facts/)
- [Saturn](https://science.nasa.gov/saturn/facts/)
- [Uranus](https://science.nasa.gov/uranus/facts/)
- [Neptune](https://science.nasa.gov/neptune/neptune-facts/)

## Utvikling

Flask kjører med debug-modus når du starter `python app.py`. Serveren laster vanligvis siden på nytt når Python- eller malfiler endres. CSS- og JavaScript-filer lastes fra `static/`.

Quiz-siden ligger på `/quiz`. Den leser nettsidens HTML-sider og `static/data/moons.json` når siden åpnes, slik at spørsmålene følger innholdet som vises i appen.
