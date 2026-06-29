export function sanitizeUser(user){
    const {password:_, ...safeUser} = user;
    return safeUser;
}