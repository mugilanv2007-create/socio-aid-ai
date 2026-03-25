import React, { createContext, useContext, useState, useCallback } from 'react';
import { RationCard, SchemeRecommendation, Notification, FamilyMember } from '../data/types';
import { generateRecommendations, calculateHealthScore } from '../utils/recommendationEngine';

interface AppContextType {
  isAuthenticated: boolean;
  rationCard: RationCard | null;
  recommendations: SchemeRecommendation[];
  savedSchemes: string[];
  notifications: Notification[];
  healthScore: number;
  allMembersVerified: boolean;
  login: (card: RationCard) => void;
  logout: () => void;
  verifyMemberAadhaar: (memberId: string) => void;
  updateMember: (memberId: string, data: Partial<FamilyMember>) => void;
  toggleSaveScheme: (schemeId: string) => void;
  refreshRecommendations: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rationCard, setRationCard] = useState<RationCard | null>(null);
  const [recommendations, setRecommendations] = useState<SchemeRecommendation[]>([]);
  const [savedSchemes, setSavedSchemes] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const allMembersVerified = rationCard?.members.every(m => m.aadhaarVerified) ?? false;

  const login = useCallback((card: RationCard) => {
    setRationCard(card);
    setIsAuthenticated(true);
    setHealthScore(calculateHealthScore(card.members));
    const recs = generateRecommendations(card);
    setRecommendations(recs);
    setNotifications([
      {
        id: '1',
        title: 'Welcome!',
        message: `Welcome ${card.headOfFamily}! ${recs.length} schemes found for your family.`,
        type: 'success',
        timestamp: new Date(),
        read: false,
      },
      {
        id: '2',
        title: 'New Scheme Available',
        message: 'PM Kisan Samman Nidhi installment is now open for registration.',
        type: 'info',
        timestamp: new Date(),
        read: false,
      },
      {
        id: '3',
        title: 'Verify Aadhaar',
        message: 'Please verify Aadhaar for all family members to see personalized recommendations.',
        type: 'warning',
        timestamp: new Date(),
        read: false,
      },
    ]);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setRationCard(null);
    setRecommendations([]);
    setSavedSchemes([]);
    setNotifications([]);
    setHealthScore(0);
  }, []);

  const verifyMemberAadhaar = useCallback((memberId: string) => {
    setRationCard(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        members: prev.members.map(m =>
          m.id === memberId ? { ...m, aadhaarVerified: true } : m
        ),
      };
      // Regenerate recommendations
      const recs = generateRecommendations(updated);
      setRecommendations(recs);
      setHealthScore(calculateHealthScore(updated.members));
      return updated;
    });
  }, []);

  const updateMember = useCallback((memberId: string, data: Partial<FamilyMember>) => {
    setRationCard(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        members: prev.members.map(m =>
          m.id === memberId ? { ...m, ...data } : m
        ),
      };
      const recs = generateRecommendations(updated);
      setRecommendations(recs);
      setHealthScore(calculateHealthScore(updated.members));
      return updated;
    });
  }, []);

  const toggleSaveScheme = useCallback((schemeId: string) => {
    setSavedSchemes(prev =>
      prev.includes(schemeId) ? prev.filter(s => s !== schemeId) : [...prev, schemeId]
    );
  }, []);

  const refreshRecommendations = useCallback(() => {
    if (rationCard) {
      const recs = generateRecommendations(rationCard);
      setRecommendations(recs);
    }
  }, [rationCard]);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [
      { ...n, id: Date.now().toString(), timestamp: new Date(), read: false },
      ...prev,
    ]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated, rationCard, recommendations, savedSchemes,
        notifications, healthScore, allMembersVerified, login, logout,
        verifyMemberAadhaar, updateMember, toggleSaveScheme,
        refreshRecommendations, addNotification, markNotificationRead,
        searchQuery, setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
