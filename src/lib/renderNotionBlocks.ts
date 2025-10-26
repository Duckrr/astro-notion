// ประเภทบล็อกที่รองรับ:
// paragraph (ย่อหน้า)
// heading_1 / heading_2 / heading_3 (หัวข้อระดับ 1, 2, 3)
// bulleted_list_item / numbered_list_item (รายการแบบสัญลักษณ์ / รายการแบบตัวเลข)
// to_do (รายการที่ต้องทำ)
// toggle (บล็อกแบบพับ, พร้อมเนื้อหาย่อยถ้ามี)
// quote (คำพูด)
// callout (กล่องข้อความ, บรรทัดแรกจะถูกจัดรูปแบบเป็นหัวข้อ)
// code (โค้ด)
// divider (เส้นคั่น)
// image (รูปภาพ)
// video (วิดีโอจาก YouTube / Vimeo / ไฟล์)
// embed (ฝังเนื้อหา)
// bookmark (บุ๊กมาร์ก)
// table / table_row (ตาราง / แถวของตาราง)
//
// หมายเหตุ:
// - Rich text (ข้อความที่มีการจัดรูปแบบ) รองรับการเน้นข้อความ, ลิงก์, และสีตัวอักษร/สีพื้นหลัง
// - รายการจะถูกจัดกลุ่มด้วยแท็ก <ul>/<ol>
// - บล็อกแบบพับจะใช้แท็ก <details><summary>…</summary>…</details>
// - บล็อกที่ไม่รู้จักจะแสดงข้อความว่า "ไม่สามารถแสดงผลบล็อกประเภท <type> ได้"

type AnnotationColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "gray_background"
  | "brown_background"
  | "orange_background"
  | "yellow_background"
  | "green_background"
  | "blue_background"
  | "purple_background"
  | "pink_background"
  | "red_background";

const COLOR_CLASS_MAP: Record<AnnotationColor, string> = {
  default: "",
  gray: "text-gray-500",
  brown: "text-[rgb(120,72,0)]",
  orange: "text-orange-600",
  yellow: "text-yellow-600",
  green: "text-green-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  red: "text-red-600",

  gray_background: "bg-gray-200",
  brown_background: "bg-[rgb(241,232,224)] text-[rgb(120,72,0)]",
  orange_background: "bg-orange-100",
  yellow_background: "bg-yellow-100",
  green_background: "bg-green-100",
  blue_background: "bg-blue-100",
  purple_background: "bg-purple-100",
  pink_background: "bg-pink-100",
  red_background: "bg-red-100",
};

type RichText = {
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
    color: AnnotationColor | string;
  };
};

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderRichText(richTexts: RichText[]) {
  return richTexts
    .map((t) => {
      const ann = t.annotations || ({} as RichText["annotations"]);
      const colorClass =
        COLOR_CLASS_MAP[(ann.color as AnnotationColor) || "default"] || "";

      let node = t.plain_text;

      if (ann.code) {
        node = `<code class="rounded bg-gray-100 px-1 py-0.5 text-[0.9em]">${escapeHtml(
          node
        )}</code>`;
      } else {
        node = escapeHtml(node);
        if (ann.bold) node = `<strong>${node}</strong>`;
        if (ann.italic) node = `<em>${node}</em>`;
        if (ann.underline) node = `<span class="underline">${node}</span>`;
        if (ann.strikethrough)
          node = `<span class="line-through">${node}</span>`;
      }

      if (colorClass) {
        node = `<span class="${colorClass}">${node}</span>`;
      }

      if (t.href) {
        node = `<a href="${t.href}" class="text-blue-600 underline overflow-wrap-break-word" target="_blank" rel="noopener noreferrer">${node}</a>`;
      }

      return node;
    })
    .join("");
}

