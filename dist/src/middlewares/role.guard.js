export const roleGuard = (rolesAllowed) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }
        if (!rolesAllowed.includes(user.rol)) {
            return res.status(403).json({ ok: false, message: "Access denied" });
        }
        next();
    };
};
