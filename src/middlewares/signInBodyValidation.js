import { userCollection, sessionUser } from "../database/db.js";
import bcrypt from "bcrypt";


export async function signInBodyValidation(req, res, next){
    const {email, password} = req.body;

    const userExists = await userCollection.findOne({ email });

    if (!userExists) {
        return res.status(409).send({ message: "Esse email não existe" });
    }
   
    const verifiedPassword = bcrypt.compareSync(password, userExists.password);

    if (!verifiedPassword) {
        return res.status(409).send({ message: "Senha incorreta" });
    }

    const loggedUser = await sessionUser.findOne({ userId: userExists._id });

    if (loggedUser) {
        return res.status(409).send({ message: "Você já está logado, sai para logar novamente" });
    }

    next();
}