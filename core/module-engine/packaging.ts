// Module package format and validation
import { ThirdPartyModuleManifest } from './sdk';

export interface ModulePackageInfo {
  manifest: ThirdPartyModuleManifest;
  files: ModuleFile[];
  checksum: string;
  signature?: string;
  packagedAt: Date;
  packagedBy: string;
  size: number;
}

export interface ModuleFile {
  path: string;
  content: string | ArrayBuffer;
  size: number;
  type: 'text' | 'binary' | 'image' | 'data';
  encoding?: string;
}

export interface PackageValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  securityIssues: string[];
  size: number;
  fileCount: number;
}

export class ModulePackager {
  
  // Pack module into .module file (ZIP format)
  async packModule(modulePath: string, manifest: ThirdPartyModuleManifest): Promise<Blob> {
    console.log(`📦 Packing module from: ${modulePath}`);
    
    // 1. Validate manifest
    const manifestValidation = this.validateManifest(manifest);
    if (!manifestValidation.valid) {
      throw new Error(`Manifest validation failed: ${manifestValidation.errors.join(', ')}`);
    }

    // 2. Collect all module files
    const files = await this.collectModuleFiles(modulePath);
    
    // 3. Validate package content
    const packageValidation = this.validatePackage(files, manifest);
    if (!packageValidation.valid) {
      throw new Error(`Package validation failed: ${packageValidation.errors.join(', ')}`);
    }

    // 4. Create package info
    const packageInfo: ModulePackageInfo = {
      manifest,
      files,
      checksum: await this.calculateChecksum(files),
      packagedAt: new Date(),
      packagedBy: 'current-user', // TODO: Get real user
      size: files.reduce((total, file) => total + file.size, 0)
    };

    // 5. Create ZIP file
    const zipBlob = await this.createZipFile(packageInfo);
    
    console.log(`✅ Module packed successfully (${packageInfo.size} bytes)`);
    return zipBlob;
  }

  // Unpack module from .module file
  async unpackModule(packageBlob: Blob): Promise<ModulePackageInfo> {
    console.log(`📂 Unpacking module...`);
    
    // 1. Extract ZIP file
    const extractedFiles = await this.extractZipFile(packageBlob);
    
    // 2. Find and parse manifest
    const manifestFile = extractedFiles.find(f => f.path === 'manifest.json');
    if (!manifestFile) {
      throw new Error('Manifest file not found in package');
    }
    
    const manifest = JSON.parse(manifestFile.content as string) as ThirdPartyModuleManifest;
    
    // 3. Validate extracted package
    const validation = this.validatePackage(extractedFiles, manifest);
    if (!validation.valid) {
      throw new Error(`Package validation failed: ${validation.errors.join(', ')}`);
    }

    // 4. Verify checksum
    const calculatedChecksum = await this.calculateChecksum(extractedFiles);
    const packageInfoFile = extractedFiles.find(f => f.path === 'package-info.json');
    if (packageInfoFile) {
      const packageInfo = JSON.parse(packageInfoFile.content as string) as ModulePackageInfo;
      if (packageInfo.checksum !== calculatedChecksum) {
        throw new Error('Package checksum verification failed');
      }
    }

    const packageInfo: ModulePackageInfo = {
      manifest,
      files: extractedFiles.filter(f => f.path !== 'package-info.json'),
      checksum: calculatedChecksum,
      packagedAt: new Date(),
      packagedBy: 'unknown',
      size: extractedFiles.reduce((total, file) => total + file.size, 0)
    };

    console.log(`✅ Module unpacked successfully`);
    return packageInfo;
  }

  // Validate manifest structure
  validateManifest(manifest: ThirdPartyModuleManifest): PackageValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Required fields
    if (!manifest.id) errors.push('Missing required field: id');
    if (!manifest.name) errors.push('Missing required field: name');
    if (!manifest.version) errors.push('Missing required field: version');
    if (!manifest.developer?.name) errors.push('Missing required field: developer.name');
    if (!manifest.developer?.email) errors.push('Missing required field: developer.email');
    
    // Validate ID format
    if (manifest.id && !/^[a-z0-9-]+$/.test(manifest.id)) {
      errors.push('Module ID must contain only lowercase letters, numbers, and dashes');
    }
    
