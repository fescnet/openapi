import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

// DynamoDB DocumentClient interface
interface DynamoDBClient {
  send(command: any): Promise<any>;
}

interface Category {
  categoryId: string;
  parentCategoryId: string;
  name: string;
  type: string;
  createdAt: number;
  updatedAt: number;
}

class CategoryManager {
  private tableName: string;
  private docClient: DynamoDBDocumentClient;

  // Inject DynamoDB client and table name into the class constructor
  constructor(docClient: DynamoDBDocumentClient, tableName: string) {
    this.docClient = docClient;
    this.tableName = tableName; // The table name is passed as a parameter
  }

  // Create or update a category in DynamoDB
  async createOrUpdateCategory(category: Category): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: category,
    };

    try {
      await this.docClient.send(new PutCommand(params));
      console.log(
        `Category ${category.categoryId} created/updated successfully.`
      );
    } catch (error) {
      console.error("Error creating/updating category:", error);
      throw new Error("Unable to create/update category.");
    }
  }

  // Get a category by categoryId (PK)
  async getCategoryById(categoryId: string): Promise<Category | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        categoryId: categoryId,
        parentCategoryId: categoryId, // Use the same categoryId for SK as it is the root category
      },
    };

    try {
      const data = await this.docClient.send(new GetCommand(params));
      if (data.Item) {
        return data.Item as Category;
      } else {
        console.log(`Category with id ${categoryId} not found.`);
        return null;
      }
    } catch (error) {
      console.error("Error retrieving category:", error);
      throw new Error("Unable to retrieve category.");
    }
  }

  // Query categories by parentCategoryId (GSI)
  async getCategoriesByParent(parentCategoryId: string): Promise<Category[]> {
    const params = {
      TableName: this.tableName,
      IndexName: "ParentCategoryIndex", // GSI name, replace with your actual GSI name
      KeyConditionExpression: "parentCategoryId = :parentCategoryId",
      ExpressionAttributeValues: {
        ":parentCategoryId": parentCategoryId,
      },
    };

    try {
      const data = await this.docClient.send(new QueryCommand(params));
      if (data.Items) {
        return data.Items as Category[];
      } else {
        console.log(`No categories found for parent ${parentCategoryId}.`);
        return [];
      }
    } catch (error) {
      console.error("Error querying categories by parent:", error);
      throw new Error("Unable to query categories.");
    }
  }

  // Update a category
  async updateCategory(
    categoryId: string,
    updates: Partial<Category>
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        categoryId: categoryId,
        parentCategoryId: categoryId, // Use the same categoryId for root category
      },
      UpdateExpression:
        "SET #name = :name, #type = :type, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#name": "name",
        "#type": "type",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":name": updates.name,
        ":type": updates.type,
        ":updatedAt": Date.now(),
      },
    };

    try {
      await this.docClient.send(new UpdateCommand(params));
      console.log(`Category ${categoryId} updated successfully.`);
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Unable to update category.");
    }
  }

  // Delete a category
  async deleteCategory(categoryId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        categoryId: categoryId,
        parentCategoryId: categoryId, // Use the same categoryId for root category
      },
    };

    try {
      await this.docClient.send(new DeleteCommand(params));
      console.log(`Category ${categoryId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Unable to delete category.");
    }
  }
}

export default CategoryManager;
