import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors'
import rotasUsuarios, {autenticarToken} from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasContas from './routes/rotasContas.js';
import rotasTransacoes from './routes/rotasTransacoes.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express()
testarConexao();

app.use(cors());
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/',(req, res) =>{
    res.redirect('/api-docs')
})

//Rotas usuarios
app.post('/usuarios', rotasUsuarios.novoUsuario)
app.post('/usuarios/login', rotasUsuarios.login)
//app.get('/usuarios',autenticarToken, rotasUsuarios.listarTodos)
//app.get('/usuarios/:id_usuario', rotasUsuarios.listarUsuariosPorID)
app.patch('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizar)
// app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarTodos)
app.delete('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.deletar)

// //rotas categorias
app.post('/categorias', autenticarToken, rotasCategorias.novaCategoria)
app.get('/categoria/filtrarCategoria', rotasCategorias.filtrarCategoria)
// app.get('/categorias', rotasCategorias.listar)
// app.get('/categorias/:id_categoria', rotasCategorigas.listarPorID)
// app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)
// app.put('/categorias/:id_categoria', rotasCategorias.atualizarTodos)
// app.delete('/categorias/:id_categoria', rotasCategorias.deletar)

// //Rotas sub-categorias
// app.post('/subCategorias', rotasSubCategorias.nova)
// app.get('/subCategorias', rotasSubCategorias.listar)
// app.get('/subCategorias/:id_subCategoria', rotasSubCategorias.listarPorID)
// app.patch('/subCategorias/:id_subCategoria', rotasSubCategorias.atualizar)
// app.put('/subCategorias/:id_subCategoria', rotasSubCategorias.atualizarTodos)
// app.delete('/subCategorias/:id_subCategoria', rotasSubCategorias.deletar)

//Rotas Contas
app.get('/contas/filtrarContas', rotasContas.filtrarConta)
app.post('/contas', rotasContas.nova)
app.get('/contas', rotasContas.listar)
app.get('/contas/:id_Conta', rotasContas.consultarPorId)
app.patch('/contas/:id_Conta', rotasContas.atualizar)
app.put('/contas/:id_Conta', rotasContas.atualizar)
// app.delete('/contas/:id_Conta', rotasContas.deletar)

// //Rotas Transacoes
app.post('/transacao', rotasTransacoes.novaTransacao)
app.get('/transacao/somarTransacoes', rotasTransacoes.somarTransacoes)
app.get('/transacao/filtroData', rotasTransacoes.filtarporData)
app.get('/transacao/transacoesVencidas/:id_usuario', rotasTransacoes.transacoesVencidas)
// app.get('/transacao', rotasTransacoes.listar)
// app.get('/transacao/:id_transacao', rotasTransacoes.listarPorID)
// app.patch('/transacao/:id_transacao', rotasTransacoes.atualizar)
// app.put('/transacao/:id_transacao', rotasTransacoes.atualizarTodos)
// app.delete('/transacao/:id_transacao', rotasTransacoes.deletar)


const porta = 3000;
app.listen(porta, () =>{
    console.log(`Api http://localhost:${porta}`)
})


