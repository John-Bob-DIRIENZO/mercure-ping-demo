// import { useEffect, useState } from "react";
// import useBackendMessageToAll from "../Hook/useBackendMessageToAll";
// import { Link } from "react-router-dom";

// export default function UserList() {
//   const [userList, setUserList] = useState([]);
//   const [sentMessages, setSentMessages] = useState({});
//   const backendMessageAll = useBackendMessageToAll();

//   const currentUser = sessionStorage.getItem("user");

//   const submitMessageAll = async (e) => {
//     const message = e.target[0].value;
//     const userId = e.target[0].dataset.userid;
//     const data = { message: message, user: currentUser };
//     backendMessageAll(userId, data).then((data) => {
//       console.log(data);
//       setSentMessages((prevMessages) => ({
//         ...prevMessages,
//         [userId]: [
//           ...(prevMessages[userId] || []),
//           { user: currentUser, message },
//         ],
//       }));
//     });

//     e.preventDefault();
//   };

//   const HandleMessageAll = (e) => {
//     console.log(e);
//     const data = JSON.parse(e.data);
//     if (data.content) {
//       const userIdMatch = userList.find(
//         (user) => user.username === data.content.message.user
//       );
//       if (userIdMatch) {
//         console.log("int", userIdMatch);
//         setSentMessages((prevMessages) => ({
//           ...prevMessages,
//           [userIdMatch.id]: [
//             ...(prevMessages[userIdMatch.id] || []),
//             {
//               user: data.content.message.user,
//               message: data.content.message.message,
//             },
//           ],
//         }));
//       }
//     } else {
//       console.log("ping");

//       const userName = data.user;
//       document
//         .querySelector("h1")
//         .insertAdjacentHTML(
//           "afterend",
//           `<div class="alert alert-success w-75 mx-auto">Ping ${userName}</div>`
//         );
//       window.setTimeout(() => {
//         const $alert = document.querySelector(".alert");
//         $alert.parentNode.removeChild($alert);
//       }, 2000);
//     }
//   };

//   useEffect(() => {
//     const url = new URL("http://localhost:9090/.well-known/mercure");
//     url.searchParams.append("topic", "https://example.com/my-public-topic");

//     const eventSource = new EventSource(url, { withCredentials: true });
//     eventSource.onmessage = submitMessageAll;

//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   return (
//     <div className="w-75">
//       <div>
//         <Link to="/">
//           <button>Back</button>
//         </Link>
//       </div>
//       <h1 className="m-5 text-center">Chat Général</h1>
//       {userList.map((user) => (
//         <div key={user.id}>
//           {sentMessages[user.id] && (
//             <div className="m-5 text-center">
//               {sentMessages[user.id].map((messageObj, index) => (
//                 <span key={index}>
//                   {messageObj.user}: {messageObj.message}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//       <form
//         onSubmit={submitMessageAll}
//         className="d-flex flex-column w-75 h-50 input-group mx-auto"
//       >
//         <div className="d-flex">
//           <input
//             type="text"
//             class="form-control"
//             placeholder="Écrire un message"
//             aria-describedby="basic-addon2"
//           />
//           <div class="input-group-append">
//             <button class="btn btn-outline-secondary" type="submit">
//               Envoyé
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
