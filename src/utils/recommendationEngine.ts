import { RationCard, FamilyMember, GovernmentScheme, SchemeRecommendation } from '../data/types';
import { governmentSchemes } from '../data/schemes';

export function calculateEligibilityScore(
  scheme: GovernmentScheme,
  member: FamilyMember,
  rationCard: RationCard
): { score: number; matchedCriteria: string[] } {
  const criteria: string[] = [];
  let totalChecks = 0;
  let passedChecks = 0;
  const e = scheme.eligibility;

  // Income check
  if (e.maxIncome !== undefined) {
    totalChecks++;
    if (rationCard.annualIncome <= e.maxIncome) {
      passedChecks++;
      criteria.push(`Annual income ≤ ₹${e.maxIncome.toLocaleString()}`);
    }
  }

  // Age check
  if (e.minAge !== undefined) {
    totalChecks++;
    if (member.age >= e.minAge) {
      passedChecks++;
      criteria.push(`Age ≥ ${e.minAge}`);
    }
  }
  if (e.maxAge !== undefined) {
    totalChecks++;
    if (member.age <= e.maxAge) {
      passedChecks++;
      criteria.push(`Age ≤ ${e.maxAge}`);
    }
  }

  // Caste check
  if (e.caste && e.caste.length > 0) {
    totalChecks++;
    if (e.caste.includes(member.caste)) {
      passedChecks++;
      criteria.push(`Caste: ${member.caste}`);
    }
  }

  // Education check
  if (e.education && e.education.length > 0) {
    totalChecks++;
    if (e.education.includes(member.education)) {
      passedChecks++;
      criteria.push(`Education: ${member.education.replace(/_/g, ' ')}`);
    }
  }

  // Occupation check
  if (e.occupation && e.occupation.length > 0) {
    totalChecks++;
    if (e.occupation.includes(member.occupation)) {
      passedChecks++;
      criteria.push(`Occupation: ${member.occupation.replace(/_/g, ' ')}`);
    }
  }

  // Health check
  if (e.healthCategory && e.healthCategory.length > 0) {
    totalChecks++;
    if (e.healthCategory.includes(member.healthCategory)) {
      passedChecks++;
      criteria.push(`Health: ${member.healthCategory.replace(/_/g, ' ')}`);
    }
  }

  // Gender check
  if (e.gender && e.gender.length > 0) {
    totalChecks++;
    if (e.gender.includes(member.gender)) {
      passedChecks++;
      criteria.push(`Gender: ${member.gender}`);
    }
  }

  // Ration card type check
  if (e.rationCardType && e.rationCardType.length > 0) {
    totalChecks++;
    if (e.rationCardType.includes(rationCard.type)) {
      passedChecks++;
      criteria.push(`Ration card: ${rationCard.type}`);
    }
  }

  // If no eligibility criteria, scheme is universally available
  if (totalChecks === 0) {
    return { score: 70, matchedCriteria: ['Universally available scheme'] };
  }

  const score = Math.round((passedChecks / totalChecks) * 100);
  return { score, matchedCriteria: criteria };
}

export function generateRecommendations(rationCard: RationCard): SchemeRecommendation[] {
  const recommendations: SchemeRecommendation[] = [];
  const seenSchemes = new Set<string>();

  for (const scheme of governmentSchemes) {
    if (!scheme.isActive) continue;

    let bestScore = 0;
    let bestCriteria: string[] = [];
    const memberMatches: string[] = [];

    for (const member of rationCard.members) {
      const { score, matchedCriteria } = calculateEligibilityScore(scheme, member, rationCard);
      if (score >= 50) {
        memberMatches.push(member.name);
        if (score > bestScore) {
          bestScore = score;
          bestCriteria = matchedCriteria;
        }
      }
    }

    if (bestScore >= 50 && !seenSchemes.has(scheme.id)) {
      seenSchemes.add(scheme.id);
      recommendations.push({
        scheme,
        eligibilityScore: bestScore,
        priorityRank: 0,
        matchedCriteria: bestCriteria,
        memberMatch: memberMatches,
      });
    }
  }

  // Sort by score * priority weight
  recommendations.sort((a, b) => {
    const scoreA = a.eligibilityScore * (4 - a.scheme.priority);
    const scoreB = b.eligibilityScore * (4 - b.scheme.priority);
    return scoreB - scoreA;
  });

  // Assign ranks
  recommendations.forEach((r, i) => {
    r.priorityRank = i + 1;
  });

  return recommendations;
}

export function calculateHealthScore(members: FamilyMember[]): number {
  let totalScore = 0;
  for (const m of members) {
    let memberScore = 100;
    switch (m.healthCategory) {
      case 'critical_disease': memberScore = 20; break;
      case 'disability': memberScore = 30; break;
      case 'chronic_disease': memberScore = 40; break;
      case 'infectious_disease': memberScore = 35; break;
      case 'maternal_health': memberScore = 60; break;
      case 'senior_citizen': memberScore = 50; break;
      case 'special_category': memberScore = 45; break;
      case 'general_health': memberScore = 90; break;
    }
    // Age factor
    if (m.age > 70) memberScore -= 15;
    else if (m.age > 60) memberScore -= 10;
    else if (m.age < 5) memberScore -= 5;
    totalScore += Math.max(memberScore, 0);
  }
  return Math.round(totalScore / members.length);
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    education: '📚',
    health: '🏥',
    business: '💼',
    women_child: '👩‍👧',
    senior_citizen: '👴',
    housing: '🏠',
    agriculture: '🌾',
    employment: '💪',
    welfare: '🛡️',
  };
  return icons[category] || '📋';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    education: 'Education',
    health: 'Health',
    business: 'Business & Enterprise',
    women_child: 'Women & Child',
    senior_citizen: 'Senior Citizen',
    housing: 'Housing',
    agriculture: 'Agriculture',
    employment: 'Employment & Skills',
    welfare: 'Social Welfare',
  };
  return labels[category] || category;
}
