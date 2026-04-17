// Variables globales
let currentSection = 1;
const totalSections = 13;
let radarChart = null;

// PESOS AJUSTADOS: Fugas (15%) y Motor (15%) tienen más peso
const sectionWeights = {
    1: 5,   // Datos del vehículo
    2: 10,  // Documentación
    3: 10,  // Valores comerciales
    4: 15,  // Fuga de fluidos - AUMENTADO
    5: 10,  // Sistema eléctrico
    6: 10,  // Inspección visual
    7: 15,  // Estado del motor - AUMENTADO
    8: 10,  // Llantas
    9: 10,  // Tren delantero
    10: 10, // Interior
    11: 5,  // Accesorios
    12: 5   // Prueba de ruta
};

// Nombres de las secciones para la gráfica
const sectionNames = {
    2: 'Documentación',
    4: 'Fugas',
    5: 'Sistema Eléctrico',
    6: 'Carrocería',
    7: 'Motor',
    8: 'Llantas',
    9: 'Suspensión',
    10: 'Interior',
    11: 'Accesorios',
    12: 'Prueba Ruta'
};

// Preguntas para cada sección
const sectionQuestions = {
    2: [
        { id: "soat", text: "SOAT vigente" },
        { id: "propertyCard", text: "Tarjeta de propiedad" },
        { id: "accidentsReported", text: "Reporta siniestros" },
        { id: "techReview", text: "Rev. Tecnomecánica" },
        { id: "hasInsurance", text: "Aseguradora" }
    ],
    4: [
        { id: "engineOilLeak", text: "Fuga de aceite motor" },
        { id: "transmissionOilLeak", text: "Fuga de aceite caja" },
        { id: "coolantLeak", text: "Fuga de refrigerante" },
        { id: "brakeFluidLeak", text: "Fuga de líquido de freno" },
        { id: "powerSteeringLeak", text: "Fuga de dirección hidráulica" },
        { id: "differentialLeak", text: "Fuga de diferencial" }
    ],
    5: [
        { id: "frontWindshield", text: "Panorámico delantero" },
        { id: "rearWindshield", text: "Panorámico trasero" },
        { id: "windows", text: "Vidrios" },
        { id: "wipers", text: "Plumillas" },
        { id: "rightHeadlight", text: "Farola derecha" },
        { id: "leftHeadlight", text: "Farola izquierda" },
        { id: "rightBrakeLight", text: "Stop derecho" },
        { id: "leftBrakeLight", text: "Stop izquierdo" },
        { id: "horn", text: "Bocina" },
        { id: "battery", text: "Batería" },
        { id: "fuses", text: "Fusibles" },
        { id: "alternator", text: "Alternador" }
    ],
    6: [
        { id: "leftFender", text: "Guardafango izquierdo trasero" },
        { id: "rightFender", text: "Guardafango derecho trasero" },
        { id: "rightSide", text: "Guardafango izquierdo delantero" },
        { id: "leftSide", text: "Guardafango derecho delantero" },
        { id: "leftRearDoor", text: "Puerta trasera izquierda" },
        { id: "rightRearDoor", text: "Puerta trasera derecha" },
        { id: "rightFrontDoor", text: "Puerta delantera derecha" },
        { id: "leftFrontDoor", text: "Puerta delantera izquierda" },
        { id: "rightRunningBoard", text: "Estribo derecho delantero" },
        { id: "hood", text: "Capo" },
        { id: "leftRunningBoard", text: "Estribo izquierdo delantero" },
        { id: "rightRearRunningBoard", text: "Estribo derecho trasero" },
        { id: "frontBumper", text: "Defensa delantera" },
        { id: "rearBumper", text: "Defensa trasera" },
        { id: "roof", text: "Techo" }
    ],
    7: [
        { id: "cylinderCompression", text: "Compresión por cilindro" },
        { id: "obdScan", text: "Escaneo OBD-II" }
    ],
    8: [
        { id: "frontTires", text: "Llantas delanteras" },
        { id: "rearTires", text: "Llantas traseras" },
        { id: "spareTire", text: "Llanta de repuesto" },
        { id: "tireWear", text: "Desgaste" },
        { id: "rimsCondition", text: "Estado de rines" }
    ],
    9: [
        { id: "brakePads", text: "Pastillas de freno" },
        { id: "brakeDiscs", text: "Discos de freno" },
        { id: "frontShocks", text: "Amortiguadores delanteros" },
        { id: "rearShocks", text: "Amortiguadores traseros" },
        { id: "axleTips", text: "Puntas de ejes" },
        { id: "axles", text: "Axiales" },
        { id: "terminals", text: "Terminales" },
        { id: "ballJoints", text: "Rotulas" },
        { id: "bushings", text: "Bujes" },
        { id: "controlArms", text: "Tijeras" },
        { id: "steeringBox", text: "Caja de dirección" },
        { id: "bearings", text: "Rodamientos" },
        { id: "chassis", text: "Chasís" }
    ],
    10: [
        { id: "heating", text: "Calefacción" },
        { id: "ac", text: "Aire acondicionado" },
        { id: "radio", text: "Radio" },
        { id: "alarm", text: "Alarma" },
        { id: "upholstery", text: "Tapicería" },
        { id: "dashboard", text: "Tablero" },
        { id: "dashboardLights", text: "Luces tablero" },
        { id: "interiorLights", text: "Luces interiores" },
        { id: "seatBelts", text: "Cinturones de seguridad" },
        { id: "mirrors", text: "Espejos" },
        { id: "powerWindows", text: "Elevavidrios" },
        { id: "locks", text: "Seguros" }
    ],
    11: [
        { id: "speakers", text: "Parlantes" },
        { id: "powerPlant", text: "Planta" },
        { id: "steeringWheel", text: "Timón o volante" },
        { id: "luxuryRims", text: "Rines de lujo" },
        { id: "safetyFilm", text: "Película de seguridad" }
    ],
    12: [
        { id: "acceleration", text: "Aceleración" },
        { id: "handling", text: "Maniobrabilidad" },
        { id: "alignment", text: "Angulo de alineación" },
        { id: "braking", text: "Condición de frenado" },
        { id: "clutch", text: "Condición de embrague" },
        { id: "gearboxEngine", text: "Relación caja-motor" },
        { id: "vibrations", text: "Vibraciones" }
    ]
};

