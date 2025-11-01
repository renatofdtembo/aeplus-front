import { JSX, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle, Edit3, HelpCircle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'alert' | 'prompt' | 'input-prompt' | 'question';
type AlertPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';

interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;
  position: AlertPosition;
  timer?: number;
  options?: string[];
  onResponse?: (response: string) => void;
  inputPrompt?: boolean;
  onInputSubmit?: (input: string) => void;
  onInputCancel?: () => void; // Nova propriedade para cancelamento
  questionOptions?: {
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  };
  inputValue?: string;
}

const containerId = 'rtalert-container';

function createContainerIfNotExists() {
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }
  return container;
}

let addAlertToList: (alert: AlertMessage) => void = () => { };

// API pública para exibir alertas
export const rtalert = {
  success: (msg: string, position: AlertPosition = 'top-right', timer?: number) =>
    showAlert('success', msg, position, undefined, undefined, undefined, timer),
  error: (msg: string, position: AlertPosition = 'top-right', timer?: number) =>
    showAlert('error', msg, position, undefined, undefined, undefined, timer),
  warning: (msg: string, position: AlertPosition = 'top-right', timer?: number) =>
    showAlert('warning', msg, position, undefined, undefined, undefined, timer),
  alert: (msg: string, position: AlertPosition = 'top-right', timer?: number) =>
    showAlert('alert', msg, position, undefined, undefined, undefined, timer),
  prompt: (
    msg: string,
    options: string[],
    onResponse: (response: string) => void,
    timer?: number
  ) =>
    showAlert('prompt', msg, 'center', options, onResponse, undefined, timer),
  inputPrompt: (
    msg: string,
    onInputSubmit: (input: string) => void,
    onInputCancel?: () => void, // Nova opção de cancelamento
    timer?: number
  ) =>
    showAlert('input-prompt', msg, 'center', undefined, undefined, onInputSubmit, timer, undefined, onInputCancel),
  question: (
    msg: string,
    questionOptions: {
      confirmText?: string;
      cancelText?: string;
      onConfirm?: () => void;
      onCancel?: () => void;
    },
    timer?: number
  ) =>
    showAlert('question', msg, 'center', undefined, undefined, undefined, timer, questionOptions),
};

// Cria e envia o alerta
function showAlert(
  type: AlertType,
  message: string,
  position: AlertPosition,
  options?: string[],
  onResponse?: (response: string) => void,
  onInputSubmit?: (input: string) => void,
  timer?: number,
  questionOptions?: {
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  },
  onInputCancel?: () => void // Nova opção de cancelamento
) {
  const id = Date.now().toString();
  addAlertToList({ 
    id, 
    type, 
    message, 
    position, 
    options, 
    onResponse, 
    onInputSubmit, 
    timer,
    questionOptions,
    inputValue: type === 'input-prompt' ? '' : undefined,
    onInputCancel // Nova propriedade
  });
}

// Estilo de posição
const positionStyles: Record<AlertPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

// Estilo por tipo de alerta (modo claro)
const alertStylesLight: Record<AlertType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  alert: 'bg-blue-50 border-blue-200 text-blue-800',
  prompt: 'bg-white border-indigo-200 text-indigo-800',
  'input-prompt': 'bg-white border-purple-200 text-purple-800',
  question: 'bg-white border-teal-200 text-teal-800',
};

// Estilo por tipo de alerta (modo escuro)
const alertStylesDark: Record<AlertType, string> = {
  success: 'dark:bg-green-900/80 dark:border-green-700 dark:text-green-100',
  error: 'dark:bg-red-900/80 dark:border-red-700 dark:text-red-100',
  warning: 'dark:bg-yellow-900/80 dark:border-yellow-700 dark:text-yellow-100',
  alert: 'dark:bg-blue-900/80 dark:border-blue-700 dark:text-blue-100',
  prompt: 'dark:bg-gray-800 dark:border-indigo-700 dark:text-indigo-100',
  'input-prompt': 'dark:bg-gray-800 dark:border-purple-700 dark:text-purple-100',
  question: 'dark:bg-gray-800 dark:border-teal-700 dark:text-teal-100',
};

// Estilo dos botões (modo claro)
const buttonStylesLight: Record<AlertType, string> = {
  success: 'bg-green-100 hover:bg-green-200 text-green-800',
  error: 'bg-red-100 hover:bg-red-200 text-red-800',
  warning: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
  alert: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
  prompt: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
  'input-prompt': 'bg-purple-100 hover:bg-purple-200 text-purple-800',
  question: 'bg-teal-100 hover:bg-teal-200 text-teal-800',
};

// Estilo dos botões (modo escuro)
const buttonStylesDark: Record<AlertType, string> = {
  success: 'dark:bg-green-700 dark:hover:bg-green-600 dark:text-green-100',
  error: 'dark:bg-red-700 dark:hover:bg-red-600 dark:text-red-100',
  warning: 'dark:bg-yellow-700 dark:hover:bg-yellow-600 dark:text-yellow-100',
  alert: 'dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-blue-100',
  prompt: 'dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:text-indigo-100',
  'input-prompt': 'dark:bg-purple-700 dark:hover:bg-purple-600 dark:text-purple-100',
  question: 'dark:bg-teal-700 dark:hover:bg-teal-600 dark:text-teal-100',
};

