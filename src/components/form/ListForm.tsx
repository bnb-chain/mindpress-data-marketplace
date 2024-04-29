import styled from '@emotion/styled';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Textarea,
} from '@totejs/uikit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGetCatoriesMap } from '../../hooks/useGetCatoriesMap';
import { Option, Select } from '../ui/select';
import BSCIcon from '../svgIcon/BSCIcon';
import { useAccount } from 'wagmi';
import { YellowButton } from '../ui/buttons/YellowButton';

interface FormValues {
  name: string;
  description: string;
  category: string;
  price: string;
}

const ListSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  price: Yup.number()
    .required('Price is required')
    .typeError('Price must be a number'),
  category: Yup.string().required('Category is required'),
});

export const ListForm: React.FC<{ owner?: string }> = ({ owner }) => {
  const { address } = useAccount();
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      category: '',
      price: '',
    },
    onSubmit: (v) => {
      console.log('form v:', v);
      // openListModal
    },
    validationSchema: ListSchema,
    validateOnChange: false,
    validateOnBlur: false,
  });

  const { data: cates } = useGetCatoriesMap();
  const categoryOptions = cates?.map((v) => {
    const option: Option = {
      label: v.name,
      value: String(v.id),
    };
    return option;
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap="24px">
        <MpFormControl isInvalid={!!formik.errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <MpInput
            id="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && (
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          )}
        </MpFormControl>
        <MpFormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <MpTextarea
            id="description"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
        </MpFormControl>
        <MpFormControl isInvalid={!!formik.errors.category}>
          <FormLabel htmlFor="category">Category</FormLabel>
          <Select
            handleSelectVal={(v) => {
              formik.setFieldValue('category', v);
            }}
            options={categoryOptions}
          />
          {formik.errors.category && (
            <FormErrorMessage>{formik.errors.category}</FormErrorMessage>
          )}
        </MpFormControl>
        <MpFormControl isInvalid={!!formik.errors.price}>
          <FormLabel htmlFor="price">Set a price</FormLabel>
          <InputGroup>
            <MpInput
              id="price"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.price}
            />
            <InputRightElement pr="12px">
              <BSCIcon />
              <Box ml="5px" color="#F7F7F8">
                BNB
              </Box>
            </InputRightElement>
          </InputGroup>
          {formik.errors.price && (
            <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
          )}
        </MpFormControl>

        <Flex gap={10} alignItems={'center'}>
          {address === owner && (
            <YellowButton
              w="100%"
              h="48px"
              borderRadius="8px"
              type="submit"
              // onClick={openListModal}
            >
              List
            </YellowButton>
          )}
        </Flex>
      </Stack>
    </form>
  );
};

const MpFormControl = styled(FormControl)`
  color: #8c8f9b;
  font-size: 14px;
`;

const MpInput = styled(Input)`
  padding: 12px 16px;
  font-size: 16px;
  color: #f7f7f8;
  height: 48px;
`;

const MpTextarea = styled(Textarea)`
  padding: 12px 16px;
  font-size: 16px;
  color: #f7f7f8;
`;
