"""Flask application for the interactive planet-volume pages."""

from flask import Flask, render_template

app = Flask(__name__)


@app.get("/")
def index():
    """Render the planet table and interactive NASA fact dialog."""
    return render_template("index.html")


@app.get("/solsystem")
def solar_system():
    """Render the animated solar-system page."""
    return render_template("orbits.html")


if __name__ == "__main__":
    app.run(debug=True)
