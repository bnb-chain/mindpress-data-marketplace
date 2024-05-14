import { useQuery } from '@tanstack/react-query';

export const useGetBnbUsdtExchangeRate = () => {
  return useQuery({
    queryKey: ['get-bnb-usdt-exchange-rate'],
    queryFn: async () => {
      const res = await fetch(
        'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT',
      );
      const data = await res.json();
      return data.price;
    },
    staleTime: Infinity,
  });
};
