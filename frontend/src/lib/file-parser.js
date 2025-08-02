import * as shapefile from 'shapefile';
import * as JSZip from 'jszip';
import * as toGeoJSON from '@mapbox/togeojson';
import * as turf from '@turf/turf';

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
 
  try {
    let geojson;
    if (ext === 'geojson' || ext === 'json') {
      geojson = await parseGeoJSON(file);
    } else if (ext === 'shp' || ext === 'zip') {
      geojson = await parseShapefile(file);
    } else if (ext === 'kml') {
      geojson = await parseKML(file);
    } else {
      throw new Error(`Format de fichier non supporté: ${ext}`);
    }

    return extractGeometry(geojson);
  } catch (error) {
    console.error('Erreur lors du parsing du fichier:', error);
    throw new Error(`Impossible de lire le fichier: ${error.message}`);
  }
}

function extractGeometry(geojson) {
  if (!geojson) {
    throw new Error('GeoJSON vide ou invalide');
  }

  // Si c'est déjà une géométrie pure
  if (geojson.type && ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(geojson.type)) {
    return geojson;
  }

  // Si c'est une Feature
  if (geojson.type === 'Feature' && geojson.geometry) {
    return geojson.geometry;
  }

  // Si c'est une FeatureCollection, prendre la première feature
  if (geojson.type === 'FeatureCollection' && geojson.features && geojson.features.length > 0) {
    const firstFeature = geojson.features[0];
    if (firstFeature.geometry) {
      return firstFeature.geometry;
    }
  }

  throw new Error('Impossible d\'extraire la géométrie du fichier');
}

async function parseGeoJSON(file) {
  const text = await file.text();
  const geojson = JSON.parse(text);
 
  // Vérifier que c'est un GeoJSON valide
  if (!geojson.type) {
    throw new Error('Format GeoJSON invalide');
  }
 
  return geojson;
}

async function parseShapefile(file) {
  let arrayBuffer;
  let dbfBuffer = null;
 
  if (file.name.endsWith('.zip')) {
    // Si c'est un fichier ZIP contenant le shapefile
    const zip = new JSZip();
    const zipData = await zip.loadAsync(file);
   
    // Chercher les fichiers .shp et .dbf
    const shpFile = Object.values(zipData.files).find(f => f.name.endsWith('.shp'));
    const dbfFile = Object.values(zipData.files).find(f => f.name.endsWith('.dbf'));
   
    if (!shpFile) {
      throw new Error('Aucun fichier .shp trouvé dans le ZIP');
    }
   
    arrayBuffer = await shpFile.async('arraybuffer');
    if (dbfFile) {
      dbfBuffer = await dbfFile.async('arraybuffer');
    }
  } else {
    // Si c'est directement un fichier .shp
    arrayBuffer = await file.arrayBuffer();
  }
 
  // Ouvrir le shapefile et collecter toutes les features
  const features = [];
  const source = await shapefile.open(arrayBuffer, dbfBuffer);
  
  let result = await source.read();
  while (!result.done) {
    if (result.value) {
      features.push(result.value);
    }
    result = await source.read();
  }
 
  return {
    type: 'FeatureCollection',
    features: features
  };
}

async function parseKML(file) {
  const text = await file.text();
  const parser = new DOMParser();
  const kml = parser.parseFromString(text, 'text/xml');
 
  const errors = kml.getElementsByTagName('parsererror');
  if (errors.length > 0) {
    throw new Error('Fichier KML invalide');
  }
 
  const geojson = toGeoJSON.kml(kml);
  return geojson;
}

// Fonction pour exporter en GeoJSON
export function exportToGeoJSON(data, filename = 'sites_de_reference.geojson') {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
 
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Fonction pour calculer la superficie à partir d'une géométrie
export function calculateArea(geometry) {
  try {
    if (!geometry) return '';
    
    const feature = {
      type: 'Feature',
      geometry: geometry
    };
  
    const area = turf.area(feature);

    const superficieHa = (area / 10000).toFixed(2);
    return superficieHa;
  } catch (error) {
    console.error('Erreur lors du calcul de la superficie:', error);
    return '';
  }
}