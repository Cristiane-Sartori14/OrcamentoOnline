const modoCliente =
  new URLSearchParams(window.location.search).get("modo") === "cliente";

function gerarNumeroOrcamento() {
  const ano = new Date().getFullYear();
  const chave = `contatorOrcamento_${ano}`;
  let contador = localStorage.getItem(chave);

  if (!contador) {
    contador = 1;
  } else {
    contador = parseInt(contador) + 1;
  }

  localStorage.setItem(chave, contador);
  const numeroFormatado = `${ano}.${String(contador).padStart(4, "0")}`;
  documento.getElementById("numeroOrcamento").innerText = numeroFormatado;
}

gerarNumeroOrcamento();

function adicionarProduto(nome = "", qtd = "", valor = "") {
  const div = document.createElement("div");
  div.classList.add("produto");
  div.innerHTML = `
        <label>Nome do Produto:</label>
        <input type="text" class="nome" value="${nome}">
        <label>Quantidade:</label>
        <input type="number" class="quantidade" value="${qtd}">
        <label>Valor Unitário:</label>
        <input type="number" class="valor" step="0.01" value="${valor}">
      `;
  document.getElementById("produtos").appendChild(div);
}

function gerarLink() {
  const cliente = encodeURIComponent(document.getElementById("cliente").value);
  const observacoes = encodeURIComponent(
    document.getElementById("observacoes").value
  );
  const produtos = document.querySelectorAll(".produto");

  const lista = [];
  produtos.forEach((p) => {
    const nome = encodeURIComponent(p.querySelector(".nome").value);
    const qtd = p.querySelector(".quantidade").value;
    const valor = p.querySelector(".valor").value;
    lista.push(`${nome},${qtd},${valor}`);
  });

  const dados = encodeURIComponent(
    JSON.stringify({ cliente, observacoes, produtos: lista })
  );
  const link = `${
    window.location.origin + window.location.pathname
  }?modo=cliente&dados=${dados}`;
  prompt("Copie o link abaixo e envie ao cliente:", link);
}

function exibirOrcamento(cliente, produtosArray, observacoes) {
  let texto = `<strong>Cliente:</strong> ${cliente}<br><br><strong>Produtos:</strong><br>`;
  let total = 0;

  produtosArray.forEach((item, i) => {
    const [nome, qtdStr, valorStr] = item.split(",");
    const qtd = parseInt(qtdStr);
    const valor = parseFloat(valorStr);
    const subtotal = qtd * valor;
    total += subtotal;
    texto += `${i + 1}. ${decodeURIComponent(
      nome
    )} - ${qtd} un x R$ ${valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}<br>`;
  });

  texto += `<br><strong>Total:</strong> R$ ${total.toFixed(2)}<br><br>`;
  if (observacoes) texto += `<strong>Observações:</strong> ${observacoes}<br>`;

  document.getElementById("orcamentoTexto").innerHTML = texto;
  document.getElementById("orcamentoArea").style.display = "block";
}
