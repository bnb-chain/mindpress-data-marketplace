import styled from '@emotion/styled';
import { Box, Flex, Tooltip } from '@totejs/uikit';
// import { Copy } from '../Copy';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ITEM_STATUS } from '../../hooks/useItemStatus';
import { GetMyData } from './data/GetMyData';

interface IOverView {
  desc: string;
  showEdit: boolean;
  editFun: () => void;
  name: string;
  bucketName?: string;
  listed?: boolean;
  showEndpoints?: boolean;
  itemStatus: ITEM_STATUS;
  baseInfo: any;
  resourceType: string;
}

const Overview = (props: IOverView) => {
  const {
    desc,
    showEdit,
    editFun,
    name,
    bucketName,
    listed,
    showEndpoints,
    itemStatus,
    baseInfo,
    resourceType,
  } = props;
  // const [domain, setDomain] = useState('');

  console.log('itemStatus', itemStatus);

  // useEffect(() => {
  //   getRandomSp().then((result) => {
  //     setDomain(result);
  //   });
  //   const clickHandle = () => {
  //     setIsOpenF(false);
  //     setIsOpenS(false);
  //   };
  //   document.addEventListener('click', clickHandle);
  //   return () => {
  //     document.removeEventListener('click', clickHandle);
  //   };
  // }, []);

  // const [isOpenF, setIsOpenF] = useState(false);
  // const [isOpenS, setIsOpenS] = useState(false);

  // 0: data
  // 1: collection
  console.log('resourceType', resourceType);

  return (
    <Container justifyContent="space-between">
      <Box flex="1">
        <Title as="h2" mb="30px" mt="10px">
          Desctiption
        </Title>
        <DescBox alignItems={'center'} justifyItems={'center'}>
          {desc ? (
            <ReactMarkdown children={desc} remarkPlugins={[remarkGfm]} />
          ) : (
            'This is a default description.'
          )}
          {/* {showEdit && listed && (
          <PenCon
            onClick={() => {
              editFun?.();
            }}
            style={{ width: '16px', height: '16px', marginLeft: '4px' }}
          />
        )} */}
        </DescBox>
      </Box>

      {resourceType == '0' && (
        <GetMyDataBox w="600px">
          <GetMyData
            itemStatus={itemStatus}
            baseInfo={baseInfo}
            name={name}
            bucketName={bucketName}
          />
        </GetMyDataBox>
      )}

      {/* {name && bucketName && name != bucketName && showEndpoints && (
        <>
          <Box h={65}></Box>
          <Title>Endpoints</Title>
          <Box h={20}></Box>
          <SupInfoCon w={996} h={300} padding={'24'}>
            <SupInfoItem flexDirection={'column'}>
              <SupInfoTitle
                gap={18}
                alignItems={'center'}
                justifyItems={'center'}
              >
                Download Universal Endpoint{' '}
                <Tooltip
                  isOpen={isOpenF}
                  content={
                    <div>
                      All storage objects in the Greenfield Network can be
                      identified and accessed through a universal resource
                      identifier (URI).
                      <LearnMore
                        target="_blank"
                        href="https://github.com/bnb-chain/greenfield-whitepaper/blob/main/part3.md#231-universal-endpoint"
                      >
                        Learn More
                      </LearnMore>
                    </div>
                  }
                >
                  <ColoredInfoIcon
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setIsOpenF(true);
                    }}
                    style={{ width: '20px', height: '20px' }}
                  ></ColoredInfoIcon>
                </Tooltip>
              </SupInfoTitle>
              <Box h={8}></Box>
              <UrlCon justifyContent={'space-between'}>
                <Left alignItems={'center'} justifyContent={'center'}>
                  Https
                </Left>
                <Url alignItems={'center'} justifyContent={'flex-start'}>
                  {downloadUrl}
                </Url>
                <CopyCon alignItems={'center'} justifyContent={'center'}>
                  <Copy value={downloadUrl}></Copy>
                </CopyCon>
              </UrlCon>
            </SupInfoItem>
            <Box h={16}></Box>
            <SupInfoItem flexDirection={'column'}>
              <SupInfoTitle
                gap={18}
                alignItems={'center'}
                justifyItems={'center'}
              >
                Preview Universal Endpoint{' '}
                <Tooltip
                  isOpen={isOpenS}
                  content={
                    <div>
                      All storage objects in the Greenfield Network can be
                      identified and accessed through a universal resource
                      identifier (URI).
                      <LearnMore
                        target="_blank"
                        href="https://github.com/bnb-chain/greenfield-whitepaper/blob/main/part3.md#231-universal-endpoint"
                      >
                        Learn More
                      </LearnMore>
                    </div>
                  }
                >
                  <ColoredInfoIcon
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setIsOpenS(true);
                    }}
                    style={{ width: '20px', height: '20px' }}
                  ></ColoredInfoIcon>
                </Tooltip>
              </SupInfoTitle>
              <Box h={8}></Box>
              <UrlCon justifyContent={'space-between'}>
                <Left alignItems={'center'} justifyContent={'center'}>
                  Https
                </Left>
                <Url alignItems={'center'} justifyContent={'flex-start'}>
                  {previewUrl}
                </Url>
                <CopyCon alignItems={'center'} justifyContent={'center'}>
                  <Copy value={previewUrl}></Copy>
                </CopyCon>
              </UrlCon>
            </SupInfoItem>
          </SupInfoCon>
        </>
      )} */}
    </Container>
  );
};

export default Overview;

const Container = styled(Flex)`
  gap: 120px;
`;

const DescBox = styled(Box)`
  border-radius: 8px;
  // background: rgba(255, 255, 255, 0.19);
`;

const Title = styled(Box)`
  color: #fff;
  font-size: 24px;
`;

const GetMyDataBox = styled(Box)`
  flex: 1;
`;
