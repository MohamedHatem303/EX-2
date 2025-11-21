(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const side = document.querySelector(".side-nav-menu");
    const tab = document.querySelector(".nav-tab");
    const header = document.querySelector(".nav-header");
    let toggle = document.querySelector(".open-close-icon");
    const links = document.querySelectorAll(".nav-tab .links li");

    if (!toggle) {
      toggle = document.createElement("i");
      toggle.className = "open-close-icon fa fa-align-justify";
      (header || side).prepend(toggle);
    }

    if (getComputedStyle(side).pointerEvents === "none") side.style.pointerEvents = "auto";

    const OPEN = "open";
    const tabW = () =>
      (tab.offsetWidth || +getComputedStyle(document.documentElement).getPropertyValue("--tab-width") || 300);

    const apply = (open) => {
      tab.style.transform = open ? "translateX(0)" : "translateX(-100%)";
      (header || side).style.transform = open ? `translateX(${tabW()}px)` : "translateX(0)";
    };

    let isOpen = side.classList.contains(OPEN);
    apply(isOpen);

    const open = () => {
      isOpen = true;
      side.classList.add(OPEN);
      toggle.classList.replace("fa-align-justify", "fa-xmark");
      apply(true);
      animateLinks();
    };
    const close = () => {
      isOpen = false;
      side.classList.remove(OPEN);
      toggle.classList.replace("fa-xmark", "fa-align-justify");
      apply(false);
    };

    function animateLinks() {
      links.forEach((li, i) => {
        li.classList.remove("animate__animated", "animate__fadeInUp");
        void li.offsetWidth;
        li.style.animationDelay = `${i * 0.12}s`;
        li.classList.add("animate__animated", "animate__fadeInUp");
      });
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen ? close() : open();
    });
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle.click();
      }
    });
    tab.addEventListener("click", (e) => {
      if (e.target.closest("li")) close();
    });
    document.addEventListener("click", (e) => {
      if (!isOpen) return;
      if (!side.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  });
})();


