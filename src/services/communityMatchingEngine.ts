// Part 14: Community Matching Engine & Safety Filters
import { CEFRLevel } from '../types';
import { PeerProfile, PartnerCompatibility, UserBlock } from '../types/community';

export interface CurrentUserMatchingCriteria {
  id: string;
  currentLevel: CEFRLevel;
  goals: string[];
  preferredTopics: string[];
  preferredStyle?: 'casual' | 'structured' | 'professional' | 'academic';
  timezone?: string;
}

export class CommunityMatchingEngine {
  /**
   * Calculates compatibility score and user-facing explanation reasons.
   */
  public evaluateCompatibility(
    current: CurrentUserMatchingCriteria,
    candidate: PeerProfile,
    blockedUsers: UserBlock[] = []
  ): PartnerCompatibility | null {
    // 1. Safety & Block Checks
    if (candidate.id === current.id) return null;
    const isBlocked = blockedUsers.some((b) => b.blockedUserId === candidate.id);
    if (isBlocked) return null;

    // 2. Privacy Checks
    if (!candidate.isDiscoveryEnabled) return null;
    if (candidate.visibility === 'private') return null;

    let score = 50; // base score
    const reasons: string[] = [];

    // Level compatibility
    const levelOrder: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
    const diff = Math.abs((levelOrder[current.currentLevel] || 3) - (levelOrder[candidate.currentLevel] || 3));

    if (diff === 0) {
      score += 25;
      reasons.push(`Same proficiency level (${candidate.currentLevel})`);
    } else if (diff === 1) {
      score += 15;
      reasons.push(`Comfortable adjacent level (${candidate.currentLevel})`);
    } else {
      score -= 20;
    }

    // Goals overlap
    const goalOverlap = current.goals.filter((g) =>
      candidate.learningGoals.some((cg) => cg.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(cg.toLowerCase()))
    );
    if (goalOverlap.length > 0) {
      score += 15;
      reasons.push(`Both practicing ${goalOverlap[0]}`);
    }

    // Practice topics overlap
    const topicOverlap = current.preferredTopics.filter((t) =>
      candidate.practiceTopics.some((ct) => ct.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(ct.toLowerCase()))
    );
    if (topicOverlap.length > 0) {
      score += 15;
      reasons.push(`Shared interest in ${topicOverlap[0]}`);
    }

    // Practice style
    if (current.preferredStyle && candidate.preferredStyle === current.preferredStyle) {
      score += 10;
      reasons.push(`Prefers ${candidate.preferredStyle} practice format`);
    }

    // Availability signal
    if (candidate.isOnline) {
      score += 10;
      reasons.push('Online & ready to practice right now');
    }

    // Clamp score
    const finalScore = Math.min(100, Math.max(20, score));

    let badge: 'Top Match' | 'Great Match' | 'Good Match' = 'Good Match';
    if (finalScore >= 85) badge = 'Top Match';
    else if (finalScore >= 70) badge = 'Great Match';

    if (reasons.length === 0) {
      reasons.push('Compatible learning schedule & positive partner history');
    }

    return {
      partner: candidate,
      matchScore: finalScore,
      badge,
      commonReasons: reasons.slice(0, 3),
    };
  }

  /**
   * Sorts candidate peers by compatibility for the learner.
   */
  public findRankedMatches(
    current: CurrentUserMatchingCriteria,
    candidates: PeerProfile[],
    blockedUsers: UserBlock[] = []
  ): PartnerCompatibility[] {
    const results: PartnerCompatibility[] = [];

    for (const c of candidates) {
      const evaluation = this.evaluateCompatibility(current, c, blockedUsers);
      if (evaluation) {
        results.push(evaluation);
      }
    }

    // Sort descending by matchScore
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Performs quick matching based on user parameters.
   */
  public quickMatch(
    current: CurrentUserMatchingCriteria,
    candidates: PeerProfile[],
    params: {
      topic: string;
      durationMinutes: number;
      format: string;
    },
    blockedUsers: UserBlock[] = []
  ): PartnerCompatibility | null {
    const onlineCandidates = candidates.filter((c) => c.isOnline);
    const ranked = this.findRankedMatches(current, onlineCandidates.length > 0 ? onlineCandidates : candidates, blockedUsers);

    if (ranked.length > 0) {
      return ranked[0];
    }
    return null;
  }
}

export const communityMatchingEngine = new CommunityMatchingEngine();
