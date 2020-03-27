//ZAPISUJĘ PROMISE W MEMOIZE W CELU UNIKNIĘCIA POWIELANIA TEGO SAMEGO REQUESTA
const memoize = (() => {
  const cache = new WeakMap();
  const memoize = (method, test) => {
    if (test) return cache;
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

  const degToRad = deg => {
    return deg * (Math.PI / 180);
  };

  //HAVERSINE FORMULA https://en.wikipedia.org/wiki/Haversine_formula
  const calculateDistance = (geoA, geoB) => {
    const R = 6371;
    let deltaLat = degToRad(degToRad(geoA.lat) - degToRad(geoB.lat));
    let deltaLng = degToRad(degToRad(geoA.lng) - degToRad(geoB.lng));

    let a =
      Math.sin(deltaLat) * Math.sin(deltaLat) +
      Math.cos(geoA.lat) *
        Math.cos(geoB.lat) *
        Math.sin(deltaLng) *
        Math.sin(deltaLng);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getClosestUser = users => {
    users.forEach(user => {
      let minDistance = Infinity;
      let closestUser;
      users
        .filter(x => x !== user)
        .forEach(x => {
          let currentDistance = calculateDistance(
            user.address.geo,
            x.address.geo
          );

          if (currentDistance < minDistance) {
            minDistance = currentDistance;
            closestUser = x;
          }
        });

      user.closestUser = closestUser;
    });
    return users;
  };

  return { getJoinedData, countPostsForUser, getUniquePosts, getClosestUser };
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
memoize(task2.getJoinedData).then(({ DB }) => {
  console.log(task2.getClosestUser(DB));
});

module.exports = { memoize, task2 };
