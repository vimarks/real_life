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
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let tr = document.createElement("tr");

  let message = event.data.substr(event.data.indexOf(" ") + 1);
  if (/^http:\/\/key-race\.com/.test(message)) {
    let a = document.createElement("a");
    a.href = message;
    a.innerText = message;
    a.target = "_blank";
    td2.append(a);
    td2.classList.add("linkTd");
  } else {
    td2.innerText = message;
    td2.classList.add("messageTd");
  }

  let displayName = event.data.match(/\w+ /);
  td1.innerText = displayName;

  td1.classList.add("displayNameTd");

  document.getElementById("chat").append(tr);
  tr.append(td1);
  tr.append(td2);
};

document.getElementById("chatroomForm").addEventListener("submit", event => {
  event.preventDefault();
  let message = document.querySelector("#message").value;
  connection.send(` ${message}`);
  document.querySelector("#message").value = "";
});

document.getElementById("getLink").addEventListener("click", event => {
  event.preventDefault();
  console.log("link request hit");
  connection.send(`typing link request`);
});
