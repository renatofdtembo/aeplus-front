import React, {
  useEffect,
  useState,
  useRef,
  ReactElement,
  PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";

type AutoCompleteIAProps = {
  children: ReactElement;
  searchFunction: (query: string) => Promise<string[]>;
  onSelect?: (value: string) => void;
};

export const AutoCompleteIA: React.FC<PropsWithChildren<AutoCompleteIAProps>> = ({
  children,
  searchFunction,
  onSelect,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurBlocked = useRef(false);

  // Localiza o input dentro do componente filho
  useEffect(() => {
    if (!containerRef.current) return;
    const input = containerRef.current.querySelector("input");
    if (input && input instanceof HTMLInputElement) {
      inputRef.current = input;
    }
  }, [children]);

  // Atualiza sugestões baseado na query
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      setHasSelected(false);
      return;
    }

    // Não busca se acabamos de selecionar um item
    if (hasSelected) {
      setShowSuggestions(false);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      searchFunction(query)
        .then(results => {
          setSuggestions(results);
          // Mostra apenas se houver resultados diferentes do query atual
          setShowSuggestions(results.length > 0 && !results.includes(query));
        });
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, searchFunction, hasSelected]);

  // Eventos do input
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      setQuery(value);
      // Mostra sugestões apenas se não tiver selecionado e estiver digitando
      if (!hasSelected || value !== query) {
        setShowSuggestions(true);
        setHasSelected(false);
      }
    };

    const handleFocus = () => {
      if (!hasSelected && query.trim() !== "" && suggestions.length > 0) {
        setShowSuggestions(true);
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        if (!blurBlocked.current) {
          setShowSuggestions(false);
        }
        blurBlocked.current = false;
      }, 150);
    };

    input.addEventListener("input", handleInput);
    input.addEventListener("focus", handleFocus);
    input.addEventListener("blur", handleBlur);

    return () => {
      input.removeEventListener("input", handleInput);
      input.removeEventListener("focus", handleFocus);
      input.removeEventListener("blur", handleBlur);
    };
  }, [query, suggestions, hasSelected]);

  // Quando seleciona uma sugestão
  const handleSelect = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    setHasSelected(true);
    
    if (inputRef.current) {
      // Atualiza o valor do input de forma mais robusta
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(inputRef.current, suggestion);
      
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  // Renderiza dropdown
  const dropdown =
    showSuggestions && suggestions.length > 0 && inputRef.current
      ? createPortal(
          <ul
            className="fixed z-[99999] bg-white border border-gray-300 rounded-md shadow max-h-60 overflow-auto"
            style={{
              top: inputRef.current.getBoundingClientRect().bottom + 4,
              left: inputRef.current.getBoundingClientRect().left,
              width: inputRef.current.offsetWidth,
            }}
          >
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                className="px-4 py-1 hover:bg-blue-100 cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  blurBlocked.current = true;
                  handleSelect(sug);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                {sug}
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <>
      <div ref={containerRef}>{children}</div>
      {dropdown}
    </>
  );
};