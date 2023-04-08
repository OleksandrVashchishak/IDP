import { Content } from 'antd/es/layout/layout';
import React, { useCallback, useState } from 'react';

import TableUsers from './Table';
import ModalCreateUser from './Create';
import ModalUpdateUser from './Update';
import { ModalState, ModalTypes } from '../../../types';

function Users(): JSX.Element {
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = useCallback((state: ModalState | null) => setModal(state), [setModal]);
  const closeModal = useCallback(() => setModal(null), [setModal]);

  return (
    <Content>
      <ModalCreateUser isOpen={modal?.type === ModalTypes.create} close={closeModal} />
      <ModalUpdateUser isOpen={modal?.type === ModalTypes.update} close={closeModal} id={modal?.id || 0} />
      <TableUsers openModal={openModal} />
    </Content>
  );
}

export default Users;
