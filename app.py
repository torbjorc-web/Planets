"""Flask application for the interactive planet-volume page."""

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


@app.get("/maaner")
def moons():
    """Render information about selected major moons."""
    return render_template("moons.html")


@app.get("/melkeveien")
def milky_way():
    """Render a zoomable illustration of the Milky Way and our place in it."""
    return render_template("milky_way.html")


@app.get("/quiz")
def quiz():
    """Render the self-marking quiz assembled from the site's own pages."""
    return render_template("quiz.html")


if __name__ == "__main__":
    app.run(debug=True)
