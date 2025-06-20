const CACHE_NAME = 'pos-system-v1';
const STATIC_CACHE_NAME = 'pos-static-v1';
const DYNAMIC_CACHE_NAME = 'pos-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/dashboard/pos',
  '/dashboard/products',
  '/dashboard/customers',
  '/dashboard/inventory',
  '/dashboard/reports',
  '/manifest.json',
  '/favicon.ico'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/products',
  '/api/customers',
  '/api/categories'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    // Cache-first strategy for static assets
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (isAPIRequest(request)) {
    // Network-first strategy for API calls
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else if (isNavigationRequest(request)) {
    // Stale-while-revalidate for page navigation
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  } else {
    // Default strategy
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  }
});

// Background sync for offline transactions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'pos-sync') {
    event.waitUntil(syncOfflineTransactions());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Thông báo từ POS System',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/dashboard'
    }
  };

  event.waitUntil(
    self.registration.showNotification('POS System', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/dashboard')
  );
});

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/_next/static/') || 
         url.pathname.startsWith('/icons/') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js');
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Cache strategies
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache-first failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Content not available offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Fetch from network in background
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  // Return cached version immediately if available
  return cachedResponse || networkPromise;
}

// Sync offline transactions
async function syncOfflineTransactions() {
  try {
    // Get offline transactions from IndexedDB
    const offlineTransactions = await getOfflineTransactions();
    
    for (const transaction of offlineTransactions) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });
        
        if (response.ok) {
          // Mark as synced
          await markTransactionSynced(transaction.id);
          console.log('Synced transaction:', transaction.id);
        } else {
          console.error('Failed to sync transaction:', transaction.id, response.status);
        }
      } catch (error) {
        console.error('Failed to sync transaction:', transaction.id, error);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function getOfflineTransactions() {
  try {
    // Open IndexedDB connection
    const db = await openDB();
    const tx = db.transaction(['transactions'], 'readonly');
    const store = tx.objectStore('transactions');
    const index = store.index('synced');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(false));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get offline transactions:', error);
    return [];
  }
}

async function markTransactionSynced(transactionId) {
  try {
    const db = await openDB();
    const tx = db.transaction(['transactions'], 'readwrite');
    const store = tx.objectStore('transactions');
    
    const getRequest = store.get(transactionId);
    getRequest.onsuccess = () => {
      const transaction = getRequest.result;
      if (transaction) {
        transaction.synced = true;
        store.put(transaction);
      }
    };
  } catch (error) {
    console.error('Failed to mark transaction as synced:', error);
  }
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pos-offline-db', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
