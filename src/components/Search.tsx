import { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchInput } from './SearchInput';

import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { useDebounce } from '../hooks/common/useDebounce';
import { parseGroupName } from '../utils';
import { searchKey } from '../utils/gfSDK';
import ScrollSelect from './ScrollSelect';
// import { multiCallFun } from '../base/contract/multiCall';
// import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import Web3 from 'web3';
import { getItemByGroupId } from '../utils/apis';

const Group = (props: any) => {
  const {
    group: { group_name },
  } = props;
  const { name } = parseGroupName(group_name);
  return <div>{name}</div>;
};

interface ISearch {
  width?: string;
  height?: string;
  kw?: string;
}

const Search = (props: ISearch) => {
  let { width, height, kw } = props;
  width = width || '420px';
  height = height || '56px';
  kw = kw || '';
  const [searchValue, setSearchValue] = useState(kw);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);

  const handleSearchChange = useCallback((v: string) => {
    setSearchValue(v);
    if (!v) {
      setShow(false);
    }
  }, []);

  const searchList = useDebounce(async () => {
    if (searchValue && !kw) {
      setShow(true);
      setList([]);
      setLoading(true);
      if (Web3.utils.isAddress(searchValue)) {
        setList([searchValue as never]);
      } else {
        const result: any = await searchKey(searchValue);
        console.log('search result', result);
        let { groups } = result;
        groups = groups.filter((item: any) => {
          const {
            group: { group_name },
          } = item;
          const { bucketName, name, type } = parseGroupName(group_name);
          const reg = new RegExp(searchValue, 'g');
          if (type === 'Collection') {
            return reg.test(bucketName);
          } else {
            return reg.test(name);
          }
        });
        // console.log('searchList', groups);
        if (groups.length) {
          const res = await Promise.all(
            groups.map((item: any) => {
              const {
                group: { id },
              } = item;
              return getItemByGroupId(id);
            }),
          );
          // const res = await multiCallFun(
          //   groups.map((item: any) => {
          //     const {
          //       group: { id },
          //     } = item;
          //     return MarketPlaceContract(false).methods.prices(id);
          //   }),
          // );
          const list: any = groups
            // .map((item: string, index: number) => {
            //   const { price } = res[index];
            //   console.log(res, price);
            //   // if (price.length > 1) {
            //   //   return Object.assign(item, { price });
            //   // }
            //   return false;
            // })
            .filter((item: any) => !!item);

          setList(list);
        }
      }
      setLoading(false);
    }
  }, 500);

  useMemo(async () => {
    searchList();
  }, [searchValue]);

  const render = (item: any) => {
    const { group } = item;
    return <Group group={group}></Group>;
  };
  const link = (item: any) => {
    const {
      group: { group_name, id, owner },
    } = item;
    return `/resource?gid=${id}`;
  };
  const filteredData = useMemo(() => {
    if (searchValue) {
      const collectionList = {
        title: 'Collection',
        list: [],
        render,
        link,
      };
      const dataList = {
        // title: 'Data',
        title: '',
        list: [],
        render,
        link,
      };
      const addressList = {
        title: 'Address',
        list: [],
        render: (item: string) => {
          return <div>{item}</div>;
        },
        link: (item: string) => {
          return `profile?address=${item}`;
        },
      };
      list.forEach((d: any) => {
        if (typeof d === 'string') {
          addressList.list.push(d as never);
        } else {
          const {
            group: { group_name },
          } = d;
          const { type } = parseGroupName(group_name);
          if (type === 'Collection') {
            collectionList.list.push(d as never);
          }
          if (type === 'Data') {
            dataList.list.push(d as never);
          }
        }
      });
      return [collectionList, dataList, addressList];
    }
    return [{ title: '', list: [], render: () => <></>, link: () => '12' }];
  }, [list]);

  const eventListener = useCallback((e: any) => {
    const { target } = e;
    const root = document.getElementById('searchRoot');
    if (!root?.contains(target)) {
      setShow(false);
    }
  }, []);

  useEffect(() => {
    const body = document.body;
    body.addEventListener('click', eventListener);

    return () => {
      body.removeEventListener('click', eventListener);
    };
  }, []);
  return (
    <Container id="searchRoot" style={{ width }}>
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
            value={searchValue}
            onChange={handleSearchChange}
            onConfirm={handleSearchChange}
            onReset={() => setSearchValue('')}
            hideBg
            style={{ width, height }}
          />
        </Box>
        {show && (
          <Box
            maxHeight={340}
            position={'absolute'}
            left={0}
            top={'calc(100% + 4px)'}
            width={width}
          >
            <ScrollSelect
              searchValue={searchValue}
              data={filteredData}
              showSelectIcon={false}
              loading={loading}
              onClose={() => {
                setShow(false);
              }}
            />
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
