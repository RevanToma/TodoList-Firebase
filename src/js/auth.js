import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const createUser = function (auth, email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
};
export const signIn = function (auth, email, password) {
  return signInWithEmailAndPassword(auth, email, password);
};
