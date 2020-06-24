
import { AuthenticationError } from "apollo-server";
const authTokenRexExPatter = /[; ]?AUTH_TOKEN=([^\\s;]*)/;

export default (cookie?: string, shouldThrow: boolean = false): string => {
  if (!cookie || cookie.length === 0) {
    console.log("cookie not provided") 
    if (shouldThrow) {
      throw new AuthenticationError("cookie not provided");
    } else {
      return '';
    }
  }
  const results = authTokenRexExPatter.exec(cookie || '');
  if (!results) {
    console.log("no token in cookie")
    if (shouldThrow) {
      throw new AuthenticationError("no token in cookie");
    } else {
      return '';
    }
  }
  // if (!results || results.length < 2) {
  //   if (shouldThrow) {
  //     console.log("no token in cookie")
  //     throw new AuthenticationError("no token in cookie");
  //   }
  // }

  const token = results![1];

  if (!token || token.length === 0) {
    console.log("token is empty")  
    if (shouldThrow) {
      throw new AuthenticationError("token is empty");
    } else {
      return '';
    }
  }

  return token;
}