let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let innerLoading = document.querySelector(".inner-loading-screen");
function showLoader() {
  if (innerLoading) innerLoading.style.display = "flex";
}
function hideLoader() {
  if (innerLoading) innerLoading.style.display = "none";
}
function showSearchInputs() {
  searchContainer.innerHTML = `
    <div class="row py-4">
      <div class="col-md-6">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent " placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" placeholder="Search By First Letter">
      </div>
    </div>
  `;
  rowData.innerHTML = "";
}
function showContacts() {
  searchContainer.innerHTML = "";
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
}
async function searchByName(term) {
  rowData.innerHTML = "";
  showLoader();

  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  let data = await res.json();

  hideLoader();
  displayMeals(data.meals || []);
}
async function searchByFLetter(letter) {
  rowData.innerHTML = "";
  showLoader();

  letter = letter || "a";
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  let data = await res.json();

  hideLoader();
  displayMeals(data.meals || []);
}
async function getCategories() {
  searchContainer.innerHTML = "";
  rowData.innerHTML = "";
  showLoader();

  let res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  let data = await res.json();

  hideLoader();
  displayCategories(data.categories);
}
async function getArea() {
  searchContainer.innerHTML = "";
  rowData.innerHTML = "";
  showLoader();

  let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
  let data = await res.json();

  hideLoader();
  displayArea(data.meals);
}
async function getIngredients() {
  searchContainer.innerHTML = "";
  rowData.innerHTML = "";
  showLoader();

  let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
  let data = await res.json();

  hideLoader();
  displayIngredients(data.meals.slice(0, 20));
}
async function getCategoryMeals(c) {
  rowData.innerHTML = "";
  showLoader();

  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${c}`);
  let data = await res.json();

  hideLoader();
  displayMeals(data.meals.slice(0, 20));
}
async function getAreaMeals(a) {
  rowData.innerHTML = "";
  showLoader();

  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${a}`);
  let data = await res.json();

  hideLoader();
  displayMeals(data.meals.slice(0, 20));
}
async function getIngredientsMeals(i) {
  rowData.innerHTML = "";
  showLoader();

  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${i}`);
  let data = await res.json();

  hideLoader();
  displayMeals(data.meals.slice(0, 20));
}
async function getMealDetails(id) {
  rowData.innerHTML = "";
  showLoader();

  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  let data = await res.json();
  let m = data.meals[0];

  hideLoader();

  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    if (m[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-1 p-1">
        ${m[`strMeasure${i}`]} ${m[`strIngredient${i}`]}
      </li>`;
    }
  }

  let tags = m.strTags ? m.strTags.split(",") : [];
  let tagsStr = tags
    .map(tag => `<li class="alert alert-danger m-1 p-1">${tag}</li>`)
    .join("");

  rowData.innerHTML = `
    <div class="col-md-4">
      <img class="w-100 rounded-3" src="${m.strMealThumb}">
      <h2>${m.strMeal}</h2>
    </div>

    <div class="col-md-8">
      <h3>Instructions</h3>
      <p>${m.strInstructions}</p>

      <h4>Area: ${m.strArea}</h4>
      <h4>Category: ${m.strCategory}</h4>

      <h4>Recipes:</h4>
      <ul class="list-unstyled d-flex flex-wrap">${ingredients}</ul>

      <h4>Tags:</h4>
      <ul class="list-unstyled d-flex flex-wrap">${tagsStr}</ul>

      ${m.strSource ? `<a target="_blank" href="${m.strSource}" class="btn btn-success me-2">Source</a>` : ""}

      <a target="_blank" href="${m.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
  `;
}
function displayMeals(arr) {
  if (!arr.length) {
    rowData.innerHTML = `<div class="col-12 text-center"><p>No results found</p></div>`;
    return;
  }
  let cartona = "";
  for (let i = 0; i < arr.length; i++) {
    cartona += `
      <div class="col-md-3">
        <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden">
          <img class="w-100" src="${arr[i].strMealThumb}">
          <div class="meal-layer position-absolute p-2 text-center text-black d-flex align-items-center">
            <h3>${arr[i].strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  }
  rowData.innerHTML = cartona;
}

function displayCategories(arr) {
  let cartona = "";
  for (let i = 0; i < arr.length; i++) {
    cartona += `
      <div class="col-md-3">
        <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden">
          <img class="w-100" src="${arr[i].strCategoryThumb}">
          <div class="meal-layer position-absolute p-2 text-center text-black d-flex align-items-center">
            <h3>${arr[i].strCategory}</h3>
          </div>
        </div>
      </div>
    `;
  }
  rowData.innerHTML = cartona;
}

function displayArea(arr) {
  let cartona = "";
  for (let i = 0; i < arr.length; i++) {
    cartona += `
      <div class="col-md-3 text-center cursor-pointer" onclick="getAreaMeals('${arr[i].strArea}')">
        <i class="fa-solid fa-house-laptop fa-3x"></i>
        <h4>${arr[i].strArea}</h4>
      </div>
    `;
  }
  rowData.innerHTML = cartona;
}

function displayIngredients(arr) {
  let cartona = "";
  for (let i = 0; i < arr.length; i++) {
    cartona += `
      <div class="col-md-3 text-center cursor-pointer" onclick="getIngredientsMeals('${arr[i].strIngredient}')">
        <i class="fa-solid fa-drumstick-bite fa-3x"></i>
        <h4>${arr[i].strIngredient}</h4>
        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
      </div>
    `;
  }
  rowData.innerHTML = cartona;
}

searchByName("");
function $(id){ return document.getElementById(id); }

function nameValidation() { const e = $("nameInput"); if(!e) return false; return /^[a-zA-Z ]+$/.test(e.value.trim()); }
function emailValidation() { const e = $("emailInput"); if(!e) return false; return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e.value.trim()); }
function phoneValidation() { const e = $("phoneInput"); if(!e) return false; return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(e.value.trim()); }
function ageValidation() { const e = $("ageInput"); if(!e) return false; return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(e.value.trim()); }
function passwordValidation() { const e = $("passwordInput"); if(!e) return false; return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(e.value); }
function repasswordValidation() { const p = $("passwordInput"), r = $("repasswordInput"); if(!p||!r) return false; return r.value === p.value && r.value.length>0; }

function showAlert(id){ const a=$(id); if(!a) return; a.style.display = "block"; a.classList.remove("d-none"); }
function hideAlert(id){ const a=$(id); if(!a) return; a.style.display = "none"; a.classList.add("d-none"); }

function inputsValidation(){
  const fields = [
    {id:"nameInput", alert:"nameAlert", valid:nameValidation},
    {id:"emailInput", alert:"emailAlert", valid:emailValidation},
    {id:"phoneInput", alert:"phoneAlert", valid:phoneValidation},
    {id:"ageInput", alert:"ageAlert", valid:ageValidation},
    {id:"passwordInput", alert:"passwordAlert", valid:passwordValidation},
    {id:"repasswordInput", alert:"repasswordAlert", valid:repasswordValidation},
  ];

  let allValid = true;
  fields.forEach(f=>{
    const inp=$(f.id);
    const alId=f.alert;
    if(!inp || !$(alId)){ allValid=false; return; }
    const val = inp.value.trim();
    const touched = inp.dataset.touched === "true";

    if(val === ""){ hideAlert(alId); allValid = false; return; } 

    if(!touched){ hideAlert(alId); allValid = false; return; } 

    if(!f.valid()){ showAlert(alId); allValid = false; } else { hideAlert(alId); }
  });

  const submitBtn = $("submitBtn");
  if(!submitBtn) return;
  if(allValid) submitBtn.removeAttribute("disabled"); else submitBtn.setAttribute("disabled","true");
}

function initContactValidation(){
  function setup(){
    const name = $("nameInput"); const submitBtn = $("submitBtn");
    if(!name || !submitBtn) return false;

    const inputs = ["nameInput","emailInput","phoneInput","ageInput","passwordInput","repasswordInput"]
      .map(id=>$(id)).filter(Boolean);

    ["nameAlert","emailAlert","phoneAlert","ageAlert","passwordAlert","repasswordAlert"].forEach(id=>{
      const a=$(id); if(a){ a.style.display = "none"; a.classList.add("d-none"); }
    });

    function onInput(e){
      const t = e.target;
      if(t.value.trim().length > 0) t.dataset.touched = "true";
      inputsValidation();
    }

    inputs.forEach(i=>{
      i.removeEventListener("input", onInput);
      i.addEventListener("input", onInput);
      i.removeEventListener("blur", inputsValidation);
      i.addEventListener("blur", inputsValidation);
    });

    submitBtn.removeEventListener("click", onSubmit);
    submitBtn.addEventListener("click", onSubmit);

    inputsValidation();
    return true;
  }

  function onSubmit(e){
    e.preventDefault();
    const btn = $("submitBtn");
    if(!btn || btn.disabled) return;
    if(nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()){
      const orig = btn.innerText;
      btn.innerText = "Submitted ✓";
      btn.disabled = true;
      setTimeout(()=>{ btn.innerText = orig; inputsValidation(); }, 1200);
    } else {
      inputsValidation();
    }
  }

  if(!setup()){
    const obs = new MutationObserver((mut, ob)=>{ if(setup()) ob.disconnect(); });
    obs.observe(document.body, { childList:true, subtree:true });
  }
}

initContactValidation();
