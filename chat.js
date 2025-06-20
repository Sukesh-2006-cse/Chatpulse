const socket = io();

const myUsername = prompt("Enter your name:");
socket.emit('set username', myUsername);

let currentGroup = "General";

socket.emit('join group', currentGroup);
socket.emit('load group messages', { group: currentGroup });

document.getElementById('groupSelector').addEventListener('change', function () {
  currentGroup = this.value;
  document.getElementById('messages').innerHTML = '';
  socket.emit('join group', currentGroup);
  socket.emit('load group messages', { group: currentGroup });
});

document.getElementById('chat-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('messageInput');
  const message = input.value.trim();

  if (message) {
    socket.emit('group message', { group: currentGroup, content: message });
    input.value = '';
  }
});

socket.on('group message', ({ from, group, content }) => {
  if (group !== currentGroup) return;

  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.classList.add(from === myUsername ? 'message-right' : 'message-left');
  msgDiv.innerHTML = `<strong>${from}:</strong> ${content}`;
  document.getElementById('messages').appendChild(msgDiv);

  const messagesDiv = document.getElementById('messages');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('group chat history', (messages) => {
  const messagesDiv = document.getElementById('messages');
  messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(msg.sender === myUsername ? 'message-right' : 'message-left');
    msgDiv.innerHTML = `<strong>${msg.sender}:</strong> ${msg.content}`;
    messagesDiv.appendChild(msgDiv);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

let currentChatUser = null;

socket.on('chat history', (messages) => {
  const messagesDiv = document.getElementById('messages');
  messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(msg.sender === myUsername ? 'message-right' : 'message-left');
    msgDiv.innerHTML = `<strong>${msg.sender}:</strong> ${msg.content}`;
    messagesDiv.appendChild(msgDiv);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
