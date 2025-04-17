import { BD } from "../db.js";
import bcrypt from "bcrypt"

class rotasUsuarios{
    static async novoUsuario(req, res){
        const { nome, email, senha , tipo_acesso } = req.body;
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
        try{
            const sql = `INSERT INTO usuarios(nome, email, senha, tipo_acesso)
                         VALUES($1, $2, $3, $4)`
            const valores = [nome, email, senhaCriptografada, tipo_acesso]    
            const usuario = await BD.query(sql, valores)
            res.status(201).json('Usuario cadastrado')
        }
        catch(error){
            console.error('Erro ao criar o usuario', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
        }
    }

static async login(req, res){
        const { email, senha } = req.body;
        try{
            const resultado = await BD.query(
                `SELECT id, nome, email, senha
                 FROM usuarios
                 WHERE email = $1`,
                 [email]
            );
            if(resultado.rows.length === 0){
                return res.status(401).json({message: 'Email ou senha inválidos'})
            }
            const usuario = resultado.rows[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha)

            if(!senhaValida){
                return res.status(401).json('Email ou senha inválidos')
            }
            const token = jwt.sign(
                {id: usuario.id, nome: usuario.nome, email: usuario.email},
                SECRET_KEY,
                {expiresIn: '1h'}
            )
            return res.status(200).json({message: 'Login realizado com sucesso', token});
            //return res.status(200).json({message: 'Login realizado com sucesso'});
        }
        catch(error){
            console.error('Erro ao realizar login:', error)
            return res.status(500).json({message: 'Erro ao realizar login', erro: error.message})
        }

    }
    static async listarTodos(req, res) {
        try {
            const resultado = await BD.query(`SELECT id, nome, email FROM livro_usuarios`);
            res.json({ usuarios: resultado.rows });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: error.message });
        }
    }

}

export default rotasUsuarios