export const RegisterForm = ({
  handleCredentialsRegister,
  error,
  registerFirstName,
  setRegisterFirstName,
  registerLastName,
  setRegisterLastName,
  registerUsername,
  setRegisterUsername,
  registerEmail,
  setRegisterEmail,
  registerPassword,
  setRegisterPassword,
  registerConfirmPassword,
  setRegisterConfirmPassword,
  loading,
}: any) => {
  return (
    <form onSubmit={handleCredentialsRegister} className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">S'inscrire avec un email</h2>
      {error && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{error}</div>
      )}
      <div>
        <label
          htmlFor="registerFirstName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Prénom
        </label>
        <input
          type="text"
          id="registerFirstName"
          value={registerFirstName}
          onChange={e => setRegisterFirstName(e.target.value)}
          required
          className="input"
        />
      </div>
      <div>
        <label
          htmlFor="registerLastName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nom
        </label>
        <input
          type="text"
          id="registerLastName"
          value={registerLastName}
          onChange={e => setRegisterLastName(e.target.value)}
          required
          className="input"
        />
      </div>
      <div>
        <label
          htmlFor="registerUsername"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nom d'utilisateur
        </label>
        <input
          type="text"
          id="registerUsername"
          value={registerUsername}
          onChange={e => setRegisterUsername(e.target.value)}
          required
          className="input"
        />
      </div>
      <div>
        <label
          htmlFor="registerEmail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="registerEmail"
          value={registerEmail}
          onChange={e => setRegisterEmail(e.target.value)}
          required
          className="input"
        />
      </div>
      <div>
        <label
          htmlFor="registerPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="registerPassword"
          value={registerPassword}
          onChange={e => setRegisterPassword(e.target.value)}
          required
          className="input"
        />
      </div>
      <div>
        <label
          htmlFor="registerConfirmPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          id="registerConfirmPassword"
          value={registerConfirmPassword}
          onChange={e => setRegisterConfirmPassword(e.target.value)}
          required
          className="input"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {loading ? 'Création du compte...' : 'Créer un compte'}
      </button>
    </form>
  );
};
