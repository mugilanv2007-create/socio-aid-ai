import { motion } from 'framer-motion';
import { X, CheckCircle, FileText, MapPin, ExternalLink, Copy, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SchemeRecommendation } from '@/data/types';
import { getCategoryIcon, getCategoryLabel } from '@/utils/recommendationEngine';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

interface Props {
  rec: SchemeRecommendation;
  onClose: () => void;
}

export default function SchemeDetailModal({ rec, onClose }: Props) {
  const { rationCard, savedSchemes, toggleSaveScheme, addNotification } = useAppContext();
  const [applied, setApplied] = useState(false);
  const saved = savedSchemes.includes(rec.scheme.id);

  const handleApply = () => {
    setApplied(true);
    addNotification({
      title: 'Application Submitted',
      message: `Your application for ${rec.scheme.name} has been submitted (simulation).`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gradient-hero p-4 sm:p-6 rounded-t-2xl sm:rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getCategoryIcon(rec.scheme.category)}</span>
                <Badge className="bg-primary-foreground/20 text-primary-foreground text-[10px]">
                  {getCategoryLabel(rec.scheme.category)}
                </Badge>
                <Badge className="bg-primary-foreground/20 text-primary-foreground text-[10px]">
                  #{rec.priorityRank} Priority
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-primary-foreground">{rec.scheme.name}</h2>
              {rec.scheme.nameTamil && (
                <p className="text-sm text-primary-foreground/70 font-tamil">{rec.scheme.nameTamil}</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-primary-foreground/10 text-primary-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-primary-foreground/20 rounded-lg px-3 py-1.5">
              <span className="text-2xl font-bold text-primary-foreground">{rec.eligibilityScore}%</span>
              <span className="text-xs text-primary-foreground/70 ml-1">match</span>
            </div>
            <div className="text-xs text-primary-foreground/70">
              Eligible members: {rec.memberMatch.join(', ')}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Description */}
          <section>
            <h3 className="font-semibold text-sm text-foreground mb-2">About this Scheme</h3>
            <p className="text-sm text-muted-foreground">{rec.scheme.description}</p>
          </section>

          {/* Benefits */}
          <section className="bg-accent/5 p-3 rounded-lg">
            <h3 className="font-semibold text-sm text-accent mb-1">💰 Benefits</h3>
            <p className="text-sm text-foreground">{rec.scheme.benefits}</p>
          </section>

          {/* Matched criteria */}
          <section>
            <h3 className="font-semibold text-sm text-foreground mb-2">✅ Matched Criteria</h3>
            <div className="flex flex-wrap gap-1.5">
              {rec.matchedCriteria.map((c, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1 text-accent" />
                  {c}
                </Badge>
              ))}
            </div>
          </section>

          {/* Documents Required */}
          <section>
            <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Documents Required
            </h3>
            <div className="space-y-2">
              {rec.scheme.documentsRequired.map((doc, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${doc.mandatory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{doc.name}</span>
                      {doc.mandatory && <Badge variant="destructive" className="text-[9px] py-0">Required</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" />
                        {doc.type === 'both' ? 'Original + Copy' : doc.type === 'original' ? 'Original' : 'Photocopy'}
                      </span>
                      <span>Qty: {doc.quantity}</span>
                    </div>
                    {doc.description && <p className="text-xs text-muted-foreground mt-0.5 italic">{doc.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Application Steps */}
          <section>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-primary" />
              Steps to Apply
            </h3>
            <div className="relative">
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border" />
              <div className="space-y-3">
                {rec.scheme.applicationSteps.map((step) => (
                  <div key={step.step} className="flex gap-3 relative">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 z-10">
                      {step.step}
                    </div>
                    <div className="flex-1 pb-2">
                      <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      {step.location && (
                        <p className="text-xs text-primary mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {step.location}
                        </p>
                      )}
                      {step.onlineUrl && (
                        <a
                          href={step.onlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-info mt-1 flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> {step.onlineUrl}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Auto Form Fill simulation */}
          {rationCard && (
            <section className="bg-muted/50 p-3 rounded-lg">
              <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                Auto-Filled Details (Simulation)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{rationCard.headOfFamily}</span></div>
                <div><span className="text-muted-foreground">Ration Card:</span> <span className="font-medium">{rationCard.rationCardNumber}</span></div>
                <div><span className="text-muted-foreground">District:</span> <span className="font-medium">{rationCard.district}</span></div>
                <div><span className="text-muted-foreground">Income:</span> <span className="font-medium">₹{rationCard.annualIncome.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Card Type:</span> <span className="font-medium">{rationCard.type}</span></div>
                <div><span className="text-muted-foreground">Members:</span> <span className="font-medium">{rationCard.members.length}</span></div>
              </div>
            </section>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => toggleSaveScheme(rec.scheme.id)}
            >
              {saved ? '✅ Saved' : '🔖 Save Scheme'}
            </Button>
            <Button
              className="flex-1 gradient-primary text-primary-foreground"
              onClick={handleApply}
              disabled={applied}
            >
              {applied ? '✅ Applied' : '📝 Apply Now'}
            </Button>
          </div>
          {applied && (
            <p className="text-xs text-accent text-center">
              Application submitted successfully! (Simulation) Check notifications for updates.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
