# Astro Notion Starter Template

![Astro Notion Starter](https://raw.githubusercontent.com/Duckrr/astro-notion/main/public/og.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Cloudflare](https://img.shields.io/badge/Deploy%20with-Cloudflare-orange)](https://pages.cloudflare.com/)

A powerful starter template for building a blazing-fast blog with [Astro](https://astro.build/) and using [Notion](https://notion.so) as a Headless CMS. Manage all your content in the familiar Notion editor and let Astro build a high-performance, static website.

**Live Demo:** [https://astro-notion.theduckrr.com/](https://astro-notion.theduckrr.com/)

---

## ✨ Features

- **Blazing Fast Performance**: Built with Astro for optimal loading speeds and a great user experience.
- **Notion as CMS**: Use the powerful and flexible Notion editor to write and organize your articles. No more complex Markdown files.
- **Easy to Customize**: Easily tweak the design and add new features with Astro and the Notion API. Minimal coding knowledge required.
- **Fully Responsive**: Looks great on all devices, from desktops to mobile phones.
- **SEO Ready**: Astro provides excellent SEO capabilities right out of the box.
- **Dynamic Tag Pages**: Automatically generates pages for each tag, listing all associated posts.
- **Recursive Block Rendering**: Supports nested blocks like toggles, lists, and headings with children.

## 🚀 Getting Started

Follow these steps to get your Astro Notion blog up and running.

### 1. Prepare Your Notion Database

The first step is to set up a Notion database to store your blog posts.

1.  **Duplicate the Template**: Go to the [**Notion Database Template**](https://www.notion.so/853c6531c1954f988c5822b3149e2908?v=6805d7a8581e4b85b19156e10bd11e6d) and click the **"Duplicate"** button in the top-right corner to copy it to your own Notion workspace.

2.  **Database Structure**: The template includes essential properties for your blog:
    - `Name`: The title of your post.
    - `Slug`: The URL-friendly identifier for the post (e.g., `getting-started`).
    - `Published`: A checkbox to control whether the post should be live.
    - `Description`: A short summary of the post.
    - `Tags`: A multi-select property for categorizing your posts.
    - `Cover`: A file property for the post's cover image.
    - `Created`: The creation date (automatically managed by Notion).

### 2. Create a Notion Integration

To allow your Astro project to fetch data from Notion, you need to create an "Integration".

1.  **Create a New Integration**:
    - Go to [My Integrations](https://www.notion.so/my-integrations).
    - Click **"+ New integration"**.
    - Give it a name (e.g., "Astro Blog") and associate it with the correct workspace.
    - Click **"Submit"**.

2.  **Copy the Secret Token**:
    - Notion will reveal an **Internal Integration Token**.
    - Copy this token and keep it safe. You will need it in the next step.
    > **⚠️ Warning**: This token is a secret. Do not expose it in your frontend code or commit it to public repositories.

3.  **Connect Integration to Your Database**:
    - Go back to the database page you duplicated in Step 1.
    - Click the three-dot menu `(...)` in the top-right corner.
    - Select **"+ Add connections"** and search for the integration you just created.
    - Confirm the connection.

### 3. Set Up Your Astro Project

Now, it's time to configure your Astro project.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Duckrr/astro-notion.git
    cd astro-notion
    ```

2.  **Create Environment Variables File**:
    - In the root directory of the project, create a new file named `.env`.
    - Add the **Notion Token** and your **Database ID** to this file.

3.  **How to Find Your `NOTION_DATABASE_ID`**:
    - Open your database in the browser. The URL will look like this: `https://www.notion.so/YOUR_WORKSPACE/DATABASE_ID?v=...`
    - The `DATABASE_ID` is the long string of characters between your workspace name and the `?v=...`.
    - For example, if the URL is `https://www.notion.so/myworkspace/853c6531c1954f988c5822b3149e2908?v=...`, your ID is `853c6531c1954f988c5822b3149e2908`.

    Your `.env` file should look like this:
    ```
    NOTION_TOKEN="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    NOTION_DATABASE_ID="853c6531c1954f988c5822b314xxxxxxx"
    ```

### 4. Run the Project

You're all set! The final step is to install dependencies and run the development server.

1.  **Install Dependencies**:
    ```bash
    npm install
    # Or using yarn, pnpm
    # yarn install
    # pnpm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

3.  **View Your Blog**: Open your browser and navigate to [http://localhost:4321](http://localhost:4321). You should now see your blog, populated with content from your Notion database!

---

## 🛠️ Tech Stack

- **[Astro](https://astro.build/)**: The web framework for building fast, content-driven websites.
- **[Notion API](https://developers.notion.com/)**: Used as a headless CMS for content management.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
- **[TypeScript](https://www.typescriptlang.org/)**: For type safety and a better developer experience.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Duckrr/astro-notion/issues).

## 📄 License

This project is [MIT](https://github.com/Duckrr/astro-notion/blob/main/LICENSE) licensed.