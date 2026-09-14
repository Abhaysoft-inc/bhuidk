import { MapPin } from "lucide-react";

export default function GisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Geospatial GIS Suite</h1>
        <p className="text-xs text-slate-500 mt-0.5">Satellite imagery, cadastral maps, and spatial analytics</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <MapPin className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold text-slate-800 mt-4">GIS Viewer</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Explore integrated layers from ISRO Bhuvan, Survey of India, and state land records with real-time spatial analysis.</p>
        <button type="button" className="mt-4 bg-[#0b2b50] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#164275] cursor-pointer transition-colors">
          Launch GIS Viewer
        </button>
      </div>
    </div>
  );
}
