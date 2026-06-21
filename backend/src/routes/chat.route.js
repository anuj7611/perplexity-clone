import { Router } from "express";
import {
  getChats,
  getMessages,
  sendMessage,
  deleteChat,
} from "../controllers/chat.controller.js";
import { identifyUser } from "../middleware/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", identifyUser, sendMessage);

chatRouter.get("/getChats", identifyUser, getChats);

chatRouter.get("/:chatId/messages", identifyUser, getMessages);

chatRouter.delete("/delete/:chatId", identifyUser, deleteChat);

export default chatRouter;
