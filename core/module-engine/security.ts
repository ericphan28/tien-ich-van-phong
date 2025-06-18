// Security scanner for module packages
import { ModuleFile } from './packaging';
import { ThirdPartyModuleManifest } from './sdk';

export interface SecurityScanResult {
  safe: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issues: SecurityIssue[];
  recommendations: string[];
  scanDuration: number;
}

export interface SecurityIssue {
  type: 'malware' | 'injection' | 'privacy' | 'permissions' | 'network' | 'files';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  file?: string;
  line?: number;
  code?: string;
  solution?: string;
}

export class ModuleSecurityScanner {
  
  // Main security scan function
  async scanModule(
    files: ModuleFile[], 
    manifest: ThirdPartyModuleManifest
  ): Promise<SecurityScanResult> {
    const startTime = Date.now();
    console.log(`🔍 Starting security scan for module: ${manifest.id}`);
    
    const issues: SecurityIssue[] = [];
    
    // 1. Scan manifest for security issues
    issues.push(...this.scanManifest(manifest));
    
    // 2. Scan all files for malicious content
    for (const file of files) {
      if (file.type === 'text') {
        issues.push(...this.scanFileContent(file));
      }
    }
    
    // 3. Check permissions
    issues.push(...this.scanPermissions(manifest.permissions || []));
    
    // 4. Check network access patterns
    issues.push(...this.scanNetworkUsage(files));
    
    // 5. Check file operations
    issues.push(...this.scanFileOperations(files));
    
    // 6. Generate overall risk assessment
    const riskLevel = this.calculateRiskLevel(issues);
    const recommendations = this.generateRecommendations(issues);
    
    const scanDuration = Date.now() - startTime;
    
    const result: SecurityScanResult = {
      safe: riskLevel !== 'critical' && !issues.some(i => i.severity === 'critical'),
      riskLevel,
      issues,
      recommendations,
      scanDuration
    };
    
    console.log(`✅ Security scan completed in ${scanDuration}ms. Risk level: ${riskLevel}`);
    return result;
  }

  // Scan manifest for security issues
  private scanManifest(manifest: ThirdPartyModuleManifest): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    // Check developer information
    if (!manifest.developer.email || !manifest.developer.email.includes('@')) {
      issues.push({
        type: 'privacy',
        severity: 'warning',
        message: 'Developer email không hợp lệ hoặc thiếu',
        solution: 'Cung cấp email developer hợp lệ để xác thực'
      });
    }
    
    // Check excessive permissions
    const permissions = manifest.permissions || [];
    if (permissions.length > 5) {
      issues.push({
        type: 'permissions',
        severity: 'warning',
        message: `Module yêu cầu quá nhiều quyền (${permissions.length})`,
        solution: 'Giảm số lượng quyền yêu cầu xuống mức tối thiểu cần thiết'
      });
    }
    
    // Check for dangerous permissions
    const dangerousPermissions = [
      'system.geolocation',
      'user.preferences',
      'network.download'
    ];
    
    permissions.forEach(permission => {
      if (dangerousPermissions.includes(permission)) {
        issues.push({
          type: 'permissions',
          severity: 'error',
          message: `Quyền nguy hiểm được yêu cầu: ${permission}`,
          solution: 'Chỉ yêu cầu quyền này nếu thực sự cần thiết cho chức năng chính'
        });
      }
    });
    
