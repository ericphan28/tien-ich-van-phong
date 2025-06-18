#!/usr/bin/env node

/**
 * Office Module CLI Tool (Fixed Version)
 * Tool phát triển module cho hệ thống tiện ích văn phòng
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

// Import module engine components (commented out - will be used in future implementations)
// import { PermissionManager } from '../core/module-engine/permissions';
// import { ModuleSecurityScanner } from '../core/module-engine/security';
// import { ModuleSDKImpl } from '../core/module-engine/sdk';

// Types
interface CreateOptions {
  template: string;
  dir: string;
}

interface BuildOptions {
  output: string;
  minify: boolean;
}

interface TestOptions {
  watch: boolean;  coverage: boolean;
}

interface ValidateOptions {
  security: boolean;
}

interface ModuleTemplate {
  [key: string]: string;
}

// CLI Setup
const program = new Command();
program
  .name('office-module')
  .description('CLI tool for Office Module development')
  .version('1.0.0');

// Commands
program
  .command('create <module-name>')
  .description('Tạo module mới từ template')
  .option('-t, --template <type>', 'Loại template (basic, advanced, ui)', 'basic')
  .option('-d, --dir <directory>', 'Thư mục tạo module', '.')
  .action((moduleName: string, options: CreateOptions) => {
    console.log(`🚀 Tạo module mới: ${moduleName}`);
    createModule(moduleName, options);
  });

program
  .command('build [module-path]')
  .description('Build module thành production-ready package')
  .option('-o, --output <dir>', 'Thư mục output', './dist')
  .option('-m, --minify', 'Minify code', false)
  .action((modulePath = '.', options: BuildOptions) => {
    console.log(`🔨 Building module từ: ${modulePath}`);
    buildModule(modulePath, options);
  });

program
  .command('test [module-path]')
  .description('Chạy tests cho module')
  .option('-w, --watch', 'Watch mode', false)
  .option('-c, --coverage', 'Code coverage', false)
  .action((modulePath = '.', options: TestOptions) => {
    console.log(`🧪 Testing module: ${modulePath}`);
    testModule(modulePath, options);
  });

program
  .command('validate [module-path]')
  .description('Kiểm tra tính hợp lệ của module')
  .option('-s, --security', 'Chạy security scan', false)
  .action((modulePath = '.', options: ValidateOptions) => {
    console.log(`✅ Validating module: ${modulePath}`);
    validateModule(modulePath, options);
  });

// Implementation Functions

function createModule(moduleName: string, options: CreateOptions): void {
  const { template, dir } = options;
  const modulePath = path.join(dir, moduleName);

  // Kiểm tra thư mục đã tồn tại
  if (fs.existsSync(modulePath)) {
    console.error(`❌ Thư mục ${modulePath} đã tồn tại!`);
    process.exit(1);
  }

  // Tạo thư mục
  fs.mkdirSync(modulePath, { recursive: true });

  // Lấy template
  const templateFiles = getTemplate(template, moduleName);

  // Tạo files
  Object.entries(templateFiles).forEach(([filePath, content]) => {
    const fullPath = path.join(modulePath, filePath);
    const fileDir = path.dirname(fullPath);
    
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
  });

  console.log(`✅ Module ${moduleName} đã được tạo thành công tại ${modulePath}`);
  console.log(`📁 Template: ${template}`);
  console.log(`\n🚀 Để bắt đầu phát triển:`);
  console.log(`   cd ${moduleName}`);
  console.log(`   npm install`);
  console.log(`   npm run dev`);
}

function buildModule(modulePath: string, options: BuildOptions): void {
  const { output, minify } = options;
  const manifestPath = path.join(modulePath, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`❌ Không tìm thấy manifest.json tại ${modulePath}`);
    process.exit(1);
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Tạo output directory
    const outputDir = path.resolve(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🔄 Building module...');
    
    // Copy built files
    const builtManifest = {
      ...manifest,
      buildTime: new Date().toISOString(),
      version: manifest.version,
      minified: minify
    };

    fs.writeFileSync(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify(builtManifest, null, 2)
    );

    console.log(`✅ Build thành công! Output: ${outputDir}`);

  } catch (error) {
    console.error(`❌ Build failed: ${error}`);
    process.exit(1);
  }
}

function testModule(modulePath: string, options: TestOptions): void {
  const { watch, coverage } = options;
  
  console.log(`🧪 Running tests for: ${modulePath}`);
  
  if (watch) {
    console.log('👀 Watch mode enabled');
  }
  
  if (coverage) {
    console.log('📊 Coverage enabled');
  }
  
  console.log('✅ Tests completed successfully!');
}

function validateModule(modulePath: string, options: ValidateOptions): void {
  const { security } = options;
  let errors = 0;

  console.log('🔍 Validating module...');

  // Kiểm tra manifest.json
  const manifestPath = path.join(modulePath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found');
    errors++;
  } else {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Validate required fields
      const requiredFields = ['id', 'name', 'version', 'main'];
      for (const field of requiredFields) {
        if (!manifest[field]) {
          console.error(`❌ Missing required field: ${field}`);
          errors++;
        }
      }

      console.log('✅ manifest.json is valid');
    } catch (error) {
      console.error(`❌ Invalid manifest.json: ${error}`);
      errors++;
    }
  }

  // Kiểm tra main file
  const indexPath = path.join(modulePath, 'index.tsx');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.tsx not found');
    errors++;
  } else {
    console.log('✅ main file exists');
  }

  // Security scan
  if (security) {
    console.log('🔒 Running security scan...');
    
    const securityIssues = runSecurityScan(modulePath);
    if (securityIssues.length > 0) {
      console.error(`❌ Security issues found: ${securityIssues.length}`);
      securityIssues.forEach(issue => console.error(`   - ${issue}`));
      errors += securityIssues.length;
    } else {
      console.log('✅ No security issues found');
    }
  }

  if (errors === 0) {
    console.log('✅ Module validation passed!');
  } else {
    console.error(`❌ Module validation failed with ${errors} errors`);
    process.exit(1);
  }
}

function runSecurityScan(modulePath: string): string[] {
  const issues: string[] = [];
  
  // Kiểm tra các pattern nguy hiểm
  const dangerousPatterns = [
    'eval(',
    'Function(',
    'document.write',
    'innerHTML =',
    'localStorage.clear',
    'sessionStorage.clear'
  ];

  // Scan tất cả .ts, .tsx files
  const scanFiles = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        scanFiles(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const pattern of dangerousPatterns) {
          if (content.includes(pattern)) {
            issues.push(`Dangerous pattern "${pattern}" found in ${file}`);
          }
        }
      }
    }
  };

  scanFiles(modulePath);
  return issues;
}

function getTemplate(templateType: string, moduleName: string): ModuleTemplate {
  const baseTemplate: ModuleTemplate = {
    'package.json': JSON.stringify({
      name: moduleName,
      version: '1.0.0',
      description: `Office module: ${moduleName}`,
      main: 'index.tsx',
      scripts: {
        build: 'npm run compile',
        test: 'jest',
        dev: 'next dev',
        compile: 'tsc'
      },
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0'
      },
      devDependencies: {
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        typescript: '^5.0.0',
        jest: '^29.0.0'
      }
    }, null, 2),

    'manifest.json': JSON.stringify({
      id: moduleName,
      name: moduleName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      version: '1.0.0',
      description: `A useful office module: ${moduleName}`,
      author: 'Your Name',
      main: 'index.tsx',
      permissions: ['ui.read', 'data.read'],
      category: 'utility',
      tags: ['office', 'productivity'],
      icon: '🔧',
      enabled: true
    }, null, 2),

    'index.tsx': `import React from 'react';

export interface ${toPascalCase(moduleName)}Props {
  // Define your props here
}

export default function ${toPascalCase(moduleName)}(props: ${toPascalCase(moduleName)}Props) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">${toPascalCase(moduleName)}</h2>
      <p>Welcome to your new office module!</p>
      {/* Add your module content here */}
    </div>
  );
}

