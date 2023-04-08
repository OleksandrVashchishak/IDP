import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';

interface Confirm {
  onOk?: () => void;
  title: string;
  content: string;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
}

const error = ({ onOk = () => undefined, onCancel, title, content, okText = 'Ok' }: Confirm): void => {
  Modal.error({ title, icon: <ExclamationCircleOutlined />, content, okText, onOk, onCancel });
};

export default error;
