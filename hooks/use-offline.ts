'use client';

import { useState, useEffect, useCallback } from 'react';
import offlineDB, { type Transaction, type Product, type Customer } from '@/lib/offline-db';

interface UseOfflineOptions {
  enableSync?: boolean;
  syncInterval?: number;
}

export function useOffline(options: UseOfflineOptions = {}) {
  const { enableSync = true, syncInterval = 30000 } = options; // 30 seconds default
  
  const [isOnline, setIsOnline] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Initialize offline database
  useEffect(() => {
    const initDB = async () => {
      try {
        await offlineDB.init();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize offline DB:', error);
      }
    };

    initDB();
  }, []);
  // Monitor online status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  // Sync offline data with server
  const syncOfflineData = useCallback(async () => {
    if (!isOnline || !isInitialized) return;

    try {
      setSyncStatus('syncing');
      
      // Sync transactions
      const unsyncedTransactions = await offlineDB.getUnsyncedTransactions();
      for (const transaction of unsyncedTransactions) {
        try {
          const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
          });

          if (response.ok) {
            await offlineDB.markTransactionSynced(transaction.id);
          } else {
            console.error('Failed to sync transaction:', transaction.id);
          }
        } catch (error) {
          console.error('Error syncing transaction:', error);
        }
      }

      // Update last sync time
      await offlineDB.setLastSyncTime(Date.now());
      setSyncStatus('success');
      
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  }, [isOnline, isInitialized]);

  // Auto sync when online
  useEffect(() => {
    if (!isOnline || !enableSync || !isInitialized) return;

    const interval = setInterval(() => {
      syncOfflineData();
    }, syncInterval);

    // Initial sync when coming online
    syncOfflineData();

    return () => clearInterval(interval);
  }, [isOnline, enableSync, isInitialized, syncInterval, syncOfflineData]);

  // Save transaction (offline-first)
  const saveTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'timestamp' | 'synced'>) => {
    if (!isInitialized) throw new Error('Database not initialized');

    const fullTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false
    };

    // Save to offline DB first
    await offlineDB.saveTransaction(fullTransaction);

    // Try to sync immediately if online
    if (isOnline) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullTransaction)
        });

        if (response.ok) {
          await offlineDB.markTransactionSynced(fullTransaction.id);
        }
      } catch (error) {
        console.log('Will sync later when online:', error);
      }
    }

    return fullTransaction;
  }, [isInitialized, isOnline]);

  // Get all transactions (from offline DB)
  const getTransactions = useCallback(async () => {
    if (!isInitialized) return [];
    return await offlineDB.getAllTransactions();
  }, [isInitialized]);

  // Cache products for offline use
  const cacheProducts = useCallback(async (products: Product[]) => {
    if (!isInitialized) return;
    
    const productsWithTimestamp = products.map(product => ({
      ...product,
      lastUpdated: Date.now()
    }));
    
    await offlineDB.saveProducts(productsWithTimestamp);
  }, [isInitialized]);

  // Get products (offline-first)
  const getProducts = useCallback(async (): Promise<Product[]> => {
    if (!isInitialized) return [];

    try {
      // Try to get fresh data if online
      if (isOnline) {
        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          await cacheProducts(products);
          return products;
        }
      }
    } catch (error) {
      console.log('Using cached products:', error);
    }

    // Fallback to cached data
    return await offlineDB.getProducts();
  }, [isInitialized, isOnline, cacheProducts]);

  // Search products (offline)
  const searchProducts = useCallback(async (term: string): Promise<Product[]> => {
    if (!isInitialized) return [];
    return await offlineDB.searchProducts(term);
  }, [isInitialized]);

  // Cache customers for offline use
  const cacheCustomers = useCallback(async (customers: Customer[]) => {
    if (!isInitialized) return;
    
    const customersWithTimestamp = customers.map(customer => ({
      ...customer,
      lastUpdated: Date.now()
    }));
    
    await offlineDB.saveCustomers(customersWithTimestamp);
  }, [isInitialized]);

  // Get customers (offline-first)
  const getCustomers = useCallback(async (): Promise<Customer[]> => {
    if (!isInitialized) return [];

    try {
      // Try to get fresh data if online
      if (isOnline) {
        const response = await fetch('/api/customers');
        if (response.ok) {
          const customers = await response.json();
          await cacheCustomers(customers);
          return customers;
        }
      }
    } catch (error) {
      console.log('Using cached customers:', error);
    }

    // Fallback to cached data
    return await offlineDB.getCustomers();
  }, [isInitialized, isOnline, cacheCustomers]);

  // Search customers (offline)
  const searchCustomers = useCallback(async (term: string): Promise<Customer[]> => {
    if (!isInitialized) return [];
    return await offlineDB.searchCustomers(term);
  }, [isInitialized]);

  // Get sync statistics
  const getSyncStats = useCallback(async () => {
    if (!isInitialized) return { unsynced: 0, total: 0, lastSync: 0 };

    const [unsyncedTransactions, allTransactions, lastSync] = await Promise.all([
      offlineDB.getUnsyncedTransactions(),
      offlineDB.getAllTransactions(),
      offlineDB.getLastSyncTime()
    ]);

    return {
      unsynced: unsyncedTransactions.length,
      total: allTransactions.length,
      lastSync
    };
  }, [isInitialized]);

  return {
    isOnline,
    isInitialized,
    syncStatus,
    
    // Transaction methods
    saveTransaction,
    getTransactions,
    
    // Product methods
    getProducts,
    searchProducts,
    cacheProducts,
    
    // Customer methods
    getCustomers,
    searchCustomers,
    cacheCustomers,
    
    // Sync methods
    syncOfflineData,
    getSyncStats
  };
}
