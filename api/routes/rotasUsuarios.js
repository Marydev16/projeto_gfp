import { BD } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = "chave-secreta";

class RotasUsuarios {
    static async novoUsuario(req, res) {
        const { nome, email, senha, tipo_acesso } = req.body;
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
       
        try {
            const usuario = await BD.query(`INSERT INTO usuarios (nome, email, senha, tipo_acesso)
                VALUES ($1, $2, $3, $4) RETURNING *`, [nome, email, senhaCriptografada, tipo_acesso]);

            res.status(201).json('Usuario criado com sucesso!');
        } catch (error) {
            console.error("Erro ao criar o usuário:", error);
            res.status(500).json({ error: "Erro ao criar o usuário" });
        }
    }

    static async listarUsuarios(req, res) {
        try {
            const usuarios = await BD.query(`SELECT * FROM usuarios where ativo = true`);
            res.status(200).json(usuarios.rows);
        } catch (error) {
            console.error("Erro ao listar os usuários:", error);
            res.status(500).json({ error: "Erro ao listar os usuários" });
        }
    }

    static async listarUsuariosPorId(req,res){
        const { id_usuario } = req.params;
        try {
            const usuario = await BD.query(`SELECT * FROM usuarios WHERE id_usuario = $1`, [id_usuario]);
            if (usuario.rows.length === 0) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            res.status(200).json(usuario.rows[0]);
        } catch (error) {
            console.error("Erro ao listar o usuário:", error);
            res.status(500).json({ error: "Erro ao listar o usuário" });
        }
    }

    static async login(req,res){
        const { email, senha } = req.body;
        try {
            const usuario = await BD.query(`SELECT * FROM usuarios WHERE email = $1 and ativo = true`, [email]);
            if (usuario.rows.length === 0) {
                return res.status(401).json({ error: "Usuário não encontrado" });
            }
            const usuarioEncontrado = usuario.rows[0];
            const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ error: "Senha incorreta" });
            }

            //gerar um token JWT para o usuário
            const token = jwt.sign(
                //payload
                {id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email},
                //signature
                secretKey,
            // {expiresIn: '1h'}
            )

            return res.status(200).json({token,
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                tipo_acesso: usuario.tipo_acesso});
            // return res.status(200).json({ message: "Login bem-sucedido" })

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            res.status(500).json({ error: "Erro ao fazer login" });
        }
    }
    static async atualizarTodos(req,res) {
        const { id_usuario } = req.params;
        const { nome, email, senha, tipo_acesso } = req.body;
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        try {
            const usuario = await BD.query(`UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_acesso = $4 WHERE id_usuario = $5 RETURNING *`, [nome, email, senhaCriptografada, tipo_acesso, id_usuario]);
            res.status(200).json(usuario.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
            res.status(500).json({ error: "Erro ao atualizar o usuário" });
        }
    }

    //Rota de atualização(Atualizar campo que for passado)
    static async atualizar (req,res) {
        const { id_usuario } = req.params;
        const { nome, email, senha, tipo_acesso } = req.body;

        try {
            const campos = [];
            const valores = [];

            if(nome != undefined){
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }

            if(email != undefined){
                campos.push(`email = $${valores.length + 1}`);
                valores.push(email);
            }

            if(senha != undefined){
                const saltRounds = 10;
                const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
                campos.push(`senha = $${valores.length + 1}`);
                valores.push(senhaCriptografada);
            }

            if(tipo_acesso != undefined){
                campos.push(`tipo_acesso = $${valores.length + 1}`);
                valores.push(tipo_acesso);
            }

            if(campos.length === 0){
                return res.status(400).json({
                    message: "Nenhum campo fornecido."
                });
            }

            const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ${id_usuario} RETURNING *`
            
            const resultado = await BD.query(query, valores);

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    message: "Usuário não encontrado."
                });
            }
            return res.status(200).json(resultado.rows[0]);
        }
        catch (error) {
            console.error("Erro ao Atualizar o usuário:", error);
            res.status(500).json({
                message:"Erro ao Atualizar o usuário", error: error.message
            })
        }
    }

    //Rota de exclusão (Realizar desativação)
    static async deletar(req,res) {
        const {id_usuario} = req.params;
        try {            
            const resultado = await BD.query(`UPDATE usuarios SET ativo = false WHERE id_usuario = $1 returning *`, [id_usuario]);
            
            if (resultado.rows.length == 0) {
                return res.status(404).json({
                    message: "Usuário não encontrado."
                });
            }
            return res.status(200).json(resultado.rows[0]);
   
        } catch (error) {
            console.error("Erro ao excluir o usuário:", error);
            res.status(500).json({
                message:"Erro ao excluir o usuário", error: error.message
            })
        }
    }

}

//middleware (função) para proteger rotas privadas
export function autenticarToken(req, res, next){
    //extrair o token do cabeçalho da requisição
    const token = req.headers['authorization'] //bearer<token>

    //verificar se o token foi fornecido na requisição
    if (!token) return res.status(403).json({message: 'Token não fornecido'})

    //verificar se o token é válido
    jwt.verify(token.split(' ')[1], secretKey, (err, usuario ) => {
        if(err) return res.status(403).json({mensagem: 'Token inválido'})

        //se o token é válido, adiciona os dados do usuario (decoficados no token)
        //tornando essas informações disponíveis nas rotas que precisam da autenticação
        req.usuario = usuario;
        next(); //continua para a próxima rota
    })
}

export default RotasUsuarios;