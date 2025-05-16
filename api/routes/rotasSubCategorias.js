import {BD} from '../db.js'

class subCategoria {
        static async novaSubCategoria(req, res){
            const{nome, gasto_fixo, id_categoria}= req.body;
   
            try{
                const sub = await BD.query(`
                    INSERT INTO subcategorias(nome, gasto_fixo, id_categoria)
                    VALUES($1, $2, $3)`,
                [nome, gasto_fixo, id_categoria])
   
                res.status(201).json("SubCategoria Cadastrado com sucesso✔")
            }catch(error){
                console.error('Erro ao criar categoria', error);
                res.status(500).json({message: 'Erro ao criar', error: error.message})
            }
        }

        static async listar(req, res){
            try{
                const sub = await BD.query('SELECT * FROM subcategorias');
                res.status(200).json(sub.rows);
            }catch(error){
                res.status(500).json({message:
                    'Erro ao listar as sub Categorias', error: error.message})
            }
        }

        static async consultarPorId(req, res){
            const {id_subcategoria} = req.params;
            try{
                const subcategoria = await BD.query(
                    'SELECT * FROM subcategorias WHERE id_subcategoria = $1', [id_subcategoria])
                res.status(200).json(subcategoria.rows[0])
            }catch(error){
                res.status(500).json({message:
                    'Erro ao consultar as sub Categorias', error: error.message})
            }
        }
       
        static async atualizar(req, res){
            const {id_subcategoria} = req.params;
            const {nome, gasto_fixo} = req.body;
   
            try{
                 const campos = [];
                 const valores = [];
   
                //verificar quais campos foram fornecidos
                if(nome !== undefined){
                    campos.push(`nome = $${valores.length + 1}`) //
                    valores.push(nome);
                }
                if(gasto_fixo !== undefined){
                    campos.push(`gasto_fixo = $${valores.length + 1}`)
                    valores.push(gasto_fixo);
                }
                if(campos.length === 0){
                    return res.status(400).json({message: 'Nenhum campo fornecido para atualizar'})
                }
   
                //Adicionar o id ao final de valores
                valores.push(id_subcategoria)
   
                //Montamos a query dinamicamente
                const query =
                `UPDATE subcategorias SET ${campos.join(', ')}
                WHERE id_subcategoria = ${id_subcategoria} RETURNING *`

                //Executando nossa query
                const subcategorias = await BD.query(query,valores)
                //Verifica se o categorias foi atualizando
                if(subcategorias.rows.length === 0){
                    return res.status(404).json({message: 'Categorias não encontrado'})
                }
   
                return res.status(200).json(subcategorias.rows[0])
            }catch(error){
                res.status(500).json({message:
                    'Erro ao atualizar as sub categorias', error: error.message})
            }
        }

        static async atualizarTodosCampos(req, res){
            const {id_categoria} = req.params;
            const {nome, tipo_transacao, gasto_fixo} = req.body
            try{
                const subcategoria = await BD.query(
                    `UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3  
                    WHERE id_categoria = $4 RETURNING *`, [nome, tipo_transacao, gasto_fixo, id_categoria])
                res.status(200).json(subcategoria.rows [0])
            }catch(error){
                res.status(500).json({message:
                    'Erro ao atualizar as categorias', error: error.message})
            }
   
        }

        static async atualizarTodosCampos(req, res){
            const {id_subcategoria} = req.params;
            const {nome, gasto_fixo} = req.body
            try{
                const subcategoria = await BD.query(
                    `UPDATE subcategorias SET nome = $1, gasto_fixo = $2  
                    WHERE id_subcategoria = $3 RETURNING *`, [nome, gasto_fixo, id_subcategoria])
                res.status(200).json(subcategoria.rows [0])
            }catch(error){
                res.status(500).json({message:
                    'Erro ao atualizar as sub categorias', error: error.message})
            }
   
        }

        static async desativar(req, res){
            const { id_subcategoria } = req.params;
            try {
              const subcategoria = await db.query(
                'UPDATE subcategorias SET ativo = FALSE WHERE id_subcategoria = $1 RETURNING *',
                [id_subcategoria]);
              res.json({ mensagem: 'SubCategoria desativado com sucesso.', subcategoria: subcategoria.rows[0] });
            } catch (erro) {
              res.status(500).json({ erro: 'Erro ao desativar a categoria.' });
            }
          };
}
export default subCategoria;