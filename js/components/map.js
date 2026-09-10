// components/map.js

import { monuments } from '../data/monuments.js';

let map;
let markers = [];
let monumentsData = monuments || [];
let selectMonumentCallback = null;

export function setMonumentSelectCallback(cb) {
  selectMonumentCallback = cb;
}

export function initMap() {
  const mapContainer = document.getElementById("heritage-map");
  if (!mapContainer) {
    console.error("Map container #heritage-map not found!");
    return;
  }

  if (mapContainer.offsetHeight === 0) {
    mapContainer.style.height = "500px";
    mapContainer.style.width = "100%";
  }

  const mapOptions = {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  map = new google.maps.Map(mapContainer, mapOptions);

  setTimeout(() => {
    google.maps.event.trigger(map, 'resize');
    map.setCenter({ lat: 20.5937, lng: 78.9629 });
  }, 300);

  displayMarkers("all");
  setupZoneFilters();
  console.log("SanskritiVerse Map initialized successfully with", monumentsData.length, "monuments!");
}

window.initMap = initMap;

function getCoordinates(site) {
  let rawLat = site.lat ?? site.latitude ?? site.latCoord ?? site.coordinates?.lat ?? site.location?.lat;
  let rawLng = site.lng ?? site.longitude ?? site.lon ?? site.lngCoord ?? site.coordinates?.lng ?? site.location?.lng;

  if (rawLat === undefined || rawLng === undefined || isNaN(parseFloat(rawLat))) {
    for (const key of Object.keys(site)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('lat') && rawLat === undefined) rawLat = site[key];
      if ((lowerKey.includes('lng') || lowerKey.includes('lon')) && rawLng === undefined) rawLng = site[key];
    }
  }

  if (Array.isArray(site.coordinates) && site.coordinates.length >= 2) {
    rawLat = site.coordinates[0];
    rawLng = site.coordinates[1];
  }

  return {
    lat: parseFloat(rawLat),
    lng: parseFloat(rawLng)
  };
}

export function panToMonument(id) {
  const site = monumentsData.find(s => s.id === id || s.name.toLowerCase() === id.toLowerCase());
  if (site && map) {
    const { lat, lng } = getCoordinates(site);
    if (!isNaN(lat) && !isNaN(lng)) {
      map.panTo({ lat, lng });
      map.setZoom(8);
    }
  }
}

function displayMarkers(selectedZone) {
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  const normalizedSelected = selectedZone ? selectedZone.toLowerCase() : "all";

  const customIcon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#f59e0b" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3.5" fill="#0f172a"/>
        <circle cx="12" cy="9" r="1.5" fill="#fbbf24"/>
      </svg>
    `),
    scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(16, 32)
  };

  monumentsData.forEach(site => {
    if (normalizedSelected === "all" || (site.zone && site.zone.toLowerCase() === normalizedSelected)) {
      const { lat, lng } = getCoordinates(site);

      if (isNaN(lat) || isNaN(lng)) {
        return;
      }

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: site.name,
        icon: customIcon,
        animation: google.maps.Animation.DROP,
        label: {
          text: site.name,
          color: "#0f172a",
          fontSize: "12px",
          fontWeight: "600",
          className: "map-pin-label bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-amber-200"
        }
      });

      marker.addListener("click", () => {
        if (typeof selectMonumentCallback === "function") {
          selectMonumentCallback(site);
        }
      });

      markers.push(marker);
    }
  });

  console.log(`Rendered ${markers.length} labeled markers for zone: ${normalizedSelected}`);
}

function setupZoneFilters() {
  document.querySelectorAll("button").forEach(button => {
    if (!button.hasAttribute("data-zone")) {
      const text = button.textContent.toLowerCase();
      let zone = "all";
      if (text.includes("north-east") || text.includes("northeast")) zone = "northeast";
      else if (text.includes("north")) zone = "north";
      else if (text.includes("south")) zone = "south";
      else if (text.includes("east")) zone = "east";
      else if (text.includes("west")) zone = "west";
      else if (text.includes("central")) zone = "central";
      button.setAttribute("data-zone", zone);
    }
  });

  document.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-zone]");
    if (!button) return;

    const zone = button.getAttribute("data-zone");

    document.querySelectorAll("button[data-zone]").forEach(btn => {
      btn.classList.remove("active-zone", "bg-amber-500", "text-white");
    });

    button.classList.add("active-zone", "bg-amber-500", "text-white");

    displayMarkers(zone);
  });
}