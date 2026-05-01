import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App';
import { SettingsProvider } from '../../context/SettingsContext';
import { AuthProvider } from '../../context/AuthContext';
import React from 'react';

// Mock Firebase
vi.mock('../../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((cb) => { cb(null); return () => {}; }),
    currentUser: null,
  },
  db: {},
  googleProvider: {},
  isConfigValid: true,
  logAnalyticsEvent: vi.fn(),
}));

// Mock services
vi.mock('../../services/firestore', () => ({
  logUserJourney: vi.fn(),
  logElectionQuery: vi.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderApp = () => {
    return render(
      <SettingsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SettingsProvider>
    );
  };

  it('renders landing page with role selection', () => {
    renderApp();
    expect(screen.getByText(/ELECTION INTELLIGENCE HUB/i)).toBeInTheDocument();
    expect(screen.getByText(/I AM A VOTER/i)).toBeInTheDocument();
    expect(screen.getByText(/I AM A CANDIDATE/i)).toBeInTheDocument();
    expect(screen.getByText(/I AM A VOLUNTEER/i)).toBeInTheDocument();
  });

  it('switches to Voter dashboard when Voter role is selected', async () => {
    renderApp();
    const voterCard = screen.getByText(/I AM A VOTER/i);
    fireEvent.click(voterCard);
    
    await waitFor(() => {
      expect(screen.getByText(/VOTER ASSISTANT/i)).toBeInTheDocument();
    });
  });

  it('switches to Candidate dashboard when Candidate role is selected', async () => {
    renderApp();
    const candidateCard = screen.getByText(/I AM A CANDIDATE/i);
    fireEvent.click(candidateCard);
    
    await waitFor(() => {
      expect(screen.getByText(/CANDIDATE ASSISTANT/i)).toBeInTheDocument();
    });
  });

  it('returns to home when clicking back button in dashboard', async () => {
    renderApp();
    fireEvent.click(screen.getByText(/I AM A VOTER/i));
    
    const backButton = screen.getByTitle(/Return to Identity Phase/i);
    fireEvent.click(backButton);
    
    await waitFor(() => {
      expect(screen.getByText(/ELECTION INTELLIGENCE HUB/i)).toBeInTheDocument();
    });
  });
});