// ฟังก์ชันแสดงผลบล็อกแบบพับ (toggle)
// ถ้า has_children เป็น true แต่ไม่มีข้อมูล children, เราจะแสดงข้อความดีบักแทนที่จะแสดงเนื้อหาว่างๆ
function renderToggleBlock(block: any): string {
  const summaryText = renderRichText(block.toggle.rich_text ?? []);

  // children (เนื้อหาย่อย) อาจจะมีหรือไม่มีก็ได้
  const hasChildrenFlag = !!block.has_children;
  const childrenBlocks = Array.isArray(block.children) ? block.children : [];

  // ถ้ามี children ก็จะเรียกฟังก์ชันตัวเองเพื่อแสดงผลซ้ำ
  let childrenHtml = "";
  if (childrenBlocks.length > 0) {
    childrenHtml = renderBlocksToHtml(childrenBlocks);
  } else if (hasChildrenFlag) {
    // has_children = true แต่ไม่มี block.children ถูกโหลดเข้ามา
    childrenHtml = `<div class="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
      child blocks not loaded (toggle id ${escapeHtml(block.id || "")})
    </div>`;
  } else {
    // ไม่มี children จริง ๆ ก็ไม่ต้องแจ้งเตือน
    childrenHtml = "";
  }

  return `
    <details class="mb-4 rounded border border-gray-200 bg-gray-50 p-4">
      <summary class="cursor-pointer font-medium text-gray-800 leading-relaxed">
        ${summaryText}
      </summary>
      <div class="mt-3 text-gray-800 leading-relaxed">
        ${childrenHtml}
      </div>
    </details>
  `;
}

// กล่องข้อความ (Callout): ส่วนแรกของข้อความจะถูกทำเป็นเหมือนหัวข้อ, ส่วนที่เหลือเป็นเนื้อหา
function renderCalloutBlock(block: any): string {
  const richArr = block.callout.rich_text ?? [];
  const icon =
    block.callout.icon?.emoji ||
    block.callout.icon?.external?.url ||
    block.callout.icon?.file?.url ||
    "💡";

  const firstPiece = richArr.length > 0 ? [richArr[0]] : [];
  const restPieces = richArr.length > 1 ? richArr.slice(1) : [];

  const headingHtml = firstPiece.length
    ? `<div class="font-semibold text-gray-900 leading-snug">${renderRichText(
        firstPiece as any
      )}</div>`
    : "";

  const bodyHtml = restPieces.length
    ? `<div class="text-gray-800 leading-relaxed mt-1">${renderRichText(
        restPieces as any
      )}</div>`
    : "";

  return `
    <div class="mb-4 flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-gray-800">
      <div class="shrink-0 text-xl leading-none">${escapeHtml(
        String(icon)
      )}</div>
      <div class="flex-1">
        ${headingHtml}${bodyHtml}
      </div>
    </div>
  `;
}

