import {v4 as uuidV4} from "uuid";
import bcrypt from "bcrypt";
import { userCollection, sessionUser } from "../database/db.js";

export async function signUp (req, res) {
    const user = req.body;

    try {
        const hashPassword = bcrypt.hashSync(user.password, 10);

        const { confirmedPassword, ...rest } = user;

        await userCollection.insertOne({
            ...rest,
            password: hashPassword
        });
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function signIn (req, res) {
    const { email } = req.body;

    const token = uuidV4();

    try {
        const userExists = await userCollection.findOne({ email });
        await sessionUser.insertOne({
            token,
            userId: userExists._id,
        });

        res.send({token:token, name:userExists.name});

    } catch (err) {
        console.log(err)
        res.sendStatus(401);
    }
}