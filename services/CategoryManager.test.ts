import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import CategoryManager from "./CategoryManager";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: {
    from: jest.fn(() => ({
      send: jest.fn(),
    })),
  },
  PutCommand: jest.fn(),
  GetCommand: jest.fn(),
  QueryCommand: jest.fn(),
  UpdateCommand: jest.fn(),
  DeleteCommand: jest.fn(),
}));

describe("CategoryManager", () => {
  let mockSend: jest.Mock;
  let categoryManager: CategoryManager;

  const tableName = "CategoriesTable";

  beforeEach(() => {
    const mockDynamoDBClient = new DynamoDBClient({});
    const mockDocClient = DynamoDBDocumentClient.from(mockDynamoDBClient);

    mockSend = mockDocClient.send as jest.Mock;
    categoryManager = new CategoryManager(mockDocClient, tableName);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrUpdateCategory", () => {
    it("should successfully create or update a category", async () => {
      const category = {
        categoryId: "cat123",
        parentCategoryId: "root",
        name: "Electronics",
        type: "Product",
        createdAt: 1732496966814,
        updatedAt: 1732496966814,
      };

      mockSend.mockResolvedValue({});

      await categoryManager.createOrUpdateCategory(category);

      expect(mockSend).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(PutCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Item: category,
      });
    });

    it("should throw an error if DynamoDB fails", async () => {
      const category = {
        categoryId: "cat123",
        parentCategoryId: "root",
        name: "Electronics",
        type: "Product",
        createdAt: 1732496966814,
        updatedAt: 1732496966814,
      };

      mockSend.mockRejectedValue(new Error("DynamoDB error"));

      await expect(
        categoryManager.createOrUpdateCategory(category)
      ).rejects.toThrow("Unable to create/update category.");
    });
  });

  describe("getCategoryById", () => {
    it("should successfully retrieve a category", async () => {
      const category = {
        categoryId: "cat123",
        parentCategoryId: "root",
        name: "Electronics",
        type: "Product",
        createdAt: 1732496966814,
        updatedAt: 1732496966814,
      };

      mockSend.mockResolvedValue({ Item: category });

      const result = await categoryManager.getCategoryById("cat123");

      expect(result).toEqual(category);
      expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(GetCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          categoryId: "cat123",
          parentCategoryId: "cat123",
        },
      });
    });

    it("should return null if the category is not found", async () => {
      mockSend.mockResolvedValue({});

      const result = await categoryManager.getCategoryById("cat123");

      expect(result).toBeNull();
    });
  });

  describe("getCategoriesByParent", () => {
    it("should successfully retrieve categories by parentCategoryId", async () => {
      const categories = [
        { categoryId: "cat1", parentCategoryId: "root", name: "Sub1" },
        { categoryId: "cat2", parentCategoryId: "root", name: "Sub2" },
      ];

      mockSend.mockResolvedValue({ Items: categories });

      const result = await categoryManager.getCategoriesByParent("root");

      expect(result).toEqual(categories);
      expect(mockSend).toHaveBeenCalledWith(expect.any(QueryCommand));
      expect(QueryCommand).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: "ParentCategoryIndex",
        KeyConditionExpression: "parentCategoryId = :parentCategoryId",
        ExpressionAttributeValues: {
          ":parentCategoryId": "root",
        },
      });
    });

    it("should return an empty array if no categories are found", async () => {
      mockSend.mockResolvedValue({ Items: [] });

      const result = await categoryManager.getCategoriesByParent("root");

      expect(result).toEqual([]);
    });
  });

  describe("updateCategory", () => {
    it("should successfully update a category", async () => {
      const updates = {
        name: "Updated Name",
        type: "Updated Type",
      };

      mockSend.mockResolvedValue({});

      await categoryManager.updateCategory("cat123", updates);

      expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(UpdateCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          categoryId: "cat123",
          parentCategoryId: "cat123",
        },
        UpdateExpression:
          "SET #name = :name, #type = :type, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#name": "name",
          "#type": "type",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":name": "Updated Name",
          ":type": "Updated Type",
          ":updatedAt": expect.any(Number),
        },
      });
    });
  });

  describe("deleteCategory", () => {
    it("should successfully delete a category", async () => {
      mockSend.mockResolvedValue({});

      await categoryManager.deleteCategory("cat123");

      expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteCommand));
      expect(DeleteCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          categoryId: "cat123",
          parentCategoryId: "cat123",
        },
      });
    });
  });
});
