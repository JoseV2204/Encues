import { useState } from 'react'
import './Admin.css'

interface Respuesta {
  id: number;
  respuestas: string;
}

interface FormData {
  facultad: string;
  situacion: string;
  completoMatricula: string;
  intentos: string;
  contactoSoporte: string;
  problemas: string[];
  problemaMasGrave: string;
  nivelFrustracion: number;
  satisfaccion: number;
  recomendacion: number;
  utilidadSoporte: string;
  queChangarias: string;
  sugerencias: string;
  timestamp: string;
}

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRespuesta, setSelectedRespuesta] = useState<FormData | null>(null);
  const [error, setError] = useState('');

  // Contraseña desde variables de entorno
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password ingresada:', password);
    console.log('Password esperada:', ADMIN_PASSWORD);
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      fetchRespuestas();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const fetchRespuestas = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/respuestas`);
      if (response.ok) {
        const data = await response.json();
        console.log('Respuestas recibidas:', data);
        setRespuestas(data);
      } else {
        setError('Error al cargar las respuestas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const viewRespuesta = (respuesta: Respuesta) => {
    try {
      const parsed = JSON.parse(respuesta.respuestas);
      console.log('Respuesta parseada:', parsed);
      setSelectedRespuesta(parsed);
    } catch (error) {
      console.error('Error al parsear respuesta:', error);
      alert('Error al cargar los detalles de la respuesta');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Fecha',
      'Facultad',
      'Situación',
      'Completó Matrícula',
      'Intentos',
      'Contactó Soporte',
      'Problemas',
      'Problema Más Grave',
      'Nivel Frustración',
      'Satisfacción',
      'Recomendación',
      'Utilidad Soporte',
      'Qué Cambiarías',
      'Sugerencias'
    ];

    const rows = respuestas.map(r => {
      const data: FormData = JSON.parse(r.respuestas);
      return [
        r.id,
        new Date(data.timestamp).toLocaleString(),
        data.facultad,
        data.situacion,
        data.completoMatricula,
        data.intentos,
        data.contactoSoporte,
        data.problemas.join('; '),
        data.problemaMasGrave,
        data.nivelFrustracion,
        data.satisfaccion,
        data.recomendacion,
        data.utilidadSoporte,
        `"${data.queChangarias.replace(/"/g, '""')}"`,
        `"${data.sugerencias.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `encuestas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStats = () => {
    if (respuestas.length === 0) return null;

    const parsed = respuestas.map(r => JSON.parse(r.respuestas) as FormData);
    
    const avgSatisfaccion = parsed.reduce((sum, r) => sum + r.satisfaccion, 0) / parsed.length;
    const avgRecomendacion = parsed.reduce((sum, r) => sum + r.recomendacion, 0) / parsed.length;
    const avgFrustracion = parsed.reduce((sum, r) => sum + r.nivelFrustracion, 0) / parsed.length;

    const completaron = parsed.filter(r => r.completoMatricula !== 'No, no pude finalizarla').length;
    const contactaronSoporte = parsed.filter(r => r.contactoSoporte === 'Sí').length;

    return {
      total: respuestas.length,
      avgSatisfaccion: avgSatisfaccion.toFixed(1),
      avgRecomendacion: avgRecomendacion.toFixed(1),
      avgFrustracion: avgFrustracion.toFixed(1),
      completaron,
      porcentajeCompletaron: ((completaron / respuestas.length) * 100).toFixed(1),
      contactaronSoporte,
      porcentajeSoporte: ((contactaronSoporte / respuestas.length) * 100).toFixed(1)
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h1>🔒 Panel de Administración</h1>
          <p>Acceso restringido</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-login">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>📊 Panel de Administración</h1>
          <div className="admin-actions">
            <button onClick={fetchRespuestas} className="btn-refresh">
              🔄 Actualizar
            </button>
            <button onClick={exportToCSV} className="btn-export" disabled={respuestas.length === 0}>
              📥 Exportar CSV
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="btn-logout">
              🚪 Salir
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <>
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Respuestas Totales</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">😊</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.avgSatisfaccion}/5</div>
                  <div className="stat-label">Satisfacción Promedio</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.avgRecomendacion}/10</div>
                  <div className="stat-label">NPS Promedio</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">😤</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.avgFrustracion}/5</div>
                  <div className="stat-label">Frustración Promedio</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.porcentajeCompletaron}%</div>
                  <div className="stat-label">Completaron Matrícula</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.porcentajeSoporte}%</div>
                  <div className="stat-label">Contactaron Soporte</div>
                </div>
              </div>
            </div>
          )}

          <div className="respuestas-section">
            <h2>Respuestas Individuales ({respuestas.length})</h2>
            {respuestas.length === 0 ? (
              <p>No hay respuestas aún.</p>
            ) : (
              <div className="respuestas-list">
                {respuestas.map((resp) => {
                  try {
                    const data: FormData = JSON.parse(resp.respuestas);
                    return (
                      <div key={resp.id} className="respuesta-item">
                        <div className="respuesta-header">
                          <span className="respuesta-id">ID: {resp.id}</span>
                          <span className="respuesta-fecha">
                            {new Date(data.timestamp).toLocaleString()}
                          </span>
                          <button 
                            onClick={() => viewRespuesta(resp)}
                            className="btn-view"
                          >
                            Ver detalle
                          </button>
                        </div>
                        <div className="respuesta-preview">
                          <span><strong>Facultad:</strong> {data.facultad}</span>
                          <span><strong>Satisfacción:</strong> {data.satisfaccion}/5</span>
                          <span><strong>NPS:</strong> {data.recomendacion}/10</span>
                        </div>
                      </div>
                    );
                  } catch {
                    return (
                      <div key={resp.id} className="respuesta-item">
                        <p>Error al cargar respuesta ID: {resp.id}</p>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </>
      )}

      {selectedRespuesta && (
        <div className="modal-overlay" onClick={() => setSelectedRespuesta(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle de Respuesta</h2>
              <button onClick={() => setSelectedRespuesta(null)} className="btn-close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Facultad:</label>
                <p>{selectedRespuesta.facultad}</p>
              </div>
              <div className="detail-group">
                <label>Situación académica:</label>
                <p>{selectedRespuesta.situacion}</p>
              </div>
              <div className="detail-group">
                <label>¿Completó matrícula?:</label>
                <p>{selectedRespuesta.completoMatricula}</p>
              </div>
              {selectedRespuesta.intentos && (
                <div className="detail-group">
                  <label>Intentos necesarios:</label>
                  <p>{selectedRespuesta.intentos}</p>
                </div>
              )}
              {selectedRespuesta.contactoSoporte && (
                <div className="detail-group">
                  <label>Contactó soporte:</label>
                  <p>{selectedRespuesta.contactoSoporte}</p>
                </div>
              )}
              {selectedRespuesta.problemas.length > 0 && (
                <div className="detail-group">
                  <label>Problemas experimentados:</label>
                  <ul>
                    {selectedRespuesta.problemas.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="detail-group">
                <label>Problema más grave:</label>
                <p>{selectedRespuesta.problemaMasGrave}</p>
              </div>
              <div className="detail-group">
                <label>Nivel de frustración:</label>
                <p>{selectedRespuesta.nivelFrustracion}/5</p>
              </div>
              <div className="detail-group">
                <label>Satisfacción general:</label>
                <p>{selectedRespuesta.satisfaccion}/5</p>
              </div>
              <div className="detail-group">
                <label>Recomendación (NPS):</label>
                <p>{selectedRespuesta.recomendacion}/10</p>
              </div>
              {selectedRespuesta.utilidadSoporte && (
                <div className="detail-group">
                  <label>Utilidad del soporte:</label>
                  <p>{selectedRespuesta.utilidadSoporte}</p>
                </div>
              )}
              {selectedRespuesta.queChangarias && (
                <div className="detail-group">
                  <label>¿Qué cambiarías?:</label>
                  <p>{selectedRespuesta.queChangarias}</p>
                </div>
              )}
              {selectedRespuesta.sugerencias && (
                <div className="detail-group">
                  <label>Sugerencias:</label>
                  <p>{selectedRespuesta.sugerencias}</p>
                </div>
              )}
              <div className="detail-group">
                <label>Fecha de respuesta:</label>
                <p>{new Date(selectedRespuesta.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
