import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { useNavigate } from 'react-router-dom';
import { ArtIcon } from '../svgIcon/Art';
import { BookIcon } from '../svgIcon/Book';
import { Model3DIcon } from '../svgIcon/Model3D';
import { MovieIcon } from '../svgIcon/MovieIcon';
import { PhotoIcon } from '../svgIcon/PhototIcon';
import { SourceCodeIcon } from '../svgIcon/SourceCodeIcon';
import LinkArrow from '../../images/link_arrow.png';

export const Ad = () => {
  const navigate = useNavigate();

  return (
    <Container
      p="48px 32px"
      cursor="pointer"
      onClick={() => {
        navigate('/profile?tab=collections');
      }}
    >
      <Title>
        <Box as="span" color="#ffe900;">
          List Your Data
        </Box>
        <Box as="span"> or Collection To Earn</Box>
      </Title>

      <AdList>
        <AdItem>
          <MovieIcon /> Movie
        </AdItem>
        <AdItem>
          <PhotoIcon /> Photos
        </AdItem>
        <AdItem>
          <BookIcon /> Books
        </AdItem>
        <AdItem>
          <ArtIcon /> Art
        </AdItem>
        <AdItem>
          <Model3DIcon /> 3D Models
        </AdItem>
        <AdItem>
          <SourceCodeIcon />
          Source Code
        </AdItem>
      </AdList>
    </Container>
  );
};

const Container = styled(Box)`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    display: block;
    right: 100px;
    top: 48px;
  }

  &:hover {
    &::after {
      background: url(${LinkArrow}) no-repeat center center;
      background-size: contain;
    }
  }
`;

const Title = styled.h2`
  color: #fff;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
`;

const AdList = styled(Flex)`
  margin-top: 48px;
  gap: 8px;
  color: #c4c5cb;
`;

const AdItem = styled(Flex)`
  background-color: #373943;
  font-size: 16px;
  font-weight: 500;
  border-radius: 100px;
  height: 56px;
  line-height: 56px;
  padding: 0 24px;
  align-items: center;
  gap: 8px;
`;
