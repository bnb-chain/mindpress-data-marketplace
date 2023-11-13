import { useEffect, useState } from 'react';
import { getRandomSp } from '../utils/gfSDK';

export const useGetDownloadUrl = ({
  bucketName,
  name,
}: {
  bucketName?: string;
  name: string;
}) => {
  const [domain, setDomain] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    getRandomSp().then((result) => {
      setDomain(result);
      setDownloadUrl(`${domain}/download/${bucketName}/${name}`);
    });
  }, [bucketName, domain, name]);

  return downloadUrl;
};
