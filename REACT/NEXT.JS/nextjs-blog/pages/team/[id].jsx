import { Header } from "../../components/Header/Header";

export default function User({ user }) {
    return (
        <>
            <Header />
            <div className="sub-header__bg user-page">
                {user && <div className="container">
                    <div className="user-page__avatar"><i> {user.name.split('')[0]}</i></div>
                    <h4 className="user-page__info">Name: {user.name}</h4>
                    <h6 className="user-page__info">Email: {user.email}</h6>
                    <h6 className="user-page__info">Phone: {user.phone}</h6>
                    <h6 className="user-page__info">Site: {user.website}</h6>
                    <h6 className="user-page__info">Company: {user.company.name}</h6>
                    <h6 className="user-page__info">Address: {`${user.address.city} ${user.address.street} ${user.address.suite}`}</h6>
                </div>}
                {user && <div className="container">
                    <h3>User not found!</h3>
                </div>}
            </div>
        </>
    )
};

export async function getServerSideProps({ params }) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`)
    const user = await response.json()
    return {
        props: { user },
    }
}
