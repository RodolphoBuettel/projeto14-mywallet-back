import { userSchema } from "../models/schemaUser.js";
import { userCollection } from "../database/db.js";

export async function signUpBodyValidation(req, res, next) {
    const user = req.body;

    if (user.password !== user.confirmedPassword) {
        res.status(409).send({ message: "Confirmação de senha está errada" })
        return;
    }
    const userExists = await userCollection.findOne({ email: user.email });
    if (userExists) {
        return res.status(409).send({ message: "Esse email já existe" });
    }

    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
    }

    next();
}