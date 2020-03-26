//ZAPISUJĘ PROMISE W MEMOIZE W CELU UNIKNIĘCIA POWIELANIA TEGO SAMEGO REQUESTA
const memoize = (() => {
  const cache = new WeakMap();
  const memoize = method => {
    if (!cache.has(method)) {
      cache.set(method, method());
    }
    return cache.get(method);
  };

  return memoize;
})();

const task2 = (() => {
  const getJoinedData = async () => {
    let posts = await fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(data => data);

    let users = await fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => data);

    let DB = [];

    users.forEach(user => {
      user.posts = [];
      posts.forEach(post => {
        if (post.userId === user.id) user.posts = [...user.posts, post];
      });
      DB = [...DB, user];
    });
    return { DB, posts };
  };

  const countPostsForUser = ({ username, posts }) => {
    return `${username} napisał ${posts.length} postów`;
  };

  const getUniquePosts = posts => {
    let unique = [],
      nonuniqe = [];
    posts.forEach(({ title }) => {
      if (!unique.includes(title)) unique = [...unique, title];
      else {
        unique = posts.filter(x => x !== title);
        nonuniqe = [...nonuniqe, title];
      }
    });
    return { nonuniqe, unique };
  };

  return { getJoinedData, countPostsForUser, getUniquePosts };
})();

//POŁĄCZONE DANE
memoize(task2.getJoinedData).then(({ DB }) => console.log(DB));

//USER_NAME NAPISAŁ COUNT POSTÓW
memoize(task2.getJoinedData).then(({ DB }) =>
  DB.forEach(user => {
    console.log(task2.countPostsForUser(user));
  })
);

//POWTÓRZONE NAZWY POSTÓW
memoize(task2.getJoinedData).then(({ posts }) => {
  console.log(task2.getUniquePosts(posts));
});

//NAJBLIŻSZY UŻYTKOWNIK
