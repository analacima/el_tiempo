import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://analacima.github.io'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmEubGFjaW1hQGdtYWlsLmNvbSIsImp0aSI6ImMzYzU5ODFlLTNmOTUtNDk0MC04NGFkLWMxMWRjNDYyMTRkMCIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNzQxNTQzOTQ5LCJ1c2VySWQiOiJjM2M1OTgxZS0zZjk1LTQ5NDAtODRhZC1jMTFkYzQ2MjE0ZDAiLCJyb2xlIjoiIn0.OvrYpcVXQ-O6TgoHE0kmM-UVVS1V13kLTCHuuBj4COs';

// Proxy para la predicción horaria
app.get('/api/prediccion/horaria/:municipioId', async (req, res) => {
    try {
        const { municipioId } = req.params;
        const response = await fetch(
            `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${municipioId}?api_key=${API_KEY}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la API de AEMET: ${response.status}`);
        }

        const data = await response.json();

        if (data.datos) {
            const dataResponse = await fetch(data.datos);
            const weatherData = await dataResponse.json();
            res.json(weatherData);
        } else {
            throw new Error('No se encontraron datos');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy para la predicción diaria
app.get('/api/prediccion/diaria/:municipioId', async (req, res) => {
    try {
        const { municipioId } = req.params;
        const response = await fetch(
            `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${municipioId}?api_key=${API_KEY}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la API de AEMET: ${response.status}`);
        }

        const data = await response.json();

        if (data.datos) {
            const dataResponse = await fetch(data.datos);
            const weatherData = await dataResponse.json();
            res.json(weatherData);
        } else {
            throw new Error('No se encontraron datos');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log(`Servidor proxy ejecutándose en el puerto 3001`);
});
