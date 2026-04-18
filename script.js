// Variables globales
let currentSection = 1;
const totalSections = 13;
let radarChart = null;

// PESOS DE SECCIONES
const sectionWeights = {
    1: 5, 2: 10, 3: 10, 4: 15, 5: 10, 6: 10, 7: 15, 8: 10, 9: 10, 10: 10, 11: 5, 12: 5
};

const sectionNames = {
    2: 'Documentación', 4: 'Fugas', 5: 'Sistema Eléctrico', 6: 'Carrocería',
    7: 'Motor', 8: 'Llantas', 9: 'Suspensión', 10: 'Interior', 11: 'Accesorios', 12: 'Prueba Ruta'
};

// Preguntas por sección
const sectionQuestions = {
    2: [{ id: "soat", text: "SOAT vigente" }, { id: "propertyCard", text: "Tarjeta de propiedad" }, { id: "accidentsReported", text: "Reporta siniestros" }, { id: "techReview", text: "Rev. Tecnomecánica" }, { id: "hasInsurance", text: "Aseguradora" }],
    4: [{ id: "engineOilLeak", text: "Fuga de aceite motor" }, { id: "transmissionOilLeak", text: "Fuga de aceite caja" }, { id: "coolantLeak", text: "Fuga de refrigerante" }, { id: "brakeFluidLeak", text: "Fuga de líquido de freno" }, { id: "powerSteeringLeak", text: "Fuga de dirección hidráulica" }, { id: "differentialLeak", text: "Fuga de diferencial" }],
    5: [{ id: "frontWindshield", text: "Panorámico delantero" }, { id: "rearWindshield", text: "Panorámico trasero" }, { id: "windows", text: "Vidrios" }, { id: "wipers", text: "Plumillas" }, { id: "rightHeadlight", text: "Farola derecha" }, { id: "leftHeadlight", text: "Farola izquierda" }, { id: "rightBrakeLight", text: "Stop derecho" }, { id: "leftBrakeLight", text: "Stop izquierdo" }, { id: "horn", text: "Bocina" }, { id: "battery", text: "Batería" }, { id: "fuses", text: "Fusibles" }, { id: "alternator", text: "Alternador" }],
    6: [{ id: "leftFender", text: "Guardafango izquierdo trasero" }, { id: "rightFender", text: "Guardafango derecho trasero" }, { id: "rightSide", text: "Guardafango izquierdo delantero" }, { id: "leftSide", text: "Guardafango derecho delantero" }, { id: "leftRearDoor", text: "Puerta trasera izquierda" }, { id: "rightRearDoor", text: "Puerta trasera derecha" }, { id: "rightFrontDoor", text: "Puerta delantera derecha" }, { id: "leftFrontDoor", text: "Puerta delantera izquierda" }, { id: "rightRunningBoard", text: "Estribo derecho delantero" }, { id: "hood", text: "Capo" }, { id: "leftRunningBoard", text: "Estribo izquierdo delantero" }, { id: "rightRearRunningBoard", text: "Estribo derecho trasero" }, { id: "frontBumper", text: "Defensa delantera" }, { id: "rearBumper", text: "Defensa trasera" }, { id: "roof", text: "Techo" }],
    7: [{ id: "cylinderCompression", text: "Compresión por cilindro" }, { id: "obdScan", text: "Escaneo OBD-II" }],
    8: [{ id: "frontTires", text: "Llantas delanteras" }, { id: "rearTires", text: "Llantas traseras" }, { id: "spareTire", text: "Llanta de repuesto" }, { id: "tireWear", text: "Desgaste" }, { id: "rimsCondition", text: "Estado de rines" }],
    9: [{ id: "brakePads", text: "Pastillas de freno" }, { id: "brakeDiscs", text: "Discos de freno" }, { id: "frontShocks", text: "Amortiguadores delanteros" }, { id: "rearShocks", text: "Amortiguadores traseros" }, { id: "axleTips", text: "Puntas de ejes" }, { id: "axles", text: "Axiales" }, { id: "terminals", text: "Terminales" }, { id: "ballJoints", text: "Rotulas" }, { id: "bushings", text: "Bujes" }, { id: "controlArms", text: "Tijeras" }, { id: "steeringBox", text: "Caja de dirección" }, { id: "bearings", text: "Rodamientos" }, { id: "chassis", text: "Chasís" }],
    10: [{ id: "heating", text: "Calefacción" }, { id: "ac", text: "Aire acondicionado" }, { id: "radio", text: "Radio" }, { id: "alarm", text: "Alarma" }, { id: "upholstery", text: "Tapicería" }, { id: "dashboard", text: "Tablero" }, { id: "dashboardLights", text: "Luces tablero" }, { id: "interiorLights", text: "Luces interiores" }, { id: "seatBelts", text: "Cinturones de seguridad" }, { id: "mirrors", text: "Espejos" }, { id: "powerWindows", text: "Elevavidrios" }, { id: "locks", text: "Seguros" }],
    11: [{ id: "speakers", text: "Parlantes" }, { id: "powerPlant", text: "Planta" }, { id: "steeringWheel", text: "Timón o volante" }, { id: "luxuryRims", text: "Rines de lujo" }, { id: "safetyFilm", text: "Película de seguridad" }],
    12: [{ id: "acceleration", text: "Aceleración" }, { id: "handling", text: "Maniobrabilidad" }, { id: "alignment", text: "Angulo de alineación" }, { id: "braking", text: "Condición de frenado" }, { id: "clutch", text: "Condición de embrague" }, { id: "gearboxEngine", text: "Relación caja-motor" }, { id: "vibrations", text: "Vibraciones" }]
};

