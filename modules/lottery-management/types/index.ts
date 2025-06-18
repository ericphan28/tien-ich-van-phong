// Core lottery types
export interface LotteryResult {
  id: string;
  date: Date;
  province: string;
  special: string;          // Giải đặc biệt
  first: string[];          // Giải nhất
  second: string[];         // Giải nhì
  third: string[];          // Giải ba
  fourth: string[];         // Giải tư
  fifth: string[];          // Giải năm
  sixth: string[];          // Giải sáu
  seventh: string[];        // Giải bảy
  eighth: string[];         // Giải tám
  allNumbers: string[];     // Tất cả số về
  createdAt: Date;
}

export interface LotteryEntry {
  id: string;
  userId: string;
  numbers: string[];
  type: 'lo2' | 'lo3' | 'lo4' | 'de';
  amount: number;
  date: Date;
  province: string;
  status: 'pending' | 'won' | 'lost';
  winAmount?: number;
  notes?: string;
}

export interface NumberStatistic {
  number: string;
  frequency: number;         // Tần suất xuất hiện
  lastAppeared: Date;       // Lần cuối xuất hiện
  daysSinceLastAppear: number;
  averageDaysBetween: number;
  hotScore: number;         // Điểm số nóng (0-100)
  coldScore: number;        // Điểm số lạnh (0-100)
  trend: 'hot' | 'cold' | 'normal';
}

export interface PredictionResult {
  number: string;
  probability: number;      // Xác suất 0-1
  confidence: number;       // Độ tin cậy 0-100
  algorithm: string;        // Thuật toán sử dụng
  reasons: string[];        // Lý do dự đoán
  riskLevel: 'low' | 'medium' | 'high';
}

export interface AnalysisReport {
  id: string;
  title: string;
  period: {
    from: Date;
    to: Date;
  };
  statistics: {
    totalResults: number;
    mostFrequentNumbers: NumberStatistic[];
    leastFrequentNumbers: NumberStatistic[];
    patterns: PatternAnalysis[];
  };
  predictions: PredictionResult[];
  generatedAt: Date;
}

export interface PatternAnalysis {
  type: 'consecutive' | 'pair' | 'sum_range' | 'odd_even';
  pattern: string;
  frequency: number;
  description: string;
  examples: string[];
}

export interface UserPreference {
  userId: string;
  favoriteProvinces: string[];
  preferredNumberTypes: ('lo2' | 'lo3' | 'lo4' | 'de')[];
  notificationSettings: {
    resultAlerts: boolean;
    predictionUpdates: boolean;
    weeklyReport: boolean;
  };
  analysisSettings: {
    defaultPeriod: number;    // days
    includedProvinces: string[];
    algorithmWeights: Record<string, number>;
  };
}

// Configuration types
export interface ProvinceConfig {
  code: string;
  name: string;
  schedules: {
    dayOfWeek: number[];      // 0=Sunday, 1=Monday, etc.
    time: string;             // "18:30"
  }[];
  timeZone: string;
  isActive: boolean;
}

export interface AlgorithmConfig {
  id: string;
  name: string;
  description: string;
  weight: number;           // Trọng số trong tổng hợp
  parameters: Record<string, unknown>;
  isEnabled: boolean;
}

// UI State types
export interface LotteryState {
  results: LotteryResult[];
  entries: LotteryEntry[];
  statistics: NumberStatistic[];
  predictions: PredictionResult[];
  isLoading: boolean;
  error: string | null;
  filters: {
    province: string;
    dateRange: [Date, Date];
    numberType: string;
  };
}

// Hook return types
export interface UseLotteryReturn {
  state: LotteryState;
  actions: {
    addEntry: (entry: Omit<LotteryEntry, 'id' | 'createdAt'>) => Promise<void>;
    updateEntry: (id: string, updates: Partial<LotteryEntry>) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
    refreshResults: () => Promise<void>;
    generatePredictions: (config?: Partial<AlgorithmConfig>) => Promise<void>;
    exportData: (format: 'excel' | 'pdf') => Promise<Blob>;
  };
}

// Service interfaces
export interface LotteryService {
  getResults(filters: ResultFilters): Promise<LotteryResult[]>;
  addResult(result: Omit<LotteryResult, 'id' | 'createdAt'>): Promise<LotteryResult>;
  getStatistics(numbers: string[], period: number): Promise<NumberStatistic[]>;
  generatePredictions(algorithm: string, config: Record<string, unknown>): Promise<PredictionResult[]>;
}

export interface ResultFilters {
  province?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  duplicates: number;
}

// Notification types
export interface LotteryNotification {
  id: string;
  type: 'result' | 'prediction' | 'win' | 'system';
  title: string;
  message: string;
  data?: unknown;
  read: boolean;
  createdAt: Date;
}

// Export types
export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv';
  includeStatistics: boolean;
  includePredictions: boolean;
  dateRange: [Date, Date];
  provinces: string[];
}
