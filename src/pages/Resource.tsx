import styled from '@emotion/styled';
import { Box, Breadcrumb, BreadcrumbItem, Flex } from '@totejs/uikit';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Loader } from '../components/Loader';
import { ImgCon } from '../components/resource/ImgCon';
import Overview from '../components/resource/Overview';
import { CollectionInfo } from '../components/resource/collection/CollectionInfo';
import CollectionList from '../components/resource/collection/CollectionList';
import { DataInfo } from '../components/resource/data/DataInfo';
import { BscTraceIcon } from '../components/svgIcon/BscTraceIcon';
import { GF_EXPLORER_URL } from '../env';
import {
  useGetBOInfoFromGroup,
  useGetBucketByName,
  useGetGroupByName,
  useGetObject,
} from '../hooks/useGetBucketOrObj';
import { useGetItemById } from '../hooks/useGetItemById';
import { useGetItemRelationWithAddr } from '../hooks/useGetItemRelationWithAddr';
import { useGfGetObjInfo } from '../hooks/useGfGetObjInfo';
import { reportEvent } from '../utils/ga';
import { MyBreadcrumb } from '../components/resource/MyBreadcrumb';
import { NoData } from '../components/NoData';

/**
 * Have been listed
 *
 * Can be queryed in API
 */
const Resource = () => {
  const [p] = useSearchParams();
  // const groupId = p.getAll('gid')[0];
  // const cid = p.getAll('cid')[0];
  // const objectId = p.get('oid') as string;
  // const gName = p.getAll('gn')[0];
  // const bGroupName = p.getAll('bgn')[0];
  const itemId = p.get('id') as string;
  // const bucketId = p.getAll('bid')[0]

  const { address } = useAccount();

  const { data: itemInfo, isLoading: itemInfoLoading } = useGetItemById(
    parseInt(itemId),
  );

  // console.log('p.getAll(oid)', p.get('oid'), p.get('id'));
  // console.log('objectId: ', objectId);

  // const { data: xx } = useGfGetObjInfo(objectId);
  // console.log('xx', xx);

  const relation = useGetItemRelationWithAddr(address, itemInfo);

  const storageInfo = useGetBOInfoFromGroup(itemInfo?.groupName);

  const { data: bucketData } = useGetBucketByName(storageInfo?.bucketName);

  const { data: objectData } = useGetObject(
    storageInfo?.bucketName,
    storageInfo?.objectName,
  );

  const { data: groupData } = useGetGroupByName(
    itemInfo?.groupName,
    itemInfo?.ownerAddress,
  );

  const resourceName = useMemo(() => {
    if (!storageInfo || !bucketData || !itemInfo) return;

    return storageInfo.type === 'COLLECTION'
      ? itemInfo?.name
      : `${bucketData.bucketInfo.bucketName} #${itemInfo?.name}`;
  }, [bucketData, itemInfo, storageInfo]);

  // console.log('itemInfo', itemInfo);
  // console.log('storageInfo', storageInfo);
  // console.log('groupData', groupData);
  // console.log('bucketData', bucketData);
  // console.log('objectData', objectData);

  if (itemInfoLoading || !itemInfo || !bucketData) {
    return <Loader />;
  }

  return (
    <Container>
      <MyBreadcrumb
        root={{
          bucketName: bucketData.bucketInfo.bucketName,
        }}
      />

      <ResourceInfo gap={100} padding="30px 0">
        <ImgCon relation={relation} itemInfo={itemInfo} />

        <Info flexDirection="column" flex="1">
          <NameCon gap={4} alignItems={'center'} justifyContent={'flex-start'}>
            <Name>
              {resourceName || (
                <Loader
                  style={{ width: '38px', height: '38px' }}
                  minHeight={38}
                />
              )}
            </Name>
            <BscTraceIcon
              color="#53EAA1"
              width={24}
              height={20}
              cursor={'pointer'}
              marginLeft={6}
              onClick={() => {
                if (!storageInfo) return;
                const o =
                  itemInfo?.type == 'COLLECTION'
                    ? bucketData?.bucketInfo
                    : objectData?.objectInfo;

                reportEvent({
                  name: 'dm.detail.overview.view_in_explorer.click',
                });
                window.open(
                  `${GF_EXPLORER_URL}${
                    itemInfo?.type == 'COLLECTION' ? 'bucket' : 'object'
                  }/0x${Number(o?.id).toString(16).padStart(64, '0')}`,
                );
              }}
            />
          </NameCon>

          {itemInfo?.type === 'OBJECT' && (
            <DataInfo itemInfo={itemInfo} objectData={objectData} />
          )}

          {itemInfo?.type == 'COLLECTION' && (
            <CollectionInfo itemInfo={itemInfo} relation={relation} />
          )}
        </Info>
      </ResourceInfo>
      <Hr mb="55px" />
      <Overview
        itemInfo={itemInfo}
        relation={relation}
        bucketData={bucketData}
        groupData={groupData}
      />
      {itemInfo?.type === 'COLLECTION' && (
        <>
          <Hr mt="55px" />
          <Box mt="50px">
            <CollectionList
              itemInfo={itemInfo}
              bucketData={bucketData}
              relation={relation}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Resource;

const Container = styled(Box)`
  margin-top: 20px;
  width: 1400px;
  background-color: #181a1e;
  border-radius: 16px;
  border: 1px solid #1e2026;
  padding: 80px 100px;
`;

const ResourceInfo = styled(Flex)``;

const Hr = styled(Box)`
  height: 1px;
  background-color: #373943;
`;

const Info = styled(Flex)`
  padding-top: 50px;
  padding-bottom: 50px;
`;

const NameCon = styled(Flex)``;

const Name = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 38px;
  /* identical to box height, or 119% */

  color: #f7f7f8;
`;
