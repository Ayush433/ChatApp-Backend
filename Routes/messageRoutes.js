const express = require("express");
const router = require("./userRoutes");
const messageController = require("../Controller/messageController");

router.post("/api/conversation", messageController.messages);
router.get("/api/conversation/:userId", messageController.message);

module.exports = router;
