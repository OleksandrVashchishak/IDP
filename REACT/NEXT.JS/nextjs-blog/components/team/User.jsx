export const User = ({ user }) => {
    return (
        <>
            {user && <div className="user">
                <div className="user__avatar"><i> {user.name.split('')[0]}</i></div>
                <h4 className="user__name">{user.name}</h4>
                <h6 className="user__email">{user.email}</h6>
            </div>}
        </>
    )
}    