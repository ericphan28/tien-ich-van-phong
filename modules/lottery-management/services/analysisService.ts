import { LotteryResult, NumberStatistic, PredictionResult, LotteryEntry } from '../types';

interface Pattern {
  type: string;
  nextNumber: string;
  probability: number;
  confidence: number;
  frequency: number;
  description: string;
}

export class LotteryAnalysisService {
  /**
   * Phân tích thống kê số lô đề
   */
  async analyzeNumbers(results: LotteryResult[], period: number = 30): Promise<NumberStatistic[]> {
    const numberFrequency = new Map<string, {
      count: number;
      lastDate: Date;
      dates: Date[];
    }>();

    // Tính tần suất xuất hiện
    results.forEach(result => {
      result.allNumbers.forEach(number => {
        const existing = numberFrequency.get(number) || {
          count: 0,
          lastDate: new Date(0),
          dates: []
        };

        existing.count++;
        existing.dates.push(result.date);
        if (result.date > existing.lastDate) {
          existing.lastDate = result.date;
        }

        numberFrequency.set(number, existing);
      });
    });

    // Tính toán thống kê chi tiết
    const statistics: NumberStatistic[] = [];
    const now = new Date();

    numberFrequency.forEach((data, number) => {
      const daysSinceLastAppear = Math.floor(
        (now.getTime() - data.lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Tính khoảng cách trung bình giữa các lần xuất hiện
      const intervals = [];
      for (let i = 1; i < data.dates.length; i++) {
        const interval = Math.floor(
          (data.dates[i].getTime() - data.dates[i-1].getTime()) / (1000 * 60 * 60 * 24)
        );
        intervals.push(interval);
      }
      
      const averageDaysBetween = intervals.length > 0 
        ? intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
        : period;

      // Tính điểm hot/cold
      const frequency = data.count / results.length;
      const hotScore = Math.min(100, frequency * 100 + (data.count >= 3 ? 20 : 0));
      const coldScore = Math.min(100, (1 - frequency) * 100 + Math.min(daysSinceLastAppear, 30));

      let trend: 'hot' | 'cold' | 'normal' = 'normal';
      if (hotScore > 70) trend = 'hot';
      else if (coldScore > 70) trend = 'cold';

      statistics.push({
        number,
        frequency: data.count,
        lastAppeared: data.lastDate,
        daysSinceLastAppear,
        averageDaysBetween,
        hotScore,
        coldScore,
        trend
      });
    });

    return statistics.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Dự đoán số may mắn sử dụng nhiều thuật toán
   */
  async generatePredictions(
    results: LotteryResult[], 
    statistics: NumberStatistic[],
    options: {
      algorithm?: 'frequency' | 'pattern' | 'trending' | 'combination';
      confidence?: number;
      count?: number;
    } = {}
  ): Promise<PredictionResult[]> {
    const { algorithm = 'combination', confidence = 70, count = 10 } = options;
    
    let predictions: PredictionResult[] = [];

    switch (algorithm) {
      case 'frequency':
        predictions = this.frequencyBasedPrediction(statistics, count);
        break;
      case 'pattern':
        predictions = this.patternBasedPrediction(results, count);
        break;
      case 'trending':
        predictions = this.trendingBasedPrediction(statistics, count);
        break;
      case 'combination':
        predictions = this.combinationPrediction(results, statistics, count);
        break;
    }

    return predictions.filter(p => p.confidence >= confidence);
  }

  private frequencyBasedPrediction(statistics: NumberStatistic[], count: number): PredictionResult[] {
    // Dự đoán dựa trên tần suất
    const hotNumbers = statistics
      .filter(stat => stat.trend === 'hot')
      .sort((a, b) => b.hotScore - a.hotScore)
      .slice(0, count);

    return hotNumbers.map(stat => ({
      number: stat.number,
      probability: stat.hotScore / 100,
      confidence: Math.min(95, stat.hotScore + 10),
      algorithm: 'frequency',
      reasons: [
        `Xuất hiện ${stat.frequency} lần gần đây`,
        `Điểm nóng: ${stat.hotScore.toFixed(1)}`,
        `Lần cuối: ${stat.daysSinceLastAppear} ngày trước`
      ],
      riskLevel: stat.hotScore > 80 ? 'low' : 'medium'
    }));
  }

  private patternBasedPrediction(results: LotteryResult[], count: number): PredictionResult[] {
    // Phân tích pattern số liên tiếp, số đôi, etc.
    const patterns = this.analyzePatterns(results);
    const predictions: PredictionResult[] = [];

    // Tìm các số theo pattern
    for (const pattern of patterns) {
      if (predictions.length >= count) break;

      const prediction: PredictionResult = {
        number: pattern.nextNumber,
        probability: pattern.probability,
        confidence: pattern.confidence,
        algorithm: 'pattern',
        reasons: [
          `Pattern: ${pattern.type}`,
          `Tần suất pattern: ${pattern.frequency}%`,
          pattern.description
        ],
        riskLevel: pattern.confidence > 75 ? 'low' : 'high'
      };

      predictions.push(prediction);
    }

    return predictions;
  }

  private trendingBasedPrediction(statistics: NumberStatistic[], count: number): PredictionResult[] {
    // Dự đoán dựa trên xu hướng tăng/giảm
    const trendingNumbers = statistics
      .filter(stat => {
        // Số có xu hướng tăng tần suất
        return stat.daysSinceLastAppear < stat.averageDaysBetween * 0.8;
      })
      .sort((a, b) => (a.averageDaysBetween - a.daysSinceLastAppear) - (b.averageDaysBetween - b.daysSinceLastAppear))
      .slice(0, count);

    return trendingNumbers.map(stat => {
      const expectationFactor = (stat.averageDaysBetween - stat.daysSinceLastAppear) / stat.averageDaysBetween;
      const confidence = Math.min(90, 50 + expectationFactor * 40);

      return {
        number: stat.number,
        probability: Math.max(0.1, expectationFactor),
        confidence,
        algorithm: 'trending',
        reasons: [
          `Chu kỳ trung bình: ${stat.averageDaysBetween.toFixed(1)} ngày`,
          `Đã qua: ${stat.daysSinceLastAppear} ngày`,
          'Đang trong chu kỳ dự kiến xuất hiện'
        ],
        riskLevel: confidence > 70 ? 'medium' : 'high'
      };
    });
  }

  private combinationPrediction(
    results: LotteryResult[], 
    statistics: NumberStatistic[], 
    count: number
  ): PredictionResult[] {
    // Kết hợp nhiều thuật toán
    const frequencyPreds = this.frequencyBasedPrediction(statistics, Math.ceil(count * 0.4));
    const patternPreds = this.patternBasedPrediction(results, Math.ceil(count * 0.3));
    const trendingPreds = this.trendingBasedPrediction(statistics, Math.ceil(count * 0.3));

    const combined = [...frequencyPreds, ...patternPreds, ...trendingPreds];
    
    // Loại bỏ trùng lặp và tính điểm tổng hợp
    const uniquePredictions = new Map<string, PredictionResult>();
    
    combined.forEach(pred => {
      const existing = uniquePredictions.get(pred.number);
      if (existing) {
        // Tăng confidence và probability cho số xuất hiện nhiều thuật toán
        existing.confidence = Math.min(95, existing.confidence + pred.confidence * 0.3);
        existing.probability = Math.min(0.95, existing.probability + pred.probability * 0.2);
        existing.reasons.push(...pred.reasons);
        existing.algorithm = 'combination';
      } else {
        uniquePredictions.set(pred.number, { ...pred });
      }
    });

    return Array.from(uniquePredictions.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, count);
  }

  private analyzePatterns(results: LotteryResult[]): Array<{
    type: string;
    nextNumber: string;
    probability: number;
    confidence: number;
    frequency: number;
    description: string;
  }> {
    // Phân tích patterns cơ bản
    const patterns = [];
    
    // Pattern 1: Số liên tiếp
    const consecutivePattern = this.findConsecutivePatterns(results);
    patterns.push(...consecutivePattern);
    
    // Pattern 2: Số đôi
    const pairPattern = this.findPairPatterns(results);
    patterns.push(...pairPattern);
    
    // Pattern 3: Tổng số trong khoảng
    const sumPattern = this.findSumPatterns(results);
    patterns.push(...sumPattern);

    return patterns;
  }  private findConsecutivePatterns(results: LotteryResult[]): Pattern[] {
    // Implementation for consecutive number patterns
    // This is a simplified version
    const patterns: Pattern[] = [];
    const recentResults = results.slice(0, 10);
    
    recentResults.forEach(result => {
      result.allNumbers.forEach(num => {
        const nextNum = (parseInt(num) + 1).toString().padStart(2, '0');
        if (parseInt(nextNum) <= 99) {
          patterns.push({
            type: 'consecutive',
            nextNumber: nextNum,
            probability: 0.15,
            confidence: 60,
            frequency: 15,
            description: `Số liên tiếp sau ${num}`
          });
        }
      });
    });

    return patterns.slice(0, 5); // Limit results
  }  private findPairPatterns(results: LotteryResult[]): Pattern[] {
    // Find pair patterns (simplified)
    console.log('Analyzing pair patterns for', results.length, 'results');
    const patterns: Pattern[] = [];
    
    // Add sample pattern for demo
    if (results.length > 0) {
      patterns.push({
        type: 'pair',
        nextNumber: '12',
        probability: 0.1,
        confidence: 45,
        frequency: 8,
        description: 'Cặp số thường xuất hiện'
      });
    }
    
    return patterns;
  }

  private findSumPatterns(results: LotteryResult[]): Pattern[] {
    // Find sum range patterns (simplified)
    console.log('Analyzing sum patterns for', results.length, 'results');
    const patterns: Pattern[] = [];
    
    // Add sample pattern for demo
    if (results.length > 0) {
      patterns.push({
        type: 'sum',
        nextNumber: '45',
        probability: 0.08,
        confidence: 38,
        frequency: 12,
        description: 'Số có tổng trong khoảng phổ biến'
      });
    }
    
    return patterns;
  }

  /**
   * Tính toán tỷ lệ trúng cho một bộ số
   */
  calculateWinProbability(
    numbers: string[], 
    type: 'lo2' | 'lo3' | 'lo4' | 'de',
    statistics: NumberStatistic[]
  ): number {
    const numberStats = numbers.map(num => 
      statistics.find(stat => stat.number === num)
    ).filter(Boolean);

    if (numberStats.length === 0) return 0.01; // 1% default

    // Tính xác suất dựa trên thống kê
    const avgFrequency = numberStats.reduce((sum, stat) => sum + stat!.frequency, 0) / numberStats.length;
    const avgHotScore = numberStats.reduce((sum, stat) => sum + stat!.hotScore, 0) / numberStats.length;

    let baseProbability = 0.01; // 1% base
    
    switch (type) {
      case 'lo2':
        baseProbability = 0.01; // 1%
        break;
      case 'lo3':
        baseProbability = 0.001; // 0.1%
        break;
      case 'lo4':
        baseProbability = 0.0001; // 0.01%
        break;
      case 'de':
        baseProbability = 0.01; // 1%
        break;
    }

    // Điều chỉnh dựa trên thống kê
    const frequencyMultiplier = 1 + (avgFrequency / 100);
    const hotMultiplier = 1 + (avgHotScore / 1000);

    return Math.min(0.5, baseProbability * frequencyMultiplier * hotMultiplier);
  }

  /**
   * Tạo báo cáo phân tích
   */
  async generateAnalysisReport(
    results: LotteryResult[],
    entries: LotteryEntry[],
    period: { from: Date; to: Date }
  ) {
    const statistics = await this.analyzeNumbers(results);
    const predictions = await this.generatePredictions(results, statistics);
    
    const report = {
      id: `report_${Date.now()}`,
      title: `Báo cáo phân tích lô đề ${period.from.toLocaleDateString()} - ${period.to.toLocaleDateString()}`,
      period,
      statistics: {
        totalResults: results.length,
        mostFrequentNumbers: statistics.slice(0, 10),
        leastFrequentNumbers: statistics.slice(-10),
        patterns: this.analyzePatterns(results)
      },
      predictions,
      entries: {
        total: entries.length,
        won: entries.filter(e => e.status === 'won').length,
        winRate: entries.length > 0 ? entries.filter(e => e.status === 'won').length / entries.length : 0
      },
      generatedAt: new Date()
    };

    return report;
  }
}
