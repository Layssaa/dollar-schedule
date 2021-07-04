const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');
const PORT = 80;

//---------------------- CRIPTOGRAFIA --------------------------- //
const crypto = require('crypto');
const { log } = require('console');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

//---------------------- descrição do arquivo --------------------------- //
fs.open('./public/js/books.json', "r", (err, data) => {
})

//---------------------- leitura do arquivo --------------------------- //
let users = [];

app.get("/", (req, res, next) => {
    const options = {
        root: path.join(__dirname + '/public/')
    };

    res.sendFile('index.html', options, (err) => {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
            next();
        }
    });
});

// --------------------------------------- cadastro de usuário --------------------------------------- //
app.post("/user", (req, res) => {
    let senhaESalt = " ";

    fs.readFile('./data/users.json', 'utf-8', (err, data) => {
        if (err) throw err
        newUser(data)
    });

    function newUser(_data) {
        users = JSON.parse(_data);

        // --------------------------------------- CRIPTOGRAFIA ---------------------------------------------------//
        // https://marquesfernandes.com/tecnologia/criptografando-e-armazenando-senhas-com-nodejs-melhores-praticas/ 
        // --------------------------------------- LINK TUTORIAL --------------------------------------------------//

        function generateSalt() {
            return crypto.randomBytes(Math.ceil(16)).toString('hex').slice(0, 16);
        }
        function sha512(senha, salt) {
            var hash = crypto.createHmac('sha512', salt); 
            hash.update(senha);
            var hash = hash.digest('hex');
            return {
                salt,
                hash,
            };
        };
        function generatePassword(senha) {
            let salt = generateSalt(16); 
            senhaESalt = sha512(senha, salt); 
        }

        generatePassword(req.body.password, 'ABC123');

        generateSalt();
        generatePassword(req.body.password);

        // -----------------------------------------------------------------------------------------------------//
        let idUser = (users.length + 1)

        let newUsers = {
            id: idUser,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: {
                normal: req.body.password,
                salt: senhaESalt.salt,
                hash: senhaESalt.hash
            }
        };

        users.push(newUsers)
        fs.writeFile("./data/users.json", `${JSON.stringify(users)}`, () => {
        })
    }
    res.send(null)
});

// --------------------------------------- login de usuário --------------------------------------- //
app.post("/loginuser", (req, res) => {
    let userLogin = {
        email: req.body.email,
        password: req.body.password
    }

    const login = new Promise((resolve, rejects) => {

        fs.readFile('./data/users.json', 'utf-8', (err, data) => {
            if (err) throw err
            let searchArray = JSON.parse(data);

            searchArray = searchArray.filter(value => value.email == userLogin.email && value.password.normal === userLogin.password);
            if (searchArray.length == 0) {
                rejects("erro");
            } else {
                resolve(searchArray);
            }
        });
    }).then((_searchArray) => {
        let searchArray = _searchArray[0];

        fs.readFile('./data/expenses.json', 'utf-8', (err, data) => {
            if (err) throw err
            dataExpense = JSON.parse(data);

            let expensesUser = dataExpense.filter(value => value.id == searchArray.id);
            res.send(expensesUser);
        });
    }).catch((err) => {
        res.send(null);
    })
    /*
        //----------------------------------------- criptografia --------------------------------------------//
        // function login(senhaDoLogin, saltNoBanco, hashNoBanco) {
        //     var senhaESalt = sha512(senhaDoLogin, saltNoBanco)
        //     return hashNoBanco === senhaESalt.hash;
        // }
        // login(userLogin.password, searchArray.password.salt, searchArray.password.hash)
        //----------------------------------------- ------------ --------------------------------------------//
    */
})

// --------------------------------------- atualizar usuário --------------------------------------- //
app.put("/updateuser", (req, res) => {
    let dataUpdateUser = req.body;

    fs.readFile('./data/users.json', 'utf-8', (err, data) => {
        if (err) throw err
        let usersUpdateData = JSON.parse(data);

        usersUpdateData = usersUpdateData.filter((elements) => { return elements.id != dataUpdateUser.id })
        usersUpdateData.push(dataUpdateUser);

        fs.writeFile("./data/users.json", `${JSON.stringify(usersUpdateData)}`, () => {
        })
    });
    res.send(null)
});

// --------------------------------------- cadastrar despesas - Não está pronto ainda --------------------------------------- //
app.post("/registerexpense", (req, res) => {
    let expenseDataUser = req.body;

    fs.readFile("./data/expenses.json", "utf-8", (err, data) => {
        if (err) throw err

        let expenseBankList = JSON.parse(data);
        expenseBankList = expenseBankList.filter(value => value.id != expenseDataUser.id);

        expenseBankList.push(expenseDataUser)


        fs.writeFile("./data/expenses.json", `${JSON.stringify(expenseBankList)}`, () => {
        })
    })
})

// --------------------------------------- remover usuário --------------------------------------- //

app.delete("/deleteuser/:id", (req, res) => {
    let dataUserRemove = JSON.parse(req.params.id);
    fs.readFile('./data/users.json', 'utf-8', (err, data) => {
        if (err) throw err
        let usersUpdate = JSON.parse(data);

        let newUsersList = usersUpdate.filter((elements) => { return elements.id != dataUserRemove })

        fs.writeFile("./data/users.json", `${JSON.stringify(newUsersList)}`, () => {
        })
    });
    res.send("removido com sucesso")
});

// -----------------------------------------------------------------------------------------------------//
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
