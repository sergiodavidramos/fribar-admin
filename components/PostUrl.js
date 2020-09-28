export function PostUrl(url, data, signOut, token) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  //     .then((res) => {
  //       if (res.status === 401) signOut()
  //       return res.json()
  //     })
  //     .then((response) => (r = response))
  //     .catch((error) => (r = false))
  //   return r
}

export const PostImg = () => {}
