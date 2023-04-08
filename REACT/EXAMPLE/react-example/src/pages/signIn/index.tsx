import Layout from '../../components/Layout/Auth';
import Content from '../../components/Pages/SignIn';
import { displayName } from '../../config';

export default function SignIn(): JSX.Element {
  document.title = `${displayName}: Log In`;

  return (
    <Layout>
      <Content />
    </Layout>
  );
}
