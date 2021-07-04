let arrayFunctions = ["accountValue", "categoryAccount", "dueData", "releaseDateOf"]
let accountData = [];
function registerAccount(){
    console.log()
    arrayFunctions.forEach((elements)=> {
        userData.push(document.getElementById(elements).value)
    })
    console.log(userData)
    // let xhr = new XMLHttpRequest();
    
}