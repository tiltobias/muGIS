import pandas as pd

# Load GTFS files
stops = pd.read_csv("stops.txt")
stop_times = pd.read_csv("stop_times.txt")
trips = pd.read_csv("trips.txt")
routes = pd.read_csv("routes.txt")

# Merge stop_times with trips to get route_id per stop_id
stop_trips = stop_times.merge(trips[['trip_id', 'route_id']], on='trip_id', how='left')

# Merge with routes to get route short name (e.g. "2", "11", etc.)
stop_routes = stop_trips.merge(routes[['route_id', 'route_short_name']], on='route_id', how='left')

stop_routes['route_short_name'] = stop_routes['route_short_name'].astype(str)

# Group by stop_id and aggregate all bus line numbers used at the stop
stop_lines = stop_routes.groupby('stop_id')['route_short_name'].unique().reset_index()
stop_lines['route_short_name'] = stop_lines['route_short_name'].apply(sorted).apply(list)

# Merge with stops to get names and coordinates
stops_with_lines = stops.merge(stop_lines, on='stop_id', how='left')

# Rename for clarity
stops_with_lines = stops_with_lines.rename(columns={'route_short_name': 'bus_lines'})

# Optional: drop unused columns and reorder
final_df = stops_with_lines[['stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'bus_lines']]

# Export to CSV or inspect
final_df.to_csv("busstops_with_buslines.csv", index=False)
