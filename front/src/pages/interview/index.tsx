import React, {Suspense} from "react";

export const Interview = React.lazy(() =>
    import(
            './interview'
        )
)

export const InterviewPage = () => {
    return (<Suspense>
        <Interview />
    </Suspense>)
}