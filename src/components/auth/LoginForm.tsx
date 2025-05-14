export const LoginForm = ({
  handleCredentialsSignIn,
  error,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loading,
}: any) => {
  return (
    <form onSubmit={handleCredentialsSignIn} className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Se connecter avec un email.</h2>
      {error && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{error}</div>
      )}
      <div>
        <label
          htmlFor="loginEmail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="loginEmail"
          name="loginEmail"
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
          required
          className="input"
        />
      </div>
      <div>
        <label
          htmlFor="loginPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="loginPassword"
          name="loginPassword"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
          required
          className="input"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};
