import * as request from "request";

export const getRequest = (url: string): Promise<request.ResponseAsJSON> => {
  return new Promise((resolve, reject) => {
    return request.get(url, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res.toJSON());
    });
  });
};

export const postRequest = (
  url: string,
  body: any
): Promise<request.ResponseAsJSON> => {
  return new Promise((resolve, reject) => {
    return request.post(url, { body }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res.toJSON());
    });
  });
};
