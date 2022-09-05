const mongoose = require("mongoose");
const mongoose = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name."]
    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email."]
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Please provide a password."],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password."],
        validate: {
            // THIS ONLY WORKS ON SAVE !!!
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords are not the same."
        }
    }
});


// MONGOOSE MIDDLEWARE TO HASH PASSWORD BEFORE SAVING IT TO DB
userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) {
        return next();
    };

    // HASHING PASSWORD WITH COST OF 12
    this.password = await bcrypt.hash(this.password, 12);

    // DELETE passwordConfirm FIELD. WE DON'T NEED THIS IN THE DB.
    this.passwordConfirm = undefined;
    
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