// Estilo dos botões secundários (cancelar)
const secondaryButtonStyles = 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200';

// Ícones por tipo de alerta
const alertIcons: Record<AlertType, JSX.Element> = {
  success: <CheckCircle size={20} className="text-green-500 dark:text-green-400" />,
  error: <X size={20} className="text-red-500 dark:text-red-400" />,
  warning: <AlertTriangle size={20} className="text-yellow-500 dark:text-yellow-400" />,
  alert: <Info size={20} className="text-blue-500 dark:text-blue-400" />,
  prompt: <HelpCircle size={20} className="text-indigo-500 dark:text-indigo-400" />,
  'input-prompt': <Edit3 size={20} className="text-purple-500 dark:text-purple-400" />,
  question: <HelpCircle size={20} className="text-teal-500 dark:text-teal-400" />,
};

// Componente principal
export const RtAlertManager = () => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // Função para atualizar o valor do input
  const updateInputValue = (id: string, value: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? {...alert, inputValue: value} : alert
    ));
  };

  useEffect(() => {
    addAlertToList = (alert: AlertMessage) => {
      setAlerts((prev) => [...prev, alert]);

      // Remove automaticamente apenas alertas não interativos após o timer
      if (alert.type !== 'prompt' && alert.type !== 'input-prompt' && alert.type !== 'question') {
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
        }, alert.timer ?? 5000); // Usa timer customizado ou 5s padrão
      }
    };
  }, []);

  // Verifica se há algum alerta modal aberto (centro)
  const hasModalAlert = alerts.some(alert => 
    alert.position === 'center' && 
    (alert.type === 'prompt' || alert.type === 'input-prompt' || alert.type === 'question')
  );

  const grouped = alerts.reduce((acc, alert) => {
    acc[alert.position] = [...(acc[alert.position] || []), alert];
    return acc;
  }, {} as Record<AlertPosition, AlertMessage[]>);

  return ReactDOM.createPortal(
    <>
      {/* Overlay para alertas modais */}
      {hasModalAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10000000000000000 animate-in fade-in duration-300" />
      )}

      {Object.entries(grouped).map(([position, group]) => (
        <div
          key={position}
          className={`fixed z-10000000000000000 space-y-4 ${positionStyles[position as AlertPosition]}`}
        >
          {group.map((alert) => (
            <div
              key={alert.id}
              className={clsx(
                'flex flex-col min-w-80 max-w-md p-5 rounded-xl border backdrop-blur-sm transition-all duration-300',
                'shadow-lg hover:shadow-xl transform transition-all',
                alertStylesLight[alert.type],
                alertStylesDark[alert.type],
                position === 'center' 
                  ? 'animate-in zoom-in-95 z-10000000000000000 scale-100' 
                  : position.includes('top')
                    ? 'animate-in slide-in-from-top'
                    : 'animate-in slide-in-from-bottom'
              )}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="mt-0.5 flex-shrink-0">
                  {alertIcons[alert.type]}
                </span>
                <span className="text-sm flex-1 font-medium">{alert.message}</span>
                
                {/* Botão de fechar apenas para alertas não interativos */}
                {(alert.type !== 'prompt' && alert.type !== 'input-prompt' && alert.type !== 'question') && (
                  <button
                    className="text-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Prompt Buttons */}
              {alert.type === 'prompt' && alert.options && (
                <div className="flex justify-end gap-3">
                  {alert.options.map((option, index) => (
                    <button
                      key={index}
                      className={clsx(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        buttonStylesLight[alert.type],
                        buttonStylesDark[alert.type]
                      )}
                      onClick={() => {
                        alert.onResponse?.(option);
                        setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Prompt */}
              {alert.type === 'input-prompt' && (
                <div className="flex flex-col gap-3">
                  <textarea
                    rows={4}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all resize-none"
                    placeholder="Digite sua resposta..."
                    value={alert.inputValue || ''}
                    onChange={(e) => updateInputValue(alert.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        alert.onInputSubmit?.(alert.inputValue || '');
                        setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      className={clsx(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        secondaryButtonStyles
                      )}
                      onClick={() => {
                        alert.onInputCancel?.();
                        setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className={clsx(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        buttonStylesLight[alert.type],
                        buttonStylesDark[alert.type]
                      )}
                      onClick={() => {
                        alert.onInputSubmit?.(alert.inputValue || '');
                        setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                      }}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {/* Question (estilo SweetAlert) */}
              {alert.type === 'question' && alert.questionOptions && (
                <div className="flex justify-end gap-3">
                  <button
                    className={clsx(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      secondaryButtonStyles
                    )}
                    onClick={() => {
                      alert.questionOptions?.onCancel?.();
                      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                    }}
                  >
                    {alert.questionOptions.cancelText || 'Cancelar'}
                  </button>
                  <button
                    className={clsx(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      buttonStylesLight[alert.type],
                      buttonStylesDark[alert.type]
                    )}
                    onClick={() => {
                      alert.questionOptions?.onConfirm?.();
                      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                    }}
                  >
                    {alert.questionOptions.confirmText || 'Confirmar'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>,
    createContainerIfNotExists()
  );
};