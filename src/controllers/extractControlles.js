import { sessionUser, walletUser } from "../database/db.js";
import { schemaTransactions } from "../models/schemaTransactions.js";
import dayjs from "dayjs";

export async function transactions(req, res) {
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
    }

    try {
        walletUser.insertOne(action);
        console.log(action);
        res.status(201).send("Transação feita com sucesso");
    } catch (error) {
        console.log(error)
        res.status(401).send("Id do usuario não encontrado")
    }

}

export async function account(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).send("Token de acesso não encontrado");
        return
    };

    const sessionExist = await sessionUser.findOne({ token });

    if (!sessionExist) {
        res.status(401).send("Sessão não encontrada");
        return;
    }

    const accountExist = await walletUser.find({
        userId: sessionExist.userId
    }).toArray();

    if (accountExist) {
        res.send(accountExist)
        return;
    }

    else {
        res.status(401).send("Conta não encontrada");
        return;
    }
}