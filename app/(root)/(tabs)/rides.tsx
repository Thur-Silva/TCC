import RidesLayout from '@/components/ridesLayout';
import { useBestRides } from '@/hooks/useBestRides';
import { useLocationStore } from '@/store';
import { useEffect, useState } from 'react';

export default function RidesScreen() {
  // Importando as propriedades e a função corretas da sua useLocationStore
  const {
    userLatitude,
    userLongitude,
    userAddress,
    destinationLatitude,
    destinationLongitude,
    destinationAddress, // Mantenha este para leitura
    setDestinationLocation, // Esta é a função correta
  } = useLocationStore();

  // Usando estado local para o endereço de origem
  const [originAddress, setOriginAddress] = useState<string>(userAddress || '');

  const [userTime, setUserTime] = useState(new Date().toISOString());
  const [onlyFree, setOnlyFree] = useState(false);
  const [orderBy, setOrderBy] = useState<'price' | 'detour' | 'distance' | 'time'>('price');

  // Definindo objetos de coordenada para passar para o hook
  const origin = (userLatitude && userLongitude)
    ? { latitude: userLatitude, longitude: userLongitude }
    : null;

  const destination = (destinationLatitude && destinationLongitude)
    ? { latitude: destinationLatitude, longitude: destinationLongitude }
    : null;

  // O hook agora será chamado apenas quando origem e destino forem definidos
  const canFetchRides = origin && destination;

  const { topRides, loading, error, isEmpty } = useBestRides({
    // Passa coordenadas válidas ao hook, ou um fallback se não existirem
    origin: canFetchRides ? origin : { latitude: 0, longitude: 0 },
    destination: canFetchRides ? destination : { latitude: 0, longitude: 0 },
    userTime,
    onlyFree,
  });

  // Efeito para preencher a origem automaticamente com a localização do usuário
  useEffect(() => {
    if (userAddress) {
      setOriginAddress(userAddress);
    }
  }, [userAddress]);

  // Handler para atualizar o destino e seu endereço, usando a função da store
  const handleDestinationSelect = ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // Chamando a única função da store para atualizar todos os campos de destino
    setDestinationLocation({ latitude, longitude, address });
  };

  // Handler para atualizar a origem, neste caso apenas o endereço local
  const handleOriginSelect = ({
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // Apenas atualizamos o estado local para o endereço, mantendo as coordenadas do usuário
    setOriginAddress(address);
  };

  const formatPrice = (price: number): string => {
    return price === 0 ? 'Grátis' : `R$ ${price.toFixed(2)}`;
  };

  const orderByOptions = [
    { label: 'Preço', value: 'price' },
    { label: 'Desvio', value: 'detour' },
    { label: 'Distância', value: 'distance' },
    { label: 'Horário', value: 'time' },
  ];

  return (
    <RidesLayout
      originAddress={originAddress}
      destinationAddress={destinationAddress || ''} // Corrigido para passar uma string vazia se null
      onOriginSelect={handleOriginSelect}
      onDestinationSelect={handleDestinationSelect}
      onlyFree={onlyFree}
      setOnlyFree={setOnlyFree}
      orderBy={orderBy}
      setOrderBy={setOrderBy}
      orderByOptions={orderByOptions}
      topRides={topRides}
      loading={loading}
      error={error}
      isEmpty={isEmpty}
      formatPrice={formatPrice}
    />
  );
}
