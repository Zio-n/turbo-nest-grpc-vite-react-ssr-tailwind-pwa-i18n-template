// import { useEffect, createContext } from 'react';
// import { Route, Routes } from "react-router-dom"
// import { DEV_MODE } from './global/frontend.settings';
// import Layout from "./components/Layout"
// import Home from "./components/Home";
// import Users from "./components/Users";

// import { ThemeProvider } from "./@/components/theme-provider"
// import {
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query'
// import { useTranslation } from 'react-i18next';
// import { AppContextType } from './global/contexts';

// type Props = {
//   assetMap?: {
//     'styles.css': string,
//     'main.js': string,
//     'manifest'?: string,
//     'vite-plugin-pwa:register-sw'?: string,
//     'additional-styles': string[],
//     'additional-jss': string[],
//     initialContentMap: {
//       'title': string,
//       'description'?: string,
//       'hello-message'?: string,
//     },
//     baseUrl: string,
//     initialI18nStore?: {},//to be used with the middleware
//     initialLanguage?: string,
//     clientFirstAcceptLanguage?: string

//   },

// }

// export const AppContext = createContext<AppContextType>(null);

// const App: React.FC<Props> = ({ assetMap }) =>  {
//   const { i18n } = useTranslation();

//   const changeI18nLanguageToClientPreferred = async () => {
//     if (i18n.language != assetMap?.clientFirstAcceptLanguage)
//       await i18n.changeLanguage(assetMap?.clientFirstAcceptLanguage);
//   }
//   useEffect(() => {
//     //check if assetMap sent in production mode; if not, redirect to a proper ssr endpoint.

//     if (!DEV_MODE) {
//       //attempt to change language here to locale
//       changeI18nLanguageToClientPreferred();
//       if (!assetMap) {
//         window.location.href = '/web'; //simulate a mouse click
//       }
//     }
//   })
//   const appBody = () => {
//   const baseUrl = "/v1";
//   //create a react query client at the top
//   // Create a client
//   const queryClient = new QueryClient()

//   return (
//     // Provide the client to your App
//     <QueryClientProvider client={queryClient}>
//       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//         <Routes>
//           <Route path={`${baseUrl}`} element={<Layout />}>
//             <Route index element={<Home />} />
//             <Route path="view-users" element={<Users />} />
//           </Route>
//         </Routes>
//       </ThemeProvider>
//     </QueryClientProvider>
//   )
// }

//   //Prepare extra css if any
//   const additionStyles = () => {
//     if (assetMap) {
//       let _additionStyles = assetMap['additional-styles'].map(
//         (additionalStyle) => {
//           return <link rel="stylesheet" href={additionalStyle} />
//         }
//       );
//       return _additionStyles;
//     }
//   }

//   //Prepare extra Jss if any
//   const additionalJss = () => {
//     if (assetMap) {
//       let _additionalJss = assetMap['additional-jss'].map(
//         (additionalJs) => {
//           return <script src={additionalJs} />
//         }
//       );
//       return _additionalJss;
//     }
//   }

//     //compose conditional output
//     const output = () => {
//       if (assetMap) { //send whole document if ssr
//         return (
//           <html>
//             <head>
//               <link rel="stylesheet" href={assetMap['styles.css']} />
//               {/* additional Styles if any */}
//               {additionStyles()}
              
//               {assetMap['manifest'] && <link rel="manifest" href={assetMap['manifest']}></link>}
//               {assetMap['vite-plugin-pwa:register-sw'] && <script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script>}
//               {assetMap.initialContentMap && <title>{assetMap.initialContentMap['title']}</title>}
//             </head>
//             {appBody()}
//             {/* additional Jss if any*/}
//             {additionalJss()}
//           </html>
//         )
//       } else {
//         return (
//           <>
//             {appBody()} //only the body in dev mode. CSS should be available at dev mode with createRoot
//           </>
//         )
//       }
//     }
//     return (
//       <>
//         {output()}
//       </>
//     )
// }

// // const UseParams: React.FC = () => {
// //   let { name } = useParams();
// //   return (
// //     <h3>Hello {name}</h3>
// //   );
// // }

// export default App

import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./components/Home";
import Users from "./components/Users";
import { ThemeProvider } from "@/components/theme-provider"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {
  const baseUrl = "/";
  //create a react query client at the top
  // Create a client
  const queryClient = new QueryClient()

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path={`${baseUrl}`} element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="view-users" element={<Users />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
