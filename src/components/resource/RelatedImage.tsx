import { useGetItemList } from '../../hooks/useGetItemList';
import { Carousel } from '../ui/carousel';

interface IProps {
  categoryId: number;
}

export const RelatedImage = (props: IProps) => {
  const { data: categoryRelatedList } = useGetItemList({
    filter: {
      address: '',
      keyword: '',
      categoryId: props.categoryId,
    },
    offset: 0,
    limit: 10,
    sort: 'CREATION_DESC',
  });

  return <Carousel list={categoryRelatedList?.items || []} />;
};