// Función para navegar entre secciones
function nextSection(sectionNumber) {
    document.getElementById(`section-${currentSection}`).classList.remove('active');
    document.getElementById(`section-${sectionNumber}`).classList.add('active');
    currentSection = sectionNumber;
    const progress = (sectionNumber / totalSections) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Función para validar la sección actual
function validateSection(section) {
    let isValid = true;
    
    document.querySelectorAll(`#section-${section} .validation-error`).forEach(error => {
        error.style.display = 'none';
    });
    
    const sectionElement = document.getElementById(`section-${section}`);
    const requiredElements = sectionElement.querySelectorAll('select[required], input[required]');
    
    requiredElements.forEach(element => {
        if (!element.value.trim()) {
            const errorId = `${element.id}Error`;
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            isValid = false;
            element.style.borderColor = 'var(--bad)';
        } else {
            element.style.borderColor = '#ddd';
        }
    });
    
    if (section === 3) {
        const marketValue = document.getElementById('marketValue').value;
        const fasecoldaValue = document.getElementById('fasecoldaValue').value;
        const expertValue = document.getElementById('expertValue').value;
        
        if (isNaN(parseFloat(marketValue.replace(/[^0-9.]/g, ''))) || 
            isNaN(parseFloat(fasecoldaValue.replace(/[^0-9.]/g, ''))) || 
            isNaN(parseFloat(expertValue.replace(/[^0-9.]/g, '')))) {
            alert('Los valores comerciales deben ser números válidos');
            isValid = false;
        }
    }
    
    if (section === 13) {
        const photoFront = document.getElementById('photoFront').files.length;
        const photoSide = document.getElementById('photoSide').files.length;
        const photoRear = document.getElementById('photoRear').files.length;
        const photoEngine = document.getElementById('photoEngine').files.length;
        
        if (photoFront === 0 && photoSide === 0 && photoRear === 0 && photoEngine === 0) {
            alert('Por favor suba al menos una foto del vehículo');
            isValid = false;
        }
    }
    
    if (isValid) {
        if (section < totalSections) {
            nextSection(section + 1);
        } else {
            generateReport();
        }
    } else {
        const firstError = sectionElement.querySelector('.validation-error[style*="display: block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatCurrency(value) {
    if (!value || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    }).format(value);
}

// Generar recomendaciones basadas en puntajes bajos
function generateRecommendations(sectionScores) {
    const recommendations = [];
    if (sectionScores[4] < 70) recommendations.push("🔴 Revisar el sistema de fugas de fluidos. Se detectaron fugas que pueden comprometer la seguridad y el rendimiento del motor.");
    if (sectionScores[7] < 70) recommendations.push("🔧 Realizar un diagnóstico profundo del motor. La compresión o el escaneo OBD-II muestran anomalías.");
    if (sectionScores[5] < 60) recommendations.push("💡 Inspeccionar el sistema eléctrico. Faros, luces o componentes eléctricos presentan fallas.");
    if (sectionScores[9] < 60) recommendations.push("🛞 Revisar el tren delantero y suspensión. Se encontraron componentes en estado regular o malo.");
    if (sectionScores[6] < 70) recommendations.push("🚗 Evaluar la carrocería. Se observaron rayones, abolladuras o posibles trabajos de masilla.");
    if (sectionScores[12] < 60) recommendations.push("🏁 Realizar una prueba de ruta más exhaustiva. La maniobrabilidad o el frenado presentan deficiencias.");
    
    if (recommendations.length === 0) {
        recommendations.push("✅ El vehículo se encuentra en óptimas condiciones generales. Mantener el mantenimiento preventivo.");
    }
    return recommendations;
}

// Función para generar el informe final
function generateReport() {
    document.getElementById('evaluationForm').style.display = 'none';
    document.getElementById('finalReport').style.display = 'block';
    
    const vehicleData = {
        class: sanitizeText(document.getElementById('vehicleClass').value),
        brand: sanitizeText(document.getElementById('vehicleBrand').value),
        line: sanitizeText(document.getElementById('vehicleLine').value),
        body: sanitizeText(document.getElementById('vehicleBody').value),
        model: sanitizeText(document.getElementById('vehicleModel').value),
        nationality: sanitizeText(document.getElementById('vehicleNationality').value),
        transmission: sanitizeText(document.getElementById('vehicleTransmission').value),
        engine: sanitizeText(document.getElementById('vehicleEngine').value),
        fuel: sanitizeText(document.getElementById('vehicleFuel').value),
        paint: sanitizeText(document.getElementById('vehiclePaint').value),
        service: sanitizeText(document.getElementById('vehicleService').value),
        mileage: sanitizeText(document.getElementById('vehicleMileage').value),
        color: sanitizeText(document.getElementById('vehicleColor').value),
        chassis: sanitizeText(document.getElementById('vehicleChassis').value),
        serial: sanitizeText(document.getElementById('vehicleSerial').value),
        motor: sanitizeText(document.getElementById('vehicleMotor').value),
        plate: sanitizeText(document.getElementById('vehiclePlate').value)
    };
    
    const sectionScores = calculateScores();
    const globalScore = calculateGlobalScore(sectionScores);
    const isApproved = globalScore >= 75;
    const recommendations = generateRecommendations(sectionScores);
    
    // Preparar datos para la gráfica de radar
    const radarLabels = [];
    const radarData = [];
    for (let i = 2; i <= 12; i++) {
        if (sectionNames[i] && sectionScores[i] !== undefined) {
            radarLabels.push(sectionNames[i]);
            radarData.push(sectionScores[i]);
        }
    }
    
    const reportHTML = `
        <div class="header">
            <div class="header-content">
                <div class="logo-container">
                    <div class="logo-img">LOGO</div>
                    <div class="logo-text">
                        PERITAJE EXPERT
                        <span>SISTEMA DE EVALUACIÓN</span>
                    </div>
                </div>
                <div>
                    <h1 class="report-title">Informe de Inspección Técnica</h1>
                </div>
                <div class="report-number">Peritaje #${Math.floor(Math.random() * 1000)}</div>
            </div>
        </div>
        
        <!-- Resumen Ejecutivo -->
        <div class="executive-summary">
            <div class="summary-veredict">
                <div class="veredict-stamp ${isApproved ? 'approved' : 'rejected'}">
                    ${isApproved ? '✅ APROBADO' : '❌ NO APROBADO'}
                </div>
                <div style="margin-top: 10px; font-size: 12px;">Según criterios de evaluación</div>
            </div>
            <div class="traffic-light ${globalScore >= 75 ? 'green' : (globalScore >= 50 ? 'yellow' : 'red')}">
                ${globalScore}%
            </div>
            <div class="summary-score">
                ${globalScore}<small>%</small>
                <div class="summary-label">Puntaje Global</div>
            </div>
        </div>
        
        <div class="vehicle-display">
            <div class="vehicle-photos">
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoFront" alt="Foto frontal"></div><div class="photo-label">Frontal</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoSide" alt="Foto lateral"></div><div class="photo-label">Lateral</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoRear" alt="Foto trasera"></div><div class="photo-label">Trasera</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoEngine" alt="Foto motor"></div><div class="photo-label">Motor</div></div>
            </div>
            <div class="vehicle-info">
                <h2>Datos del Vehículo</h2>
                <div class="info-grid">
                    <div class="info-item"><div class="info-label">Clase</div><div class="info-value">${vehicleData.class}</div></div>
                    <div class="info-item"><div class="info-label">Marca</div><div class="info-value">${vehicleData.brand}</div></div>
                    <div class="info-item"><div class="info-label">Línea</div><div class="info-value">${vehicleData.line}</div></div>
                    <div class="info-item"><div class="info-label">Carrocería</div><div class="info-value">${vehicleData.body}</div></div>
                    <div class="info-item"><div class="info-label">Modelo</div><div class="info-value">${vehicleData.model}</div></div>
                    <div class="info-item"><div class="info-label">Nacionalidad</div><div class="info-value">${vehicleData.nationality}</div></div>
                    <div class="info-item"><div class="info-label">Caja</div><div class="info-value">${vehicleData.transmission}</div></div>
                    <div class="info-item"><div class="info-label">Cilindraje</div><div class="info-value">${vehicleData.engine}</div></div>
                    <div class="info-item"><div class="info-label">Combustible</div><div class="info-value">${vehicleData.fuel}</div></div>
                    <div class="info-item"><div class="info-label">Pintura</div><div class="info-value">${vehicleData.paint}</div></div>
                    <div class="info-item"><div class="info-label">Servicio</div><div class="info-value">${vehicleData.service}</div></div>
                    <div class="info-item"><div class="info-label">Kilometraje</div><div class="info-value">${vehicleData.mileage}</div></div>
                    <div class="info-item"><div class="info-label">Color</div><div class="info-value">${vehicleData.color}</div></div>
                    <div class="info-item"><div class="info-label">Chasis</div><div class="info-value">${vehicleData.chassis}</div></div>
                    <div class="info-item"><div class="info-label">Serial</div><div class="info-value">${vehicleData.serial}</div></div>
                    <div class="info-item"><div class="info-label">Motor</div><div class="info-value">${vehicleData.motor}</div></div>
                    <div class="info-item"><div class="info-label">Placa</div><div class="info-value">${vehicleData.plate}</div></div>
                </div>
            </div>
        </div>
        
        <!-- Sección de Valores Comerciales -->
        <div class="section commercial-values">
            <h2 class="section-title">Valores Comerciales</h2>
            ${generateCommercialValuesHTML()}
        </div>
        
        <!-- Gráfica de Radar -->
        <div class="radar-chart-container">
            <h3>Evaluación por Sistemas (Puntaje %) </h3>
            <canvas id="radarChart" width="400" height="400"></canvas>
        </div>
        
        <div class="section">
            <h2 class="section-title">Evaluación Detallada por Secciones</h2>
            
            ${generateDetailedSectionsHTML(sectionScores)}
        </div>
        
        <!-- Recomendaciones -->
        <div class="recommendations">
            <h3><i class="fas fa-tools"></i> Próximos Pasos y Recomendaciones</h3>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        
        <div class="observations">
            <h3 class="observations-title">Observaciones del Perito</h3>
            <p>${sanitizeText(document.getElementById('observations').value) || 'Sin observaciones adicionales.'}</p>
        </div>
        
        <div class="approval-criteria">
            <h3 class="criteria-title">Criterio de Aprobación</h3>
            <div class="criteria-grid">
                <div class="criteria-item approved"><div class="criteria-icon">✓</div><div class="criteria-text"><strong>Aprobado</strong><br>Puntuación ≥ 75%</div></div>
                <div class="criteria-item rejected"><div class="criteria-icon">✗</div><div class="criteria-text"><strong>No Aprobado</strong><br>Puntuación &lt; 75%</div></div>
            </div>
        </div>
        
        <div class="signature-area">
            <div class="signature-box"><div>Firma del Perito</div><div class="signature-line"></div><div>Nombre: ____________________</div><div>Registro: ___________________</div></div>
            <div class="${isApproved ? 'approved-stamp' : 'not-approved-stamp'}">${isApproved ? 'APROBADO' : 'NO APROBADO'}</div>
            <div class="signature-box"><div>Firma del Cliente</div><div class="signature-line"></div><div>Nombre: ____________________</div><div>CC/NIT: ____________________</div></div>
        </div>
        
        <div class="footer">
            <div class="footer-info"><div>MULTIPERITAJES Y CONSULTORIA BARCELO S.A.S.</div><div>Teléfono: 315 2207097</div><div>Email: multiautosperitajes@gmail.com</div><div>WEB: www.peritajeexpert.com.co</div></div>
            <div>Este informe es confidencial y propiedad de PERITOEXPERT. Su distribución está sujeta a autorización. Este documento tiene vigencia hasta cumplir 15 días después de la inspección visual realizada. La evaluación se basa en una inspección visual y pruebas funcionales al momento de la revisión. PERITOEXPERT no se hace responsable por fallas mecánicas que se presenten posterior a la inspección.</div>
        </div>
        
        <div class="legal-clauses">
            <div style="margin-bottom: 10px; padding: 8px; border: 1px solid #d1ecf1; background-color: #f8f9fa;">
                <h6 style="font-size: 8.5px; color: var(--f1-red); margin-bottom: 5px; font-weight: bold; text-align: center; text-transform: uppercase;">
                    DECLARACIONES, AUTORIZACIONES Y CONDICIONES DEL SERVICIO
                </h6>
                <p style="font-size: 8.5px; color: #333; margin-bottom: 5px; text-align: center; font-weight: bold;">
                    PERITOEXPERT S.A.S.
                </p>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Declaración de veracidad y procedencia del vehículo</p>
                    <p style="margin: 2px 0; text-align: justify;">Declaro bajo gravedad de juramento que toda la información y documentación suministrada a PERITOEXPERT S.A.S. es veraz, completa y corresponde a la realidad. Así mismo, manifiesto que el vehículo presentado para la inspección es de procedencia lícita. En consecuencia, asumo de manera exclusiva cualquier responsabilidad de tipo penal, civil, administrativa o fiscal que se derive de esta orden de trabajo, eximiendo a PERITOEXPERT de cualquier responsabilidad por información falsa, incompleta u omitida.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Autorización para consulta de información</p>
                    <p style="margin: 2px 0; text-align: justify;">Autorizo expresa e irrevocablemente a PERITOEXPERT S.A.S. para consultar mi información personal y la del vehículo en el Registro Único Nacional de Tránsito (RUNT), así como en otras entidades públicas o privadas afiliadas o relacionadas, con el fin de solicitar, consultar y validar la información del vehículo identificado con la placa consignada en el informe de inspección.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Prestación del servicio</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT S.A.S. presta al cliente el servicio de peritaje automotriz, el cual puede incluir inspección técnica, validación de asegurabilidad y avalúo comercial referencial, de acuerdo con el alcance contratado y las condiciones establecidas en el presente informe.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Inspección de asegurabilidad</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa se compromete a realizar la inspección de asegurabilidad del vehículo conforme a los criterios técnicos, protocolos internos y convenios vigentes con las compañías aseguradoras, cuando aplique, aclarando que el dictamen emitido corresponde exclusivamente al estado observable del vehículo al momento de la inspección.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Avalúo comercial</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT S.A.S. se compromete a realizar el avalúo comercial del vehículo conforme a metodologías, referencias del mercado y procedimientos internos establecidos. El resultado del avalúo no compromete a la empresa con la comercialización del automotor, ni constituye una obligación de compra, venta o intermediación.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Notificaciones y reportes</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT S.A.S. bajo ninguna circunstancia realizará notificaciones, reportes, alertas o registros ante autoridades, aseguradoras o terceros respecto al vehículo durante la ejecución del peritaje, salvo que exista una obligación legal expresa que así lo exija.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Derecho de suspensión o retiro del vehículo</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa se reserva el derecho de suspender la inspección o retirar el vehículo del proceso cuando este represente un riesgo para la seguridad del personal, presente fallas mecánicas graves, condiciones estructurales peligrosas o cualquier situación que pueda comprometer la integridad del vehículo o de los inspectores.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">No realización de reparaciones</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT S.A.S. no realiza ningún tipo de reparación, ajuste, mantenimiento ni modificación al vehículo inspeccionado. Todas las pruebas y verificaciones realizadas son únicamente de carácter diagnóstico y observacional.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Resultados del informe</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa no emite conceptos, resultados ni conclusiones distintas a las derivadas directamente de la inspección realizada. PERITOEXPERT S.A.S. no recomienda talleres, empresas ni terceros para la reparación o intervención del vehículo.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Interpretación del informe</p>
                    <p style="margin: 2px 0; text-align: justify;">Los arreglos, reparaciones o decisiones que se deriven del informe de inspección no comprometen a PERITOEXPERT S.A.S., teniendo en cuenta que el informe puede estar sujeto a diversas interpretaciones técnicas por parte de terceros.</p>
                </div>
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Exoneración por daños durante la inspección</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT S.A.S. no se hace responsable por daños que se presenten durante la inspección cuando estos se deban a condiciones preexistentes del vehículo, desgaste natural o falta de mantenimiento, incluyendo, pero sin limitarse a: bomba de gasolina eléctrica (por bajo nivel de combustible), correa de repartición (por incumplimiento de mantenimientos recomendados por el fabricante), bobinas electrónicas, guayas de acelerador, embrague, frenos, capó, elementos eléctricos, bombillos de farolas, luces de freno, luces exploradoras, motor, caja o transmisión, así como cualquier otro componente que falle por uso previo o deterioro anterior al ingreso del vehículo al peritaje.</p>
                </div>
            </div>
        </div>
        
        <div class="action-buttons" style="display: flex; justify-content: center; gap: 15px; margin: 30px 0;">
            <button onclick="printReport()" class="btn-action"><i class="fas fa-print"></i> Imprimir</button>
            <button onclick="saveAsPDF()" class="btn-action btn-pdf"><i class="fas fa-file-pdf"></i> Guardar como PDF</button>
            <button onclick="newEvaluation()" class="btn-action btn-secondary"><i class="fas fa-plus"></i> Nueva Evaluación</button>
        </div>
    `;
    
    document.getElementById('finalReport').innerHTML = reportHTML;
    loadReportImages();
    animateCommercialValues();
    
    // Renderizar la gráfica de radar
    setTimeout(() => {
        const ctx = document.getElementById('radarChart');
        if (ctx) {
            const canvasCtx = ctx.getContext('2d');
            if (radarChart) radarChart.destroy();
            radarChart = new Chart(canvasCtx, {
                type: 'radar',
                data: {
                    labels: radarLabels,
                    datasets: [{
                        label: 'Puntaje por Sección (%)',
                        data: radarData,
                        backgroundColor: 'rgba(225, 6, 0, 0.2)',
                        borderColor: 'rgba(225, 6, 0, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(225, 6, 0, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(225, 6, 0, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                callback: function(value) { return value + '%'; }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.raw + '%';
                                }
                            }
                        }
                    }
                }
            });
        }
    }, 100);
    
    window.scrollTo(0, 0);
}

