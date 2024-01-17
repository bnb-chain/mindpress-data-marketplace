import styled from '@emotion/styled';
import { BackIcon, GoIcon } from '@totejs/icons';
import { Box, Flex } from '@totejs/uikit';
import { useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Item } from '../../../utils/apis/types';
import { MPLink } from '../MPLink';

interface IProps {
  list: Item[];
}

export const Carousel = ({ list }: IProps) => {
  const ref = useRef() as any;
  const [index, setIndex] = useState(0);

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    // adaptiveHeight: false,
    centerMode: true,
    // centerPadding: '0px',
    variableWidth: true,
  };
  return (
    <Container>
      <Slider
        {...settings}
        ref={(ts) => {
          ref.current = ts;
        }}
      >
        {list.map((item) => {
          const imageUrl =
            item.url || `https://picsum.photos/500/200?${item.id}`;
          return (
            <Card key={item.id} to={`/resource?id=${item.id}&path=/`}>
              <img src={imageUrl} />
            </Card>
          );
        })}
      </Slider>

      <Arrows>
        <Arrow
          as="button"
          title="Previous"
          // style={{
          //   visibility: index === 0 ? 'hidden' : 'visible',
          // }}
          onClick={() => {
            setIndex(index - 1);
            ref.current?.slickPrev();
          }}
        >
          <BackIcon w={18} color="#F7F7F8" />
        </Arrow>

        <Arrow
          as="button"
          title="Next"
          onClick={() => {
            setIndex(index + 1);
            ref.current?.slickNext();
          }}
          // style={{
          //   visibility: index === DATA.length - 1 ? 'hidden' : 'visible',
          // }}
        >
          <GoIcon w={18} color="#F7F7F8" />
        </Arrow>
      </Arrows>
    </Container>
  );
};

const Container = styled(Box)`
  position: relative;
`;

const Card = styled(MPLink)`
  padding-right: 20px;
  /* width: 300px; */

  img {
    /* width: 300px; */
    height: 200px;
    object-fit: contain;
  }
`;

const Arrows = styled(Flex)`
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const Arrow = styled(Box)`
  width: 58px;
  height: 58px;
  background-color: #36383c;
  border-radius: 40px;
  &:hover {
    background: rgb(54, 56, 60, 0.8);
  }
`;
