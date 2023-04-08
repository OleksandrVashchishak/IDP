import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Tooltip } from 'antd';
import { adjectives, colors, NumberDictionary, uniqueNamesGenerator } from 'unique-names-generator';

import Loading from '../../../Common/Loading';
import SelectRole from '../../../Common/SelectRole';
import SelectStatus from '../../../Common/SelectStatus';
import { useContextUsers } from '../../../../context/users';
import { getMessageInError } from '../../../../hooks/fetch';
import { generateRandomString } from '../../../../utils';
import { UserUpdateParams, useUserId } from '../../../../hooks/users';
import { email, login, minSixSymbols, noWhiteSpaces, required } from '../../../../utils/inputRules';

interface ModalUpdateUser {
  id: number;
  close: () => void;
  isOpen: boolean;
}

function ModalUpdateUser({ isOpen, close, id }: ModalUpdateUser): JSX.Element {
  const [form] = Form.useForm();
  const userId = useUserId();
  const { userUpdate } = useContextUsers();

  const [isCopied, setIsCopied] = useState<'login' | 'password' | ''>('');
  const [roleState, setRoleState] = useState('user');
  const [loginState, setLoginState] = useState('');
  const [passwordState, setPasswordState] = useState('');

  useEffect(() => {
    if (id) {
      userId.fetch(undefined, id);
    }
  }, [id]);

  useEffect(() => {
    if (form && userId.data && !userId.error && form) {
      form.setFieldsValue({
        role: userId.data.role,
        login: userId.data.login,
        email: userId.data.email,
        status: userId.data.status,
        password: '',
        lastName: userId.data.lastName,
        firstName: userId.data.firstName,
      });
      setLoginState(userId.data.login);
    }
  }, [form, userId.data]);

  useEffect(() => {
    if (userId.error) {
      getMessageInError(userId.error);
      userId.clearError();
    }
  }, [userId.error]);

  const onSubmit = useCallback((values: UserUpdateParams) => {
    const params: UserUpdateParams = {
      role: values.role,
      email: values.email,
      login: values.login,
      status: values.status,
      lastName: values.lastName,
      firstName: values.firstName,
    };

    if (values.password) {
      params.password = values.password;
    }

    userUpdate?.fetch(params, id);
  }, [userUpdate, id]);

  const handleOk = () => {
    form.validateFields().then((values) => onSubmit(values));
  };

  const numberDictionary = NumberDictionary.generate({ min: 1, max: 99 });

  const generateRandomUsername = () => (
    uniqueNamesGenerator({
      dictionaries: form.getFieldsValue().firstName || form.getFieldsValue().lastName
        ? [[form.getFieldsValue().firstName?.replaceAll(' ', '_')],
          [form.getFieldsValue().lastName?.replaceAll(' ', '_')], numberDictionary]
        : [adjectives, colors, numberDictionary],
    })
  );

  const copyField = (fieldName: 'login' | 'password') => {
    setIsCopied(fieldName);
    navigator.clipboard.writeText(form.getFieldsValue()[fieldName] || '');
    setTimeout(() => setIsCopied(''), 1500);
  };

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        login: loginState,
        password: passwordState,
        role: roleState,
      });
    }
  }, [passwordState, loginState, roleState]);

  useEffect(() => {
    if (isOpen) {
      form.validateFields(['password']);
    }
  }, [passwordState]);

  useEffect(() => {
    if (isOpen) {
      form.validateFields(['login']);
    }
  }, [loginState]);

  useEffect(() => {
    if (isOpen) {
      form.validateFields(['role']);
    }
  }, [roleState]);

  useEffect(() => {
    if (userUpdate?.data && !userUpdate.error) {
      message.success('Updated!');
      close();
      setLoginState('');
      setPasswordState('');
    }
  }, [userUpdate?.data]);

  useEffect(() => {
    if (userUpdate?.error) {
      message.error(getMessageInError(userUpdate.error));
      userUpdate.clearError();
    }
  }, [userUpdate?.error]);

  return (
    <Modal
      onOk={handleOk}
      title="Edit User"
      okText="Save changes"
      visible={isOpen}
      onCancel={() => {
        close();
        setPasswordState('');
        setLoginState('');
      }}
      afterClose={form.resetFields}
      confirmLoading={userUpdate?.loading}
      destroyOnClose
    >
      <Loading absolute visible={userId.loading} />
      <Form form={form} name="user_create" layout="horizontal" labelCol={{ span: 5 }}>
        <Form.Item name="firstName" label="First Name">
          <Input type="text" placeholder="Please enter" />
        </Form.Item>
        <Form.Item name="lastName" label="Last Name">
          <Input type="text" placeholder="Please enter" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={email}>
          <Input type="email" placeholder="Please enter" />
        </Form.Item>
        <Form.Item name="login" label="Username" rules={login}>
          <Input.Group compact>
            <Input
              type="text"
              value={loginState}
              style={{ width: 'calc(100% - 32px - 92px)' }}
              onChange={(e) => setLoginState(e.target.value)}
              placeholder="Please enter"
            />
            <Tooltip title="Copy">
              <Button
                icon={isCopied === 'login' ? <CheckOutlined /> : <CopyOutlined />}
                onClick={() => copyField('login')}
              />
            </Tooltip>
            <Tooltip title="Generate random login">
              <Button onClick={() => setLoginState(generateRandomUsername())}>
                Generate
              </Button>
            </Tooltip>
          </Input.Group>
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[...minSixSymbols, ...noWhiteSpaces]}>
          <Input.Group compact>
            <Input
              type="text"
              value={passwordState}
              style={{ width: 'calc(100% - 32px - 92px)' }}
              onChange={(e) => setPasswordState(e.target.value)}
              placeholder="Please enter (at least 6 characters)"
            />
            <Tooltip title="Copy">
              <Button
                icon={isCopied === 'password' ? <CheckOutlined /> : <CopyOutlined />}
                onClick={() => copyField('password')}
              />
            </Tooltip>
            <Tooltip title="Generate random password">
              <Button onClick={() => setPasswordState(generateRandomString())}>
                Generate
              </Button>
            </Tooltip>
          </Input.Group>
        </Form.Item>
        <Form.Item name="role" label="Role" rules={required}>
          <SelectRole value={roleState} onChange={(value) => setRoleState(value)} />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={required}>
          <SelectStatus />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalUpdateUser;
