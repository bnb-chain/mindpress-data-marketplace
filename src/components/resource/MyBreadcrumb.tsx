import styled from '@emotion/styled';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@totejs/uikit';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { getItemByBucketId } from '../../utils/apis';
import { getCollectionInfoByName } from '../../utils/gfSDK';

interface Props {
  root: {
    bucketName: string;
  };
}

export const MyBreadcrumb = (props: Props) => {
  const [p] = useSearchParams();
  const path = (p.get('path') as string) || '/';
  const navigator = useNavigate();

  const { root } = props;

  const bucketPath = path === '/' ? '' : path.split('/');
  const breadItems = [root.bucketName].concat(bucketPath);

  // console.log('props', breadItems.length - 1);

  return (
    <CustomBreadcrumb>
      {breadItems.map((item: string, index: number) => {
        return (
          <MyBreadcrumbItem
            key={index}
            isCurrentPage={index === breadItems.length - 2}
          >
            <BreadcrumbLink fontSize="16px" as="span">
              <NavLink
                as="span"
                onClick={async () => {
                  const params: Record<string, string> = {};

                  if (item !== root.bucketName) {
                    params.path = item + '/';
                  }

                  const bucketData = await getCollectionInfoByName(item);
                  const ItemInfo = await getItemByBucketId(
                    bucketData.bucketInfo.id,
                  );
                  params.id = String(ItemInfo.id);

                  navigator({
                    pathname: '/resource',
                    search: `?${createSearchParams(params)}`,
                  });
                }}
              >
                {item}
              </NavLink>
            </BreadcrumbLink>
          </MyBreadcrumbItem>
        );
      })}
    </CustomBreadcrumb>
  );
};

const CustomBreadcrumb = styled(Breadcrumb)`
  /* background: #373943; */
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
`;

const MyBreadcrumbItem = styled(BreadcrumbItem)``;

const NavLink = styled(Box)`
  cursor: pointer;
`;
