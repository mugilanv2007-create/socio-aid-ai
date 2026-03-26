import { motion } from 'framer-motion';
import {
  X, CheckCircle, FileText, MapPin, ExternalLink, Copy,
  Download, ArrowRight, Bookmark, BookmarkCheck, Send,
  ClipboardCheck, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<string | null>('about');
  const saved = savedSchemes.includes(rec.scheme.id);
  const score = rec.eligibilityScore;

  const handleApply = () => {
    setApplied(true);
    addNotification({
      title: 'Application Submitted',
      message: `Your application for ${rec.scheme.name} has been submitted successfully (simulation).`,
      type: 'success',
    });
  };

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const mandatoryDocs = rec.scheme.documentsRequired.filter(d => d.mandatory);
  const optionalDocs = rec.scheme.documentsRequired.filter(d => !d.mandatory);

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-card w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gradient-hero p-5 sm:p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xl">{getCategoryIcon(rec.scheme.category)}</span>
                <Badge className="bg-primary-foreground/20 text-primary-foreground text-[10px] border-0">
                  {getCategoryLabel(rec.scheme.category)}
                </Badge>
                <Badge className="bg-primary-foreground/20 text-primary-foreground text-[10px] border-0">
                  #{rec.priorityRank} Priority
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-primary-foreground leading-snug">{rec.scheme.name}</h2>
              {rec.scheme.nameTamil && (
                <p className="text-sm text-primary-foreground/60 font-tamil mt-0.5">{rec.scheme.nameTamil}</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-primary-foreground/10 text-primary-foreground shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Score bar */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-primary-foreground/15 rounded-xl px-4 py-2">
              <span className="text-3xl font-bold text-primary-foreground">{score}%</span>
              <span className="text-xs text-primary-foreground/60 leading-tight">eligibility<br />match</span>
            </div>
            <div className="flex-1">
              <div className="w-full h-2 bg-primary-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="h-full bg-primary-foreground rounded-full"
                />
              </div>
              <p className="text-[11px] text-primary-foreground/50 mt-1.5">
                Eligible: {rec.memberMatch.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-1">
          {/* About */}
          <CollapsibleSection
            title="About this Scheme"
            icon="📋"
            isOpen={activeSection === 'about'}
            onToggle={() => toggleSection('about')}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.scheme.description}</p>
            <div className="mt-3 bg-accent/10 border border-accent/20 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-accent mb-1">💰 Benefits</h4>
              <p className="text-sm text-foreground">{rec.scheme.benefits}</p>
            </div>
          </CollapsibleSection>

          {/* Matched Criteria */}
          <CollapsibleSection
            title="Eligibility Match"
            icon="✅"
            isOpen={activeSection === 'criteria'}
            onToggle={() => toggleSection('criteria')}
            badge={`${rec.matchedCriteria.length} criteria`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rec.matchedCriteria.map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-accent/5 border border-accent/10">
                  <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm text-foreground">{c}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Documents Required */}
          <CollapsibleSection
            title="Documents Required"
            icon="📄"
            isOpen={activeSection === 'docs'}
            onToggle={() => toggleSection('docs')}
            badge={`${rec.scheme.documentsRequired.length} docs`}
          >
            {mandatoryDocs.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <h4 className="text-xs font-bold text-destructive uppercase tracking-wide">Mandatory Documents</h4>
                </div>
                <div className="space-y-2">
                  {mandatoryDocs.map((doc, i) => (
                    <DocItem key={i} doc={doc} index={i + 1} />
                  ))}
                </div>
              </div>
            )}
            {optionalDocs.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Optional Documents</h4>
                <div className="space-y-2">
                  {optionalDocs.map((doc, i) => (
                    <DocItem key={i} doc={doc} index={mandatoryDocs.length + i + 1} />
                  ))}
                </div>
              </div>
            )}
          </CollapsibleSection>

          {/* Application Steps */}
          <CollapsibleSection
            title="How to Apply"
            icon="🚀"
            isOpen={activeSection === 'steps'}
            onToggle={() => toggleSection('steps')}
            badge={`${rec.scheme.applicationSteps.length} steps`}
          >
            <div className="relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border" />
              <div className="space-y-4">
                {rec.scheme.applicationSteps.map((step, idx) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3 relative"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 z-10 shadow-sm">
                      {step.step}
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-xl p-3 border border-border/50">
                      <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                      {step.location && (
                        <p className="text-xs text-primary mt-2 flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5" /> {step.location}
                        </p>
                      )}
                      {step.onlineUrl && (
                        <a
                          href={step.onlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary mt-2 flex items-center gap-1 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Apply Online
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Auto-Fill */}
          {rationCard && (
            <CollapsibleSection
              title="Auto-Filled Details"
              icon="⚡"
              isOpen={activeSection === 'autofill'}
              onToggle={() => toggleSection('autofill')}
            >
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', value: rationCard.headOfFamily },
                  { label: 'Ration Card', value: rationCard.rationCardNumber },
                  { label: 'Card Type', value: rationCard.type },
                  { label: 'District', value: rationCard.district },
                  { label: 'Annual Income', value: `₹${rationCard.annualIncome.toLocaleString()}` },
                  { label: 'Family Size', value: `${rationCard.members.length} members` },
                ].map((item, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-2.5 border border-border/50">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">{item.label}</span>
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Action Buttons */}
          <div className="pt-4 pb-2 flex gap-3 sticky bottom-0 bg-card border-t border-border -mx-4 sm:-mx-6 px-4 sm:px-6">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl gap-2 font-semibold"
              onClick={() => toggleSaveScheme(rec.scheme.id)}
            >
              {saved ? <BookmarkCheck className="w-4 h-4 text-secondary" /> : <Bookmark className="w-4 h-4" />}
              {saved ? 'Saved' : 'Save Scheme'}
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl gap-2 font-semibold gradient-primary text-primary-foreground"
              onClick={handleApply}
              disabled={applied}
            >
              {applied ? (
                <>
                  <ClipboardCheck className="w-4 h-4" />
                  Applied ✓
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Apply Now
                </>
              )}
            </Button>
          </div>

          {applied && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-center"
            >
              <CheckCircle className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-sm font-medium text-accent">Application submitted successfully!</p>
              <p className="text-xs text-muted-foreground mt-0.5">This is a simulation. Check notifications for updates.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function CollapsibleSection({
  title, icon, children, isOpen, onToggle, badge
}: {
  title: string; icon: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; badge?: string;
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3.5 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="font-semibold text-sm text-foreground">{title}</span>
          {badge && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{badge}</Badge>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3.5 pb-3.5 pt-0"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

function DocItem({ doc, index }: { doc: { name: string; type: string; quantity: number; mandatory: boolean; description?: string }; index: number }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
        doc.mandatory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        {index}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">{doc.name}</span>
          {doc.mandatory && <Badge variant="destructive" className="text-[9px] py-0 px-1.5">Required</Badge>}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <Copy className="w-3 h-3" />
            {doc.type === 'both' ? 'Original + Copy' : doc.type === 'original' ? 'Original Only' : 'Photocopy'}
          </span>
          <span className="font-medium">Qty: {doc.quantity}</span>
        </div>
        {doc.description && <p className="text-xs text-muted-foreground mt-1 italic">{doc.description}</p>}
      </div>
    </div>
  );
}
