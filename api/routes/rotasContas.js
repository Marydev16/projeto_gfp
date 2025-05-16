import { BD } from "../db.js";

class rotasContas{
    static async nova(req, res){
        const{nome, tipo_conta, saldo, ativo, conta_padrao}= req.body;

        try{
            const local = await BD.query(`
                INSERT INTO contas (nome, tipo_conta, saldo, ativo, conta_padrao )
                VALUES($1, $2, $3, $4, $5)`,
            [nome, tipo_conta, saldo, ativo, conta_padrao])

            res.status(201).json("Conta Cadastrada com sucesso✔")
        }catch(error){
            console.error('Erro ao criar conta', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
        }
    }

    static async listar(req, res){
        try{
            const local = await BD.query('SELECT * FROM contas');
            res.status(200).json(local.rows);
        }catch(error){
            res.status(500).json({message:
                'Erro ao listar as conta', error: error.message})
        }
    }

    static async consultarPorId(req, res){
        const {id_conta} = req.params;
        try{
            const conta = await BD.query(
                'SELECT * FROM conta WHERE id_conta = $1', [id_conta])
            res.status(200).json(conta.rows[0])
        }catch(error){
            res.status(500).json({message:
                'Erro ao consultar as conta', error: error.message})
        }
    }

    static async atualizar(req, res){
        const {id_conta} = req.params;
        const {nome, tipo_local, saldo} = req.body;

        try{
             const campos = [];
             const valores = [];

            //verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) //
                valores.push(nome);
            }
            if(tipo_local !== undefined){
                campos.push(`tipo_local = $${valores.length + 1}`)
                valores.push(tipo_local);
            }
            if(saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo);
            }
            if(campos.length === 0){
                return res.status(400).json({message: 'Nenhum campo fornecido para atualizar'})
            }

            //Adicionar o id ao final de valores
            valores.push(id_conta)

            //Montamos a query dinamicamente
            const query =
            `UPDATE conta SET ${campos.join(', ')}
            WHERE id_conta = ${id_conta} RETURNING *`

            //Executando nossa query
            const conta = await BD.query(query,valores)
            //Verifica se foi atualizando
            if(conta.rows.length === 0){
                return res.status(404).json({message: 'conta não encontrada'})
            }

            return res.status(200).json(conta.rows[0])
        }catch(error){
            res.status(500).json({message:
                'Erro ao atualizar as sub conta', error: error.message})
        }
    }

     // filtrar por tipo de categoria 
    static async filtrarConta(req, res){
        const { nome } = req.query;

        try{
            const query = `
                SELECT * FROM contas
                WHERE nome = $1 AND ativo = true
                ORDER BY id_Conta DESC
            `
            const valores = [nome]

            const resposta = await BD.query(query, valores)

            return res.status(200).json(resposta.rows)
        }catch(error){
            console.error('Erro ao filtrar conta', error);
            res.status(500).json({message: "Erro ao filtrar conta", error: error.message})
        }
    }

}

export default rotasContas