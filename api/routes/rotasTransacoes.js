import { BD } from "../db.js";

class rotasTransacoes {
    // nova categoria
    static async novaTransacao(req, res) {
        const { valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body
        try {
            const transacao = await BD.query(`
                INSERT INTO transacoes(valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                `, [valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual])

            // outro jeito:
            // const query = `INSERT INTO categorias(valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual) VALUES($1, $2, $3, $4)`
            // const valores = [valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual]
            // const resposta = await BD.query(query, valores)

            res.status(201).json("transação cadastrada com sucesso")
           
        } catch (error) {
            console.error("Erro ao criar transação", error)
            res.status(500).json({
                message: "Erro ao criar transação",
                error: error.message
            })
        }
    }

    // rota de leitura
    static async listarTodas(req, res) {
        try {
            const transacao = await BD.query(`
                SELECT
                        trans.id_transacao,
                        usr.nome,
                        trans.valor,
                        trans.tipo_transacao,
                        contas.saldo,
                        trans.descricao,
                        trans.num_parcelas,
                        trans.parcela_atual,
                        cat.nome AS categoria,
                        subcat.nome AS subcategoria,
                        trans.data_transacao,
                        trans.data_vencimento,
                        trans.data_pagamento,
                        contas.nome AS conta
   
                FROM transacoes AS trans

                INNER JOIN contas ON trans.id_conta = contas.id_conta
                INNER JOIN categorias AS cat ON trans.id_categoria = cat.id_categoria
                INNER JOIN usuarios as usr ON trans.id_usuario = usr.id_usuario
                LEFT JOIN subcategorias AS subcat ON trans.id_subcategoria = subcat.id_subcategoria

                WHERE usr.ativo = true

                `)
            return res.status(200).json(transacao.rows)

        } catch (error) {
            res.status(500).json({message:
                "Erro ao listar transacao — ", error: error.message
            })            
        }
    }

        // rota de atualizaçao INDIVIDUAL
    // funçao para atualizar os valores individualmente caso necessario
    static async atualizarTrans(req, res) {
        const { id_transacao } = req.params
        const { valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body

        try {
            // inicializa arrays para armazenar os campos (ex: nome, email) e valores (ex: $1, $2, ... $n) a serem atualizados
            const campos = []
            const valores = []

            // verificar quais campos foram fornecidos
            if (valor !== undefined) {
                campos.push(`valor = $${valores.length + 1}`)
                valores.push(valor)
            }
           
            if (descricao !== undefined) {
                campos.push(`descricao = $${valores.length + 1}`)
                valores.push(descricao)
            }

            if (data_vencimento !== undefined) {
                campos.push(`data_vencimento = $${valores.length + 1}`)
                valores.push(data_vencimento)
            }
           
            if (data_pagamento !== undefined) {
                campos.push(`data_pagamento = $${valores.length + 1}`)
                valores.push(data_pagamento)
            }
           
            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao)
            }
           
            if (id_categoria !== undefined) {
                campos.push(`id_categoria = $${valores.length + 1}`)
                valores.push(id_categoria)
            }
           
            if (id_subcategoria !== undefined) {
            campos.push(`id_subcategoria = $${valores.length + 1}`)
            valores.push(id_subcategoria)
            }

            if (id_usuario !== undefined) {
            campos.push(`id_usuario = $${valores.length + 1}`)
            valores.push(id_usuario)
            }

            if (num_parcelas !== undefined) {
            campos.push(`num_parcelas = $${valores.length + 1}`)
            valores.push(num_parcelas)
            }

            if (parcela_atual !== undefined) {
            campos.push(`parcela_atual = $${valores.length + 1}`)
            valores.push(parcela_atual)
            }

            if(campos.length === 0) {
                return res.status(400).json({message: "Nenhum campo adicionado para atualização"})
            }

            // adicionar o id ao final do array valores
            valores.push(id_transacao)

            // montamos a query dinamicamente
            const query = `UPDATE transacoes
                            SET ${campos.join(", ")}
                            WHERE id_transacao = $${valores.length}
                            RETURNING *`

            // executando nossa query
            const transacao = await BD.query(query, valores)

            // verifica se o transacao foi atualizado
            if(transacao.rows.length === 0) {
                return res.status(404).json({message: "transação não encontrado"})
            }

            // se tudo der certo
            return res.status(200).json(transacao.rows[0])
           

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }


    // rota de inativaçao
    static async desativarTrans(req, res) {
        const { id } = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE transacoes
                SET ativo = FALSE
                WHERE id_transacao = $1
            `, [id])
   
            return res.status(200).json({message: "transacao desativada"})
           
        } catch (error) {
            console.error("Erro ao desativar transacao: ", error)
            return res.status(500).json({message: "Erro ao desativar transacao", error: error.message})            
        }
    }

    // consulta por id
    static async consultaPorId(req, res) {
        const { id } = req.params
        try {
            const transacao = await BD.query("SELECT * FROM transacoes WHERE id_transacao = $1", [id])
            return res.status(200).json(transacao.rows)
        } catch (error) {
            res.status(500).json({message: "Erro ao consultar transação", error: error.message})
        }
    }

      // rota de inativaçao
    static async desativarSubCateg(req, res) {
        const {id_sub} = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE subcategorias
                SET ativo = FALSE
                WHERE id_subcategoria = $1
            `, [id_sub])
   
            return res.status(200).json({message: "Subegoria desativada"})
           
        } catch (error) {
            console.error("Erro ao desativar subegoria: ", error)
            return res.status(500).json({message: "Erro ao desativar subcategoria", error: error.message})            
        }
    }


