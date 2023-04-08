import { Rule } from 'antd/es/form';

export const email: Rule[] = [{ type: 'email', message: 'The Email is invalid' }];
export const number: Rule[] = [{ pattern: /^[0-9]+$/, message: 'The field should contain only numbers' }];
export const required: Rule[] = [{ required: true, message: 'The field is required' }];
export const greaterFive: Rule[] = [{ pattern: /([5-9]|\d{2,})/, message: 'Time must be greater than 5' }];
export const minThreeSymbols: Rule[] = [{ min: 3, message: 'The field must be at least 3 characters' }];
export const minSixSymbols: Rule[] = [{ min: 6, message: 'The field must be at least 6 characters' }];
export const noWhiteSpacesNSpecChars: Rule[] = [{
  pattern: /^[A-Za-z0-9._@-]+$/,
  message: 'The field cannot contain white spaces or special characters',
}];
export const noWhiteSpaces: Rule[] = [{ pattern: /^\S+/g, message: 'This field cannot contain white spaces' }];

export const login: Rule[] = [...minThreeSymbols, ...required, ...noWhiteSpacesNSpecChars];
export const password: Rule[] = [...required, ...minSixSymbols, ...noWhiteSpaces];
