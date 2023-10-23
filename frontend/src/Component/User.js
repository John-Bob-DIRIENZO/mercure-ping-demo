import React, { useState } from "react";

function User({ user, handleClick, isOpen, submitMessagePrivate }) {
  const [message, setMessage] = useState("");

  return (
    <div key={user.id} className="">
      <div className="w-75 mx-auto mb-3">
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
              <div className="w-75 h-75 overflow-auto"></div>
              <div class="input-group mb-3">
                <input
                  data-userid={user.id}
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
  );
}

export default User;
