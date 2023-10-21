import { useEffect, useState } from "react";
import useGetUserList from "../Hook/useGetUserList";
import useBackendPing from "../Hook/useBackendPing";

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [isOpen, setIsOpen] = useState({});
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const getUserList = useGetUserList();
  const backendPing = useBackendPing();

  const submitMessagePrivate = async (e) => {
    e.preventDefault();
    const userId = e.target[0].value;
    backendPing(userId).then((data) => console.log(data));

    try {
      let res = await fetch("", {
        method: "POST",
        body: JSON.stringify({
          user: user,
          message: message,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setUser("");
        setMessage("User created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitMessageAll = async (e) => {
    e.preventDefault();
    const userId = e.target[0].value;
    backendPing(userId).then((data) => console.log(data));

    try {
      let res = await fetch("", {
        method: "POST",
        body: JSON.stringify({
          user: user,
          message: message,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setUser("");
        setMessage("User created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (userId) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const handleMessage = (e) => {
    const data = JSON.parse(e.data);
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
    getUserList().then((data) => setUserList(data.users));

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
        <h1 className="m-5 text-center">Hello</h1>
        {userList.map((user) => (
          <div key={user.id} className="">
            <div className="w-75 mx-auto mb-3" onSubmit={submitMessagePrivate}>
              <button
                onClick={() => handleClick(user.id)}
                className="btn btn-dark w-100"
                type="submit"
                value={user.id}
              >
                {user.username}
              </button>

              {isOpen[user.id] ? (
                <div key={user.id}>
                  <form className="w-75 mx-auto mt-3" onSubmit={submitMessagePrivate}>
                    <div className="w-75 h-75 overflow-auto">{}</div>
                    <div class="input-group mb-3">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        class="form-control"
                        placeholder="Écrire un message"
                        aria-describedby="basic-addon2"
                      />
                      <div class="input-group-append">
                        <button type="submit" class="btn btn-outline-secondary">
                          Envoyé
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="w-50">
        <h1 className="m-5 text-center">Chat Général</h1>
        <form onSubmit={submitMessageAll} className="w-75 input-group mx-auto">
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
        </form>
      </div>
    </div>
  );
}
