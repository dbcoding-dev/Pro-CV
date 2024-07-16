function selectPdf(element) {
  var allPdfs = document.getElementsByClassName("pdf-item");
  for (var i = 0; i < allPdfs.length; i++) {
    allPdfs[i].classList.remove("selected");
  }
  element.classList.add("selected");
  var selectedPdf = element.querySelector("a").getAttribute("href");
  console.log("Seçilen PDF: " + selectedPdf);
}
window.onload = function () {
  var div = document.getElementById("ac_mobile");
  div.style.display = "none";
};

function toggleVisibility() {
  var div = document.getElementById("ac_mobile");
  if (div.style.display === "none") {
    div.style.display = "flex";
  } else {
    div.style.display = "none";
  }
}
var currentStep = 0;
showStep(currentStep);

function showStep(n) {
  var steps = document.getElementsByClassName("step");
  var totalSteps = steps.length;
  for (var i = 0; i < totalSteps; i++) {
    steps[i].style.display = "none";
  }
  steps[n].style.display = "block";
  updateProgressBar(n);
}

function updateProgressBar(n) {
  var progressSteps = document.querySelectorAll(".progress-bar li");
  for (var i = 0; i < progressSteps.length; i++) {
    progressSteps[i].classList.remove("active", "completed");
    if (i < n) {
      progressSteps[i].classList.add("completed");
    }
  }
  progressSteps[n].classList.add("active");
}

function logFormData() {
  var currentStepInputs = document
    .querySelector(".step.active")
    .getElementsByTagName("input");
  var currentStepSelects = document
    .querySelector(".step.active")
    .getElementsByTagName("select");
  var currentStepTextareas = document
    .querySelector(".step.active")
    .getElementsByTagName("textarea");

  var formData = {};
  for (var i = 0; i < currentStepInputs.length; i++) {
    var input = currentStepInputs[i];
    formData[input.name || input.id || "input" + i] = input.value;
  }
  for (var j = 0; j < currentStepSelects.length; j++) {
    var select = currentStepSelects[j];
    formData[select.name || select.id || "select" + j] = select.value;
  }
  for (var k = 0; k < currentStepTextareas.length; k++) {
    var textarea = currentStepTextareas[k];
    formData[textarea.name || textarea.id || "textarea" + k] = textarea.value;
  }

  console.log("Form Verileri:", formData);
}

function nextStep() {
  var nameInput = document.getElementById("name");
  var surnameInput = document.getElementById("surname");
  var emailInput = document.getElementById("email");

  if (!nameInput.value.trim()) {
    nameInput.classList.add("error");
  } else {
    nameInput.classList.remove("error");
  }

  if (!surnameInput.value.trim()) {
    surnameInput.classList.add("error");
  } else {
    surnameInput.classList.remove("error");
  }

  if (!emailInput.value.trim()) {
    emailInput.classList.add("error");
  } else {
    emailInput.classList.remove("error");
  }

  if (
    !nameInput.value.trim() ||
    !surnameInput.value.trim() ||
    !emailInput.value.trim()
  ) {
    return;
  }

  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}
function nextStepWithLoading() {
  nextStep();
}

// İş Deneyimi

function toggleWorkExperience() {
  var container = document.getElementById("workExperienceContainer");
  var icon = document.getElementById("toggleIcon");

  if (container.style.display === "none") {
    container.style.display = "block";
    icon.innerText = "-";
  } else {
    container.style.display = "none";
    icon.innerText = "+";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("workExperienceContainer");

  if (container.childElementCount === 0) {
    addDefaultWorkExperience(container);
  }

  container.style.display = "none";
  loadWorkExperienceFromLocalStorage(container);
});

