import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Search, Bell, LogOut,
  Filter, ArrowUpDown, Mic, MessageCircle,
  GraduationCap, HeartPulse, Briefcase, Baby,
  UserRound, Home, Wheat, Hammer, ShieldCheck, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { SchemeCategory, SchemeRecommendation } from '@/data/types';
import SchemeCard from '@/components/SchemeCard';
import DashboardStats from '@/components/DashboardStats';
import SchemeDetailModal from '@/components/SchemeDetailModal';
import SchemeCompareModal from '@/components/SchemeCompareModal';
import ChatbotPanel from '@/components/ChatbotPanel';
import NotificationsPanel from '@/components/NotificationsPanel';

const categoryFilters: { value: SchemeCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
  { value: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { value: 'health', label: 'Health', icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { value: 'business', label: 'Business', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { value: 'women_child', label: 'Women & Child', icon: <Baby className="w-3.5 h-3.5" /> },
  { value: 'senior_citizen', label: 'Senior', icon: <UserRound className="w-3.5 h-3.5" /> },
  { value: 'housing', label: 'Housing', icon: <Home className="w-3.5 h-3.5" /> },
  { value: 'agriculture', label: 'Agriculture', icon: <Wheat className="w-3.5 h-3.5" /> },
  { value: 'employment', label: 'Employment', icon: <Hammer className="w-3.5 h-3.5" /> },
  { value: 'welfare', label: 'Welfare', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
];

export default function DashboardPage() {
  const {
    rationCard, recommendations, savedSchemes, toggleSaveScheme,
    healthScore, notifications, logout, searchQuery, setSearchQuery,
  } = useAppContext();

  const [activeFilter, setActiveFilter] = useState<SchemeCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'score'>('rank');
  const [selectedScheme, setSelectedScheme] = useState<SchemeRecommendation | null>(null);
  const [compareSchemes, setCompareSchemes] = useState<SchemeRecommendation[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredSchemes = useMemo(() => {
    let result = recommendations;
    if (activeFilter !== 'all') {
      result = result.filter(r => r.scheme.category === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.scheme.name.toLowerCase().includes(q) ||
        r.scheme.description.toLowerCase().includes(q) ||
        r.scheme.category.includes(q)
      );
    }
    if (sortBy === 'score') {
      result = [...result].sort((a, b) => b.eligibilityScore - a.eligibilityScore);
    }
    return result;
  }, [recommendations, activeFilter, searchQuery, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: recommendations.length };
    recommendations.forEach(r => {
      counts[r.scheme.category] = (counts[r.scheme.category] || 0) + 1;
    });
    return counts;
  }, [recommendations]);

  if (!rationCard) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Ticker */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 overflow-hidden">
        <div className="ticker-scroll whitespace-nowrap">
          🔔 New: PM-KISAN 17th installment registration open • 📢 Ayushman Bharat cards now available at CSC centres • 🆕 Skill India 4.0 launched with new courses • ⚡ PMAY Urban deadline extended to March 2026
        </div>
      </div>

      {/* Header */}
      <header className="gradient-hero px-4 py-5 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-primary-foreground text-lg leading-tight">Dashboard</h1>
                <p className="text-primary-foreground/60 text-xs">Welcome, {rationCard.headOfFamily}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowNotifications(true)}
                className="relative text-primary-foreground hover:bg-primary-foreground/10 w-9 h-9"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={logout}
                className="text-primary-foreground hover:bg-primary-foreground/10 w-9 h-9"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 -mt-5 pb-24">
        {/* Stats */}
        <DashboardStats
          schemesCount={recommendations.length}
          healthScore={healthScore}
          membersCount={rationCard.members.length}
          savedCount={savedSchemes.length}
        />

        {/* Search + Sort */}
        <div className="mt-5 flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by scheme name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-card border shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSortBy(s => s === 'rank' ? 'score' : 'rank')}
            className="gap-1.5 h-10 rounded-xl px-4"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">{sortBy === 'rank' ? 'By Rank' : 'By Score'}</span>
          </Button>
        </div>

        {/* Category filter pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categoryFilters.map(f => {
            const count = categoryCounts[f.value] || 0;
            const isActive = activeFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border
                  ${isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                  }`}
              >
                {f.icon}
                {f.label}
                {count > 0 && (
                  <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold
                    ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Compare bar */}
        {compareSchemes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-foreground">
              {compareSchemes.length} scheme{compareSchemes.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setCompareSchemes([])} className="rounded-lg text-xs h-8">
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setShowCompare(true)}
                disabled={compareSchemes.length < 2}
                className="rounded-lg text-xs h-8 gradient-primary text-primary-foreground"
              >
                Compare ({compareSchemes.length}/3)
              </Button>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <div className="mt-4 mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredSchemes.length}</span> scheme{filteredSchemes.length !== 1 ? 's' : ''}
            {activeFilter !== 'all' && (
              <span className="ml-1">
                in <span className="text-primary font-medium">{activeFilter.replace('_', ' ')}</span>
              </span>
            )}
          </p>
        </div>

        {/* Scheme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchemes.map((rec, i) => (
            <SchemeCard
              key={rec.scheme.id}
              rec={rec}
              index={i}
              saved={savedSchemes.includes(rec.scheme.id)}
              onSave={() => toggleSaveScheme(rec.scheme.id)}
              onSelect={() => setSelectedScheme(rec)}
              onCompare={() => {
                setCompareSchemes(prev =>
                  prev.find(s => s.scheme.id === rec.scheme.id)
                    ? prev.filter(s => s.scheme.id !== rec.scheme.id)
                    : prev.length < 3 ? [...prev, rec] : prev
                );
              }}
              isComparing={!!compareSchemes.find(s => s.scheme.id === rec.scheme.id)}
            />
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Filter className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-foreground mb-1">No schemes found</p>
            <p className="text-sm">Try a different filter or search term</p>
          </div>
        )}
      </main>

      {/* FAB buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <Button
          size="icon"
          onClick={() => setShowVoice(!showVoice)}
          className="rounded-full w-12 h-12 gradient-success shadow-lg hover:shadow-xl transition-shadow"
        >
          <Mic className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          onClick={() => setShowChat(!showChat)}
          className="rounded-full w-14 h-14 gradient-primary shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Voice modal */}
      {showVoice && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setShowVoice(false)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl p-6 max-w-sm w-full text-center shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-10 h-10 text-primary pulse-dot" />
            </div>
            <h3 className="font-bold text-lg mb-1">Voice Assistant</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ask about any government scheme in your language
            </p>
            <div className="bg-muted rounded-xl p-3 text-sm text-muted-foreground mb-4">
              Try: "What schemes are available for farmers?"
            </div>
            <Button onClick={() => { setShowVoice(false); setShowChat(true); }} className="gradient-primary text-primary-foreground w-full rounded-xl">
              Open Chatbot Instead
            </Button>
          </motion.div>
        </div>
      )}

      {/* Modals */}
      {selectedScheme && <SchemeDetailModal rec={selectedScheme} onClose={() => setSelectedScheme(null)} />}
      {showCompare && compareSchemes.length >= 2 && <SchemeCompareModal schemes={compareSchemes} onClose={() => setShowCompare(false)} />}
      {showChat && <ChatbotPanel onClose={() => setShowChat(false)} />}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
    </div>
  );
}
