let nameUser = []
let expensesUser = [];
let objUser = {};
let userData = {};
const pages = ["screen_login", "newAccount", "profileUser", "accountScreen", "newExpenseScreen", "profileUpdate"]

// ---------------------------- muda páginas ---------------------------------------------//
function changePage(_showPage,_hidePage) {
    document.getElementById(`${pages[_showPage]}`).style.display = "none"
    document.getElementById(`${pages[_hidePage]}`).style.display = "flex"
}

// ---------------------------- login do usuario - validação ---------------------------------------------//

function loginUser() {
    userData.email = document.getElementById("emailInput").value;
    userData.password = document.getElementById("passwordInput").value;

    if (userData.name == '' || userData.password == '') {
        document.getElementById("feedbackLogin").innerText = "Informações inválidas!";
    } else {

        let xhr = new XMLHttpRequest();

        xhr.open("POST", "/loginuser", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
            expensesUser = this.response;
            if (expensesUser.length == 0) {
                document.getElementById("feedbackLogin").innerText = "Usuário não encontrado!";
                return
            } else {
                expensesUser = JSON.parse(expensesUser);
                changePage(0, 2)
                // ele só pega do primeiro quando há mais contas, precisa ser reavaliado esse uso
                objUser = expensesUser[0];
                document.getElementById("greetings").innerText += " " + objUser.name;
                console.log(objUser)
            }
        }
        xhr.send(JSON.stringify(userData));
    }

}

// ----------------------------  historico do usuario -------------------------------------------//

function historyShow() {
    changePage(2,3)

    let historyAccounts = objUser.accounts;
    numberAccounts = Object.keys(historyAccounts);
    numberAccountsValues = Object.values(historyAccounts);
    console.log(numberAccounts);
    let spaceInfos = document.getElementById("expenseSpace");
    if (numberAccounts == 0) {
        spaceInfos.innerHTML = `
                                <div id="tableNames">
                                                <p> Sem despesas </p>
                                </div>
                                `
        spaceInfos.style.marginTop = 100 + "px";
    } else {
        document.getElementById("tableNames").innerHTML += `
                    <p>Nomes</p>
                    <p>Valor</p>
        `
        spaceInfos.innerHTML += `
                <div id="spaceNome">
                </div>
        `
        spaceInfos.innerHTML += `
                <div id="valNome">
                </div>
        `
        spaceInfos.innerHTML += `
                <div id="garbagemanSpace">
                </div>
        `
        for (let i = 0; i < numberAccounts.length; i++) {

            document.getElementById("spaceNome").innerHTML += `
             <p class="accountInfoHistory"type="text">${numberAccounts[i]}</p>
             `
            document.getElementById("valNome").innerHTML += `
             <p class="accountInfoHistory"type="text">${numberAccountsValues[i]} R$ </p>
             `
            document.getElementById("garbagemanSpace").innerHTML += `
             <img class="garbagemanIcon" src="./images/trash.png" alt="">
             `

        }
    }

}

// ---------------------------- novas dívidas ------------------------------//

function sendExpenses(_valueExpense, _categoryExpense, _dueDateExpense, _releaseExpense) {
    let expenseData = {
        "id": objUser.id,
        "name": objUser.name,
        "dueData": _dueDateExpense,
        "releaseData": _releaseExpense,
        "accounts": {
            
        }
    }

    objUser.accounts[_categoryExpense] = Number(_valueExpense);
    console.log(objUser)
    // objUser.accounts[categoria] = _categoryExpense;


    let xhr = new XMLHttpRequest();

    xhr.open("POST", "/registerexpense", true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
        document.getElementById("feedbackregisterExpense").innerText = "cadastro realizado com sucesso!"
        console.log("enviado com sucesso!");
    }
    xhr.send(JSON.stringify(objUser));

}

// ---------------------------- deletar usuario ---------------------------------------------//


function deleteAccount() {
    let xhr = new XMLHttpRequest();

    xhr.open("DELETE", `/deleteuser/${objUser.id}`, true);
    xhr.onload = function () {
        document.getElementById('interaction').innerHTML = `${this.response}`;
        setTimeout(()=>{
            changePage(2,0)
        },500)
    }
    xhr.send();

}

// ---------------------------- ver perfil  ----------------------------------//
function viewProfile(){
    changePage(2,5)
    document.getElementById("name_User").innerText = objUser.name;
}


// ---------------------------- atualizar usuario  ----------------------------------//
function updateDataUser(_phone,_email,_password) {
    let updateData = {
        id: objUser.id,
        name: objUser.name,
        email: _email,
        phone: _phone,
        password: {
         normal: _password
        }

    }
    console.log(_password)
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/updateuser", true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
    }
    xhr.send(JSON.stringify(updateData));
}