import axios from "axios";
import { useState } from "react";

// --- Opciones para los selects y checkboxes ---
const facultades = [
  "Ciencias de la Educación", "Administración de Empresas y Contabilidad", "Humanidades", "Derecho",
  "Arquitectura", "Economía", "Farmacia", "Enfermería", "Ciencias Naturales, Exactas y Tecnología",
  "Informática, Electrónica y Comunicación", "Ciencias Agropecuarias", "Bellas Artes (Música)",
  "Comunicación Social (Evento y Protocolo)", "Odontología", "Psicología", "Administración Pública"
];

const situacionesAcademicas = [
  "Primer año", "Años intermedios (2° a penúltimo)", "Último año / pendiente de tesis o trabajo de graduación",
  "Reingreso (no matriculé en uno o más semestres anteriores)", "Cambio de carrera (este semestre)"
];

const problemasMatriculaOptions = [
    "No me apareció la opción para iniciar el trámite de matrícula",
    "No me aparecieron todas las materias de mi plan de estudios",
    "Me aparecieron materias incorrectas (de otro semestre o carrera)",
    "El sistema no me reconoció como reingreso o con cambio de carrera",
    "Error al reservar: algunas materias desaparecieron o no se guardaron",
    "Me quedé sin cupos al intentar matricular",
    "No pude acceder: usuario bloqueado, contraseña no funcionaba",
    "El sistema me dijo que “no estaba habilitado ese día”",
    "Me asignaron turno nocturno, pero quiero diurno (o viceversa)",
    "El sistema no me permitió incluir materias pendientes o de recuperación",
    "Otro problema"
];

const problemasGravesOptions = [
    "No me apareció la opción para iniciar el trámite",
    "No me aparecieron mis materias",
    "Error al reservar / pérdida de selección",
    "Usuario bloqueado o acceso denegado",
    "Turno asignado incorrecto",
    "No reconocimiento de reingreso o cambio de carrera",
    "Otro"
];


