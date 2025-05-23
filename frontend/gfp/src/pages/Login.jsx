import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [lembrar, setlembrar] = useState(false);

  useEffect(() => {
    const buscarUsuarioLogado = async () => {
      const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
      if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado)
        if (usuario.lembrar == true) {
          navigate('/principal')
        }
      }
    }
    buscarUsuarioLogado()
  }, [])


  return (
    <div style={Estilos.logincontainer}>
      <h1>Tela de Login</h1>
      <div className="form-floating mb-3">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" />
        <label for="floatingInput">Email</label>
      </div>
  
      
      <div className="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" />
        <label for="floatingPassword">Senha</label>
        <button onClick={() => navigate("/principal")}>Entrar</button>
      </div>

        <div className={styles.between}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" style={{ marginRight: '5px' }} checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} />
            <label>Lembrar-me</label>
          <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>
          </div>
        </div>
      </div>
  )
}


const Estilos = {
  body: {
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },

  logincontainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    width: '300px',
  }

}