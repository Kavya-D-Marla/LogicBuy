import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const icons = {
  success: <CheckCircle size={18} className="text-success shrink-0" />,
  error: <AlertCircle size={18} className="text-error shrink-0" />,
  info: <Info size={18} className="text-purple shrink-0" />,
};

const bgColors = {
  success: 'border-l-4 border-l-success',
  error: 'border-l-4 border-l-error',
  info: 'border-l-4 border-l-purple',
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`flex items-center gap-3 px-4 py-3 bg-background shadow-xl rounded-xl min-w-[280px] max-w-[380px] ${bgColors[toast.type] || bgColors.success}`}
          >
            {icons[toast.type] || icons.success}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-muted hover:text-foreground transition-colors shrink-0">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
