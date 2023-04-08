import React, { useEffect } from 'react';
import { Card, Col, Form, Input, Row } from 'antd';

import { useContextSettings } from '../../../../context/settings';
import { greaterFive, number, required } from '../../../../utils/inputRules';

function GeneralSettings(): JSX.Element {
  const { onSave, settingsGet, values, setValue, setIsDisabled } = useContextSettings();
  const [form] = Form.useForm();

  useEffect(() => {
    if (form && values.length) {
      const newValues: Record<string, string> = {};

      values.forEach((value) => {
        newValues[value.key] = value.value;
      });

      form.setFieldsValue(newValues);

      form.validateFields().then(() => setIsDisabled(false)).catch(() => setIsDisabled(true));
    }
  }, [form, values]);

  return (
    <Card title="General settings" style={{ marginBottom: '24px' }} loading={settingsGet?.loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
        className="settings"
      >
        {values.map((value) => (
          <Row key={value.id} gutter={24}>
            <Col span={8}>
              <Form.Item
                name={value.key}
                label="Session time (minutes)"
                rules={[...number, ...required, ...greaterFive]}
              >
                <Input
                  type="text"
                  value={value.value}
                  onChange={({ target }) => setValue({ ...value, value: target.value })}
                  placeholder="Please enter"
                />
              </Form.Item>
            </Col>
          </Row>
        ))}
      </Form>
    </Card>
  );
}

export default GeneralSettings;
