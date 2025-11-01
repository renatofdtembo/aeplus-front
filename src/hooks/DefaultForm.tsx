import React, {
  useState,
  ReactNode,
  ReactElement,
  cloneElement,
  FormEvent,
} from "react";

interface DefaultInputProps {
  name: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

interface DefaultFormProps {
  children: ReactNode;
  onSubmit: () => void;
  className?: string;
}

// Type guard para ReactElement com props conhecidos
function isReactElement<P = any>(child: ReactNode): child is ReactElement<P> {
  return React.isValidElement(child);
}

const DefaultForm: React.FC<DefaultFormProps> = ({
  children,
  onSubmit,
  className,
}) => {
  const [values, setValues] = useState<Record<string, string>>({});

  // Filtra os inputs required
  const requiredInputs = React.Children.toArray(children).filter(
    (child) =>
      isReactElement<DefaultInputProps>(child) && !!child.props.required
  ) as ReactElement<DefaultInputProps>[];

  // Verifica se todos os required estão preenchidos
  const allRequiredFilled = requiredInputs.every(
    (input) => values[input.props.name]?.trim().length > 0
  );

  const handleInputChange = (name: string, value: string) => {
    setValues((oldValues) => ({
      ...oldValues,
      [name]: value,
    }));
  };

  // Clona os filhos para controlar os inputs e o botão submit
  const clonedChildren = React.Children.map(children, (child: any) => {
    if (!isReactElement(child)) return child;

    // Se for um input (tem name)
    if (child.props && typeof child.props.name === "string") {
      const name = child.props.name;
      return cloneElement(child, {
        value: values[name] || "",
        onChange: (val: string) => handleInputChange(name, val),
      });
    }

    // Se for botão <button> ou componente Button, desabilita conforme required
    if (
      typeof child.type === "string" &&
      (child.type === "button" || child.type === "submit")
    ) {
      return cloneElement(child, {
        disabled: !allRequiredFilled,
        className: `${
          child.props.className || ""
        } ${!allRequiredFilled ? "opacity-50 cursor-not-allowed" : ""}`,
      });
    }

    return child;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (allRequiredFilled) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto ${className ?? ""}`}
      noValidate
    >
      {clonedChildren}
    </form>
  );
};

export default DefaultForm;
