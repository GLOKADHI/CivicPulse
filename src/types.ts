import { UserRole, ElectionPhase } from './constants/election';

export interface AssistantEvent {
  id: string;
  type: 'phase_change' | 'action_success' | 'action_error' | 'ai_recommendation' | 'conflict' | 'system_init' | 'user_input';
  payload: any;
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  type?: 'standard' | 'guidance' | 'alert' | 'success';
}
