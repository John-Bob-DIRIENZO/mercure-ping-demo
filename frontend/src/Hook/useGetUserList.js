export default function useGetUserList() {
  return async function () {
    return await fetch("http://localhost:8245/user-list", {
      method: "GET",
      mode: "cors",
    }).then((data) => data.json());
  };
}
