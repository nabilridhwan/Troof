# Troof!

> We have moved to a monorepo for our project, which is a version control repository that contains all of the code for our project in a single location. This is different from the traditional approach, where each application or package would have its own separate repository.

## Folders and Packages

```bash
-   apps
    -   services # Backend services (Express.js)
    -   web # Frontend web (Next.js)
-   packages
    -   database # Database utils (Prisma)
    -   helpers # Helper functions used both in backend and frontend
    -   responses # Response utils (Express.js)
    -   socket # Socket utils types (Socket.io) and events that are used in both backend and frontend
    -   truth-or-dare-generator # Separate package for data cleansing truth and dares
    -   ui # UI components (React)
```

## Commands

The main commands can be read in the main `package.json` file. Each `turbo run <X>` command will run `<X>` in each repository if found. So example web and admin has a `turbo run dev` command, which will run `dev` in both repositories.
