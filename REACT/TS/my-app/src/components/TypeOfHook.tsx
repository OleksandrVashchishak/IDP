import React from 'react';


const Toh: React.FC = () => {
    //== Use state ==//
    type User = { name: string, age: number }

    const [t, setT] = React.useState<number>(0)
    const [q, setQ] = React.useState<number | undefined>(0)
    const [w, setW] = React.useState<Array<number>>([0, 1,])
    const [user, setUser] = React.useState<User>({ name: 'test', age: 12 })
    //== Use context ==//
    type IContext = { name: string, age: number }
    const ThemeContext = React.createContext<IContext>({
        name: 'test',
        age: 12
    })

    return (
        <h1>Hello</h1>
    );
}

export default Toh;
