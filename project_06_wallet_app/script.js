
// ! Buttons
const saveBtn = document.getElementById("save-btn")
const addBtn = document.getElementById("add-btn")
const cleanAllBtn = document.getElementById("clean-all-btn")


// ! Save Form
const saveForm = document.getElementById("expense-form")
const dateField = document.getElementById('date-input')
const expensePlaceField = document.getElementById("expense-place")
const expenseAmountField = document.getElementById("expense-amount")

// ? making default date as today's date
const today = new Date().toISOString().split('T')[0];
dateField.setAttribute('value', today);


// ! Income Form
const incomeForm = document.getElementById("income-form")
const incomeInputField = document.getElementById("income-input")

// ! Expenses Table
const expensesTable = document.getElementById("expenses-table")

// ! Calculation Table
const yourIncome = document.getElementById("your-income")
const yourExpense = document.getElementById("your-expenses")
const remainedMoney = document.getElementById("remained-money")
const remainedRow = document.getElementById("remained-row")


// ! FUNCTIONS - -- -- --- -- --
showAllExpenses()
showCalculationTable()

// ? Adding new expense to local storage
function addExpenseToLocalStorage(newExpense){
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    expenses.push(newExpense)
    localStorage.setItem('expenses',JSON.stringify(expenses))
}

//? Function to retrieve all expenses
function getAllExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

// ? Showing all expenses on page
function showAllExpenses(){
    const tbody = expensesTable.querySelector("tbody")
    tbody.innerHTML = ''

    getAllExpenses().forEach((expense,index)=>{
        const newTr = document.createElement('tr')

        newTr.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.expensePlace}</td>
            <td>${expense.expenseAmount}</td>
            <td> <button class="btn text-danger border-0" data-target="${index}" ><i class="fa-solid fa-trash-can"></i></button> </td>
        `
        tbody.appendChild(newTr)
    })
}

// ? Delete specific expense
function deleteExpense(index){
    const expenses = getAllExpenses()
    expenses.splice(index, 1)
    localStorage.setItem("expenses",JSON.stringify(expenses));
}

// ? Add income to Local Storage
function addIncomeToLocalStorage(newIncome){
    const income = JSON.parse(localStorage.getItem("income")) || 0;

    const totalIncome = income + parseFloat(newIncome)

    localStorage.setItem('income',JSON.stringify(totalIncome))
}

// ? Show Calculation table
function showCalculationTable(){
    const allExpenses = Array.from(getAllExpenses()).map((expense)=>parseFloat(expense.expenseAmount)).reduce((sum,expense)=>sum+expense,0).toFixed(2)
    const income = parseFloat(localStorage.getItem("income")) || 0
    const remained = (income - allExpenses).toFixed(2) 
    
    yourIncome.textContent = income.toFixed(2)
    yourExpense.textContent = allExpenses > 0 ? allExpenses : "0.00"
    remainedMoney.textContent = remained

    const isNegative = parseFloat(remained) < 0
    remainedRow.firstElementChild.style.color = isNegative ? "red":"inherit"
    remainedRow.lastElementChild.style.color= isNegative ? "red":"inherit"
}

// ? Delete All data Function
function clearAllData(){
    localStorage.clear()
}


// !- -- -- --- -- ----------

// ! Click Events

// ? Adding new Expense data to Local Storage
saveBtn.addEventListener('click',(e)=>{
    
    if(saveForm.checkValidity()){
        e.preventDefault()
    }
    

    if(dateField.value && expensePlaceField.value && expenseAmountField.value){
        const expense = {
            date:dateField.value,
            expensePlace:expensePlaceField.value,
            expenseAmount:expenseAmountField.value
        }

    addExpenseToLocalStorage(expense)

    expensePlaceField.value = ''
    expenseAmountField.value = ''
    }

    showAllExpenses()
    showCalculationTable()
    
})

// ? Removing an Expense event
expensesTable.querySelector("tbody").addEventListener("click", (e) => {
    if (e.target.closest(".btn.text-danger")) {
        const index = e.target.closest("button").getAttribute("data-target");
        deleteExpense(Number(index));

    }
    showAllExpenses()
    showCalculationTable()
});

// ? Adding income event
addBtn.addEventListener("click",(e)=>{

    if(incomeForm.checkValidity()){
        e.preventDefault()
    }
    

    if(incomeInputField.value){
        addIncomeToLocalStorage(incomeInputField.value)
        incomeInputField.value = ''
    }
    showCalculationTable()
})


// ? Clearing all data event
cleanAllBtn.addEventListener("click",(e)=>{
    if(confirm("Do you want to delete All data?")){
        clearAllData()
    }
    showAllExpenses()
    showCalculationTable()
})