    return issues;
  }

  // Scan file content for malicious patterns
  private scanFileContent(file: ModuleFile): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const content = file.content as string;
    const lines = content.split('\n');
    
    // Dangerous JavaScript patterns
    const dangerousPatterns = [
      {
        pattern: /eval\s*\(/g,
        message: 'Sử dụng eval() có thể thực thi mã độc',
        severity: 'critical' as const,
        type: 'injection' as const
      },
      {
        pattern: /Function\s*\(/g,
        message: 'Sử dụng Function constructor có thể thực thi mã độc',
        severity: 'critical' as const,
        type: 'injection' as const
      },
      {
        pattern: /document\.write\s*\(/g,
        message: 'document.write có thể gây XSS',
        severity: 'error' as const,
        type: 'injection' as const
      },
      {
        pattern: /innerHTML\s*=/g,
        message: 'innerHTML có thể gây XSS nếu không sanitize',
        severity: 'warning' as const,
        type: 'injection' as const
      },
      {
        pattern: /dangerouslySetInnerHTML/g,
        message: 'dangerouslySetInnerHTML có thể gây XSS',
        severity: 'error' as const,
        type: 'injection' as const
      }
    ];
    
    // Network access patterns
    const networkPatterns = [
      {
        pattern: /fetch\s*\(/g,
        message: 'Module thực hiện network request',
        severity: 'info' as const,
        type: 'network' as const
      },
      {
        pattern: /XMLHttpRequest/g,
        message: 'Module sử dụng XMLHttpRequest',
        severity: 'info' as const,
        type: 'network' as const
      },
      {
        pattern: /ws:\/\/|wss:\/\//g,
        message: 'Module kết nối WebSocket',
        severity: 'warning' as const,
        type: 'network' as const
      }
    ];
    
    // Crypto/obfuscation patterns
    const cryptoPatterns = [
      {
        pattern: /btoa\s*\(/g,
        message: 'Module sử dụng base64 encoding',
        severity: 'info' as const,
        type: 'privacy' as const
      },
      {
        pattern: /atob\s*\(/g,
        message: 'Module sử dụng base64 decoding',
        severity: 'warning' as const,
        type: 'privacy' as const
      },
      {
        pattern: /crypto\./g,
        message: 'Module sử dụng Web Crypto API',
        severity: 'info' as const,
        type: 'privacy' as const
      }
    ];
    
    // Scan all patterns
    const allPatterns = [...dangerousPatterns, ...networkPatterns, ...cryptoPatterns];
    
    allPatterns.forEach(({ pattern, message, severity, type }) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const line = lines[lineNumber - 1];
        
        issues.push({
          type,
          severity,
          message,
          file: file.path,
          line: lineNumber,
          code: line?.trim(),
          solution: this.getSolutionForPattern(pattern.source)
        });
      }
    });
    
    return issues;
  }

  // Scan permissions for security issues
  private scanPermissions(permissions: string[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    // Check for permission combinations that might be suspicious
    const hasNetworkAccess = permissions.some(p => p.startsWith('network.'));
    const hasStorageAccess = permissions.some(p => p.startsWith('storage.'));
    const hasUserAccess = permissions.some(p => p.startsWith('user.'));
    
    if (hasNetworkAccess && hasStorageAccess && hasUserAccess) {
      issues.push({
        type: 'permissions',
        severity: 'warning',
        message: 'Module có quyền truy cập mạng, lưu trữ và thông tin người dùng',
        solution: 'Xem xét có thực sự cần tất cả các quyền này không'
      });
    }
    
    return issues;
  }

  // Scan for suspicious network usage patterns
  private scanNetworkUsage(files: ModuleFile[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    files.forEach(file => {
      if (file.type === 'text') {
        const content = file.content as string;
        
        // Check for hardcoded URLs that might be suspicious
        const urlPattern = /https?:\/\/([a-zA-Z0-9.-]+)/g;
        let match;
        
        while ((match = urlPattern.exec(content)) !== null) {
          const domain = match[1];
          
          // Check for suspicious domains
          if (this.isSuspiciousDomain(domain)) {
            issues.push({
              type: 'network',
              severity: 'error',
              message: `Kết nối đến domain đáng ngờ: ${domain}`,
              file: file.path,
              solution: 'Xác minh domain này có an toàn không'
            });
          }
        }
      }
    });
    
    return issues;
  }

  // Scan for suspicious file operations
  private scanFileOperations(files: ModuleFile[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    files.forEach(file => {
      if (file.type === 'text') {
        const content = file.content as string;
        
        // Check for localStorage usage without proper namespace
        if (content.includes('localStorage.') && !content.includes('module_')) {
          issues.push({
            type: 'files',
            severity: 'warning',
            message: 'localStorage được sử dụng mà không có namespace module',
            file: file.path,
            solution: 'Sử dụng namespace để tránh xung đột dữ liệu'
          });
        }
      }
    });
    
    return issues;
  }

  // Calculate overall risk level
  private calculateRiskLevel(issues: SecurityIssue[]): 'low' | 'medium' | 'high' | 'critical' {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const errorIssues = issues.filter(i => i.severity === 'error').length;
    const warningIssues = issues.filter(i => i.severity === 'warning').length;
    
    if (criticalIssues > 0) return 'critical';
    if (errorIssues > 2) return 'high';
    if (errorIssues > 0 || warningIssues > 3) return 'medium';
    return 'low';
  }

  // Generate security recommendations
  private generateRecommendations(issues: SecurityIssue[]): string[] {
    const recommendations: string[] = [];
    
    if (issues.some(i => i.type === 'injection')) {
      recommendations.push('Sử dụng sanitization library để tránh injection attacks');
    }
    
    if (issues.some(i => i.type === 'permissions')) {
      recommendations.push('Giảm thiểu quyền yêu cầu xuống mức tối thiểu cần thiết');
    }
    
    if (issues.some(i => i.type === 'network')) {
      recommendations.push('Khai báo rõ các domain được phép truy cập');
    }
    
    recommendations.push('Thực hiện code review thủ công cho các phần quan trọng');
    recommendations.push('Test module trong môi trường sandbox trước khi deploy');
    
    return recommendations;
  }

  // Helper functions
  private getSolutionForPattern(pattern: string): string {
    const solutions: Record<string, string> = {
      'eval\\s*\\(': 'Sử dụng JSON.parse() thay vì eval() cho parsing data',
      'Function\\s*\\(': 'Tránh dynamic code execution, sử dụng static functions',
      'innerHTML\\s*=': 'Sử dụng textContent hoặc DOM methods an toàn hơn',
      'dangerouslySetInnerHTML': 'Sanitize content trước khi render HTML'
    };
    
    return solutions[pattern] || 'Xem xét thay thế bằng phương pháp an toàn hơn';
  }

  private isSuspiciousDomain(domain: string): boolean {
    // Simple suspicious domain check
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
    const suspiciousPatterns = [
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
      /[a-z]{20,}\.com/, // Very long random domains
    ];
    
    return suspiciousTlds.some(tld => domain.endsWith(tld)) ||
           suspiciousPatterns.some(pattern => pattern.test(domain));
  }
}

// Global security scanner instance
export const moduleSecurityScanner = new ModuleSecurityScanner();
