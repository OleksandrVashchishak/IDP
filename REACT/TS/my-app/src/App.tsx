import React from 'react';
import Counter from './components/Counter';


type headerProps = {
  title: string,
  year: number
}

const Header = ({ title, year }: headerProps) => {
  const [counter, setCounter] = React.useState(0)
  const clickHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
    setCounter(counter + 1)
  }

  return (
    <>
      <h1>{title}, {year}</h1>
      <h2>Click {counter}</h2>
      <button onClick={(e) => clickHandler(e)}>Click</button>
    </>
  )
}

const App: React.FC = () => {
  return (
    <>
      <Header title={'text'} year={1999} />
      {/* <Counter /> */}

    </>
  );
}

export default App;
