import { queryDb } from "@/db/connect";

export const createTable = async (createTableQuery: string) => {
  try {
    const { rows } = await queryDb(createTableQuery);

    console.log("Table  created successfully");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};
