This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Para obtener los datos del usuario tanto fixer como requester

utilizar el hook useSelector

const { user, loading } = useSelector((state: RootState) => state.user);
user es un usuario requester o fixer

export interface IUser {
\_id?: string;
id?: string;
name: string;
email: string;
url_photo?: string;
role: "requester" | "fixer" | "admin";

    authProviders?: Array<{
        provider: string;
        providerId: string;
        password?: string;
    }>;

    telefono?: string;

    ubicacion?: {
        lat?: number;
        lng?: number;
        direccion?: string;
        departamento?: string;
        pais?: string;
    };

    ci?: string;
    servicios?: string[];

    vehiculo?: {
        hasVehiculo?: boolean;
        tipoVehiculo?: string;
    };

    fixerProfile?: string;
    acceptTerms?: boolean;

    metodoPago?: {
        hasEfectivo?: boolean;
        qr?: boolean;
        tarjetaCredito?: boolean;
    };

    experience?: {
        descripcion?: string;
    };

    workLocation?: {
        lat?: number;
        lng?: number;
        direccion?: string;
        departamento?: string;
        pais?: string;
    };
    description?: string;
    createdAt?: string;
    updatedAt?: string;

}