function nextSection(sectionNumber) {
    document.getElementById(`section-${currentSection}`).classList.remove('active');
    document.getElementById(`section-${sectionNumber}`).classList.add('active');
    currentSection = sectionNumber;
    document.getElementById('progressBar').style.width = `${(sectionNumber / totalSections) * 100}%`;
}

function validateSection(section) {
    let isValid = true;
    document.querySelectorAll(`#section-${section} .validation-error`).forEach(e => e.style.display = 'none');
    const sectionElement = document.getElementById(`section-${section}`);
    const requiredElements = sectionElement.querySelectorAll('select[required], input[required]');
    
    requiredElements.forEach(element => {
        if (!element.value.trim()) {
            const errorElement = document.getElementById(`${element.id}Error`);
            if (errorElement) errorElement.style.display = 'block';
            isValid = false;
            element.style.borderColor = 'var(--bad)';
        } else {
            element.style.borderColor = '#ddd';
        }
    });
    
    if (section === 3) {
        const vals = ['marketValue', 'fasecoldaValue', 'expertValue'].map(id => parseFloat(document.getElementById(id).value.replace(/[^0-9.]/g, '')));
        if (vals.some(v => isNaN(v))) { alert('Los valores comerciales deben ser números válidos'); isValid = false; }
    }
    
    if (section === 13) {
        const hasPhotos = ['Front', 'Side', 'Rear', 'Engine'].some(id => document.getElementById(`photo${id}`).files.length > 0);
        if (!hasPhotos) { alert('Por favor suba al menos una foto del vehículo'); isValid = false; }
    }
    
    if (isValid) {
        if (section < totalSections) nextSection(section + 1);
        else generateReport();
    } else {
        const firstError = sectionElement.querySelector('.validation-error[style*="display: block"]');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function sanitizeText(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
function formatCurrency(value) { if (!value || isNaN(value)) return '$0'; return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value); }

function calculateScores() {
    const scores = {};
    for (const sectionId in sectionQuestions) {
        let totalScore = 0, answered = 0;
        sectionQuestions[sectionId].forEach(q => {
            const val = document.getElementById(q.id)?.value;
            if (val === 'Bueno' || val === 'Sí') { totalScore += 100; answered++; }
            else if (val === 'Regular') { totalScore += 60; answered++; }
            else if (val === 'Malo' || val === 'No') { totalScore += 0; answered++; }
        });
        scores[sectionId] = answered > 0 ? Math.round(totalScore / answered) : 0;
    }
    return scores;
}

function calculateGlobalScore(sectionScores) {
    let totalWeighted = 0, totalWeight = 0, penalty = 0;
    for (const s in sectionScores) {
        if (sectionWeights[s]) {
            let score = sectionScores[s];
            if (s == 4 || s == 7) {
                if (score < 50) { score = Math.max(0, score - 30); penalty += 15; }
                else if (score < 70) { score = Math.max(0, score - 15); penalty += 10; }
            }
            totalWeighted += score * sectionWeights[s];
            totalWeight += sectionWeights[s];
        }
    }
    return Math.max(0, Math.round(totalWeighted / totalWeight) - penalty);
}

function generateRecommendations(scores) {
    const recs = [];
    if (scores[4] < 70) recs.push("🔴 Revisar el sistema de fugas de fluidos. Se detectaron fugas que pueden comprometer la seguridad y el rendimiento del motor.");
    if (scores[7] < 70) recs.push("🔧 Realizar un diagnóstico profundo del motor. La compresión o el escaneo OBD-II muestran anomalías.");
    if (scores[5] < 60) recs.push("💡 Inspeccionar el sistema eléctrico. Faros, luces o componentes eléctricos presentan fallas.");
    if (scores[9] < 60) recs.push("🛞 Revisar el tren delantero y suspensión. Se encontraron componentes en estado regular o malo.");
    if (scores[6] < 70) recs.push("🚗 Evaluar la carrocería. Se observaron rayones, abolladuras o posibles trabajos de masilla.");
    if (scores[12] < 60) recs.push("🏁 Realizar una prueba de ruta más exhaustiva. La maniobrabilidad o el frenado presentan deficiencias.");
    if (recs.length === 0) recs.push("✅ El vehículo se encuentra en óptimas condiciones generales. Mantener el mantenimiento preventivo.");
    return recs;
}

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
    let globalScore = calculateGlobalScore(sectionScores);
    let isApproved = globalScore >= 75;
    const recommendations = generateRecommendations(sectionScores);
    
    const radarLabels = [], radarData = [];
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
                    <div class="logo-img">
                        <img src="peritologo.png" alt="PeritoExpert" onerror="this.parentElement.innerHTML='PE'">
                    </div>
                    <div class="logo-text">PERITOEXPERT<span>SISTEMA DE EVALUACIÓN</span></div>
                </div>
                <h1 class="report-title">Informe de Inspección Técnica</h1>
                <div class="report-number">Peritaje #${Math.floor(Math.random() * 10000)}</div>
            </div>
        </div>
        
        <div class="executive-summary">
            <div class="summary-veredict">
                <div id="veredictStamp" class="veredict-stamp ${isApproved ? 'approved' : 'rejected'}">${isApproved ? '✅ APROBADO' : '❌ NO APROBADO'}</div>
                <div style="margin-top: 10px; font-size: 12px;">Según criterios de evaluación</div>
            </div>
            <div id="trafficLight" class="traffic-light ${globalScore >= 75 ? 'green' : (globalScore >= 50 ? 'yellow' : 'red')}">${globalScore}%</div>
            <div class="summary-score">
                <div class="editable-score">
                    <input type="number" id="globalScoreInput" value="${globalScore}" min="0" max="100" step="1">
                    <span>%</span>
                </div>
                <div class="summary-label">Puntaje Global (Editable)</div>
            </div>
        </div>
        
        <div class="vehicle-display">
            <div class="vehicle-photos">
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoFront"></div><div class="photo-label">Frontal</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoSide"></div><div class="photo-label">Lateral</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoRear"></div><div class="photo-label">Trasera</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoEngine"></div><div class="photo-label">Motor</div></div>
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
        
        <div class="section commercial-values">
            <h2 class="section-title">Valores Comerciales</h2>
            ${generateCommercialValuesHTML()}
        </div>
        
        <div class="radar-chart-container">
            <h3>Evaluación por Sistemas</h3>
            <canvas id="radarChart" width="400" height="400"></canvas>
        </div>
        
        <div class="section">
            <h2 class="section-title">Evaluación Detallada</h2>
            ${generateDetailedSectionsHTML(sectionScores)}
        </div>
        
        <div class="recommendations">
            <h3><i class="fas fa-tools"></i> Recomendaciones</h3>
            <ul>${recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
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
            <div id="finalStamp" class="${isApproved ? 'approved-stamp' : 'not-approved-stamp'}">${isApproved ? 'APROBADO' : 'NO APROBADO'}</div>
            <div class="signature-box"><div>Firma del Cliente</div><div class="signature-line"></div><div>Nombre: ____________________</div><div>CC/NIT: ____________________</div></div>
        </div>
        
        <div class="footer">
            <div class="footer-info">
                <div>PERITOEXPERT</div>
                <div>Teléfono: 315 2207097</div>
                <div>Email: info@peritoexpert.com</div>
                <div>WEB: www.peritoexpert.com</div>
            </div>
            <div>Este informe es confidencial y propiedad de PERITOEXPERT. La evaluación se basa en una inspección visual y pruebas funcionales al momento de la revisión.</div>
        </div>
        
        <!-- TÉRMINOS Y CONDICIONES COMPLETOS -->
        <div class="legal-clauses">
            <div style="margin-bottom: 10px; padding: 8px; border: 1px solid #d1ecf1; background-color: #f8f9fa;">
                <h6 style="font-size: 8.5px; color: var(--f1-red); margin-bottom: 5px; font-weight: bold; text-align: center; text-transform: uppercase;">
                    DECLARACIONES, AUTORIZACIONES Y CONDICIONES DEL SERVICIO
                </h6>
                <p style="font-size: 8.5px; color: #333; margin-bottom: 5px; text-align: center; font-weight: bold;">
                    PERITOEXPERT
                </p>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Declaración de veracidad y procedencia del vehículo</p>
                    <p style="margin: 2px 0; text-align: justify;">Declaro bajo gravedad de juramento que toda la información y documentación suministrada a PERITOEXPERT es veraz, completa y corresponde a la realidad. Así mismo, manifiesto que el vehículo presentado para la inspección es de procedencia lícita. En consecuencia, asumo de manera exclusiva cualquier responsabilidad de tipo penal, civil, administrativa o fiscal que se derive de esta orden de trabajo, eximiendo a PERITOEXPERT de cualquier responsabilidad por información falsa, incompleta u omitida.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Autorización para consulta de información</p>
                    <p style="margin: 2px 0; text-align: justify;">Autorizo expresa e irrevocablemente a PERITOEXPERT para consultar mi información personal y la del vehículo en el Registro Único Nacional de Tránsito (RUNT), así como en otras entidades públicas o privadas afiliadas o relacionadas, con el fin de solicitar, consultar y validar la información del vehículo identificado con la placa consignada en el informe de inspección.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Prestación del servicio</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT presta al cliente el servicio de peritaje automotriz, el cual puede incluir inspección técnica, validación de asegurabilidad y avalúo comercial referencial, de acuerdo con el alcance contratado y las condiciones establecidas en el presente informe.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Inspección de asegurabilidad</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa se compromete a realizar la inspección de asegurabilidad del vehículo conforme a los criterios técnicos, protocolos internos y convenios vigentes con las compañías aseguradoras, cuando aplique, aclarando que el dictamen emitido corresponde exclusivamente al estado observable del vehículo al momento de la inspección.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Avalúo comercial</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT se compromete a realizar el avalúo comercial del vehículo conforme a metodologías, referencias del mercado y procedimientos internos establecidos. El resultado del avalúo no compromete a la empresa con la comercialización del automotor, ni constituye una obligación de compra, venta o intermediación.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Notificaciones y reportes</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT bajo ninguna circunstancia realizará notificaciones, reportes, alertas o registros ante autoridades, aseguradoras o terceros respecto al vehículo durante la ejecución del peritaje, salvo que exista una obligación legal expresa que así lo exija.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Derecho de suspensión o retiro del vehículo</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa se reserva el derecho de suspender la inspección o retirar el vehículo del proceso cuando este represente un riesgo para la seguridad del personal, presente fallas mecánicas graves, condiciones estructurales peligrosas o cualquier situación que pueda comprometer la integridad del vehículo o de los inspectores.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">No realización de reparaciones</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT no realiza ningún tipo de reparación, ajuste, mantenimiento ni modificación al vehículo inspeccionado. Todas las pruebas y verificaciones realizadas son únicamente de carácter diagnóstico y observacional.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Resultados del informe</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa no emite conceptos, resultados ni conclusiones distintas a las derivadas directamente de la inspección realizada. PERITOEXPERT no recomienda talleres, empresas ni terceros para la reparación o intervención del vehículo.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Interpretación del informe</p>
                    <p style="margin: 2px 0; text-align: justify;">Los arreglos, reparaciones o decisiones que se deriven del informe de inspección no comprometen a PERITOEXPERT, teniendo en cuenta que el informe puede estar sujeto a diversas interpretaciones técnicas por parte de terceros.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Exoneración por daños durante la inspección</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT no se hace responsable por daños que se presenten durante la inspección cuando estos se deban a condiciones preexistentes del vehículo, desgaste natural o falta de mantenimiento, incluyendo, pero sin limitarse a: bomba de gasolina eléctrica (por bajo nivel de combustible), correa de repartición (por incumplimiento de mantenimientos recomendados por el fabricante), bobinas electrónicas, guayas de acelerador, embrague, frenos, capó, elementos eléctricos, bombillos de farolas, luces de freno, luces exploradoras, motor, caja o transmisión, así como cualquier otro componente que falle por uso previo o deterioro anterior al ingreso del vehículo al peritaje.</p>
                </div>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">SUSPENSIÓN</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> PERITOEXPERT realiza una inspección visual de los componentes visibles del sistema de suspensión.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> La evaluación del estado funcional interno de componentes.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">FRENOS</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Diagnóstico visual y verificación básica del funcionamiento del pedal de freno.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> La determinación del nivel de desgaste de pastillas o zapatas.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">DIRECCIÓN</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Verificación visual de fugas de aceite en la caja de dirección.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> Mediciones de alineación.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">LLANTAS Y RINES</h6>
                <p style="margin: 2px 0;">Se inspecciona el estado del labrado de las llantas. PERITOEXPERT no valida si los rines presentan procesos previos de rectificación.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">SISTEMA ELÉCTRICO</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Se verifica el funcionamiento observable de los sistemas eléctricos.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> La determinación de vida útil de componentes eléctricos.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">TRANSMISIÓN DE POTENCIA</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Inspección visual de fugas de fluidos en diferencial y caja de transmisión.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> La validación del funcionamiento interno de la caja de velocidades.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">CHASIS Y CARROCERÍA</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Revisión visual de puntas de chasis y estructura.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> Medición de cotas estructurales.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">MOTOR</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Revisión visual de fugas de fluidos y niveles.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> Evaluación de desgaste interno.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">VALORES COMERCIALES</h6>
                <p style="margin: 2px 0;">Los valores entregados son referenciales, basados en fuentes del mercado colombiano.</p>
            </div>
        </div>
        
        <div class="action-buttons" style="display: flex; justify-content: center; gap: 15px; margin: 30px 0; flex-wrap: wrap;">
            <button onclick="printReport()" class="btn-action"><i class="fas fa-print"></i> Imprimir</button>
            <button onclick="saveAsPDF()" class="btn-action btn-pdf"><i class="fas fa-file-pdf"></i> Guardar PDF</button>
            <button onclick="saveToDevice()" class="btn-action btn-save"><i class="fas fa-download"></i> Guardar en el teléfono</button>
            <button onclick="newEvaluation()" class="btn-action btn-secondary"><i class="fas fa-plus"></i> Nueva Evaluación</button>
        </div>
    `;
    
    document.getElementById('finalReport').innerHTML = reportHTML;
    loadReportImages();
    animateCommercialValues();
    
    // Configurar evento para el porcentaje editable
    const scoreInput = document.getElementById('globalScoreInput');
    if (scoreInput) {
        scoreInput.addEventListener('input', function() {
            let newScore = parseInt(this.value);
            if (isNaN(newScore)) newScore = 0;
            newScore = Math.min(100, Math.max(0, newScore));
            this.value = newScore;
            const isApprovedNow = newScore >= 75;
            const veredictDiv = document.getElementById('veredictStamp');
            const trafficLight = document.getElementById('trafficLight');
            const stamp = document.getElementById('finalStamp');
            if (veredictDiv) {
                veredictDiv.textContent = isApprovedNow ? '✅ APROBADO' : '❌ NO APROBADO';
                veredictDiv.className = `veredict-stamp ${isApprovedNow ? 'approved' : 'rejected'}`;
            }
            if (trafficLight) {
                trafficLight.textContent = `${newScore}%`;
                trafficLight.className = `traffic-light ${newScore >= 75 ? 'green' : (newScore >= 50 ? 'yellow' : 'red')}`;
            }
            if (stamp) {
                stamp.textContent = isApprovedNow ? 'APROBADO' : 'NO APROBADO';
                stamp.className = isApprovedNow ? 'approved-stamp' : 'not-approved-stamp';
            }
        });
    }
    
    setTimeout(() => {
        const ctx = document.getElementById('radarChart')?.getContext('2d');
        if (ctx) {
            if (radarChart) radarChart.destroy();
            radarChart = new Chart(ctx, {
                type: 'radar',
                data: { labels: radarLabels, datasets: [{ label: 'Puntaje (%)', data: radarData, backgroundColor: 'rgba(225, 6, 0, 0.2)', borderColor: '#e10600', borderWidth: 2, pointBackgroundColor: '#e10600', pointBorderColor: '#fff' }] },
                options: { responsive: true, maintainAspectRatio: true, scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20, callback: v => v + '%' } } } }
            });
        }
    }, 100);
    
    window.scrollTo(0, 0);
}

function generateDetailedSectionsHTML(scores) {
    let html = '';
    [2,4,5,6,7,8,9,10,11,12].forEach(sec => {
        const isCritical = sec === 4 || sec === 7;
        html += `
            <div class="subsection">
                <h3>${sectionNames[sec]} ${isCritical ? '<span style="color: var(--bad);">(Crítica)</span>' : ''}</h3>
                <div class="color-legend">
                    <div class="legend-item"><div class="legend-color green"></div><span data-tooltip="Perfecto estado, sin novedad">Bueno</span></div>
                    <div class="legend-item"><div class="legend-color yellow"></div><span data-tooltip="Rayones, pequeños golpes o desgaste leve">Regular</span></div>
                    <div class="legend-item"><div class="legend-color red"></div><span data-tooltip="Masilla, reparaciones o daños estructurales">Malo</span></div>
                    <div class="legend-item"><div class="legend-color gray"></div><span>No Aplica</span></div>
                </div>
                <div class="${sec === 6 || sec === 5 || sec === 9 || sec === 10 ? 'checklist-full' : 'checklist'}">
                    ${generateChecklistItems(sec)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación ${sectionNames[sec]}</div>
                    <div class="score-value">${scores[sec]}%</div>
                    <div class="gauge"><div class="gauge-value" style="left: ${scores[sec]}%;" data-value="${scores[sec]}"></div></div>
                </div>
            </div>
        `;
    });
    return html;
}

function generateChecklistItems(sectionId) {
    if (!sectionQuestions[sectionId]) return '';
    let html = '';
    sectionQuestions[sectionId].forEach(q => {
        const el = document.getElementById(q.id);
        if (!el) return;
        const val = el.value;
        let statusClass = '', statusText = '', tooltip = '';
        if (val === 'Bueno' || val === 'Sí') { statusClass = 'status-good'; statusText = '✓'; tooltip = 'Perfecto estado, sin novedad'; }
        else if (val === 'Regular') { statusClass = 'status-regular'; statusText = '~'; tooltip = 'Rayones, pequeños golpes o desgaste leve'; }
        else if (val === 'Malo' || val === 'No') { statusClass = 'status-bad'; statusText = '✗'; tooltip = 'Masilla, reparaciones o daños estructurales'; }
        else { statusClass = 'status-na'; statusText = 'N/A'; tooltip = 'No aplica'; }
        html += `<div class="check-item"><div class="status ${statusClass}" data-tooltip="${tooltip}">${statusText}</div><div>${q.text}</div></div>`;
    });
    return html;
}

function generateCommercialValuesHTML() {
    const market = parseFloat(document.getElementById('marketValue').value.replace(/[^0-9.]/g, '')) || 0;
    const fasecolda = parseFloat(document.getElementById('fasecoldaValue').value.replace(/[^0-9.]/g, '')) || 0;
    const expert = parseFloat(document.getElementById('expertValue').value.replace(/[^0-9.]/g, '')) || 0;
    const accessories = parseFloat(document.getElementById('accessoriesValue').value.replace(/[^0-9.]/g, '')) || 0;
    const maxVal = Math.max(market, fasecolda, expert, accessories) || 1;
    return `
        <div class="value-chart"><div class="value-label"><span>Revista Motor</span><span>${formatCurrency(market)}</span></div><div class="value-bar-container"><div class="value-bar" id="marketBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>Fasecolda</span><span>${formatCurrency(fasecolda)}</span></div><div class="value-bar-container"><div class="value-bar" id="fasecoldaBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>PeritoExpert</span><span>${formatCurrency(expert)}</span></div><div class="value-bar-container"><div class="value-bar" id="expertBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>Accesorios</span><span>${formatCurrency(accessories)}</span></div><div class="value-bar-container"><div class="value-bar" id="accessoriesBar" style="width: 0%">0%</div></div></div>
    `;
}

function animateCommercialValues() {
    const market = parseFloat(document.getElementById('marketValue').value.replace(/[^0-9.]/g, '')) || 0;
    const fasecolda = parseFloat(document.getElementById('fasecoldaValue').value.replace(/[^0-9.]/g, '')) || 0;
    const expert = parseFloat(document.getElementById('expertValue').value.replace(/[^0-9.]/g, '')) || 0;
    const accessories = parseFloat(document.getElementById('accessoriesValue').value.replace(/[^0-9.]/g, '')) || 0;
    const maxVal = Math.max(market, fasecolda, expert, accessories) || 1;
    setTimeout(() => {
        const setBar = (id, val) => { const bar = document.getElementById(id); if (bar) { bar.style.width = `${(val / maxVal) * 100}%`; bar.textContent = `${Math.round((val / maxVal) * 100)}%`; } };
        setBar('marketBar', market); setBar('fasecoldaBar', fasecolda); setBar('expertBar', expert); setBar('accessoriesBar', accessories);
    }, 500);
}

function loadReportImages() {
    ['Front', 'Side', 'Rear', 'Engine'].forEach(id => {
        const input = document.getElementById(`photo${id}`);
        const img = document.getElementById(`reportPhoto${id}`);
        if (input?.files?.[0] && img) {
            const reader = new FileReader();
            reader.onload = e => img.src = e.target.result;
            reader.readAsDataURL(input.files[0]);
        } else if (img) {
            img.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%;">Sin imagen</div>';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.photo-upload').forEach(input => {
        input.addEventListener('change', function() {
            const preview = document.getElementById('preview' + this.id.replace('photo', ''));
            if (this.files?.[0] && preview) {
                const reader = new FileReader();
                reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
});

function saveAsPDF() {
    const element = document.getElementById('finalReport');
    const plate = document.getElementById('vehiclePlate').value || 'reporte';
    const date = new Date().toISOString().split('T')[0];
    
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Peritaje_${plate}_${date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            backgroundColor: '#ffffff',
            logging: false
        },
        jsPDF: { 
            unit: 'in', 
            format: 'ledger',
            orientation: 'portrait'
        }
    };
    
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
    btn.disabled = true;
    
    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }).catch((error) => {
        console.error('Error:', error);
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        alert('Error al generar PDF. Por favor intente nuevamente.');
    });
}

// NUEVA FUNCIÓN: Guardar en el teléfono (descarga directa)
function saveToDevice() {
    const element = document.getElementById('finalReport');
    const plate = document.getElementById('vehiclePlate').value || 'reporte';
    const date = new Date().toISOString().split('T')[0];
    
    // Mostrar notificación de carga
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparando...';
    btn.disabled = true;
    
    // Opciones para el PDF (formato más compatible con móviles)
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Peritaje_${plate}_${date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2.5, // Mayor escala para mejor calidad en móviles
            useCORS: true, 
            letterRendering: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', // Cambiamos a A4 para mejor compatibilidad en móviles
            orientation: 'portrait'
        }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        // Mostrar mensaje de éxito
        alert('✅ Informe guardado exitosamente en tu dispositivo.\n\nRevisa la carpeta de Descargas.');
    }).catch((error) => {
        console.error('Error:', error);
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        alert('❌ Error al guardar el informe. Por favor intenta nuevamente.');
    });
}

function printReport() { 
    window.print(); 
}

function newEvaluation() {
    document.getElementById('evaluationForm').reset();
    document.getElementById('evaluationForm').style.display = 'block';
    document.getElementById('finalReport').style.display = 'none';
    document.getElementById('finalReport').innerHTML = '';
    currentSection = 1;
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-1').classList.add('active');
    document.getElementById('progressBar').style.width = '7.7%';
    document.querySelectorAll('.photo-preview').forEach(p => { p.style.display = 'none'; p.src = ''; });
    window.scrollTo(0, 0);
    document.querySelectorAll('select, input').forEach(e => e.style.borderColor = '#ddd');
    document.querySelectorAll('.validation-error').forEach(e => e.style.display = 'none');
}
