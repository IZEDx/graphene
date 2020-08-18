import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import { passwordMask } from "../models/scalars/Password";

const letters = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789";
const specialChars = "!\"§$%&/()=?`{[]}\\´+-.,;:_'*<>|°^~";

@ValidatorConstraint({ name: "safePassword", async: false })
export class SafePassword implements ValidatorConstraintInterface 
{
    length = false;
    lowerCase = false;
    upperCase = false;
    digit = false;
    specialChar = false;

    validate(pw: string, args: ValidationArguments) 
    {
        this.length = pw.length >= 8 && pw.length <= 32;
        this.lowerCase = letters.toLowerCase().split("").find(letter => pw.includes(letter)) !== undefined;
        this.upperCase = letters.toUpperCase().split("").find(letter => pw.includes(letter)) !== undefined;
        this.digit = digits.split("").find(digit => pw.includes(digit)) !== undefined;
        this.specialChar = specialChars.split("").find(char => pw.includes(char)) !== undefined;

        return pw === passwordMask || (this.length && this.lowerCase && this.upperCase && this.digit && this.specialChar);
    }

    defaultMessage(args: ValidationArguments) 
    {
        if (!this.length)       return "Password is too short or too long!";
        if (!this.lowerCase)    return "Password must contain a lowecase letter!";
        if (!this.upperCase)    return "Password must contain an uppercase letter!";
        if (!this.digit)        return "Password must contain a digit!";
        if (!this.specialChar)  return "Password must contain a special character!";
        return "Something went wrong!";
    }

}