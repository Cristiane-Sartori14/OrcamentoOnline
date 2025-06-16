// Função para adicionar novo produto
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

      lista += `${i + 1}. ${nome} - ${qtd} un x R$ ${valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}<br>`;
    }
  });

  document.getElementById("valorTotal").innerHTML = `R$ ${total.toFixed(2)}`;
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
