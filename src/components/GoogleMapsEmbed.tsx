import React from 'react';

interface GoogleMapsEmbedProps {
  query: string;
}

export default function GoogleMapsEmbed({ query }: GoogleMapsEmbedProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center glass rounded-[2rem] text-slate-500 font-bold uppercase tracking-widest text-[0.625rem] border border-white/5">
        Google Maps API Key Missing
      </div>
    );
  }

  const encodedQuery = encodeURIComponent(query);
  const src = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodedQuery}`;

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
      <iframe
        title="Google Maps"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
      ></iframe>
    </div>
  );
}
