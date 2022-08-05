const { default: axios } = require("axios");
const baseURL = "https://app.cartoriocolorado.com.br";
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
let usersToInvite = [];
let roomsToInvite = [];
let axiosInstance;
const rocketLogin = () => {
  let rocketUser, rocketPassword;
  console.log("ROCKETCHAT LOGIN\n");
  readline.question("username\n", (value) => {
    rocketUser = value;
    readline.question("password\n", async (value) => {
      rocketPassword = value;
      const { success, data } = await getCredentials(
        rocketUser,
        rocketPassword
      );
      if (!success) {
        console.log("username or password invalid\n");
        return rocketLogin();
      }
      axiosInstance = getAxiosInstance(data.userId, data.authToken);
      return getUsers();
    });
  });
};

const getCredentials = async (rocketUser, rocketPassword) => {
  try {
    const {
      data: {
        data: { userId, authToken },
      },
    } = await axios.post(`${baseURL}/api/v1/login`, {
      user: rocketUser,
      password: rocketPassword,
    });
    return {
      success: true,
      message: "success get credentials",
      data: { userId, authToken },
    };
  } catch (error) {
    return { success: false, message: error?.response?.data?.error, data: {} };
  }
};

const getAxiosInstance = (userId, authToken) =>
  axios.create({
    baseURL,
    headers: {
      "X-User-Id": userId,
      "X-Auth-Token": authToken,
    },
  });

const getUsers = () => {
  readline.question("insert user id or enter 'exit' to finish\n", (value) => {
    if (value === "exit") {
      return getRooms();
    }
    usersToInvite.push(value);
    console.log(`inserted`);
    getUsers();
  });
};

const getRooms = () => {
  readline.question("insert room id or enter 'exit' to finish\n", (value) => {
    if (value === "exit") {
      readline.close();
      return usersInvite();
    }
    roomsToInvite.push(value);
    console.log(`inserted`);
    getRooms();
  });
};

const usersInvite = async () => {
  if (usersToInvite.length !== 0 && roomsToInvite.length !== 0)
    return Promise.all(
      usersToInvite.map((user) => {
        console.log(`init invite user: ${user}`);
        roomsToInvite.map(async (room) => {
          console.log(`in room: ${room}`);
          try {
            const body = {
              userId: user,
              roomId: room,
            }
            await axiosInstance.post("/api/v1/groups.invite", body);
            console.log(`success invite user: ${user} in room: ${room}`);
          } catch (error) {
            console.log(error.toString());
          }
        });
      })
    );
  return console.log("room or users not provided");
};

rocketLogin();
