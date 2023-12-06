function Login() {
  return (
    <div>
      <div>
        <h4>Se connecter</h4>
        <form>
          <label>Email:</label>
          <input type="text" name="name" />
          <label>Mot de passe:</label>
          <input type="text" name="name" />
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div>
        <h4>S'inscrire</h4>
        <form>
          <label>Email:</label>
          <input type="text" name="name" />
          <label>Mot de passe:</label>
          <input type="text" name="name" />
          <label>Confirmer mot de passe:</label>
          <input type="text" name="name" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default Login;
