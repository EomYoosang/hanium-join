import urls from "../urls";
import httpClient from "../httpClient";

export const create = (form) => httpClient.post(urls.member, form);
export const listAll = (qs) => httpClient.get(`${urls.member}?${qs}`);
export const get = (id) => httpClient.get(`${urls.member}/${id}`);
export const put = (id, form) => httpClient.put(`${urls.member}/${id}`, form);
export const remove = (id) => httpClient.remove(`${urls.member}/${id}`);

export const signUp = (form) =>
  httpClient.post(`${urls.member}/register`, form);
