import { motion } from 'framer-motion';
import { X, Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useAppContext();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-accent" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-secondary" />;
      default: return <Info className="w-4 h-4 text-info" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 z-50" onClick={onClose}>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute right-0 top-0 h-full w-80 bg-card shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="gradient-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-foreground">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">Notifications</span>
          </div>
          <button onClick={onClose} className="text-primary-foreground/70 hover:text-primary-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          {notifications.map(n => (
            <button
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`w-full text-left p-4 border-b flex gap-3 transition-colors
                ${n.read ? 'bg-card' : 'bg-primary/5'}`}
            >
              {getIcon(n.type)}
              <div>
                <p className={`text-sm ${n.read ? 'text-muted-foreground' : 'font-semibold text-foreground'}`}>
                  {n.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              </div>
            </button>
          ))}
          {notifications.length === 0 && (
            <div className="text-center p-8 text-muted-foreground text-sm">No notifications</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
