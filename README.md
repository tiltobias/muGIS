
# 🗺️ muGIS

_A web-based GIS application built as part of the course [TBA4251 Programming in Geomatics](https://www.ntnu.no/studier/emner/TBA4251) at NTNU._

## 📌 Introduction

muGIS (μGIS) is an interactive online Geographic Information System (GIS) designed to work with GeoJSON data. It allows users to load GeoJSON FeatureCollection files or custom `.mugis` project files to visualize and analyze spatial data directly in the browser.

The application offers a variety of spatial analysis tools, including buffering, union, intersection, difference, dissolve, Voronoi diagrams, clipping, and bounding box calculations. These tools are powered by [Turf.js](https://turfjs.org/), a modular geospatial analysis library.

Users can also inspect and manipulate attribute data through a built-in attribute table, enabling the creation of new layers from filtered selections using versatile query filters.

The map interface is built on [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) for high-performance, interactive mapping. Integration with [Mapbox GL Draw](https://github.com/mapbox/mapbox-gl-draw) allows users to add new point, line, and polygon layers by drawing directly on the map. A layer list panel displays all active layers, with full control over their visualization.

Users can save the current state of their project to a `.mugis` file and later reload or reset it, providing a smooth workflow for iterative geospatial analysis.

## ⚙️ Tech Stack

This project is built using:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Turf.js](https://turfjs.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Mapbox GL Draw](https://github.com/mapbox/mapbox-gl-draw)
- [React Colorful](https://github.com/omgovich/react-colorful)
- [Lucide React Icons](https://lucide.dev/)

## 🌐 Deployment

The app is publicly available at:

- 🔗 [mugis.no](https://mugis.no)
- 🔗 [GitHub Pages](https://tiltobias.github.io/muGIS)

## 📚 Tutorial Task

As part of the assignment, we performed a spatial analysis to identify suitable housing areas for students in Trondheim, based on proximity to transport and safety concerns.

- 🚌 Close to bus line 3  
- 🚫 Avoid underpasses  
- 🧭 Within range of Studentersamfundet

👉 [📘 Read the full tutorial](docs/tutorial.md)

## 🚀 Getting Started

To run the project locally:

```bash
git clone https://github.com/yourusername/muGIS.git
cd muGIS
yarn
yarn dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

<!-- Optionally describe key folders like src/, public/, etc. -->

## 🧑‍💻 Author

[Tobias Andresen](https://github.com/tiltobias)

