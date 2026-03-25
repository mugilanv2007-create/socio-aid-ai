import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const FAQ: Record<string, string> = {
  'pmay': 'PMAY (Pradhan Mantri Awas Yojana) provides up to ₹2.67 lakh subsidy for house construction. Eligible for BPL families with annual income below ₹3 lakh.',
  'scholarship': 'National Scholarship Portal offers ₹5,000-₹50,000/year for SC/ST/OBC students. Apply at scholarships.gov.in.',
  'farmer': 'Farmers can benefit from PM-KISAN (₹6,000/year), KCC (credit at 4%), and Fasal Bima (crop insurance). Contact your local agriculture office.',
  'health': 'Ayushman Bharat provides ₹5 lakh health cover. Free treatment available at government hospitals under National Health Mission.',
  'pension': 'Senior citizens (60+) from BPL families can get ₹200-₹500/month under IGNOAPS. Atal Pension Yojana for workers 18-40 years.',
  'business': 'MUDRA loans up to ₹10 lakh without collateral. Stand Up India for SC/ST/women entrepreneurs (₹10L-₹1Cr).',
  'women': 'Women can benefit from Ujjwala (free LPG), Ladli Behna (₹1,000/month), Sukanya Samriddhi (7.6% interest for girl child).',
  'document': 'Most schemes require: Aadhaar Card, Ration Card, Income Certificate, Bank Passbook, and Passport Photos. Some need Caste Certificate.',
  'apply': 'You can apply through: 1) Local Panchayat/Municipality, 2) Common Service Centres (CSC), 3) Online portals, 4) Bank branches.',
  'hello': 'Hello! I can help you with government scheme information. Ask me about education, health, farming, business, or pension schemes!',
  'hi': 'Hi! I\'m your AI Scheme Assistant. Ask me anything about government schemes, eligibility, or how to apply!',
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, value] of Object.entries(FAQ)) {
    if (lower.includes(key)) return value;
  }
  if (lower.includes('eligib')) return 'Eligibility depends on income, caste, age, and occupation. Check the dashboard for your personalized eligibility scores.';
  if (lower.includes('how') && lower.includes('apply')) return FAQ['apply'];
  if (lower.includes('income')) return 'Most BPL schemes require annual income below ₹2-3 lakh. Check each scheme for specific income limits.';
  if (lower.includes('thank')) return 'You\'re welcome! Feel free to ask more questions about government schemes.';
  return 'I can help with information about government schemes. Try asking about: education scholarships, health schemes, farmer benefits, business loans, women welfare, or pension schemes.';
}

export default function ChatbotPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello! I\'m your AI Scheme Assistant. 🤖\n\nI can help you with:\n• Scheme information & eligibility\n• How to apply\n• Required documents\n• Benefits comparison\n\nWhat would you like to know?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getResponse(userMsg) }]);
    }, 500);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 right-4 w-80 sm:w-96 h-[500px] bg-card rounded-xl shadow-2xl border flex flex-col z-50 overflow-hidden"
    >
      <div className="gradient-primary p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Bot className="w-5 h-5" />
          <span className="font-semibold text-sm">AI Scheme Assistant</span>
        </div>
        <button onClick={onClose} className="text-primary-foreground/70 hover:text-primary-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs whitespace-pre-line
              ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
              {m.text}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-secondary" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>

      <div className="p-2 border-t flex gap-2">
        <Input
          placeholder="Ask about schemes..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="text-sm h-9"
        />
        <Button size="icon" onClick={send} className="gradient-primary text-primary-foreground h-9 w-9 shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
