"use client";

// Types for offline transactions
export interface OfflineTransaction {
  id: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  customer?: {
    id: string;
    name: string;
    phone: string;
  };
  total: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  paymentMethod: 'cash' | 'card' | 'transfer';
  timestamp: Date;
  synced: boolean;
  cashier?: string;
  notes?: string;
}

export interface OfflineCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  synced: boolean;
  lastModified: Date;
}

export interface OfflineProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  unit: string;
  barcode?: string;
  synced: boolean;
  lastModified: Date;
}

// IndexedDB wrapper for offline data
class OfflineDB {
  private dbName = 'POSOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
          transactionStore.createIndex('synced', 'synced', { unique: false });
          transactionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Customers store
        if (!db.objectStoreNames.contains('customers')) {
          const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
          customerStore.createIndex('synced', 'synced', { unique: false });
          customerStore.createIndex('phone', 'phone', { unique: false });
        }

        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('synced', 'synced', { unique: false });
          productStore.createIndex('category', 'category', { unique: false });
        }
      };
    });
  }

  async add<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get<T>(storeName: string, key: string): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getByIndex<T>(storeName: string, indexName: string, value: IDBValidKey): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Main Offline POS Manager
export class OfflinePOSManager {
  private db: OfflineDB;
  private syncInProgress = false;

  constructor() {
    this.db = new OfflineDB();
    this.init();
  }

  private async init() {
    try {
      await this.db.init();
      console.log('OfflinePOSManager initialized');
      
      // Auto-sync when online
      window.addEventListener('online', () => {
        console.log('Back online - starting sync...');
        this.syncAll();
      });

      // Initial sync if online
      if (navigator.onLine) {
        this.syncAll();
      }
    } catch (error) {
      console.error('Failed to initialize OfflinePOSManager:', error);
    }
  }

  // Transaction methods
  async saveTransaction(transaction: Omit<OfflineTransaction, 'synced'>): Promise<void> {
    const offlineTransaction: OfflineTransaction = {
      ...transaction,
      synced: false
    };

    try {
      await this.db.put('transactions', offlineTransaction);
      console.log('Transaction saved offline:', transaction.id);

      // Try to sync immediately if online
      if (navigator.onLine) {
        this.syncTransaction(offlineTransaction);
      }
    } catch (error) {
      console.error('Failed to save transaction:', error);
      throw error;
    }
  }

  async getUnsyncedTransactions(): Promise<OfflineTransaction[]> {
    try {
      return await this.db.getByIndex<OfflineTransaction>('transactions', 'synced', 0); // 0 = false
    } catch (error) {
      console.error('Failed to get unsynced transactions:', error);
      return [];
    }
  }

  async getAllTransactions(): Promise<OfflineTransaction[]> {
    try {
      return await this.db.getAll<OfflineTransaction>('transactions');
    } catch (error) {
      console.error('Failed to get all transactions:', error);
      return [];
    }
  }
  async markTransactionSynced(transactionId: string): Promise<void> {
    try {
      const transaction = await this.db.get<OfflineTransaction>('transactions', transactionId);
      if (transaction) {
        transaction.synced = true;
        await this.db.put<OfflineTransaction>('transactions', transaction);
        console.log('Transaction marked as synced:', transactionId);
      }
    } catch (error) {
      console.error('Failed to mark transaction as synced:', error);
    }
  }

  // Customer methods
  async saveCustomer(customer: Omit<OfflineCustomer, 'synced' | 'lastModified'>): Promise<void> {
    const offlineCustomer: OfflineCustomer = {
      ...customer,
      synced: false,
      lastModified: new Date()
    };

    try {
      await this.db.put('customers', offlineCustomer);
      console.log('Customer saved offline:', customer.id);
    } catch (error) {
      console.error('Failed to save customer:', error);
      throw error;
    }
  }

  async getCustomers(): Promise<OfflineCustomer[]> {
    try {
      return await this.db.getAll<OfflineCustomer>('customers');
    } catch (error) {
      console.error('Failed to get customers:', error);
      return [];
    }
  }

  // Product methods
  async saveProduct(product: Omit<OfflineProduct, 'synced' | 'lastModified'>): Promise<void> {
    const offlineProduct: OfflineProduct = {
      ...product,
      synced: false,
      lastModified: new Date()
    };

    try {
      await this.db.put('products', offlineProduct);
      console.log('Product saved offline:', product.id);
    } catch (error) {
      console.error('Failed to save product:', error);
      throw error;
    }
  }

  async getProducts(): Promise<OfflineProduct[]> {
    try {
      return await this.db.getAll<OfflineProduct>('products');
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  // Sync methods
  async syncTransaction(transaction: OfflineTransaction): Promise<boolean> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });

      if (response.ok) {
        await this.markTransactionSynced(transaction.id);
        return true;
      } else {
        console.error('Failed to sync transaction:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Sync transaction error:', error);
      return false;
    }
  }

  async syncAll(): Promise<void> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return;
    }

    this.syncInProgress = true;
    console.log('Starting sync...');

    try {
      // Sync transactions
      const unsyncedTransactions = await this.getUnsyncedTransactions();
      for (const transaction of unsyncedTransactions) {
        await this.syncTransaction(transaction);
      }

      console.log(`Synced ${unsyncedTransactions.length} transactions`);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Network status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Statistics
  async getOfflineStats() {
    try {
      const unsyncedTransactions = await this.getUnsyncedTransactions();
      const allTransactions = await this.getAllTransactions();
      
      return {
        unsyncedCount: unsyncedTransactions.length,
        totalCount: allTransactions.length,
        lastSync: this.getLastSyncTime()
      };
    } catch (error) {
      console.error('Failed to get offline stats:', error);
      return { unsyncedCount: 0, totalCount: 0, lastSync: null };
    }
  }

  private getLastSyncTime(): Date | null {
    const lastSync = localStorage.getItem('lastSyncTime');
    return lastSync ? new Date(lastSync) : null;
  }

  private setLastSyncTime(): void {
    localStorage.setItem('lastSyncTime', new Date().toISOString());
  }
}

// Singleton instance
export const offlinePOSManager = new OfflinePOSManager();
