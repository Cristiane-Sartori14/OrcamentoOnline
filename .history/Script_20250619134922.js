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
      lista += `${i + 1}. ${nome} - ${qtd} un x R$ ${valor.toFixed(
        2
      )} = R$ ${subtotal.toFixed(2)}<br>`;
    }
  });

  document.getElementById("valorTotal").innerHTML = `R$ ${total.toFixed(2)}`;
  document.getElementById("listaProdutos").innerHTML = lista;
}

window.onload = () => {
  const campos = document.querySelectorAll(".produto input");
  campos.forEach((input) => {
    input.addEventListener("input", calcularTotal);
  });
  calcularTotal();
};

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
      listaProdutos += `${i + 1}. ${nome} - ${qtd} un x R$ ${valor.toFixed(
        2
      )} = R$ ${subtotal.toFixed(2)}<br>`;
      total += subtotal;
    }
  });

  const assinaturaCanvas = document.getElementById("signatureCanvas"); // <== aqui!
  const assinaturaImg = assinaturaCanvas.toDataURL("image/png");

  const texto = `
    <h2>AUTORIZAÇÃO DE FATURAMENTO</h2>
    <p>Autorizamos a empresa BELLENZIER PNEUS LTDA a faturar o valor total de 
    <strong>R$ ${total.toFixed(2)}</strong> referente à compra de:</p>
    <div>${listaProdutos}</div>

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
    Nome e assinatura do responsável<br><br>
    <strong>Assinatura:</strong><br>
    <img src="${assinaturaImg}" style="max-width: 300px; border: 1px solid #000;" />
  `;

  const area = document.getElementById("orcamentoArea");
  area.innerHTML = texto;
  area.style.display = "block";

  // gera PDF
  const options = {
    margin: 10,
    filename: "orcamento.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(area).save();
}

document.querySelector("#gerarPdf").addEventListener("click", () => {
  salvarOrcamento();
});


// Assinatura com canvas

function gerarLink() {
  const cliente = document.getElementById("cliente").value;
  const total = document.getElementById("valorTotal").textContent;
  const lista = encodeURIComponent(document.getElementById("listaProdutos").innerHTML);

  const url = `assinatura.html?cliente=${encodeURIComponent(cliente)}&total=${encodeURIComponent(total)}&lista=${lista}`;
  document.getElementById("link").innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
}

document.getElementById("gerarPdf").addEventListener("click", () => {
  const cliente = document.getElementById("cliente").value;
  const total = document.getElementById("valorTotal").textContent;
  const listaProdutos = document.getElementById("listaProdutos").innerHTML;
  const assinaturaImg = document.getElementById("signatureCanvas").toDataURL("image/png");

  const area = document.createElement("div");
  area.innerHTML = `
    <h2>AUTORIZAÇÃO DE FATURAMENTO</h2>
    <p>Cliente: <strong>${cliente}</strong></p>
    <p>Total: <strong>${total}</strong></p>
    <div>${listaProdutos}</div>
    <p><strong>Assinatura:</strong></p>
    <img src="${assinaturaImg}" style="border:1px solid #000; max-width:300px;">
  `;

  html2pdf().from(area).save();
});
