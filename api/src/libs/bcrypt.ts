import bcrypt = require("bcryptjs");

export const hash = (value: string, salt: string|number = 8) => 
    new Promise<string>((res, rej) => 
        bcrypt.hash(value, salt, (err, result) => {
            if (err) rej(err);
            else res(result);
        })
    );

export const compare = (value: string, hash: string) => 
    new Promise<boolean>((res, rej) => 
        bcrypt.compare(value, hash, (err, result) => {
            if (err) rej(err);
            else res(result);
        })
    );