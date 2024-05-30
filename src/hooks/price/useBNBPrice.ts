import axios from 'axios';
import { useEffect, useState } from 'react';

export const useBNBPrice = () => {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    try {
      axios
        .get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
        .then((result: any) => {
          const {
            data: { price },
          } = result;
          setPrice(price);
        });
    } catch (err) {
      setPrice(0);
    }
  }, []);

  return { price };
};
