import { Box, Flex } from '@totejs/uikit';
import { useRef } from 'react';
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import { SliderCard } from './sliderCard';
import LArrow from './l_arrow.png';
import RArrow from './r_arrow.png';
import styled from '@emotion/styled';

const settings = {
  // lazyload: true,
  nav: false,
  mouseDrag: false,
  loop: false,
  items: 3,
  // gutter: 16,
  swipeAngle: false,
  fixedWidth: 340,
  speed: 300,
  arrowKeys: true,
  controls: false,
};

interface Props {
  data: {
    imgUrl: string;
    name: string;
    address: string;
    volumn: number;
    price: string;
    id: number;
    groupName: string;
  }[];
}

export const Sliders = (props: Props) => {
  const { data } = props;
  const ref = useRef() as any;

  return (
    <Box position="relative">
      <TinySlider
        settings={settings}
        ref={(ts) => {
          ref.current = ts;
        }}
      >
        {data.map((item, index) => (
          <SliderCard
            key={index}
            address={item.address}
            imgUrl={item.imgUrl}
            name={item.name}
            price={item.price}
            volumn={item.volumn}
            id={item.id}
            groupName={item.groupName}
          />
        ))}
      </TinySlider>

      <ButtonGroup>
        <Box
          as="button"
          title="Previous"
          onClick={() => ref.current.slider.goTo('prev')}
        >
          <img src={LArrow} />
        </Box>
        <Box
          as="button"
          title="Next"
          onClick={() => ref.current.slider.goTo('next')}
        >
          <img src={RArrow} />
        </Box>
      </ButtonGroup>
    </Box>
  );
};

const ButtonGroup = styled(Flex)`
  justify-content: flex-end;
  padding-bottom: 40px;
  gap: 16px;
  margin-right: 30px;

  /* position: absolute;
  bottom: 0;
  right: 0; */
`;
