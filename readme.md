[![Playwright Tests](https://github.com/FabioGVL/AutomationExercise-Playwright/actions/workflows/AutomationExercise.yml/badge.svg)](https://github.com/FabioGVL/AutomationExercise-Playwright/actions/workflows/AutomationExercise.yml)
# Automação de Testes E2E - Automation Exercise

## Escopo do Produto

O **Automation Exercise** é uma plataforma web de e-commerce desenvolvida especificamente para a prática de testes de software. O sistema simula a jornada completa de um cliente no varejo digital, englobando desde a criação de uma conta e navegação no catálogo de produtos, até o gerenciamento de um carrinho de compras e o fluxo de checkout com pagamento seguro. A aplicação também conta com formulários de contato e mecanismos de inscrição em newsletters, refletindo as regras de negócio e os fluxos críticos de uma loja virtual real.

## Escopo do Teste

A estratégia foca em garantir a funcionalidade correta e a integridade dos fluxos principais da loja virtual, simulando o comportamento de um usuário real e validando os limites de entrada.

* **Mapeamento de Features:** Autenticação (Login/Cadastro), Vitrine de Produtos, Carrinho de Compras, Checkout/Pagamento e Formulário de Contato.
* **Features Testadas:** Fluxos críticos como cadastro com validação de formato de e-mail, adição de produtos ao carrinho (validando limites de quantidade), finalização de compra e envio de mensagens no suporte.
* **Massa de Dados:** Abordagem mista utilizando dados fixos para validação de produtos específicos e geração dinâmica (via biblioteca *Faker*) para prevenir conflitos de sessão durante a criação de novos usuários.
* **Tipos de Testes:**
  * **Testes E2E (End-to-End):** Validação funcional dos fluxos ponta a ponta que percorrem toda a aplicação, abrangendo jornadas críticas como o ciclo completo de autenticação (registro, login e gerenciamento de sessão), navegação no catálogo de produtos, gestão do carrinho de compras e o fluxo de checkout até a finalização do pedido.
  * **Testes de Integração:** Validação funcional da comunicação e comportamento conjunto entre a interface (UI) e os serviços de backend/APIs (ex: submissão de formulários, validação de regras de negócio em rotas e resposta de endpoints como o de download de faturas).

## Arquitetura e Estrutura

O projeto foi organizado para garantir a separação entre a lógica de teste e a configuração das requisições, facilitando a manutenção e a escalabilidade.

* **Padrão de Projeto:** Page Object Model (POM) / Actions, garantindo o isolamento dos seletores web.
* **Tecnologias e Ambiente:** `Playwright` | `JavaScript (ES6+)` | `Node.js` | `Github Actions` | `Git` | `Windows 11` | `Chrome`

## Bugs Encontrados e Validações

Durante a automação, falhas graves nas regras de negócio, validação de front-end e segurança de rotas foram identificadas. Elas estão mapeadas na suíte de testes com a anotação `test.fixme()`.

| Rota / Módulo | Suíte de Teste | Comportamento Inesperado (Bug) |
| :--- | :--- | :--- |
| **`/auth`** | `registerUser.spec.js` | O sistema aceita o cadastro de e-mails sem domínio válido (ex: `usuario@dominioInvalidoSemPonto`). |
| **`/cart`** | `interacaoProdutosCart.spec.js` | É possível definir e adicionar um produto ao carrinho com quantidade igual a `0`. |
| **`/cart`** | `interacaoProdutosCart.spec.js` | O sistema aceita quantidades negativas (ex: `-5`), gerando pedidos com subtotais negativos no checkout. |
| **`/checkout`** | `downloadInvoice.spec.js` | A API permite o download de faturas por usuários anônimos (não autenticados), respondendo com status 200 OK. |
| **`/checkout`** | `downloadInvoice.spec.js` | É possível acessar diretamente a rota de pagamento via URL, pulando o fluxo de carrinho/checkout. |
| **`/checkout`** | `fluxoCheckout.js` | Acesso direto permitido à tela de entrega e detalhes do pedido mesmo com o carrinho completamente vazio. |
| **`/checkout`** | `fluxoCheckout.spec.js` | O gateway de pagamento aceita a submissão e conclui compras utilizando cartões com o ano já expirado (ex: 2015). |
| **`/contact`** | `contactUs.spec.js` | O formulário de contato é enviado com sucesso mesmo com o campo obrigatório "Nome" em branco. |
| **`/contact`** | `contactUs.spec.js` | O formulário de contato é enviado com sucesso mesmo com o campo obrigatório "Mensagem" em branco. |

<details>
<summary><b>Passos para Reproduzir o Erro: Cadastro com E-mail Inválido (Bug 1)</b></summary>

1. Acesse a página inicial do Automation Exercise.
2. Clique no botão "Signup / Login".
3. No campo "New User Signup!", insira um nome e um e-mail sem domínio ou ponto válido (ex: `usuario@dominioInvalidoSemPonto`).
4. Clique no botão "Signup".
5. Verifique que o sistema prossegue para a tela de preenchimento de cadastro em vez de bloquear e exibir um erro de sintaxe de e-mail.
</details>

<details>
<summary><b>Passos para Reproduzir o Erro: Carrinho com Quantidade Zero (Bug 2)</b></summary>

1. Acesse o site do Automation Exercise.
2. Navegue até a página de detalhes de qualquer produto (ex: `/product_details/1`).
3. Altere o campo de quantidade para `0`.
4. Clique no botão "Add to cart".
5. Navegue até o carrinho de compras (`/view_cart`) e observe que o item foi adicionado com quantidade zero ou gerando inconsistência de cálculo.
</details>

<details>
<summary><b>Passos para Reproduzir o Erro: Carrinho com Quantidade Negativa (Bug 3)</b></summary>

1. Acesse o site do Automation Exercise.
2. Navegue até a página de detalhes de qualquer produto (ex: `/product_details/1`).
3. No campo de quantidade, insira o valor `-5`.
4. Clique no botão "Add to cart".
5. Navegue até o carrinho de compras (`/view_cart`) e verifique que o item foi adicionado com quantidade negativa e preço total incorreto.
6. Prossiga para o Checkout e confirme que o pedido pode ser finalizado com subtotal negativo.
</details>

<details>
<summary><b>Passos para Reproduzir o Erro: Download de Fatura Anônimo (Bug 4)</b></summary>

1. Abra o navegador em uma janela anônima (sem realizar login na aplicação).
2. Acesse diretamente a URL do endpoint ou a rota correspondente ao download de fatura (ex: `/download_invoice/500`).
3. Verifique que a API/sistema processa a requisição e retorna o arquivo de fatura com status `200 OK` em vez de bloquear com erro de autorização.
</details>

<details>
<summary><b>Passos para Reproduzir o Erro: Acesso Direto ao Pagamento (Bug 5)</b></summary>

1. Acesse o site e realize o login com uma conta válida.
2. Certifique-se de que o carrinho está vazio.
3. Na barra de endereços do navegador, digite manualmente a rota `/payment` e pressione Enter.
4. O sistema carregará a interface de pagamento, permitindo inserir dados bancários sem ter um pedido ativo.
</details>

<details>
<summary><b>Passos para Reproduzir o Erro: Acesso Direto à Entrega com Carrinho Vazio (Bug 6)</b></summary>

1. Certifique-se de estar logado na aplicação com o carrinho completamente vazio.
2. Tente navegar diretamente para a rota de checkout ou de endereço/entrega (ex: `/checkout`).
3. Observe que o sistema permite o avanço para a etapa de entrega ignorando a validação de que o carrinho precisa conter itens ativos.
</details>

<details>
<summary><b>Passos para Reproduzir o Erro: Checkout com Cartão Expirado (Bug 7)</b></summary>

1. Realize o fluxo completo de compra até a tela de pagamento.
2. No formulário de dados do cartão de crédito, preencha os campos obrigatórios e insira um ano de validade já expirado no passado (ex: Ano: `2015`).
3. Clique no botão para confirmar o pedido/pagamento.
4. Verifique que o sistema aceita a transação e conclui a compra com sucesso, ignorando a validação de expiração do cartão.
</details>

<details>
<summary><b>Passos para Reproduzir o Erro: Contato sem Campo "Nome" (Bug 8)</b></summary>

1. Acesse a página "Contact us" (`/contact_us`).
2. Preencha os campos de E-mail e Mensagem, mas deixe o campo obrigatório **"Name"** completamente em branco.
3. Clique no botão "Submit".
4. Verifique que o formulário é enviado com sucesso e exibe mensagem de sucesso, violando a regra de validação de campo obrigatório.
</details>

<details>
<summary><b>Passos para Reproduzir o Erro: Contato sem Campo "Mensagem" (Bug 9)</b></summary>

1. Acesse a página "Contact us" (`/contact_us`).
2. Preencha os campos de Nome e E-mail, mas deixe a caixa de texto obrigatória **"Message"** completamente em branco.
3. Clique no botão "Submit".
4. Verifique que o sistema submete o formulário com sucesso sem exigir o preenchimento da mensagem.
</details>

<br>

# Passos para Configurar e Reproduzir o Projeto

Siga o guia abaixo para clonar, configurar o ambiente e executar a suíte de testes automatizados em sua máquina local.

---

## Pré-requisitos

Certifique-se de possuir as seguintes ferramentas instaladas em seu ambiente:

- [Node.js](https://nodejs.org/) — versão 18 ou superior
- [Git](https://git-scm.com/)
- Editor de código de sua preferência, como [VS Code](https://code.visualstudio.com/)

---

## Obtendo o Código do Projeto

Você pode obter os arquivos do projeto de duas formas.

### Opção A: Clonando via Git (Recomendado)

Abra o terminal e execute o comando abaixo para clonar o repositório:

```bash
git clone https://github.com/FabioGVL/AutomationExercise-Playwright.git
```

Em seguida, navegue para dentro da pasta do projeto:

```bash
cd AutomationExercise-Playwright
```

### Opção B: Baixando via ZIP

1. Acesse a página do repositório no GitHub.
2. Clique no botão verde **Code**.
3. Selecione **Download ZIP**.
4. Extraia o conteúdo do arquivo compactado em uma pasta no seu computador.
5. Abra o VS Code.
6. Acesse **Arquivo > Abrir Pasta** e selecione a pasta descompactada.

---

## Instalando as Dependências

Com o terminal aberto na raiz do projeto, execute o comando abaixo para instalar todas as dependências listadas no `package.json`:

```bash
npm install
```

---

## Instalando os Navegadores do Playwright

O Playwright utiliza instâncias próprias de navegadores para garantir maior consistência nas execuções.

Instale os binários necessários executando:

```bash
npx playwright install
```

---

## Executando os Testes

O projeto suporta diferentes modos de execução, de acordo com a necessidade.

### Execução Padrão (Headless)

Executa toda a suíte de testes em segundo plano, diretamente pelo terminal:

```bash
npx playwright test
```

### Modo Interativo com Interface (UI Mode)

Abre o painel visual do Playwright, permitindo acompanhar a execução passo a passo, inspecionar elementos e realizar o debug de testes individualmente:

```bash
npx playwright test --ui
```

### Modo Visível (Headed)

Executa os testes com as instâncias do navegador abertas e visíveis na tela:

```bash
npx playwright test --headed
```

### Visualizando o Relatório HTML

Após a execução dos testes, um relatório detalhado pode ser visualizado no navegador utilizando:

```bash
npx playwright show-report
```

---

## Resumo dos Comandos

| Objetivo | Comando |
|---|---|
| Instalar dependências | `npm install` |
| Instalar navegadores do Playwright | `npx playwright install` |
| Executar testes em modo Headless | `npx playwright test` |
| Executar testes em UI Mode | `npx playwright test --ui` |
| Executar testes em modo Headed | `npx playwright test --headed` |
| Abrir relatório HTML | `npx playwright show-report` |


