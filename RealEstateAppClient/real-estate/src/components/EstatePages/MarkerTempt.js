import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Popup } from 'react-leaflet';
// Define the custom icon
const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MarkerTempt({ latitude, longitude, setLatitude, setLongitude }) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });

  // Only render the marker if latitude and longitude are set
  return latitude && longitude ? (
    <Marker position={[latitude, longitude]} icon={customIcon}>
      <Popup>
        Selected Location: [{latitude.toFixed(4)}, {longitude.toFixed(4)}]
      </Popup>
    </Marker>
  ) : null;
}

export default MarkerTempt;
