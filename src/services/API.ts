import axios from "axios";

export default (url = "https://api.frankfurter.dev/v2") => {
  return axios.create({
    baseURL: url,
  });
};
