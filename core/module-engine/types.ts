export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'finance' | 'utility' | 'productivity' | 'business';
  tier: 'free' | 'premium' | 'enterprise';
  route: string;
  icon: string;
  enabled: boolean;
  pricing?: {
    type: 'free' | 'subscription' | 'usage_based';
    plans?: {
      [key: string]: {
        price: number;
        currency: string;
        features: string[];
      };
    };
  };
  limits?: {
    free?: {
      usage_per_month: number;
      features: string[];
    };
    premium?: {
      usage_per_month: number | 'unlimited';
      features: string[];
    };
  };
}

export interface ModuleContext {
  userId: string;
  userPlan: 'free' | 'premium' | 'enterprise';
  moduleId: string;
  permissions: string[];
}

export interface AccessResult {
  allowed: boolean;
  reason?: 'upgrade_required' | 'limit_exceeded' | 'permission_denied';
  upgradeUrl?: string;
  resetDate?: Date;
  remainingUsage?: number;
}

export interface ModuleUsage {
  count: number;
  lastUsed: Date;
  monthlyUsage: number;
}
