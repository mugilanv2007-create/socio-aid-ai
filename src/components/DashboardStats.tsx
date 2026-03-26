import { motion } from 'framer-motion';
import { Star, Heart, Users, TrendingUp, ShieldCheck, Bookmark } from 'lucide-react';

interface Props {
  schemesCount: number;
  healthScore: number;
  membersCount: number;
  savedCount: number;
}

export default function DashboardStats({ schemesCount, healthScore, membersCount, savedCount }: Props) {
  const stats = [
    {
      icon: <Star className="w-4 h-4" />,
      label: 'Schemes Found',
      value: schemesCount.toString(),
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: <Heart className="w-4 h-4" />,
      label: 'Health Score',
      value: `${healthScore}%`,
      color: healthScore > 70 ? 'from-emerald-500 to-green-500' : healthScore > 40 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500',
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'Family Members',
      value: membersCount.toString(),
      color: 'from-purple-500 to-fuchsia-500',
    },
    {
      icon: <Bookmark className="w-4 h-4" />,
      label: 'Saved',
      value: savedCount.toString(),
      color: 'from-amber-500 to-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-card rounded-xl border p-3.5 flex items-center gap-3 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <div className="text-xl font-bold text-foreground leading-none">{stat.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
