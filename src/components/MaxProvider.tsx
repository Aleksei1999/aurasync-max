'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface MaxUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface MaxContextType {
  user: MaxUser | null;
  initData: string | null;
  startParam: string | null;
  isReady: boolean;
  isLoading: boolean;
  webApp: typeof window.WebApp | null;
  platform: string | null;
  // BackButton - есть в MAX
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  // HapticFeedback - есть в MAX
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  hapticNotification: (type: 'error' | 'success' | 'warning') => void;
  // Диалоги - в MAX нет нативных, используем браузерные
  showAlert: (message: string) => void;
  showConfirm: (message: string) => Promise<boolean>;
  // Закрытие приложения
  close: () => void;
  // Открытие ссылок
  openLink: (url: string) => void;
  openMaxLink: (url: string) => void;
  // Шеринг - новое в MAX
  shareContent: (text: string, link?: string) => void;
  // QR сканер - новое в MAX
  openCodeReader: (onResult: (value: string) => void) => void;
  // Запрос контакта - новое в MAX
  requestContact: () => void;
  // DeviceStorage - новое в MAX
  deviceStorage: {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
  };
}

const MaxContext = createContext<MaxContextType>({
  user: null,
  initData: null,
  startParam: null,
  isReady: false,
  isLoading: true,
  webApp: null,
  platform: null,
  showBackButton: () => {},
  hideBackButton: () => {},
  hapticFeedback: () => {},
  hapticNotification: () => {},
  showAlert: () => {},
  showConfirm: async () => false,
  close: () => {},
  openLink: () => {},
  openMaxLink: () => {},
  shareContent: () => {},
  openCodeReader: () => {},
  requestContact: () => {},
  deviceStorage: {
    setItem: async () => {},
    getItem: async () => null,
    removeItem: async () => {},
  },
});

// Типы для MAX WebApp API
declare global {
  interface Window {
    WebApp: {
      ready: () => void;
      close: () => void;
      initData: string;
      initDataUnsafe: {
        query_id?: string;
        user?: MaxUser;
        chat?: {
          id: number;
          type: string;
          title?: string;
        };
        auth_date?: number;
        hash?: string;
        start_param?: string;
      };
      platform: 'ios' | 'android' | 'desktop' | 'web';
      version: string;
      BackButton: {
        isVisible: boolean;
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
      };
      HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft', disableVibrationFallback?: boolean) => void;
        notificationOccurred: (type: 'error' | 'success' | 'warning', disableVibrationFallback?: boolean) => void;
        selectionChanged: (disableVibrationFallback?: boolean) => void;
      };
      DeviceStorage: {
        setItem: (key: string, value: string) => Promise<void>;
        getItem: (key: string) => Promise<string | null>;
        removeItem: (key: string) => Promise<void>;
        clear: () => Promise<void>;
      };
      SecureStorage: {
        setItem: (key: string, value: string) => Promise<void>;
        getItem: (key: string) => Promise<string | null>;
        removeItem: (key: string) => Promise<void>;
      };
      ScreenCapture: {
        isScreenCaptureEnabled: boolean;
        enableScreenCapture: () => void;
        disableScreenCapture: () => void;
      };
      BiometricManager: {
        isInited: boolean;
        isBiometricAvailable: boolean;
        biometricType: string[];
        deviceId: string | null;
        isAccessRequested: boolean;
        isAccessGranted: boolean;
        isBiometricTokenSaved: boolean;
        init: () => Promise<void>;
        requestAccess: () => Promise<void>;
        authenticate: () => Promise<void>;
        updateBiometricToken: (token: string) => Promise<void>;
        openSettings: () => void;
      };
      openLink: (url: string) => void;
      openMaxLink: (url: string) => void;
      shareContent: (text: string, link?: string) => void;
      shareMaxContent: (params: { text?: string; link?: string } | { mid: string; chatType: string }) => void;
      downloadFile: (url: string, fileName: string) => void;
      openCodeReader: (fileSelect?: boolean) => void;
      requestContact: () => void;
      requestScreenMaxBrightness: () => void;
      restoreScreenBrightness: () => void;
      enableClosingConfirmation: () => void;
      disableClosingConfirmation: () => void;
      onEvent: (eventName: string, callback: (data?: unknown) => void) => void;
      offEvent: (eventName: string, callback: (data?: unknown) => void) => void;
    };
  }
}