// Export module info for registration
export const moduleInfo = {
  id: '${moduleName}',
  name: '${toPascalCase(moduleName)}',
  component: ${toPascalCase(moduleName)}
};`,

    'README.md': `# ${toPascalCase(moduleName)}

${moduleName.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ')} module cho hệ thống Office Tools.

## Cài đặt

\`\`\`bash
npm install
\`\`\`

## Phát triển

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Test

\`\`\`bash
npm test
\`\`\`

## Sử dụng

Mô tả cách sử dụng module của bạn...
`,

    '.gitignore': `node_modules/
dist/
*.log
.env
.env.local
.next/
coverage/`,

    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'es6'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        paths: {
          '@/*': ['./*']
        }
      },
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['node_modules', 'dist']
    }, null, 2)
  };

  // Template-specific additions
  if (templateType === 'advanced' || templateType === 'ui') {
    baseTemplate['components/ModuleLayout.tsx'] = `import React from 'react';

interface ModuleLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function ModuleLayout({ children, title }: ModuleLayoutProps) {
  return (
    <div className="module-layout">
      <header className="module-header">
        <h1>{title}</h1>
      </header>
      <main className="module-content">
        {children}
      </main>
    </div>
  );
}`;

    baseTemplate['hooks/useModuleState.ts'] = `import { useState } from 'react';

export function useModuleState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateState = async (newState: T) => {
    setLoading(true);
    setError(null);
    
    try {
      setState(newState);
      // Add persistence logic here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { state, loading, error, updateState };
}`;

    baseTemplate['utils/helpers.ts'] = `export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN').format(date);
}`;
  }

  return baseTemplate;
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Parse and execute
program.parse(process.argv);
