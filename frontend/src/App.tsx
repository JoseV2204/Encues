import { useState, useEffect } from 'react'
import './App.css'

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
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    facultad: '',
    situacion: '',
    completoMatricula: '',
    intentos: '',
    contactoSoporte: '',
    problemas: [],
    problemaMasGrave: '',
    nivelFrustracion: 0,
    satisfaccion: 0,
    recomendacion: 0,
    utilidadSoporte: '',
    queChangarias: '',
    sugerencias: ''
  });

  const [otroProblema, setOtroProblema] = useState('');
  const [otroProblemaGrave, setOtroProblemaGrave] = useState('');

  // Autosave en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('encuestaData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!showWelcome && !showThankYou) {
      localStorage.setItem('encuestaData', JSON.stringify(formData));
    }
  }, [formData, showWelcome, showThankYou]);

  const facultades = [
    "Ciencias de la Educación",
    "Administración de Empresas y Contabilidad",
    "Humanidades",
    "Derecho",
    "Arquitectura",
    "Economía",
    "Farmacia",
    "Enfermería",
    "Ciencias Naturales, Exactas y Tecnología",
    "Informática, Electrónica y Comunicación",
    "Ciencias Agropecuarias",
    "Bellas Artes (Música)",
    "Comunicación Social (Evento y Protocolo)",
    "Odontología",
    "Psicología",
    "Administración Pública"
  ];

  const problemasList = [
    "No me apareció la opción para iniciar el trámite de matrícula",
    "No me aparecieron todas las materias de mi plan de estudios",
    "Me aparecieron materias incorrectas (de otro semestre o carrera)",
    "El sistema no me reconoció como reingreso o con cambio de carrera",
    "Error al reservar: algunas materias desaparecieron o no se guardaron",
    "Me quedé sin cupos al intentar matricular",
    "No pude acceder: usuario bloqueado, contraseña no funcionaba",
    "El sistema me dijo que 'no estaba habilitado ese día'",
    "Me asignaron turno nocturno, pero quiero diurno (o viceversa)",
    "El sistema no me permitió incluir materias pendientes o de recuperación",
    "Otro problema"
  ];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProblema = (problema: string) => {
    setFormData(prev => {
      const current = prev.problemas.includes(problema);
      return {
        ...prev,
        problemas: current
          ? prev.problemas.filter(p => p !== problema)
          : [...prev.problemas, problema]
      };
    });
  };

  const getProgress = () => {
    let totalSteps = 13;
    if (formData.completoMatricula === 'No, no pude finalizarla') {
      totalSteps = 8; // Salta algunas preguntas
    }
    return Math.round((currentStep / totalSteps) * 100);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: return formData.facultad !== '';
      case 1: return formData.situacion !== '';
      case 2: return formData.completoMatricula !== '';
      case 3:
        if (formData.completoMatricula === 'No, no pude finalizarla') return true;
        return formData.intentos !== '';
      case 4:
        if (formData.completoMatricula === 'No, no pude finalizarla') return true;
        return formData.contactoSoporte !== '';
      case 5:
        if (formData.completoMatricula === 'No, no pude finalizarla') return true;
        return formData.problemas.length > 0;
      case 6: return formData.problemaMasGrave !== '';
      case 7: return formData.nivelFrustracion > 0;
      case 8: return formData.satisfaccion > 0;
      case 9: return formData.recomendacion >= 0;
      case 10: return formData.utilidadSoporte !== '';
      default: return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      alert('Por favor complete esta pregunta antes de continuar');
      return;
    }

    // Lógica condicional de salto
    if (currentStep === 2 && formData.completoMatricula === 'No, no pude finalizarla') {
      setCurrentStep(6); // Salta a pregunta 7
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 6 && formData.completoMatricula === 'No, no pude finalizarla') {
      setCurrentStep(2); // Regresa a pregunta 3
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    const dataToSubmit = {
      ...formData,
      problemas: formData.problemas.map(p => 
        p === "Otro problema" ? `Otro: ${otroProblema}` : p
      ),
      problemaMasGrave: formData.problemaMasGrave === "Otro" 
        ? `Otro: ${otroProblemaGrave}` 
        : formData.problemaMasGrave,
      timestamp: new Date().toISOString()
    };

    console.log('Datos a enviar:', dataToSubmit);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/encuesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit)
      });

      console.log('Respuesta del servidor:', response.status);
      const result = await response.json();
      console.log('Resultado:', result);

      if (response.ok) {
        localStorage.removeItem('encuestaData');
        setShowThankYou(true);
      } else {
        alert('Error al enviar la encuesta. Por favor intente de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor verifique que el servidor esté funcionando.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="welcome-screen">
        <div className="welcome-card">
          <div className="welcome-header">
            <h1>🎓 Universidad de Panamá</h1>
            <h2>Encuesta sobre el Sistema de Matrícula</h2>
          </div>
          <p className="welcome-description">
            Tu opinión es muy importante para mejorar el proceso de matrícula. 
            Esta encuesta toma aproximadamente <strong>5-7 minutos</strong>.
          </p>
          <div className="welcome-features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Confidencial</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💾</span>
              <span>Guardado automático</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Rápido y fácil</span>
            </div>
          </div>
          <button 
            className="btn-primary btn-large"
            onClick={() => setShowWelcome(false)}
          >
            Iniciar Encuesta
          </button>
        </div>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="welcome-screen">
        <div className="welcome-card thank-you-card">
          <div className="success-icon">✅</div>
          <h1>¡Gracias por tu tiempo!</h1>
          <p className="thank-you-message">
            Tus respuestas son clave para mejorar la experiencia de matrícula 
            en la Universidad de Panamá. Tu feedback ha sido registrado exitosamente.
          </p>
          <button 
            className="btn-secondary"
            onClick={() => window.location.reload()}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-container">
      <header className="survey-header header-gradient">
        <div className="header-content">
          <h1>Encuesta de Matrícula - UP</h1>
          <div className="progress-info">
            <span>{getProgress()}% completado</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
        </div>
      </header>

      <main className="survey-main">
        <div className="question-container">
          
          {currentStep === 0 && (
            <div className="pregunta" key="q1">
              <label>1. ¿A qué facultad perteneces? <span className="required">*</span></label>
              <select 
                value={formData.facultad} 
                onChange={(e) => updateField('facultad', e.target.value)}
                required
              >
                <option value="">Selecciona una opción</option>
                {facultades.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          )}

          {currentStep === 1 && (
            <div className="pregunta" key="q2">
              <label>2. ¿Cuál es tu situación académica actual? <span className="required">*</span></label>
              <div onClick={() => updateField('situacion', 'Primer año')}>
                <input 
                  type="radio" 
                  name="situacion" 
                  checked={formData.situacion === 'Primer año'}
                  onChange={() => {}}
                />
                <label>Primer año</label>
              </div>
              <div onClick={() => updateField('situacion', 'Años intermedios (2° a penúltimo)')}>
                <input 
                  type="radio" 
                  name="situacion" 
                  checked={formData.situacion === 'Años intermedios (2° a penúltimo)'}
                  onChange={() => {}}
                />
                <label>Años intermedios (2° a penúltimo)</label>
              </div>
              <div onClick={() => updateField('situacion', 'Último año / pendiente de tesis o trabajo de graduación')}>
                <input 
                  type="radio" 
                  name="situacion" 
                  checked={formData.situacion === 'Último año / pendiente de tesis o trabajo de graduación'}
                  onChange={() => {}}
                />
                <label>Último año / pendiente de tesis o trabajo de graduación</label>
              </div>
              <div onClick={() => updateField('situacion', 'Reingreso (no matriculé en uno o más semestres anteriores)')}>
                <input 
                  type="radio" 
                  name="situacion" 
                  checked={formData.situacion === 'Reingreso (no matriculé en uno o más semestres anteriores)'}
                  onChange={() => {}}
                />
                <label>Reingreso (no matriculé en uno o más semestres anteriores)</label>
              </div>
              <div onClick={() => updateField('situacion', 'Cambio de carrera (este semestre)')}>
                <input 
                  type="radio" 
                  name="situacion" 
                  checked={formData.situacion === 'Cambio de carrera (este semestre)'}
                  onChange={() => {}}
                />
                <label>Cambio de carrera (este semestre)</label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="pregunta" key="q3">
              <label>3. ¿Lograste completar tu matrícula en el sistema de la UP? <span className="required">*</span></label>
              <div onClick={() => updateField('completoMatricula', 'Sí, sin problemas')}>
                <input 
                  type="radio" 
                  name="completoMatricula" 
                  checked={formData.completoMatricula === 'Sí, sin problemas'}
                  onChange={() => {}}
                />
                <label>Sí, sin problemas</label>
              </div>
              <div onClick={() => updateField('completoMatricula', 'Sí, pero con dificultades')}>
                <input 
                  type="radio" 
                  name="completoMatricula" 
                  checked={formData.completoMatricula === 'Sí, pero con dificultades'}
                  onChange={() => {}}
                />
                <label>Sí, pero con dificultades</label>
              </div>
              <div onClick={() => updateField('completoMatricula', 'No, no pude finalizarla')}>
                <input 
                  type="radio" 
                  name="completoMatricula" 
                  checked={formData.completoMatricula === 'No, no pude finalizarla'}
                  onChange={() => {}}
                />
                <label>No, no pude finalizarla</label>
              </div>
            </div>
          )}

          {currentStep === 3 && formData.completoMatricula !== 'No, no pude finalizarla' && (
            <div className="pregunta" key="q4">
              <label>4. ¿Cuántos intentos necesitaste para completar tu matrícula? <span className="required">*</span></label>
              <div onClick={() => updateField('intentos', '1 intento')}>
                <input 
                  type="radio" 
                  name="intentos" 
                  checked={formData.intentos === '1 intento'}
                  onChange={() => {}}
                />
                <label>1 intento</label>
              </div>
              <div onClick={() => updateField('intentos', '2–3 intentos')}>
                <input 
                  type="radio" 
                  name="intentos" 
                  checked={formData.intentos === '2–3 intentos'}
                  onChange={() => {}}
                />
                <label>2–3 intentos</label>
              </div>
              <div onClick={() => updateField('intentos', '4 o más intentos')}>
                <input 
                  type="radio" 
                  name="intentos" 
                  checked={formData.intentos === '4 o más intentos'}
                  onChange={() => {}}
                />
                <label>4 o más intentos</label>
              </div>
            </div>
          )}

          {currentStep === 4 && formData.completoMatricula !== 'No, no pude finalizarla' && (
            <div className="pregunta" key="q5">
              <label>5. ¿Tuvo que contactar soporte (presencial o virtual) durante el proceso? <span className="required">*</span></label>
              <div onClick={() => updateField('contactoSoporte', 'Sí')}>
                <input 
                  type="radio" 
                  name="contactoSoporte" 
                  checked={formData.contactoSoporte === 'Sí'}
                  onChange={() => {}}
                />
                <label>Sí</label>
              </div>
              <div onClick={() => updateField('contactoSoporte', 'No')}>
                <input 
                  type="radio" 
                  name="contactoSoporte" 
                  checked={formData.contactoSoporte === 'No'}
                  onChange={() => {}}
                />
                <label>No</label>
              </div>
            </div>
          )}

          {currentStep === 5 && formData.completoMatricula !== 'No, no pude finalizarla' && (
            <div className="pregunta" key="q6">
              <label>6. Durante tu intento de matrícula, ¿experimentaste alguno de los siguientes problemas? <span className="required">*</span></label>
              <p className="helper-text">(Marca todos los que apliquen)</p>
              {problemasList.map(problema => (
                <div key={problema} onClick={() => toggleProblema(problema)}>
                  <input 
                    type="checkbox" 
                    checked={formData.problemas.includes(problema)}
                    onChange={() => {}}
                  />
                  <label>{problema}</label>
                </div>
              ))}
              {formData.problemas.includes("Otro problema") && (
                <input
                  type="text"
                  placeholder="Especifica el problema..."
                  value={otroProblema}
                  onChange={(e) => setOtroProblema(e.target.value)}
                  className="other-input"
                />
              )}
            </div>
          )}

          {currentStep === 6 && (
            <div className="pregunta" key="q7">
              <label>7. De los problemas que experimentaste, ¿cuál fue el más grave o frustrante? <span className="required">*</span></label>
              <select 
                value={formData.problemaMasGrave} 
                onChange={(e) => updateField('problemaMasGrave', e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option value="No me apareció la opción para iniciar el trámite">No me apareció la opción para iniciar el trámite</option>
                <option value="No me aparecieron mis materias">No me aparecieron mis materias</option>
                <option value="Error al reservar / pérdida de selección">Error al reservar / pérdida de selección</option>
                <option value="Usuario bloqueado o acceso denegado">Usuario bloqueado o acceso denegado</option>
                <option value="Turno asignado incorrecto">Turno asignado incorrecto</option>
                <option value="No reconocimiento de reingreso o cambio de carrera">No reconocimiento de reingreso o cambio de carrera</option>
                <option value="Otro">Otro</option>
              </select>
              {formData.problemaMasGrave === "Otro" && (
                <input
                  type="text"
                  placeholder="Especifica el problema más grave..."
                  value={otroProblemaGrave}
                  onChange={(e) => setOtroProblemaGrave(e.target.value)}
                  className="other-input"
                  style={{ marginTop: '12px' }}
                />
              )}
            </div>
          )}

          {currentStep === 7 && (
            <div className="pregunta" key="q8">
              <label>8. ¿Qué tan frustrante fue ese problema para ti? <span className="required">*</span></label>
              <p className="helper-text">(1 = Nada frustrante, 5 = Extremadamente frustrante)</p>
              <div className="rating-scale">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    className={`rating-btn ${formData.nivelFrustracion === num ? 'active' : ''}`}
                    onClick={() => updateField('nivelFrustracion', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="pregunta" key="q9">
              <label>9. En general, ¿qué tan satisfecho(a) estás con el proceso de matrícula en línea? <span className="required">*</span></label>
              <p className="helper-text">(1 = Muy insatisfecho, 5 = Muy satisfecho)</p>
              <div className="rating-scale">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    className={`rating-btn ${formData.satisfaccion === num ? 'active' : ''}`}
                    onClick={() => updateField('satisfaccion', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="pregunta" key="q10">
              <label>10. En una escala de 0 a 10, ¿qué tan probable es que recomiendes el sistema de matrícula a otro estudiante? <span className="required">*</span></label>
              <p className="helper-text">(0 = Nada probable, 10 = Muy probable)</p>
              <div className="rating-scale-wide">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    className={`rating-btn-small ${formData.recomendacion === num ? 'active' : ''}`}
                    onClick={() => updateField('recomendacion', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 10 && (
            <div className="pregunta" key="q11">
              <label>11. Si contactaste soporte, ¿fue útil la ayuda recibida?</label>
              {formData.contactoSoporte === 'Sí' && <span className="required"> *</span>}
              <div onClick={() => updateField('utilidadSoporte', 'Sí, resolvieron mi problema')}>
                <input 
                  type="radio" 
                  name="utilidadSoporte" 
                  checked={formData.utilidadSoporte === 'Sí, resolvieron mi problema'}
                  onChange={() => {}}
                />
                <label>Sí, resolvieron mi problema</label>
              </div>
              <div onClick={() => updateField('utilidadSoporte', 'Parcialmente')}>
                <input 
                  type="radio" 
                  name="utilidadSoporte" 
                  checked={formData.utilidadSoporte === 'Parcialmente'}
                  onChange={() => {}}
                />
                <label>Parcialmente</label>
              </div>
              <div onClick={() => updateField('utilidadSoporte', 'No, no me ayudaron')}>
                <input 
                  type="radio" 
                  name="utilidadSoporte" 
                  checked={formData.utilidadSoporte === 'No, no me ayudaron'}
                  onChange={() => {}}
                />
                <label>No, no me ayudaron</label>
              </div>
              <div onClick={() => updateField('utilidadSoporte', 'No contacté soporte')}>
                <input 
                  type="radio" 
                  name="utilidadSoporte" 
                  checked={formData.utilidadSoporte === 'No contacté soporte'}
                  onChange={() => {}}
                />
                <label>No contacté soporte</label>
              </div>
            </div>
          )}

          {currentStep === 11 && (
            <div className="pregunta" key="q12">
              <label>12. ¿Qué cambiarías para mejorar el sistema de matrícula?</label>
              <p className="helper-text">(Máximo 300 caracteres)</p>
              <textarea
                value={formData.queChangarias}
                onChange={(e) => updateField('queChangarias', e.target.value.slice(0, 300))}
                placeholder="Escribe tus sugerencias aquí..."
                maxLength={300}
              />
              <div className="char-count">{formData.queChangarias.length}/300</div>
            </div>
          )}

          {currentStep === 12 && (
            <div className="pregunta" key="q13">
              <label>13. ¿Tienes alguna sugerencia específica para evitar que otros estudiantes pasen por lo mismo?</label>
              <p className="helper-text">(Máximo 300 caracteres)</p>
              <textarea
                value={formData.sugerencias}
                onChange={(e) => updateField('sugerencias', e.target.value.slice(0, 300))}
                placeholder="Escribe tus sugerencias aquí..."
                maxLength={300}
              />
              <div className="char-count">{formData.sugerencias.length}/300</div>
            </div>
          )}

        </div>

        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button 
              className="btn-secondary"
              onClick={handleBack}
            >
              ← Anterior
            </button>
          )}
          
          {currentStep < 12 && (
            <button 
              className="btn-primary"
              onClick={handleNext}
            >
              Siguiente →
            </button>
          )}

          {currentStep === 12 && (
            <button 
              className="btn-primary btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Encuesta ✓'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App
