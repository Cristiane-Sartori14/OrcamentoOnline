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


window.addEventListener("load", () => {
  const campos = document.querySelectorAll(".produto input");
  campos.forEach((input) => input.addEventListener("input", calcularTotal));
  calcularTotal();
  inicializarCanvasAssinatura(); // Nova função abaixo
});


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
window.onload = function () {
  const canvas = document.getElementById("signatureCanvas");
  const ctx = canvas.getContext("2d");
  let desenhando = false;
  let lastX = 0;
  let lastY = 0;

  // Estilo do traço
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  // Mouse
  canvas.addEventListener("mousedown", function (e) {
    desenhando = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  });

  canvas.addEventListener("mousemove", function (e) {
    if (!desenhando) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mouseup", () => {
    desenhando = false;
    ctx.closePath();
  });

  canvas.addEventListener("mouseout", () => {
    desenhando = false;
    ctx.closePath();
  });

  // Toque (mobile)
  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    desenhando = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  });

  canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (!desenhando) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
  });

  canvas.addEventListener("touchend", () => {
    desenhando = false;
    ctx.closePath();
  });
};

// Função para gerar imagem da assinatura (opcional)
function gerarLinkAssinatura() {
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

  const produtos = [];
  document.querySelectorAll(".produto").forEach((p) => {
    const nome = p.querySelector(".nome").value.trim();
    const quantidade = p.querySelector(".quantidade").value;
    const valor = p.querySelector(".valor").value;

    // Verifica se o produto tem dados válidos
    if (nome && quantidade && valor) {
      produtos.push({ nome, quantidade, valor });
    }
  });

  const dados = {
    cliente, cnpj, ie, endereco, cidade, cep, contato, telefone,
    entrada, parcelamento, produtos,
  };

  try {
    const json = JSON.stringify(dados);
    const base64 = btoa(encodeURIComponent(json));
    const url = `assinatura.html?data=${base64}`;
    prompt("Copie o link para enviar ao cliente:", url);
  } catch (e) {
    alert("Erro ao gerar o link: " + e.message);
    console.error(e);
  }
}

  // Ajuste o caminho 'assinatura.html' para o nome/caminho real da página
const url = `assinatura.html?data=${base64}`;
prompt("Copie o link para enviar ao cliente:", url);

function inicializarCanvasAssinatura() {
  const canvas = document.getElementById("signatureCanvas");
  if (!canvas) return; // segurança
  const ctx = canvas.getContext("2d");
  let desenhando = false;
  let lastX = 0;
  let lastY = 0;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  canvas.addEventListener("mousedown", function (e) {
    desenhando = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  });

  canvas.addEventListener("mousemove", function (e) {
    if (!desenhando) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mouseup", () => {
    desenhando = false;
    ctx.closePath();
  });

  canvas.addEventListener("mouseout", () => {
    desenhando = false;
    ctx.closePath();
  });

  // toque
  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    desenhando = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  });

  canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (!desenhando) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
  });

  canvas.addEventListener("touchend", () => {
    desenhando = false;
    ctx.closePath();
  });
}
