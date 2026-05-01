import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeSentiment } from '../../services/nlp';

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_GOOGLE_CLOUD_API_KEY: 'test-api-key'
    }
  }
});

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('nlp service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-stub for each test because some might change it
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_GOOGLE_CLOUD_API_KEY: 'test-api-key'
        }
      }
    });
  });

  it('should return null if API key is missing', async () => {
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_GOOGLE_CLOUD_API_KEY: ''
        }
      }
    });
    const result = await analyzeSentiment('Hello');
    expect(result).toBeNull();
  });

  it('should return sentiment data on successful API call', async () => {
    const mockSentiment = { score: 0.8, magnitude: 0.9 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ documentSentiment: mockSentiment }),
    });

    const result = await analyzeSentiment('I love voting!');
    expect(result).toEqual(mockSentiment);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('language.googleapis.com'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('I love voting!')
      })
    );
  });

  it('should return null and handle errors on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await analyzeSentiment('Error case');
    expect(result).toBeNull();
  });

  it('should handle fetch exceptions gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await analyzeSentiment('Network error case');
    expect(result).toBeNull();
  });
});