// ฟังก์ชันหลักในการแปลง
export function renderBlocksToHtml(blocks: any[]): string {
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const { type } = block;

    if (type === "paragraph") {
      const rich = block.paragraph.rich_text ?? [];
      htmlParts.push(
        `<p class="mb-4 leading-relaxed text-gray-800">${renderRichText(
          rich
        )}</p>`
      );
      continue;
    }

    if (type === "heading_1") {
      const rich = block.heading_1.rich_text ?? [];
      htmlParts.push(
        `<h1 class="mt-8 mb-4 text-3xl font-bold text-gray-900">${renderRichText(
          rich
        )}</h1>`
      );
      continue;
    }

    if (type === "heading_2") {
      const rich = block.heading_2.rich_text ?? [];
      const hasChildrenFlag = !!block.has_children;
      const childrenBlocks = Array.isArray(block.children)
        ? block.children
        : [];
      // แนวคิดการดีบักที่คล้ายกันสำหรับหัวข้อที่มีเนื้อหาย่อย
      let childrenInfo = "";
      if (hasChildrenFlag && childrenBlocks.length === 0) {
        childrenInfo = `<div class="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
          child blocks not loaded (heading_2 id ${escapeHtml(
            block.id || ""
          )})
        </div>`;
      }
      htmlParts.push(
        `<section class="mt-8 mb-6">
          <h2 class="mb-3 text-2xl font-semibold text-gray-900">${renderRichText(
            rich
          )}</h2>
          ${
            childrenBlocks.length > 0
              ? `<div>${renderBlocksToHtml(childrenBlocks)}</div>`
              : childrenInfo
          }
        </section>`
      );
      continue;
    }

    if (type === "heading_3") {
      const rich = block.heading_3.rich_text ?? [];
      htmlParts.push(
        `<h3 class="mt-6 mb-2 text-xl font-semibold text-gray-900">${renderRichText(
          rich
        )}</h3>`
      );
      continue;
    }

    if (type === "bulleted_list_item") {
      const rich = block.bulleted_list_item.rich_text ?? [];
      const hasChildrenFlag = !!block.has_children;
      const childrenBlocks = Array.isArray(block.children)
        ? block.children
        : [];

      let nestedHtml = "";
      if (childrenBlocks.length > 0) {
        nestedHtml = renderBlocksToHtml(childrenBlocks);
      } else if (hasChildrenFlag) {
        nestedHtml = `<div class="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 ml-6">
          child blocks not loaded (bulleted_list_item id ${escapeHtml(
            block.id || ""
          )})
        </div>`;
      }

      htmlParts.push(
        `<li class="ml-6 list-disc text-gray-800 leading-relaxed mb-2">
          ${renderRichText(rich)}
          ${
            nestedHtml
              ? `<div class="mt-2">${nestedHtml}</div>`
              : ""
          }
        </li>`
      );
      continue;
    }

    if (type === "numbered_list_item") {
      const rich = block.numbered_list_item.rich_text ?? [];
      const hasChildrenFlag = !!block.has_children;
      const childrenBlocks = Array.isArray(block.children)
        ? block.children
        : [];

      let nestedHtml = "";
      if (childrenBlocks.length > 0) {
        nestedHtml = renderBlocksToHtml(childrenBlocks);
      } else if (hasChildrenFlag) {
        nestedHtml = `<div class="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 ml-6">
          child blocks not loaded (numbered_list_item id ${escapeHtml(
            block.id || ""
          )})
        </div>`;
      }

      htmlParts.push(
        `<li class="ml-6 list-decimal text-gray-800 leading-relaxed mb-2">
          ${renderRichText(rich)}
          ${
            nestedHtml
              ? `<div class="mt-2">${nestedHtml}</div>`
              : ""
          }
        </li>`
      );
      continue;
    }

    if (type === "to_do") {
      const rich = block.to_do.rich_text ?? [];
      const checked = block.to_do.checked;
      htmlParts.push(
        `<div class="flex items-start gap-2 mb-2 ml-1">
          <input
            type="checkbox"
            disabled
            ${checked ? "checked" : ""}
            class="mt-1 h-4 w-4 rounded border-gray-400 text-blue-600"
          />
          <div class="leading-relaxed text-gray-800">${renderRichText(
            rich
          )}</div>
        </div>`
      );
      continue;
    }

    if (type === "toggle") {
      htmlParts.push(renderToggleBlock(block));
      continue;
    }

    if (type === "quote") {
      const rich = block.quote.rich_text ?? [];
      htmlParts.push(
        `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">${renderRichText(
          rich
        )}</blockquote>`
      );
      continue;
    }

    if (type === "callout") {
      htmlParts.push(renderCalloutBlock(block));
      continue;
    }

    if (type === "code") {
      const codeText =
        block.code.rich_text
          ?.map((t: any) => t.plain_text)
          .join("") ?? "";
      const lang = block.code.language ?? "";
      htmlParts.push(
        `<pre class="mb-4 rounded bg-gray-900 p-4 text-sm text-gray-100 overflow-x-auto"><code class="language-${lang}">${escapeHtml(
          codeText
        )}</code></pre>`
      );
      continue;
    }

    if (type === "divider") {
      htmlParts.push(`<hr class="my-8 border-gray-300" />`);
      continue;
    }

    if (type === "image") {
      const imgUrl =
        block.image.type === "external"
          ? block.image.external?.url
          : block.image.file?.url;
      const captionText = renderRichText(block.image.caption ?? []);
      if (imgUrl) {
        htmlParts.push(
          `<figure class="my-6">
            <img
              src="${imgUrl}"
              alt=""
              class="rounded-md border border-gray-200 max-w-full h-auto mx-auto"
            />
            ${
              captionText
                ? `<figcaption class="mt-2 text-center text-sm text-gray-500">${captionText}</figcaption>`
                : ""
            }
          </figure>`
        );
      } else {
        htmlParts.push(
          `<div class="my-6 text-sm text-gray-500">cannot render block type image (no url)</div>`
        );
      }
      continue;
    }

    if (type === "video") {
      const videoData = block.video;
      const videoUrl =
        videoData.type === "external"
          ? videoData.external?.url
          : videoData.file?.url;
      const captionText = renderRichText(videoData.caption ?? "");

      if (!videoUrl) {
        htmlParts.push(
          `<div class="my-6 text-sm text-gray-500">cannot render block type video (no url)</div>`
        );
        continue;
      }

      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const embedUrl = videoUrl
          .replace("watch?v=", "embed/")
          .replace("youtu.be/", "www.youtube.com/embed/");
        htmlParts.push(
          `<figure class="my-6">
            <div class="aspect-video w-full overflow-hidden rounded-md border border-gray-200">
              <iframe
                src="${embedUrl}"
                class="h-full w-full"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
            ${
              captionText
                ? `<figcaption class="mt-2 text-center text-sm text-gray-500">${captionText}</figcaption>`
                : ""
            }
          </figure>`
        );
        continue;
      }

      if (videoUrl.includes("vimeo.com")) {
        const embedUrl = videoUrl.replace(
          /vimeo\.com\/(\d+)/,
          "player.vimeo.com/video/$1"
        );
        htmlParts.push(
          `<figure class="my-6">
            <div class="aspect-video w-full overflow-hidden rounded-md border border-gray-200">
              <iframe
                src="${embedUrl}"
                class="h-full w-full"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
            ${
              captionText
                ? `<figcaption class="mt-2 text-center text-sm text-gray-500">${captionText}</figcaption>`
                : ""
            }
          </figure>`
        );
        continue;
      }

      htmlParts.push(
        `<figure class="my-6">
          <video
            src="${videoUrl}"
            controls
            class="w-full rounded-md border border-gray-200"
          ></video>
          ${
            captionText
              ? `<figcaption class="mt-2 text-center text-sm text-gray-500">${captionText}</figcaption>`
              : ""
          }
        </figure>`
      );
      continue;
    }

    if (type === "embed") {
      const url = block.embed.url;
      if (
        typeof url === "string" &&
        (url.includes("youtube.com") || url.includes("youtu.be"))
      ) {
        const embedUrl = url
          .replace("watch?v=", "embed/")
          .replace("youtu.be/", "www.youtube.com/embed/");
        htmlParts.push(
          `<div class="my-6 aspect-video w-full max-w-full overflow-hidden rounded-md border border-gray-200">
            <iframe
              src="${embedUrl}"
              class="h-full w-full"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>`
        );
      } else {
        htmlParts.push(
          `<div class="my-6 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm break-words">
            <a
              href="${url}"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 underline"
            >${escapeHtml(url)}</a>
          </div>`
        );
      }
      continue;
    }

    if (type === "bookmark") {
      const url = block.bookmark.url;
      const captionText = renderRichText(block.bookmark.caption ?? []);
      htmlParts.push(
        `<a
          href="${url}"
          target="_blank"
          rel="noopener noreferrer"
          class="block my-4 rounded-md border border-gray-200 bg-white p-4 hover:bg-gray-50"
        >
          <div class="text-blue-600 underline">${escapeHtml(
            url
          )}</div>
          ${
            captionText
              ? `<div class="text-sm text-gray-600 mt-1 leading-relaxed">${captionText}</div>`
              : ""
          }
        </a>`
      );
      continue;
    }

    if (type === "table") {
      const hasChildrenFlag = !!block.has_children;
      const childrenBlocks = Array.isArray(block.children)
        ? block.children
        : [];

      if (childrenBlocks.length === 0 && hasChildrenFlag) {
        htmlParts.push(
          `<div class="overflow-x-auto my-6 border border-yellow-300 rounded-md text-xs text-yellow-800 bg-yellow-50 p-3">
            child blocks not loaded (table id ${escapeHtml(block.id || "")})
          </div>`
        );
        continue;
      }

      // กรณีที่โหลดข้อมูลแถวของตารางมาแล้ว:
      const rowsHtml = childrenBlocks
        .map((row: any) => {
          if (row.type !== "table_row") return "";
          const cells = row.table_row.cells ?? [];
          const rowHtml = cells
            .map((cell: any[]) => {
              return `<td class="border border-gray-200 px-3 py-2 align-top">${renderRichText(
                cell as any
              )}</td>`;
            })
            .join("");
          return `<tr class="align-top bg-white even:bg-gray-50">${rowHtml}</tr>`;
        })
        .join("");

      htmlParts.push(
        `<div class="overflow-x-auto my-6 border border-gray-200 rounded-md text-sm text-gray-800">
          <table class="min-w-full border-collapse">
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>`
      );
      continue;
    }

    if (type === "table_row") {
      // ปกติแล้ว table_row จะถูกจัดการโดยฟังก์ชันของ table ด้านบน
      const cells = block.table_row.cells ?? [];
      const rowHtml = cells
        .map((cell: any[]) => {
          return `<td class="border border-gray-200 px-3 py-2 align-top">${renderRichText(
            cell as any
          )}</td>`;
        })
        .join("");
      htmlParts.push(
        `<tr class="align-top bg-white even:bg-gray-50">${rowHtml}</tr>`
      );
      continue;
    }

    htmlParts.push(
      `<div class="mb-4 rounded bg-yellow-50 p-3 text-xs text-yellow-900 overflow-x-auto">
        cannot render block type ${escapeHtml(type)}
      </div>`
    );
  }

  return wrapLists(htmlParts).join("\n");
}

