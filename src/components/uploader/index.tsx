import { OnProgressEvent, VisibilityType } from '@bnb-chain/greenfield-js-sdk';
import NiceModal from '@ebay/nice-modal-react';
import { ColoredErrorIcon } from '@totejs/icons';
import { Box, Center, Flex, Text } from '@totejs/uikit';
import Compressor from 'compressorjs';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { offchainDataAtom } from '../../atoms/offchainDataAtomAtom';
import { uploadObjcetAtom } from '../../atoms/uploadObjectAtom';
import { GREENFIELD_CHAIN, UPLOAD_OBJECT_FEE } from '../../env';
import { useCreateSpace } from '../../hooks/seller/useCreateSpace';
import { useGetObjInBucketListStatus } from '../../hooks/useGetObjInBucketListStatus';
import { client } from '../../utils/gfSDK';
import { THUMB, getSpaceName, shortObjectName } from '../../utils/space';
import { Loader } from '../Loader';
import { Tips } from '../modal/Tips';
import { UPLOAD_LIST_PAGE_SIZE } from '../profile/MyCollectionList';
import BSCIcon from '../svgIcon/BSCIcon';
import { BlackSolidButton } from '../ui/buttons/BlackButton';
import { DragBox } from './DragArea';
import { UploadArea } from './UploadArea';
import { UploadAtom } from './atoms/uploadAtom';
import { useNavigate } from 'react-router-dom';

export const Uploader = () => {
  const { address, connector } = useAccount();
  const [offchainData, setOffchainData] = useAtom(offchainDataAtom);
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadInfo, setUploadInfo] = useImmerAtom(UploadAtom);
  const [upobjs, setUpobjs] = useImmerAtom(uploadObjcetAtom);
  const navigate = useNavigate();

  const { data: GnfdBalance } = useBalance({
    address: address,
    chainId: GREENFIELD_CHAIN.id,
  });

  const {
    start: createSpaceStart,
    doCreateSpace,
    spaceExist,
  } = useCreateSpace({
    onFailure: async () => {
      // ...
    },
    onSuccess: async () => {
      // ...
      // await sleep(40000);
    },
  });

  // const { doDelete } = useDeleteSpace({});

  const { refetch: refetchList } = useGetObjInBucketListStatus(
    getSpaceName(address),
    UPLOAD_LIST_PAGE_SIZE,
  );

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

    if (!GnfdBalance || !UPLOAD_OBJECT_FEE) return;
    if (GnfdBalance.value < parseEther(UPLOAD_OBJECT_FEE)) {
      NiceModal.show(Tips, {
        title: 'insufficient gas',
        content: (
          <Box>
            <ColoredErrorIcon size="xl" />
          </Box>
        ),
        buttonText: 'Got it',
      });
      return;
    }

    const bucketName = getSpaceName(address);

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
          await doCreateSpace();
        },
      });
      return;
    }

    if (files) {
      setUploadInfo((draft) => {
        draft.status = 'uploading';
      });

      // const provider = await connector?.getProvider();
      // const data = await getOffchainAuthKeys(address, provider);

      // console.log('data', data);

      // setOffchainData({
      //   address: address,
      //   seed: data?.seedString,
      // });

      const now = Date.now().toString();

      console.log('offchainData', offchainData);

      const uploadTasks = files.map((file, index) => {
        new Compressor(file, {
          quality: 0.6,
          width: 500,
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
            seed: offchainData?.seed || '',
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

        await refetchList();
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
              Progressing
            </Flex>
          }
          onClick={async () => {
            if (uploadInfo.status === 'success') {
              // Close
              setUpobjs((draft) => {
                draft.openModal = false;
              });
              setUploadInfo((draft) => {
                draft.status = 'init';
              });

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
