const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(document, returnedObject) {
        delete returnedObject.password;
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  if (/^\$2[aby]\$\d{2}\$/.test(this.password)) return;
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);
