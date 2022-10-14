const searchInput = document.getElementById("user-search");
const submitSearchBtn = document.getElementById("submit-search");
const userNotFoundMsg = document.getElementsByClassName("user-not-found")[0];

let recentUsers = new Array;
//PEGANDO USUARIOS ACECSSADOS RECENTEMENTE DO LOCAL STORAGE

// function checkLocalStorage(){

//     let users = localStorage.getItem("@git-search: recent-users");
//     users = JSON.parse(users);

//     if (users == null){
//         users = [];
//         localStorage.setItem("@git-search: recent-users",JSON.stringify(users));
//     }
// }

function getRecentUsers(){
    const recents = localStorage.getItem("@git-search: recent-users");

    if (recents){
        let recentsParse = JSON.parse(recents);
        recentUsers = recentsParse;
        return recentUsers
    }


}
getRecentUsers();

////////////////////////////
searchInput.addEventListener("keyup",()=>{
    searchInput.classList.remove("search-user-input-invalid");
    userNotFoundMsg.classList.add("hidden");

    if(searchInput.value.length > 0){
        submitSearchBtn.classList.remove("invalid-input");
        submitSearchBtn.classList.add("valid-input");

    }if(searchInput.value.length == 0){
        submitSearchBtn.classList.remove("valid-input");
        submitSearchBtn.classList.add("invalid-input");
    }
    
})

submitSearchBtn.addEventListener("click", getInputValue)


//PEGANDO O VALOR DO INPUT
function getInputValue(event){
    event.preventDefault();
    const nickName = searchInput.value;
    getAPIResult(nickName)
}


//ESTILIZANDO O INPUT E MOSTRANDO MENSAGEM QUANDO O INPUT É INVÁLIDO
function invalidInput(){
    searchInput.classList.add("search-user-input-invalid");
    userNotFoundMsg.classList.remove("hidden");
}


//ADICIONANDO ANIMAÇÃO AO BOTÃO DED VER PERFIL NO GITHUB
function loadingResult(){
    submitSearchBtn.innerText = "";
    const spinner = document.createElement("img");

    spinner.src = "/assets/icons/spinner.png"
    spinner.classList = "spin-animation";

    submitSearchBtn.append(spinner)
}

//RESETANDO O BOTAO DE VER PERFIL NO GITHUB
function resetBtn (){
    submitSearchBtn.innerHTML = "";
    submitSearchBtn.innerText = "Ver perfil do github";
}


//BUSCANDO USUARIO NA API
async function getAPIResult(nickName){
    loadingResult()

    const userData = await fetch(`https://api.github.com/users/${nickName}`)
    .then(response=> response.json())
    .catch(error =>{
        invalidInput();
        console.log(error);
    })

    resetBtn();
    if(userData.message == "Not Found"){

        invalidInput();
        return userData
    }else{

        console.log(userData);
        addNewRecent(userData);
    
        const strResponse = JSON.stringify(userData);
        localStorage.setItem("@git-search: current-user", strResponse);
        window.location.href = "/pages/profile/index.html";
        

    }
    
    return userData
    
}

function addNewRecent(user){

    for (recentUser of recentUsers){
        if (recentUser.login == user.login){
            return user.login;
        }
    }

    recentUsers.unshift(user);
    const strRecentUsers = JSON.stringify(recentUsers);
    localStorage.setItem("@git-search: recent-users", strRecentUsers);

    if (recentUsers.length == 4){
        recentUsers.pop()
        const strRecentUsers = JSON.stringify(recentUsers);
        localStorage.setItem("@git-search: recent-users", strRecentUsers);
    }
    
}

function renderRecentUsers(arr){
    const recentUsersList = document.getElementById("recent-users")
    arr.forEach((user)=>{

        const recentUser = document.createElement("li");
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const searchRecentCTA = document.createElement("span");

        recentUser.classList = "flex direction-column align-center recent-user";
        figure.classList = "recent-user-img flex align-center justify-center";
        searchRecentCTA.id = "search-recent-user";
        searchRecentCTA.classList = "search-recent-btn hidden"

        figure.title = user.login;
        img.src = user.avatar_url;
        searchRecentCTA.innerText = "Acessar este perfil";

        figure.append(img);
        recentUser.append(figure);
        recentUser.append(searchRecentCTA);
        recentUsersList.append(recentUser);
    })
}
renderRecentUsers(recentUsers);

const recentUsersFigure = document.getElementsByClassName("recent-user-img");
for(btn of recentUsersFigure){

    btn.addEventListener("mouseenter",(event)=>{
        const button = event.path[1].children[1];

        button.classList.remove("hidden");

    })

    btn.addEventListener("mouseout",(event)=>{
        const button = event.path[1].children[1];

        button.classList.add("hidden");

    })

    btn.addEventListener("click",(event)=>{
        getAPIResult(event.target.title)
    })
}
