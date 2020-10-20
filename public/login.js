document.getElementById("transformer").addEventListener("click", event => {
  event.preventDefault();
  let landingForm = document.getElementById("landingForm");
  let title = document.getElementById("title").innerHTML;
  let transformer = document.getElementById("transformer").innerHTML;

  let displayNameInput = document.createElement("input");

  displayNameInput.name = "displayName";
  displayNameInput.placeholder = "Display Name";
  displayNameInput.size = "30";
  displayNameInput.type = "text";
  displayNameInput.required = "required";

  let formAction = document.getElementById("landingForm").action;
  let submit = document.getElementById("landingSubmit");
  if (title == "Login") document.getElementById("title").innerHTML = "Sign Up";
  else document.getElementById("title").innerHTML = "Login";

  if (transformer == "new? click to Sign Up")
    document.getElementById("transformer").innerHTML = "back to Login";
  else
    document.getElementById("transformer").innerHTML = "new? click to Sign Up";

  if (landingForm.childNodes.length == 9) {
    landingForm.insertBefore(displayNameInput, submit);

    let br = document.createElement("br");
    landingForm.insertBefore(br, landingForm.childNodes[8]);
  } else {
    landingForm.childNodes[7].remove();
    landingForm.childNodes[6].remove();
  }

  if (submit.value == "Login")
    document.getElementById("landingSubmit").value = "Sign Up";
  else document.getElementById("landingSubmit").value = "Login";

  if (formAction == `http://${window.location.host}/login`) {
    document.getElementById(
      "landingForm"
    ).action = `http://${window.location.host}/signup`;
    document.getElementById("landingForm").name = "signupForm";
    document.getElementById("formBody").classList.add("signupTransition");
  } else {
    document.getElementById(
      "landingForm"
    ).action = `http://${window.location.host}/login`;
    document.getElementById("landingForm").name = "loginForm";
  }
});
