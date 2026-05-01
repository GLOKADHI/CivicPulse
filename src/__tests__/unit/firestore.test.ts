import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logUserJourney, logElectionQuery } from '../../services/firestore';
import { addDoc, collection } from 'firebase/firestore';

// Mock Firebase module
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

// Mock the internal config state
vi.mock('../../lib/firebase', () => ({
  db: { app: {} },
}));

// Mock import.meta.env globally for Vitest
// Note: In Vitest, you can use vi.stubEnv for VITE_ variables
vi.stubEnv('VITE_FIREBASE_API_KEY', 'valid-test-key');

describe('firestore service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call addDoc with correct data for logUserJourney', async () => {
    await logUserJourney('user-123', 'voter', 'identity', 'login');
    
    expect(addDoc).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'journeys');
  });

  it('should call addDoc with correct data for logElectionQuery', async () => {
    await logElectionQuery('user-123', 'How do I vote?', { score: 0.5 });
    
    expect(addDoc).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'queries');
  });
});
