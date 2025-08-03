export function translateClerkError(err: any): string {
    // Verificação robusta para garantir que o objeto de erro é do Clerk.
    if (err && Array.isArray(err.errors) && err.errors.length > 0) {
        const clerkError = err.errors[0];
        const code = clerkError.code;
        const longMessage = clerkError.longMessage;

        switch (code) {
            // Erros de sessão
            case 'session_not_found':
                return 'Sua sessão expirou. Por favor, faça login novamente.';
            case 'session_not_active':
                return 'Sua sessão não está ativa. Por favor, faça login novamente.';
            case 'not_authenticated':
                return 'Você não está autenticado. Por favor, faça login para continuar.';

            // Erros de formulário e validação
            case 'form_param_nil':
                return 'Há algum campo obrigatório vazio. Por favor, preencha todos os campos.';
            case 'form_identifier_exists':
                // Nova tradução para o erro de e-mail já em uso.
                return 'Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.';
            case 'form_identifier_not_found':
                return 'Não foi possível encontrar uma conta com este e-mail.';
            case 'form_param_format_invalid':
                return 'Um dos campos está com formato inválido. Verifique o e-mail ou a senha.';

            // Erros de senha
            case 'form_password_incorrect':
                return 'A senha fornecida está incorreta.';
            case 'form_password_too_short':
                return 'A senha deve ter no mínimo 8 caracteres.';
            case 'form_password_pwned':
                return 'A senha que você escolheu foi encontrada em um vazamento de dados online. Por favor, escolha uma senha mais segura.';
            case 'form_password_and_confirm_password_mismatch':
                return 'A nova senha e a confirmação de senha não coincidem.';
            
            // Erros de verificação (códigos e e-mails)
            case 'form_code_invalid':
            case 'verification_code_invalid':
                return 'O código de verificação é inválido ou expirou. Por favor, verifique e tente novamente.';
            case 'user_not_found':
                return 'Usuário não encontrado. Por favor, verifique se o e-mail está correto.';

            // Erro genérico
            default:
                return longMessage || 'Ocorreu um erro desconhecido.';
        }
    }

    return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}