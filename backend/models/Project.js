const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ members: 1, createdAt: -1 });

module.exports = mongoose.model("Project", projectSchema);
