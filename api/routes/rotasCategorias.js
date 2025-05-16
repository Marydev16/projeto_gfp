import {BD} from "../db.js"

//Rota de nova categoria
class rotasCategorias {
static async novaCategoria(req,res) {
    const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body;
    //Validando dados

    try {            
        const categoria = await BD.query(`
            INSERT INTO categorias (nome, tipo_transacao, gasto_fixo, id_usuario)
            VALUES ($1, $2, $3, $4) RETURNING *`
            [nome, tipo_transacao, gasto_fixo, id_usuario]
        );
        return res.status(201).json("Categoria Cadastrada");
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        res.status(500).json({
            message:"Erro ao criar categoria", error: error.message });
       }
    }

    // filtrar por tipo de categoria 
    static async filtrarCategoria(req, res){
        const { tipo_transacao } = req.query;

        try{
            const query = `
                SELECT * FROM categorias
                WHERE tipo_transacao = $1 AND ativo = true
                ORDER BY id_categoria DESC
            `
            const valores = [tipo_transacao]

            const resposta = await BD.query(query, valores)

            return res.status(200).json(resposta.rows)
        }catch(error){
            console.error('Erro ao filtrar categoria', error);
            res.status(500).json({message: "Erro ao filtrar categoria", error: error.message})
        }
    }

}
export default rotasCategorias

//Rot de listar categorias 
//Rota de atualizar categorias 
//Rota de desativar categorias