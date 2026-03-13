# FinControl Mobile

App mobile para o sistema de Controle Financeiro, desenvolvido em React Native com Expo.

## Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento/build
- **React Navigation** - Navegação entre telas
- **Axios** - Requisições HTTP
- **AsyncStorage** - Armazenamento local

## Pré-requisitos

- Node.js >= 18
- [Expo Go](https://expo.dev/go) instalado no celular (Android ou iOS)
- Backend **web_financial_control** rodando na porta 3000

## Instalação

```bash
npm install
```

## Configuração da API

Copie o arquivo de exemplo e ajuste a URL do backend:

```bash
cp .env.example .env
```

Edite `.env` com o IP da máquina na rede local:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
```

Para descobrir seu IP (Windows):

```bash
ipconfig
# Procure: "Adaptador de Rede sem Fio" → IPv4
```

## Execução

```bash
# Iniciar (modo LAN - recomendado para uso com celular)
npm start

# Android
npm run android

# iOS (apenas macOS)
npm run ios
```

Escaneie o QR Code exibido no terminal com o app Expo Go.

## Estrutura do Projeto

```
web_financial_control_mobile/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js       # Configuração das rotas
│   ├── screens/
│   │   ├── LoginScreen.js        # Tela de login
│   │   ├── DashboardScreen.js    # Painel principal
│   │   └── AddExpenseScreen.js   # Cadastro de gastos
│   └── services/
│       ├── api.js                # Configuração do Axios
│       ├── authService.js        # Serviço de autenticação
│       └── expensesService.js    # Serviço de gastos
├── App.js                        # Componente raiz
├── app.json                      # Configuração do Expo
├── babel.config.js
└── package.json
```

## Backend (Web)

O app mobile consome a API do projeto web:
- Repositório: https://github.com/manoel081/web_financial_control

## Licença

MIT
