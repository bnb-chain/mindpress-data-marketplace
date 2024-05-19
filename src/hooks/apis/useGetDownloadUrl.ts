import { useGetRandomSp } from './useGetRandomSp';

export const useGetDownloadUrl = ({
  bucketName,
  name,
}: {
  bucketName?: string;
  name: string;
}) => {
  const { data: endpint, isLoading } = useGetRandomSp();

  if (isLoading) return '';

  return `${endpint}/download/${bucketName}/${name}`;
};
