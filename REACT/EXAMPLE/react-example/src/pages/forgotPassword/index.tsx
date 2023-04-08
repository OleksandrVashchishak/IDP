import Layout from '../../components/Layout/Auth';
import Content from '../../components/Pages/ForgotPassword';
import { displayName } from '../../config';

export default function ForgotPassword(): JSX.Element {
  document.title = `${displayName}: Forgot password`;

  return (
    <Layout>
      <Content />
    </Layout>
  );
}
