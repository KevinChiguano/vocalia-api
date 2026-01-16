import prisma from "@/config/prisma";
import * as argon2 from "argon2";
import { signToken } from "@/utils/jwt";
export const authService = {
    login: async (email, password) => {
        const user = await prisma.users.findUnique({
            where: { user_email: email },
            include: { roles: true },
        });
        if (!user)
            return null;
        if (!user.is_active)
            return null;
        const match = await argon2.verify(user.user_password, password);
        if (!match)
            return null;
        const token = signToken({
            id: Number(user.user_id),
            email: user.user_email,
            rol: user.roles.rol_name,
        });
        return {
            user: {
                id: user.user_id,
                name: user.user_name,
                email: user.user_email,
                isActive: user.is_active,
                rol: user.roles.rol_name,
            },
            token,
        };
    },
    me: async (userId) => {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            include: { roles: true },
        });
        if (!user || !user.is_active)
            return null;
        return {
            id: user.user_id,
            name: user.user_name,
            email: user.user_email,
            isActive: user.is_active,
            rol: user.roles.rol_name,
        };
    },
};
