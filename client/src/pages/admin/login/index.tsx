import React, { useRef, useState, FormEvent } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useSelector } from 'react-redux';

import { InputBox } from 'src/components';
import { theme } from 'src/styles';
import { LOGIN } from 'src/query/user';
import { RootState } from 'src/redux/rootReducer';
import { ThemeMode } from 'src/redux/common/type';
import { appCommponProps } from 'src/pages/_app';

const Container = styled.div({
  display: 'flex',
  width: '100%',
  height: 'calc(100vh - 5rem - 20px)',
  alignItems: 'center',
  justifyContent: 'center'
});

const LogInForm = styled.form({
  width: '400px',
  height: '400px',
  padding: '.5rem',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #ddd',
  borderRadius: '.5rem',
  justifyContent: 'center',
  alignItems: 'center'
});

const InputWrapper = styled.div({
  display: 'flex',
  width: '80%',
  flexDirection: 'column',
  margin: '10px 0'
});

const HelpWrapper = styled.div({
  display: 'flex',
  width: '80%',
  flexDirection: 'column',
  margin: '10px 0'
});

const Label = styled.label<{ color?: string; isBold?: boolean }>((props) => {
  return {
    display: 'inline-block',
    textAlign: 'left',
    fontWeight: props.isBold ? 'bold' : 'normal',
    color: props.color ? props.color : ''
  };
});

Label.defaultProps = {
  isBold: false
};

const LogInButton = styled.button<{ themeMode: ThemeMode }>((props) => ({
  width: '85%',
  height: '2.5rem',
  marginTop: '24px',
  borderRadius: '.5rem',
  backgroundColor: theme[props.themeMode].submitButtonColor,
  color: '#f1f2f3'
}));

const LogInText = styled.span({
  fontWeight: 'bold'
});

const MessageBox = styled.div({
  display: 'flex',
  marginTop: '16px'
});

interface Props {
  cookie?: string;
}

export default function Login(props: Props) {
  const themeMode: ThemeMode = useSelector<RootState, any>((state) => state.common.theme);

  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [login] = useMutation(LOGIN, {
    onCompleted: (data: any) => {
      if (document.referrer === '') {
        router.push('/');
      } else {
        router.back();
      }
    },
    onError: (err: Error) => {
      handleError(err.message);
    }
  });

  function controlEnterKey(e: React.KeyboardEvent<HTMLDivElement>, myInputRef: HTMLInputElement, otherInputRef: HTMLInputElement) {
    e.preventDefault();

    const myValueLength: number = myInputRef.value.length;
    const otherValueLength: number = otherInputRef.value.length;

    if (myValueLength !== 0 && otherValueLength === 0) {
      otherInputRef.focus();
    } else if (myValueLength !== 0 && otherValueLength !== 0) {
      buttonRef.current?.click();
    }
  }

  function handleError(message: string) {
    if (passwordInputRef.current) {
      passwordInputRef.current.value = '';
    }
    passwordInputRef.current?.focus();
    setErrorMessage(message);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (emailInputRef.current && passwordInputRef.current) {
      login({
        variables: {
          emailId: emailInputRef.current.value,
          password: passwordInputRef.current.value
        }
      });
    }
  }

  return (
    <Container>
      <LogInForm onSubmit={(event: FormEvent) => handleSubmit(event)}>
        <InputWrapper>
          <Label isBold={true}>Email</Label>
          <InputBox
            ref={emailInputRef}
            id='admin-id'
            type='email'
            minLength={4}
            maxLength={100}
            placeholder='Email'
            styles={{ margin: '8px 0 0 0', width: '100%' }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.nativeEvent.key === 'Enter') {
                if (emailInputRef.current && passwordInputRef.current) {
                  controlEnterKey(e, emailInputRef.current, passwordInputRef.current);
                }
              }
            }}
          />
        </InputWrapper>
        <InputWrapper>
          <Label isBold={true}>암호</Label>
          <InputBox
            ref={passwordInputRef}
            id='admin-pw'
            type='password'
            minLength={4}
            maxLength={16}
            placeholder='암호'
            styles={{ margin: '8px 0 0 0', width: '100%' }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.nativeEvent.key === 'Enter') {
                if (emailInputRef.current && passwordInputRef.current) {
                  controlEnterKey(e, passwordInputRef.current, emailInputRef.current);
                }
              }
            }}
            isValid={errorMessage.length === 0}
          />
        </InputWrapper>
        <MessageBox>
          <Label color={'red'}>{errorMessage}</Label>
        </MessageBox>
        <LogInButton ref={buttonRef} type='submit' themeMode={themeMode}>
          <LogInText>로그인</LogInText>
        </LogInButton>
        <HelpWrapper></HelpWrapper>
      </LogInForm>
    </Container>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  if (appCommponProps.app.isLogin) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }

  return {
    props: {}
  };
}
