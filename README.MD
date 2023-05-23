# UpPromote Hydrogen App

## Installation

### Step 1: Create a new Hydrogen app

You can create a Hydrogen app locally using yarn, npm, or npx.
> NOTE: If you've already created a Hydrogen app, you can jump ahead to Step 4

If you want to [integrate with an existing React framework](https://shopify.dev/docs/custom-storefronts/hydrogen-react),
like [Next.js](https://nextjs.org/) or [Gatsby](https://www.gatsbyjs.com/), then you can add the
[@shopify/hydrogen](https://www.npmjs.com/package/@shopify/hydrogen) NPM package to your project.

We only support development framework <b>Hydrogen version 2</b> and above. You can learn how to upgrade to <b>Hydrogen
version 2</b> using
this [link](https://shopify.dev/docs/custom-storefronts/hydrogen/migrate-hydrogen-remix)

1. Navigate to your working directory.
   ```shell
   cd <directory>
   ```
2. Create your project.

   Create a new Hydrogen project with a default template linked to a demo-store with the
   following [this tutorial](https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started/quickstart):

### Step 2: Link your Shopify Storefront

Connect your Hydrogen app to your Shopify storefront by updating the properties in the `.env` file. You will
need
to [generate a Storefront API access token](https://help.shopify.com/en/manual/apps/app-types/custom-apps?shpxid=5ef5d325-B992-4F4F-3A6D-0FACECA2B482#install-the-app-and-get-the-api-access-tokens)
for your Hydrogen app to communicate with your Shopify store.

### Step 3: Start a development server

Create a new local development server to start testing your changes.

1. Navigate to the root of your project directory:

   ```shell
   cd <directory>
   ```

2. Start the development server

   Start up a new local development server on `localhost:`
   ```shell
   npm run dev
   ```
   The development environment will open at http://localhost:3000.

### Step 4: Install Uppromote + Hydrogen Package

1. Install Uppromote Package
   ```shell
   npm install uppromote-hydrogen
   ```
2. Open root file (`root.tsx` | `root.js`) and add Uppromote Component

```typescript jsx

<html lang={locale.language}>
<head>
    ...
</head>
<body>
...
<Await resolve={data.cart}>
    {(cart) => (
        <Uppromote
            cart={data.cart}
            publicStoreDomain={PUBLIC_STORE_DOMAIN}
            publicStorefrontApiToken={PUBLIC_STORE_FRONT_API_TOKEN}
            publicStorefrontApiVersion={PUBLIC_STOREFRONT_API_VERSION}
            uppromoteAccessToken={UPPROMOTE_ACCESS_TOKEN}
        />
    )}
</Await>
</body>
</html>
```

- Fill your token information to Uppromote component. You need to provide `Cart` for the app to work. Read the [documentation](https://shopify.dev/docs/custom-storefronts/hydrogen/cart/fetch) to know how to fetch the Cart

- You can get Uppromote Access Token in your [app setting](https://af.uppromote.com/admin/settings/integration)

### Step 5: API

We provide you with several APIs to help develop your store

1. On affiliate tracked event

   ```js
   window.addEventListener('uppromote:tracked-affiliate', function (event) {
       console.log(event.detail)
   })
   ```

2. On pulled facebook pixel

   ```js
   window.addEventListener('uppromote:pull-fb-pixel', function (event) {
       const { affiliateId, pixel } = event.detail
   })
   ```