function addDefaultWorkExperience(container, index) {
  var defaultEntry = document.createElement("div");
  defaultEntry.classList.add("work-experience");
  defaultEntry.id =
    "experiences_" + index + "_" + Math.random().toString(36).substr(2, 9);

  var inputNames = ["jobTitle", "city", "employer", "startDate", "endDate"];
  var placeholders = [
    "İş Ünvanı",
    "Ülke/Şehir",
    "İşveren",
    "Başlangıç Tarihi",
    "Bitiş Tarihi",
    "Açıklama"
  ];

  inputNames.forEach(function (name, i) {
    var input = document.createElement("input");
    input.type = "text";
    input.name = "experiences[" + index + "][" + name + "]";
    input.placeholder = placeholders[i];
    defaultEntry.appendChild(input);
  });

  var text = 'Açıklama';
  var textarea = document.createElement("textarea");
  textarea.name = "experiences[" + index + "][description]";
  textarea.placeholder = text;
  defaultEntry.appendChild(textarea);

  var removeBtn = document.createElement("button");
  removeBtn.innerText = "Sil";
  removeBtn.setAttribute("onclick", "removeWorkExperience(this)");
  removeBtn.classList.add("remove-btn");
  defaultEntry.appendChild(removeBtn);

  container.appendChild(defaultEntry);
}

function addWorkExperience() {
  var container = document.getElementById("workExperienceContainer");
  var newIndex = container.children.length;
  addDefaultWorkExperience(container, newIndex);
  var newEntry = container.querySelector(".work-experience:last-child");
  container.appendChild(newEntry);
  saveWorkExperienceToLocalStorage(container);
}

function removeWorkExperience(button) {
  var entry = button.parentNode;
  var container = entry.parentNode;
  container.removeChild(entry);

  saveWorkExperienceToLocalStorage(container);
}

function saveWorkExperienceToLocalStorage(container) {
  localStorage.setItem("workExperienceData", container.innerHTML);
}

function loadWorkExperienceFromLocalStorage(container) {
  var savedData = localStorage.getItem("workExperienceData");
  if (savedData) {
    container.innerHTML = savedData;
  }
}

// Yetenekler

function toggleskills() {
  var container = document.getElementById("workskills");
  var icon = document.getElementById("togglead");

  if (container.style.display === "none") {
    container.style.display = "block";
    icon.innerText = "-";
    localStorage.setItem("skillsVisibility", "visible");
  } else {
    container.style.display = "none";
    icon.innerText = "+";
    localStorage.setItem("skillsVisibility", "hidden");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("workskills");
  var visibilityState = localStorage.getItem("skillsVisibility");
  if (visibilityState === "visible") {
    container.style.display = "block";
    document.getElementById("togglead").innerText = "-";
  } else {
    container.style.display = "none";
    document.getElementById("togglead").innerText = "+";
  }
});

function addskills() {
  var container = document.getElementById("workskills");
  if (container.childElementCount >= 7) {
    alert("En fazla 5 yetenek ekleyebilirsiniz.");
    return;
  }

  var newEntry = container.lastElementChild.cloneNode(true);
  newEntry.querySelector('input').value = ""; // Find the first input element and clear its value

  var existingRemoveBtn = newEntry.querySelector(".remove-btn");
  if (existingRemoveBtn) {
    existingRemoveBtn.parentNode.removeChild(existingRemoveBtn);
  }

  var removeBtn = document.createElement("button");
  removeBtn.innerText = "Sil";
  removeBtn.setAttribute("onclick", "removeSkill(this)");
  removeBtn.classList.add("remove-btn");

  newEntry.appendChild(removeBtn);
  container.appendChild(newEntry);

  saveSkillsToLocalStorage();
}

function removeSkill(button) {
  var entry = button.parentNode;
  var container = entry.parentNode;
  container.removeChild(entry);
  saveSkillsToLocalStorage();
}


// Languages

