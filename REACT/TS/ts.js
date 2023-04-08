//== VARIABLES ==//
let bool: boolean = false
let num: number = 22
let str: string = 'hello'
let notShure: any = true
const arr1:Array<number> = [1, 2, 3]
const arr2:Array<string> = ['ww', 'ss', 'aa']

const empty = (): void => {
    // nothing no do
}

//== ENUM == //
enum Directions {
    Up = 'press W',
    Down  = 'press S',
    Left = 'press A',
    Right  = 'press D'
}

//== FUNCTIONS ==//
const createPass = (name:string = 'test', age:number | string = 123, ...rest:Array<number>):string => `${name}${age}${rest.toString()}`

//== OBJECTS ==//

type Persone = {
    name: string,
    age: number,
    email: string ,
    isAdmin?: boolean,
    getPass?: () => string
}

const user:Persone = {
    name: 'Alex',
    age: 25,
    email: 'test',
    getPass() : string {
        return 'pass'
    }
}

const admin:Persone = {
    name: 'Alex',
    age: 25,
    email: 'test',
    isAdmin: true
}

//== INTERFACE ==//

interface Persone {
    readonly name: string,
    age: number,
    email: string,
    isAdmin?: boolean,
    getPass?: () => string,
    [propName: string]: any
}

interface PersoneTest extends Persone {
    readonly testing: string,

}

const user: Persone = {
    name: 'Alex',
    age: 25,
    email: 'test',
    getPass(): string {
        return 'pass'
    }
}

const admin: PersoneTest = {
    name: 'Alex',
    age: 25,
    email: 'test',
    isAdmin: true,
    testing: '213'

}