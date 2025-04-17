import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors';
import rotasUsuarios from './routes/rotasUsuarios.js';

const app = express(); 
testarConexao();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('API Funcionando')
})

//Rotas usuarios
app.post('/usuarios', rotasUsuarios.novoUsuario)
// app.post('/usuarios/login', rotasUsuarios.login)
// app.get('/usuarios', rotasUsuarios.listarUsuarios)
// app.get('/usuarios/:id_usuario, rotasUsuarios.listarUsuariosPorID')
// app.patch('/usuarios/:id_usuario', rotasUsuarios.atualizar)
// app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarTodos)
// app.delete('/usuarios/:id_usuario', rotasUsuarios.deletar)

// //rotas categorias 
// app.post('/categorias', rotasCategorias.nova)
// app.get('/categorias', rotasCategorias.listar)


const porta = 3000
app.listen(porta, () =>{
    console.log(`Api rodando na porta http://localhost:${porta}`);
})



