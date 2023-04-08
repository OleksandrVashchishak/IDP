import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form as AntdForm, Input, Typography } from 'antd';

import { useAuth } from '../../../../context/auth';
import { login, password } from '../../../../utils/inputRules';

import styles from './index.module.less';

export default function Form(): JSX.Element | null {
  const navigate = useNavigate();
  const { authorized, signIn, loading, error, clearResponseError } = useAuth();

  useEffect(() => {
    if (authorized) {
      navigate('/users', { replace: true });
    }
  }, [authorized]);

  useEffect(() => {
    clearResponseError();
  }, []);

  return (
    <AntdForm
      layout="vertical"
      onFinish={signIn}
      className={styles.form}
      autoComplete="off"
      initialValues={{ remember: true }}
    >
      {error ? (
        <AntdForm.Item>
          <Alert
            onClose={clearResponseError}
            message={error}
            type="error"
            closable
            showIcon
          />
        </AntdForm.Item>
      ) : null}
      <AntdForm.Item name="login" rules={login}>
        <Input size="large" prefix={<UserOutlined />} placeholder="Username" />
      </AntdForm.Item>
      <AntdForm.Item name="password" rules={password}>
        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Password" />
      </AntdForm.Item>
      <AntdForm.Item className={styles.checkbox}>
        <AntdForm.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </AntdForm.Item>
        <Link to="/forgot-password" style={{ color: 'var(--color-green-6)' }}>
          Forgot password?
        </Link>
      </AntdForm.Item>
      <AntdForm.Item shouldUpdate>
        {({ getFieldsValue }) => {
          const { login: loginValue, password: passwordValue } = getFieldsValue();
          const formIsComplete = !!loginValue && loginValue.length >= 3 && !!passwordValue && passwordValue.length >= 6;

          return (
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={!formIsComplete}
            >
              Log In
            </Button>
          );
        }}
      </AntdForm.Item>
      <Typography.Paragraph type="secondary" className="additionalInfo">
        Are you having problems with authorization? Contact your manager for assistance.
      </Typography.Paragraph>
    </AntdForm>
  );
}
