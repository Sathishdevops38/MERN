import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';

const AuthPage = () => (
  <div style={{ maxWidth: '420px', margin: '96px auto' }}>
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
    />
  </div>
);

export default AuthPage;
