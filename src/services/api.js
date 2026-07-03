import axios from 'axios';

// Crée une instance d'axios avec une configuration de base.
// Le port 5000 correspond à celui mentionné dans le cahier des charges pour le backend.
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour injecter le token JWT dans chaque requête sortante.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;