function togglelangs() {
  var container = document.getElementById("worklangs");
  var icon = document.getElementById("togglelang");

  if (container.style.display === "none") {
    container.style.display = "block";
    icon.innerText = "-";
    localStorage.setItem("langsVisibility", "visible");
  } else {
    container.style.display = "none";
    icon.innerText = "+";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("worklangs");
  container.style.display = "none";
});
function addlangs() {
  var container = document.getElementById("worklangs");
  if (container.childElementCount >= 7) {
    alert("En fazla 5 dil ekleyebilirsiniz.");
    return;
  }

  var newEntry = container.lastElementChild.cloneNode(true);
  newEntry.querySelector('input[name="langs[0][lang]"]').value = "";

  var existingRemoveBtn = newEntry.querySelector(".remove-btn");
  if (existingRemoveBtn) {
    existingRemoveBtn.parentNode.removeChild(existingRemoveBtn);
  }

  var removeBtn = document.createElement("button");
  removeBtn.innerText = "Sil";
  removeBtn.setAttribute("onclick", "removeLang(this)");
  removeBtn.classList.add("remove-btn");

  newEntry.appendChild(removeBtn);
  container.appendChild(newEntry);

  limitDisplayedItems(container, 7);

  saveLanguagesToLocalStorage();
}
function saveSkillsToLocalStorage() {
  var skillsInputs = document.querySelectorAll('input[name^="skilles"]');
  var skillsData = [];
  for (var i = 0; i < skillsInputs.length; i++) {
    skillsData.push(skillsInputs[i].value);
  }
  localStorage.setItem("skillsData", JSON.stringify(skillsData));
}
function saveLanguagesToLocalStorage() {
  var langsInputs = document.getElementsByName("langs[0][lang]");
  var langsData = [];
  for (var j = 0; j < Math.min(langsInputs.length, 5); j++) {
    langsData.push(langsInputs[j].value);
  }
  localStorage.setItem("langsData", JSON.stringify(langsData));
}
function removeLang(button) {
  var entry = button.parentNode;
  var container = entry.parentNode;
  container.removeChild(entry);
}


// About Karakter Sınırı
var isLimitExceeded = false;

function updateCharacterCount(textarea) {
  var characterCountElement = document.getElementById("characterCount");
  var currentCharacterCount = textarea.value.length;

  if (!isLimitExceeded) {
    if (currentCharacterCount >= 500) {
      characterCountElement.textContent = "500/500";
      characterCountElement.style.color = "red";
      isLimitExceeded = true;
      textarea.value = textarea.value.substring(0, 500);
    } else {
      characterCountElement.textContent = currentCharacterCount + "/500";
      characterCountElement.style.color = "black";
    }
  } else {
    isLimitExceeded = false;
    characterCountElement.textContent = currentCharacterCount + "/500";
    characterCountElement.style.color = "black";
  }
}

// Referance

function toggleReferanceExperience() {
  var container = document.getElementById("referanceExperienceContainer");
  var icon = document.getElementById("toggleAdds");

  if (container.style.display === "none") {
    container.style.display = "block";
    icon.innerText = "-";
  } else {
    container.style.display = "none";
    icon.innerText = "+";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("referanceExperienceContainer");
  if (container.childElementCount === 0) {
    addDefaultReferanceExperience(container);
  }
  container.style.display = "none";

  loadReferanceExperienceFromLocalStorage(container);
});

function addDefaultReferanceExperience(container, index) {
  var defaultEntry = document.createElement("div");
  defaultEntry.classList.add("work-experience");
  defaultEntry.id =
    "referance_" + index + "_" + Math.random().toString(36).substr(2, 9);

  var inputNames = ["jobTitle", "city", "employer"];
  var placeholders = [
    "İsim. Murat Alkan",
    "Pozisyon. Yazılım Uzmanı",
    "Telefon No. +90 555 555 55 55"
  ];

  inputNames.forEach(function (name, i) {
    var input = document.createElement("input");
    input.type = "text";
    input.name = "referance[" + index + "][" + name + "]";
    input.placeholder = placeholders[i];
    defaultEntry.appendChild(input);
  });

  var removeBtn = document.createElement("button");
  removeBtn.innerText = "Sil";
  removeBtn.setAttribute("onclick", "removeReferanceExperience(this)");
  removeBtn.classList.add("remove-btn");
  defaultEntry.appendChild(removeBtn);

  container.appendChild(defaultEntry);
}

