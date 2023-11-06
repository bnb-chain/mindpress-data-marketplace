import { Box, Flex } from '@totejs/uikit';
import { AiModelIcon } from '../components/svgIcon/AiModelIcon';
import { BookIcon } from '../components/svgIcon/Book';
import { EducationIcon } from '../components/svgIcon/Education';
import { FinanceIcon } from '../components/svgIcon/Finance';
import { GameIcon } from '../components/svgIcon/Game';
import { Model3DIcon } from '../components/svgIcon/Model3D';
import { PhotoIcon } from '../components/svgIcon/PhototIcon';
import { ScienceIcon } from '../components/svgIcon/ScienceIcon';
import { SourceCodeIcon } from '../components/svgIcon/SourceCodeIcon';
import { UncategorizedIcon } from '../components/svgIcon/Uncategorized';
import { IconProps } from '@totejs/icons';

// interface Props {
//   id: string;
//   showName?: boolean;
// }

// export const CategoryTag = (props: Props) => {
//   const { id, showName = false } = props;

//   const category = CATEGORY_MAP[id];
//   return (
//     <Flex
//       display="inline-block"
//       bg={category.bgColor}
//       padding="8px 12px"
//       alignItems="center"
//     >
//       {category.icon}
//       {showName && <Box>{category.name}</Box>}
//     </Flex>
//   );
// };

export const CATEGORY_MAP: Record<
  string,
  {
    icon: (props: IconProps) => React.ReactNode;
    name: string;
    bgColor: string;
  }
> = {
  // AI Model
  '1': {
    name: 'AI Model',
    icon: (props: IconProps) => <AiModelIcon {...props} />,
    bgColor: '#7EB5F6',
  },
  '2': {
    name: 'Source Code',
    icon: (props: IconProps) => <SourceCodeIcon {...props} />,
    bgColor: '#C4C8D0',
  },
  '3': {
    name: 'Digital Media',
    icon: (props: IconProps) => <PhotoIcon {...props} />,
    bgColor: '#DFD93F',
  },
  '4': {
    name: 'Book',
    icon: (props: IconProps) => <BookIcon {...props} />,
    bgColor: '#E9927C',
  },
  '5': {
    name: 'Scientific Data',
    icon: (props: IconProps) => <ScienceIcon {...props} />,
    bgColor: '#92E4B9',
  },
  '6': {
    name: 'Game',
    icon: (props: IconProps) => <GameIcon {...props} />,
    bgColor: '#EA9D98',
  },
  '7': {
    name: '3D Model',
    icon: (props: IconProps) => <Model3DIcon {...props} />,
    bgColor: '#B0A7E7',
  },
  '8': {
    name: 'Education',
    icon: (props: IconProps) => <EducationIcon {...props} />,
    bgColor: '#8BADD6',
  },
  '9': {
    name: 'Finance',
    icon: (props: IconProps) => <FinanceIcon {...props} />,
    bgColor: '#53F6A1',
  },
  '100': {
    name: 'Uncategorized',
    icon: (props: IconProps) => <UncategorizedIcon {...props} />,
    bgColor: '#373943',
  },
};
