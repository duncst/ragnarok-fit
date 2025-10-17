// Secure localStorage utility with encryption for workout data
import { toast } from 'sonner';

const ENCRYPTION_KEY_NAME = 'ragnarok-storage-key';

// Generate or retrieve encryption key
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyData = localStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (keyData) {
    try {
      const keyBuffer = new Uint8Array(JSON.parse(keyData));
      return await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.warn('Failed to import existing key, generating new one');
    }
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Store key for future use
  const keyBuffer = await crypto.subtle.exportKey('raw', key);
  localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(Array.from(new Uint8Array(keyBuffer))));
  
  return key;
}

// Encrypt data
async function encryptData(data: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data
async function decryptData(encryptedData: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    
    const iv = combined.slice(0, 12);
    const encryptedBuffer = combined.slice(12);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
}

// Secure storage interface
export const secureStorage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = await encryptData(jsonString);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      toast.error('Failed to save data securely');
      // Fallback to regular storage for non-critical data
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  async getItem(key: string): Promise<any> {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = await decryptData(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      // Fallback to regular storage
      try {
        const fallback = localStorage.getItem(key);
        return fallback ? JSON.parse(fallback) : null;
      } catch {
        return null;
      }
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};

// Input sanitization utilities
export const inputSanitizer = {
  // Sanitize text input to prevent XSS
  sanitizeText(input: string, maxLength: number = 1000): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, '') // Remove basic HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, ''); // Remove event handlers
  },

  // Sanitize workout names
  sanitizeWorkoutName(name: string): string {
    return this.sanitizeText(name, 100);
  },

  // Sanitize notes
  sanitizeNotes(notes: string): string {
    return this.sanitizeText(notes, 2000);
  },

  // Validate numeric inputs
  sanitizeNumeric(value: any, min: number = 0, max: number = 99999): number {
    const num = parseFloat(value);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  },

  // Rate limiting helper
  rateLimiter: (() => {
    const attempts = new Map<string, number[]>();
    
    return {
      checkRate(key: string, maxAttempts: number = 10, windowMs: number = 60000): boolean {
        const now = Date.now();
        const userAttempts = attempts.get(key) || [];
        
        // Remove old attempts outside the window
        const recentAttempts = userAttempts.filter(time => now - time < windowMs);
        
        if (recentAttempts.length >= maxAttempts) {
          return false; // Rate limited
        }
        
        recentAttempts.push(now);
        attempts.set(key, recentAttempts);
        return true;
      }
    };
  })()
};