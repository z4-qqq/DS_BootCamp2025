import React, {Suspense} from "react";

export const Evaluate = React.lazy(() =>
    import(
            './evaluate'
        )
)

export const EvaluatePage = () => {
    return (<Suspense>
        <Evaluate />
    </Suspense>)
}