export interface CodeIssue {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  line: number;
  type: string;
  message: string;
  suggestion: string;
}

export interface AlgorithmOptimization {
  type: string;
  title: string;
  originalComplexity: string;
  optimizedComplexity: string;
  spaceComplexity: string;
  explanation: string;
  tradeoff: string;
  recommendation?: string;
  originalCode: string;
  optimizedCode: string;
  contributingLines?: number[];
}

export interface AnalysisResult {
  lineCount: number;
  score: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  issues: CodeIssue[];
  optimization?: AlgorithmOptimization | null;
}

export interface AnalysisHistoryItem {
  id: number;
  username: string;
  codeSnippet: string;
  score: number;
  lineCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalIssues: number;
  createdAt: string;
}

export interface AiReviewResponse {
  overview: string;
  keyProblems: string[];
  correctedCode: string;
  generatedTestCases: string;
  complexityAnalysis: string;
}

export interface ComplexityInfo {
  time: string;
  space: string;
  timeRank: number;
  spaceRank: number;
  explanation: string;
  contributingLines: number[];
}

export interface OptimizationResponse {
  canOptimize: boolean;
  type?: string;
  title?: string;
  summary: string;
  originalComplexity: ComplexityInfo;
  optimizedComplexity: ComplexityInfo;
  originalCode: string;
  optimizedCode: string;
  explanation: string;
  tradeoffs: string;
  tradeoff?: string;
  improvement: string;
  algorithmRecommendation?: string;
  beforeScore: number;
  afterScore: number;
  scoreImprovementReason?: string;
}

export interface OptimizationHistoryItem {
  id: number;
  username: string;
  originalCode: string;
  optimizedCode: string;
  originalTimeComplexity: string;
  optimizedTimeComplexity: string;
  originalSpaceComplexity: string;
  optimizedSpaceComplexity: string;
  beforeScore: number;
  afterScore: number;
  summary: string;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  username: string;
  token: string;
}