// Función para generar las secciones detalladas con tooltips
function generateDetailedSectionsHTML(sectionScores) {
    let html = '';
    const sections = [2,4,5,6,7,8,9,10,11,12];
    for (const sec of sections) {
        const isCritical = (sec === 4 || sec === 7);
        html += `
            <div class="subsection">
                <h3>${sectionNames[sec]} ${isCritical ? '<span style="color: var(--bad); font-size: 14px;">(Crítica)</span>' : ''}</h3>
                <div class="color-legend">
                    <div class="legend-item"><div class="legend-color green"></div><span data-tooltip="Pieza en perfecto estado, sin novedad">Bueno</span></div>
                    <div class="legend-item"><div class="legend-color yellow"></div><span data-tooltip="Detalles estéticos leves: rayones, pequeños golpes">Regular</span></div>
                    <div class="legend-item"><div class="legend-color red"></div><span data-tooltip="Trabajo de masilla, reparaciones o daños estructurales">Malo</span></div>
                    <div class="legend-item"><div class="legend-color gray"></div><span>No Aplica</span></div>
                </div>
                <div class="${sec === 6 || sec === 5 || sec === 9 || sec === 10 ? 'checklist-full' : 'checklist'}">
                    ${generateChecklistItems(sec)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación ${sectionNames[sec]}</div>
                    <div class="score-value">${sectionScores[sec]}%</div>
                    <div class="gauge"><div class="gauge-value" style="left: ${sectionScores[sec]}%;" data-value="${sectionScores[sec]}"></div></div>
                    ${isCritical && sectionScores[sec] < 70 ? '<div class="score-label" style="color: var(--bad);">⚠️ Sección crítica con baja puntuación</div>' : ''}
                </div>
            </div>
        `;
    }
    return html;
}

