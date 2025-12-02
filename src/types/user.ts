export interface IUser {
    _id?: string;
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

    createdAt?: string;
    updatedAt?: string;
}
