import React, {Suspense} from "react";

export const Login = React.lazy(() =>
    import(
            './login'
        )
)

export const LoginPage = () => {
    return (<Suspense>
        <Login />
    </Suspense>)
}