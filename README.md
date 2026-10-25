# Planetvolumer

En norsk Flask-nettside som sammenligner planetenes volum med Jorden og Solen. Utforsk NASA-fakta eller se planetene bevege seg i baner rundt Solen.

## Sider

- **Planetinfo** på forsiden: volumtabell og klikkbare NASA-fakta.
- **Solsystemet i bevegelse** på /solsystem: animasjon med fartskontroll og klikkbare planeter.

## Kom i gang

Krever Python 3.9 eller nyere.

Windows (PowerShell):

    py -m venv .venv
    .venv\Scripts\Activate.ps1
    python -m pip install -r requirements.txt
    python app.py

macOS / Linux:

    python3 -m venv .venv
    source .venv/bin/activate
    python -m pip install -r requirements.txt
    python app.py

Åpne http://127.0.0.1:5000 i nettleseren. Stopp serveren med Ctrl+C.

## Prosjektstruktur

    app.py
    requirements.txt
    templates/index.html
    templates/orbits.html
    static/css/style.css
    static/css/orbits.css
    static/js/script.js
    static/js/orbits.js

Planetfaktaene ligger lokalt i static/js/script.js og lenker videre til NASAs faktasider. De lastes ikke automatisk fra en NASA-API. Banemodellen er forenklet og ikke i målestokk.
