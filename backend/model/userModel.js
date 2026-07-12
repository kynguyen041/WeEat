const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Please provide phone number"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],

      validate: {
        validator: function (el) {
          return el === this.password;
        },

        message: "Passwords are not the same",
      },
    },

    role: {
      type: String,
      enum: ["customer", "driver", "admin", "merchant"],
      default: "customer",
    },

    avatar: {
      type: String,
      default: "default-avatar.png",
    },

    addresses: [
      {
        label: {
          type: String,
          enum: ["home", "work", "other"],
          default: "home",
        },

        addressLine: String,

        city: String,

        district: String,

        ward: String,

        coordinates: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },

          coordinates: {
            type: [Number], // [longitude, latitude]
          },
        },

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
});

userSchema.pre(/^find/, function () {
  this.find({ isActive: { $ne: false } });
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
