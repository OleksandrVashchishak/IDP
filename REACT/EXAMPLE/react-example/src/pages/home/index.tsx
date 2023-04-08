import Layout from '../../components/Layout/Simple';
import Content from '../../components/Pages/Home';
import { displayName } from '../../config';

export default function Home(): JSX.Element {
  document.title = displayName;

  return (
    <Layout>
      <Content />
    </Layout>
  );
}
