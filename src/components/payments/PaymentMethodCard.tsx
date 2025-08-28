import React from 'react';
import { MonerooMethod } from '../../data/monerooMethods';

interface PaymentMethodCardProps {
  method: any;
  meta: MonerooMethod | undefined;
  onDelete?: () => void;
}

const typeColors: Record<string, string> = {
  'mobile_money': 'bg-green-100 text-green-700',
  'carte': 'bg-blue-100 text-blue-700',
  'crypto': 'bg-orange-100 text-orange-700',
  'agrégateur': 'bg-purple-100 text-purple-700',
  'banque': 'bg-yellow-100 text-yellow-700',
  'autre': 'bg-gray-100 text-gray-700',
};

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method, meta, onDelete }) => {
  return (
    <div className="border rounded-xl p-5 flex items-center gap-5 bg-white shadow hover:shadow-lg transition group relative">
      <img src={meta?.logo} alt="logo" className="w-12 h-12 rounded bg-gray-100 object-contain border" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-lg truncate">{meta?.name || method.aggregator}</span>
          {meta && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[meta.type] || 'bg-gray-100 text-gray-700'}`}>{meta.type.replace('_', ' ')}</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mb-1 truncate">{meta?.description}</div>
        <div className="text-xs text-gray-500"><span className="font-medium">Clé API :</span> {method.aggregator_api_key.slice(0, 6)}...{method.aggregator_api_key.slice(-4)}</div>
        {meta?.countries && (
          <div className="flex flex-wrap gap-1 mt-1">
            {meta.countries.map(c => (
              <span key={c} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{c}</span>
            ))}
          </div>
        )}
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-2 px-3 py-1 rounded bg-red-100 text-red-700 font-medium text-xs hover:bg-red-200 transition"
          title="Supprimer"
        >
          Supprimer
        </button>
      )}
    </div>
  );
};

export default PaymentMethodCard; 