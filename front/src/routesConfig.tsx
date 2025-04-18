import {PATHS} from 'consts';
import {InterviewPage, LoginPage, MainPage, EvaluatePage} from "pages"

export default [
    {
        path: PATHS.LOGIN,
        element: <LoginPage />,
        children: []
    },
    {
        path: PATHS.INTERVIEW,
        element: <InterviewPage />,
    },
    {path: PATHS.MAIN,
    element: <MainPage />},
    {path: PATHS.EVALUATE,
    element: <EvaluatePage />}
];
