"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import L from "leaflet";
import React from "react";

// Icône personnalisée pour les pépinières (VERT)
const pepiniereIcon = new L.DivIcon({
  className: "",
  iconSize: [36, 42],
  iconAnchor: [18, 42],
  popupAnchor: [0, -36],
  html: `
    <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#shadow)">
        <path d="M18 2C10.268 2 4 8.268 4 16.001c0 7.732 11.09 22.13 13.97 25.89a2 2 0 0 0 3.06 0C20.91 38.13 32 23.733 32 16.001 32 8.268 25.732 2 18 2Z" fill="#22c55e"/>
        <circle cx="18" cy="16" r="6" fill="#fff" stroke="#22c55e" stroke-width="2"/>
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

const PepinieresMap = ({
  pepinieres = [],
  onPepiniereClick,
  mapStyle = "street",
  style,
  center,
}) => {
  const [selectedPepiniere, setSelectedPepiniere] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);
  const galleryRef = useRef(null);

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

  // Forcer le re-render de la carte quand les pépinières changent
  useEffect(() => {
    setMapKey((prev) => prev + 1);
  }, [pepinieres]);

  // Invalidation de la taille de la carte après le rendu
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();

        // Ajuster les bounds si on a des pépinières
        if (pepinieres && pepinieres.length > 0) {
          const bounds = [];
          pepinieres.forEach((pepiniere) => {
            if (pepiniere.latitude && pepiniere.longitude) {
              const lat = parseFloat(pepiniere.latitude);
              const lng = parseFloat(pepiniere.longitude);
              if (!isNaN(lat) && !isNaN(lng)) {
                bounds.push([lat, lng]);
              }
            }
          });

          if (bounds.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [20, 20] });
          }
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pepinieres, mapKey]);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (mapRef.current && mapRef.current.invalidateSize) {
        mapRef.current.invalidateSize();
      }
    }, 200);
  }, []);

  const handlePepiniereClick = (pepiniere) => {
    setSelectedPepiniere(pepiniere);
    if (onPepiniereClick) {
      onPepiniereClick(pepiniere);
    }
    // Zoom sur la pépinière
    if (pepiniere.latitude && pepiniere.longitude && mapRef.current) {
      const lat = parseFloat(pepiniere.latitude);
      const lng = parseFloat(pepiniere.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.setView([lat, lng], 15);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const prepareGalleryImages = (photos) => {
    return photos.map((photo) => ({
      original: `${process.env.NEXT_PUBLIC_API_URL}/media/${photo.image}`,
      thumbnail: `${process.env.NEXT_PUBLIC_API_URL}/media/${photo.image}`,
      description: photo.titre || photo.description || `Image ${photo.id}`,
    }));
  };

  // Gestion du clic sur la carte pour fermer les panneaux de détail
  const handleMapClick = (e) => {
    setSelectedPepiniere(null);
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
        {/* Satellite + labels */}
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

        {/* Affichage des pépinières */}
        {Array.isArray(pepinieres) &&
          pepinieres.length > 0 &&
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
                icon={pepiniereIcon}
                eventHandlers={{
                  click: () => handlePepiniereClick(pepiniere),
                }}
              ></Marker>
            );
          })}
      </MapContainer>

      {/* Panneau latéral pour les détails de la pépinière sélectionnée */}
      {selectedPepiniere && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-gradient-to-br from-slate-50 to-white backdrop-blur-lg shadow-xl z-50 flex flex-col border-0 rounded-3xl m-3 max-w-[440px]">
          {/* Header fixe avec gradient doux */}
          <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm sticky top-0 z-10 rounded-t-3xl border-b border-green-100/50">
            <div className="flex items-center gap-3">
              {selectedPepiniere.user.logo ? (
                <img
                  src={
                    selectedPepiniere.user.logo.startsWith('http')
                      ? selectedPepiniere.user.logo
                      : `${process.env.NEXT_PUBLIC_API_URL}/media/${selectedPepiniere.user.logo}`
                  }
                  alt="Logo"
                  className="w-10 h-10 rounded-full object-cover border border-green-200 bg-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-green-200">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-7 8-7s8 3 8 7" /></svg>
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                Détails de la pépinière
              </h3>
            </div>
            <button
              onClick={() => setSelectedPepiniere(null)}
              className="text-slate-400 hover:text-green-500 text-2xl transition-all duration-200 rounded-2xl p-2 hover:bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-200"
              title="Fermer"
            >
              ×
            </button>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {/* Nom et type */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
              <h3 className="font-semibold text-xl text-slate-800 mb-2">
                {selectedPepiniere.nom || "Sans nom"}
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm text-slate-600">Projet rattaché : </span>
                <span className="font-medium text-green-700 text-sm">
                  {selectedPepiniere.nomProjet || "Non défini"}
                </span>
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Adresse
                </div>
              </div>
              <div className="text-base font-medium text-slate-800">
                {selectedPepiniere.adresse || "Non définie"}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
              <div className="flex items-center gap-3 mb-3">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Contact Gestionnaire
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-base font-medium text-slate-800">
                  - {selectedPepiniere.nomGestionnaire || "-"}
                </div>
                <div className="text-base font-medium text-slate-800">
                  - {selectedPepiniere.posteGestionnaire || "-"}
                </div>
                <div className="text-sm text-slate-600">
                  - {selectedPepiniere.telephoneGestionnaire || "-"}
                </div>
                <div className="text-sm text-slate-600">
                  - {selectedPepiniere.emailGestionnaire || "-"}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Description
                </div>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed">
                {selectedPepiniere.description || "-"}
              </div>
            </div>

            {/* Coordonnées GPS */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Coordonnées GPS
                </div>
              </div>
              <div className="text-sm text-slate-700">
                Lat : {selectedPepiniere.latitude}, Lng :{" "}
                {selectedPepiniere.longitude}
              </div>
            </div>

            {/* Date de création */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-rose-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Date d'ajout
                </div>
              </div>
              <div className="text-sm text-slate-700">
                {selectedPepiniere.createdAt
                  ? formatDate(selectedPepiniere.createdAt)
                  : "-"}
              </div>
            </div>

            {/* Bouton voir images */}
            {Array.isArray(selectedPepiniere.photos) &&
              selectedPepiniere.photos.length > 0 &&
              !showGallery && (
                <button
                  onClick={() => setShowGallery(true)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
                  Voir les images ({selectedPepiniere.photos.length})
                </button>
              )}

            {/* Galerie d'images */}
            {showGallery &&
              Array.isArray(selectedPepiniere.photos) &&
              selectedPepiniere.photos.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/50 p-5">
                  <div className="mb-4 text-lg font-semibold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-orange-600"
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
                      items={prepareGalleryImages(selectedPepiniere.photos)}
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

export default PepinieresMap;
