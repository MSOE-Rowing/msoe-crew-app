// Database service for storing rowing data locally using IndexedDB

class RowingDB {
  constructor() {
    this.dbName = 'RowingTeamDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('name', 'name', { unique: false });
        }

        // Create rowing sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
          sessionStore.createIndex('userId', 'userId', { unique: false });
          sessionStore.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  async addUser(name, status = 'Ready to row! 🚣') {
    const transaction = this.db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    
    const user = {
      name,
      status,
      createdAt: new Date(),
      totalMeters: 0
    };

    return new Promise((resolve, reject) => {
      const request = store.add(user);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUsers() {
    const transaction = this.db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addSession(userId, meters, date = new Date()) {
    const transaction = this.db.transaction(['sessions'], 'readwrite');
    const store = transaction.objectStore('sessions');
    
    const session = {
      userId,
      meters,
      date,
      createdAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(session);
      request.onsuccess = async () => {
        // Update user's total meters
        await this.updateUserTotalMeters(userId);
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getSessions(userId = null) {
    const transaction = this.db.transaction(['sessions'], 'readonly');
    const store = transaction.objectStore('sessions');

    return new Promise((resolve, reject) => {
      let request;
      if (userId) {
        const index = store.index('userId');
        request = index.getAll(userId);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateUserTotalMeters(userId) {
    const sessions = await this.getSessions(userId);
    const totalMeters = sessions.reduce((sum, session) => sum + session.meters, 0);

    const transaction = this.db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');

    return new Promise((resolve, reject) => {
      const getRequest = store.get(userId);
      getRequest.onsuccess = () => {
        const user = getRequest.result;
        user.totalMeters = totalMeters;
        
        const putRequest = store.put(user);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async updateUserStatus(userId, status) {
    const transaction = this.db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');

    return new Promise((resolve, reject) => {
      const getRequest = store.get(userId);
      getRequest.onsuccess = () => {
        const user = getRequest.result;
        if (user) {
          user.status = status;
          
          const putRequest = store.put(user);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('User not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getLeaderboard() {
    const users = await this.getUsers();
    return users
      .sort((a, b) => b.totalMeters - a.totalMeters)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
  }
}

export const db = new RowingDB();
