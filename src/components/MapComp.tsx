import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Info, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

// Fix Leaflet icon issue using Custom SVG Markers for better visibility
const createCustomIcon = (color: string) => L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 rounded-full bg-${color}/20 animate-ping opacity-30"></div>
      <div class="w-6 h-6 rounded-full bg-black border-2 border-${color} flex items-center justify-center shadow-lg">
        <div class="w-2 h-2 rounded-full bg-${color} shadow-[0_0_8px_${color}]"></div>
      </div>
    </div>
  `,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Mock polling booths in India (sampled from Bangalore) with realistic, formal names
const MOCK_BOOTHS = [
    { id: 1, name: 'St. Mary’s Conv. School (Room 4)', lat: 12.9756, lng: 77.6067, address: 'Residency Rd, Shanthala Nagar, Bangalore' },
    { id: 2, name: 'Govt Model Primary School', lat: 12.9719, lng: 77.6412, address: 'Stage 2, Indiranagar, Bangalore' },
    { id: 3, name: 'V.V. Puram Arts & Science College', lat: 12.9279, lng: 77.6271, address: 'Koramangala 3rd Block, Bangalore' },
    { id: 4, name: 'Whitefield Global School', lat: 12.9698, lng: 77.7499, address: 'SH 35, Whitefield, Bangalore' },
    { id: 5, name: 'Jayanagar 4th Block Library', lat: 12.9292, lng: 77.5844, address: 'Near Bus Stand, Jayanagar, Bangalore' },
    { id: 6, name: 'HSR Layout Sector 2 Club House', lat: 12.9105, lng: 77.6450, address: '24th Main Rd, HSR Layout, Bangalore' },
    { id: 7, name: 'Malleswaram Heritage Post Office', lat: 12.9962, lng: 77.5714, address: '8th Cross, Malleswaram, Bangalore' },
];

const originIcon = createCustomIcon('blue-400');
const boothIcon = createCustomIcon('gold');

function MapCenterer({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

export default function MapComp() {
  const [userLocation, setUserLocation] = useState<[number, number]>([12.9716, 77.5946]); // Bangalore center
  const [selectedBooth, setSelectedBooth] = useState<typeof MOCK_BOOTHS[0] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-black/20 relative selection:bg-gold/30">
      <div className="p-[2.5rem] border-b border-white/5 bg-white/5 z-20 shadow-sm flex items-center justify-between shrink-0 backdrop-blur-3xl">
        <div>
          <h2 className="text-[0.6875rem] font-black text-gold uppercase tracking-[0.4em] flex items-center gap-[0.75rem]">
            <MapPin size={18} className="text-gold" />
            Tactical Polling Grid
          </h2>
          <p className="text-[0.5625rem] text-slate-500 font-black uppercase tracking-[0.3em] mt-[0.5rem] opacity-60">Satellite Guidance: LOCK-ON ENABLED</p>
        </div>
        <div className="flex items-center gap-[1rem] px-[1.25rem] py-[0.5rem] glass text-gold rounded-full text-[0.625rem] font-black border border-gold/20 uppercase tracking-[0.3em] shadow-lg shadow-gold/5">
          <Navigation size={14} fill="currentColor" className="animate-pulse shadow-[0_0_0.625rem_rgba(212,175,55,1)]" />
          Live Vector Relay
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {loading ? (
             <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-3xl">
                <div className="flex flex-col items-center gap-[2rem]">
                   <div className="w-[5rem] h-[5rem] rounded-full border-2 border-gold/10 border-t-gold animate-spin shadow-2xl shadow-gold/20" />
                   <p className="text-[0.6875rem] font-black text-gold uppercase tracking-[0.5em] animate-pulse">Syncing Orbital Latency...</p>
                </div>
             </div>
        ) : (
          <div className="h-full w-full grayscale contrast-125 brightness-90 opacity-80">
            <MapContainer 
              center={userLocation} 
              zoom={13} 
              className="h-full w-full z-10"
              style={{ minHeight: '25rem' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapCenterer coords={userLocation} />
              <Marker position={userLocation} icon={originIcon}>
                <Popup className="glass-popup font-sans">
                  <div className="font-bold text-slate-900 px-2 py-1">Current Node (Origin)</div>
                </Popup>
              </Marker>
              {MOCK_BOOTHS.map(booth => (
                <Marker 
                  key={booth.id} 
                  position={[booth.lat, booth.lng]}
                  icon={boothIcon}
                  eventHandlers={{
                    click: () => setSelectedBooth(booth),
                  }}
                >
                  <Popup className="glass-popup font-sans">
                    <div className="p-2 min-w-[150px]">
                      <p className="font-black text-[0.625rem] uppercase tracking-widest text-gold mb-1">{booth.name}</p>
                      <p className="text-[0.5625rem] text-slate-500 uppercase font-bold tracking-tight">{booth.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Selected Booth Info Card */}
        <div className="absolute bottom-[2.5rem] left-[2.5rem] right-[2.5rem] z-30 flex items-end justify-center pointer-events-none">
          <AnimatePresence>
            {selectedBooth && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="gold-glass p-[3rem] rounded-[3.5rem] border-gold/20 shadow-[0_0_6.25rem_rgba(212,175,55,0.1)] w-full max-w-[28rem] pointer-events-auto backdrop-blur-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[0.25rem] active-step" />
                <div className="flex justify-between items-start mb-[2rem]">
                   <div>
                      <h3 className="text-fluid-base font-black text-slate-100 uppercase tracking-tighter leading-none break-words line-clamp-2">{selectedBooth.name}</h3>
                      <p className="text-[0.625rem] text-slate-500 font-bold uppercase tracking-[0.2em] mt-[0.75rem] opacity-60 break-words">{selectedBooth.address}</p>
                   </div>
                   <button 
                    onClick={() => setSelectedBooth(null)}
                    className="w-[2.5rem] h-[2.5rem] flex items-center justify-center glass hover:active-step rounded-full text-slate-500 hover:text-white transition-all shadow-xl font-bold"
                   >
                     &times;
                   </button>
                </div>
                <div className="grid grid-cols-2 gap-[1.5rem] mb-[2.5rem]">
                   <div className="bg-gold/5 p-[1.5rem] rounded-[1.5rem] border border-gold/10 flex flex-col items-center">
                      <span className="text-[0.5rem] font-black text-gold/40 uppercase tracking-[0.4em] mb-[0.5rem]">Vector Latency</span>
                      <span className="text-[1.25rem] font-black text-gold uppercase tracking-tighter">15 MIN</span>
                   </div>
                   <div className="bg-emerald-500/5 p-[1.5rem] rounded-[1.5rem] border border-emerald-500/10 flex flex-col items-center">
                      <span className="text-[0.5rem] font-black text-emerald-500/40 uppercase tracking-[0.4em] mb-[0.5rem]">Target Integrity</span>
                      <span className="text-[1.25rem] font-black text-emerald-400 uppercase tracking-tighter">NOMINAL</span>
                   </div>
                </div>
                <button className="w-full active-step text-white py-[1.5rem] rounded-[1.75rem] text-[0.625rem] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-[1rem] shadow-2xl shadow-gold/30 border border-gold/40 hover:scale-[1.03] transition-all">
                  <Navigation size={20} className="fill-current" />
                  INITIALIZE NAVIGATION
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedBooth && !loading && (
            <div className="glass px-[2.5rem] py-[1.25rem] rounded-full border border-white/5 shadow-2xl text-[0.625rem] font-black uppercase tracking-[0.5em] text-slate-500 pointer-events-auto animate-bounce backdrop-blur-2xl">
              Interface with Orbital Node to View Intel
            </div>
          )}
        </div>
      </div>
      
      {/* Legend / Info Strip */}
      <div className="p-[1.5rem] bg-black/40 border-t border-white/5 flex items-center gap-[2.5rem] overflow-x-auto shrink-0 scrollbar-hide backdrop-blur-3xl">
          <div className="flex items-center gap-[1rem] shrink-0">
            <div className="w-[0.625rem] h-[0.625rem] rounded-full bg-gold shadow-[0_0_0.9375rem_rgba(212,175,55,1)]" />
            <span className="text-[0.625rem] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Node</span>
          </div>
          <div className="flex items-center gap-[1rem] shrink-0">
            <div className="w-[0.625rem] h-[0.625rem] rounded-full bg-indigo-500 shadow-[0_0_0.9375rem_rgba(99,102,241,1)]" />
            <span className="text-[0.625rem] font-black text-slate-500 uppercase tracking-[0.3em]">Relay Station</span>
          </div>
          <div className="flex items-center gap-[1rem] shrink-0">
            <div className="w-[0.625rem] h-[0.625rem] rounded-full bg-red-500 shadow-[0_0_0.9375rem_rgba(239,68,68,1)]" />
            <span className="text-[0.625rem] font-black text-slate-500 uppercase tracking-[0.3em]">Saturation Alert</span>
          </div>
          <div className="flex items-center gap-[0.75rem] ml-auto text-gold shrink-0 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
            <Info size={14} />
            <span className="text-[0.5625rem] font-black uppercase tracking-[0.5em]">Protocol Manifest</span>
          </div>
      </div>
    </div>
  );
}
