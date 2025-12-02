import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types/user';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const MOCK_USER: IUser = {
  _id: "64a1b2c3d4e5f67890123456",
  name: "Ana Rodríguez",
  email: "ana.rodriguez@email.com",
  url_photo: "https://ejemplo.com/fotos/ana.jpg",
  role: "fixer", // Set to fixer for dashboard testing
  authProviders: [
    {
      provider: "email",
      providerId: "ana.rodriguez@email.com",
      password: "$2b$10$hashedpassword123"
    }
  ],
  telefono: "+59892345678",
  ubicacion: {
    lat: -34.9011,
    lng: -56.1645,
    direccion: "Av. 18 de Julio 1234",
    departamento: "Montevideo",
    pais: "Uruguay"
  },
  ci: "1.234.567-8",
  servicios: [],
  vehiculo: {
    hasVehiculo: false,
    tipoVehiculo: ""
  },
  fixerProfile: "",
  acceptTerms: true,
  metodoPago: {
    hasEfectivo: false,
    qr: false,
    tarjetaCredito: false
  },
  experience: {
    descripcion: ""
  },
  workLocation: {
    lat: -16.5,
    lng: -68.15,
    direccion: "",
    departamento: "",
    pais: ""
  },
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
};

const initialState: UserState = {
  user: MOCK_USER,
  isAuthenticated: true,
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setLoading, logout } = userSlice.actions;

export default userSlice.reducer;