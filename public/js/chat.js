const socket = io();

const btn = document.querySelector("#btn");
const btn1 = document.querySelector("#btn1");

const chatbox = document.querySelector("#chatbox");
const chattingApp = document.querySelector(".chattingApp");
const userDetails = document.querySelector(".userDetails");
const username = document.querySelector("#username");
const msgList = document.querySelector(".msgList");
const activePeopleList = document.querySelector(".activePeopleList");

const joinSound = document.getElementById("joinSound");
const disconnectSound = document.getElementById("disconnectSound");

socket.on("Welcome", (msg) => {
  console.log(msg);
  socket.emit("thankyou", "Thank You for the welcome", (res) => {
    console.log(res.status);
  });
});

socket.on("msg", (msg) => {
  let text = msg.text.msg;
  let senderName = msg.senderName;

  let li = document.createElement("li");
  li.innerHTML = `<span class="chatItem">
    <span class="senderName">${senderName}</span>
    <span class="textDetails">${text}</span>
    </span>`;
  msgList.appendChild(li);
});

function updateActiveUsers(activeUsers) {
  activePeopleList.innerHTML = "";
  activeUsers.forEach((element) => {
    let item = document.createElement("div");
    item.innerText = element;
    activePeopleList.appendChild(item);
  });
}

socket.on("disconnectedUser", ({ username, activeUser }) => {
  console.log(`${username} has left the chat, current users: ${activeUser}`);
  updateActiveUsers(activeUser);
  disconnectSound.play();
});

socket.on("joinedChat", ({ username, activeUser }) => {
  console.log(`${username} has joined the chat, current users: ${activeUser}`);
  updateActiveUsers(activeUser);
  joinSound.play();
});

btn.addEventListener("click", (ev) => {
  //   console.log(chatbox.value);

  socket.emit(
    "chat",
    {
      msg: chatbox.value,
    },
    (res) => {
      console.log(res.status);
    }
  );
  chatbox.value = "";
});

btn1.addEventListener("click", (ev) => {
  socket.emit("saveuser", {
    username: username.value,
  });
  userDetails.classList.add("hide");
  chattingApp.classList.remove("hide");
  msgList.classList.remove("hide");
});

chattingApp.classList.add("hide");
msgList.classList.add("hide");

const showActivePeopleButton = document.getElementById("showActivePeople");
const activePeopleModal = document.getElementById("activePeopleModal");
const closeModalButton = document.querySelector(".modal-content .close");

showActivePeopleButton.addEventListener("click", () => {
  activePeopleModal.style.display = "block";
});

closeModalButton.addEventListener("click", () => {
  activePeopleModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == activePeopleModal) {
    activePeopleModal.style.display = "none";
  }
});
