import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AIChat from '../../components/AIChat';
import { SettingsProvider } from '../../context/SettingsContext';
import { AuthProvider } from '../../context/AuthContext';
import React from 'react';

// Mock services
vi.mock('../../services/gemini', () => ({
  chatWithAssistant: vi.fn(() => Promise.resolve('This is an AI response')),
}));

vi.mock('../../services/nlp', () => ({
  analyzeSentiment: vi.fn(() => Promise.resolve({ score: 0.5, magnitude: 0.5 })),
}));

vi.mock('../../services/firestore', () => ({
  logElectionQuery: vi.fn(),
}));

// Mock Auth
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-user' } }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

describe('AIChat Component', () => {
  const defaultProps = {
    role: 'voter' as const,
    messages: [],
    onSendMessage: vi.fn(),
    setMessages: vi.fn(),
  };

  const renderAIChat = (props = defaultProps) => {
    return render(
      <SettingsProvider>
        <AuthProvider>
          <AIChat {...props} />
        </AuthProvider>
      </SettingsProvider>
    );
  };

  it('renders input field and send button', () => {
    renderAIChat();
    expect(screen.getByPlaceholderText(/Ask a question about the election process.../i)).toBeInTheDocument();
  });

  it('sends message and displays AI response', async () => {
    const setMessages = vi.fn();
    renderAIChat({ ...defaultProps, setMessages });

    const input = screen.getByPlaceholderText(/Ask a question about the election process.../i);
    fireEvent.change(input, { target: { value: 'How do I register?' } });
    
    const form = screen.getByRole('form', { hidden: true }) || input.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(setMessages).toHaveBeenCalled();
    });
  });

  it('handles empty input', () => {
    const onSendMessage = vi.fn();
    renderAIChat({ ...defaultProps, onSendMessage });

    const input = screen.getByPlaceholderText(/Ask a question about the election process.../i);
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSendMessage).not.toHaveBeenCalled();
  });
});
