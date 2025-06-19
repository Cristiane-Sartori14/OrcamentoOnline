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
const canvas = document.getElementById("assinatura");
const ctx = canvas.getContext("2d");
let desenhando = false;

canvas.addEventListener("mousedown", (e) => {
  desenhando = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  if (!desenhando) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
  desenhando = false;
  ctx.closePath();
});

canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mouseout", () => (drawing = false));

// Toque
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  drawing = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
});

canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  if (!drawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const currentX = touch.clientX - rect.left;
  const currentY = touch.clientY - rect.top;
  drawLine(lastX, lastY, currentX, currentY);
  [lastX, lastY] = [currentX, currentY];
});

canvas.addEventListener("touchend", () => (drawing = false));

// Desenho
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Limpa o canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("signatureImage").style.display = "none";
}

// Salva como imagem
function saveSignature() {
  const dataURL = canvas.toDataURL("image/png");
  const img = document.getElementById("signatureImage");
  img.src = dataURL;
  img.style.display = "block";
}

function linkAssinatura() {
  const canvas = document.getElementById("signatureCanvas");
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "assinatura.png";
  link.click();
}
