import pocketbaseEs from "pocketbase";

export const client = new pocketbaseEs("http://127.0.0.1:8090/");

export const getUserState = async () => {
  try {
    const account = await client.authStore.model;
    return account.profile;
  } catch (error) {
    console.log(error);
  }
};
