import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';

interface Confirm {
  onOk: () => void;
  title: string;
  content: string;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
}

const confirm = ({ onOk, onCancel, title, content, okText = 'Confirm', cancelText = 'Cancel' }: Confirm): void => {
  Modal.confirm({ title, icon: <ExclamationCircleOutlined />, content, okText, cancelText, onOk, onCancel });
};

export default confirm;
