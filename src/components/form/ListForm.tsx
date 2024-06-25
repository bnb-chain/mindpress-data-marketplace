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
import { useImmerAtom } from 'jotai-immer';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import * as Yup from 'yup';
import { listAtom } from '../../atoms/listAtom';
import { NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import { useGetCatoriesMap } from '../../hooks/apis/useGetCatoriesMap';
import { generateGroupName } from '../../utils';
import { client, getGroupInfoByName } from '../../utils/gfSDK';
import BSCIcon from '../svgIcon/BSCIcon';
import { YellowButton } from '../ui/buttons/YellowButton';
import { Option, Select } from '../ui/select';

interface FormValues {
  name: string;
  description: string;
  category: string;
  price: string;
}

const ListSchema = (params: IProps) =>
  Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .matches(/^[^\\\/'"]*$/, 'Strings cannot contain symbols such as slashes')
      .max(24)
      .test(
        'check existed name',
        'This name is already occupied, please change it to another one.',
        async (value) => {
          const { bucketId } = params;
          const { bucketInfo } = await client.bucket.headBucketById(bucketId);
          if (!bucketInfo) {
            throw new Error('bucket not found');
          }
          const groupName = generateGroupName(bucketInfo.bucketName, value);
          const { groupInfo } = await getGroupInfoByName(
            groupName,
            NEW_MARKETPLACE_CONTRACT_ADDRESS,
          );

          if (groupInfo) {
            return false;
          }
          return true;
        },
      ),
    price: Yup.number()
      .positive()
      .required('Price is required')
      .typeError('Price must be a number'),
    category: Yup.string().required('Category is required'),
    description: Yup.string().max(120),
  });

interface IProps {
  bucketId: string;
  objectId: string;
  objectName: string;
  imageUrl: string;
  owner?: string;
}

export const ListForm: React.FC<IProps> = (props: IProps) => {
  const { owner, bucketId, objectId, imageUrl, objectName } = props;
  const { address } = useAccount();
  const [_, setListInfo] = useImmerAtom(listAtom);

  // console.log('listInfo', listInfo);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: objectName,
      description: '',
      category: '',
      price: '',
    },
    onSubmit: (v) => {
      console.log('form v:', v);

      setListInfo((draft) => {
        draft.open = true;
        draft.data = {
          name: v.name,
          bucketId: BigInt(bucketId),
          objectId: BigInt(objectId),
          price: parseEther(v.price),
          imageUrl: imageUrl,
          desc: v.description,
          categoryId: Number(v.category),
        };
      });
    },
    validationSchema: ListSchema(props),
    validateOnChange: false,
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
        <MpFormControl isInvalid={!!formik.errors.name && formik.touched.name}>
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
        <MpFormControl
          isInvalid={!!formik.errors.description && formik.touched.description}
        >
          <FormLabel htmlFor="description">Description</FormLabel>
          <MpTextarea
            id="description"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          {formik.errors.description && (
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
          )}
        </MpFormControl>
        <MpFormControl
          isInvalid={!!formik.errors.category && formik.touched.category}
        >
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
        <MpFormControl
          isInvalid={!!formik.errors.price && formik.touched.price}
        >
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
              isLoading={formik.isValidating}
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
