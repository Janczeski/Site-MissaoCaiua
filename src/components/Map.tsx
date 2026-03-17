import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapLocation {
  id: number;
  title: string;
  description: string;
  location: string;
  beneficiaries: number;
  coordinates: [number, number];
}

interface MapProps {
  locations: MapLocation[];
}

const Map = ({ locations }: MapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  // Coordenadas do centro do Brasil para o mapa base
  const centerLat = -14.2350;
  const centerLng = -51.9253;
  
  // Função para converter coordenadas em posição no mapa (simulação)
  const getMarkerPosition = (coordinates: [number, number]) => {
    const [lat, lng] = coordinates;
    // Conversão simplificada para posicionamento relativo no mapa
    const x = ((lng + 75) / 50) * 100; // Normaliza longitude
    const y = ((lat + 35) / 50) * 100;  // Normaliza latitude
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, 100 - y))}%`
    };
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border-2 border-gray-200">
      {/* Mapa Base Simulado */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
          alt="Mapa do Brasil"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20" />
      </div>

      {/* Marcadores */}
      {locations.map((location) => {
        const position = getMarkerPosition(location.coordinates);
        return (
          <button
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
            style={position}
            onClick={() => setSelectedLocation(location)}
          >
            <div className="relative">
              <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg group-hover:text-red-600 transition-colors" />
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {location.beneficiaries > 999 ? '999+' : location.beneficiaries}
              </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap pointer-events-none">
              {location.title}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        );
      })}

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="font-medium text-gray-700">Projetos Ativos</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Clique nos marcadores para mais detalhes
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedLocation && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedLocation(null)}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat pr-8">
              {selectedLocation.title}
            </h3>
            
            <p className="text-gray-600 mb-3 font-nunito">
              {selectedLocation.description}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                <span>{selectedLocation.location}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="font-medium">Beneficiários:</span>
                <span className="ml-2 text-green-600 font-semibold">
                  {selectedLocation.beneficiaries}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;