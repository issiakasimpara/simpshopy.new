import { useState } from "react";
import { MONEROO_METHODS, MonerooMethod } from "../data/monerooMethods";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";

const countryList = [
  { code: "CI", name: "Côte d’Ivoire" },
  { code: "SN", name: "Sénégal" },
  { code: "BJ", name: "Bénin" },
  { code: "TG", name: "Togo" },
  { code: "ML", name: "Mali" },
  { code: "BF", name: "Burkina Faso" },
  { code: "CM", name: "Cameroun" },
  { code: "GA", name: "Gabon" },
  { code: "GN", name: "Guinée" },
  { code: "NE", name: "Niger" },
  // ... autres pays
];

const typeList = [
  { value: "", label: "Tous" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "carte", label: "Carte bancaire" },
  { value: "crypto", label: "Crypto" },
  { value: "agrégateur", label: "Agrégateur" },
  { value: "banque", label: "Banque" },
  { value: "autre", label: "Autre" },
];

const AvailableGateways = ({ onBack, onConnect }: { onBack: () => void; onConnect: (method: MonerooMethod) => void }) => {
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");

  const filtered = MONEROO_METHODS.filter(m =>
    (!country || m.countries.includes(country) || m.countries.includes("ALL")) &&
    (!type || m.type === type) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-emerald-50 to-blue-50">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-700 font-medium">
          <ArrowLeft className="w-5 h-5" /> Passerelles de paiement disponibles
        </button>
        <div className="flex gap-3">
          <select value={country} onChange={e => setCountry(e.target.value)} className="border rounded px-3 py-2">
            <option value="">Country</option>
            {countryList.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-2">
            {typeList.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Rechercher une passerelle..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
      </div>
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">Aucune passerelle trouvée.</div>
        )}
        {filtered.map(m => (
          <div key={m.id} className="rounded-2xl border bg-white shadow-lg p-6 flex flex-col items-start gap-4 relative">
            <div className="flex items-center gap-3 mb-2">
              <img src={m.logo} alt={m.name} className="w-12 h-12 rounded bg-gray-100 object-contain border" />
              <div>
                <div className="font-bold text-lg mb-1">{m.name}</div>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-blue-100 text-blue-700 font-medium text-xs">{m.type.replace('_', ' ')}</Badge>
                  {m.countries.map(c => (
                    <Badge key={c} className="bg-gray-100 text-gray-600 font-medium text-xs">{c}</Badge>
                  ))}
                  {/* Badge BETA ou autre si besoin */}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-2 line-clamp-3">{m.description}</div>
            <button
              onClick={() => onConnect(m)}
              className="mt-auto w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-xl transition"
            >
              <Plus className="w-4 h-4" /> Connecter {m.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableGateways; 