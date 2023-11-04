import { Box, Flex } from '@totejs/uikit';
import { useRef } from 'react';
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import { Card } from './card';
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

const imgs = [
  'https://source.unsplash.com/random/200x400',
  'https://source.unsplash.com/random/300x400',
  'https://source.unsplash.com/random/400x400',
  'https://source.unsplash.com/random/100x400',
  'https://source.unsplash.com/random/100x400',
  'https://source.unsplash.com/random/100x400',
  'https://source.unsplash.com/random/100x400',
  'https://source.unsplash.com/random/100x400',
  'https://source.unsplash.com/random/100x400',
];

export const Sliders = () => {
  const ref = useRef() as any;

  return (
    <Box position="relative">
      <TinySlider
        settings={settings}
        ref={(ts) => {
          ref.current = ts;
        }}
      >
        {imgs.map((el, index) => (
          <Card key={index}>
            <div style={{ fontSize: '30px' }}>{index}</div>
          </Card>
          //   {/* <img
          //     className={`tns-lazy-img`}
          //     src={loadingImage}
          //     data-src={el}
          //     alt=""
          //   /> */}
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
