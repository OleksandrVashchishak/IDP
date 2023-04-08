import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { Tabs } from 'antd';
import MapboxMap from './Map';
import MapPins from './MapPins';

export default function Map(): JSX.Element {
  return (
    <Content>
      <Tabs defaultActiveKey="1" style={{ background: 'white', padding: 16 }}>
        <Tabs.TabPane tab="Map" key="1">
          <MapboxMap />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Map Pins" key="2">
          <MapPins />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Map Routes" key="3">
          Map Routes
        </Tabs.TabPane>
        <Tabs.TabPane tab="Map Routes v2" key="4">
          Map Routes v2
        </Tabs.TabPane>
      </Tabs>
    </Content>
  );
}
