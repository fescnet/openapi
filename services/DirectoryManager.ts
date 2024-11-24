import axios, { AxiosInstance } from "axios";

interface User {
  type: string;
  id: string;
  display_id: string;
  display_name: string;
  display_picture: {
    id: string;
  };
  email: string;
  full_name: string;
  state: string;
}

interface Parent {
  id: string;
  display_id: string;
}

interface Tag {
  tag: {
    id: string;
    name: string;
  };
}

interface Thumbnail {
  id: string;
  display_id: string;
}

interface Directory {
  id: string;
  body: {
    id: string;
    display_id: string;
  };
  created_by: User;
  created_date: string;
  description: string;
  display_id: string;
  icon: string;
  modified_by: User;
  modified_date: string;
  parent: Parent;
  published: boolean;
  rank: string;
  tags: Tag[];
  thumbnail: Thumbnail;
  title: string;
}

export class DirectoryManager {
  private apiClient: AxiosInstance;

  // Inject the axios client as a parameter
  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  /**
   * Fetch a list of directories.
   * @returns A promise containing the directory list.
   */
  async listDirectories(
    createdBy?: string,
    modifiedBy?: string
  ): Promise<Directory[]> {
    const directories: Directory[] = [];
    let cursor: string | undefined = undefined;
    const limit = 2000; // Maximum allowed limit per request

    try {
      do {
        // Build query parameters dynamically
        const params: any = { limit, mode: "after" };
        if (cursor) params.cursor = cursor;
        if (createdBy) params.created_by = createdBy;
        if (modifiedBy) params.modified_by = modifiedBy;

        // API request
        const response = await this.apiClient.get("/directories.list", {
          params,
        });

        // Collect directories from response data
        const { directories: responseDirectories, next_cursor } = response.data;

        // Assuming that `responseDirectories` is an array of directories with the correct type
        directories.push(...responseDirectories);

        // Update cursor for pagination
        cursor = next_cursor; // Use next_cursor for pagination if available

        console.log(
          `Retrieved ${responseDirectories.length} directories. Total so far: ${directories.length}`
        );
      } while (cursor); // Continue until there's no cursor for more pages

      return directories;
    } catch (error) {
      console.error("Error retrieving directories:", error);
      throw error;
    }
  }

  /**
   * Fetch a single directory by its ID.
   * @param id - The ID of the directory to retrieve.
   * @returns The directory data.
   */
  async getDirectory(id: string): Promise<Directory> {
    try {
      // Make the GET request with the ID as a query parameter
      const response = await this.apiClient.get("/directories.get", {
        params: { id },
      });

      // Extract directory data from the response
      const directory: Directory = response.data.directory;

      return directory;
    } catch (error) {
      console.error("Error retrieving directory:", error);
      throw error;
    }
  }

  /**
   * Create a new directory.
   * @param title - The title of the directory.
   * @param description - An optional description for the directory.
   * @returns A promise containing the newly created directory.
   */
  async createDirectory(
    title: string,
    description?: string
  ): Promise<Directory> {
    try {
      const response = await this.apiClient.post("/directories", {
        title,
        description,
      });

      const directory: Directory = response.data.directory;

      return directory;
    } catch (error) {
      console.error("Error creating directory:", error);
      throw error;
    }
  }

  /**
   * Update an existing directory.
   * @param id - The ID of the directory to update.
   * @param updates - An object containing the fields to update.
   * @returns A promise containing the updated directory data.
   */
  async updateDirectory(
    id: string,
    updates: {
      description?: string;
      parent?: string;
      published?: boolean;
      title?: string;
    }
  ): Promise<Directory> {
    try {
      // Ensure the `id` is included in the payload
      const payload = { id, ...updates };

      // Make the POST request to update the directory
      const response = await this.apiClient.post(
        "/directories.update",
        payload
      );

      const directory: Directory = response.data.directory;

      return directory;
    } catch (error) {
      console.error("Error updating directory:", error);
      throw error;
    }
  }

  /**
   * Delete a directory by its ID.
   * @param directoryId - The ID of the directory to delete.
   * @returns A promise confirming deletion.
   */
  async deleteDirectory(directoryId: string): Promise<any> {
    try {
      const response = await this.apiClient.delete(
        `/directories/${directoryId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting directory:", error);
      throw error;
    }
  }
}
