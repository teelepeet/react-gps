"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { IGpsLocation, IGpsLocationType } from "@/types/domain/locations";

const defaultIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const checkpointIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const waypointIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({
  locations,
  locationTypes,
}: {
  locations: IGpsLocation[];
  locationTypes: IGpsLocationType[];
}) {
  const center =
    locations.length > 0
      ? [locations[0].latitude, locations[0].longitude]
      : [58.5953, 25.0136];

  const sortedLocations = [...locations].sort(
    (a, b) => new Date(a.recordedAt || "").getTime() - new Date(b.recordedAt || "").getTime()
  );

  const polylinePoints = sortedLocations.map(
    (loc) => [loc.latitude, loc.longitude] as [number, number]
  );

  const getTypeName = (typeId: string): string => {
    return locationTypes.find((t) => t.id === typeId)?.name ?? "LOC";
  };

  const getIconByType = (typeId: string) => {
    const typeName = getTypeName(typeId);
    switch (typeName) {
      case "CP":
        return checkpointIcon;
      case "WP":
        return waypointIcon;
      default:
        return defaultIcon;
    }
  };

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {sortedLocations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.latitude, loc.longitude] as [number, number]}
          icon={getIconByType(loc.gpsLocationTypeId)}
        >
          <Popup>
            Type: {getTypeName(loc.gpsLocationTypeId)}
            <br />
            Recorded At:{" "}
            {loc.recordedAt && new Date(loc.recordedAt).toLocaleString()}
          </Popup>
        </Marker>
      ))}

      {polylinePoints.length > 1 && (
        <Polyline positions={polylinePoints} pathOptions={{ color: "red", weight: 4 }} />
      )}
    </MapContainer>
  );
}
