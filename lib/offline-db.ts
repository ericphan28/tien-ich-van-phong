// IndexedDB utility for offline POS data management

interface Transaction {
  id: string;
  storeId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  timestamp: number;
  synced: boolean;
  cashierId?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode?: string;
  image?: string;
  lastUpdated: number;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  lastUpdated: number;
}

class OfflineDB {
  private db: IDBDatabase | null = null;
  private dbName = 'pos-offline-db';
  private version = 1;

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

        // Create transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
          transactionStore.createIndex('timestamp', 'timestamp', { unique: false });
          transactionStore.createIndex('synced', 'synced', { unique: false });
          transactionStore.createIndex('storeId', 'storeId', { unique: false });
        }

        // Create products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('category', 'category', { unique: false });
          productStore.createIndex('name', 'name', { unique: false });
          productStore.createIndex('barcode', 'barcode', { unique: true });
        }

        // Create customers store
        if (!db.objectStoreNames.contains('customers')) {
          const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
          customerStore.createIndex('phone', 'phone', { unique: false });
          customerStore.createIndex('name', 'name', { unique: false });
        }

        // Create app-settings store
        if (!db.objectStoreNames.contains('app-settings')) {
          db.createObjectStore('app-settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Transaction methods
  async saveTransaction(transaction: Transaction): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readwrite');
      const store = tx.objectStore('transactions');
      const request = store.put(transaction);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  async getUnsyncedTransactions(): Promise<Transaction[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readonly');
      const store = tx.objectStore('transactions');
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markTransactionSynced(transactionId: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readwrite');
      const store = tx.objectStore('transactions');
      const getRequest = store.get(transactionId);
      
      getRequest.onsuccess = () => {
        const transaction = getRequest.result;
        if (transaction) {
          transaction.synced = true;
          const putRequest = store.put(transaction);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readonly');
      const store = tx.objectStore('transactions');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Product methods
  async saveProducts(products: Product[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['products'], 'readwrite');
      const store = tx.objectStore('products');
      
      const promises = products.map(product => {
        return new Promise<void>((res, rej) => {
          const request = store.put(product);
          request.onsuccess = () => res();
          request.onerror = () => rej(request.error);
        });
      });

      Promise.all(promises)
        .then(() => resolve())
        .catch(reject);
    });
  }

  async getProducts(): Promise<Product[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['products'], 'readonly');
      const store = tx.objectStore('products');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async searchProducts(term: string): Promise<Product[]> {
    const products = await this.getProducts();
    const searchTerm = term.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.barcode && product.barcode.includes(searchTerm))
    );
  }

  // Customer methods
  async saveCustomers(customers: Customer[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['customers'], 'readwrite');
      const store = tx.objectStore('customers');
      
      const promises = customers.map(customer => {
        return new Promise<void>((res, rej) => {
          const request = store.put(customer);
          request.onsuccess = () => res();
          request.onerror = () => rej(request.error);
        });
      });

      Promise.all(promises)
        .then(() => resolve())
        .catch(reject);
    });
  }

  async getCustomers(): Promise<Customer[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['customers'], 'readonly');
      const store = tx.objectStore('customers');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async searchCustomers(term: string): Promise<Customer[]> {
    const customers = await this.getCustomers();
    const searchTerm = term.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm) ||
      (customer.phone && customer.phone.includes(searchTerm)) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm))
    );
  }
  // Settings methods
  async saveSetting(key: string, value: string | number | boolean | object): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['app-settings'], 'readwrite');
      const store = tx.objectStore('app-settings');
      const request = store.put({ key, value });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting(key: string): Promise<string | number | boolean | object | undefined> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['app-settings'], 'readonly');
      const store = tx.objectStore('app-settings');
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }
  // Data sync methods
  async getLastSyncTime(): Promise<number> {
    const result = await this.getSetting('lastSyncTime');
    return (typeof result === 'number' ? result : 0);
  }

  async setLastSyncTime(timestamp: number): Promise<void> {
    await this.saveSetting('lastSyncTime', timestamp);
  }

  // Clear all data (for testing or reset)
  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    const storeNames = ['transactions', 'products', 'customers', 'app-settings'];
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeNames, 'readwrite');
      const promises = storeNames.map(storeName => {
        return new Promise<void>((res, rej) => {
          const store = tx.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => res();
          request.onerror = () => rej(request.error);
        });
      });

      Promise.all(promises)
        .then(() => resolve())
        .catch(reject);
    });
  }
}

// Singleton instance
const offlineDB = new OfflineDB();

export default offlineDB;
export type { Transaction, Product, Customer };
