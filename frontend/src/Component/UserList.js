import { useEffect, useState } from "react";
import useGetUserList from "../Hook/useGetUserList";
import useBackendPing from "../Hook/useBackendPing";
import useBackendMessage from "../Hook/useBackendMessage";
import User from "./User";
import { Link } from "react-router-dom";

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [isOpen, setIsOpen] = useState({});
  const [sentMessages, setSentMessages] = useState({});
  const getUserList = useGetUserList();
  const backendPing = useBackendPing();
  const backendMessage = useBackendMessage();

  const currentUser = sessionStorage.getItem("user");

  const submitMessagePrivate = async (e) => {
    const message = e.target[0].value;
    const userId = e.target[0].dataset.userid;
    const data = { message: message, user: currentUser };
    backendMessage(userId, data).then((data) => {
      setSentMessages((prevMessages) => ({
        ...prevMessages,
        [userId]: [
          ...(prevMessages[userId] || []),
          { user: currentUser, message },
        ],
      }));
    });

    e.preventDefault();
  };

  const handleClick = (userId) => {
    backendPing(userId).then((data) => console.log(data));

    setIsOpen((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const handleMessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.content) {
      const userIdMatch = userList.find(
        (user) => user.username === data.content.message.user
      );
      console.log("out", userIdMatch);

      if (userIdMatch) {
        console.log("int", userIdMatch);
        setSentMessages((prevMessages) => ({
          ...prevMessages,
          [userIdMatch.id]: [
            ...(prevMessages[userIdMatch.id] || []),
            {
              user: data.content.message.user,
              message: data.content.message.message,
            },
          ],
        }));
      }
    } else {
      console.log("ping");

      const userName = data.user;
      document
        .querySelector("h1")
        .insertAdjacentHTML(
          "afterend",
          `<div class="alert alert-success w-75 mx-auto">Ping ${userName}</div>`
        );
      window.setTimeout(() => {
        const $alert = document.querySelector(".alert");
        $alert.parentNode.removeChild($alert);
      }, 2000);
    }
  };

  useEffect(() => {
    getUserList().then((data) => {
      const userListArray = Object.values(data.users);
      const filteredUserList = userListArray.filter(
        (user) => user.username !== currentUser
      );

      setUserList(filteredUserList);
    });
    const url = new URL("http://localhost:9090/.well-known/mercure");
    url.searchParams.append("topic", "https://example.com/my-private-topic");

    const eventSource = new EventSource(url, { withCredentials: true });
    eventSource.onmessage = handleMessage;

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="w-100 d-flex">
      <div className="w-75">
        <h1 className="m-5 text-center">Hello {currentUser}</h1>
        {userList.map((user) => (
          <div key={user.id}>
            <User
              user={user}
              handleClick={handleClick}
              isOpen={isOpen}
              submitMessagePrivate={submitMessagePrivate}
            />
            {sentMessages[user.id] && (
              <div className="m-5 text-center">
                {sentMessages[user.id].map((messageObj, index) => (
                  <span key={index}>
                    {messageObj.user}: {messageObj.message}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* <div>
        <Link to="/all">
          <button>Chat All Page</button>
        </Link>
      </div> */}
    </div>
  );
}
