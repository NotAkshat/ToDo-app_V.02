import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => { 
    const { username, password } = req.body
    
    const hashPassword = bcrypt.hashSync(password, 8)

    try {
        const user = await prisma.user.create({
            date: {
                username,
                password: hashPassword
            }
        })

        const defaultTodo = `Hello :) Add your first todo! `
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        // create a token 
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, { expiresIn: '24h'} )
        res.json({ token })
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503) 
    }
    
    
})

router.post('/login',async (req, res) => { 
    // we get their email, and we look up the password associated wiith that email in the distance

    // but we get it back and see it's encrypted, which means that we cannot compare it to the one the user just trying to login

    // so what we can do, is again, one way encrypt the password the user just entered
    const {username, password} = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        // if we cannot find a user associated with that useraname, return out from the function
        if (!users) {return res.status(404).send({message: "user not found"})}

        const passwordIsValid = bcrypt.compareSync(password, users.password)
        // if the password does not match, return out of the function 
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid Password" }) }

        // then we have a successful authentication
        const token = jwt.sign({ id: users.id}, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({token})
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503)
        
    }

})



export default router 


