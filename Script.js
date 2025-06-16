// Função para adicionar novo produto
function adicionarProduto() {
  const div = document.createElement("div");
  div.classList.add("produto");
  div.innerHTML = 
    <label>Produto:</label>
    <input type="text" class="nome" oninput="calcularTotal()" />

    <label>Quantidade:</label>
    <input type="number" class="quantidade" oninput="calcularTotal()" />

    <label>Valor Unitário (R$):</label>
    <input type="number" step="0.01" class="valor" oninput="calcularTotal()" />
  ;
  document.getElementById("produtos").appendChild(div);
}

// Função para calcular o total e listar os produtos
function calcularTotal() {
  const produtos = document.querySelectorAll(".produto");
  let total = 0;
  let lista = "";

  produtos.forEach((p, i) => {
    const nome = p.querySelector(".nome").value.trim();
    const qtd = parseInt(p.querySelector(".quantidade").value) || 0;
    const valor = parseFloat(p.querySelector(".valor").value) || 0;

    if (nome && qtd > 0 && valor > 0) {
      const subtotal = qtd * valor;
      total += subtotal;

      lista += ${i + 1}. ${nome} - ${qtd} un x R$ ${valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}<br>;
    }
  });

  document.getElementById("valorTotal").innerHTML = R$ ${total.toFixed(2)};
  document.getElementById("listaProdutos").innerHTML = lista;
}

// Adiciona listeners aos campos iniciais ao carregar a página
window.onload = () => {
  const primeiroProduto = document.querySelector(".produto");
  const campos = primeiroProduto.querySelectorAll("input");
  campos.forEach(input => {
    input.addEventListener("input", calcularTotal);
  });
  calcularTotal(); // força cálculo inicial (mesmo com campos em branco)
};

function gerarOrdemFaturamento() {
  const cliente = document.getElementById("cliente").value;
  const cnpj = document.getElementById("cnpj").value;
  const ie = document.getElementById("ie").value;
  const endereco = document.getElementById("endereco").value;
  const cidade = document.getElementById("cidade").value;
  const cep = document.getElementById("cep").value;
  const contato = document.getElementById("contato").value;
  const telefone = document.getElementById("telefone").value;
  const entrada = document.getElementById("entrada").value;
  const boleto = document.getElementById("boleto").value;

  let texto = 
    <h2>Autorização de Faturamento</h2>
    <p><strong>Cliente:</strong> ${cliente}</p>
    <p><strong>CNPJ:</strong> ${cnpj}</p>
    <p><strong>IE:</strong> ${ie}</p>
    <p><strong>Endereço:</strong> ${endereco}</p>
    <p><strong>Cidade (UF):</strong> ${cidade}</p>
    <p><strong>CEP:</strong> ${cep}</p>
    <p><strong>Contato:</strong> ${contato}</p>
    <p><strong>Telefone:</strong> ${telefone}</p>
    <p><strong>Entrada:</strong> ${entrada}</p>
    <p><strong>Boleto:</strong> ${boleto}</p>
    <p><strong>Produtos:</strong></p>
  ;

  const produtos = document.querySelectorAll(".produto");
  produtos.forEach((p, i) => {
    const nome = p.querySelector(".nome").value;
    const qtd = p.querySelector(".quantidade").value;
    const valor = p.querySelector(".valor").value;
    texto += <p>${i + 1}. ${nome} - ${qtd} un. x R$ ${valor}</p>;
  });

  document.getElementById("documentoFinal").innerHTML = texto;
  document.getElementById("modoEdicao").style.display = "none";
  document.getElementById("documentoFinal").style.display = "block";


  const texto = 
    <h2>AUTORIZAÇÃO DE FATURAMENTO</h2>
    <p>Autorizamos a empresa Bellenzier Pneus Ltda a faturar o valor referente à compra de:</p>
    ${listaProdutos}

    <h3>Forma de Pagamento</h3>
    ENTRADA DE ${entrada}<br>
    SALDO BOLETOS EM ${boleto}<br><br>

    <h3>Dados para Faturar</h3>
    Razão Social: ${cliente}<br>
    CNPJ: ${cnpj} &nbsp;&nbsp;&nbsp; IE: ${ie}<br>
    Endereço: ${endereco}<br>
    Cidade(UF): ${cidade} &nbsp;&nbsp;&nbsp; CEP: ${cep}<br>
    Contato (nome): ${contato} &nbsp;&nbsp;&nbsp; Tel contato: ${telefone}<br><br>

    Porto Alegre, ${new Date().toLocaleDateString("pt-BR")}<br><br>
    _______________________________________________<br>
    Nome e assinatura do responsável pela empresa que está autorizando.
  ;

  // Cria ou substitui a área do orçamento
  let area = document.getElementById("orcamentoTexto");
  if (!area) {
    area = document.createElement("div");
    area.id = "orcamentoTexto";
    document.body.appendChild(area);
  }

  area.innerHTML = texto;
}

// Função para limpar a assinatura (caso deseje)
function limparAssinatura() {
  const canvas = document.getElementById("assinatura");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Função para salvar a assinatura como imagem
function salvarAssinatura() {
  const canvas = document.getElementById("assinatura");
  const link = document.createElement("a");
  link.download = "assinatura.png";
  link.href = canvas.toDataURL();
  link.click();
}

// Exemplo simples de salvar orçamento como imagem
function salvarOrcamento() {
  window.print();
}
