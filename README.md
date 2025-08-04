# 🚗 GOTO

> **Aplicativo de Mobilidade Colaborativa**  
> TCC do curso de Análise e Desenvolvimento de Sistemas - SENAI  
> Desenvolvido por: Arthur 👨‍💻  

---

## ✨ Sobre o Projeto

O **GOTO** é um aplicativo de mobilidade urbana no estilo **caronas inteligentes**, que conecta passageiros e motoristas com uma proposta **moderna**, **segura** e **colaborativa**.  

Além de um sistema de rides, o GOTO conta com um **chat em tempo real** para que usuários possam se comunicar antes e durante as viagens, otimizando a organização das caronas.

---

## 🔧 Tecnologias Utilizadas

| Camada        | Tecnologia                          |
|---------------|-------------------------------------|
| Mobile        | [Expo](https://expo.dev), React Native, TypeScript |
| Backend       | Routes via `/app/api/*` com `Server Actions` |
| Banco de Dados| [Neon](https://neon.tech/) PostgreSQL Serverless |
| Autenticação  | [Clerk.dev](https://clerk.dev) com suporte a JWT |
| UI Components | Tailwind CSS via NativeWind         |

---

## 🧠 Funcionalidades

- ✅ Autenticação de usuários com Clerk
- ✅ Sistema de criação e listagem de rides (corridas)
- ✅ Participação em caronas com integração em tempo real
- ✅ Chat por corrida (1:1) com persistência no banco de dados
- ✅ Mensagens ordenadas por horário e com replies
- ✅ Armazenamento seguro e responsivo


## 📡 Rotas API Desenvolvidas

| Método | Rota                                  | Descrição                           |
|--------|---------------------------------------|-------------------------------------|
| GET    | `/api/chats?userId=X`                 | Lista todos os chats de um usuário |
| GET    | `/api/chats/:chatId/messages`         | Retorna mensagens de um chat       |
| POST   | `/api/chats/:chatId/messages`         | Envia mensagem para um chat        |
| POST   | `/api/chat_participants`              | Adiciona um participante a um chat |

---

## 🧪 Como Rodar Localmente

1. Instale as dependências:
   ```bash
   npm install
   
2. Configure o .env:
DATABASE_URL=postgres://...
CLERK_SECRET_KEY=...

3. Rode o app:
 ```bash
  npm start
```


## 🎓 Sobre o Autor
Desenvolvido com 💻, café ☕ e uns bons bugs 🐛 por:

Arthur
Aluno de Análise e Desenvolvimento de Sistemas – SENAI
Apaixonado por código limpo, arquitetura escalável e boas práticas (ainda aprendendo isso).

📌 Observações Técnicas
Estrutura baseada em expo-router + (api)/ para integração nativa com React Server Functions

Padrões rigorosos: SOLID, Object Calisthenics e componentização atômica (pelo menos tentando aplicar)

O projeto não usa abstrações mágicas: cada parte do sistema é rastreável e auditável.
