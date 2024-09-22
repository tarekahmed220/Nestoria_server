import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Workshop name is required"],
    unique: true,
    trim: true,
    minlength: [3, "Workshop name must be at least 3 characters long"],
    maxlength: [100, "Workshop name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Workshop description is required"],
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  location: {
    type: String,
    required: [true, "Workshop location is required"],
    trim: true,
  },
  contactEmail: {
    type: String,
    required: [true, "Contact email is required"],
    match: [/.+@.+\..+/, "Please provide a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be 10 digits long"],
  },
});

const Workshop = mongoose.model("Workshop", workshopSchema);

export default Workshop;