// Función para generar items de checklist
function generateChecklistItems(sectionId) {
    if (!sectionQuestions[sectionId]) return '';
    let html = '';
    sectionQuestions[sectionId].forEach(question => {
        const element = document.getElementById(question.id);
        if (!element) return;
        const value = element.value;
        let statusClass = '', statusText = '', tooltipText = '';
        if (value === 'Bueno' || value === 'Sí') {
            statusClass = 'status-good';
            statusText = '✓';
            tooltipText = 'Bueno: Perfecto estado, sin novedad.';
        } else if (value === 'Regular') {
            statusClass = 'status-regular';
            statusText = '~';
            tooltipText = 'Regular: Rayones, pequeños golpes o desgaste leve.';
        } else if (value === 'Malo' || value === 'No') {
            statusClass = 'status-bad';
            statusText = '✗';
            tooltipText = 'Malo: Masilla, reparaciones o daños estructurales.';
        } else {
            statusClass = 'status-na';
            statusText = 'N/A';
            tooltipText = 'No aplica.';
        }
        html += `<div class="check-item"><div class="status ${statusClass}" data-tooltip="${tooltipText}">${statusText}</div><div>${question.text}</div></div>`;
    });
    return html;
}

function generateCommercialValuesHTML() {
    const marketValue = parseFloat(document.getElementById('marketValue').value.replace(/[^0-9.]/g, '')) || 0;
    const fasecoldaValue = parseFloat(document.getElementById('fasecoldaValue').value.replace(/[^0-9.]/g, '')) || 0;
    const expertValue = parseFloat(document.getElementById('expertValue').value.replace(/[^0-9.]/g, '')) || 0;
    const accessoriesValue = parseFloat(document.getElementById('accessoriesValue').value.replace(/[^0-9.]/g, '')) || 0;
    const values = [marketValue, fasecoldaValue, expertValue].filter(v => v > 0);
    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return `
        <div class="value-chart"><div class="value-label"><span>Revista Motor</span><span id="marketValueDisplay">${formatCurrency(marketValue)}</span></div><div class="value-bar-container"><div class="value-bar" id="marketBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>Fasecolda</span><span id="fasecoldaValueDisplay">${formatCurrency(fasecoldaValue)}</span></div><div class="value-bar-container"><div class="value-bar" id="fasecoldaBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>Peritoexpert.com</span><span id="expertValueDisplay">${formatCurrency(expertValue)}</span></div><div class="value-bar-container"><div class="value-bar" id="expertBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>Accesorios</span><span id="accessoriesValueDisplay">${formatCurrency(accessoriesValue)}</span></div><div class="value-bar-container"><div class="value-bar" id="accessoriesBar" style="width: 0%">0%</div></div></div>
        <div class="value-comparison"><div class="value-min">Mínimo: ${formatCurrency(minValue)}</div><div class="value-average">Promedio: ${formatCurrency(avgValue)}</div><div class="value-max">Máximo: ${formatCurrency(maxValue)}</div></div>
    `;
}