// จัดกลุ่ม <li> ที่อยู่ติดกันให้อยู่ในแท็ก <ul> หรือ <ol>
function wrapLists(parts: string[]): string[] {
  const out: string[] = [];
  let buffer: string[] = [];
  let currentListType: "ul" | "ol" | null = null;

  function flushBuffer() {
    if (buffer.length === 0) return;
    if (currentListType === "ul") {
      out.push(`<ul class="mb-4">${buffer.join("\n")}</ul>`);
    } else if (currentListType === "ol") {
      out.push(`<ol class="mb-4">${buffer.join("\n")}</ol>`);
    } else {
      out.push(...buffer);
    }
    buffer = [];
    currentListType = null;
  }

  for (const part of parts) {
    const isBulletItem = part.includes("list-disc");
    const isNumberItem = part.includes("list-decimal");

    if (isBulletItem || isNumberItem) {
      const desiredType = isBulletItem ? "ul" : "ol";

      if (currentListType === null) {
        currentListType = desiredType;
        buffer.push(part);
        continue;
      }

      if (currentListType === desiredType) {
        buffer.push(part);
        continue;
      }

      flushBuffer();
      currentListType = desiredType;
      buffer.push(part);
    } else {
      flushBuffer();
      out.push(part);
    }
  }

  flushBuffer();
  return out;
}