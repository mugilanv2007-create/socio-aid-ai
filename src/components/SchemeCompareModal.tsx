import { motion } from 'framer-motion';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SchemeRecommendation } from '@/data/types';
import { getCategoryIcon } from '@/utils/recommendationEngine';

interface Props {
  schemes: SchemeRecommendation[];
  onClose: () => void;
}

export default function SchemeCompareModal({ schemes, onClose }: Props) {
  const fields = [
    { label: 'Category', render: (r: SchemeRecommendation) => r.scheme.category.replace(/_/g, ' ') },
    { label: 'Eligibility Score', render: (r: SchemeRecommendation) => `${r.eligibilityScore}%` },
    { label: 'Priority Rank', render: (r: SchemeRecommendation) => `#${r.priorityRank}` },
    { label: 'Benefits', render: (r: SchemeRecommendation) => r.scheme.benefits },
    { label: 'Eligible Members', render: (r: SchemeRecommendation) => r.memberMatch.join(', ') },
    { label: 'Documents Needed', render: (r: SchemeRecommendation) => r.scheme.documentsRequired.length.toString() },
    { label: 'Steps to Apply', render: (r: SchemeRecommendation) => r.scheme.applicationSteps.length.toString() },
    { label: 'Target Group', render: (r: SchemeRecommendation) => r.scheme.targetGroup.join(', ') },
  ];

  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card w-full max-w-3xl max-h-[85vh] overflow-auto rounded-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="gradient-hero p-4 flex items-center justify-between rounded-t-xl sticky top-0 z-10">
          <h2 className="font-bold text-primary-foreground">Compare Schemes</h2>
          <button onClick={onClose} className="text-primary-foreground p-1 hover:bg-primary-foreground/10 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left text-muted-foreground font-medium">Feature</th>
                {schemes.map(s => (
                  <th key={s.scheme.id} className="p-3 text-left min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span>{getCategoryIcon(s.scheme.category)}</span>
                      <span className="font-semibold text-foreground text-xs">{s.scheme.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map(f => (
                <tr key={f.label} className="border-b last:border-0">
                  <td className="p-3 text-muted-foreground font-medium text-xs">{f.label}</td>
                  {schemes.map(s => (
                    <td key={s.scheme.id} className="p-3 text-xs text-foreground">
                      {f.render(s)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
