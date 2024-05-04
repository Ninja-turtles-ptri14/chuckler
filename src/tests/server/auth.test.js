const supertest = require('supertest');
jest.mock('../../server/models/userModel');
const jwt = require('jsonwebtoken');
const userModel = require("../../server/models/userModel");
const userController = require("../../server/controllers/userController");
jest.mock('../../server/models/jokeModel');
const jokeModel = require('../../server/models/jokeModel')
const jokeController = require('../../server/controllers/jokeController');
const app = require('../../server/server');
const db = require ("../../db/db");
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn()
}));
describe('/api/users', () => {
  test('/signup', async () => {
    const mockSignup = {
      email: "test@chuckler.com",
      username: "testUsername",
      password: "testPassword",
      joke: "testJoke"
    };
    // Mocking the createUser function to resolve with some dummy data
    userModel.createUser.mockResolvedValueOnce({ id: 'TESTUUID', username: "testUsername" });//mocks createUser's resolve value
    jokeModel.createJoke.mockResolvedValueOnce({joke_id:'TESTJOKEID',content:'testJoke',creator_id:'TESTUUID'})//mock's createJokes resolve value
    jwt.sign.mockReturnValue('jwtToken'); //mocks jwt's sign return value
    const response = await supertest(app)
      .post('/api/user/signup')
      .send(mockSignup);

    expect(response.status).toBe(200);//tests if response comes back with status 200
    console.log('Sign up Status is 200');

    expect(response.headers['set-cookie'][0].slice(0,12)).toBe('jwt=jwtToken');//tests to see if we correctly set our mocked token
    console.log('Sign up sets a jwt cookie');

    expect(response.body).toBe('User signed up successfully!');//tests to see if the response is correct
    console.log('Sign up Response is User signed up successfully!');

    expect(userModel.createUser).toHaveBeenCalledWith(//tests to see if createUser was called with correct params
      mockSignup.email,
      mockSignup.username,
      expect.any(String) 
    );
    console.log('userModel.createUser called with correct params');

    expect(jokeModel.createJoke).toHaveBeenCalledWith(//tests to see if createJoke was called with correct params
      mockSignup.joke,
      'TESTUUID'
    );
    console.log('jokeModel.createJoke called with correct params');
  });

  describe("/login", () => {
    it("should login a user and set JWT cookie", async () => {
      jwt.sign.mockReturnValue('jwtToken'); //mocks jwt's sign return value
      userModel.getUserByEmail.mockResolvedValueOnce({//mock's getUser's by email return value
        id: "testUUID",
        username: "testUsername",
        password: "testPassword",
      });

      const response = await supertest(app).post("/api/user/login").send({
        email: "test@example.com",
        password: "testPassword",
      });

      expect(response.status).toBe(200);//tests to see if response status is correct
      console.log('log in status is 200');

      expect(response.body).toEqual("User logged in successfully!");//test to see if response body is correct
      console.log('user logged in correctly');

      expect(userModel.getUserByEmail).toHaveBeenCalledWith("test@example.com");//tests to see if getUserByEmail was called with correct params
      console.log('userModel.getUserByEmail called with correct params');

      expect(response.headers['set-cookie'][0].slice(0,12)).toBe('jwt=jwtToken');//tests if we correctly sent the mocked cookie
      console.log('Log in sets cookies correctly');
    });
  });

  describe("/logout", () => {
    it("should logout a user, set isOnline to false, and remove JWT cookie", async () => {
      const token = "testToken";
      jwt.verify.mockResolvedValueOnce({//mocks jwt verify's function to resolve with fake data
        id:"testUUID",
        username:"testUsername"
      })
      const response = await supertest(app)
        .post("/api/user/logout")
        .set("Cookie", [`jwt=${token}`]);

      expect(response.status).toBe(200);//tests to see if response status is 200
      console.log('response in logout is 200')

      expect(response.headers['set-cookie'][0].slice(0,5)).toBe('jwt=;')//tests to see if logout clears cookies
      console.log('logout correctly clears cookies')

      expect(response.body).toEqual("User logged out successfully!");//tests to see if logout's body is correct
      console.log('logout response is correct');
    });
  });
});
