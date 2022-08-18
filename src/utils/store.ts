export class Store {

  keys: any;
  map = new Map();
  expirationTimeInSeconds: number;
  getter = function(key) { return this.map.get(key); };
  setter = function(key, val) { return this.map.set(key, val); };
  deleter = function(key) { return this.map.delete(key); };
  cleaner = function() { return this.map.clear(); };

  constructor(params) {
    Object.assign(this, params);
  }

  has(key) {
    return this.get(key) != null;
  }

  getExp() {
    return this.expirationTimeInSeconds;
  }

  get(key) {
    const data = this.getter(key);
    if (!data || !data.value) {
      return null;
    }

    if (data.timestamp && Date.now() > data.timestamp) {
      this.delete(key);
      return null;
    }
    return data.value;
  }

  set(key, value) {
    self.sessionStorage.setItem(key, JSON.stringify({ value }));
  }

  delete(key) {
    return this.deleter(key);
  }

  clear() {
    return this.cleaner();
  }

  put(key, value) {
    this.set(key, Object.assign({}, this.get(key), value));
  }
}

// sessionStore = sessionStorage, propre à un onglet
export const sessionStore = new Store({
  getter(key) { return JSON.parse(self.sessionStorage.getItem(key)); },
  setter(key, value) { return self.sessionStorage.setItem(key, JSON.stringify(value)); },
  deleter(key) { return self.sessionStorage.removeItem(key); },
  cleaner() { return self.sessionStorage.clear(); },
  keys: {
    USER: 'User',
    LOGIN_SUPPORT: 'LoginSupport',
    LAST_TRY_LOGIN: 'LastTryLogin',
    LAST_URL: 'LastUrl',
    SESSION_INVALIDATION_ERROR: 'SessionInvalidationError',
    TOKEN_TRANSFER: 'TokenGatewayTransfer',
  },
  expirationTimeInSeconds: 60 * 60 // 1 heure par défaut
});

// localStore = localStorage, persistent sur le long terme
export const localStore = new Store({
getter(key) { return JSON.parse(self.localStorage.getItem(key)); },
setter(key, value) { return self.localStorage.setItem(key, JSON.stringify(value)); },
deleter(key) { return self.localStorage.removeItem(key); },
cleaner() { return self.localStorage.clear(); },
keys: {

},
expirationTimeInSeconds: 60 * 60 * 24 * 365 // 1 an par défaut
});

// memoryStore = juste dans la RAM, effacé au rechargement de la page
export const memoryStore = new Store({ expirationTimeInSeconds: 60 * 60 * 24 * 365 });
