import styled from '@emotion/styled';
import { Box } from '@totejs/uikit';

interface Props {
  total: number;
  text: string;
}

export const Desc: React.FC<Props> = ({ total, text }) => {
  return (
    <Con>
      {/* {res?.total} images found for "{kw || category?.name}". */}
      {total} images found for "{text}".
    </Con>
  );
};

const Con = styled(Box)`
  margin-top: 16px;
  color: #8c8f9b;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
`;
