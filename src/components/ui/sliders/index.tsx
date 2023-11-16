import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { useRef, useState } from 'react';
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import { DefaultButton } from '../buttons/DefaultButton';
import { LeftArrow } from './LeftArrow';
import { RightArrow } from './RightArrow';
import { SliderCard } from './sliderCard';

const ITEMS_COUNT = 3;

const settings = {
  // lazyload: true,
  nav: false,
  mouseDrag: false,
  loop: false,
  items: ITEMS_COUNT,
  gutter: 16,
  // edgePadding: 16,
  swipeAngle: false,
  fixedWidth: 340,
  speed: 300,
  arrowKeys: true,
  controls: false,
};

interface Props {
  data: {
    categoryId: number;
    imgUrl: string;
    name: string;
    address: string;
    volumn: string;
    price: string;
    id: number;
  }[];
}

export const Sliders = (props: Props) => {
  const { data } = props;
  const ref = useRef() as any;
  const [index, setIndex] = useState(0);

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
            categoryId={item.categoryId}
            price={item.price}
            volumn={item.volumn}
            id={item.id}
          />
        ))}
      </TinySlider>

      {data.length > ITEMS_COUNT && (
        <ButtonGroup>
          <DefaultButton
            as="button"
            title="Previous"
            onClick={() => {
              setIndex(index - 1);
              ref.current.slider.goTo('prev');
            }}
            disabled={index === 0}
          >
            <Box w="30px" h="30px" lineHeight="30px">
              <LeftArrow w={18} color="#1C1B1F" />
            </Box>
          </DefaultButton>
          <DefaultButton
            as="button"
            title="Next"
            onClick={() => {
              setIndex(index + 1);
              ref.current.slider.goTo('next');
            }}
            disabled={index === data.length - 2}
          >
            <Box w="30px" h="30px" lineHeight="30px">
              <RightArrow w={18} color="#1C1B1F" />
            </Box>
          </DefaultButton>
        </ButtonGroup>
      )}
    </Box>
  );
};

const ButtonGroup = styled(Flex)`
  justify-content: flex-end;
  padding-bottom: 40px;
  gap: 16px;
  margin-right: 30px;
`;