// Criar uma rota que permite filtrar transacoes por data de vencimento ou data de pagamento dentro de um intervalo especifico
    static async filtarporData(req, res) {
        const { data_inicio, data_fim, tipo_data } = req.query

        let colunaData;
        if(tipo_data == 'vencimento'){
            colunaData = 'data_vencimento'
        }
        else if(tipo_data == 'pagamento'){
            colunaData = 'data_pagamento'
        }
        else{
            return res.status(400).json({
                message: "Tipo_data inválido, use vencimento ou pagamento"
            })
        }
        try{
            const query = `
                   SELECT t.*, u.nome AS nome_usuario, ct.nome
                   FROM transacoes AS t
                   LEFT JOIN usuarios AS u ON t.id_usuario = u.id_usuario
                   JOIN contas ct ON t.id_conta = ct.id_conta
                   WHERE ${colunaData} BETWEEN $1 AND $2
                   ORDER BY ${colunaData} ASC 
            `

            const transacoes = await BD.query(query, [data_inicio, data_fim])

            res.status(200).json(transacoes.rows);
        }catch(error){
            console.error("Erro ao filtrar transação: ", error)
            return res.status(500).json({message: "Erro ao filtrar transação", error: error.message});
        }
    }

    //somando transacoes entrada ou saida

    static async somarTransacoes(req, res){
        const { tipo, id_usuario } = req.query;
        try{
            const tipoTransacao = tipo.toUpperCase();

            const query = `
                     SELECT SUM(valor) AS total
                     FROM transacoes 
                     WHERE tipo_transacao = $1 AND id_usuario = $2 
            `
         const resultado = await BD.query(query, [tipoTransacao, id_usuario])

         let total = resultado.rows[0].total
         if(total === null)
         {
            total = 0 
         }
         res.status(200).json({total:parseFloat(total)});
        }catch(error){
            console.error("Erro ao filtrar transação: ", error)
            return res.status(500).json({message: "Erro ao filtrar transação", error: error.message});
        }
    }

    static async transacoesVencidas(req, res){
        const { id_usuario } = req.params;

        try{
            const query = `
                     SELECT t.valor, t.data_transacao, t.data_vencimento, t.data_pagamento
                     u.nome AS nome_usuario,
                     c.nome AS nome_conta,
                     ct.nome AS nome_categoria,
                     sct.nome AS nome_subcategoria
                     FROM transacoes AS t 
                     LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
                     LEFT JOIN contas c ON t.id_conta = c.id_conta
                     LEFT JOIN categorias ct ON t.id_categoria = ct.id_categoria
                     LEFT JOIN subcategorias sct ON t.id_subcategoria = sct.id_subcategoria
                     WHERE t.data_vencimento < CURRENT_DATE --filtra transacoes vencidas
                     AND t.id_usuario = $1
                     ORDER BY t.data_vencimento ASC
            `
            const resultado = await BD.query(query, [id_usuario])

            const formatarDataBr = (data) =>{
                if(!data) return null;
                return new Date(data).toLocaleDatesString('pt-BR')//Converter a data do padrao BR
            }

            const dadosFormatados = resultado.rows.map(t =>({
                ...t, //copia todas as propriedades originais da resultado para a t
                data_transacao: formatarDataBr(t.data_transacao),
                data_vencimento: formatarDataBr(t.data_vencimento),
                data_pagamento: formatarDataBr(t.data_pagamento),
            }))
            res.status(200).json(dadosFormatados)
        }catch(error){
            console.error("Erro ao filtrar transações vencidas: ", error)
            return res.status(500).json({message: "Erro ao filtrar transações vencidas", error: error.message});
        }
    }

}

export default rotasTransacoes