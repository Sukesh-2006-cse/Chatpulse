const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Message = require('./models/Message');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const groups = ['General', 'Developers', 'Random']; 

const SECRET_KEY = 'mySuperSecretKey';
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://sukesh_2006:tU3FY7_zzRRPPdM@cluster0.lg2htpb.mongodb.net/loginDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB Atlas connection error:', err));

app.post('/api/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email || '',
      password: hashedPassword,
      type: 'register'
    });
    await user.save();
    res.status(200).json({ message: 'Registration info saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: `Welcome ${decoded.username}, this is protected data.` });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

const users = {}; 
const onlineUsers = {}; 

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('join group', (groupName) => {
    socket.join(groupName);
    console.log(`${users[socket.id]} joined group: ${groupName}`);
  });
  socket.on('group message', async ({ group, content }) => {
    const from = users[socket.id];
  
    const newMsg = new Message({ sender: from, receiver: group, content });
    await newMsg.save();
  
    io.to(group).emit('group message', { from, group, content });
  });
  socket.on('load group messages', async ({ group }) => {
    const messages = await Message.find({ receiver: group }).sort({ timestamp: 1 });
  
    socket.emit('group chat history', messages);
  });
    

  socket.on('set username', (username) => {
    users[socket.id] = username;
    onlineUsers[username] = socket.id;
    socket.username = username;
    console.log(`User set username: ${username}`);
  });

  socket.on('chat message', async (message) => {
    const sender = socket.username;
    const content = message;

    const newMsg = new Message({ sender, receiver: 'public', content });
    await newMsg.save();

    io.emit('chat message', {
      username: sender,
      message: content
    });
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log('A user disconnected');
    delete users[socket.id];
    delete onlineUsers[username];
  });
});

http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
