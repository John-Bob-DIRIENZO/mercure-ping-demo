export default function useBackendMessage() {
  return function (toUserId, messageContent) {
    console.log(messageContent);
    return fetch(`http://localhost:8245/send-message/${toUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: messageContent,
      }),
    })
      .then((data) => data.json())
      .then((data) => data.message);
  };
}
