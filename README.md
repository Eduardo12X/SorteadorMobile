# Sorteador de números Mobile

O aplicativo é um sorteador de números que faz o sorteio até intervalos de 1-999999 com e sem repetição, podendo ser salvo ou excluído direto em um conta local. Feito com expo, sqlite e componentes do react-native, juntos permitem que o usuário crie ou faça login na conta, permite salvamento ou exclusão de todos os sorteios de acordo com as escolhas do usuário

# Protótipo do Sorteador Mobile

O aplicativo passou por algumas ideias, desde salvar os sorteios em forma de arquivos até criação e login de contas google

# Tela Inicial
![Protótipo da Tela Inícial](https://github.com/user-attachments/assets/fc00d962-88fa-4886-8c67-a762f2194093)
# Tela de Cadastro/Login
![Protótipo da Tela de Cadastro/Login](https://github.com/user-attachments/assets/bc67a1f2-347e-4dc8-beb6-372ccdbd86e4)
# Tela da lista de sorteios salvos
![Protótipo da Tela da lista de sorteios](https://github.com/user-attachments/assets/9b87daeb-914b-4ac5-8c7b-78fd993851fc)
# Tela do Sorteador
![Tela com opção de carregamento e salvamento por arquivos](https://github.com/user-attachments/assets/d595e250-e320-4bb6-a28c-de28accf97f0)
# Telas de demonstração de responsividade
![Demonstrações de responsividade do aplicativo](https://github.com/user-attachments/assets/625ebd46-364f-4c6e-94cb-8d5aa0546dc6)

Os protótipos de telas quase refletem as telas finais do aplicativo, pois a tela inícial e a tela de login por exemplo tiveram algumas adições em relação ao protótipo, na tela inícial agora tem 2 botões, um para cadastro e outro para login, a tela de login consequentemente foi dividido em 2 telas, tela de cadastro e de login

# Tecnologias utilizadas
Claude e Copilot (Inteligências Artificiais), componentes do react native (Framework), expo, sqlite (Banco de Dados) e WebStorm (IDE)

![Logotipo do Claude](https://github.com/user-attachments/assets/29fbab3d-6e9c-4892-93ca-721fc246e915)
![Logotipo do Copilot](https://github.com/user-attachments/assets/076c174e-5424-4175-850f-8c2773c8ad73)
![Logotipo do React Native](https://github.com/user-attachments/assets/6ae70edb-caab-4156-be37-9008505b7b9b) 
![Logotipo do WebStorm](https://github.com/user-attachments/assets/5ee9f70d-5bec-4bcc-a60d-e8e1c5255a08)

# Guia de Instalação e uso
Ao baixar o arquivo zip e extrair-lo, será preciso realizar certos comandos para o aplicativo funcionar, tanto na web quanto no celular. Para baixar as dependências, clique com o botão direito na pasta do projeto e clique em abrir no terminal, posteriormente use o comando (porque a maioria dos arquivos já estão presentes no repositório):
```
npm install
```
Ao instalar e quem sabe esperar a indexação das pastas e arquivos, para executar o aplicativo, basta usar o comando:
```
npx expo start
```
Caso tenha problemas no projeto, você pode tentar usar o comando:
```
npx expo start --clear
```
Este comando limpa todo o cache do projeto e/ou do expo, incluindo os corrompidos

# Estrutura de arquivos e pastas do projeto

O projeto é estruturado nesta forma:
* App.js
* app.json
* index.js
* identifier.sqlite
* package.json
* package-lock.json
* src
  * assets
    * numbers
      * N0
      * N1
      * N2
      * N3
      * N4
      * N5
      * N6
      * N7
      * N8
      * N9
    * icons
      * trash
    * adaptive-icon
    * favicon
    * icon
    * splash-icon
  * contexts
    * authContext 
  * routes
    * navigation
  * screens
    * Drawing
      * CustomSwitch
      * index
    * DrawsList
      * index
    * Home
      * index
    * Login
      * index  
    * Register
      * index 
  * services
    * database
    * drawsService
    * firebaseConfig
    * numberToImages
    * randomNumbers  

O projeto é dividido em 5 tipos: Assets (imagens principalmente), contexts (encarregado de fazer ações de autenticação de contas), routes (encarregado na navegação do app, ou seja, é ele que muda de uma tela para outra), screens (são todas as telas do app) e services (serviços como de banco de dados, exibição de imagens, sorteio de números, entre outros)

# Telas finais do Sorteador Mobile

# Tela Inicial 
![Tela Inicial](https://github.com/user-attachments/assets/d44f077b-a83b-4aa5-8e65-a67e0a5b1664)
# Tela de Cadastro
![Tela de Cadastro](https://github.com/user-attachments/assets/7971d81c-7b8d-444a-ab9a-f23c239ab564)
# Tela de login
![Tela de login](https://github.com/user-attachments/assets/75acfae3-4e7b-4f1a-9e8b-4daf9624d772)
# Lista de sorteios
![Lista de sorteios](https://github.com/user-attachments/assets/9cd75ed2-f372-499b-a166-1a1a8f2b31a7)
# Tela de sorteios
![Tela de sorteios](https://github.com/user-attachments/assets/5eda298f-2bdf-4791-b7e5-3c3fd5a6c57f)