function animateCommercialValues() {
    const marketValue = parseFloat(document.getElementById('marketValue').value.replace(/[^0-9.]/g, '')) || 0;
    const fasecoldaValue = parseFloat(document.getElementById('fasecoldaValue').value.replace(/[^0-9.]/g, '')) || 0;
    const expertValue = parseFloat(document.getElementById('expertValue').value.replace(/[^0-9.]/g, '')) || 0;
    const accessoriesValue = parseFloat(document.getElementById('accessoriesValue').value.replace(/[^0-9.]/g, '')) || 0;
    const maxBarValue = Math.max(marketValue, fasecoldaValue, expertValue, accessoriesValue) || 1;
    const marketPercent = (marketValue / maxBarValue) * 100;
    const fasecoldaPercent = (fasecoldaValue / maxBarValue) * 100;
    const expertPercent = (expertValue / maxBarValue) * 100;
    const accessoriesPercent = (accessoriesValue / maxBarValue) * 100;
    setTimeout(() => {
        const marketBar = document.getElementById('marketBar');
        const fasecoldaBar = document.getElementById('fasecoldaBar');
        const expertBar = document.getElementById('expertBar');
        const accessoriesBar = document.getElementById('accessoriesBar');
        if (marketBar) { marketBar.style.width = `${marketPercent}%`; marketBar.textContent = `${Math.round(marketPercent)}%`; }
        if (fasecoldaBar) { fasecoldaBar.style.width = `${fasecoldaPercent}%`; fasecoldaBar.textContent = `${Math.round(fasecoldaPercent)}%`; }
        if (expertBar) { expertBar.style.width = `${expertPercent}%`; expertBar.textContent = `${Math.round(expertPercent)}%`; }
        if (accessoriesBar) { accessoriesBar.style.width = `${accessoriesPercent}%`; accessoriesBar.textContent = `${Math.round(accessoriesPercent)}%`; }
    }, 500);
}

