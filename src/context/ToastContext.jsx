import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'

const ToastContext = createContext(null)

let idSeq = 0
const MAX_VISIBLE = 3

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback(
    (toast) => {
      const id = ++idSeq
      const duration = toast.duration ?? 3200
      setToasts((list) => [...list, { id, ...toast }].slice(-MAX_VISIBLE))
      timers.current[id] = setTimeout(() => remove(id), duration)
      return id
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-viewport" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className="toast" role="status" aria-live="polite">
            <span className="toast__icon" aria-hidden="true">
              ✓
            </span>
            <div className="toast__body">
              <span className="toast__title">{t.title}</span>
              {t.description && (
                <span className="toast__desc">{t.description}</span>
              )}
              {t.actionTo && (
                <Link
                  to={t.actionTo}
                  className="toast__action"
                  onClick={() => remove(t.id)}
                >
                  {t.actionLabel || 'View'}
                </Link>
              )}
            </div>
            <button
              className="toast__close"
              onClick={() => remove(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
