import React, { useState, ReactNode, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";

export type ActionItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
};

type AccordionItemProps = {
  titulo: React.ReactNode;
  children: ReactNode;
  actions?: ActionItem[];
};

export default function AccordionItem({ titulo, children, actions = [] }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
//   const { modEditable } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

//   const shouldShowActions = modEditable && actions.length > 0;
  const shouldShowActions = false;

  // Atualiza posição do menu quando abrir
  useEffect(() => {
    if (showActions && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 192,
      });
    }
  }, [showActions]);

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setShowActions(false);
      }
    }

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions((prev) => !prev);
  };

  const handleActionClick = (e: React.MouseEvent, onClick: () => void) => {
    e.stopPropagation();
    try {
      onClick();
    } catch (err) {
      console.error("Erro ao executar ação:", err);
    }
    setShowActions(false);
  };

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-visible">
      <div
        className="flex items-center justify-between cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 transition-colors relative z-10"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="text-gray-500">
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
          <div className="flex-1">{titulo}</div>
        </div>

        {shouldShowActions && (
          <div className="relative z-20">
            <button
              ref={buttonRef}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              onClick={toggleActions}
            >
              <MoreVertical size={18} />
            </button>

            {showActions &&
              ReactDOM.createPortal(
                <div
                  ref={menuRef}
                  style={{
                    position: "absolute",
                    top: position.top,
                    left: position.left,
                    width: 192,
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 10000,
                  }}
                >
                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-left"
                      onClick={(e) => handleActionClick(e, action.onClick)}
                    >
                      {action.icon && (
                        <span className="text-gray-500">{action.icon}</span>
                      )}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200">{children}</div>
      )}
    </div>
  );
}
