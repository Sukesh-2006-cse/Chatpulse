# Real-Time Chat Application

A real-time chat app supporting 1-to-1 private messaging and group chats using Socket.IO, Node.js, Express, and MongoDB Atlas.

---

## Features

- Real-time messaging with Socket.IO  
- 1-to-1 private chat  
- Group chat support  
- User sidebar with chat history  
- Responsive UI with CSS media queries  
- Persistent storage using MongoDB Atlas  
- Message alignment: own messages on right, others on left  

---

## Technologies Used

- Node.js + Express (Backend)  
- Socket.IO (Real-time communication)  
- MongoDB Atlas (Cloud database)  
- HTML, CSS, JavaScript (Frontend)  

---

## Project Folder Structure
chat-app/
│
├── models/
│ ├── Message.js
│ └── User.js
│
├── public/
│ ├── index.html
│ ├── style.css
│ ├── chat.html
│ ├── chat.js
│ └── chat.css
│
└── server.js
---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
Install dependencies

bash
Copy
Edit
npm install
Configure environment variables

Create a .env file in the root folder with your MongoDB Atlas connection string:

env
Copy
Edit
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
Run the server

bash
Copy
Edit
node server.js
Open the app

Go to http://localhost:3000 in your browser.

