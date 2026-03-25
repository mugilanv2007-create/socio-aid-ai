import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Search, Bell, LogOut, Heart, Users, Star,
  Filter, BookmarkCheck, ArrowUpDown, ChevronRight, Bookmark,
  Activity, TrendingUp, Mic, MessageCircle, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { SchemeCategory, SchemeRecommendation } from '@/data/types';
import { getCategoryIcon, getCategoryLabel } from '@/utils/recommendationEngine';
import SchemeDetailModal from '@/components/SchemeDetailModal';
import SchemeCompareModal from '@/components/SchemeCompareModal';
import ChatbotPanel from '@/components/ChatbotPanel';
import NotificationsPanel from '@/components/NotificationsPanel';

const categoryFilters: { value: SchemeCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Schemes' },
  { value: 'education', label: '📚 Education' },
  { value: 'health', label: '🏥 Health' },
  { value: 'business', label: '💼 Business' },
  { value: 'women_child', label: '👩‍👧 Women & Child' },
  { value: 'senior_citizen', label: '👴 Senior' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'agriculture', label: '🌾 Agriculture' },
  { value: 'employment', label: '💪 Employment' },
  { value: 'welfare', label: '🛡️ Welfare' },
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
      <div className="gradient-hero px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              <h1 className="font-bold text-primary-foreground font-heading">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowNotifications(true)}
                className="relative text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-secondary-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={logout}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <StatCard icon={<Star className="w-4 h-4" />} label="Schemes Found" value={recommendations.length.toString()} />
            <StatCard icon={<Heart className="w-4 h-4" />} label="Health Score" value={`${healthScore}%`} color={healthScore > 70 ? 'text-accent' : healthScore > 40 ? 'text-secondary' : 'text-destructive'} />
            <StatCard icon={<Users className="w-4 h-4" />} label="Members" value={rationCard.members.length.toString()} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-5xl mx-auto px-4 -mt-3">
        <div className="card-gov p-3 rounded-xl">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSortBy(s => s === 'rank' ? 'score' : 'rank')}
              className="gap-1 text-xs"
            >
              <ArrowUpDown className="w-3 h-3" />
              {sortBy === 'rank' ? 'Rank' : 'Score'}
            </Button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {categoryFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors font-medium
                  ${activeFilter === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compare bar */}
      {compareSchemes.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-3">
          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              {compareSchemes.length} scheme(s) selected for comparison
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setCompareSchemes([])}>Clear</Button>
              <Button
                size="sm"
                onClick={() => setShowCompare(true)}
                disabled={compareSchemes.length < 2}
                className="gradient-accent text-secondary-foreground"
              >
                Compare
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scheme cards */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <div className="text-center py-12 text-muted-foreground">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No schemes found</p>
            <p className="text-sm">Try a different filter or search term</p>
          </div>
        )}
      </div>

      {/* FAB buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-40">
        <Button
          size="icon"
          onClick={() => setShowVoice(!showVoice)}
          className="rounded-full w-12 h-12 gradient-success shadow-lg"
        >
          <Mic className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          onClick={() => setShowChat(!showChat)}
          className="rounded-full w-14 h-14 gradient-primary shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Voice assist modal */}
      {showVoice && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setShowVoice(false)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl p-6 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-10 h-10 text-primary pulse-dot" />
            </div>
            <h3 className="font-bold text-lg mb-1">Voice Assistant</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ask about any government scheme in your language
            </p>
            <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground mb-4">
              Try: "What schemes are available for farmers?" or "Tell me about education scholarships"
            </div>
            <p className="text-xs text-muted-foreground italic">
              🎤 Voice recognition simulation - type your question in the chatbot instead
            </p>
            <Button onClick={() => { setShowVoice(false); setShowChat(true); }} className="mt-3 gradient-primary text-primary-foreground">
              Open Chatbot Instead
            </Button>
          </motion.div>
        </div>
      )}

      {/* Modals */}
      {selectedScheme && (
        <SchemeDetailModal rec={selectedScheme} onClose={() => setSelectedScheme(null)} />
      )}
      {showCompare && compareSchemes.length >= 2 && (
        <SchemeCompareModal schemes={compareSchemes} onClose={() => setShowCompare(false)} />
      )}
      {showChat && <ChatbotPanel onClose={() => setShowChat(false)} />}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-3 text-center">
      <div className="flex items-center justify-center text-primary-foreground/70 mb-1">{icon}</div>
      <div className={`text-xl font-bold ${color || 'text-primary-foreground'}`}>{value}</div>
      <div className="text-[10px] text-primary-foreground/60">{label}</div>
    </div>
  );
}

function SchemeCard({
  rec, index, saved, onSave, onSelect, onCompare, isComparing,
}: {
  rec: SchemeRecommendation;
  index: number;
  saved: boolean;
  onSave: () => void;
  onSelect: () => void;
  onCompare: () => void;
  isComparing: boolean;
}) {
  const scoreColor = rec.eligibilityScore >= 80 ? 'text-accent' : rec.eligibilityScore >= 60 ? 'text-secondary' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-gov p-4 cursor-pointer group"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(rec.scheme.category)}</span>
          <Badge variant="secondary" className="text-[10px]">
            #{rec.priorityRank}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {getCategoryLabel(rec.scheme.category)}
          </Badge>
        </div>
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={onCompare}
            className={`p-1.5 rounded-md transition-colors ${isComparing ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onSave}
            className={`p-1.5 rounded-md transition-colors ${saved ? 'text-secondary' : 'hover:bg-muted text-muted-foreground'}`}
          >
            {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
        {rec.scheme.name}
      </h3>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{rec.scheme.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`text-sm font-bold ${scoreColor}`}>
            {rec.eligibilityScore}% match
          </div>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${rec.eligibilityScore >= 80 ? 'gradient-success' : rec.eligibilityScore >= 60 ? 'gradient-accent' : 'bg-muted-foreground'}`}
              style={{ width: `${rec.eligibilityScore}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          {rec.memberMatch.length} eligible
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}
