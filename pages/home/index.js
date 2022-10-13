const searchInput = document.getElementById("user-search");
const submitSearchBtn = document.getElementById("submit-search");
const userNotFoundMsg = document.getElementsByClassName("user-not-found")[0];

localStorage.removeItem("@git-search: current-user");

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

function getInputValue(event){
    event.preventDefault();
    const nickName = searchInput.value;
    getAPIResult(nickName)
}

function invalidInput(){
    searchInput.classList.add("search-user-input-invalid");
    userNotFoundMsg.classList.remove("hidden");
}


function loadingResult(){
    submitSearchBtn.innerText = "";
    const spinner = document.createElement("img");

    spinner.src = "/assets/icons/spinner.png"
    spinner.classList = "spin-animation";

    submitSearchBtn.append(spinner)
}


function resetBtn (){
    submitSearchBtn.innerHTML = "";
    submitSearchBtn.innerText = "Ver perfil do github";
}


async function getAPIResult(nickName){
    loadingResult()

    try{
        const userData = await fetch(`https://api.github.com/users/${nickName}`)
        .then((response)=>{
            return response.json();
        })

        resetBtn()
        if(userData.message == "Not Found"){
            invalidInput()
        }
        else{
            const strResponse = JSON.stringify(userData);
            localStorage.setItem("@git-search: current-user", strResponse);
            window.location.href = "/pages/profile/index.html";
        }
        return userData
    }catch{
        invalidInput();
    }
    
}