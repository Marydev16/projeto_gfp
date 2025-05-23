import { response } from "express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.4',
    info: {
        title: 'API do Gestor Financeiro Pessoal',
        version: '1.0.0',
        description: `API para gerenciamento financeiro pessoal desenvolvida no curso Técnico de Desenvolvimento de Sistemas do SENAI`
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Servidor Local'
        },
        {
            url: 'http://192.168.0.237:3000',
            description: 'Servidor de API do Douglas'
        }
    ],
    tags: [
        {
            name: 'Usuarios',
            description: 'Rotas para cadastro, login, atualização e desativação de usuários'
        },
        {
            name: 'Categorias',
            description: 'Rotas para cadastro, leitura, atualização e desativação de categorias'
        },
        {
            name: 'Subcategorias',
            description: 'Rotas para cadastro, leitura, atualização e desativação de subcategorias'
        },
        {
            name: 'Transacoes',
            description: 'Rotas para cadastro, leitura, atualização e desativação de Transacoes'
        },
        {
            name: 'Contas',
            description: 'Rotas para cadastro, leitura, atualização e desativação de Contas'
        }


    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    //------------------------------------------------------USUARIOS----------------------------------------------------------------
    paths: {
        '/usuarios': {
            post: {
                tags: ['Usuarios'],
                summary: 'Cadastrar novo usuário',
                description: 'Método utilizado para cadastrar novos usuários',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário cadastrado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Usuarios'],
                summary: 'Listar todos os usuários',
                description: 'Método utilizado para listar todos os usuários cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de usuários',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            delete: {
                tags: ['Usuarios'],
                summary: 'Desativar usuario',
                description: 'Rota para desativar usuario',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        'name': 'id_usuario',
                        'in': 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': { description: 'Usuario desativado com sucesso!' },
                    '500': { description: 'Erro ao desativar usuario' }
                }
            }
        },
        '/usuarios/login': {
            post: {
                tags: ['Usuarios'],
                summary: 'Login do usuário',
                description: 'Método utilizado para efetuar o login do usuário e gerar o token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'senha'],
                                properties: {
                                    email: { type: 'string', example: 'sesia@sesi.br' },
                                    senha: { type: 'string', example: '123' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuario encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            token: { type: 'string', example: 'jkdnaskjdbaskjndlaksnmmlmcaj21lekn1lkn213n12jb3kj 21' },
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Erro ao encontrar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },

        },
        //-------------------------------------------------CATEGORIAS----------------------------------------------------------------
        '/categorias': {
            post: {
                tags: ['Categorias'],
                summary: 'Nova Categoria',
                description: 'Rota para cadastrar nova categoria',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario'],
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 1 },
                                    cor: { type: 'string', example: 'save' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Categoria cadastrada'
                    },
                    '400': {
                        description: "Erro ao cadastrar categoria"
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Categorias'],
                summary: 'Listar todas as categorias',
                description: 'Método utilizado para listar todas as categorias cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de Categorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            delete: {
                tags: ['Categorias'],
                summary: 'Desativar Categorias',
                description: 'Rota para desativar Categorias',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        'name': 'id_usuario',
                        'in': 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': { description: 'Categorias desativado com sucesso!' },
                    '500': { description: 'Erro ao desativar Categorias' }
                }
            }
        },
        //-----------------------------------------------SUBCATEGORIAS----------------------------------------------------------------
        '/Subcategorias': {
            post: {
                tags: ['Subcategorias'],
                summary: 'Nova Subcategorias',
                description: 'Rota para cadastrar nova Subcategorias',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario'],
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 1 },
                                    cor: { type: 'string', example: 'save' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Subcategorias cadastrada'
                    },
                    '400': {
                        description: "Erro ao cadastrar Subcategorias"
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Subcategorias'],
                summary: 'Listar todas as Subcategorias',
                description: 'Método utilizado para listar todas as Subcategorias cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de Subcategorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            delete: {
                tags: ['Subcategorias'],
                summary: 'Desativar Subcategorias',
                description: 'Rota para desativar Subcategorias',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        'name': 'id_usuario',
                        'in': 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': { description: 'Subcategorias desativado com sucesso!' },
                    '500': { description: 'Erro ao desativar Subcategorias' }
                }
            }
        },
        //------------------------------------------------TRANSACOES----------------------------------------------------------------
        '/Transacoes': {
            post: {
                tags: ['Transacoes'],
                summary: 'Nova Transacao',
                description: 'Rota para cadastrar nova Transacao',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario'],
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 1 },
                                    cor: { type: 'string', example: 'save' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Transacoes cadastrada'
                    },
                    '400': {
                        description: "Erro ao cadastrar Transacoes"
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Transacoes'],
                summary: 'Listar todas as Transacoes',
                description: 'Método utilizado para listar todas as Transacoes cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de Transacoes',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            delete: {
                tags: ['Transacoes'],
                summary: 'Desativar Transacoes',
                description: 'Rota para desativar Transacoes',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        'name': 'id_usuario',
                        'in': 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': { description: 'Transacoes desativado com sucesso!' },
                    '500': { description: 'Erro ao desativar Transacoes' }
                }
            }
        },
        //-------------------------------------------------CONTAS----------------------------------------------------------------
        '/Contas': {
            post: {
            tags: ['Contas'],
            summary: 'Nova Conta',
            description: 'Rota para cadastrar nova Conta',
            security: [
                {
                    bearerAuth: [],
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario'],
                            properties: {
                                nome: { type: 'string', example: 'Alimentação' },
                                tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                gasto_fixo: { type: 'boolean', example: true },
                                id_usuario: { type: 'integer', example: 1 },
                                cor: { type: 'string', example: 'save' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Conta cadastrada'
                },
                '400': {
                    description: "Erro ao cadastrar Contas"
                },
                '500': {
                    description: 'Erro interno do servidor'
                }
            }
            },
            get: {
                tags: ['Contas'],
                summary: 'Listar todas as Contas',
                description: 'Método utilizado para listar todas as Contas cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de Contas',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            delete: {
                tags: ['Contas'],
                summary: 'Desativar Contas',
                description: 'Rota para desativar Contas',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        'name': 'id_usuario',
                        'in': 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': { description: 'Contas desativado com sucesso!' },
                    '500': { description: 'Erro ao desativar Contas' }
                }
            }
        },
    }
}


const options = {
    swaggerDefinition,
    apis: [] //
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec

