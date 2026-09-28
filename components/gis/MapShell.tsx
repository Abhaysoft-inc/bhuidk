"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Map, { NavigationControl, Source, Layer, FillLayer, LineLayer } from 'react-map-gl/maplibre';
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// We bypass worker issues by using mapbox-gl which often handles it better in Next.js
const mapLib = mapboxgl;
if (typeof window !== 'undefined') {
  (mapboxgl as any).accessToken = 'dummy';
  // Polyfill getSky to prevent react-map-gl/maplibre from crashing when using mapboxgl
  if (!(mapboxgl.Map.prototype as any).getSky) {
    (mapboxgl.Map.prototype as any).getSky = function() { return null; };
  }
}

import { Layers, FileText, Crosshair, Map as MapIcon, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DrawControl from './DrawControl';

// Mocked fetch for layers
async function fetchLayerData(type: string) {
  const res = await fetch(`/api/gis/layers?type=${type}`);
  return res.json();
}

const parcelsFillStyle: FillLayer = {
  id: 'parcels-fill',
  type: 'fill',
  paint: {
    'fill-color': [
      'match',
      ['get', 'ownership_status'],
      'disputed', 'rgba(194, 65, 12, 0.7)',
      'unclear', 'rgba(245, 158, 11, 0.7)',
      'rgba(16, 185, 129, 0.4)'
    ]
  }
};

const parcelsLineStyle: LineLayer = {
  id: 'parcels-line',
  type: 'line',
  paint: {
    'line-color': 'rgba(11, 43, 80, 0.8)',
    'line-width': 1
  }
};

const heatmapStyle: any = {
  id: 'dispute-heatmap',
  type: 'heatmap',
  paint: {
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'litigation_risk_score'],
      0, 0,
      100, 1
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(20, 83, 45, 0)',
      0.2, 'rgb(161, 161, 170)',
      0.4, 'rgb(217, 119, 6)',
      0.8, 'rgb(194, 65, 12)',
      1, 'rgb(153, 27, 27)'
    ],
    'heatmap-radius': 30,
    'heatmap-opacity': 0.8
  }
};

