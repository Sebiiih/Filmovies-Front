import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Tooltip, Center, Text, Group, Anchor, Checkbox, Button, rem } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import { LoginCredentials } from '../../@types/Credentials';
import { login } from '../../api';
import './ConnectionPage.scss';

interface LoginResponse {
  message: string;
}

function ConnectionPage() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [stayConnected, setStayConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const emailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const passwordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  const stayConnectedChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStayConnected(event.target.checked);
  };

  const onLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponseMessage(null);

    const loginCredentials: LoginCredentials = {
      email: emailValue,
      password: passwordValue,
    };

    try {
      const response: AxiosResponse<LoginResponse> = await login(loginCredentials);
      setResponseMessage(response.data.message);
      navigate('/'); // Redirection vers la page d'accueil après une connexion réussie
    } catch (err) {
      setError("Impossible de vous connecter. Veuillez vérifier vos informations d'identification.");
    } finally {
      setLoading(false);
    }
  };

  const rightSection = (
    <Tooltip
      label="Nous stockons vos données en toute sécurité"
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
    >
      <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
        <Center>
          <IconInfoCircle style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

  return (
    <section className="connection-section">
      <div className="card">
        <h1 className="connection-title">Connexion</h1>
        <p className="connection-description">Connectez-vous pour accéder à votre espace personnel.</p>
        <form className="connection-form" onSubmit={onLogin}>
          <TextInput
            label="Email"
            placeholder="exemple@domaine.com"
            value={emailValue}
            onChange={emailChange}
            rightSection={rightSection}
            required
            className="connection-input"
          />

          <PasswordInput
            label="Mot de passe"
            required
            placeholder="Mot de passe"
            value={passwordValue}
            onChange={passwordChange}
            className="connection-input"
            mt="md"
          />

          <Checkbox label="Rester connecté" checked={stayConnected} onChange={stayConnectedChange} mt="md" />
          {error && <p className="error-message">{error}</p>}
          {responseMessage && <p className="response-message">{responseMessage}</p>}
          <div className="button-container">
            <Button type="submit" color="bg" autoContrast loading={loading} mt="md">
              Se connecter
            </Button>
          </div>
        </form>
        <Group mt="md">
          <div className="link-container">
          <Anchor component={Link} to="/réinitialisation-email" pt={2} fw={500} fz="sm" className="link-reinitiate" style={{ color: 'blue', marginRight: '1rem', marginLeft: '1rem' }}>              Mot de passe oublié?
            </Anchor>
            <Anchor component={Link} to="/inscription" pt={2} fw={500} fz="sm" className="link-signUp" style={{ color: 'blue', marginLeft: '1rem', marginRight: '1rem' }}>
              Créer un compte
            </Anchor>
          </div>
        </Group>
      </div>
    </section>
  );
}

export default ConnectionPage;
