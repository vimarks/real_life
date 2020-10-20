import * as Cookie from "./cookie-functions.js";

const connection = new WebSocket(`ws://${window.location.host}/messages`);

connection.onopen = () => {
  console.log("connected!");
};

connection.onclose = () => {
  console.error("disconnected!");
};

connection.onerror = error => {
  console.error("failed to connect :", error);
};

connection.onmessage = event => {
  console.log("received", event.data);
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let tr = document.createElement("tr");
  let message = event.data.substr(event.data.indexOf(" ") + 1);
  let displayName = event.data.match(/\w+ /);
  // let message = event.data.match(/ .+$/);

  // tr.classList.add("messageTr");
  td1.innerText = displayName;
  td2.innerText = message;
  td1.classList.add("displayNameTd");
  td2.classList.add("messageTd");
  document.getElementById("chat").append(tr);
  tr.append(td1);
  tr.append(td2);
};

console.log("chatroomForm", document.getElementById("chatroomForm"));
document.getElementById("chatroomForm").addEventListener("submit", event => {
  event.preventDefault();
  let message = document.querySelector("#message").value;
  connection.send(` ${message}`);
  document.querySelector("#message").value = "";
});
