"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notifications.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[150] flex justify-center pointer-events-none p-6 pb-10">
          <div className="flex flex-col gap-4 pointer-events-auto max-w-md w-full items-center">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className="animate-fade-in-up bg-[var(--background)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden w-full max-w-sm"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  notification.type === 'info' ? 'bg-blue-500' :
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                
                <div className="flex-shrink-0">
                  {notification.type === 'info' && <Info className="w-6 h-6 text-blue-500" />}
                  {notification.type === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {notification.type === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                  {notification.type === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
                </div>
                
                <p className="flex-1 text-sm font-medium text-[var(--foreground)]">{notification.message}</p>
                
                <button 
                  onClick={() => removeNotification(notification.id)}
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
}
