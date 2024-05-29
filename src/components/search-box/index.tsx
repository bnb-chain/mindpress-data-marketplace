import styled from '@emotion/styled';
import {
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@totejs/uikit';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchKwAtom } from '../../atoms/searchKwAtom';
import { useInfiniteGetItemList } from '../../hooks/useGetItemList';
import SearchNoData from '../../images/search_no_data.svg';
import { Loader } from '../Loader';
import { SearchInput } from './SearchInput';

interface Option {
  label: string;
  value: string;
}

interface IProps {
  width?: string;
  height?: string;
}

const Search: React.FC<IProps> = ({
  width = '420px',
  height = '56px',
}: IProps) => {
  const [searchKw, setSearchKw] = useAtom(SearchKwAtom);
  const navigator = useNavigate();
  const ref = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isLoading,
    // fetchNextPage,
    // hasNextPage,
    // total = 0,
    flatData: searchList = [],
  } = useInfiniteGetItemList({
    filter: {
      address: '',
      keyword: searchKw,
    },
    offset: 0,
    limit: 10,
    sort: 'CREATION_DESC',
  });

  const eventListener = useCallback(
    (e: any) => {
      const { target } = e;
      const root = document.getElementById('searchRoot');
      if (!root?.contains(target)) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    const body = document.body;
    body.addEventListener('click', eventListener);

    return () => {
      body.removeEventListener('click', eventListener);
    };
  }, [eventListener]);

  const handleClickOption = (groupId: string) => {
    navigator(`/resource?gid=${groupId}`);
  };

  const options = searchList?.map((v) => {
    const option: Option = {
      label: v.name,
      value: String(v.groupId),
    };
    return option;
  });

  return (
    <Container id="searchRoot" style={{ width }} ref={ref} onClick={onOpen}>
      <Flex
        position="relative"
        border={'1px solid readable.border'}
        borderRadius={8}
        onMouseUp={(e) => e.stopPropagation()}
        flexDirection="column"
        bg="#35363C"
        boxShadow="0px 4px 24px rgba(0, 0, 0, 0.08)"
        minWidth={[0, 230, 230]}
      >
        <Box
          borderRadius={8}
          bg="#35363C"
          boxShadow="4px 2px 8px rgba(0, 0, 0, 0.08)"
        >
          <Input
            placeholder={'Search high quality images'}
            value={searchKw}
            onChange={setSearchKw}
            onConfirm={setSearchKw}
            onReset={() => setSearchKw('')}
            hideBg
            style={{ width, height }}
          />
        </Box>

        {searchKw !== '' && isOpen && (
          <Box
            maxHeight={340}
            position={'absolute'}
            left={0}
            top={'calc(100% + 4px)'}
            width={width}
            borderRadius="5px"
            boxShadow="0px 1px 4px rgba(0, 0, 0, 0.8)"
          >
            {isLoading && (
              <Panel>
                <Loader />
              </Panel>
            )}
            {options.length !== 0 ? (
              <Menu isOpen matchWidth strategy="fixed">
                <MenuList
                  pos="absolute"
                  zIndex={1000}
                  left="0"
                  right="0"
                  maxH="300px"
                  overflow="scroll"
                >
                  {options?.map((option) => {
                    return (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          handleClickOption(option.value);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            ) : (
              <NoDataCon
                direction="column"
                alignItems="center"
                maxHeight="inherit"
              >
                <Box height={105}></Box>
                <img src={SearchNoData} width={48} height={48} />
                <Box height={22}> </Box>
                <EmptyTxt>No result found</EmptyTxt>
                <Box h={4}></Box>
                <Flex direction="column" alignItems="center" maxWidth={330}>
                  <Box h={8} />
                  <Box
                    color="readable.secondary"
                    fontWeight={500}
                    textAlign="center"
                    fontSize="14pxs"
                    lineHeight="20px"
                  >
                    Try adjusting your search request to find what you’re
                    looking for
                  </Box>
                </Flex>
                <Box height={116}></Box>
              </NoDataCon>
            )}
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default Search;

const Input = styled(SearchInput)`
  height: 56px;
  color: #5c5f6a;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #5c5f6a;
  background-color: #14151a;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 420px;
`;

const NoDataCon = styled(Flex)`
  background: ${(props: any) => props.theme.colors.bg.bottom};
`;

const EmptyTxt = styled.div`
  font-weight: 700;
  font-size: 20px;
  word-break: break-all;
  text-align: center;
`;

const Panel = styled.div`
  height: 100%;
  width: 100%;
  max-height: inherit;
  background: ${(props: any) => props.theme.colors.bg.bottom};
  overflow-x: hidden;
`;