    // Validate version format (semantic versioning)
    if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
      errors.push('Version must follow semantic versioning (e.g., 1.0.0)');
    }
    
    // Validate permissions
    if (manifest.permissions && manifest.permissions.length > 10) {
      warnings.push('Module requests many permissions, consider reducing them');
    }
    
    // Validate compatibility
    if (!manifest.compatibility?.minSystemVersion) {
      warnings.push('Missing minimum system version requirement');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      securityIssues: [],
      size: 0,
      fileCount: 0
    };
  }  // Validate package content
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validatePackage(files: ModuleFile[], _manifest: ThirdPartyModuleManifest): PackageValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const securityIssues: string[] = [];
    
    // Check required files
    const requiredFiles = ['index.js', 'index.tsx', 'package.json'];
    const hasEntryPoint = requiredFiles.some(file => 
      files.some(f => f.path.endsWith(file))
    );
    
    if (!hasEntryPoint) {
      errors.push('Missing entry point file (index.js or index.tsx)');
    }

    // Check file sizes
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const largeFiles = files.filter(f => f.size > maxFileSize);
    if (largeFiles.length > 0) {
      errors.push(`Files too large: ${largeFiles.map(f => f.path).join(', ')}`);
    }

    // Check total package size
    const totalSize = files.reduce((total, file) => total + file.size, 0);
    const maxPackageSize = 50 * 1024 * 1024; // 50MB
    if (totalSize > maxPackageSize) {
      errors.push(`Package too large: ${totalSize} bytes (max: ${maxPackageSize})`);
    }

    // Security checks
    files.forEach(file => {
      // Check for suspicious file paths
      if (file.path.includes('..') || file.path.startsWith('/')) {
        securityIssues.push(`Suspicious file path: ${file.path}`);
      }
      
      // Check for executable files
      const executableExtensions = ['.exe', '.bat', '.sh', '.cmd'];
      if (executableExtensions.some(ext => file.path.endsWith(ext))) {
        securityIssues.push(`Executable file not allowed: ${file.path}`);
      }
      
      // Check for sensitive content in text files
      if (file.type === 'text') {
        const content = file.content as string;
        if (content.includes('eval(') || content.includes('Function(')) {
          securityIssues.push(`Potentially dangerous code in: ${file.path}`);
        }
      }
    });

    return {
      valid: errors.length === 0 && securityIssues.length === 0,
      errors,
      warnings,
      securityIssues,
      size: totalSize,
      fileCount: files.length
    };
  }

  // Mock functions - would be implemented with real file system/zip libraries
  private async collectModuleFiles(modulePath: string): Promise<ModuleFile[]> {
    // TODO: Implement real file collection
    console.log(`Collecting files from: ${modulePath}`);
    return [
      {
        path: 'index.tsx',
        content: 'export default function MyModule() { return <div>Hello</div>; }',
        size: 1024,
        type: 'text'
      },
      {
        path: 'manifest.json',
        content: JSON.stringify({}, null, 2),
        size: 512,
        type: 'text'
      }
    ];
  }

  private async createZipFile(packageInfo: ModulePackageInfo): Promise<Blob> {
    // TODO: Implement real ZIP creation
    console.log(`Creating ZIP file for package:`, packageInfo);
    return new Blob(['mock zip content'], { type: 'application/zip' });
  }

  private async extractZipFile(zipBlob: Blob): Promise<ModuleFile[]> {
    // TODO: Implement real ZIP extraction
    console.log(`Extracting ZIP file:`, zipBlob);
    return [
      {
        path: 'manifest.json',
        content: '{"id": "test", "name": "Test Module"}',
        size: 100,
        type: 'text'
      }
    ];
  }

  private async calculateChecksum(files: ModuleFile[]): Promise<string> {
    // TODO: Implement real checksum calculation (SHA-256)
    const content = files.map(f => f.path + f.content).join('');
    return 'mock-checksum-' + content.length;
  }
}

// Utility functions for module package operations
export const modulePackager = new ModulePackager();

export function createModulePackage(
  files: Record<string, string>,
  manifest: ThirdPartyModuleManifest
): ModulePackageInfo {
  const moduleFiles: ModuleFile[] = Object.entries(files).map(([path, content]) => ({
    path,
    content,
    size: content.length,
    type: 'text' as const
  }));

  return {
    manifest,
    files: moduleFiles,
    checksum: 'mock-checksum',
    packagedAt: new Date(),
    packagedBy: 'developer',
    size: moduleFiles.reduce((total, file) => total + file.size, 0)
  };
}

export function validateModulePackage(packageInfo: ModulePackageInfo): PackageValidationResult {
  return modulePackager.validatePackage(packageInfo.files, packageInfo.manifest);
}
