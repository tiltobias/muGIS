
# 🏙️ muGIS Tutorial: Finding Good Housing Locations for Students in Trondheim

## 🎯 Objective

In this tutorial, we'll use GIS tools to help identify **suitable places to live for a student in Trondheim**, based on access to public transport, proximity to campus and safety concerns.

### 🧩 Criteria

We are looking for housing areas that meet the following conditions:

- 🧭 Within **1 km** of Lerkendalsbygget, NTNU Gløshaugen
- 🚌 Within **300 meters** of **bus route 3**
- 🚫 At least **200 meters away** from underpasses (considered potentially unsafe)

---

## 🗂️ Data Used

Ensure the following GeoJSON files are available in your project:

- `busstopp.geojson`: locations of all bus stops, with an attribute `bus_lines` indicating which bus lines serve each stop.
- `undergang.geojson`: locations of underpasses.

---

## 🛠️ Step-by-Step Workflow

### 1. Load the Data

1. Open muGIS in your browser.
2. Click on the **Load GeoJSON file** button in the bottom of the sidebar to the left.
   - Alternatively, you can drag and drop the files directly into the application window.
3. Load the two GeoJSON files (can be found in the `docs/tutorial-data/` folder):
   - `busstopp.geojson`
   - `undergang.geojson`

---

### 2. Identify Stops Served by Bus Line 3

1. Open the <img src="./icons/text-search.svg" /> **Attribute Table** of `busstopp.geojson`.
2. Open the **filter** panel.
3. Set the filter logic to **"OR"**.
4. Filter based on the `bus_lines` field to match line 3, using:
   ```
   bus_lines = '3'
   bus_lines LIKE '3,%'
   bus_lines LIKE '% 3,%'
   bus_lines LIKE '% 3'
   ```
5. Select all matching features (click the select button in the table’s corner).
6. Right-click and choose **"Create Layer From Selected Features"**.
7. Rename the new layer to **`buss3`**.

---

### 3. Create Buffers

1. Create a **300 meter buffer** around the `buss3` layer.
   - This shows areas easily reachable from bus line 3.
2. Create a **200 meter buffer** around `undergang.geojson`.
   - Rename this buffer to **`Skummelt`** (Norwegian for "scary").

---

### 4. Add a Reference Point for Lerkendalsbygget

1. Use the **Add Point** tool to mark Lerkendalsbygget (used as a reference point for Studentersamfundet).
2. Rename this point to **`Lerka`**.

---

### 5. Simplify the View

1. Hide unnecessary layers by clicking the **eye icon** in the Layers panel.

---

### 6. Create a Search Area Around Lerka

1. Create a **1000 meter buffer** around the `Lerka` point.
   - Rename this buffer to **`LerkaOmrådet`**.

---

### 7. Exclude Unsafe Areas

1. Use the **Difference** tool to subtract unsafe areas:
   - Input: `LerkaOmrådet`
   - Subtract: `Skummelt`
   - Output: a safe area around Lerka with underpasses excluded.

---

### 8. Refine the Bus Area

1. Use **Dissolve** on the `buss3` layer to merge multiple features into one.

---

### 9. Find the Final Suitable Zone

1. Use the **Intersect** tool:
   - Input: the result from the **Difference** operation.
   - Overlay: the **dissolved buss3** layer.
   - Output: area that is:
     - Within walking distance to Studentersamfundet (via Lerka)
     - Near bus line 3
     - Away from scary underpasses

🎉 **Done!** You've now isolated suitable places to live for students in Trondheim using spatial analysis.

---

## 🧠 Tips

- Use **styling** (colors, transparency) to visualize the layers clearly.
- Save your project regularly.
- Export the final result if needed for use in maps, reports, or web tools.

---

## 📁 Summary of Output Layers

| Layer Name     | Description                              |
|----------------|------------------------------------------|
| `buss3`        | Bus stops served by line 3               |
| `Skummelt`     | 200m buffer around underpasses           |
| `Lerka`        | Reference point near Studentersamfundet  |
| `LerkaOmrådet` | 1000m buffer around Lerka                |
| *(result)*     | Final safe & accessible housing zone     |
