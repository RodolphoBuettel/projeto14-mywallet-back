import { sessionUser, walletUser } from "../database/db.js";

export async function transactions(req, res) {
  
    try {
        walletUser.insertOne(req.action);
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