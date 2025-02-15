import React, { useState } from 'react';
import styled from 'styled-components';

import { AlertBox, AlertStateType } from 'src/components';
import { ProfileType } from 'src/query/profile';

import { ProfileEditForm } from './ProfileEditForm';
import { ProfileViewer } from './ProfileViewer';

interface Props {}

const Container = styled.aside({
  width: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '10px',
  minHeight: 'calc(90vh - 40px)',
  alignSelf: 'stretch',
  '@media screen and (max-width: 1380px)': {
    width: '28%',
    minWidth: '230px',
    maxWidth: '300px'
  },
  '@media screen and (max-width: 767px)': {
    width: '100%',
    minHeight: 'max-content',
    marginBottom: '50px',
    maxWidth: '100%'
  }
});

interface Props {
  profile: ProfileType;
  isLogin: boolean;
}

export function ProfileContainer(props: Props) {
  const initAlertState: AlertStateType = { msg: '', isPop: false, isError: false };

  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState<ProfileType>(props.profile);
  const [alertState, setAlertState] = useState<AlertStateType>(initAlertState);

  return (
    <Container>
      {isEditMode ? (
        <ProfileEditForm
          profile={profile}
          alertState={alertState}
          setEditMode={setIsEditMode}
          setProfile={setProfile}
          setAlertState={setAlertState}
        />
      ) : (
        <ProfileViewer profile={profile} isLogin={props.isLogin} setEditMode={setIsEditMode} />
      )}
      {alertState.isPop && (
        <AlertBox
          isError={alertState.isError}
          msg={alertState.msg}
          onCloseButtonClick={() => {
            setAlertState(initAlertState);
          }}
        />
      )}
    </Container>
  );
}
