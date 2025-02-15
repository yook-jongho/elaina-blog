import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import { DropDownMenu } from 'src/components';
import { trans, Lang } from 'src/resources/languages';

import ArticleInfo from './ArticleInfo';

const Menu = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  height: '2.2rem',
  alignItems: 'center',
  fontSize: '.875rem'
});

const MenuButton = styled.p<{ danger?: boolean }>((props) => ({
  display: 'block',
  padding: '.5rem',
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  wordBreak: 'keep-all',
  borderRadius: '.5rem',
  color: props.danger ? '#dd0000' : 'inherit',
  '&:hover': {
    backgroundColor: '#ddd'
  }
}));

interface Props {
  isLogin: boolean;
  time: Date;
  author: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

export function ContentMenu(props: Props) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <Menu>
      <ArticleInfo author={props.author} time={props.time} />
      {props.isLogin && (
        <DropDownMenu
          visible={isOpenMenu}
          mainButton={<FontAwesomeIcon icon={faEllipsisV} />}
          setVisible={setIsOpenMenu}
          dropMenu={
            <>
              <MenuButton>
                <Link href={`/post/${props.id}/edit`}>{trans(Lang.Edit)}</Link>
              </MenuButton>
              <MenuButton danger onClick={() => props.setIsModalOpen(true)}>
                {trans(Lang.Delete)}
              </MenuButton>
            </>
          }
        />
      )}
    </Menu>
  );
}
