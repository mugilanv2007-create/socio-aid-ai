import { motion } from 'framer-motion';
import {
  BookmarkCheck, Bookmark, ArrowUpDown, ChevronRight, Users,
  GraduationCap, HeartPulse, Briefcase, Baby, UserRound, Home,
  Wheat, Hammer, ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SchemeRecommendation, SchemeCategory } from '@/data/types';

const categoryConfig: Record<SchemeCategory, { icon: React.ReactNode; gradient: string; bg: string }> = {
  education: { icon: <GraduationCap className="w-5 h-5" />, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  health: { icon: <HeartPulse className="w-5 h-5" />, gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  business: { icon: <Briefcase className="w-5 h-5" />, gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  women_child: { icon: <Baby className="w-5 h-5" />, gradient: 'from-purple-500 to-fuchsia-600', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  senior_citizen: { icon: <UserRound className="w-5 h-5" />, gradient: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  housing: { icon: <Home className="w-5 h-5" />, gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  agriculture: { icon: <Wheat className="w-5 h-5" />, gradient: 'from-lime-500 to-green-600', bg: 'bg-lime-50 text-lime-700 border-lime-200' },
  employment: { icon: <Hammer className="w-5 h-5" />, gradient: 'from-sky-500 to-blue-600', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
  welfare: { icon: <ShieldCheck className="w-5 h-5" />, gradient: 'from-slate-500 to-gray-600', bg: 'bg-slate-50 text-slate-700 border-slate-200' },
};

interface Props {
  rec: SchemeRecommendation;
  index: number;
  saved: boolean;
  onSave: () => void;
  onSelect: () => void;
  onCompare: () => void;
  isComparing: boolean;
}

export default function SchemeCard({ rec, index, saved, onSave, onSelect, onCompare, isComparing }: Props) {
  const config = categoryConfig[rec.scheme.category];
  const score = rec.eligibilityScore;
  const scoreColor = score >= 80 ? 'text-accent' : score >= 60 ? 'text-secondary' : 'text-muted-foreground';
  const barColor = score >= 80 ? 'bg-accent' : score >= 60 ? 'bg-secondary' : 'bg-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="group bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
      onClick={onSelect}
    >
      {/* Top color bar */}
      <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />

      <div className="p-4">
        {/* Category + rank row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${config.gradient} text-white`}>
              {config.icon}
            </div>
            <div>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.bg}`}>
                {rec.scheme.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={onCompare}
              className={`p-1.5 rounded-lg transition-all ${isComparing ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}
              title="Compare"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onSave}
              className={`p-1.5 rounded-lg transition-all ${saved ? 'text-secondary bg-secondary/10' : 'hover:bg-muted text-muted-foreground'}`}
              title={saved ? 'Saved' : 'Save'}
            >
              {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors leading-snug line-clamp-2">
          {rec.scheme.name}
        </h3>
        {rec.scheme.nameTamil && (
          <p className="text-[11px] text-muted-foreground mb-1.5 font-tamil">{rec.scheme.nameTamil}</p>
        )}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{rec.scheme.description}</p>

        {/* Score + members */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col">
              <span className={`text-base font-bold ${scoreColor} leading-none`}>{score}%</span>
              <span className="text-[10px] text-muted-foreground">match</span>
            </div>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ delay: index * 0.04 + 0.3, duration: 0.5 }}
                className={`h-full rounded-full ${barColor}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
              <span className="font-bold">#{rec.priorityRank}</span> rank
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{rec.memberMatch.length}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
