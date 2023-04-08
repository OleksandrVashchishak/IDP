import { Layout, Row } from 'antd';

interface Simple {
  children: React.ReactNode;
}

export default function Simple({ children }: Simple): JSX.Element {
  const { Content } = Layout;

  return (
    <Layout style={{ backgroundColor: 'var(--color-page-background)' }}>
      <Content>
        <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
          {children}
        </Row>
      </Content>
    </Layout>
  );
}
