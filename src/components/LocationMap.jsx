import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LocationMap.module.css';

const REAL_COLOR = '#4FD1FF';
const FICTIONAL_COLOR = '#F6AD55';

function markerOptions(type, isActive) {
  const color = type === 'real' ? REAL_COLOR : FICTIONAL_COLOR;
  return {
    color,
    fillColor: color,
    fillOpacity: isActive ? (type === 'real' ? 0.85 : 0.25) : 0.1,
    weight: isActive ? 2 : 1,
    opacity: isActive ? 1 : 0.3,
    dashArray: type === 'fictional-earth' ? '4 3' : null,
  };
}

export default function LocationMap({ locations, activeBooks, onSelectLocation, selectedLocation }) {
  const earthLocations = locations.filter(l => l.type !== 'off-world');

  const isActive = (loc) =>
    activeBooks.size === 0 || loc.books.some(b => activeBooks.has(b));

  return (
    <div className={styles.wrapper}>
      <MapContainer
        center={[30, -20]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {earthLocations.map(loc => {
          const active = isActive(loc);
          const isSelected = selectedLocation?.id === loc.id;
          return (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lng]}
              radius={isSelected ? 11 : 8}
              pathOptions={{
                ...markerOptions(loc.type, active),
                weight: isSelected ? 3 : (active ? 2 : 1),
                fillOpacity: isSelected
                  ? 0.95
                  : (loc.type === 'real' ? (active ? 0.85 : 0.1) : (active ? 0.25 : 0.05)),
              }}
              eventHandlers={{ click: () => onSelectLocation(loc) }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={active ? 1 : 0.4}
              >
                <span className={styles.tooltip}>
                  <span className={styles.tooltipName}>{loc.name}</span>
                  <span className={styles.tooltipType}>
                    {loc.type === 'real' ? 'Real location' : 'Fictional'}
                  </span>
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: REAL_COLOR }} />
          Real
        </span>
        <span className={styles.legendItem}>
          <span
            className={styles.legendDot}
            style={{ background: 'transparent', border: `2px dashed ${FICTIONAL_COLOR}` }}
          />
          Fictional
        </span>
      </div>
    </div>
  );
}
