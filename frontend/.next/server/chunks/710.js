"use strict";exports.id=710,exports.ids=[710],exports.modules={2710:(e,t,s)=>{s.d(t,{A:()=>o});var l=s(60687),a=s(43210),r=s(30036);s(68651),s(72287);var i=s(97638);new(s.n(i)()).DivIcon({className:"",iconSize:[36,42],iconAnchor:[18,42],popupAnchor:[0,-36],html:`
    <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#shadow)">
        <path d="M18 2C10.268 2 4 8.268 4 16.001c0 7.732 11.09 22.13 13.97 25.89a2 2 0 0 0 3.06 0C20.91 38.13 32 23.733 32 16.001 32 8.268 25.732 2 18 2Z" fill="#ef4444"/>
        <circle cx="18" cy="16" r="6" fill="#fff" stroke="#ef4444" stroke-width="2"/>
      </g>
      <defs>
        <filter id="shadow" x="0" y="0" width="36" height="42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
    </svg>
  `}),(0,r.default)(async()=>{},{loadableGenerated:{modules:["components\\SiegesMap.js -> react-leaflet"]},ssr:!1}),(0,r.default)(async()=>{},{loadableGenerated:{modules:["components\\SiegesMap.js -> react-leaflet"]},ssr:!1}),(0,r.default)(async()=>{},{loadableGenerated:{modules:["components\\SiegesMap.js -> react-leaflet"]},ssr:!1});let o=({sieges:e=[],onSiegeClick:t,mapStyle:s="street",style:r,center:i})=>{let[o,n]=(0,a.useState)(null),[d,c]=(0,a.useState)(!1),[u,f]=(0,a.useState)(0),m=(0,a.useRef)(null);return(0,a.useEffect)(()=>{f(e=>e+1)},[e]),(0,a.useEffect)(()=>{let e=setTimeout(()=>{m.current&&m.current.invalidateSize()},100);return()=>clearTimeout(e)},[e,u]),(0,a.useLayoutEffect)(()=>{setTimeout(()=>{m.current&&m.current.invalidateSize&&m.current.invalidateSize()},200)},[]),(0,l.jsx)("div",{className:"w-full h-full flex items-center justify-center bg-gray-100",children:(0,l.jsxs)("div",{className:"text-center",children:[(0,l.jsx)("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"}),(0,l.jsx)("p",{className:"mt-2 text-gray-600",children:"Chargement de la carte..."})]})})}}};