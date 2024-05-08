import Compressor from 'compressorjs';
import { OnProgressEvent, VisibilityType } from '@bnb-chain/greenfield-js-sdk';
import { Box } from '@totejs/uikit';
import { useImmerAtom } from 'jotai-immer';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { client } from '../../utils/gfSDK';
import { getOffchainAuthKeys } from '../../utils/off-chain-auth/utils';
import { BlackSolidButton } from '../ui/buttons/BlackButton';
import { UploadAtom } from './atoms/uploadAtom';
import { DragBox } from './DragArea';
import { UploadArea } from './UploadArea';
import { useCreateSpace } from '../../hooks/seller/useCreateSpace';

export const Uploader = () => {
  const { address, connector } = useAccount();
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadInfo, setUploadInfo] = useImmerAtom(UploadAtom);

  // useCreateSpace();

  console.log('uploadInfo', uploadInfo);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadInfo((draft) => {
        draft.status = 'init';
      });
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragFile = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('e: ', e.dataTransfer?.files);

    console.log('files   :', Array.from(e.dataTransfer?.files || []));

    const dropFiles = Array.from(e.dataTransfer?.files || []).filter((x) =>
      x.type.match(/^image\//),
    );

    setFiles(dropFiles);
  };

  const handleRemoveFile = (index: number) => {
    if (!files) return [];

    const newFiles = files.slice(0, index).concat(files.slice(index + 1));

    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (!address) return;

    const bucketName = 'dfg';

    if (files) {
      setUploadInfo((draft) => {
        draft.status = 'uploading';
      });

      const provider = await connector?.getProvider();
      const offChainData = await getOffchainAuthKeys(address, provider);
      if (!offChainData) {
        alert('No offchain, please create offchain pairs first');
        return;
      }

      const uploadTasks = files.map((file, index) => {
        new Compressor(file, {
          quality: 0.6,
          width: 500,
          success: (result: any) => {
            console.log('result', result);

            client.object.delegateUploadObject(
              {
                bucketName,
                objectName: Date.now().toString() + '.thumb.' + file.name,
                body: result,
                delegatedOpts: {
                  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                },
                onProgress: (e: OnProgressEvent) => {
                  console.log('thumb progress: ', e.percent);

                  setUploadInfo((draft) => {
                    draft.thumbProgress[index] = {
                      progress: Math.floor(e.percent),
                    };
                  });
                },
              },
              {
                type: 'EDDSA',
                address,
                domain: window.location.origin,
                seed: offChainData.seedString,
              },
            );
          },
        });

        return client.object.delegateUploadObject(
          {
            bucketName,
            objectName: Date.now().toString() + file.name,
            body: file,
            delegatedOpts: {
              visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
            },
            onProgress: (e: OnProgressEvent) => {
              console.log('progress: ', e.percent);

              setUploadInfo((draft) => {
                draft.filesProgress[index] = {
                  progress: Math.floor(e.percent),
                };
              });
            },
          },
          {
            type: 'EDDSA',
            address,
            domain: window.location.origin,
            seed: offChainData.seedString,
          },
        );
      });

      try {
        const res = await Promise.all(uploadTasks);

        // console.log('res', res);
        setUploadInfo((draft) => {
          draft.status = 'success';
        });
        // resetUploadInfo();
      } catch (error) {
        console.error(error);
        setUploadInfo((draft) => {
          draft.status = 'fail';
        });
      }
    }
  };

  return (
    <Box color="#1E2026">
      {uploadInfo.status === 'init' && (
        <DragBox
          files={files}
          fileChange={handleFileChange}
          dropChange={handleDragFile}
        />
      )}

      <UploadArea files={files} removeFile={handleRemoveFile} />

      <Box mt="16px">
        <BlackSolidButton
          height="48px"
          bg="rgba(30, 32, 38, 1)"
          fontSize="16px"
          width={'100%'}
          disabled={files === null || files.length === 0}
          onClick={async () => {
            handleUpload();

            // NiceModal.show(Tips, {
            //   title: 'Upload to BNB Greenfield',
            //   content:
            //     'We will store your photos on Greenfield blockchain to ensure you have full ownership. Therefore a small gas fee is required to create a storage space for the first upload.',
            //   buttonText: 'Continue',
            // });
          }}
        >
          Upload
        </BlackSolidButton>
      </Box>
    </Box>
  );
};
