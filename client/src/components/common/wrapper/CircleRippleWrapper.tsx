import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const Wrapper = styled.div({
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  padding: '8px',
  cursor: 'pointer'
});

const rippleAnimation = keyframes({
  from: {
    opacity: 0.3,
    transform: 'scale(0.3)'
  },
  to: {
    opacity: 1,
    transform: 'scale(1)'
  }
});

const Ripple = styled.div(
  (props) => ({
    display: 'block',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(37, 37, 37, 0.1)'
  }),
  css`
    & {
      animation: ${rippleAnimation} 150ms cubic-bezier(0.4, 0.2, 0.68, 0.53);
    }
  `
);

interface Props {
  children: JSX.Element;
  onClick: () => void;
}

export function CircleRippleWrapper(props: Props) {
  const [isClick, setIsClick] = useState<boolean>(false);

  return (
    <Wrapper onClick={props.onClick}>
      {/* <div style={{ display: 'block' }}>
        <Ripple />
      </div> */}
      {props.children}
      {/* <div
        style={{
          position: 'absolute',
          backgroundColor: 'rgb(12,32,42)'
        }}
      />
      <div
        style={{
          width: '200px',
          height: '200px',
          position: 'relative',
          backgroundColor: 'rgb(132,132,212)'
        }}
      /> */}
    </Wrapper>
  );
}
