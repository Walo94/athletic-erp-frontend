import axios from 'axios';

// Define la URL base del servicio de reportes en Spring Boot
const API_BASE_URL = 'http://localhost:8080/reportes-api';

// Crea una instancia de axios con la configuración base
const reportesApiClient = axios.create({
  baseURL: API_BASE_URL,
  // Aquí podrías añadir otras configuraciones en el futuro, como headers, timeouts, etc.
  // headers: { 'Content-Type': 'application/json' }
});

export default reportesApiClient;