// let arrayFunctions = ["nameUser", "emailUser", "phoneUser", "passwordUser"];
// let userData = {
//   name: " ",
//   email: " ",
//   phone: " ",
//   password: " "
// }

function registerUser() {

  userData.name = document.getElementById("nameUser").value
  userData.email = document.getElementById("emailUser").value
  userData.phone = document.getElementById("phoneUser").value
  // const hash = crypto.subtle.digest('SHA-512', document.getElementById("passwordUser").value)
  // console.log(hash)hash
  userData.password = document.getElementById("passwordUser").value;
  console.log(userData)
  if (userData.name == '' || userData.email == '' || userData.phone == '' || userData.password == '') {
    document.getElementById("feedbackRegister").innerText = "por favor, insira os dados!";
    document.getElementById("feedbackRegister").style.color = "red";
    return
  } else {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "/user", true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
      document.getElementById("feedbackRegister").innerText = "cadastro realizado com sucesso!"
      console.log("enviado com sucesso!");
    }
    xhr.send(JSON.stringify(userData));

  }

}