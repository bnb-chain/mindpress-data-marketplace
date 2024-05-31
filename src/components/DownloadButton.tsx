import { Flex } from '@totejs/uikit';
import React from 'react';
import { useDownload } from '../hooks/apis/useDownload';
import { Loader } from './Loader';
import { DefaultButton } from './ui/buttons/DefaultButton';

interface IProps {
  buttonText?: string;
  objectId: string;
}

export const DownloadButton: React.FC<IProps> = ({
  objectId,
  buttonText = 'Download',
}) => {
  const { doDownload, isLoading } = useDownload({
    objectId,
  });

  return (
    <DefaultButton
      h="48px"
      bg="#F1F2F3"
      color="#181A1E"
      fontWeight="800"
      variant="ghost"
      onClick={async (e) => {
        e.stopPropagation();

        await doDownload();
      }}
    >
      {isLoading ? (
        <Flex gap="5px" alignItems="center">
          <Loader
            minHeight={43}
            size={20}
            borderWidth={2}
            color="#E6E8EA"
            bg="#76808F"
          />
        </Flex>
      ) : (
        buttonText
      )}
    </DefaultButton>
  );
};
