const express=require("express");
const router=express.Router();

const userController=require("../controllers/userController");
const evntController=require("../controllers/eventController");
const {authorization}=require("../middleware/auth");

// user APIs

router.post("/registerUser",userController.createUser);
router.post("/login",userController.login);
router.get("/logout",authorization,userController.logout);
router.patch("/changePassword/:userId",authorization,userController.changePassword);

// Events APIs
router.post("/addEvent",evntController.addNewEvent);
router.post("/inviteEvent/:id",evntController.invite);
router.get("/listEvent",evntController.listEvents);
router.patch("/changeEvent/:id",evntController.updateEvent);
router.get("/eventsDetails/:id",evntController.eventDetails);

module.exports=router;