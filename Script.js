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

  const produtos = document.querySelectorAll(".produto");
  let listaProdutos = "";
  let total = 0;

  produtos.forEach((p, i) => {
    const nome = p.querySelector(".nome").value.trim();
    const qtd = parseInt(p.querySelector(".quantidade").value) || 0;
    const valor = parseFloat(p.querySelector(".valor").value) || 0;
    const subtotal = qtd * valor;

    if (nome && qtd > 0 && valor > 0) {
      listaProdutos += `${i + 1}. ${nome} - ${qtd} un. x R$ ${valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}<br>`;
      total += subtotal;
    }
  });

  const textoFinal = `
    <h2>AUTORIZAÇÃO DE FATURAMENTO</h2>
    <p>Autorizamos a empresa <strong>Bellenzier Pneus Ltda</strong> a faturar o valor total de <strong>R$ ${total.toFixed(2)}</strong> referente à compra de:</p>
    <p>${listaProdutos}</p>

    <h3>Forma de Pagamento</h3>
    <p>ENTRADA DE: <strong>R$ ${entrada}</strong><br>
    SALDO BOLETOS EM: <strong>R$ ${boleto}</strong></p>

    <h3>Dados para Faturar</h3>
    <p><strong>Razão Social:</strong> ${cliente}<br>
    <strong>CNPJ:</strong> ${cnpj} &nbsp;&nbsp;&nbsp; <strong>IE:</strong> ${ie}<br>
    <strong>Endereço:</strong> ${endereco}<br>
    <strong>Cidade (UF):</strong> ${cidade} &nbsp;&nbsp;&nbsp; <strong>CEP:</strong> ${cep}<br>
    <strong>Contato:</strong> ${contato} &nbsp;&nbsp;&nbsp; <strong>Telefone:</strong> ${telefone}</p>

    <p><br><br>Porto Alegre, ${new Date().toLocaleDateString("pt-BR")}</p>
    <p>_______________________________________________<br>
    Nome e assinatura do responsável pela empresa que está autorizando.</p>
  `;

  // Esconde formulário e exibe versão final
  document.getElementById("modoEdicao").style.display = "none";

  // Cria ou substitui a área final
  let area = document.getElementById("orcamentoTexto");
  if (!area) {
    area = document.createElement("div");
    area.id = "orcamentoTexto";
    document.body.appendChild(area);
  }

  area.innerHTML = textoFinal;
  area.style.display = "block";
}
