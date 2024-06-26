import { OnProgressEvent, VisibilityType } from '@bnb-chain/greenfield-js-sdk';
import NiceModal from '@ebay/nice-modal-react';
import { ColoredErrorIcon } from '@totejs/icons';
import { Box, Center, Flex, Text } from '@totejs/uikit';
import Compressor from 'compressorjs';
import { useAtomValue } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useBalance } from 'wagmi';
import { offchainDataAtom } from '../../atoms/offchainDataAtomAtom';
import { BSC_CHAIN } from '../../env';
import { useCreateSpace } from '../../hooks/seller/useCreateSpace';
import { useGetObjInBucketListStatus } from '../../hooks/useGetObjInBucketListStatus';
import { useOffchainAuth } from '../../hooks/useOffchainAuth';
import { client } from '../../utils/gfSDK';
import {
  THUMB,
  getCompressImageSize,
  getSpaceName,
  shortObjectName,
  sleep,
} from '../../utils/space';
import { Loader } from '../Loader';
import { Tips } from '../modal/Tips';
import { UPLOAD_LIST_PAGE_SIZE } from '../profile/MyCollectionList';
import BSCIcon from '../svgIcon/BSCIcon';
import { BlackSolidButton } from '../ui/buttons/BlackButton';
import { DragBox } from './DragArea';
import { UploadArea } from './UploadArea';
import { UploadAtom } from './atoms/uploadAtom';

interface Props {
  onClose: () => void;
}

export const Uploader: React.FC<Props> = ({ onClose }) => {
  const { address } = useAccount();
  const { data: bscBalance } = useBalance({
    address,
    chainId: BSC_CHAIN.id,
  });
  const { applyOffchainAuthData } = useOffchainAuth();
  const offchainData = useAtomValue(offchainDataAtom);
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadInfo, setUploadInfo] = useImmerAtom(UploadAtom);
  const navigate = useNavigate();

  const {
    start: createSpaceStart,
    doCreateSpace,
    spaceExist,
    gas,
  } = useCreateSpace({
    onFailure: async () => {
      // ...
    },
    onSuccess: async () => {
      // ...
      // await sleep(40000);
    },
  });

  const { refetch: refetchList } = useGetObjInBucketListStatus(
    getSpaceName(address),
    UPLOAD_LIST_PAGE_SIZE,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadInfo((draft) => {
        draft.status = 'init';
      });

      for (let i = 0; i < e.target.files.length; i++) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = new Image();
          img.onload = () => {
            console.log('img', i, img.width, img.height);
            setUploadInfo((draft) => {
              draft.files[i] = {
                width: img.width,
                height: img.height,
              };
            });
          };

          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(e.target.files[i]);
      }

      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragFile = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // console.log('e: ', e.dataTransfer?.files);
    // console.log('files   :', Array.from(e.dataTransfer?.files || []));

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

    // apply offchain auth if not exists
    await applyOffchainAuthData({});

    const bucketName = getSpaceName(address);

    console.log(
      'bscBalance.value < gas',
      bscBalance?.value,
      gas,
      // bscBalance?.value < gas,
    );
    if (bscBalance && bscBalance.value < gas) {
      NiceModal.show(Tips, {
        title: 'Insufficient Balance',
        content: (
          <Box>
            <ColoredErrorIcon size="xl" />
            <Box fontSize="14px" color="#76808F" mt="30px">
              You don't have enough balance on BNB Smart Chain. You can get some
              test token from the Faucet.
            </Box>
          </Box>
        ),
        buttonText: 'Go to Faucet',
        buttonClick: async () => {
          window.open(`https://www.bnbchain.org/en/testnet-faucet`);
        },
      });
      return;
    }

    if (!spaceExist) {
      await NiceModal.show(Tips, {
        title: ``,
        content: (
          <Box>
            <Flex justifyContent="center" alignItems="center">
              <Center w="80px" h="80px" bg="#F1F2F3" borderRadius="50%">
                <BSCIcon boxSize={56} w="56px" h="56px" />
              </Center>
            </Flex>

            <Text as="h2" fontSize="24px" mt="24px">
              Upload to BNB Greenfield
            </Text>
            <Text fontSize="14px" color="#76808F">
              We will store your images on Greenfield blockchain to ensure you
              have full ownership. Therefore a small gas fee is required to
              create a storage space for the first upload.
            </Text>
          </Box>
        ),
        buttonText: 'Continue',
        buttonClick: async () => {
          NiceModal.hide(Tips);
          await doCreateSpace();
        },
        // isLoading: createSpaceStart,
      });
      return;
    }

    if (files) {
      setUploadInfo((draft) => {
        draft.status = 'uploading';
      });

      const now = Date.now().toString();
      const uploadTasks = files.map((file, index) => {
        const { w, h } = getCompressImageSize(
          uploadInfo.files[index].width,
          uploadInfo.files[index].height,
        );

        // console.log(
        //   'source ',
        //   uploadInfo.files[index].width,
        //   uploadInfo.files[index].height,
        // );

        // console.log('compress ', w, h);

        new Compressor(file, {
          quality: 0.7,
          width: w,
          height: h,
          success: (result: any) => {
            console.log('result', result);

            client.object.delegateUploadObject(
              {
                bucketName,
                // objectName: Date.now().toString() + '.thumb.' + file.name,
                objectName:
                  `${THUMB}/` + shortObjectName(file.name, `${now}_${index}`),
                body: result,
                delegatedOpts: {
                  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                },
                onProgress: (e: OnProgressEvent) => {
                  console.log('thumb progress: ', e.percent);
                  if (!e.percent) return;

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
                seed: offchainData?.seed || '',
              },
            );
          },
        });

        return client.object.delegateUploadObject(
          {
            bucketName,
            // objectName: Date.now().toString() + file.name,
            objectName: shortObjectName(file.name, `${now}_${index}`),
            body: file,
            delegatedOpts: {
              visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
            },
            onProgress: (e: OnProgressEvent) => {
              console.log('source progress: ', e.percent);

              if (!e.percent) return;

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
            seed: offchainData?.seed || '',
          },
        );
      });

      try {
        const res = await Promise.all(uploadTasks);

        // sleep for waiting uploaded image to be sealed
        await sleep(3000 * files.length);
        await refetchList();

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
          disabled={
            files == null ||
            files.length === 0 ||
            createSpaceStart ||
            uploadInfo.status === 'uploading'
          }
          _disabled={{
            bg: '#AEB4BC',
            cursor: 'not-allowed',
            _hover: {
              bg: '#AEB4BC',
            },
            _active: {
              bg: '#AEB4BC',
            },
          }}
          isLoading={createSpaceStart || uploadInfo.status === 'uploading'}
          loadingText={
            <Flex alignItems="center" gap="5px">
              <Loader
                minHeight={43}
                size={20}
                borderWidth={2}
                color="#E6E8EA"
                bg="#76808F"
              />
              {createSpaceStart ? 'Creating' : 'Progressing'}
            </Flex>
          }
          onClick={async () => {
            if (uploadInfo.status === 'success') {
              // Close
              onClose();

              navigate('/profile?tab=uploaded');
            } else {
              // Upload
              handleUpload();
            }
          }}
        >
          {uploadInfo.status === 'success' ? 'Go to List' : 'Upload'}
        </BlackSolidButton>
      </Box>
    </Box>
  );
};
