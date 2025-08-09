import Cookies from "js-cookie";

export const getCookie = (key) => {
    return Cookies.get(key);
};

// CORRECTED: Added an 'options' parameter
export const setCookie = (key, value, options) => {
    // The options object can include { expires: 7, path: '/', secure: true, sameSite: 'strict' }
    return Cookies.set(key, value, options);
};

export const removeCookie = (key) => {
    return Cookies.remove(key);
};