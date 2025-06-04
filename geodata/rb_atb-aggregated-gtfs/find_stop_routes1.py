import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# --- Load GTFS files ---
stops = pd.read_csv("stops.txt")
stop_times = pd.read_csv("stop_times.txt")
trips = pd.read_csv("trips.txt")
routes = pd.read_csv("routes.txt")

# --- Join to get route_short_name for each stop_id ---
# 1. Join stop_times with trips to get route_id
stop_trips = stop_times.merge(trips[['trip_id', 'route_id']], on='trip_id', how='left')

# 2. Join with routes to get route_short_name (e.g. "2", "11")
stop_routes = stop_trips.merge(routes[['route_id', 'route_short_name']], on='route_id', how='left')

# 3. Convert route_short_name to string for clean output
stop_routes['route_short_name'] = stop_routes['route_short_name'].astype(str)

# 4. Group by stop_id and collect unique bus lines
stop_lines = stop_routes.groupby('stop_id')['route_short_name'].unique().reset_index()
stop_lines['route_short_name'] = stop_lines['route_short_name'].apply(sorted).apply(list)

# --- Merge with stops to keep all original columns ---
stops_with_lines = stops.merge(stop_lines, on='stop_id', how='left')
stops_with_lines = stops_with_lines.rename(columns={'route_short_name': 'bus_lines'})

# --- Export full CSV with all columns + bus_lines ---
stops_with_lines.to_csv("stops_with_bus_lines.csv", index=False)
print("✅ Exported to stops_with_bus_lines.csv")

# --- Optional: Export to GeoJSON with Point geometry ---
gdf = gpd.GeoDataFrame(
    stops_with_lines[["stop_name", "wheelchair_boarding", "vehicle_type", "bus_lines"]],
    geometry=gpd.points_from_xy(stops_with_lines.stop_lon, stops_with_lines.stop_lat),
    crs="EPSG:4326"
)
gdf.to_file("stops_with_bus_lines.geojson", driver="GeoJSON")
print("✅ Exported to stops_with_bus_lines.geojson")
