const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver,
      content
    });

    await message.save();
    await message.populate('sender', 'name email');
    await message.populate('receiver', 'name email');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    const conversations = {};
    messages.forEach(msg => {
      const otherUserId = msg.sender._id.toString() === currentUserId.toString() 
        ? msg.receiver._id.toString() 
        : msg.sender._id.toString();
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user: msg.sender._id.toString() === currentUserId.toString() ? msg.receiver : msg.sender,
          lastMessage: msg
        };
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };
