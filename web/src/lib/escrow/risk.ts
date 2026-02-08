// Escrow Engine v1 - Risk Scoring & Evidence Policy

import type { RiskLevel, EvidencePolicy } from './types';

export type RiskFactors = {
  jobValue: number;
  isNewClient: boolean;
  isNewProvider: boolean;
  disputeHistoryCount: number;
  isHighRiskCategory: boolean;
};

/**
 * Calculate risk score and level based on job factors
 */
export function calcRiskScore(args: RiskFactors): { score: number; level: RiskLevel } {
  let score = 0;
  
  // Job value threshold: +30 if >= $15,000
  if (args.jobValue >= 15000) {
    score += 30;
  }
  
  // New client: +15
  if (args.isNewClient) {
    score += 15;
  }
  
  // New provider: +15
  if (args.isNewProvider) {
    score += 15;
  }
  
  // Dispute history: +10 per dispute, capped at +30
  const disputePoints = Math.min(args.disputeHistoryCount * 10, 30);
  score += disputePoints;
  
  // High-risk category: +20
  if (args.isHighRiskCategory) {
    score += 20;
  }
  
  // Determine level
  let level: RiskLevel;
  if (score >= 60) {
    level = 'HIGH';
  } else if (score >= 25) {
    level = 'MEDIUM';
  } else {
    level = 'LOW';
  }
  
  return { score, level };
}

/**
 * Get evidence policy based on risk level
 */
export function evidencePolicyForRisk(level: RiskLevel): EvidencePolicy {
  switch (level) {
    case 'LOW':
      return { required: false, needed: 0 };
    case 'MEDIUM':
      return { required: true, needed: 2 };
    case 'HIGH':
      return { required: true, needed: 5 };
  }
}
