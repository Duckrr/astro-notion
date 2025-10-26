import { Client } from "@notionhq/client";

// สร้างอินสแตนซ์ของ Notion client โดยใช้ token จาก environment variables
const notion = new Client({ auth: (import.meta.env as any).NOTION_TOKEN });

/**
 * ฟังก์ชันสำหรับดึงข้อมูลบล็อกทั้งหมดแบบลึก (recursive)
 * โดยจะดึงบล็อกลูกที่ซ้อนกันอยู่ทั้งหมดของ blockId ที่ระบุ
 * @param blockId - ID ของบล็อกที่ต้องการดึงข้อมูล
 * @returns - อาร์เรย์ของบล็อกทั้งหมด (รวมบล็อกลูก)
 */
export async function getBlocksDeep(blockId: string) {
  // อาร์เรย์สำหรับเก็บผลลัพธ์ของบล็อกทั้งหมด
  const blocks: any[] = [];

  // ตัวแปร cursor สำหรับจัดการ pagination (การแบ่งหน้าข้อมูล)
  let cursor: string | undefined = undefined;

  // วนลูปเพื่อดึงข้อมูลทีละหน้าจนกว่าจะไม่มีหน้าถัดไป
  do {
    // เรียก API เพื่อดึงรายการบล็อกลูกของ blockId ที่ระบุ
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100, // ดึงข้อมูลทีละ 100 บล็อก
      start_cursor: cursor,
    });

    for (const block of res.results) {
      // 🔁 ถ้าบล็อกมีบล็อกลูก (has_children) — ให้เรียกฟังก์ชันนี้ซ้ำเพื่อดึงข้อมูลบล็อกลูกเหล่านั้น
      if ((block as any).has_children) {
        (block as any).children = await getBlocksDeep((block as any).id);
      }
      // เพิ่มบล็อกที่ได้ลงในอาร์เรย์ผลลัพธ์
      blocks.push(block);
    }

    // อัปเดต cursor: ถ้ายังมีข้อมูลหน้าถัดไป (has_more) ให้ใช้ next_cursor, 
    // มิฉะนั้นให้เป็น undefined เพื่อหยุดการทำงานของลูป
    cursor = res.has_more ? (res.next_cursor || undefined) : undefined;
  } while (cursor);

  // คืนค่าอาร์เรย์ของบล็อกทั้งหมดที่ดึงมาได้
  return blocks;
}