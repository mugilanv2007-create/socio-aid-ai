import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle, Phone, ChevronDown, ChevronUp, Briefcase, Heart, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { FamilyMember, OccupationType, HealthCategory, EducationStatus } from '@/data/types';

const occupationLabels: Record<OccupationType, string> = {
  govt_100_days: 'Govt 100 Days Work',
  cook: 'Cook',
  student: 'Student',
  farmer: 'Farmer',
  private_job: 'Private Job',
  government_job: 'Government Job',
  business: 'Business',
  unemployed: 'Unemployed',
};

const healthLabels: Record<HealthCategory, string> = {
  disability: 'Disability',
  critical_disease: 'Critical Disease',
  chronic_disease: 'Chronic Disease',
  maternal_health: 'Maternal Health',
  senior_citizen: 'Senior Citizen',
  special_category: 'Special Category',
  infectious_disease: 'Infectious Disease',
  general_health: 'General Health',
};

const educationLabels: Record<EducationStatus, string> = {
  uneducated: 'Uneducated',
  primary: 'Primary (1-5)',
  middle: 'Middle (6-8)',
  high_school: 'High School (9-10)',
  higher_secondary: 'Higher Secondary (11-12)',
  diploma: 'Diploma',
  graduate: 'Graduate',
  post_graduate: 'Post Graduate',
  professional: 'Professional Degree',
};

interface Props {
  onComplete: () => void;
}

export default function FamilyDataPage({ onComplete }: Props) {
  const { rationCard, verifyMemberAadhaar, updateMember, allMembersVerified } = useAppContext();
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState<Record<string, boolean>>({});
  const [generatedOtps, setGeneratedOtps] = useState<Record<string, string>>({});

  if (!rationCard) return null;

  const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

  const handleSendOtp = (memberId: string) => {
    const newOtp = generateOtp();
    setGeneratedOtps(prev => ({ ...prev, [memberId]: newOtp }));
    setOtpSent(prev => ({ ...prev, [memberId]: true }));
  };

  const handleVerifyOtp = (memberId: string) => {
    const otp = otpInputs[memberId];
    if (otp === generatedOtps[memberId]) {
      verifyMemberAadhaar(memberId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero px-4 py-6 text-primary-foreground">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6" />
            <h1 className="text-xl font-bold font-heading">Family Members</h1>
          </div>
          <p className="text-sm opacity-80">
            Ration Card: {rationCard.rationCardNumber} • {rationCard.type} •{' '}
            {rationCard.members.length} members
          </p>
          <p className="text-sm opacity-80">
            Head: {rationCard.headOfFamily} • Annual Income: ₹{rationCard.annualIncome.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <p className="text-sm text-muted-foreground mb-2">
          Verify Aadhaar for each member and update their details.
        </p>

        {rationCard.members.map((member, index) => (
          <MemberCard
            key={member.id}
            member={member}
            index={index}
            expanded={expandedMember === member.id}
            onToggle={() => setExpandedMember(prev => prev === member.id ? null : member.id)}
            otpSent={!!otpSent[member.id]}
            otpValue={otpInputs[member.id] || ''}
            generatedOtp={generatedOtps[member.id] || ''}
            onOtpChange={(val) => setOtpInputs(prev => ({ ...prev, [member.id]: val }))}
            onSendOtp={() => handleSendOtp(member.id)}
            onVerifyOtp={() => handleVerifyOtp(member.id)}
            onUpdateMember={(data) => updateMember(member.id, data)}
          />
        ))}

        <div className="pt-4">
          <Button
            onClick={onComplete}
            disabled={!allMembersVerified}
            className="w-full gradient-primary text-primary-foreground h-12 text-base"
          >
            {allMembersVerified ? (
              <>View Recommended Schemes <ArrowRight className="w-5 h-5 ml-2" /></>
            ) : (
              `Verify all members to continue (${rationCard.members.filter(m => m.aadhaarVerified).length}/${rationCard.members.length})`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MemberCard({
  member, index, expanded, onToggle, otpSent, otpValue,
  onOtpChange, onSendOtp, onVerifyOtp, onUpdateMember,
}: {
  member: FamilyMember;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  otpSent: boolean;
  otpValue: string;
  onOtpChange: (v: string) => void;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
  onUpdateMember: (data: Partial<FamilyMember>) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-gov overflow-hidden"
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
            ${member.aadhaarVerified ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
            {member.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm">{member.name}</span>
              {member.aadhaarVerified && <CheckCircle className="w-4 h-4 text-accent" />}
            </div>
            <span className="text-xs text-muted-foreground">
              {member.relationship} • Age {member.age} • {member.gender}
            </span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Aadhaar verification */}
              {!member.aadhaarVerified ? (
                <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Aadhaar Verification: {member.aadhaarNumber}
                  </p>
                  {!otpSent ? (
                    <Button size="sm" onClick={onSendOtp} variant="outline">
                      Send OTP
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter OTP (123456)"
                        value={otpValue}
                        onChange={(e) => onOtpChange(e.target.value)}
                        maxLength={6}
                        className="text-center tracking-wider"
                      />
                      <Button size="sm" onClick={onVerifyOtp}>Verify</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-accent/5 p-3 rounded-lg flex items-center gap-2 text-sm text-accent">
                  <CheckCircle className="w-4 h-4" />
                  Aadhaar verified: {member.aadhaarNumber}
                </div>
              )}

              {/* Editable fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <GraduationCap className="w-3 h-3" /> Education
                  </label>
                  <Select
                    value={member.education}
                    onValueChange={(v) => onUpdateMember({ education: v as EducationStatus })}
                  >
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(educationLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Briefcase className="w-3 h-3" /> Occupation
                  </label>
                  <Select
                    value={member.occupation}
                    onValueChange={(v) => onUpdateMember({ occupation: v as OccupationType })}
                  >
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(occupationLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {['private_job', 'government_job', 'business'].includes(member.occupation) && (
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Details</label>
                    <Input
                      placeholder={`Enter ${occupationLabels[member.occupation]} name`}
                      value={member.occupationDetail || ''}
                      onChange={(e) => onUpdateMember({ occupationDetail: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Heart className="w-3 h-3" /> Health Category
                  </label>
                  <Select
                    value={member.healthCategory}
                    onValueChange={(v) => onUpdateMember({ healthCategory: v as HealthCategory })}
                  >
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(healthLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Annual Income (₹)</label>
                  <Input
                    type="number"
                    value={member.annualIncome}
                    onChange={(e) => onUpdateMember({ annualIncome: parseInt(e.target.value) || 0 })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
