import styled from '@emotion/styled';
import { BackIcon } from '@totejs/icons';
import { Box, Flex } from '@totejs/uikit';
import { isEmpty } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import { NoData } from '../../components/NoData';
import { useGetBucketById } from '../../hooks/useGetBucketOrObj';
import { useGetItemByObjId } from '../../hooks/apis/useGetItemByObjId';
import { useGfGetObjInfo } from '../../hooks/gnfd/useGfGetObjInfo';
import { useSelectEndpoint } from '../../hooks/apis/useSelectEndpoint';
import { THUMB } from '../../utils/space';
import { ListForm } from '../form/ListForm';
import { MPLink } from '../ui/MPLink';
import { Loader } from '../Loader';

/**
 * Have not been listed
 * Show bucket or object detail info
 */
export const Object = () => {
  const [p] = useSearchParams();
  const objectId = p.get('oid') as string;
  const bucketId = p.get('bid') as string;
  const { data: endpoint } = useSelectEndpoint();

  const { data: bucketData, isLoading: isBucketLoading } =
    useGetBucketById(bucketId);
  const { data: objectData, isLoading: isObjectLoading } =
    useGfGetObjInfo(objectId);

  // if objectItemInfo is `{}`,
  // means this object is not listed
  const { data: objectItemInfo } = useGetItemByObjId(objectId);

  // const { num, toUpdate } = useCollectionItems(
  //   bucketData?.bucketInfo?.bucketName,
  //   false,
  // );

  // const openListModal = useCallback(() => {
  //   if (!bucketData || !objectData) {
  //     return;
  //   }

  //   const imageUrl = `${endpoint}/view/${bucketData.bucketInfo?.bucketName}/${objectData.objectInfo?.objectName}`;

  //   const initInfo = {
  //     bucket_name: bucketData.bucketInfo?.bucketName,
  //     object_name: objectData.objectInfo?.objectName,
  //     create_at: bucketData.bucketInfo?.createAt.low,
  //     payload_size: objectData.objectInfo?.payloadSize.low,
  //     imageUrl,
  //   };
  //   modalData.modalDispatch({
  //     type: 'OPEN_LIST',
  //     initInfo,
  //     callBack: () => {
  //       navigator('/detail?bid=' + bucketId);
  //     },
  //   });
  // }, [bucketData, bucketId, modalData, navigator, objectData]);

  // auto open list modal
  // useEffect(() => {
  //   const needOpenModal = p.get('openModal') as string;
  //   if (!needOpenModal) return;
  //   openListModal();
  // }, [p, bucketData, objectData]);

  // TODO: how logic
  // if (!_.isEmpty(objectItemInfo)) {
  //   navigator(`/resource?id=${objectItemInfo.id}`, {
  //     replace: true,
  //   });
  // }

  if (isBucketLoading || isObjectLoading) {
    return <Loader />;
  }

  if (!objectData || !bucketData) {
    return <NoData />;
  }

  const imageUrl = `${endpoint}/view/${bucketData.bucketInfo?.bucketName}/${THUMB}/${objectData.objectInfo?.objectName}`;

  return (
    <>
      <Box>
        <MPLink
          fontSize="32px"
          to="/profile?tab=uploaded"
          color="#F7F7F8"
          fontWeight="800"
        >
          <BackIcon w={40} h={40} verticalAlign="-8px" />
          List for sale
        </MPLink>
      </Box>
      <ResourceInfo gap="20px">
        <ImgCon>
          <img src={imageUrl} alt="" />
        </ImgCon>

        <Flex flex="1" gap={24} flexDir="column" justifyContent={'start'}>
          {isEmpty(objectItemInfo) && (
            <ListForm
              owner={objectData.objectInfo?.owner}
              bucketId={bucketId}
              objectId={objectId}
              imageUrl={imageUrl}
            />
          )}
        </Flex>
      </ResourceInfo>
    </>
  );
};

const ResourceInfo = styled(Flex)`
  margin-top: 30px;
`;

const ImgCon = styled.div`
  /* position: relative; */
  width: 688px;

  img {
    /* width: 688px;
    height: 459px; */

    width: 100%;
    object-fit: contain;
    background-color: #d9d9d9;
    /* background-color: #d9d9d9;
    border-radius: 8px; */
  }
`;

// const NameCon = styled(Flex)``;

// const CollInfo = styled(Flex)``;

// const Name = styled.div`
//   font-style: normal;
//   font-weight: 600;
//   font-size: 32px;
//   line-height: 38px;
//   /* identical to box height, or 119% */

//   color: #ffe900;
// `;

// const Tag = styled(Flex)`
//   width: 128px;
//   height: 24px;

//   background: rgba(255, 255, 255, 0.14);
//   border-radius: 16px;
// `;

// const ItemNum = styled.div`
//   font-style: normal;
//   font-weight: 400;
//   font-size: 16px;
//   line-height: 21px;

//   color: #ffffff;
// `;

// const OwnCon = styled(Flex)`
//   font-style: normal;
//   font-weight: 400;
//   font-size: 16px;
//   line-height: 18px;

//   color: #ffffff;

//   span {
//     margin: 0 4px;
//     color: #ffe900;
//   }
// `;

// const FileSize = styled.div`
//   margin-right: 6px;

//   font-style: normal;
//   font-weight: 700;
//   font-size: 20px;
//   line-height: 18px;

//   color: #ffffff;
// `;
