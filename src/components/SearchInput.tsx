import { Input } from '@totejs/uikit';
import { ColoredErrorIcon, SearchIcon } from '@totejs/icons';
import { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { mobileMedia } from '../hooks/common/useResponsive';
import { useNavigate } from 'react-router-dom';

export interface SearchInputProps {
  value: string;
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
  onReset?: () => void;
  className?: string;
  placeholder?: string;
  hideBg?: boolean;
  hideSearchIcon?: boolean;
  onMouseDown?: any;
  searchDropDown?: boolean;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  style?: any;
}

export function SearchInput({
  value,
  onChange,
  onConfirm,
  onReset,
  onFocus,
  onBlur,
  className,
  placeholder = 'Search Block/ Tx / Address',
  hideBg,
  style,
  hideSearchIcon,
  searchDropDown = false,
  ...rest
}: SearchInputProps) {
  const [innerValue, setInnerValue] = useState<string>('');
  const [isFocus, setIsFocus] = useState(false);
  const navigator = useNavigate();

  const handleChange = useCallback(
    (v: any) => {
      onChange?.(v);
      setInnerValue(v);
    },
    [onChange],
  );

  useEffect(() => {
    handleChange(value);
  }, [handleChange, value]);

  const handleSearchChange = useCallback(
    (e: BaseSyntheticEvent) => {
      handleChange(e.target.value);
    },
    [handleChange],
  );

  const handleSearchConfirm = useCallback(() => {
    navigator(`/search?kw=${innerValue}`);
    onConfirm?.(innerValue);
    // clean the input text after searching
    // handleChange('');
    // setInnerValue('');
  }, [navigator, innerValue, onConfirm]);

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.keyCode === 13) {
        handleSearchConfirm();
      }
    },
    [handleSearchConfirm],
  );

  const handleReset = useCallback(() => {
    handleChange('');
    onReset?.();
  }, [handleChange, onReset]);

  return (
    <SearchBox
      className={className}
      hideBg={!!hideBg}
      searchDropDown={searchDropDown}
      style={style}
      isFocus={isFocus}
    >
      {!hideSearchIcon && <StyledIcon onClick={handleSearchConfirm} />}
      <Input
        placeholder={placeholder}
        value={value || innerValue}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        backgroundColor={'inherit'}
        background={'inherit'}
        {...rest}
        onFocus={(e) => {
          setIsFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocus(false);
          onBlur?.(e);
        }}
      />
      {innerValue.length > 0 && (
        <ColoredErrorIcon
          cursor="pointer"
          color="readable.secondary"
          transitionDuration="normal"
          transitionProperty="colors"
          _hover={{
            color: 'scene.primary.active',
          }}
          onClick={handleReset}
        />
      )}
    </SearchBox>
  );
}

const SearchBox = styled.div<{
  hideBg: boolean;
  searchDropDown: any;
  isFocus: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props: any) => props.theme.bg?.top.normal};
  box-shadow: ${(props: any) =>
    props.searchDropDown ? '0px 4px 24px rgba(0, 0, 0, 0.36);' : ''};
  box-sizing: border-box;
  border: ${(props: any) => {
    return props.hideBg
      ? 'none'
      : props.isFocus
      ? `1px solid ${props.theme.colors.scene.primary.active}`
      : `1px solid ${props.theme.colors.readable.border}`;
  }};

  /* :hover {
    outline: 1px solid #5c5f6a;
    background: #373943;
  } */

  :focus-within {
    outline: 2px solid #5c5f6a;
  }
  input {
    height: 100%;
    border: none;
    flex: 1;
    color: ${(props: any) => props.theme.colors.readable?.normal};
    padding: 0;
    margin-left: 4px;
    ::placeholder {
      color: #5c5f6a;
      font-weight: 600;
      :hover {
        color: ${(props: any) => props.theme.colors.readable.disabled};
      }
    }
  }

  ${mobileMedia} {
    font-size: 16px;
    padding: 6px 8px;
  }
`;

const StyledIcon = styled(SearchIcon)`
  flex-shrink: 0;
  width: 24px;
  min-width: 24px;
  height: 24px;
  cursor: pointer;
  color: #f7f7f8;
`;
