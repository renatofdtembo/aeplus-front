import { ReactNode } from "react";

interface BodyProps {
  children: ReactNode;
}

export default function Body({ children }: BodyProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
      <div className="space-y-12">
        {children}
      </div>
    </div>
  );
}
