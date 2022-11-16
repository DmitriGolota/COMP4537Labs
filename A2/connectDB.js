const { mongoose, Schema } = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const pokeUser = require('./pokeUser.js');
require('dotenv').config();

const makeAdmin = async () => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, salt)
        const user = await pokeUser.create({ username: "admin", password: hashedPassword, email: "admin@gmail.com", isAdmin: true })
        const token = await jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        await pokeUser.findOneAndUpdate({ _id: user._id }, { token: token })
    } catch (error) {
        if (error.keyValue.username === "admin") {
            console.log("Admin already exists")
        } else {
            console.log(error)
        }
    }

}

const DB_LINK = process.env.DB_STRING;

const connectDB = async () => {
    try {
        const x = await mongoose.connect(DB_LINK, { dbName: 'A1-Pokedex' })
        console.log("Connected to db");
        mongoose.connection.db.collection("pokemons").deleteMany({});
        console.log("deleted all entries of pokemons db");
        await makeAdmin();
    } catch (error) {
        console.log('db error');
    }
}

module.exports = { connectDB }