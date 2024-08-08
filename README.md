## ![NextJs Ecommerce Web App](/public/readme/🖥NextJs_Ecommerce_Web_App🛒.png)

This is a [Next.js](https://nextjs.org/) ecommerce web app project made with the intention to be hosted on [Vercel](https://vercel.com/). It features a User portal secured with [NextAuth.js](https://next-auth.js.org/) for Authentication and Authorization, [Stripe](https://stripe.com/) for handling payments, and a PostgreSQL database via [Supabase](https://supabase.com/) which stores user, product, and order data.

# Before You Use

Set up environment variables using .env.example as a resource to set your own .env file (local development) or vercel environment variables (production).

![.env file](/public/readme/carbon-env-example.png)

# Local Deployment

Requires:

- [Git](https://github.com/txzira/next-js-ecommerce.git)
- [Node and Npm](https://nodejs.org/en/download/package-manager)

Open a Terminal and enter the following:

![Terminal Instructions](/public/readme/carbon-local-deployment.png)

Navigate to [http://localhost:3000](http://localhost:3000) via your browser.

# Production Deployment (Vercel)

The easiest way to deploy this Next.js app is to use the Vercel Platform from the creators of Next.js.

1. Push a copy of this repository to your own github.
2. [Create](https://vercel.com/signup) an account with Vercel or [login](https://vercel.com/login).
3. Link your Github account to Vercel if you did not sign up to Vercel with your github account.
4. [Create](https://vercel.com/new) a new project and import this project that you pushed to your github account.

   ![Create Project](/public/readme/create-vercel-project.png)

5. Configure project.

a. Enter the name of your project and change the build command to account for prisma.

![Config 1](/public/readme/project-config-1.png)

b. Fill out environment variables.

![Config 2](/public/readme/project-config-2.png)

c. Deploy your application!

![Config 3](/public/readme/project-config-3.png)

Check out our Next.js deployment documentation for more details.

<!-- # How to Use

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font. -->
