import dayjs from "dayjs";
import { schemaTransactions } from "../models/schemaTransactions.js";
import { sessionUser } from "../database/db.js";

export default async function transactionsValidation(req, res, next){
    const { value, description, type } = req.body;

    const time = dayjs().locale("pt-br").format("DD/MM");

    const { error } = schemaTransactions.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const { authorization } = req.headers; 

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        res.status(401).send("Token de acesso não encontrado");
        return;
    };

    const userIdFind = await sessionUser.findOne({ token });

    const userId = userIdFind.userId;

    const action = {
        userId,
        value: `${+parseFloat(value).toFixed(2) }`,
        description,
        type,
        time
    };

    req.action = action;

    next();
}