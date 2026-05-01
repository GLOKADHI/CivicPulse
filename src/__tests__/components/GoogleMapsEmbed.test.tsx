import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GoogleMapsEmbed from '../../components/GoogleMapsEmbed';
import React from 'react';

describe('GoogleMapsEmbed Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders iframe with correct query', () => {
    vi.stubEnv('VITE_GOOGLE_CLOUD_API_KEY', 'test-api-key');

    render(<GoogleMapsEmbed query="polling booths in Chennai" />);
    const iframe = screen.getByTitle(/Google Maps/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('polling%20booths%20in%20Chennai'));
  });

  it('renders placeholder if API key is missing', () => {
    vi.stubEnv('VITE_GOOGLE_CLOUD_API_KEY', '');

    render(<GoogleMapsEmbed query="Chennai" />);
    // Check for the error message in the fallback UI
    expect(screen.getByText(/Google Maps API key missing/i)).toBeInTheDocument();
  });
});
