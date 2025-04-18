import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routesConfig from "./routesConfig.tsx";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./redux/store.ts";
import {AppWrapper} from "./App.styles.ts";

const router = createBrowserRouter(routesConfig)

function init() {
  const container = document.querySelector('#app')
  if (container) {
    const root = createRoot(container)
    root.render(<Provider store={store}>
      <AppWrapper>
        <RouterProvider router={router} />
      </AppWrapper>
    </Provider>)
  } else {
    throw Error('Target container is not DOM element')
  }

}

init()
