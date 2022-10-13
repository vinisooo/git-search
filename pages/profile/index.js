function userFromLocalStorage(){

    const userStr = localStorage.getItem("@git-search: current-user");

    if (userStr){
        const parseUser = JSON.parse(userStr);
        const user = parseUser;

        const newTitle = document.querySelector("title");
        newTitle.innerText = user.login

        return user
    }

}

const userInfo = userFromLocalStorage();

userFromLocalStorage();

function displayHeader(){
    document.body.append(createHeader(userInfo));
}

function createHeader (user){

    const headerContent = document.createElement("header");
    const leftUserSide = document.createElement("div");
    const userFigure = document.createElement("figure");
    const userImg = document.createElement("img");
    const userNameDiv = document.createElement("div");
    const userName = document.createElement("h2");
    const userSpan = document.createElement("span");
    const headerLinksDiv = document.createElement("div");
    const headerLinkA = document.createElement("a");
    const headerLinkA2 = document.createElement("a");


    headerContent.classList = "flex justify-between main-header align-center container";
    leftUserSide.classList = "about-user flex align-center";
    userFigure.classList = "user-picture flex justify-center align-center"
    userImg.classList = "";
    userNameDiv.classList = "user-name-occupation flex direction-column";
    userName.classList = "title-1";
    userSpan.classList = "occupation";
    headerLinksDiv.classList = "header-links flex align-center";
    headerLinkA.classList = "header-link pink-1";
    headerLinkA2.classList = "header-link";

    userFigure.title = user.name || user.avatar_url
    userImg.src = user.avatar_url;
    userName.innerText = user.name;
    userSpan.innerText = user.bio || user.login;
    headerLinkA.innerText = "Email";
    headerLinkA.title = user.email || "sem e-mail cadastrado"
    headerLinkA2.innerText = "Procurar por outro usuario"
    headerLinkA2.href = "/pages/home/index.html"

    userFigure.append(userImg);
    userNameDiv.append(userName, userSpan);
    leftUserSide.append(userFigure, userNameDiv);
    headerLinksDiv.append(headerLinkA, headerLinkA2);
    headerContent.append(leftUserSide, headerLinksDiv);
    return headerContent;
}
displayHeader();

async function getRepos(){

    try{
        const repos = await fetch(`https://api.github.com/users/${userInfo.login}/repos`)
        .then(response => response.json());
        
        createRepos(repos);
        
        return repos
    }catch{
        console.log("viishhh");
    }

}

getRepos();

function createRepos(arr){

    const mainSection = document.createElement("main");
    const repositoriesList = document.createElement("ul");
    mainSection.classList = "main-content container";
    repositoriesList.classList = "repositories flex wrap";

    mainSection.append(repositoriesList);
    document.body.append(mainSection);

    arr.forEach((repo)=>{
        const repoCard = document.createElement("li");
        const repoTitleLink = document.createElement("a");
        const repoTitle = document.createElement("h3");
        const repoDescription = document.createElement("h3");
        const repoDiv = document.createElement("div");
        const repoLink = document.createElement("a");
        const repoPages = document.createElement("a");

        repoCard.classList = "repository flex direction-column justify-between";
        repoTitle.classList = "title-2 repository-title";
        repoDescription.classList = "text-def-2 repository-description";;
        repoDiv.classList = "repo-links flex";
        repoLink.classList = "repo-btn";
        repoPages.classList = "repo-btn"

        repoTitleLink.href = repo.html_url;
        repoTitle.innerText = repo.name;
        repoDescription.innerText = repo.description;
        repoLink.innerText = "Repositório";
        repoLink.href = repo.html_url
        repoLink.target = "_blank";
        repoPages.innerText = "Demo";
        repoPages.href = repo.homepage || `https://${userInfo.login}.github.io/${repo.name}/`
        repoPages.target = "_blank";
        

        repoTitleLink.append(repoTitle);
        repoDiv.append(repoLink, repoPages);
        repoCard.append(repoTitleLink, repoDescription, repoDiv);

        repositoriesList.append(repoCard);

        return repoCard;
    })
}
