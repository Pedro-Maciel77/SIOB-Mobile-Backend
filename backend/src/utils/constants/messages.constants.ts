export const MESSAGES = {
  // Sucesso
  SUCCESS: 'Operação realizada com sucesso',
  CREATED: 'Recurso criado com sucesso',
  UPDATED: 'Recurso atualizado com sucesso',
  DELETED: 'Recurso deletado com sucesso',
  LOGGED_IN: 'Login realizado com sucesso',
  LOGGED_OUT: 'Logout realizado com sucesso',
  
  // Erros de autenticação
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  INVALID_TOKEN: 'Token inválido ou expirado',
  TOKEN_REQUIRED: 'Token de autenticação não fornecido',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  
  // Erros de validação
  VALIDATION_ERROR: 'Erro de validação',
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha inválida',
  PASSWORD_MISMATCH: 'Senhas não conferem',
  
  // Erros de recurso
  NOT_FOUND: 'Recurso não encontrado',
  ALREADY_EXISTS: 'Recurso já existe',
  CONFLICT: 'Conflito de dados',
  DUPLICATE_ENTRY: 'Entrada duplicada',
  
  // Erros de arquivo
  FILE_TOO_LARGE: 'Arquivo muito grande',
  INVALID_FILE_TYPE: 'Tipo de arquivo não permitido',
  UPLOAD_ERROR: 'Erro ao fazer upload do arquivo',
  
  // Erros de sistema
  DATABASE_ERROR: 'Erro no banco de dados',
  NETWORK_ERROR: 'Erro de conexão',
  INTERNAL_ERROR: 'Erro interno do servidor',
  SERVICE_UNAVAILABLE: 'Serviço indisponível',
  
  // Mensagens específicas do SIOB
  OCCURRENCE_CREATED: 'Ocorrência registrada com sucesso',
  OCCURRENCE_UPDATED: 'Ocorrência atualizada com sucesso',
  OCCURRENCE_STATUS_CHANGED: 'Status da ocorrência alterado',
  REPORT_CREATED: 'Relatório criado com sucesso',
  VEHICLE_ASSIGNED: 'Viatura atribuída com sucesso',
  USER_REGISTERED: 'Usuário registrado com sucesso',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso'
} as const;