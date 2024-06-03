import { useQuery } from '@tanstack/react-query';

export const useGetBnbUsdtExchangeRate = () => {
  return useQuery({
    queryKey: ['get-bnb-usdt-exchange-rate'],
    queryFn: async () => {
      try {
        const res = await fetch(
          'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT',
        );

        const data = await res.json();
        return data.price;
      } catch (err) {
        return 0;
      }
    },
    staleTime: Infinity,
  });
};
