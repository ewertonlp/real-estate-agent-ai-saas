// frontend/src/components/PropertyDetailsForm.tsx
import React from 'react';

// Definir as props que este componente irá receber do pai (DashboardPage)
interface PropertyDetailsFormProps {
  propertyType: string;
  setPropertyType: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  propertyValue: string; // Novo
  setPropertyValue: (value: string) => void; // Novo
  condoFee: string; // Novo
  setCondoFee: (value: string) => void; // Novo
  iptuValue: string; // Novo
  setIptuValue: (value: string) => void; // Novo
  location: string;
  setLocation: (value: string) => void;
  specialFeatures: string;
  setSpecialFeatures: (value: string) => void;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  propertyValue,
  setPropertyValue,
  condoFee,
  setCondoFee,
  iptuValue,
  setIptuValue,
  location,
  setLocation,
  specialFeatures,
  setSpecialFeatures,
}) => {
  return (
    <div className="space-y-4">
      {/* Tipo de Imóvel */}
      <div>
        <label htmlFor="propertyType" className="block text-text text-sm font-medium mb-2">
          Tipo de Imóvel:
        </label>
        <select
          id="propertyType"
          className="appearance-none rounded w-full py-3 px-4 bg-card-light border border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Casa">Casa</option>
          <option value="Terreno">Terreno</option>
          <option value="Comercial">Imóvel Comercial</option>
          <option value="Cobertura">Cobertura</option>
          <option value="Sobrado">Sobrado</option>
        </select>
      </div>

      {/* Quartos e Banheiros (em uma linha) */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="bedrooms" className="block text-text text-sm font-medium mb-2">
            Quartos:
          </label>
          <input
            id="bedrooms"
            type="number"
            min="0"
            className="appearance-none rounded w-full py-3 px-4 bg-card-light border border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
            placeholder="Ex: 3"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="bathrooms" className="block text-text text-sm font-medium mb-2">
            Banheiros:
          </label>
          <input
            id="bathrooms"
            type="number"
            min="0"
            className="appearance-none rounded w-full py-3 px-4 bg-card-light border border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
            placeholder="Ex: 2"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
          />
        </div>
      </div>

      {/* NOVOS CAMPOS: VALOR DO IMÓVEL, CONDOMÍNIO, IPTU (em uma linha) */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="propertyValue" className="block text-text text-sm font-medium mb-2">
            Valor do Imóvel (R$):
          </label>
          <input
            id="propertyValue"
            type="number"
            min="0"
            step="0.01" 
            className="appearance-none rounded w-full py-3 px-4 bg-card-light border border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
            placeholder="Ex: 500000.00"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="condoFee" className="block text-text text-sm font-medium mb-2">
            Valor do Condomínio (R$):
          </label>
          <input
            id="condoFee"
            type="number"
            min="0"
            step="0.01"
            className="appearance-none rounded w-full py-3 px-4 bg-card-light border border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
            placeholder="Ex: 500.00"
            value={condoFee}
            onChange={(e) => setCondoFee(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="iptuValue" className="block text-text text-sm font-medium mb-2">
            Valor do IPTU (R$):
          </label>
          <input
            id="iptuValue"
            type="number"
            min="0"
            step="0.01"
            className="appearance-none rounded w-full py-3 px-4 bg-card-light border border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
            placeholder="Ex: 100.00"
            value={iptuValue}
            onChange={(e) => setIptuValue(e.target.value)}
          />
        </div>
      </div>

      {/* Localização */}
      <div>
        <label htmlFor="location" className="block text-text text-sm font-medium mb-2">
          Localização (Bairro/Cidade):
        </label>
        <input
          id="location"
          type="text"
          className="appearance-none rounded w-full py-3 px-4 bg-card-light border border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
          placeholder="Ex: Moema, São Paulo"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Características Específicas */}
      <div>
        <label htmlFor="specialFeatures" className="block text-text text-sm font-medium mb-2">
          Características Específicas (separar por vírgulas):
        </label>
        <input
          id="specialFeatures"
          type="text"
          className="appearance-none rounded w-full py-3 px-4 bg-card-light border border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
          placeholder="Ex: Piscina, Varanda Gourmet, Pet-friendly, Mobiliado"
          value={specialFeatures}
          onChange={(e) => setSpecialFeatures(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsForm;