import React, { useEffect, useState } from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Tooltip } from 'antd';
import { adjectives, colors, NumberDictionary, uniqueNamesGenerator } from 'unique-names-generator';

import SelectRole from '../../../Common/SelectRole';
import SelectStatus from '../../../Common/SelectStatus';
import { useContextUsers } from '../../../../context/users';
import { UserCreateParams } from '../../../../hooks/users';
import { getMessageInError } from '../../../../hooks/fetch';
import { generateRandomString } from '../../../../utils';
import { email, login, password, required } from '../../../../utils/inputRules';

interface ModalCreateUser {
  isOpen: boolean;
  close: () => void;
}

function ModalCreateUser({ isOpen, close }: ModalCreateUser): JSX.Element {
  const { userCreate } = useContextUsers();
  const [form] = Form.useForm();

  const [isCopied, setIsCopied] = useState<'login' | 'password' | ''>('');
  const [roleState, setRoleState] = useState('user');
  const [loginState, setLoginState] = useState('');
  const [passwordState, setPasswordState] = useState('');

  const handleOk = () => {
    form.validateFields().then((values) => {
      const data: UserCreateParams = {
        role: values.role,
        login: values.login,
        password: values.password,
      };

      if (values.email) {
        data.email = values.email;
      }

      if (values.lastName) {
        data.lastName = values.lastName;
      }

      if (values.firstName) {
        data.firstName = values.firstName;
      }

      userCreate?.fetch(data).then(() => {
        setLoginState('');
        setPasswordState('');
        setRoleState('user');
      });
    });
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
    if (userCreate?.data && !userCreate.error) {
      message.success('Created!');
      close();
    }
  }, [userCreate?.data]);

  useEffect(() => {
    if (userCreate?.error) {
      message.error(getMessageInError(userCreate.error));
      userCreate.clearError();
    }
  }, [userCreate?.error]);

  return (
    <Modal
      onOk={handleOk}
      title="Add New User"
      okText="Save"
      visible={isOpen}
      onCancel={() => {
        close();
        setPasswordState('');
        setLoginState('');
      }}
      afterClose={form.resetFields}
      confirmLoading={userCreate?.loading}
      destroyOnClose
    >
      <Form
        form={form}
        name="user_create"
        layout="horizontal"
        labelCol={{ span: 5 }}
        autoComplete="false"
        initialValues={{ role: 'user', status: true }}
      >
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
              <Button onClick={() => setLoginState(generateRandomUsername().toLowerCase())}>
                Generate
              </Button>
            </Tooltip>
          </Input.Group>
        </Form.Item>
        <Form.Item name="password" label="Password" rules={password}>
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
          <SelectStatus disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalCreateUser;
