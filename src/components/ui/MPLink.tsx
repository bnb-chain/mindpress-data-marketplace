import { Link as ChakraLink, LinkProps as LinkProps2 } from '@totejs/uikit';
import { Link as ReactRouterLink, LinkProps } from 'react-router-dom';

export const MPLink = (props: LinkProps & LinkProps2) => {
  return <ChakraLink as={ReactRouterLink} {...props} />;
};
