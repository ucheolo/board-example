import { PrismaClient } from "@prisma/client";
import { generateToken } from "../middleware/auth";


const prisma = new PrismaClient();

export const register = async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                nickname
            }
        });
    
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Register failed' }); 
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user)
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' }); 
    }
}