export default function MapShell() {
  const [viewState, setViewState] = useState({
    longitude: 73.8567, // Pune default
    latitude: 18.5204,
    zoom: 12,
    pitch: 45,
    bearing: 0
  });

  const [layersData, setLayersData] = useState<any>(null);
  const [activeToggles, setActiveToggles] = useState<Set<string>>(new Set(['parcels']));
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [timePeriod, setTimePeriod] = useState<number>(2026);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection State
  const [selectionStats, setSelectionStats] = useState<any>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  
  // Time Machine State
  const [timeMachineParcel, setTimeMachineParcel] = useState<any>(null);
  
  useEffect(() => {
    fetchLayerData('parcels').then(data => {
      setLayersData(data);
      setIsLoading(false);
    });
  }, []);

  const toggleLayer = (id: string) => {
    setActiveToggles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDrawUpdate = useCallback(async (e: any) => {
    if (e.features && e.features.length > 0) {
      setIsSelecting(true);
      const geometry = e.features[0].geometry;
      const bufferDistance = geometry.type === 'LineString' ? 0.5 : undefined;
      
      try {
        const res = await fetch('/api/gis/intersects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ geometry, bufferDistance })
        });
        const data = await res.json();
        setSelectionStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSelecting(false);
      }
    }
  }, []);

  const handleDrawDelete = useCallback(() => {
    setSelectionStats(null);
  }, []);

  const onMapClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature && feature.layer.id === 'parcels-fill') {
      setSelectedParcel(feature);
    } else {
      setSelectedParcel(null);
    }
  }, []);

  const onMapHover = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature && feature.layer.id === 'parcels-fill') {
      setHoverInfo({
        x: event.point.x,
        y: event.point.y,
        feature
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  return (
    <div className="relative w-full h-[700px] bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
      
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#c2410c] border-t-transparent rounded-full animate-spin"></div>
              <MapIcon className="w-5 h-5 text-[#0b2b50]" />
            </div>
            <div className="text-sm font-black text-[#0b2b50] tracking-wider uppercase">Loading Spatial Engine</div>
          </div>
        </div>
      )}

      {/* Main Map */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapLib={mapLib as any}
        mapStyle={{
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors'
            }
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
        }}
        interactiveLayerIds={activeToggles.has('parcels') ? ['parcels-fill'] : []}
        onClick={onMapClick}
        onMouseMove={onMapHover}
        onMouseLeave={() => setHoverInfo(null)}
      >
        {activeToggles.has('parcels') && layersData && (
          <Source id="parcels" type="geojson" data={layersData}>
            <Layer {...parcelsFillStyle} />
            <Layer {...parcelsLineStyle} />
          </Source>
        )}
        
        {activeToggles.has('heatmap') && layersData && (
          <Source id="heatmap-data" type="geojson" data={layersData}>
            <Layer {...heatmapStyle} />
          </Source>
        )}

        <DrawControl
          position="top-right"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            line_string: true,
            trash: true
          }}
          onCreate={handleDrawUpdate}
          onUpdate={handleDrawUpdate}
          onDelete={handleDrawDelete}
        />

        <NavigationControl position="bottom-right" />
      </Map>

      {/* Tooltip */}
      {hoverInfo && hoverInfo.feature && (
        <div 
          className="absolute z-50 pointer-events-none bg-slate-900 text-white text-xs px-2 py-1.5 rounded shadow-lg border border-slate-700"
          style={{ left: hoverInfo.x + 10, top: hoverInfo.y + 10 }}
        >
          <div className="font-bold border-b border-slate-700 pb-1 mb-1">{hoverInfo.feature.properties.ulpin_id}</div>
          <div className="text-slate-300">Use: <span className="text-white">{hoverInfo.feature.properties.land_use_type}</span></div>
        </div>
      )}

      {/* Floating Controls (Top Left) */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg w-72 overflow-hidden flex flex-col z-10">
        <div className="bg-[#0b2b50] text-white px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-sm flex items-center gap-2">
            <Layers className="w-4 h-4" /> Intelligence Layers
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1">
          <ToggleItem 
            id="parcels" 
            label="Cadastral Parcels" 
            active={activeToggles.has('parcels')} 
            onToggle={toggleLayer} 
          />
          <ToggleItem 
            id="heatmap" 
            label="Dispute Predictor (Heatmap)" 
            active={activeToggles.has('heatmap')} 
            onToggle={toggleLayer} 
          />
          <ToggleItem 
            id="border" 
            label="Interstate Border Conflicts" 
            active={activeToggles.has('border')} 
            onToggle={toggleLayer} 
          />
        </div>
      </div>

      {/* Right Sidebar Stats & Selection */}
      <div className="absolute top-4 right-14 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg w-80 flex flex-col max-h-[90vh] z-10 overflow-hidden">
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Viewport Analytics</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Visible Parcels</div>
              <div className="text-2xl font-black text-[#0b2b50]">
                {layersData ? Math.floor(layersData.features.length * 0.8) : '--'}
              </div>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg">
              <div className="text-[10px] font-bold text-rose-500 uppercase">High Risk</div>
              <div className="text-2xl font-black text-rose-700">14%</div>
            </div>
          </div>

          {/* Selection Stats Panel */}
          <AnimatePresence>
            {(selectionStats || isSelecting) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 border-t border-slate-100 pt-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Crosshair className="w-4 h-4 text-[#c2410c]" />
                  <h4 className="text-sm font-bold text-slate-800">Custom Region Analysis</h4>
                </div>
                
                {isSelecting ? (
                  <div className="flex items-center justify-center p-6 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-semibold">Parcels Affected:</span>
                      <span className="font-black text-[#0b2b50]">{selectionStats.totalParcels}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-semibold">Est. Value:</span>
                      <span className="font-black text-emerald-600">₹{(selectionStats.estimatedValue / 10000000).toFixed(2)} Cr</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-semibold">Disputes Detected:</span>
                      <span className="font-black text-rose-600">{selectionStats.disputedParcels}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-500 mb-2">Land Use Breakdown</div>
                      {Object.entries(selectionStats.landUseBreakdown || {}).map(([key, val]: any) => (
                        <div key={key} className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600">{key}</span>
                          <span className="font-bold text-slate-800">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-5 pt-0 bg-white/95">
          <button 
            onClick={() => alert('Exporting Viewport Report (PDF)...')}
            className="w-full bg-[#0b2b50] hover:bg-[#153a69] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Export Viewport Report
          </button>
        </div>
      </div>

      {/* Time Slider (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg px-6 py-4 w-[500px] z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Temporal Analysis</span>
          <span className="text-sm font-black text-[#c2410c]">{timePeriod}</span>
        </div>
        <input 
          type="range" 
          min="2015" 
          max="2026" 
          value={timePeriod}
          onChange={(e) => setTimePeriod(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c2410c]"
        />
        <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400">
          <span>2015</span>
          <span>2026</span>
        </div>
      </div>

      {/* Parcel Inspector Popup */}
      <AnimatePresence>
        {selectedParcel && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-slate-200 w-80 overflow-hidden z-50"
          >
            <div className="bg-[#0b2b50] text-white px-4 py-3 flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-0.5">Parcel Inspector</div>
                <div className="font-black font-serif text-lg">{selectedParcel.properties.ulpin_id}</div>
              </div>
              <button onClick={() => setSelectedParcel(null)} className="text-blue-200 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Ownership Status</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  selectedParcel.properties.ownership_status === 'clear' ? 'bg-emerald-100 text-emerald-700' :
                  selectedParcel.properties.ownership_status === 'disputed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedParcel.properties.ownership_status}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-500">Land Use</span>
                <span className="text-sm font-semibold text-slate-800">{selectedParcel.properties.land_use_type}</span>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500">Litigation Risk Score</span>
                  <span className="text-sm font-black text-[#c2410c]">{selectedParcel.properties.litigation_risk_score}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c2410c]" style={{ width: `${selectedParcel.properties.litigation_risk_score}%` }}></div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button 
                  onClick={() => setTimeMachineParcel(selectedParcel)}
                  className="w-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold text-xs py-2 rounded transition-colors shadow-sm"
                >
                  Open Encroachment Time Machine
                </button>
                <button 
                  onClick={() => alert(`Opening full title report for ${selectedParcel.properties.ulpin_id}`)}
                  className="w-full border border-[#0b2b50] text-[#0b2b50] hover:bg-[#0b2b50] hover:text-white font-bold text-xs py-2 rounded transition-colors"
                >
                  View Full Title Report
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encroachment Time Machine Modal */}
      <AnimatePresence>
        {timeMachineParcel && (
          <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-[#0b2b50] px-6 py-4 flex items-center justify-between text-white">
                <div>
                  <h2 className="font-black text-xl">Encroachment Time Machine</h2>
                  <p className="text-blue-200 text-xs">Historical Satellite/Mask Analysis for ULPIN: {timeMachineParcel.properties.ulpin_id}</p>
                </div>
                <button onClick={() => setTimeMachineParcel(null)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 bg-slate-50">
                <div className="aspect-[21/9] bg-slate-200 rounded-xl overflow-hidden relative border border-slate-300">
                  {/* Mock Satellite Imagery transition effect */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582298538104-a1fa55e81fcc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
                    <div 
                      className="absolute inset-0 bg-red-500 mix-blend-multiply transition-opacity duration-300"
                      style={{ opacity: (timePeriod - 2015) / 11 * 0.4 }}
                    />
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Detected Change</div>
                    <div className="text-lg font-black text-rose-600">
                      {Math.floor((timePeriod - 2015) / 11 * 42)}% Structural Expansion
                    </div>
                  </div>
                </div>

                <div className="mt-8 px-4">
                  <input 
                    type="range" 
                    min="2015" 
                    max="2026" 
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c2410c]"
                  />
                  <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                    <span>Jan 2015</span>
                    <span className="text-[#0b2b50] text-sm">Active: {timePeriod}</span>
                    <span>Dec 2026</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleItem({ id, label, active, onToggle }: { id: string, label: string, active: boolean, onToggle: (id: string) => void }) {
  return (
    <div onClick={() => onToggle(id)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
      <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${active ? 'bg-[#c2410c]' : 'bg-slate-300'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
  );
}
