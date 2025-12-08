export const HTTP_STATUS = {
  // Sucesso
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Redirecionamento
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // Erro do cliente
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Erro do servidor
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

export const ERROR_MESSAGES = {
  // Autenticação
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  UNAUTHORIZED: 'Não autenticado',
  FORBIDDEN: 'Permissão negada',
  INVALID_TOKEN: 'Token inválido ou expirado',
  TOKEN_REQUIRED: 'Token de autenticação não fornecido',

  // Validação
  VALIDATION_ERROR: 'Erro de validação',
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha inválida',

  // Recursos
  NOT_FOUND: 'Recurso não encontrado',
  ALREADY_EXISTS: 'Recurso já existe',
  CONFLICT: 'Conflito de dados',

  // Sistema
  INTERNAL_ERROR: 'Erro interno do servidor',
  DATABASE_ERROR: 'Erro no banco de dados',
  NETWORK_ERROR: 'Erro de conexão'
} as const;