import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import LoginPage from './LoginPage';
import FamilyDataPage from './FamilyDataPage';
import DashboardPage from './DashboardPage';

type AppStep = 'login' | 'family' | 'dashboard';

export default function Index() {
  const { isAuthenticated } = useAppContext();
  const [step, setStep] = useState<AppStep>('login');

  if (!isAuthenticated) return <LoginPage />;
  if (step === 'login') setStep('family');
  if (step === 'family') return <FamilyDataPage onComplete={() => setStep('dashboard')} />;
  return <DashboardPage />;
}
