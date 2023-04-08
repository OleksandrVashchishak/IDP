import { Hero } from './../components/Home/Hero';
import { Header } from './../components/Header/Header';
import { AboutUs } from '../components/Home/AboutUs';

export default function Home() {
  return (
    <div >
      <Header />
      <main>
        <Hero />
        <AboutUs />
      </main>
    </div> 
  )
}