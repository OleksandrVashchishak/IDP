import Head from 'next/head'
import Link from "next/link";

export const Header = () => {
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <div className="header__container">
                <header className="header">
                    <div className="header__logo">
                        <Link href='/'>
                            Logo
                            </Link>
                    </div>

                    <ul className="header__menu">
                        <li className="header_list">
                            <Link href='/team' className="header_link">Our Team</Link>
                        </li>
                    </ul>
                </header>
            </div>
        </>
    )
}