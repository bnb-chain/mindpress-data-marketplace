import { MenuCloseIcon } from '@totejs/icons';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@totejs/uikit';
import { useState } from 'react';

export interface Option {
  label: string;
  value: string;
}

export interface IProps {
  options?: Option[];
  handleSelectVal: (val: string) => void;
}

export const Select: React.FC<IProps> = ({ options, handleSelectVal }) => {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const [selectLabel, setSelectLabel] = useState<string>('');

  const handleSelect = (item: Option) => {
    setSelectLabel(item.label);
    onClose();
    handleSelectVal(item.value);
  };

  return (
    <Box pos="relative">
      <Flex
        onClick={onToggle}
        cursor="pointer"
        bgColor="bg.top.normal"
        borderRadius="8px"
        w="100%"
        h="48px"
        alignItems="center"
        padding="12px 16px"
        justifyContent="space-between"
      >
        <Box>{selectLabel}</Box>
        <MenuCloseIcon />
      </Flex>
      <Menu isOpen={isOpen} matchWidth strategy="fixed">
        <MenuList pos="absolute" zIndex={1000} left="0" right="0">
          {options?.map((option) => {
            return (
              <MenuItem
                key={option.value}
                onClick={() => {
                  handleSelect(option);
                }}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
};
