import {
  generateChatTittle,
  generateResponse,
} from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;

  let tittle = null;
  let chat = null;

  if (!chatId) {
    tittle = await generateChatTittle(message);

    chat = await chatModel.create({
      user: req.user.id,
      tittle,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chatId });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });

  return res.status(201).json({
    tittle,
    chat,
    aiMessage,
  });
};

export const getChats = async (req, res) => {
  const user = req.user;

  const chats = await chatModel.find({ user: user.id });

  res.status(200).json({ message: "user chats fetched successfully", chats });
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({ message: "no chat found" });
  }

  const messages = await messageModel.find({ chat: chatId });

  res.status(200).json({ message: "messages fetched successfully", messages });
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  await messageModel.deleteMany({ chat: chatId });

  if (!chat) {
    return res.status(404).json({ message: "chat not found" });
  }

  return res.status(200).json({ message: "chat deleted successfully" });
};
