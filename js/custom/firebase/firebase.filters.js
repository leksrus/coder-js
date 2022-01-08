async function findUser(user) {
  return db
    .collection("users")
    .where("userName", "==", user.username)
    .where("passWord", "==", user.password)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const result = querySnapshot.docs[0].data();
        result.passWord = "";

        return result;
      }
    });
}

async function getAllUsers() {
  return db
    .collection("users")
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map((doc) => doc.data());
      }
    });
}

async function createUser(user) {
  return db.collection("users").add({
    id: user.id,
    firstName: user.firstname,
    lastName: user.lastname,
    passWord: user.password,
    userName: user.username,
  });
}

async function getAllProducts() {
  return db
    .collection("products")
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map((doc) => doc.data());
      }
    });
}
