import { Client } from "@notionhq/client";

// สร้าง Notion client instance สำหรับเชื่อมต่อกับ Notion API
// โดยใช้ NOTION_TOKEN จาก environment variables
export const notion = new Client({ 
  auth: (import.meta.env as any).NOTION_TOKEN 
});

// กำหนดค่า DATABASE_ID จาก environment variables
export const DATABASE_ID = (import.meta.env as any).NOTION_DATABASE_ID;

/**
 * ดึงข้อมูล Data Source ID แรกที่ผูกกับ Database
 * @returns {Promise<string>} Data Source ID
 */
async function getDataSourceId(): Promise<string> {
  const db = await notion.databases.retrieve({
    database_id: DATABASE_ID,
  });
  const dataSources = (db as any).data_sources || [];
  if (!dataSources.length) {
    throw new Error("No data sources found for this database.");
  }
  return dataSources[0].id as string;
}

// กำหนด Type สำหรับข้อมูลสรุปของ Blog Post
export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  created: string;
  cover: string;
};

/**
 * ดึงข้อมูล Post ทั้งหมดที่เผยแพร่แล้วจาก Notion
 * @returns {Promise<BlogPostSummary[]>} รายการ Post ทั้งหมด
 */
export async function getAllPosts(): Promise<BlogPostSummary[]> {
  const dataSourceId = await getDataSourceId();

  // Query ข้อมูลจาก Data Source โดยกรองเอาเฉพาะหน้าที่ Published เป็น true
  // และเรียงลำดับตามวันที่สร้างล่าสุด
  const res = await (notion as any).dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [
      { property: "Created", direction: "descending" },
    ],
  });

  // แปลงข้อมูลที่ได้จาก Notion API ให้อยู่ในรูปแบบของ BlogPostSummary
  return res.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      title: props.Name?.title?.[0]?.plain_text ?? "Untitled",
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? "",
      description: props.Description?.rich_text?.[0]?.plain_text ?? "",
      tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
      created: props.Created?.created_time ?? page.created_time,
      cover:
        props.Cover?.files?.[0]?.external?.url ??
        props.Cover?.files?.[0]?.file?.url ??
        page.cover?.external?.url ??
        page.cover?.file?.url ??
        "",
    };
  });
}
