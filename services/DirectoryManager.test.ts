import { DirectoryManager } from "./DirectoryManager";
import axios from "axios";

jest.mock("axios"); // Mock the axios module

const mockAxios = axios as jest.Mocked<typeof axios>;

describe("DirectoryManager", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock state after each test
  });

  it("should fetch a list of directories", async () => {
    // Arrange: mock axios.get to return a mock response
    const mockDirectories = [
      {
        id: "1",
        title: "Directory 1",
        body: { id: "1", display_id: "1" },
        created_by: {
          id: "user1",
          display_name: "User 1",
          type: "sys_user",
          email: "user1@example.com",
          full_name: "User 1",
          state: "active",
          display_picture: { id: "pic1" },
        },
        created_date: "2023-01-01T12:00:00Z",
        description: "Test directory",
        display_id: "1",
        icon: "icon1",
        modified_by: {
          id: "user2",
          display_name: "User 2",
          type: "sys_user",
          email: "user2@example.com",
          full_name: "User 2",
          state: "active",
          display_picture: { id: "pic2" },
        },
        modified_date: "2023-01-02T12:00:00Z",
        parent: { id: "parent1", display_id: "parent1" },
        published: true,
        rank: "1",
        tags: [{ tag: { id: "tag1", name: "Tag 1" } }],
        thumbnail: { id: "thumb1", display_id: "thumb1" },
      },
    ];

    mockAxios.get.mockResolvedValue({
      data: { directories: mockDirectories, next_cursor: null },
    });

    // Act: Create an instance of DirectoryManager and call the listDirectories method
    const directoryManager = new DirectoryManager(mockAxios);
    const directories = await directoryManager.listDirectories();

    // Assert: Verify the correct directory data is returned
    expect(directories).toEqual(mockDirectories);
    expect(mockAxios.get).toHaveBeenCalledWith(
      "/directories.list",
      expect.objectContaining({ params: { limit: 2000, mode: "after" } })
    );
  });

  it("should fetch a single directory by its ID", async () => {
    // Arrange: mock axios.get to return a mock directory
    const mockDirectory = {
      id: "1",
      title: "Directory 1",
      body: { id: "1", display_id: "1" },
      created_by: {
        id: "user1",
        display_name: "User 1",
        type: "sys_user",
        email: "user1@example.com",
        full_name: "User 1",
        state: "active",
        display_picture: { id: "pic1" },
      },
      created_date: "2023-01-01T12:00:00Z",
      description: "Test directory",
      display_id: "1",
      icon: "icon1",
      modified_by: {
        id: "user2",
        display_name: "User 2",
        type: "sys_user",
        email: "user2@example.com",
        full_name: "User 2",
        state: "active",
        display_picture: { id: "pic2" },
      },
      modified_date: "2023-01-02T12:00:00Z",
      parent: { id: "parent1", display_id: "parent1" },
      published: true,
      rank: "1",
      tags: [{ tag: { id: "tag1", name: "Tag 1" } }],
      thumbnail: { id: "thumb1", display_id: "thumb1" },
    };

    mockAxios.get.mockResolvedValue({
      data: { directory: mockDirectory },
    });

    // Act: Call the getDirectory method with a directory ID
    const directoryManager = new DirectoryManager(mockAxios);
    const directory = await directoryManager.getDirectory("1");

    // Assert: Verify the correct directory data is returned
    expect(directory).toEqual(mockDirectory);
    expect(mockAxios.get).toHaveBeenCalledWith(
      "/directories.get",
      expect.objectContaining({ params: { id: "1" } })
    );
  });

  it("should create a new directory", async () => {
    // Arrange: mock axios.post to return a mock created directory
    const mockCreatedDirectory = {
      id: "1",
      title: "Directory 1",
      body: { id: "1", display_id: "1" },
      created_by: {
        id: "user1",
        display_name: "User 1",
        type: "sys_user",
        email: "user1@example.com",
        full_name: "User 1",
        state: "active",
        display_picture: { id: "pic1" },
      },
      created_date: "2023-01-01T12:00:00Z",
      description: "Test directory",
      display_id: "1",
      icon: "icon1",
      modified_by: {
        id: "user2",
        display_name: "User 2",
        type: "sys_user",
        email: "user2@example.com",
        full_name: "User 2",
        state: "active",
        display_picture: { id: "pic2" },
      },
      modified_date: "2023-01-02T12:00:00Z",
      parent: { id: "parent1", display_id: "parent1" },
      published: true,
      rank: "1",
      tags: [{ tag: { id: "tag1", name: "Tag 1" } }],
      thumbnail: { id: "thumb1", display_id: "thumb1" },
    };

    mockAxios.post.mockResolvedValue({
      data: { directory: mockCreatedDirectory },
    });

    // Act: Create an instance of DirectoryManager and call the createDirectory method
    const directoryManager = new DirectoryManager(mockAxios);
    const newDirectory = await directoryManager.createDirectory(
      "Directory 1",
      "Test directory"
    );

    // Assert: Verify the directory is created correctly
    expect(newDirectory).toEqual(mockCreatedDirectory);
    expect(mockAxios.post).toHaveBeenCalledWith("/directories", {
      title: "Directory 1",
      description: "Test directory",
    });
  });

  it("should update an existing directory", async () => {
    // Arrange: mock axios.post to return a mock updated directory
    const mockUpdatedDirectory = {
      id: "1",
      title: "Updated Directory 1",
      body: { id: "1", display_id: "1" },
      created_by: {
        id: "user1",
        display_name: "User 1",
        type: "sys_user",
        email: "user1@example.com",
        full_name: "User 1",
        state: "active",
        display_picture: { id: "pic1" },
      },
      created_date: "2023-01-01T12:00:00Z",
      description: "Updated directory",
      display_id: "1",
      icon: "icon1",
      modified_by: {
        id: "user2",
        display_name: "User 2",
        type: "sys_user",
        email: "user2@example.com",
        full_name: "User 2",
        state: "active",
        display_picture: { id: "pic2" },
      },
      modified_date: "2023-01-02T12:00:00Z",
      parent: { id: "parent1", display_id: "parent1" },
      published: true,
      rank: "1",
      tags: [{ tag: { id: "tag1", name: "Tag 1" } }],
      thumbnail: { id: "thumb1", display_id: "thumb1" },
    };

    mockAxios.post.mockResolvedValue({
      data: { directory: mockUpdatedDirectory },
    });

    // Act: Create an instance of DirectoryManager and call the updateDirectory method
    const directoryManager = new DirectoryManager(mockAxios);
    const updatedDirectory = await directoryManager.updateDirectory("1", {
      title: "Updated Directory 1",
      description: "Updated directory",
    });

    // Assert: Verify the directory is updated correctly
    expect(updatedDirectory).toEqual(mockUpdatedDirectory);
    expect(mockAxios.post).toHaveBeenCalledWith("/directories.update", {
      id: "1",
      title: "Updated Directory 1",
      description: "Updated directory",
    });
  });

  it("should delete a directory by its ID", async () => {
    // Arrange: mock axios.delete to return a mock successful response
    mockAxios.delete.mockResolvedValue({
      data: { success: true },
    });

    // Act: Create an instance of DirectoryManager and call the deleteDirectory method
    const directoryManager = new DirectoryManager(mockAxios);
    const response = await directoryManager.deleteDirectory("1");

    // Assert: Verify the delete method was called correctly
    expect(response).toEqual({ success: true });
    expect(mockAxios.delete).toHaveBeenCalledWith("/directories/1");
  });
});
