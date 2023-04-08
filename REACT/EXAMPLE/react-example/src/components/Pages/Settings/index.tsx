import React from 'react';
import { Content } from 'antd/es/layout/layout';
import { Button, PageHeader } from 'antd';

import GeneralSettings from './GeneralSettings';
import { useContextSettings } from '../../../context/settings';

function Settings(): JSX.Element {
  const { isDisabled, onSave, settingUpdate } = useContextSettings();

  return (
    <>
      <PageHeader
        title="Settings"
        extra={(
          <Button type="primary" disabled={isDisabled} onClick={onSave} loading={settingUpdate?.loading}>
            Save changes
          </Button>
        )}
      />
      <Content>
        <GeneralSettings />
      </Content>
    </>
  );
}

export default Settings;
