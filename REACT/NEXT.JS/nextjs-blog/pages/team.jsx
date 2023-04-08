import { Header } from "../components/Header/Header";
import Link from "next/link";
import { User } from "../components/team/user";

const team = ({ users }) => {
    return (
        <>
            <Header />
            <div className="sub-header__bg team-page">
                <div className="container">
                    <h2>Our team</h2>
                    <div className="team-page__users">
                        {users.map(user =>
                            <Link href={`/team/${user.id}`} key={user.id} className="user__link">
                                <User user={user} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default team;

export async function getStaticProps(context) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`)
    const users = await response.json()

    return {
        props: { users }, // will be passed to the page component as props
    }
}
