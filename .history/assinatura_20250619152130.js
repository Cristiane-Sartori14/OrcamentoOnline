const params = new URLSearchParams(window.location.search);
const dataEncoded = params.get("data");

if (!dataEncoded) {
  document.getElementById("orcamentoArea").innerHTML = "<p>Dados do orçamento não encontrados.</p>";
  throw new Error("Dados do orçamento não fornecidos.");
}

const jsonStr = decodeURIComponent(atob(dataEncoded));
const dados = JSON.parse(jsonStr);

function mostrarOrcamento() {
  let listaProdutos = "";
  let total = 0;
  dados.produtos.forEach((p, i) => {
    const subtotal = p.quantidade * p.valor;
    total += subtotal;
    listaProdutos += `<li>${p.nome} - ${p.quantidade} un x R$ ${p.valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}</li>`;
  });

  document.getElementById("orcamentoArea").innerHTML = `
    <p><strong>Cliente:</strong> ${dados.cliente}</p>
    <p><strong>CNPJ:</strong> ${dados.cnpj} &nbsp;&nbsp;&nbsp; <strong>IE:</strong> ${dados.ie}</p>
    <p><strong>Endereço:</strong> ${dados.endereco}</p>
    <p><strong>Cidade:</strong> ${dados.cidade} &nbsp;&nbsp;&nbsp; <strong>CEP:</strong> ${dados.cep}</p>
    <p><strong>Contato:</strong> ${dados.contato} &nbsp;&nbsp;&nbsp; <strong>Telefone:</strong> ${dados.telefone}</p>
    <h3>Produtos</h3>
    <ul>${listaProdutos}</ul>
    <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
    <h3>Forma de Pagamento</h3>
    <p>Entrada: R$ ${dados.entrada}</p>
    <p>Parcelamento: ${dados.parcelamento}</p>
    <hr>
    <p>Por favor, assine abaixo para autorizar o faturamento:</p>
  `;
}

mostrarOrcamento();

const canvas = document.getElementById("assinatura");
const ctx = canvas.getContext("2d");
let desenhando = false;
let lastX = 0;
let lastY = 0;

ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.strokeStyle = "#000";

canvas.addEventListener("mousedown", (e) => {
  desenhando = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
});
canvas.addEventListener("mousemove", (e) => {
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

// Touch support
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  desenhando = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
});
canvas.addEventListener("touchmove", (e) => {
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

function limparAssinatura() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function salvarPdf() {
  const assinaturaImg = canvas.toDataURL("image/png");
  const orcamentoHtml = document.getElementById("orcamentoArea").innerHTML;

  const divPdf = document.createElement("div");
  divPdf.style.padding = "20px";
  divPdf.innerHTML = `
    <h1>Orçamento Assinado</h1>
    ${orcamentoHtml}
    <h3>Assinatura:</h3>
    <img src="${assinaturaImg}" style="max-width: 400px; border: 1px solid #000;" />
    <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
  `;
  document.body.appendChild(divPdf);

  const options = {
    margin: 10,
    filename: "orcamento_assinado.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(options).from(divPdf).save().then(() => {
    document.body.removeChild(divPdf);
  });
}
