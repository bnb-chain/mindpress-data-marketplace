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
    color: string;
  }
> = {
  // AI Model
  '1': {
    name: 'AI Model',
    icon: (props: IconProps) => <AiModelIcon {...props} />,
    bgColor: '#7EB5F6',
    color: '#181A1E',
  },
  '2': {
    name: 'Code Resource',
    icon: (props: IconProps) => <SourceCodeIcon {...props} />,
    bgColor: '#C4C8D0',
    color: '#181A1E',
  },
  '3': {
    name: 'Digital Media',
    icon: (props: IconProps) => <PhotoIcon {...props} />,
    bgColor: '#CEA3E8',
    color: '#181A1E',
  },
  '4': {
    name: 'Literary Creation',
    icon: (props: IconProps) => <BookIcon {...props} />,
    bgColor: '#E9927C',
    color: '#181A1E',
  },
  '5': {
    name: 'Scientific Data',
    icon: (props: IconProps) => <ScienceIcon {...props} />,
    bgColor: '#92E4B9',
    color: '#181A1E',
  },
  '6': {
    name: 'Game',
    icon: (props: IconProps) => <GameIcon {...props} />,
    bgColor: '#EA9D98',
    color: '#181A1E',
  },
  '7': {
    name: 'AIGC',
    icon: (props: IconProps) => <Model3DIcon {...props} />,
    bgColor: '#7EB5F6',
    color: '#181A1E',
  },
  '8': {
    name: 'Education',
    icon: (props: IconProps) => <EducationIcon {...props} />,
    bgColor: '#8BADD6',
    color: '#181A1E',
  },
  '9': {
    name: 'Finance',
    icon: (props: IconProps) => <FinanceIcon {...props} />,
    bgColor: '#53F6A1',
    color: '#181A1E',
  },
  '100': {
    name: 'Uncategorized',
    icon: (props: IconProps) => <UncategorizedIcon {...props} />,
    bgColor: '#373943',
    color: '#C4C5CB',
  },
};
