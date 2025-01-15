import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; // Make sure mapbox-gl is installed

mapboxgl.accessToken = 'pk.eyJ1Ijoic29tZW9uZSIsImEiOiJja3l0a3Z6a2wwM3lmMnVtb2R2b3Z6a3Z6In0.vW-d40e-o0o0000000000'; // Replace with your Mapbox access token

const Map = ({ config }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: config.center,
      zoom: config.zoom
    });

    return () => map.remove();
  }, [config]);

  return <div ref={mapContainer} style={styles.mapContainer} />;
};

const styles = {
  mapContainer: {
    height: '400px',
    width: '100%',
    marginBottom: '20px'
  }
};

export default Map;
