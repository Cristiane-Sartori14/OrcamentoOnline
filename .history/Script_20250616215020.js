// Adiciona produto
function adicionarProduto() {
  const div = document.createElement("div");
  div.classList.add("produto");
  div.innerHTML = `
    <label>Produto:</label>
    <input type="text" class="nome" oninput="calcularTotal()" />

    <label>Quantidade:</label>
    <input type="number" class="quantidade" oninput="calcularTotal()" />

    <label>Valor Unitário (R$):</label>
    <input type="number" step="0.01" class="valor" oninput="calcularTotal()" />
  `;
  document.getElementById("produtos").appendChild(div);
}

// Calcula o total e atualiza o resumo dos produtos
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
      lista += `${i + 1}. ${nome} - ${qtd} un x R$ ${valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}<br>`;
    }
  });

  document.getElementById("valorTotal").innerHTML = `R$ ${total.toFixed(2)}`;
  document.getElementById("listaProdutos").innerHTML = lista;
}

// Aplica cálculo ao carregar a página
window.onload = () => {
  calcularTotal();
};

// Função para gerar o orçamento e salvar como PDF
function salvarOrcamento() {
  const cliente = document.getElementById("cliente").value;
  const cnpj = document.getElementById("cnpj").value;
  const ie = document.getElementById("ie").value;
  const endereco = document.getElementById("endereco").value;
  const cidade = document.getElementById("cidade").value;
  const cep = document.getElementById("cep").value;
  const contato = document.getElementById("contato").value;
  const telefone = document.getElementById("telefone").value;
  const entrada = document.getElementById("entrada").value;
  const parcelamento = document.getElementById("parcelamento").value;

  const produtos = document.querySelectorAll(".produto");
  let listaProdutos = "";
  let total = 0;

  produtos.forEach((p, i) => {
    const nome = p.querySelector(".nome").value.trim();
    const qtd = parseInt(p.querySelector(".quantidade").value) || 0;
    const valor = parseFloat(p.querySelector(".valor").value) || 0;

    if (nome && qtd > 0 && valor > 0) {
      const subtotal = qtd * valor;
      listaProdutos += `${i + 1}. ${nome} - ${qtd} un x R$ ${valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}<br>`;
      total += subtotal;
    }
  });

  const texto = `
    <h2 style="text-align:center;">AUTORIZAÇÃO DE FATURAMENTO</h2>
    <p>Autorizamos a empresa ELLENZIER PNEUS LTDA a faturar o valor total de 
    <strong>R$ ${total.toFixed(2)}</strong> referente à compra de:</p>

    ${listaProdutos}

    <h3>Forma de Pagamento</h3>
    ENTRADA DE <strong>R$ ${entrada}</strong><br>
    SALDO BOLETOS EM <strong>${parcelamento}</strong><br><br>

    <h3>Dados para Faturar</h3>
    Razão Social: ${cliente}<br>
    CNPJ: ${cnpj} &nbsp;&nbsp;&nbsp; IE: ${ie}<br>
    Endereço: ${endereco}<br>
    Cidade(UF): ${cidade} &nbsp;&nbsp;&nbsp; CEP: ${cep}<br>
    Contato: ${contato} &nbsp;&nbsp;&nbsp; Tel: ${telefone}<br><br>

    Porto Alegre, ${new Date().toLocaleDateString("pt-BR")}<br><br>
    _______________________________________________<br>
    Nome e assinatura do responsável pela empresa que está autorizando.
  `;

  const area = document.getElementById("orcamentoArea");
  area.innerHTML = texto;
  area.style.display = "block";

  setTimeout(() => {
    const opt = {
      margin: 0.5,
      filename: 'faturamento.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(area).set(opt).save();
  }, 200);
}

// Função fictícia (exemplo) para botão "Enviar link assinatura"
function linkAssinatura() {
  alert("Funcionalidade de link de assinatura ainda não implementada.");
}