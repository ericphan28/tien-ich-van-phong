const fs = require('fs').promises;
const path = require('path');

class SimpleModulePackager {
  constructor() {
    this.projectRoot = process.cwd();
    this.modulesDir = path.join(this.projectRoot, 'modules');
    this.outputDir = path.join(this.projectRoot, 'dist', 'packages');
  }

  async listModules() {
    console.log('📋 Danh sách modules có sẵn:');
    
    try {
      const modules = await fs.readdir(this.modulesDir);
      
      for (const module of modules) {
        const modulePath = path.join(this.modulesDir, module);
        const stats = await fs.stat(modulePath);
        
        if (stats.isDirectory()) {
          try {
            const manifestPath = path.join(modulePath, 'manifest.json');
            const manifestContent = await fs.readFile(manifestPath, 'utf-8');
            const manifest = JSON.parse(manifestContent);
            
            console.log(`  📦 ${module} - ${manifest.name} (v${manifest.version})`);
            console.log(`     🏷️  Category: ${manifest.category} | Tier: ${manifest.tier}`);
            console.log(`     📄 ${manifest.description}`);
            console.log('');
          } catch {
            console.log(`  📦 ${module} (không có manifest.json)`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Lỗi đọc thư mục modules:', error.message);
    }
  }

  async packageModuleToFolder(moduleId) {
    console.log(`📁 Đóng gói module ${moduleId} thành folder...`);
    
    try {
      const modulePath = path.join(this.modulesDir, moduleId);
      const manifestPath = path.join(modulePath, 'manifest.json');
      
      // Kiểm tra module tồn tại
      await fs.access(modulePath);
      
      // Đọc manifest
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent);
      
      // Tạo thư mục output
      const outputPath = path.join(this.outputDir, `${moduleId}-v${manifest.version}`);
      await fs.mkdir(outputPath, { recursive: true });
      
      // Copy files
      await this.copyRecursive(modulePath, outputPath);
      
      // Tạo package.json
      await this.createPackageJson(outputPath, manifest);
      
      // Tạo README.md
      await this.createReadme(outputPath, manifest);
      
      console.log(`✅ Đóng gói thành công: ${outputPath}`);
      
    } catch (error) {
      console.error(`❌ Lỗi đóng gói module ${moduleId}:`, error.message);
    }
  }

  async copyRecursive(src, dest) {
    const stats = await fs.stat(src);
    
    if (stats.isDirectory()) {
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(src);
      
      for (const entry of entries) {
        if (entry === 'node_modules') continue; // Bỏ qua node_modules
        
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        await this.copyRecursive(srcPath, destPath);
      }
    } else {
      await fs.copyFile(src, dest);
    }
  }

  async createPackageJson(outputPath, manifest) {
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

  async createReadme(outputPath, manifest) {
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
Ngày: ${new Date().toLocaleDateString('vi-VN')}
`;

    await fs.writeFile(path.join(outputPath, 'README.md'), readme);
  }

  async createStandalonePackage(moduleId) {
    console.log(`🏗️ Tạo standalone package cho module: ${moduleId}`);
    
    try {
      const modulePath = path.join(this.modulesDir, moduleId);
      const manifestPath = path.join(modulePath, 'manifest.json');
      
      // Kiểm tra module tồn tại
      await fs.access(modulePath);
      
      // Đọc manifest
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent);
      
      // Tạo thư mục standalone
      const outputPath = path.join(this.outputDir, `${moduleId}-standalone-v${manifest.version}`);
      await fs.mkdir(outputPath, { recursive: true });
      
      // Tạo thư mục src
      const srcPath = path.join(outputPath, 'src');
      await this.copyRecursive(modulePath, srcPath);
        // Tạo package.json cho standalone
      await this.createStandalonePackageJson(outputPath, manifest);
      
      // Tạo Next.js config files
      await this.createNextConfig(outputPath);
      
      // Tạo app structure
      await this.createAppStructure(outputPath, manifest);
      
      // Tạo setup script
      await this.createSetupScript(outputPath, manifest);
      
      // Tạo README.md
      await this.createStandaloneReadme(outputPath, manifest);
      
      console.log(`✅ Standalone package tạo thành công: ${outputPath}`);
      
    } catch (error) {
      console.error(`❌ Lỗi tạo standalone package cho ${moduleId}:`, error.message);
    }
  }

  async createStandalonePackageJson(outputPath, manifest) {
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

  async createSetupScript(outputPath, manifest) {    const setupScript = `#!/usr/bin/env node

console.log('🚀 Thiết lập module standalone: ${manifest.name}');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function setup() {
  try {
    console.log('📦 Cài đặt dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('✅ Thiết lập hoàn tất!');
    console.log('');
    console.log('Để chạy module:');
    console.log('  npm run dev    # Chế độ development');
    console.log('  npm run build  # Build production');
    console.log('  npm run start  # Chế độ production');
    console.log('');
    console.log('Truy cập tại: http://localhost:3000');
    console.log('Module route: ${manifest.route}');
    
  } catch (error) {
    console.error('❌ Lỗi thiết lập:', error.message);
    process.exit(1);
  }
}

setup();
`;

    await fs.writeFile(path.join(outputPath, 'setup.js'), setupScript);
  }

  async createStandaloneReadme(outputPath, manifest) {
    const readme = `# ${manifest.name} - Standalone Version

Đây là phiên bản standalone của module ${manifest.name} có thể chạy độc lập.

## Cài đặt & Chạy

1. **Thiết lập tự động**:
   \`\`\`bash
   node setup.js
   \`\`\`

2. **Thiết lập thủ công**:
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

## Truy cập

- Development: http://localhost:3000${manifest.route}

## Thông tin Module

- **Tên**: ${manifest.name}
- **Mô tả**: ${manifest.description}
- **Phiên bản**: ${manifest.version}
- **Danh mục**: ${manifest.category}
- **Tier**: ${manifest.tier}

---

Được tạo bởi Module Packager
Ngày: ${new Date().toLocaleDateString('vi-VN')}
`;

    await fs.writeFile(path.join(outputPath, 'README.md'), readme);
  }

  async createNextConfig(outputPath) {
    // Tạo next.config.js đúng format (thay vì .ts)
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
`;

    await fs.writeFile(path.join(outputPath, 'next.config.js'), nextConfig);
    
    // Tạo tsconfig.json
    const tsConfig = {
      "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "es6"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [
          {
            "name": "next"
          }
        ],
        "paths": {
          "@/*": ["./src/*"]
        }
      },
      "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      "exclude": ["node_modules"]
    };

    await fs.writeFile(
      path.join(outputPath, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
  }

  async createAppStructure(outputPath, manifest) {
    // Tạo pages/_app.js
    const pagesDir = path.join(outputPath, 'pages');
    await fs.mkdir(pagesDir, { recursive: true });
    
    const appJs = `import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
`;

    await fs.writeFile(path.join(pagesDir, '_app.js'), appJs);
    
    // Tạo pages/index.js
    const indexJs = `import Head from 'next/head'
import ModuleComponent from '../src/index'

export default function Home() {
  return (
    <div>
      <Head>
        <title>${manifest.name}</title>
        <meta name="description" content="${manifest.description}" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>${manifest.name}</h1>
        <ModuleComponent />
      </main>
    </div>
  )
}
`;

    await fs.writeFile(path.join(pagesDir, 'index.js'), indexJs);
    
    // Tạo styles/globals.css
    const stylesDir = path.join(outputPath, 'styles');
    await fs.mkdir(stylesDir, { recursive: true });
    
    const globalsCss = `html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
`;

    await fs.writeFile(path.join(stylesDir, 'globals.css'), globalsCss);
    
    // Tạo public/favicon.ico (placeholder)
    const publicDir = path.join(outputPath, 'public');
    await fs.mkdir(publicDir, { recursive: true });
  }
}

// CLI interface
const packager = new SimpleModulePackager();
const command = process.argv[2];
const moduleId = process.argv[3];

if (!command) {
  console.log(`
📦 Simple Module Packager

Sử dụng:
  node simple-packager.js list
  node simple-packager.js folder <module-id>
  node simple-packager.js standalone <module-id>

Ví dụ:
  node simple-packager.js list
  node simple-packager.js folder tax-calculator
  node simple-packager.js standalone qr-generator-v2
`);
  process.exit(0);
}

(async () => {
  try {
    switch (command) {
      case 'list':
        await packager.listModules();
        break;
      case 'folder':
        if (!moduleId) {
          console.error('❌ Vui lòng cung cấp module ID');
          process.exit(1);
        }
        await packager.packageModuleToFolder(moduleId);
        break;
      case 'standalone':
        if (!moduleId) {
          console.error('❌ Vui lòng cung cấp module ID');
          process.exit(1);
        }
        await packager.createStandalonePackage(moduleId);
        break;
      default:
        console.error(`❌ Lệnh không hợp lệ: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
})();