function initializeMax() {
  if (typeof window === 'undefined') {
    return { webApp: null, user: null, initData: null, startParam: null, platform: null };
  }

  const webApp = window.WebApp;
  const urlParams = new URLSearchParams(window.location.search);
  const refFromUrl = urlParams.get('ref');

  if (webApp) {
    webApp.ready();

    const startParam = webApp.initDataUnsafe?.start_param || refFromUrl || null;

    return {
      webApp,
      user: webApp.initDataUnsafe?.user || null,
      initData: webApp.initData,
      startParam,
      platform: webApp.platform,
    };
  }

  // Development mode - mock data
  console.log('Running outside MAX - using mock data');
  return {
    webApp: null,
    user: {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      language_code: 'ru',
    } as MaxUser,
    initData: 'mock_init_data',
    startParam: refFromUrl,
    platform: 'web',
  };
}

export function MaxProvider({ children }: { children: ReactNode }) {
  const maxData = useMemo(() => initializeMax(), []);

  const [user] = useState<MaxUser | null>(maxData.user);
  const [initData] = useState<string | null>(maxData.initData);
  const [startParam] = useState<string | null>(maxData.startParam);
  const [isReady] = useState(maxData.webApp !== null || maxData.user !== null);
  const [isLoading] = useState(false);
  const [webApp] = useState<typeof window.WebApp | null>(maxData.webApp);
  const [platform] = useState<string | null>(maxData.platform);
  const [backButtonCallback, setBackButtonCallback] = useState<(() => void) | null>(null);

  const showBackButton = (onClick: () => void) => {
    if (!webApp) return;

    if (backButtonCallback) {
      webApp.BackButton.offClick(backButtonCallback);
    }

    webApp.BackButton.onClick(onClick);
    webApp.BackButton.show();

    setBackButtonCallback(() => onClick);
  };

  const hideBackButton = () => {
    if (!webApp) return;

    if (backButtonCallback) {
      webApp.BackButton.offClick(backButtonCallback);
    }
    webApp.BackButton.hide();
    setBackButtonCallback(null);
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    webApp?.HapticFeedback.impactOccurred(type);
  };

  const hapticNotification = (type: 'error' | 'success' | 'warning') => {
    webApp?.HapticFeedback.notificationOccurred(type);
  };

  // В MAX нет нативных диалогов - используем браузерные
  const showAlert = (message: string) => {
    alert(message);
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      resolve(confirm(message));
    });
  };

  const close = () => {
    webApp?.close();
  };

  const openLink = (url: string) => {
    webApp?.openLink(url);
  };

  const openMaxLink = (url: string) => {
    webApp?.openMaxLink(url);
  };

  const shareContent = (text: string, link?: string) => {
    webApp?.shareContent(text, link);
  };

  const openCodeReader = (onResult: (value: string) => void) => {
    if (!webApp) return;

    const handler = (data?: unknown) => {
      const event = data as { value?: string } | undefined;
      if (event?.value) {
        onResult(event.value);
      }
      webApp.offEvent('WebAppOpenCodeReader', handler);
    };

    webApp.onEvent('WebAppOpenCodeReader', handler);
    webApp.openCodeReader();
  };

  const requestContact = () => {
    webApp?.requestContact();
  };

  // DeviceStorage wrapper
  const deviceStorage = {
    setItem: async (key: string, value: string) => {
      if (webApp?.DeviceStorage) {
        await webApp.DeviceStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, value);
      }
    },
    getItem: async (key: string): Promise<string | null> => {
      if (webApp?.DeviceStorage) {
        return await webApp.DeviceStorage.getItem(key);
      }
      return localStorage.getItem(key);
    },
    removeItem: async (key: string) => {
      if (webApp?.DeviceStorage) {
        await webApp.DeviceStorage.removeItem(key);
      } else {
        localStorage.removeItem(key);
      }
    },
  };

  return (
    <MaxContext.Provider
      value={{
        user,
        initData,
        startParam,
        isReady,
        isLoading,
        webApp,
        platform,
        showBackButton,
        hideBackButton,
        hapticFeedback,
        hapticNotification,
        showAlert,
        showConfirm,
        close,
        openLink,
        openMaxLink,
        shareContent,
        openCodeReader,
        requestContact,
        deviceStorage,
      }}
    >
      {children}
    </MaxContext.Provider>
  );
}

export const useMax = () => useContext(MaxContext);
