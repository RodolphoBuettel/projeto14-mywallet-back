import express from "express";
import {MongoClient, ObjectId} from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import bcrypt from "bcrypt";
import {v4 as uuidV4} from 'uuid';

const userSchema = joi.object({
    name: joi.string().required().min(3).max(100), 
    email: joi.string().email().required(), 
    password: joi.string().required(), 
    confirmedPassword: joi.string().required()
});

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    console.log("MongoDB conected");
} catch (err) {
    console.log("Erro no mongo.conect", err.message);
}

const db = mongoClient.db("myWallet");
const userCollection = db.collection("users");

// ROTAS:

app.post("/sign-up", async (req, res) => {
    const user = req.body;

    if(user.password !== user.confirmedPassword){
        res.status(409).send({message: "Confirmação de senha está errada"})
        return;
    }

    try {
        const userExists = await userCollection.findOne({email: user.email});
        if (userExists) {
            return res.status(409).send({message: "Esse email já existe"});
        }

        const {error} = userSchema.validate(user, {abortEarly: false});

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).send(errors);
        }

        const hashPassword = bcrypt.hashSync(user.password, 10);

        const { confirmedPassword, ...rest} = user;

        await userCollection.insertOne({
            ... rest,
            password: hashPassword
        });
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(process.env.PORT, () => console.log(`Server running in port: ${
    process.env.PORT
}`));
