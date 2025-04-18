import React, {Suspense} from "react";

export const Main = React.lazy(() =>
    import(
            './main'
        )
)

export const MainPage = () => {
    return (<Suspense>
        <Main />
    </Suspense>)
}