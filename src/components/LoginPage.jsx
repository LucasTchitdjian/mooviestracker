import './LoginPage.css';

export function LoginPage() {
  return (
    <div className="login">
      <h1>Connectez-vous</h1>
      <div className="form">
        <form>
          <div className="input">
            <input type="email" id="email" placeholder='EMAIL' />
          </div>
          <div className="input">
            <input type="password" id="password" placeholder='MOT DE PASSE' />
          </div>
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  )
}