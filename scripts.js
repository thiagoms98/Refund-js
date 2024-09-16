// Seleciona os elementos de formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

// Captura evento do input para formatá-lo
amount.oninput = () => {
  // Remove caracteres não numéricos
  let value = amount.value.replace(/\D/g, "")
  // Transforma o valor em centavos
  value = Number(value) / 100
  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // Formata o valor no padrão BRL
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
  // Retorna o valor formatado
  return value
}
// Captura o evento de submit para obter os valores
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página
  event.preventDefault()
  // Cria um Objeto com os detalhes da despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }
  // Chama a função passando o newExpense
  expenseAdd(newExpense)

}
// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento (li) para adicionar na lista (ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o ícone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")    
    removeIcon.setAttribute("alt", "Remover")    

    // Adiciona name e category na div das informações da despesa
    expenseInfo.append(expenseName, expenseCategory)

    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    // Adiciona item na lista
    expenseList.append(expenseItem)
    // Limpa o formulário
    formClear()
    // Atualiza os totais
    updateTotals()

  } catch (error) {
    alert("Não foi possível adicionar a despesa.")
    console.log(error)
  }
}
// Atualiza o total
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children
    // Atualiza a quantidade de itens da lista
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`

    // Variável para incrementar o total
    let total = 0

    // Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")
      // Remove caracteres não numéricos e substitui a vírgula
      let value = itemAmount.textContent.replace(/[^\d,]/g, ""). replace(",", ".")
      value = parseFloat(value)

      // Verifica se é um número válido
      if(isNaN(value)) {
        return alert("Digite um valor válido")
      }

      total += Number(value)
    }

    // Cria a span para adicionar R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento
    expensesTotal.innerHTML = ""

    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais")
  }
}

// Evento que captura cliques na lista
expenseList.addEventListener("click", function(event) {
  // Verifica se o elemento clicado é o de remover da lista
  if (event.target.classList.contains("remove-icon")) {
    // Obtém a li pai do elemento clicado
    const item = event.target.closest(".expense")
    // Remove o item (li)
    item.remove()
  }
  // Atualiza os totais
  updateTotals()
})

function formClear() {
  // Limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""
  // Coloca o foco no campo (nome da despesa)
  expense.focus()
}