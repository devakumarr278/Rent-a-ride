import fs from 'fs';
import path from 'path';

const signupUrl = 'http://localhost:3000/api/vendor/vendorsignup';
const signinUrl = 'http://localhost:3000/api/vendor/vendorsignin';

const signupBody = {
  username: 'testvendor',
  email: 'vendortest1@example.com',
  password: 'Test1234',
};

const signinBody = {
  email: 'vendortest1@example.com',
  password: 'Test1234',
};

const fetchJson = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data, headers: Object.fromEntries(res.headers.entries()) };
};

const run = async () => {
  try {
    const signup = await fetchJson(signupUrl, signupBody);
    console.log('SIGNUP RESPONSE:', signup.status, signup.ok);
    console.log(signup.data);
    console.log('---');

    const signin = await fetchJson(signinUrl, signinBody);
    console.log('SIGNIN RESPONSE:', signin.status, signin.ok);
    console.log(signin.data);
  } catch (err) {
    console.error(err);
  }
};

run();