function loadReportImages() {
    const photoIds = ['Front', 'Side', 'Rear', 'Engine'];
    photoIds.forEach(id => {
        const input = document.getElementById(`photo${id}`);
        const reportImg = document.getElementById(`reportPhoto${id}`);
        if (input && input.files && input.files[0] && reportImg) {
            const reader = new FileReader();
            reader.onload = function(e) { reportImg.src = e.target.result; };
            reader.readAsDataURL(input.files[0]);
        } else if (reportImg) {
            reportImg.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%;">Sin imagen</div>';
        }
    });
}

function calculateScores() {
    const scores = {};
    for (const sectionId in sectionQuestions) {
        if (sectionQuestions.hasOwnProperty(sectionId)) {
            let totalScore = 0;
            let answeredQuestions = 0;
            sectionQuestions[sectionId].forEach(question => {
                const element = document.getElementById(question.id);
                if (!element) return;
                const value = element.value;
                let points = 0;
                if (value === 'Bueno' || value === 'Sí') { points = 100; answeredQuestions++; }
                else if (value === 'Regular') { points = 60; answeredQuestions++; }
                else if (value === 'Malo' || value === 'No') { points = 0; answeredQuestions++; }
                else if (value === 'N/A') { points = 0; }
                totalScore += points;
            });
            scores[sectionId] = answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0;
        }
    }
    return scores;
}

