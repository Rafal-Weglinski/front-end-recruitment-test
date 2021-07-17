import "../css/app.css";

/////////////////////////////////
//Selectors
/////////////////////////////////
const firstName = document.getElementById("fname");
const lastName = document.getElementById("lname");
const email = document.getElementById("email");
const country = document.getElementById("country");
const postalCode = document.getElementById("zip");
const phoneNumber = document.getElementById("phone");
const ccNumber = document.getElementById("ccnumber");
const securityCode = document.getElementById("scode");
const expirationDate = document.getElementById("edate");
const submit = document.getElementById("submit");
const form = document.getElementById("form");
const inputsArr = [
  firstName,
  lastName,
  email,
  country,
  postalCode,
  phoneNumber,
  ccNumber,
  securityCode,
  expirationDate,
  submit,
];

/////////////////////////////////
//Functions
/////////////////////////////////

//ERROR TEXT HANDLING
function getFieldError(el) {
  const validity = el.validity;

  //VALID
  if (validity.valid) return true;

  //IF INPUT IS EMPTY
  if (validity.valueMissing) return "Please fill in the field";

  //INVALID EMAIL
  if (validity.typeMismatch && el.id === "email")
    return "Please use valid email address";

  //INPUT TOO SHORT
  if (validity.tooShort) return "Input is too short";

  //INPUT TOO LONG
  if (validity.tooLong) return "Input is too long";

  //MISMATCH THE PATERN - LETTERS
  if ((validity.patternMismatch && el.id === "fname") || el.id === "lname")
    return "Please use only letters";

  //MISMATCH THE PATERN - DATE
  if (validity.patternMismatch && el.id === "edate")
    return "Please use MM/YY format";

  //MISMATCH THE PATERN - NUMBERS
  if (validity.patternMismatch) return "Please use only numbers";

  //ELSE
  return "Invalid input";
}

//REMOVE ERROR (RESET)
function removeFieldError(field) {
  const errorText = field.nextElementSibling;
  //IF ERROR MESSAGE EXISTS REMOVE IT
  if (errorText !== null) {
    if (errorText.classList.contains("form-error-text")) {
      errorText.remove();
    }
  }
}

//CREATE NEW ERROR
function createFieldError(field, text) {
  //REMOVE OLD MESSAGE
  removeFieldError(field);

  //CREATE ELEMENT FOR MESSAGE
  const div = document.createElement("div");
  div.classList.add("form-error-text");
  div.innerText = text;
  //MAKE SURE THERE IS NO OTHER MESSAGE
  if (field.nextElementSibling === null) {
    //ADD MESSAGE TO USER VIEW
    field.parentElement.appendChild(div);
  }
  //ADD MESSAGE TO USER VIEW - CREDIT  CARD
  else {
    if (!field.nextElementSibling.classList.contains("form-error-text")) {
      field.parentElement.insertBefore(div, field.nextElementSibling);
    }
  }
}

//EDIT MESSAGE DISPLAY SETTINGS
function toggleErrorField(field, show) {
  const errorText = field.nextElementSibling;
  if (errorText !== null && errorText.classList.contains("form-error-text")) {
    errorText.style.display = show ? "block" : "none";
    errorText.setAttribute("aria-hidden", show);
  }
}

//MARK/UNMARK AS ERROR IF INVALID/VALID
function markFieldAsError(field, show) {
  if (show) {
    field.parentElement.classList.add("field-error");
    field.parentElement.classList.remove("field-correct");
  } else {
    field.parentElement.classList.remove("field-error");
    field.parentElement.classList.add("field-correct");
    toggleErrorField(field, false);
  }
}

/////////////////////////////////
//Disable default HTML validation
/////////////////////////////////
form.setAttribute("novalidate", true);

/////////////////////////////////
//JS Validation using Constraint validation API
/////////////////////////////////
//ADD EVENT LISTENERS ON INPUTS
inputsArr.forEach((input) =>
  input.addEventListener("input", (e) =>
    markFieldAsError(e.target, !e.target.checkValidity())
  )
);

//ADD EVENT LISTENERS ON SUBMIT
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let formHasErrors = false;

  inputsArr.forEach((el) => {
    removeFieldError(el);
    el.parentElement.classList.remove("field-error");

    if (!el.checkValidity()) {
      createFieldError(el, getFieldError(el));
      el.parentElement.classList.add("field-error");
      formHasErrors = true;
    }
  });
  //IF VALID SEND
  if (!formHasErrors) {
    e.target.submit();
  }
});
