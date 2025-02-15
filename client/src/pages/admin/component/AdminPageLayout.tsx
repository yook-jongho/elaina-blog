import React from 'react';
import styled from 'styled-components';

import { SideBar } from './SideBar';

const Container = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});

const Side = styled.aside({
  width: '300px',
  position: 'sticky',
  height: 'calc(100vh - 5rem - 20px)',
  top: 'calc(5rem + 20px)'
});

const Section = styled.section({
  width: '850px',
  marginLeft: '50px'
});

interface Props {
  children: JSX.Element;
}

export function AdminPageLayout(props: Props) {
  return (
    <Container>
      <Side>
        <SideBar />
      </Side>
      <Section>{props.children}</Section>
    </Container>
  );
}
