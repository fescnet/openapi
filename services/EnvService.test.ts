process.env.AppName = "Teste";
import * as myModule from "./EnvService";
describe("Function a", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call", () => {
    const spy = jest.spyOn(myModule, "b").mockImplementation(() => {});
    myModule.a();
    expect(spy).toHaveBeenCalledWith("Teste");
  });
});
