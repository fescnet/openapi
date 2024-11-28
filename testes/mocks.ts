// https://jestjs.io/docs/mock-functions
// #########################################################
// In __mocks__/myModule.ts
export const myFunction = jest.fn(() => "mocked value");

// In your test file
jest.mock("../myModule"); // Use the manual mock
import { myFunction } from "../myModule";

test("uses the mocked implementation", () => {
  expect(myFunction()).toBe("mocked value");
});

// ##########################################################
//Manual Mocking
jest.mock("../myModule"); // Automatically mocks all exports
import { myFunction } from "../myModule";

test("uses the auto-mocked implementation", () => {
  (myFunction as jest.Mock).mockReturnValue("auto-mocked value");
  expect(myFunction()).toBe("auto-mocked value");
});
// ##########################################################
// Mocking Individual Functions
const myMockedFunction = jest.fn().mockReturnValue("mocked output");

test("uses the mocked function", () => {
  expect(myMockedFunction()).toBe("mocked output");
});
// ##########################################################
//Mocking Classes
class MyClass {
  myMethod() {
    return "real value";
  }
}

jest.mock("./MyClass", () => {
  return {
    MyClass: jest.fn().mockImplementation(() => ({
      myMethod: jest.fn().mockReturnValue("mocked value"),
    })),
  };
});

import { MyClass } from "./MyClass";

test("uses the mocked class", () => {
  const instance = new MyClass();
  expect(instance.myMethod()).toBe("mocked value");
});
// ##########################################################
// Mocking Dependencies with Spies
const obj = {
  myMethod: () => "real value",
};

test("uses a spied method", () => {
  const spy = jest.spyOn(obj, "myMethod").mockReturnValue("mocked value");
  expect(obj.myMethod()).toBe("mocked value");
  spy.mockRestore(); // Restore original implementation
});
// ##########################################################
// Mocking Timers
jest.useFakeTimers();

test("mocks setTimeout", () => {
  const callback = jest.fn();

  setTimeout(callback, 1000);
  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);
});

jest.useRealTimers();
// ##########################################################
// Mocking Fetch or Axios
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: "mocked data" }),
  })
);

test("fetches mocked data", async () => {
  const response = await fetch("/api");
  const data = await response.json();
  expect(data.data).toBe("mocked data");
});
// ##########################################################
// Mocking ES Modules with jest.mock()
import * as myModule from "../myModule";

jest.spyOn(myModule, "myFunction").mockReturnValue("mocked output");

test("mocks an ES module export", () => {
  expect(myModule.myFunction()).toBe("mocked output");
});
// ##########################################################
// Mocking Imported Types
import { myFunction } from "../myModule";

jest.mock("../myModule");
const mockedMyFunction = myFunction as jest.MockedFunction<typeof myFunction>;

mockedMyFunction.mockReturnValue("typed mock");

test("uses a typed mock", () => {
  expect(myFunction()).toBe("typed mock");
});

import axios from "axios";

export async function funcA(a: string) {
  const response1 = await axios.get("https://api.mysaas.com/users");
  const response2 = await funcB(a);
  return { response1, response2 };
}

export async function funcB(a: string) {
  const res = await axios.get("https://api.mysaas.com/users");
  return res;
}
