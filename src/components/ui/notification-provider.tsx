"use client";
import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean; // Acción destructiva: botón rojo
}
export interface AskOptions extends ConfirmOptions {
  placeholder?: string;
  required?: boolean; // No deja confirmar con el campo vacío
}

interface Dialog extends AskOptions {
  input: boolean;
  resolve: (value: string | null) => void;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
  /** Reemplaza a window.confirm: true si la persona confirma. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Reemplaza a window.prompt: el texto escrito, o null si cancela. */
  ask: (options: AskOptions) => Promise<string | null>;
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

  const [dialog, setDialog] = useState<Dialog | null>(null);
  const open = useCallback((options: AskOptions, input: boolean) =>
    new Promise<string | null>((resolve) => setDialog({ ...options, input, resolve })), []);
  const confirm = useCallback((options: ConfirmOptions) => open(options, false).then((v) => v !== null), [open]);
  const ask = useCallback((options: AskOptions) => open(options, true), [open]);
  const close = (value: string | null) => {
    dialog?.resolve(value);
    setDialog(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, confirm, ask }}>
      {children}
      {dialog && <ConfirmDialog dialog={dialog} onClose={close} />}
      {notifications.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[150] flex justify-center pointer-events-none p-6 pb-10 print:hidden">
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

function ConfirmDialog({ dialog, onClose }: { dialog: Dialog; onClose: (value: string | null) => void }) {
  const [text, setText] = useState('');
  const confirmRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const blocked = dialog.input && dialog.required && !text.trim();
  const accept = () => { if (!blocked) onClose(dialog.input ? text.trim() : ''); };

  useEffect(() => {
    (dialog.input ? inputRef.current : confirmRef.current)?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialog, onClose]);

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150 print:hidden" onClick={() => onClose(null)}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={dialog.message ? 'confirm-dialog-message' : undefined}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-6 space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className={`shrink-0 rounded-full p-2 ${dialog.danger ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
            {dialog.danger ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <div className="space-y-1 min-w-0">
            <h2 id="confirm-dialog-title" className="font-semibold text-[var(--foreground)]">{dialog.title}</h2>
            {dialog.message && <p id="confirm-dialog-message" className="text-sm text-[var(--muted)] whitespace-pre-line">{dialog.message}</p>}
          </div>
        </div>
        {dialog.input && (
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); accept(); } }}
            placeholder={dialog.placeholder}
            aria-label={dialog.title}
            rows={3}
            className="w-full p-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
          />
        )}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => onClose(null)} className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--background)]">
            {dialog.cancelText ?? 'Cancelar'}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={accept}
            disabled={blocked}
            className={`px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 ${dialog.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
          >
            {dialog.confirmText ?? 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
}
