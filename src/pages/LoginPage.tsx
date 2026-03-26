import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { rationCardDatabase } from '@/data/rationCardData';

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

type Step = 'ration' | 'otp' | 'verified';

export default function LoginPage() {
  const { login } = useAppContext();
  const [step, setStep] = useState<Step>('ration');
  const [rationNumber, setRationNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [mobileHint, setMobileHint] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleRationSubmit = () => {
    setError('');
    const card = rationCardDatabase[rationNumber.trim()];
    if (!card) {
      setError('Ration card not found. Try: TN-RC-2024-001, TN-RC-2024-002, or TN-RC-2024-003');
      return;
    }
    const mobile = card.mobileNumber;
    setMobileHint(`${mobile.slice(0, 2)}****${mobile.slice(-4)}`);
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setStep('otp');
  };

  const handleOtpSubmit = () => {
    setError('');
    const card = rationCardDatabase[rationNumber.trim()];
    if (!card) return;
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please enter the OTP shown below.');
      return;
    }
    setStep('verified');
    setTimeout(() => login(card), 1200);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="w-10 h-10 text-secondary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-primary-foreground font-heading">
            AI Scheme Recommender
          </h1>
          <p className="text-primary-foreground/70 mt-1 text-sm">
            Right schemes for the right family
          </p>
        </div>

        {/* Login Card */}
        <div className="card-gov p-6 rounded-xl">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {['ration', 'otp', 'verified'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${step === s || ['otp', 'verified'].indexOf(step) >= i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'}`}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-0.5 ${['otp', 'verified'].indexOf(step) > i ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {step === 'ration' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Enter Ration Card Number</h2>
              </div>
              <Input
                placeholder="e.g., TN-RC-2024-001"
                value={rationNumber}
                onChange={(e) => setRationNumber(e.target.value)}
                className="mb-3"
              />
              {error && <p className="text-destructive text-sm mb-3">{error}</p>}
              <Button onClick={handleRationSubmit} className="w-full gradient-primary text-primary-foreground">
                Verify Ration Card <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Demo cards: TN-RC-2024-001, TN-RC-2024-002, TN-RC-2024-003
              </p>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">OTP Verification</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                OTP sent to {mobileHint}
              </p>
              <Input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="mb-3 text-center tracking-widest text-lg"
              />
              {error && <p className="text-destructive text-sm mb-3">{error}</p>}
              <Button onClick={handleOtpSubmit} className="w-full gradient-primary text-primary-foreground">
                Verify OTP <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="mt-3 p-3 bg-accent/10 border border-accent/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Generated OTP (sent to {mobileHint})</p>
                <p className="text-lg font-bold tracking-widest text-accent font-mono">{generatedOtp}</p>
              </div>
            </motion.div>
          )}

          {step === 'verified' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-3" />
              <h2 className="font-bold text-lg text-foreground">Verified Successfully!</h2>
              <p className="text-sm text-muted-foreground">Loading your family data...</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
