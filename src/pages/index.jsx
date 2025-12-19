// import Layout from "./Header.jsx";

// import Home from "./Home";

// import Course from "./Course";

// import Upload from "./Upload";

// import Purchase from "./Purchase";

// import Assets from "./Assets";

// import AdminKofi from "./AdminKofi";
// import Signin from "./Signin.jsx";
// import Signup from "./Signup.jsx";

// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   useLocation,
// } from "react-router-dom";

// const PAGES = {
//   Home: Home,

//   Course: Course,

//   Upload: Upload,

//   Purchase: Purchase,

//   Assets: Assets,

//   AdminKofi: AdminKofi,
//   Signin: Signin,
//   Signup: Signup,
// };

// // function _getCurrentPage(url) {
// //   if (url.endsWith("/")) {
// //     url = url.slice(0, -1);
// //   }
// //   let urlLastPart = url.split("/").pop();
// //   if (urlLastPart.includes("?")) {
// //     urlLastPart = urlLastPart.split("?")[0];
// //   }

// //   const pageName = Object.keys(PAGES).find(
// //     (page) => page.toLowerCase() === urlLastPart.toLowerCase()
// //   );
// //   return pageName || Object.keys(PAGES)[0];
// // }

// // Create a wrapper component that uses useLocation inside the Router context
// function PagesContent() {
//   //   const location = useLocation();
//   //   const currentPage = _getCurrentPage(location.pathname);

//   return (
//     <Layout>
//       <Routes>
//         <Route path="/" element={<Home />} />

//         <Route path="/Home" element={<Home />} />

//         <Route path="/login" element={<Signin />} />
//         <Route path="/create-account" element={<Signup />} />
//         <Route path="/Course" element={<Course />} />

//         <Route path="/Upload" element={<Upload />} />

//         <Route path="/Purchase" element={<Purchase />} />

//         <Route path="/Assets" element={<Assets />} />

//         <Route path="/AdminKofi" element={<AdminKofi />} />
//       </Routes>
//     </Layout>
//   );
// }

// export default function Pages() {
//   return (
//     <Router>
//       <PagesContent />
//     </Router>
//   );
// }
