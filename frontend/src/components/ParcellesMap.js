"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import L from "leaflet";
import React from "react";

// Icône personnalisée "pin" style Google Maps, couleur bleue
const full3DIcon = new L.DivIcon({
  className: "",
  iconSize: [36, 42],
  iconAnchor: [18, 42],
  popupAnchor: [0, -36],
  html: `
    <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#shadow)">
        <path d="M18 2C10.268 2 4 8.268 4 16.001c0 7.732 11.09 22.13 13.97 25.89a2 2 0 0 0 3.06 0C20.91 38.13 32 23.733 32 16.001 32 8.268 25.732 2 18 2Z" fill="#2563eb"/>
        <circle cx="18" cy="16" r="6" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      </g>
      <defs>
        <filter id="shadow" x="0" y="0" width="36" height="42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
    </svg>
  `,
});

// Import dynamique de Leaflet pour éviter les erreurs SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ParcellesMap = ({
  parcelles,
  sieges = [],
  pepinieres = [],
  onParcelleClick,
  onSiegeClick,
  onPepiniereClick,
  mapStyle = "street",
  style,
  center,
  mode = "parcelle",
}) => {
  const [selectedParcelle, setSelectedParcelle] = useState(null);;
  const [showGallery, setShowGallery] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);
  const galleryRef = useRef(null);

  // S'assurer que geojson est un objet (pas une chaîne)
  const parseGeojson = (geojson) => {
    if (!geojson) return null;
    if (typeof geojson === "string") {
      try {
        return JSON.parse(geojson);
      } catch (e) {
        return null;
      }
    }
    return geojson;
  };

  // Calculer le centroïde d'un polygone GeoJSON
  const getPolygonCenter = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates[0])) return null;
    // On clone le tableau pour éviter toute modification
    const coords = coordinates[0].map((coord) => [...coord]);
    let x = 0,
      y = 0,
      n = coords.length;
    coords.forEach(([lng, lat]) => {
      x += lng;
      y += lat;
    });
    return [y / n, x / n]; // [lat, lng] pour Leaflet
  };

  // Coordonnées de Madagascar (centre approximatif)
  const MADAGASCAR_CENTER = [-18.7669, 46.8691];
  const MADAGASCAR_BOUNDS = [
    [-25.607, 43.254], // Sud-Ouest
    [-11.945, 50.483], // Nord-Est
  ];

  const mapStyles = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    hybrid:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  const attribution = {
    street: "© OpenStreetMap contributors",
    satellite:
      "Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    hybrid: "© Esri",
  };

  // Forcer le re-render de la carte quand les parcelles changent
  useEffect(() => {
    setMapKey((prev) => prev + 1);
  }, [parcelles]);

  // Invalidation de la taille de la carte après le rendu
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();

        // Ajuster les bounds si on a des parcelles
        if (parcelles && parcelles.length > 0) {
          const bounds = [];
          parcelles.forEach((parcelle) => {
            if (parcelle.geojson && parcelle.geojson.coordinates) {
              // Convertir les coordonnées GeoJSON en format Leaflet
              const coordinates = parcelle.geojson.coordinates[0].map(
                (coord) => [coord[1], coord[0]]
              );
              bounds.push(...coordinates);
            }
          });

          if (bounds.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [20, 20] });
          }
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [parcelles, mapKey]);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (mapRef.current && mapRef.current.invalidateSize) {
        mapRef.current.invalidateSize();
      }
    }, 200);
  }, []);

  const handleParcelleClick = (parcelle, geojson) => {
    setSelectedParcelle(parcelle);
    if (onParcelleClick) {
      onParcelleClick(parcelle);
    }
    // Zoom sur la parcelle
    if (geojson && geojson.coordinates && mapRef.current) {
      const latlngs = geojson.coordinates[0].map((coord) => [
        coord[1],
        coord[0],
      ]);
      mapRef.current.fitBounds(latlngs, { maxZoom: 17, padding: [40, 40] });
    }
  };

  const prepareGalleryImages = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) return [];

    // Filtrer les images valides
    const validImages = images.filter((img) => img && img.image);

    if (validImages.length === 0) return [];

    // Si toutes les images ont ordre 0 ou pas de champ ordre, ne pas trier
    const hasValidOrder = validImages.some(
      (img) => typeof img.ordre === "number" && img.ordre !== 0
    );
    const sorted = hasValidOrder
      ? [...validImages].sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
      : [...validImages];

    return sorted.map((img, idx) => ({
      original: `${process.env.NEXT_PUBLIC_API_URL}/media/${img.image}`,
      thumbnail: `${process.env.NEXT_PUBLIC_API_URL}/media/${img.image}`,
      description: `Image ${img.ordre !== undefined ? img.ordre + 1 : idx + 1}`,
    }));
  };


  // Gestion du clic sur la carte pour fermer les panneaux de détail
  const handleMapClick = (e) => {
    setSelectedParcelle(null);
    // (ajouter ici setSelectedPepiniere si besoin)
  };

  if (typeof window === "undefined") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative flex"
      style={{
        height:
          typeof style !== "undefined" && style.height ? style.height : "100%",
        width:
          typeof style !== "undefined" && style.width ? style.width : "100%",
        minHeight:
          typeof style !== "undefined" && style.height ? undefined : "400px",
        minWidth:
          typeof style !== "undefined" && style.width ? undefined : undefined,
        margin: 0,
        padding: 0,
      }}
    >
      <MapContainer
        ref={mapRef}
        key={mapKey}
        center={center || MADAGASCAR_CENTER}
        zoom={6}
        style={{
          height: "100%",
          width: "100%",
          minHeight:
            typeof style !== "undefined" && style.height ? undefined : "400px",
          minWidth:
            typeof style !== "undefined" && style.width ? undefined : undefined,
        }}
        className="z-0"
        maxBounds={MADAGASCAR_BOUNDS}
        maxBoundsViscosity={1.0}
        maxZoom={19}
        whenReady={() => {
          setTimeout(() => {
            if (mapRef.current && mapRef.current.invalidateSize) {
              mapRef.current.invalidateSize();
            }
          }, 200);
        }}
        onClick={handleMapClick}
      >
        <TileLayer
          url={mapStyles[mapStyle]}
          attribution={attribution[mapStyle]}
        />
        {/* Satellite + labels (comme dans MapDrawModal) */}
        {mapStyle === "satellite" && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            attribution="Labels © Esri"
          />
        )}
        {/* Hybride = satellite + OSM routes/villes */}
        {mapStyle === "hybrid" && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
            opacity={0.7}
          />
        )}

        {/* Affichage des parcelles uniquement si mode === 'parcelle' */}
        {mode === "parcelle" &&
          Array.isArray(parcelles) &&
          parcelles.length > 0 &&
          parcelles.map((parcelle) => {
            // S'assurer que geojson est bien un objet
            const geojson = parseGeojson(parcelle.geojson);
            let center = null;
            if (geojson && geojson.type === "Polygon" && geojson.coordinates) {
              center = getPolygonCenter(geojson.coordinates);
            }
            return (
              <div key={parcelle.id}>
                {/* Polygone de la parcelle */}
                {geojson && geojson.coordinates && (
                  <Polygon
                    positions={geojson.coordinates[0].map((coord) => [
                      coord[1],
                      coord[0],
                    ])}
                    pathOptions={{
                      color: "#3b82f6",
                      weight: 2,
                      fillOpacity: 0.2,
                    }}
                    eventHandlers={{
                      click: () => handleParcelleClick(parcelle, geojson),
                    }}
                  />
                )}
                {/* Marqueur au centre de la parcelle */}
                {center && (
                  <Marker
                    position={center}
                    icon={full3DIcon}
                    eventHandlers={{
                      click: () => handleParcelleClick(parcelle, geojson),
                    }}
                  >
                    {/* Plus de Popup, tout est dans le panneau latéral */}
                  </Marker>
                )}
              </div>
            );
          })}
        {/* Affichage des sièges uniquement si mode === 'siege' */}
        {mode === "siege" &&
          sieges.map((siege) => {
            // Vérification et conversion sécurisée des coordonnées
            const lat = siege.latitude ? parseFloat(siege.latitude) : null;
            const lng = siege.longitude ? parseFloat(siege.longitude) : null;

            // Ne pas afficher le marqueur si les coordonnées sont invalides
            if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
              return null;
            }

            return (
              <Marker
                key={siege.id}
                position={[lat, lng]}
                icon={greenIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedSiege(siege);
                    if (onSiegeClick) onSiegeClick(siege);
                  },
                }}
              ></Marker>
            );
          })}
        {/* Affichage des pépinières uniquement si mode === 'pepinieres' */}
        {mode === "pepinieres" &&
          pepinieres.map((pepiniere) => {
            // Vérification et conversion sécurisée des coordonnées
            const lat = pepiniere.latitude
              ? parseFloat(pepiniere.latitude)
              : null;
            const lng = pepiniere.longitude
              ? parseFloat(pepiniere.longitude)
              : null;

            // Ne pas afficher le marqueur si les coordonnées sont invalides
            if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
              return null;
            }

            return (
              <Marker
                key={pepiniere.id}
                position={[lat, lng]}
                icon={orangeIcon}
                eventHandlers={{
                  click: () => onPepiniereClick && onPepiniereClick(pepiniere),
                }}
              >
                <Popup>
                  <div>
                    <strong>{pepiniere.nom}</strong>
                    <br />
                    {pepiniere.adresse}
                    <br />
                    Lat: {pepiniere.latitude}, Lng: {pepiniere.longitude}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Panneau latéral pour les détails de la parcelle sélectionnée */}
      {selectedParcelle && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-gradient-to-br from-slate-50 to-white backdrop-blur-lg shadow-xl z-50 overflow-y-auto flex flex-col border-0 rounded-3xl m-3 max-w-[440px]">
          {/* Header fixe avec gradient doux */}
          <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm sticky top-0 z-10 rounded-t-3xl border-b border-blue-100/50">
            <div className="flex items-center gap-3">
              {selectedParcelle.user.logo ? (
                <img
                  src={
                    selectedParcelle.user.logo.startsWith('http')
                      ? selectedParcelle.user.logo
                      : `${process.env.NEXT_PUBLIC_API_URL}/media/${selectedParcelle.user.logo}`
                  }
                  alt="Logo"
                  className="w-10 h-10 rounded-full object-cover border border-orange-200 bg-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-orange-200">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-7 8-7s8 3 8 7" /></svg>
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                Détails du site de référence
              </h3>
            </div>
            <button
              onClick={() => setSelectedParcelle(null)}
              className="text-slate-400 hover:text-blue-500 text-2xl transition-all duration-200 rounded-2xl p-2 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              title="Fermer"
            >
              ×
            </button>
          </div>

          {/* Contenu scrollable avec espacement doux */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {/* Nom et propriétaire avec design carte moderne */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
              <div className="font-semibold text-xl text-slate-800 mb-2">
                {selectedParcelle.nom || "Sans nom"}
              </div>
            </div>

            {/* Personne référente avec icônes douces */}
            {(selectedParcelle.nomPersonneReferente ||
              selectedParcelle.poste ||
              selectedParcelle.telephone ||
              selectedParcelle.email) && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Personne référente
                    </div>
                  </div>
                  {selectedParcelle.nomPersonneReferente && (
                    <div className="text-base font-medium text-slate-800 mb-1">
                      {selectedParcelle.nomPersonneReferente}
                    </div>
                  )}
                  {selectedParcelle.poste && (
                    <div className="text-sm text-slate-600 mb-1">
                      {selectedParcelle.poste}
                    </div>
                  )}
                  {selectedParcelle.telephone && (
                    <div className="text-sm text-slate-600 mb-1">
                      {selectedParcelle.telephone}
                    </div>
                  )}
                  {selectedParcelle.email && (
                    <div className="text-sm text-slate-600">
                      {selectedParcelle.email}
                    </div>
                  )}
                </div>
              )}

            {/* Superficie avec design minimaliste */}
            {selectedParcelle.superficie && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Superficie
                  </div>
                </div>
                <div className="text-lg font-medium text-slate-800">
                  {selectedParcelle.superficie} ha
                </div>
              </div>
            )}

            {/* Pratique */}
            {selectedParcelle.pratique && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Pratique
                  </div>
                </div>
                <div className="text-base font-medium text-slate-800">
                  {selectedParcelle.pratique}
                </div>
              </div>
            )}

            {/* Projet */}
            {selectedParcelle.nomProjet && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Projet
                  </div>
                </div>
                <div className="text-base font-medium text-slate-800">
                  {selectedParcelle.nomProjet}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedParcelle.description && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Description
                  </div>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed">
                  {selectedParcelle.description}
                </div>
              </div>
            )}

            {/* Bouton voir images avec design moderne */}
            {Array.isArray(selectedParcelle.images) &&
              selectedParcelle.images.length > 0 && (
                <button
                  onClick={() => {
                    setShowGallery(true);
                    setTimeout(() => {
                      if (galleryRef.current) {
                        galleryRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }, 100);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Voir les images ({selectedParcelle.images.length})
                </button>
              )}

            {/* Galerie d'images avec design soft */}
            {showGallery && selectedParcelle && (
              <div
                ref={galleryRef}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5"
              >
                <div className="mb-4 text-lg font-semibold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  Galerie d'images
                </div>
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200/50">
                  <ImageGallery
                    items={prepareGalleryImages(selectedParcelle.images)}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    showNav={true}
                    showThumbnails={true}
                    slideInterval={3000}
                    slideOnThumbnailOver={true}
                    additionalClass="custom-gallery"
                  />
                </div>
                <button
                  onClick={() => setShowGallery(false)}
                  className="mt-4 w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors duration-200"
                >
                  Fermer la galerie
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcellesMap;
