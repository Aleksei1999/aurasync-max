import crypto from 'crypto';

interface MaxInitData {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
  };
  chat?: {
    id: number;
    type: string;
    title?: string;
  };
  auth_date: number;
  hash: string;
  start_param?: string;
}

// Validate MAX WebApp init data
// Алгоритм идентичен Telegram: HMAC_SHA256("WebAppData", BotToken) -> secret_key
export function validateMaxInitData(initData: string): MaxInitData | null {
  const botToken = process.env.MAX_BOT_TOKEN;
  if (!botToken) {
    console.error('MAX_BOT_TOKEN is not set');
    return null;
  }

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');

    if (!hash) {
      return null;
    }

    // Remove hash from params for validation
    urlParams.delete('hash');

    // Sort params alphabetically and create data check string
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key: HMAC_SHA256("WebAppData", BotToken)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate hash: hex(HMAC_SHA256(secret_key, sorted_data))
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      console.error('Hash mismatch');
      return null;
    }

    // Check auth_date (allow 24 hours)
    const authDate = parseInt(urlParams.get('auth_date') || '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      console.error('Init data expired');
      return null;
    }

    // Parse user data
    const userStr = urlParams.get('user');
    const user = userStr ? JSON.parse(userStr) : undefined;

    // Parse chat data (MAX specific)
    const chatStr = urlParams.get('chat');
    const chat = chatStr ? JSON.parse(chatStr) : undefined;

    const start_param = urlParams.get('start_param') || undefined;

    return {
      query_id: urlParams.get('query_id') || undefined,
      user,
      chat,
      auth_date: authDate,
      hash,
      start_param,
    };
  } catch (error) {
    console.error('Error validating init data:', error);
    return null;
  }
}

// Parse init data without validation (for client-side preview)
export function parseMaxInitData(initData: string): Partial<MaxInitData> | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const userStr = urlParams.get('user');
    const user = userStr ? JSON.parse(userStr) : undefined;

    const chatStr = urlParams.get('chat');
    const chat = chatStr ? JSON.parse(chatStr) : undefined;

    return {
      query_id: urlParams.get('query_id') || undefined,
      user,
      chat,
      auth_date: parseInt(urlParams.get('auth_date') || '0'),
      hash: urlParams.get('hash') || '',
    };
  } catch {
    return null;
  }
}
