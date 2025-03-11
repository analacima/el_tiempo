// Importación de dependencias de React y React Bootstrap
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Importación de datos de municipios
import municipiosData from './data/municipios.json';


function App() {
  // Estados para manejar la selección de ubicación y datos meteorológicos
  const [selectedProvincia, setSelectedProvincia] = useState('50'); // '50' es el código de Zaragoza
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  
  // Cargamos Zaragoza inicialmente
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
     // Buscamos Zaragoza como provincia y como municipio
      const zaragozaProvincia = municipiosData.provincias.find(p => p.id === '50');
      if (zaragozaProvincia) {

        const zaragoza = zaragozaProvincia.municipios.find(m => m.id === '50297');
        if (zaragoza) {
          await handleMunicipioSelect(zaragoza);
        }
      }
    };

    initializeData();
  }, []);

  /**
   * Buscamos los datos de la provincia que hemos seleccionado
   */
  const selectedProvinciaData = selectedProvincia
    ? municipiosData.provincias.find(p => p.id === selectedProvincia)
    : null;


   // Función para convertir la descripción del tiempo en un emoji
   const getWeatherIcon = (descripcion) => {
    if (!descripcion) return '❓';
    
    const estadoNormalizado = descripcion.toLowerCase();
    
    // Mapeo de estados del tiempo a emojis
    const iconos = {
      'despejado': '☀️',
      'despejada': '☀️',
      'poco nuboso': '🌤️',
      'intervalos nubosos': '⛅',
      'nuboso': '☁️',
      'muy nuboso': '☁️',
      'cubierto': '☁️',
      'lluvia': '🌧️',
      'lluvioso': '🌧️',
      'lluvia débil': '🌦️',
      'nieve': '🌨️',
      'tormenta': '⛈️',
      'niebla': '🌫️'
    };

    // Busca coincidencia exacta
    if (iconos[estadoNormalizado]) {
      return iconos[estadoNormalizado];
    }

    // Busca coincidencia parcial
    for (const [estado, icono] of Object.entries(iconos)) {
      if (estadoNormalizado.includes(estado)) {
        return icono;
      }
    }

    // Si no hay coincidencia, devuelve un icono por defecto
    return '🌥️';
  };

  //Función para obtener el nombre del día de la semana
  const getDayName = (fecha) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[new Date(fecha).getDay()];
  };

  //Función que se ejecuta cuando se selecciona un municipio
  const handleMunicipioSelect = async (municipio) => {
    if (!municipio) return;
    
    setSelectedMunicipio(municipio);
    setLoading(true);
    setWeatherData(null);
    
    try {
      // Obtiene los datos meteorológicos del municipio seleccionado
      const response = await fetch(`http://localhost:3001/api/prediccion/diaria/${municipio.id}`);
      const weatherInfo = await response.json();
      if (weatherInfo?.[0]?.prediccion?.dia) {
        setWeatherData(weatherInfo);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-3">
      {/* Formulario de selección de ubicación */}
      <Row className="mb-3">
        <Col>
          <Form>
            {/* Selector de provincia */}
            <Form.Group className="mb-3">
              <Form.Select
                value={selectedProvincia}
                onChange={(e) => setSelectedProvincia(e.target.value)}
              >
                {municipiosData.provincias.map(provincia => (
                  <option key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Selector de municipio - solo se muestra si hay una provincia seleccionada */}
            {selectedProvinciaData && (
              <Form.Group className="mb-3">
                <Form.Select
                  value={selectedMunicipio?.id || ''}
                  onChange={(e) => {
                    const municipio = selectedProvinciaData.municipios.find(m => m.id === e.target.value);
                    handleMunicipioSelect(municipio);
                  }}
                >
                  <option value="">Selecciona una localidad</option>
                  {selectedProvinciaData.municipios.map(municipio => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Col>
      </Row>

      {/* Indicador de carga */}
      {loading && <div className="text-center">Cargando...</div>}

      {/* Visualización de datos meteorológicos */}
      {weatherData && (
        <Row>
          {weatherData[0].prediccion.dia.map((dia, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
              <Card>
                <Card.Body className="text-center">
                  <h5>{getDayName(dia.fecha)}</h5>
                  <div className="weather-icon">
                    {getWeatherIcon(dia.estadoCielo[0]?.descripcion)}
                  </div>
                  <p className="temp">
                    {dia.temperatura.maxima}°C / {dia.temperatura.minima}°C
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default App;
