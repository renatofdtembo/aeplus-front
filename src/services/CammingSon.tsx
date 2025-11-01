import React from 'react';

interface CammingSonProps {
  title?: string;
  content?: string;
}

const CammingSon: React.FC<CammingSonProps> = ({ title, content }) => {
  return (
    <div className="coming-soon">
      {/* Ícone estático: emoji de ferramentas */}
      <div className="icon">🛠️</div>
      <h3>{title ?? "Em Breve"}</h3>
      <p>{content ?? "Esta funcionalidade estará disponível em breve."}</p>

      <style>{`
        .coming-soon {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .coming-soon .icon {
          font-size: 4em;
          margin-bottom: 20px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default CammingSon;
