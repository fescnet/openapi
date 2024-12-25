import * as myModule from "./TestService";

describe("Function a", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call", () => {
    const spy = jest.spyOn(myModule, "b").mockImplementation(() => {});
    myModule.a();
    expect(spy).toHaveBeenCalled();
  });
});