function addReferanceExperience() {
  var container = document.getElementById("referanceExperienceContainer");

  if (container.children.length >= 3) {
    alert("En fazla 2 referans deneyimi ekleyebilirsiniz.");
    return;
  }

  var newIndex = container.children.length;
  addDefaultReferanceExperience(container, newIndex);
  console.log("Added referance experience entry:", newIndex);

  saveReferanceExperienceToLocalStorage(container);
}

function removeReferanceExperience(button) {
  var entry = button.parentNode;
  var container = entry.parentNode;
  container.removeChild(entry);

  saveReferanceExperienceToLocalStorage(container);
}

function saveReferanceExperienceToLocalStorage(container) {
  localStorage.setItem("referanceExperienceData", container.innerHTML);
}

function loadReferanceExperienceFromLocalStorage(container) {
  var savedData = localStorage.getItem("referanceExperienceData");
  if (savedData) {
    container.innerHTML = savedData;
  }
}

// Academic
function toggleAcademiExperience() {
  var container = document.getElementById("academiExperienceContainer");
  var icon = document.getElementById("academiIcon");

  if (container.style.display === "none") {
    container.style.display = "block";
    icon.innerText = "-";
  } else {
    container.style.display = "none";
    icon.innerText = "+";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("academiExperienceContainer");

  if (container.childElementCount === 0) {
    addDefaultWorkExperience(container);
  }

  container.style.display = "none";
  loadAcademiExperienceFromLocalStorage(container);
});

function addDefaultAcademiExperience(container, index) {
  var defaultEntry = document.createElement("div");
  defaultEntry.classList.add("academi-experience");
  defaultEntry.id =
    "academi_" + index + "_" + Math.random().toString(36).substr(2, 9);

  var inputNames = ["title", "lisans", "uni", "start", "end"];
  var placeholders = [
    'Okul, Üniversite İsmi',
    'Programı',
    'Lisans, Önlisans',
    'Başlangıç Tarihi',
    'Bitiş Tarihi',
    'Açıklama'
  ]


  inputNames.forEach(function (name, i) {
    var input = document.createElement("input");
    input.type = "text";
    input.name = "academi[" + index + "][" + name + "]";
    input.placeholder = placeholders[i];
    defaultEntry.appendChild(input);
  });
  var placse = 'Açıklama';
  var textarea = document.createElement("textarea");
  textarea.name = "academi[" + index + "][desc]";
  textarea.placeholder = placse;
  defaultEntry.appendChild(textarea);

  var removeBtn = document.createElement("button");
  removeBtn.innerText = "Sil";
  removeBtn.setAttribute("onclick", "removeAcademiExperience(this)");
  removeBtn.classList.add("remove-btn");
  defaultEntry.appendChild(removeBtn);

  container.appendChild(defaultEntry);
}

function addAcademiExperience() {
  var container = document.getElementById("academiExperienceContainer");
  var newIndex = container.children.length;
  addDefaultAcademiExperience(container, newIndex);
  var newEntry = container.querySelector(".academi-experience:last-child");
  container.appendChild(newEntry);
  saveAcademiExperienceToLocalStorage(container);
}

function removeAcademiExperience(button) {
  var entry = button.parentNode;
  var container = entry.parentNode;
  container.removeChild(entry);

  saveAcademiExperienceToLocalStorage(container);
}

function saveAcademiExperienceToLocalStorage(container) {
  localStorage.setItem("academiExperienceData", container.innerHTML);
}

function loadAcademiExperienceFromLocalStorage(container) {
  var savedData = localStorage.getItem("academiExperienceData");
  if (savedData) {
    container.innerHTML = savedData;
  }
}
