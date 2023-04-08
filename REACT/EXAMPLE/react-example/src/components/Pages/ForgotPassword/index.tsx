import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Input, Typography } from 'antd';

import { login } from '../../../utils/inputRules';
import { usePasswordForgot } from '../../../hooks/password';
import { getMessageInError } from '../../../hooks/fetch';

import styles from './index.module.less';

interface FormEmail {
  setSend: () => void;
}

function FormEmail({ setSend }: FormEmail) {
  const [error, setError] = useState('');
  const passwordCreate = usePasswordForgot();
  const onFinish = async ({ login: loginValue }: { login: string; }): Promise<void> => {
    passwordCreate.fetch({ login: loginValue }).then(() => {
      setSend();
    });
  };

  useEffect(() => {
    if (passwordCreate.error) {
      setError(getMessageInError(passwordCreate.error));
      passwordCreate.clearError();
    }
  }, [passwordCreate.error]);

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ remember: true }}
    >
      <Typography.Title level={4} style={{ textAlign: 'center' }}>
        Forgot password
      </Typography.Title>
      <Typography.Paragraph type="secondary" className="additionalInfo">
        Please enter your Username. We will send you a new password to your email.
      </Typography.Paragraph>
      {error ? (
        <Form.Item>
          <Alert
            type="error"
            onClose={() => setError('')}
            message={error}
            closable
            showIcon
          />
        </Form.Item>
      ) : null}
      <Form.Item name="login" rules={login}>
        <Input size="large" prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item shouldUpdate>
        {({ getFieldsValue, getFieldsError }) => {
          const { login: loginValue } = getFieldsValue();
          const fieldsError = getFieldsError();

          return (
            <Button
              size="large"
              type="primary"
              block
              loading={passwordCreate.loading}
              htmlType="submit"
              disabled={!loginValue || fieldsError.some((item) => item.errors.length)}
            >
              Send me a new password
            </Button>
          );
        }}
      </Form.Item>
      <Form.Item className="textAlignCenter">
        <Link to="/sign-in" style={{ color: 'var(--color-green-6)' }}>
          Back to Login
        </Link>
      </Form.Item>
    </Form>
  );
}

export default function ForgotPassword(): JSX.Element | null {
  const [sendSuccess, setSendSuccess] = useState(false);
  const navigate = useNavigate();

  if (sendSuccess) {
    return (
      <div className={styles.success}>
        <Typography.Title level={4}>Check your email</Typography.Title>
        <Typography.Paragraph>
          Your password has been successfully sent to your email address.
        </Typography.Paragraph>
        <Typography.Paragraph type="secondary" className="additionalInfo">
          If you don’t receive the password within a few moments, please check your spam folder or contact
          your manager for assistance.
        </Typography.Paragraph>
        <Button size="large" type="primary" onClick={() => navigate('/sign-in')}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <FormEmail setSend={() => setSendSuccess(true)} />
  );
}
