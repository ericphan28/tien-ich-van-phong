#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { ModuleManifest } from '../core/module-engine/types';

interface PackageOptions {
  outputType: 'zip' | 'folder';
  outputPath: string;
  includeSource: boolean;
  includeNodeModules: boolean;
  minify: boolean;
}

interface ModulePackageResult {
  success: boolean;
  outputPath: string;
  size: number;
  errors: string[];
  warnings: string[];
}

export class ModulePackager {
  private projectRoot: string;
  private modulesDir: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.modulesDir = path.join(projectRoot, 'modules');
  }

  /**
   * Đóng gói một module thành file .zip hoặc folder
   */
  async packageModule(
    moduleId: string, 
    options: Partial<PackageOptions> = {}
  ): Promise<ModulePackageResult> {
    const defaultOptions: PackageOptions = {
      outputType: 'zip',
      outputPath: path.join(this.projectRoot, 'dist', 'packages'),
      includeSource: true,
      includeNodeModules: false,
      minify: false
    };

    const opts = { ...defaultOptions, ...options };
    const result: ModulePackageResult = {
      success: false,
      outputPath: '',
      size: 0,
      errors: [],
      warnings: []
    };

    try {
      console.log(`📦 Đang đóng gói module: ${moduleId}`);

      // 1. Kiểm tra module tồn tại
      const modulePath = path.join(this.modulesDir, moduleId);
      const moduleExists = await this.checkModuleExists(modulePath);
      if (!moduleExists) {
        result.errors.push(`Module ${moduleId} không tồn tại tại: ${modulePath}`);
        return result;
      }

      // 2. Đọc manifest
      const manifest = await this.readModuleManifest(modulePath);
      if (!manifest) {
        result.errors.push(`Không thể đọc manifest.json của module ${moduleId}`);
        return result;
      }

      // 3. Tạo thư mục output
      await fs.mkdir(opts.outputPath, { recursive: true });

      // 4. Tạo package theo định dạng
      if (opts.outputType === 'zip') {
        result.outputPath = await this.createZipPackage(moduleId, modulePath, manifest, opts);
      } else {
        result.outputPath = await this.createFolderPackage(moduleId, modulePath, manifest, opts);
      }

      // 5. Tính size
      const stats = await fs.stat(result.outputPath);
      result.size = stats.size;
      result.success = true;

      console.log(`✅ Đóng gói thành công: ${result.outputPath} (${this.formatSize(result.size)})`);

    } catch (error) {
      result.errors.push(`Lỗi đóng gói: ${error instanceof Error ? error.message : String(error)}`);
      console.error('❌ Lỗi đóng gói:', error);
    }

    return result;
  }

  /**
   * Đóng gói tất cả modules
   */
  async packageAllModules(options: Partial<PackageOptions> = {}): Promise<ModulePackageResult[]> {
    const modules = await this.getAllModules();
    const results: ModulePackageResult[] = [];

    for (const moduleId of modules) {
      const result = await this.packageModule(moduleId, options);
      results.push(result);
    }

    return results;
  }
  /**
   * Tạo package standalone (có thể chạy độc lập)
   */
  async createStandalonePackage(
    moduleId: string,
    options: Partial<PackageOptions> = {}
  ): Promise<ModulePackageResult> {
    console.log(`🏗️  Tạo standalone package cho module: ${moduleId}`);

    const defaultOptions: PackageOptions = {
      outputType: 'folder',
      outputPath: path.join(this.projectRoot, 'dist', 'packages'),
      includeSource: true,
      includeNodeModules: true,
      minify: false
    };

    const standaloneOptions = { ...defaultOptions, ...options };

    const modulePath = path.join(this.modulesDir, moduleId);
    const manifest = await this.readModuleManifest(modulePath);
    
    if (!manifest) {
      return {
        success: false,
        outputPath: '',
        size: 0,
        errors: [`Không thể đọc manifest của module ${moduleId}`],
        warnings: []
      };
    }

    // Tạo standalone folder với cấu trúc hoàn chỉnh
    return await this.createStandaloneFolderPackage(moduleId, modulePath, manifest, standaloneOptions);
  }

  // Private methods

  private async checkModuleExists(modulePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(modulePath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  private async readModuleManifest(modulePath: string): Promise<ModuleManifest | null> {
    try {
      const manifestPath = path.join(modulePath, 'manifest.json');
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      return JSON.parse(manifestContent) as ModuleManifest;
    } catch {
      return null;
    }
  }

  private async getAllModules(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.modulesDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    } catch {
      return [];
    }
  }  private async createZipPackage(
    moduleId: string,
    modulePath: string,
    manifest: ModuleManifest,
    options: PackageOptions
  ): Promise<string> {
    // Thay vì sử dụng archiver, tạo folder và hướng dẫn user tự zip
    const tempFolderPath = path.join(options.outputPath, `${moduleId}-v${manifest.version}`);
    await this.createFolderPackage(moduleId, modulePath, manifest, { ...options, outputType: 'folder' });
    
    console.log(`📁 Folder package tạo tại: ${tempFolderPath}`);
    console.log(`💡 Để tạo file .zip, hãy nén folder này bằng Windows Explorer hoặc 7-Zip`);
    
    return tempFolderPath;
  }

  private async createFolderPackage(
    moduleId: string,
    modulePath: string,
    manifest: ModuleManifest,
    options: PackageOptions
  ): Promise<string> {
    const outputPath = path.join(options.outputPath, `${moduleId}-v${manifest.version}`);
    
    // Tạo thư mục
    await fs.mkdir(outputPath, { recursive: true });

    // Copy files
    await this.copyModuleFiles(modulePath, outputPath, options);

    // Tạo package.json cho module
    await this.createModulePackageJson(outputPath, manifest);

    // Tạo README.md
    await this.createModuleReadme(outputPath, manifest);

    return outputPath;
  }

  private async createStandaloneFolderPackage(
    moduleId: string,
    modulePath: string,
    manifest: ModuleManifest,
    options: PackageOptions
  ): Promise<ModulePackageResult> {
    const outputPath = path.join(options.outputPath, `${moduleId}-standalone-v${manifest.version}`);
    
    try {
      // Tạo cấu trúc thư mục standalone
      await fs.mkdir(outputPath, { recursive: true });

      // Copy module files
      await this.copyModuleFiles(modulePath, path.join(outputPath, 'src'), options);

      // Tạo package.json standalone
      await this.createStandalonePackageJson(outputPath, manifest);

      // Copy dependencies cần thiết
      await this.copyEssentialDependencies(outputPath);

      // Tạo setup script
      await this.createSetupScript(outputPath, manifest);

      // Tạo documentation
      await this.createStandaloneDocumentation(outputPath, manifest);

      const stats = await fs.stat(outputPath);
      
      return {
        success: true,
        outputPath,
        size: stats.size,
        errors: [],
        warnings: []
      };

    } catch (error) {
      return {
        success: false,
        outputPath: '',
        size: 0,
        errors: [`Lỗi tạo standalone package: ${error instanceof Error ? error.message : String(error)}`],
        warnings: []
      };
    }
  }
  private addModuleFilesToPackage(
    modulePath: string,
    moduleId: string,
    // options: PackageOptions - unused for now
  ): void {
    // Tạo thông tin package
    const packageInfo = {
      name: moduleId,
      packagedAt: new Date().toISOString(),
      version: '1.0.0',
      type: 'external-module'
    };

    console.log(`📦 Đóng gói module: ${JSON.stringify(packageInfo, null, 2)}`);
  }

  private async copyModuleFiles(
    sourcePath: string,
    targetPath: string,
    options: PackageOptions
  ): Promise<void> {
    const copyRecursive = async (src: string, dest: string) => {
      const stats = await fs.stat(src);
      
      if (stats.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src);
        
        for (const entry of entries) {
          // Bỏ qua node_modules nếu không cần
          if (entry === 'node_modules' && !options.includeNodeModules) {
            continue;
          }
          
          await copyRecursive(path.join(src, entry), path.join(dest, entry));
        }
      } else {
        await fs.copyFile(src, dest);
      }
    };

    await copyRecursive(sourcePath, targetPath);
  }

  private async createModulePackageJson(outputPath: string, manifest: ModuleManifest): Promise<void> {
    const packageJson = {
      name: `@modules/${manifest.id}`,
      version: manifest.version,
      description: manifest.description,
      main: "index.tsx",
      module: "index.tsx",
      types: "index.d.ts",
      category: manifest.category,
      tier: manifest.tier,
      peerDependencies: {
        "react": "^18.0.0",
        "next": "^14.0.0"
      },
      keywords: [
        "module",
        "utility",
        manifest.category,
        "vietnamese"
      ],
      author: "Module Author",
      license: "MIT"
    };

    await fs.writeFile(
      path.join(outputPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }

  private async createModuleReadme(outputPath: string, manifest: ModuleManifest): Promise<void> {
    const readme = `# ${manifest.name}

${manifest.description}

## Thông tin Module

- **ID**: ${manifest.id}
- **Phiên bản**: ${manifest.version}
- **Danh mục**: ${manifest.category}
- **Tier**: ${manifest.tier}

## Cài đặt

\`\`\`bash
npm install @modules/${manifest.id}
\`\`\`

## Sử dụng

\`\`\`tsx
import ${manifest.id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}Module from '@modules/${manifest.id}';

function App() {
  return (
    <div>
      <${manifest.id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}Module />
    </div>
  );
}
\`\`\`

## Route

Module này được truy cập tại: \`${manifest.route}\`

## Icon

${manifest.icon}

---

Được đóng gói bởi Module Packager
`;

    await fs.writeFile(path.join(outputPath, 'README.md'), readme);
  }

  private async createStandalonePackageJson(outputPath: string, manifest: ModuleManifest): Promise<void> {
    const packageJson = {
      name: `${manifest.id}-standalone`,
      version: manifest.version,
      description: `Standalone version of ${manifest.name}`,
      main: "src/index.tsx",
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "setup": "node setup.js"
      },
      dependencies: {
        "next": "^14.0.0",
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "typescript": "^5.0.0"
      },
      keywords: [
        "standalone",
        "module",
        manifest.category
      ]
    };

    await fs.writeFile(
      path.join(outputPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }

  private async copyEssentialDependencies(outputPath: string): Promise<void> {
    // Copy các file config cần thiết
    const configFiles = [
      'next.config.ts',
      'tailwind.config.ts',
      'tsconfig.json',
      'postcss.config.mjs'
    ];

    for (const configFile of configFiles) {
      const sourcePath = path.join(this.projectRoot, configFile);
      const targetPath = path.join(outputPath, configFile);
      
      try {
        await fs.copyFile(sourcePath, targetPath);
      } catch {
        // File không tồn tại, bỏ qua
        console.log(`⚠️  Không tìm thấy ${configFile}, bỏ qua...`);
      }
    }
  }

  private async createSetupScript(outputPath: string, manifest: ModuleManifest): Promise<void> {
    const setupScript = `#!/usr/bin/env node

console.log('🚀 Thiết lập module standalone: ${manifest.name}');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function setup() {
  try {
    console.log('📦 Cài đặt dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('🏗️  Build module...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('✅ Thiết lập hoàn tất!');
    console.log('');
    console.log('Để chạy module:');
    console.log('  npm run dev    # Chế độ development');
    console.log('  npm run start  # Chế độ production');
    console.log('');
    console.log('Truy cập tại: http://localhost:3000${manifest.route}');
    
  } catch (error) {
    console.error('❌ Lỗi thiết lập:', error.message);
    process.exit(1);
  }
}

setup();
`;

    await fs.writeFile(path.join(outputPath, 'setup.js'), setupScript);
  }

  private async createStandaloneDocumentation(outputPath: string, manifest: ModuleManifest): Promise<void> {
    const documentation = `# ${manifest.name} - Standalone Version

Đây là phiên bản standalone của module ${manifest.name} có thể chạy độc lập.

## Cài đặt & Chạy

1. **Thiết lập tự động**:
   \`\`\`bash
   node setup.js
   \`\`\`

2. **Thiết lập thủ công**:
   \`\`\`bash
   npm install
   npm run build
   npm run dev
   \`\`\`

## Truy cập

- Development: http://localhost:3000${manifest.route}
- Production: http://localhost:3000${manifest.route}

## Thông tin Module

- **Tên**: ${manifest.name}
- **Mô tả**: ${manifest.description}
- **Phiên bản**: ${manifest.version}
- **Danh mục**: ${manifest.category}
- **Tier**: ${manifest.tier}

## Cấu trúc Thư mục

\`\`\`
${manifest.id}-standalone-v${manifest.version}/
├── src/                 # Module source code
├── package.json         # Dependencies & scripts
├── setup.js            # Setup script
├── next.config.ts      # Next.js config
├── tailwind.config.ts  # Tailwind config
├── tsconfig.json       # TypeScript config
└── README.md           # Hướng dẫn này
\`\`\`

## Customization

Bạn có thể tùy chỉnh module bằng cách chỉnh sửa files trong thư mục \`src/\`.

## Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Node.js version >= 18
2. npm version >= 8
3. Tất cả dependencies đã được cài đặt

---

Được tạo bởi Module Packager
Ngày: ${new Date().toLocaleDateString('vi-VN')}
`;

    await fs.writeFile(path.join(outputPath, 'README.md'), documentation);
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

// CLI interface
if (require.main === module) {
  const packager = new ModulePackager();
  
  const args = process.argv.slice(2);
  const command = args[0];
  const moduleId = args[1];

  if (!command) {
    console.log(`
📦 Module Packager

Sử dụng:
  node module-packager.ts package <module-id>     # Đóng gói module thành .zip
  node module-packager.ts folder <module-id>      # Đóng gói module thành folder
  node module-packager.ts standalone <module-id>  # Tạo standalone package
  node module-packager.ts package-all             # Đóng gói tất cả modules

Ví dụ:
  node module-packager.ts package tax-calculator
  node module-packager.ts standalone qr-generator-v2
`);
    process.exit(0);
  }

  (async () => {
    try {
      switch (command) {
        case 'package':
          if (!moduleId) {
            console.error('❌ Vui lòng cung cấp module ID');
            process.exit(1);
          }
          await packager.packageModule(moduleId, { outputType: 'zip' });
          break;

        case 'folder':
          if (!moduleId) {
            console.error('❌ Vui lòng cung cấp module ID');
            process.exit(1);
          }
          await packager.packageModule(moduleId, { outputType: 'folder' });
          break;        case 'standalone':
          if (!moduleId) {
            console.error('❌ Vui lòng cung cấp module ID');
            process.exit(1);
          }
          const standaloneResult = await packager.createStandalonePackage(moduleId);
          if (standaloneResult.success) {
            console.log(`✅ Standalone package tạo thành công: ${standaloneResult.outputPath}`);
          } else {
            console.error(`❌ Lỗi tạo standalone package: ${standaloneResult.errors.join(', ')}`);
          }
          break;

        case 'package-all':
          const results = await packager.packageAllModules({ outputType: 'zip' });
          console.log(`\n📊 Kết quả đóng gói ${results.length} modules:`);
          results.forEach(result => {
            if (result.success) {
              console.log(`✅ ${path.basename(result.outputPath)}`);
            } else {
              console.log(`❌ ${result.errors.join(', ')}`);
            }
          });
          break;

        default:
          console.error(`❌ Lệnh không hợp lệ: ${command}`);
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Lỗi:', error);
      process.exit(1);
    }
  })();
}

export default ModulePackager;