export default function Encuesta() {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    q1_facultad: "",
    q2_situacion_academica: "",
    q3_matricula_completa: "",
    q4_intentos_matricula: "",
    q5_contacto_soporte: "",
    q6_problemas_matricula: [] as string[],
    q6_otro_problema: "",
    q7_problema_grave: "",
    q7_otro_problema_grave: "",
    q8_frustracion_problema: 0,
    q9_satisfaccion_general: 0,
    q10_recomendacion: 0,
    q11_utilidad_soporte: "",
    q12_mejoras_sistema: "",
    q13_sugerencias: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newProblemas = checked
        ? [...prev.q6_problemas_matricula, value]
        : prev.q6_problemas_matricula.filter(p => p !== value);
      return { ...prev, q6_problemas_matricula: newProblemas };
    });
  };

  const enviar = async () => {
    // Lógica de validación simple (se puede expandir)
    if (!formData.q1_facultad || !formData.q2_situacion_academica || !formData.q3_matricula_completa) {
        alert("Por favor, completa las preguntas obligatorias.");
        return;
    }
    try {
      await axios.post("http://localhost:8000/api/encuesta", formData);
      setEnviado(true);
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
      alert("Hubo un error al enviar la encuesta. Por favor, intenta nuevamente.");
    }
  };

  if (enviado) {
    return (
        <div style={{ 
          maxWidth: '600px', 
          margin: '80px auto', 
          padding: '48px',
          textAlign: 'center',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '56px',
              color: 'white',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
            }}>
              ✓
            </div>
            <h2 style={{ 
              color: '#059669', 
              marginBottom: '16px',
              fontSize: '28px',
              fontWeight: '700'
            }}>¡Gracias por tu tiempo!</h2>
            <p style={{ 
              color: '#64748b', 
              fontSize: '18px',
              lineHeight: '1.6'
            }}>
              Tus respuestas son fundamentales para mejorar el proceso de matrícula en la Universidad de Panamá.
            </p>
        </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: 'auto', 
      padding: '24px',
      minHeight: '100vh'
    }}>
      {/* Header con gradiente */}
      <div className="header-gradient" style={{
        color: 'white',
        padding: '40px 32px',
        borderRadius: '24px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
          pointerEvents: 'none'
        }}></div>
        <h1 style={{ 
          color: 'white', 
          margin: '0 0 12px 0', 
          fontSize: '32px',
          fontWeight: '700',
          letterSpacing: '-0.02em',
          position: 'relative'
        }}>
          Encuesta de Matrícula 2025
        </h1>
        <p style={{ 
          margin: 0, 
          opacity: 0.95, 
          fontSize: '17px',
          fontWeight: '400',
          position: 'relative'
        }}>
          Universidad de Panamá • ⏱️ 5-7 minutos
        </p>
      </div>

      {/* Contenedor con fondo blanco para las preguntas */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>

      {/* Pregunta 1 */}
      <div className="pregunta">
        <label>1. ¿A qué facultad perteneces?</label>
        <select name="q1_facultad" value={formData.q1_facultad} onChange={handleChange} required>
          <option value="">Selecciona una opción</option>
          {facultades.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Pregunta 2 */}
      <div className="pregunta">
        <label>2. ¿Cuál es tu situación académica actual?</label>
        <select name="q2_situacion_academica" value={formData.q2_situacion_academica} onChange={handleChange} required>
          <option value="">Selecciona una opción</option>
          {situacionesAcademicas.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Pregunta 3 */}
      <div className="pregunta">
        <label>3. ¿Lograste completar tu matrícula en el sistema de la UP?</label>
        <div>
            <input type="radio" id="q3_si_ok" name="q3_matricula_completa" value="Sí, sin problemas" onChange={handleChange} />
            <label htmlFor="q3_si_ok">Sí, sin problemas</label>
        </div>
        <div>
            <input type="radio" id="q3_si_mal" name="q3_matricula_completa" value="Sí, pero con dificultades" onChange={handleChange} />
            <label htmlFor="q3_si_mal">Sí, pero con dificultades</label>
        </div>
        <div>
            <input type="radio" id="q3_no" name="q3_matricula_completa" value="No, no pude finalizarla" onChange={handleChange} />
            <label htmlFor="q3_no">No, no pude finalizarla</label>
        </div>
      </div>

      {/* Lógica condicional */}
      {formData.q3_matricula_completa.startsWith("Sí") && (
        <>
            {/* Pregunta 4 */}
            <div className="pregunta">
                <label>4. ¿Cuántos intentos necesitaste para completar tu matrícula?</label>
                <select name="q4_intentos_matricula" value={formData.q4_intentos_matricula} onChange={handleChange}>
                    <option value="">Selecciona una opción</option>
                    <option value="1 intento">1 intento</option>
                    <option value="2-3 intentos">2–3 intentos</option>
                    <option value="4 o más intentos">4 o más intentos</option>
                </select>
            </div>

            {/* Pregunta 5 */}
            <div className="pregunta">
                <label>5. ¿Tuviste que contactar soporte (presencial o virtual) durante el proceso?</label>
                <div>
                    <input type="radio" id="q5_si" name="q5_contacto_soporte" value="Sí" onChange={handleChange} />
                    <label htmlFor="q5_si">Sí</label>
                </div>
                <div>
                    <input type="radio" id="q5_no" name="q5_contacto_soporte" value="No" onChange={handleChange} />
                    <label htmlFor="q5_no">No</label>
                </div>
            </div>
        </>
      )}

      {/* Pregunta 6 */}
      <div className="pregunta">
        <label>6. Durante tu intento de matrícula, ¿experimentaste alguno de los siguientes problemas? (Marca todos los que apliquen)</label>
        {problemasMatriculaOptions.map(p => (
            <div key={p}>
                <input type="checkbox" id={`q6_${p}`} value={p} onChange={handleCheckboxChange} />
                <label htmlFor={`q6_${p}`}>{p}</label>
            </div>
        ))}
        {formData.q6_problemas_matricula.includes("Otro problema") && (
            <textarea name="q6_otro_problema" value={formData.q6_otro_problema} onChange={handleChange} placeholder="Por favor, especifica el otro problema" />
        )}
      </div>

      {/* Pregunta 7 (Visible si no completó matrícula o tuvo problemas) */}
      {(formData.q3_matricula_completa === "No, no pude finalizarla" || formData.q6_problemas_matricula.length > 0) && (
        <div className="pregunta">
            <label>7. De los problemas que marcaste, ¿cuál fue el más grave o frustrante? (Selecciona solo uno)</label>
            <select name="q7_problema_grave" value={formData.q7_problema_grave} onChange={handleChange}>
                <option value="">Selecciona una opción</option>
                {problemasGravesOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {formData.q7_problema_grave === "Otro" && (
                <textarea name="q7_otro_problema_grave" value={formData.q7_otro_problema_grave} onChange={handleChange} placeholder="Por favor, especifica el otro problema grave" />
            )}
        </div>
      )}
      
      {/* Pregunta 8 */}
      <div className="pregunta">
        <label>8. ¿Qué tan frustrante fue ese problema para ti? (1 = Nada frustrante, 5 = Extremadamente frustrante)</label>
        <div>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ marginRight: '10px' }}>
                    <input type="radio" id={`q8_${n}`} name="q8_frustracion_problema" value={n} onChange={handleChange} />
                    <label htmlFor={`q8_${n}`}>{n}</label>
                </span>
            ))}
        </div>
      </div>

      {/* Pregunta 9 */}
      <div className="pregunta">
        <label>9. En general, ¿qué tan satisfecho(a) estás con el proceso de matrícula en línea? (1 = Muy insatisfecho, 5 = Muy satisfecho)</label>
         <div>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ marginRight: '10px' }}>
                    <input type="radio" id={`q9_${n}`} name="q9_satisfaccion_general" value={n} onChange={handleChange} />
                    <label htmlFor={`q9_${n}`}>{n}</label>
                </span>
            ))}
        </div>
      </div>

      {/* Pregunta 10 */}
      <div className="pregunta">
        <label>10. En una escala de 0 a 10, ¿qué tan probable es que recomiendes el sistema de matrícula a otro estudiante? (0 = Nada probable, 10 = Muy probable)</label>
        <select name="q10_recomendacion" value={formData.q10_recomendacion} onChange={handleChange}>
            <option value="">Selecciona una opción</option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* Pregunta 11 (Visible si contactó soporte) */}
      {formData.q5_contacto_soporte === "Sí" && (
        <div className="pregunta">
            <label>11. Si contactaste soporte, ¿fue útil la ayuda recibida?</label>
            <select name="q11_utilidad_soporte" value={formData.q11_utilidad_soporte} onChange={handleChange}>
                <option value="">Selecciona una opción</option>
                <option value="Sí, resolvieron mi problema">Sí, resolvieron mi problema</option>
                <option value="Parcialmente">Parcialmente</option>
                <option value="No, no me ayudaron">No, no me ayudaron</option>
            </select>
        </div>
      )}

      {/* Pregunta 12 */}
      <div className="pregunta">
        <label>12. ¿Qué cambiarías para mejorar el sistema de matrícula? (máximo 300 caracteres)</label>
        <textarea name="q12_mejoras_sistema" value={formData.q12_mejoras_sistema} onChange={handleChange} maxLength={300} />
      </div>

      {/* Pregunta 13 */}
      <div className="pregunta">
        <label>13. ¿Tienes alguna sugerencia específica para evitar que otros estudiantes pasen por lo mismo?</label>
        {formData.q10_recomendacion <= 6 && formData.q10_recomendacion !== 0 && <p>(Considerando tu calificación de {formData.q10_recomendacion}, por favor explica por qué)</p>}
        <textarea name="q13_sugerencias" value={formData.q13_sugerencias} onChange={handleChange} maxLength={300} />
      </div>

      <div style={{
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '2px solid #f1f5f9'
      }}>
        <button 
          onClick={enviar} 
          style={{
            width: '100%',
            padding: '18px 24px',
            fontSize: '18px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #0A3D91 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 14px rgba(10, 61, 145, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 61, 145, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(10, 61, 145, 0.4)';
          }}
        >
          📨 Enviar Encuesta
        </button>
      </div>
    </div>
    </div>
  );
}