function calculateGlobalScore(sectionScores) {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    let criticalPenalty = 0;
    for (const section in sectionScores) {
        if (sectionWeights[section]) {
            let sectionScore = sectionScores[section];
            if (section == 4 || section == 7) {
                if (sectionScore < 50) { sectionScore = Math.max(0, sectionScore - 30); criticalPenalty += 15; }
                else if (sectionScore < 70) { sectionScore = Math.max(0, sectionScore - 15); criticalPenalty += 10; }
            }
            totalWeightedScore += sectionScore * sectionWeights[section];
            totalWeight += sectionWeights[section];
        }
    }
    const baseScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    return Math.max(0, baseScore - criticalPenalty);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.photo-upload').forEach(input => {
        input.addEventListener('change', function() {
            const previewId = 'preview' + this.id.replace('photo', '');
            const preview = document.getElementById(previewId);
            if (this.files && this.files[0] && preview) {
                const reader = new FileReader();
                reader.onload = function(e) { preview.src = e.target.result; preview.style.display = 'block'; };
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
});

function saveAsPDF() {
    const element = document.getElementById('finalReport');
    const plate = document.getElementById('vehiclePlate').value || 'reporte';
    const date = new Date().toISOString().split('T')[0];
    const opt = { margin: [10,10,10,10], filename: `Peritaje_${plate}_${date}.pdf`, image: { type: 'jpeg', quality: 0.95 }, html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true } };
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    btn.disabled = true;
    html2pdf().set(opt).from(element).save().then(() => { btn.innerHTML = originalHTML; btn.disabled = false; }).catch((error) => { console.error('Error:', error); btn.innerHTML = originalHTML; btn.disabled = false; alert('Error al generar PDF.'); });
}

function printReport() { window.print(); }

function newEvaluation() {
    document.getElementById('evaluationForm').reset();
    document.getElementById('evaluationForm').style.display = 'block';
    document.getElementById('finalReport').style.display = 'none';
    document.getElementById('finalReport').innerHTML = '';
    currentSection = 1;
    document.querySelectorAll('.form-section').forEach(section => section.classList.remove('active'));
    document.getElementById('section-1').classList.add('active');
    document.getElementById('progressBar').style.width = '7.7%';
    document.querySelectorAll('.photo-preview').forEach(preview => { preview.style.display = 'none'; preview.src = ''; });
    window.scrollTo(0, 0);
    document.querySelectorAll('select, input').forEach(element => element.style.borderColor = '#ddd');
    document.querySelectorAll('.validation-error').forEach(error => error.style.display = 'none');
}