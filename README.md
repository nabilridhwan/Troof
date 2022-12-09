<p align="center">
  <img src="./docs/troof_promo_new_new.png" width=500 />
</p>

<h1 align="center">Troof</h1>

<h3 align="center">
  Experience the ultimate social truth or dare game - see, chat, and react together with up to 8 friends!
</h3>

<hr>

<div align="center">

## Status

![Deployment Status](https://img.shields.io/github/deployments/nabilridhwan/troof/production?label=deployment)
![](https://img.shields.io/website?label=backend&up_message=online&url=https%3A%2F%2Ftroofservice.nabilridhwan.com%2F)
![](https://img.shields.io/website?label=frontend&up_message=online&url=https%3A%2F%2Ftroof.nabilridhwan.com)

</div>

<hr>

<div align="center">

## Latest Versions

![](https://img.shields.io/github/package-json/v/nabilridhwan/troof?filename=apps%2Fweb%2Fpackage.json&label=web)
![](https://img.shields.io/github/package-json/v/nabilridhwan/troof?filename=apps%2Fservices%2Fpackage.json&label=services)

</div>

<hr>

<div align="center">

## Powered by

![](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)
![](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
![](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![](htts://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

</div>
<hr>

## Turborepo/monorepo

> We have moved to a monorepo for our project, which is a version control repository that contains all of the code for our project in a single location. This is different from the traditional approach, where each application or package would have its own separate repository.

## Folders and Packages

```bash
-   apps
    -   services # Backend services (Express.js)
    -   web # Frontend web (Next.js)
-   packages
    -   api # API utils (Axios)
    -  config # Shared config of tailwind, postcss, prettier and many more.
    -   database # Database utils (Prisma)
    -   gifpicker # Gif picker component (React, powered by Tenor)
    -   helpers # Helper functions used both in backend and frontend
    -   responses # Response utils (Express.js)
    -   socket # Socket utils types (Socket.io) and events that are used in both backend and frontend
    -   truth-or-dare # Separate package for data cleansing truth and dares
      - output # Output folder for all the truth and dares (re-run the build to update the data)
    -   ui # UI components (React)
```

## Adding a new package

### Take for example I want to add a new package called `math`:

Since this project is built using TypeScript, it is important to add the `tsconfig.json` file to the root of the package.

1.  Create a `package.json` in the directory and prepend the package name with `@troof/` (e.g. `@troof/math`). This will be used to reference the package in other packages.
2.  Add the `tsconfig.json` file to the root of the package. This will be used to compile the TypeScript code to JavaScript.
3.  Back in the `package.json` file, add the `build` and `dev` scripts. The `build` script will be used to compile the TypeScript code to JavaScript and the `dev` script will be used to watch for changes in the TypeScript code and compile it to JavaScript.
4.  Add the `main` and `types` fields to the `package.json` file. The `main` field will be used to reference the compiled JavaScript code and the `types` field will be used to reference the TypeScript type definitions.
5.  Add the `private` field to the `package.json` file and set it to `true`. This will prevent the package from being published to the npm registry and also to allow for successful installation of the package in other packages.
6.  Run `yarn dev` in the root folder of the package to start watching for changes in the TypeScript code and compile it to JavaScript.
7.  In another package that needs `@troof/math`, include it in the `package.json` file and run `yarn` to install the package.

```json
{
	"dependencies": {
		"@troof/math": "*"
	}
}
```

8.  Remember to lint, test and run the package before pushing it to deployment.

## Commands

The main commands can be read in the main `package.json` file. Each `turbo run <X>` command will run `<X>` in each repository if found. So example web and admin has a `turbo run dev` command, which will run `dev` in both repositories.
