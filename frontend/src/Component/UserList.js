import { useEffect, useState } from "react";
import useGetUserList from "../Hook/useGetUserList";
import useBackendPing from "../Hook/useBackendPing";
import useBackendMessage from "../Hook/useBackendMessage";
import User from "./User";

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [allMessage, setAllMssage] = useState([]);
  const [isOpen, setIsOpen] = useState({});
  const [sentMessages, setSentMessages] = useState({});
  const [senterMessages, setSenterMessages] = useState({});

  const getUserList = useGetUserList();
  const backendPing = useBackendPing();
  const backendMessage = useBackendMessage();
  const currentUser = sessionStorage.getItem("user");

  const submitMessagePrivate = async (e) => {
    const message = e.target[0].value;
    const userId = e.target[0].dataset.userid;
    const data = { message: message, user: currentUser };
    backendMessage(userId, data).then((data) => {
      setSenterMessages(currentUser);
      setSentMessages((prevMessages) => ({
        ...prevMessages,
        [userId]: [...(prevMessages[userId] || []), message],
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
      console.log(data.content.message.user);
      setSenterMessages(data.content.message.user);
      if (userIdMatch) {
        setSentMessages((prevMessages) => ({
          ...prevMessages,
          [userIdMatch.id]: [
            ...(prevMessages[userIdMatch.id] || []),
            data.content.message.message,
          ],
        }));
      }
    }
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
                {sentMessages[user.id].map((message, index) => (
                  <span key={index}>
                    {senterMessages}: {message}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* <div className="w-75">
        <h1 className="m-5 text-center">Chat Général</h1>
        <form
          onSubmit={submitMessageAll}
          className="d-flex flex-column w-75 h-50 input-group mx-auto"
        >
          <div className="overflow-auto w-100 h-75 p-3 border">
            {allMessage.map(
              (message,
              (user) => {
                <p>
                  {user} : {message}
                </p>;
              })
            )}
          </div>
          <div className="d-flex">
            <input
              type="text"
              class="form-control"
              placeholder="Écrire un message"
              aria-describedby="basic-addon2"
            />
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="submit">
                Envoyé
              </button>
            </div>
          </div>
        </form>
      </div> */}
    </div>
  );
}
