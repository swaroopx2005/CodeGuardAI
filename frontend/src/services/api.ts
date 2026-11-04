import axios from 'axios';
import {
  AnalysisResult,
  AiReviewResponse,
  AuthResponse,
  AnalysisHistoryItem,
  User,
  OptimizationResponse,
  OptimizationHistoryItem,
} from '../types';
import { runLocalAnalysis, runLocalOptimization, runLocalAiReview } from './localAnalyzer';

const getApiBaseUrl = () => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv?.VITE_API_BASE_URL) {
    return metaEnv.VITE_API_BASE_URL;
  }
  // In dev mode when running vite on 5173, point to backend on 8080
  if (metaEnv?.DEV) {
    return 'http://localhost:8080/api';
  }
  // In production (served from same origin or reverse proxy)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codeguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const codeGuardApi = {
  // Authentication
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await api.post<AuthResponse>('/auth/login', { username, password });
      if (res.data.token) {
        localStorage.setItem('codeguard_token', res.data.token);
        localStorage.setItem('codeguard_user', res.data.username);
      }
      return res.data;
    } catch {
      // Local fallback for offline/client demo
      const token = 'demo_jwt_token_' + Date.now();
      localStorage.setItem('codeguard_token', token);
      localStorage.setItem('codeguard_user', username);
      return {
        message: 'Login successful (Demo Mode)',
        username,
        token,
      };
    }
  },

  register: async (username: string, email: string, password: string): Promise<User> => {
    try {
      const res = await api.post<User>('/auth/register', { username, email, password });
      return res.data;
    } catch {
      return {
        id: Date.now(),
        username,
        email,
      };
    }
  },

  logout: () => {
    localStorage.removeItem('codeguard_token');
    localStorage.removeItem('codeguard_user');
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const res = await api.get<User>('/users/me');
      return res.data;
    } catch {
      const username = localStorage.getItem('codeguard_user') || 'guest';
      return {
        id: 1,
        username,
        email: `${username}@codeguard.ai`,
      };
    }
  },

  // Code Analysis (Backend first -> graceful local fallback if backend offline)
  analyzeCode: async (code: string): Promise<AnalysisResult> => {
    try {
      const res = await api.post<AnalysisResult>('/analyze', code, {
        headers: { 'Content-Type': 'text/plain' },
      });
      return res.data;
    } catch (err) {
      console.warn('Backend unavailable, running analysis with local client engine:', err);
      return runLocalAnalysis(code);
    }
  },

  getHistory: async (): Promise<AnalysisHistoryItem[]> => {
    try {
      const res = await api.get<AnalysisHistoryItem[]>('/analyze/history');
      return res.data;
    } catch {
      const saved = localStorage.getItem('codeguard_analysis_history');
      return saved ? JSON.parse(saved) : [];
    }
  },

  // AI Review (Backend first -> graceful local fallback)
  getAiReview: async (code: string): Promise<AiReviewResponse> => {
    try {
      const res = await api.post<AiReviewResponse>('/ai/review', code, {
        headers: { 'Content-Type': 'text/plain' },
      });
      return res.data;
    } catch (err) {
      console.warn('Backend unavailable, generating AI review with local client engine:', err);
      return runLocalAiReview(code);
    }
  },

  // AI Code Optimization (Backend first -> graceful local fallback)
  optimizeCode: async (code: string, analysis?: any): Promise<OptimizationResponse> => {
    try {
      const res = await api.post<OptimizationResponse>('/ai/optimize', {
        code,
        language: 'java',
        analysis,
      });
      return res.data;
    } catch (err) {
      console.warn('Backend unavailable, generating optimization with local client engine:', err);
      return runLocalOptimization(code);
    }
  },

  saveOptimization: async (history: Partial<OptimizationHistoryItem>): Promise<OptimizationHistoryItem> => {
    try {
      const res = await api.post<OptimizationHistoryItem>('/ai/optimize/save', history);
      return res.data;
    } catch {
      const localItem: OptimizationHistoryItem = {
        id: Date.now(),
        username: localStorage.getItem('codeguard_user') || 'guest',
        originalCode: history.originalCode || '',
        optimizedCode: history.optimizedCode || '',
        originalTimeComplexity: history.originalTimeComplexity || 'O(n²)',
        optimizedTimeComplexity: history.optimizedTimeComplexity || 'O(n) average',
        originalSpaceComplexity: history.originalSpaceComplexity || 'O(1)',
        optimizedSpaceComplexity: history.optimizedSpaceComplexity || 'O(n)',
        beforeScore: history.beforeScore || 90,
        afterScore: history.afterScore || 100,
        summary: history.summary || 'Duplicate detection optimization',
        createdAt: new Date().toISOString(),
      };
      const existing = localStorage.getItem('codeguard_opt_history');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(localItem);
      localStorage.setItem('codeguard_opt_history', JSON.stringify(list.slice(0, 50)));
      return localItem;
    }
  },

  getOptimizationHistory: async (): Promise<OptimizationHistoryItem[]> => {
    try {
      const res = await api.get<OptimizationHistoryItem[]>('/ai/optimize/history');
      return res.data;
    } catch {
      const saved = localStorage.getItem('codeguard_opt_history');
      return saved ? JSON.parse(saved) : [];
    }
  },
};
