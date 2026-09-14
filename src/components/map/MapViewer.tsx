'use client'

import React, { useState, useMemo } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Mock GeoJSON data for Maharashtra Districts (Simplified for Demo)
const MOCK_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Pune', status: 'Clear', digitized: 85 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[73.5, 18.2], [74.5, 18.2], [74.5, 19.5], [73.5, 19.5], [73.5, 18.2]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Mumbai', status: 'Disputed', digitized: 92 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[72.7, 18.9], [73.1, 18.9], [73.1, 19.3], [72.7, 19.3], [72.7, 18.9]]
        ]
      }
    }
  ]
};

export default function MapViewer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hoverInfo, setHoverInfo] = useState<any>(null);

  const dataLayer = useMemo(() => ({
    id: 'data',
    type: 'fill' as const,
    paint: {
      'fill-color': [
        'match',
        ['get', 'status'],
        'Clear', '#234F35', // success
        'Disputed', '#9E3A3A', // danger
        '#C97B4A' // accent
      ],
      'fill-opacity': 0.6
    }
  }), []);

  return (
    <div className="w-full h-full relative rounded-md overflow-hidden border border-border group">
      <Map
        initialViewState={{
          longitude: 78.9629,
          latitude: 20.5937,
          zoom: 3.5
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        mapLib={maplibregl}
        interactiveLayerIds={['data']}
        onMouseMove={(evt) => {
          const feature = evt.features && evt.features[0];
          if (feature) {
            setHoverInfo({
              feature,
              x: evt.point.x,
              y: evt.point.y
            });
          } else {
            setHoverInfo(null);
          }
        }}
        onMouseLeave={() => setHoverInfo(null)}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Source type="geojson" data={MOCK_GEOJSON as any}>
          <Layer {...dataLayer} />
        </Source>
        
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <NavigationControl showCompass={false} />
          <FullscreenControl />
        </div>

        {hoverInfo && (
          <div 
            className="absolute z-10 bg-background border border-border p-3 shadow-card rounded-md pointer-events-none text-sm min-w-[150px]" 
            style={{ left: hoverInfo.x + 10, top: hoverInfo.y + 10 }}
          >
            <h4 className="font-serif font-bold text-primary border-b border-border pb-1 mb-2">
              {hoverInfo.feature.properties.name}
            </h4>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-mutedForeground">Status:</span>
                <span className="font-medium text-foreground">{hoverInfo.feature.properties.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedForeground">Digitized:</span>
                <span className="font-medium text-foreground">{hoverInfo.feature.properties.digitized}%</span>
              </div>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}
