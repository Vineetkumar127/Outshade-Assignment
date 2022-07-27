const EventModel = require("../models/eventModel");
const validator = require("../validation/validator");

//---------------------------------------------------------------------------

const addNewEvent = async (req, res) => {
    try {
      if (!validator.isValidRequestBody(req.body))
        return res.status(400).send({status: false,message: "please provide event details", });
  
      let { creator, title, description, eventDate } = req.body;

      let { invitee, timings } = req.body.invitees[0];
  
      if (!validator.isValid(creator) && !validator.isValidObjectId(creator))
        return res.status(400).send({ status: false, message: "please provide creator id" });
  
      if (!validator.isValid(title))
        return res.status(400).send({ status: false, message: "please provide title" });
  
      if (!validator.isValid(description))
        return res.status(400).send({ status: false, message: "please provide description" });
  
      if (!validator.isValid(eventDate))
        return res.status(400).send({ status: false, message: "please provide event date" });
  
      if (!validator.isValidObjectId(invitee) && !validator.isValid(invitee))
        return res.status(400).send({ status: false, message: "please provide valid invite id" });
  
      if (!validator.isValid(timings))
        return res.status(400).send({ status: false, message: "please provide timings" });
  
      let newEvent = await EventModel.create(req.body);
      return res.status(201).send({ status: true, message: "event added successfully", data: newEvent });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  //
  
  const invite = async (req, res) => {
    try {
      let eventId = req.params.id;
      let eventFinder = await EventModel.findOne({ eventId });
  
      if (!eventFinder)
        return res.status(400).send({ status: false, message: "no such event is present" });
  
      let { invitee, timings } = req.body;
  
      if (!validator.isValidObjectId(invitee) && !validator.isValid(invitee))
        return res.status(400).send({ status: false, message: "please provide valid invite id" });
  
      if (!validator.isValid(timings))
        return res.status(400).send({ status: false, message: "please provide timings" });
  
      let invitation = await EventModel.findOneAndUpdate({ _id: req.params.id },{ $push: { invitees: { invitee: invitee, timings: timings } } },
        { new: true }
      );
  
      return res.status(200).send({ status: true, data: invitation });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  //
  
  const listEvents = async (req, res) => {
    try {
      let { date, name, sort } = req.query;
  
      if (date) {
        let dateFilter = await EventModel.findOne({ eventDate: date });
  
        if (dateFilter.length !== 0) {
          return res.status(200).send({status: true,message: "Successfully found",data: { dateFilter },});
        } else {
          return res.status(400).send({ status: false, message: `No event with ${date} found` });
        }
      }
      if (name) {
        let findName = await EventModel.find({ title: { $regex: name, $options: "i" }, });
  
        if (findName.length != 0) {
          return res.status(200).send({status: true,message: "Successfully found",data: { findName },});
        
        } else {
          return res.status(400).send({ status: false, message: `No event with ${name} found` });
        }
      }
  
      if (sort) {
        let findSort = await EventModel.find({}).sort({ title: sort });
  
        if (findSort.length != 0) {
          return res.status(200).send({status: true,message: "Successfully found",data: { findSort },});
        } else {
          return res.status(400).send({ status: false, message: `No products of size ${Size} found` });
        }
      }
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  //
  
  const updateEvent = async (req, res) => {
    try {
      if (!validator.isValidObjectId(req.params.id))
        return res.status(400).send({ status: false, message: "Invalid event id" });
  
      let findEvent = await EventModel.findOne({ _id: req.params.id });
  
      if (!findEvent)
        return res.status(400).send({ status: false, message: "event does not exits" });
  
      let { creator, title, description, eventDate } = req.body;
      let { invitee, timings } = req.body.invitees[0];
  
      if (!validator.isValidRequestBody(req.body))
        return res.status(400).send({status: false,message: "Invalid request parameters. Please provide event details.",});
  
      if (!validator.isValid(creator) && !validator.isValidObjectId(creator))
        return res.status(400).send({ status: false, message: "please provide creator id" });
  
      if (!validator.isValid(title))
        return res.status(400).send({ status: false, message: "please provide title" });
  
      if (!validator.isValid(description))
        return res.status(400).send({ status: false, message: "please provide description" });
  
      if (!validator.isValid(eventDate))
        return res.status(400).send({ status: false, message: "please provide event date" });
  
      if (!validator.isValidObjectId(invitee) && !validator.isValid(invitee))
        return res.status(400).send({ status: false, message: "please provide valid invite id" });
  
      if (!validator.isValid(timings))
        return res.status(400).send({ status: false, message: "please provide timings" });
  
      let data = await EventModel.findOneAndUpdate({ _id: req.params.id },{ $set: req.body },{ new: true } );
  
      return res.status(200).send({status: true,message: `successfully updated`,data: data,});
    
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  //
  
  const eventDetails = async (req, res) => {
    try {
      let eventId = req.params.id;
      let getEvents = await EventModel.findOne({ eventId });
  
      if (!getEvents)
        return res.status(400).send({ status: false, message: "no events found" });
  
      return res.status(200).send({ status: false, message: "events listed", data: getEvents });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  module.exports.addNewEvent =addNewEvent
  module.exports.invite =invite
  module.exports.listEvents =listEvents
  module.exports.updateEvent =updateEvent
  module.exports.eventDetails =eventDetails 