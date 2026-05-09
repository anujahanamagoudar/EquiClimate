const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const calculateContribution = ({ emissions }) => {
  const normalized = clamp((emissions - 20) / 70, 0, 1);
  return Math.round(normalized * 100);
};

export const calculateVulnerability = ({ aqi, temperature, population, income }) => {
  const aqiScore = clamp(aqi / 150, 0, 1);
  const tempScore = clamp((temperature - 18) / 12, 0, 1);
  const populationScore = clamp(population / 60, 0, 1);
  const incomeInverse = clamp((70 - income) / 50, 0, 1);

  const weighted = aqiScore * 0.35 + tempScore * 0.25 + populationScore * 0.2 + incomeInverse * 0.2;
  return Math.round(weighted * 100);
};

export const calculateGap = (vulnerability, contribution) => Math.round(vulnerability - contribution);

export const getRiskLevel = (score) => {
  if (score >= 75) return { level: 'High', color: '#dc2626' };
  if (score >= 60) return { level: 'Medium', color: '#ea580c' };
  return { level: 'Low', color: '#16a34a' };
};

export const getPriorityLabel = (gap) => {
  const normalized = gap / 100;
  if (normalized > 0.4) return 'Critical';
  if (normalized > 0.2) return 'High';
  return 'Medium';
};

export const getInequalityLabel = (gap) => {
  const normalized = gap / 100;
  if (normalized > 0.4) return 'Severely Unfair';
  if (normalized > 0.2) return 'Moderately Unfair';
  return 'Fair';
};

export const isHighInequality = (contribution, vulnerability, gap) => {
  return contribution <= 45 && vulnerability >= 65 && gap >= 20;
};
