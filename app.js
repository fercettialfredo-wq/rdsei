/* =========================================
   RAVENS GUARD - NFC TRACKING (DUAL ROUTE)
   ========================================= */

const CONFIG = {
    // Tu Proxy de Azure existente
    API_PROXY_URL: 'https://proxyguard.azurewebsites.net/api/ravens-proxy'
};

// =========================================================
// CATÁLOGOS DE RUTAS (SEPARADOS)
// =========================================================
// AQUÍ DEBES ACOMODAR TUS TAGS. 
// Asegúrate de que el 'orden' empiece en 1 para CADA recorrido.

const CATALOGO_TORRES = {
    "53:A5:1B:F3:32:00:01": { orden: 1, nombre: "Punto Azotea 1" },
    "53:2A:57:F2:32:00:01": { orden: 2, nombre: "Punto Azotea 2" },
    "53:95:CB:F2:32:00:01": { orden: 3, nombre: "Cuarto de maquinas" },
    "53:DC:B9:F1:32:00:01": { orden: 4, nombre: "Cuarto de maquinas piso 15" },
    "53:71:A9:F2:32:00:01": { orden: 5, nombre: "Escaleras de emergencia piso 15" },
    "53:34:DB:F2:32:00:01": { orden: 6, nombre: "Escaleras de emergencia piso 13" },
    "53:7F:8F:F2:32:00:01": { orden: 7, nombre: "Escaleras de emergencia piso 11" },
    "53:A8:38:F3:32:00:01": { orden: 8, nombre: "Escaleras de emergencia piso 9" },
    "53:E7:06:F3:32:00:01": { orden: 9, nombre: "Escaleras de emergencia piso 7" },
    "53:41:F7:F2:32:00:01": { orden: 10, nombre: "Escaleras de emergencia piso 5" },
    "53:3E:2B:F3:32:00:01": { orden: 11, nombre: "Escaleras de emergencia piso 3" },
    "5A:D4:88:C5:07:41:89": { orden: 12, nombre: "Vertical Piso 3" },
    "53:DB:26:F2:32:00:01": { orden: 13, nombre: "Vertical Piso 5" },
    "5A:E4:D0:C2:07:41:89": { orden: 14, nombre: "Vertical Piso 7" },
    "5A:04:7F:C2:07:41:89": { orden: 15, nombre: "Vertical Piso 9" },
    "5A:44:C6:BF:07:41:89": { orden: 16, nombre: "Vertical Piso 11" },
    "53:26:64:F2:32:00:01": { orden: 17, nombre: "Vertical Piso 13" },
    "53:EB:03:F2:32:00:01": { orden: 18, nombre: "Vertical Piso 15 (FIN TORRES)" }
};

const CATALOGO_AREAS_COMUNES = {
    "53:64:14:F3:32:00:01": { orden: 1, nombre: "Cocineta" },
    "53:F9:EF:F2:32:00:01": { orden: 2, nombre: "Fondo lobby" },
    "53:A5:FF:F2:32:00:01": { orden: 3, nombre: "Principio lobby" },
    "53:FF:23:F3:32:00:01": { orden: 4, nombre: "Rampa entrada" },
    "53:18:6C:F2:32:00:01": { orden: 5, nombre: "Agencia" },
    "53:42:80:F2:32:00:01": { orden: 6, nombre: "Vespa" },
    "53:18:73:F2:32:00:01": { orden: 7, nombre: "Medidores" },
    "53:33:CA:F1:32:00:01": { orden: 8, nombre: "Rampa salida" },
    "53:95:EC:F1:32:00:01": { orden: 9, nombre: "Subestación" },
    "53:22:46:F3:32:00:01": { orden: 10, nombre: "Plumas de sotano" },
    "53:99:96:F2:32:00:01": { orden: 11, nombre: "Estacionamiento -2 alto" },
    "53:58:87:F2:32:00:01": { orden: 12, nombre: "Estacionamiento -2 bajo" },
    "53:ED:A3:F2:32:00:01": { orden: 13, nombre: "Estacionamiento -3 alto" },
    "53:EB:B6:F2:32:00:01": { orden: 14, nombre: "Estacionamiento -3 bajo" },
    "53:D8:D2:F2:32:00:01": { orden: 15, nombre: "Estacionamiento -4 alto" },
    "53:2A:0A:F2:32:00:01": { orden: 16, nombre: "Estacionamiento -4 bajo" },
    "53:07:35:F2:32:00:01": { orden: 17, nombre: "Estacionamiento -5 alto" },
    "53:94:15:F2:32:00:01": { orden: 18, nombre: "Estacionamiento -5 bajo" },
    "53:B4:AF:F2:32:00:01": { orden: 19, nombre: "Estacionamiento -6 alto" },
    "53:27:BE:F2:32:00:01": { orden: 20, nombre: "Estacionamiento -6 bajo" },
    "53:4B:50:F2:32:00:01": { orden: 21, nombre: "Estacionamiento -7 alto" },
    "53:0C:11:F2:32:00:01": { orden: 22, nombre: "Estacionamiento -7 bajo" },
    "53:31:F8:F1:32:00:01": { orden: 23, nombre: "Estacionamiento -8 alto" },
    "53:AF:E6:F1:32:00:01": { orden: 24, nombre: "Estacionamiento -8 bajo" },
    "53:05:E1:F1:32:00:01": { orden: 25, nombre: "Cuarto bombas" },
    "53:53:2E:F2:32:00:01": { orden: 26, nombre: "Vertical PB LG (FIN ÁREAS COMUNES)" }
};

const STATE = {
    session: {
        isLoggedIn: false,
        condominioId: null,
        usuario: null
    },
    ruta: {
        enCurso: false,
        tipo: null, // Guardará 'TORRES' o 'AREAS_COMUNES'
        pasoActual: 1
    },
    isScanning: false,
    isProcessing: false, 
    ndefReader: null,
    abortController: null 
};

/* =========================================
   1. PANTALLAS
   ========================================= */

const SCREENS = {
    'LOGIN': `
        <div class="login-screen">
            <div class="login-box">
                <div style="text-align:center; margin-bottom:40px;">
                    <img src="icons/logo.png" alt="Logo" style="width: 120px; height: auto; margin-bottom: 15px;">
                    
                    <h1 style="color:white; font-size:1.6rem; margin:0;">NUEVO NOMBRE APP</h1>
                    <p style="color:#666; font-size:0.8rem;">Control de Rondines NFC</p>
                </div>
                <div class="input-group">
                    <label>Usuario</label>
                    <input type="text" id="login-user" class="form-input" placeholder="Guardia">
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <input type="password" id="login-pass" class="form-input" placeholder="••••••">
                </div>
                <button class="btn-primary" onclick="doLogin()">INGRESAR</button>
                <p id="login-error" style="color:#ef4444; text-align:center; margin-top:20px; display:none;"></p>
            </div>
        </div>
    `,

    'MAIN': `
        <div class="main-screen">
            <header class="header-app">
                <div class="header-logo-text">
                    RONDINES 
                    <span id="sync-status" onclick="syncOfflineData(true)" style="font-size:0.75rem; color:#facc15; display:none; cursor:pointer; background:rgba(255,255,255,0.15); padding:4px 8px; border-radius:6px; margin-left:10px;">
                        <i class="fas fa-sync-alt"></i> Pendientes
                    </span>
                </div>
                <div onclick="doLogout()" style="cursor:pointer; color:#ef4444;" title="Cerrar sesión">
                    <i class="fas fa-sign-out-alt fa-lg"></i>
                </div>
            </header>
            
            <div class="scan-container">
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px; margin-bottom: 25px; text-align: center;">
                    <div id="route-info" style="color: #facc15; font-size: 1rem; font-weight: bold; margin-bottom: 15px;">
                        Selecciona un recorrido para comenzar.
                    </div>
                    
                    <div id="botones-inicio" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="iniciarRecorrido('TORRES')" style="padding: 10px; font-size: 0.9rem; flex: 1; min-width: 120px;">
                            INICIAR TORRES
                        </button>
                        <button class="btn-primary" onclick="iniciarRecorrido('AREAS_COMUNES')" style="padding: 10px; font-size: 0.9rem; flex: 1; min-width: 120px; background: #10b981;">
                            INICIAR ÁREAS
                        </button>
                    </div>

                    <div id="btn-cancelar-container" style="display: none;">
                        <button class="btn-primary" onclick="cancelarRecorrido()" style="padding: 10px; font-size: 0.9rem; background: #ef4444; width: 100%;">
                            CANCELAR RECORRIDO
                        </button>
                    </div>
                </div>

                <div id="status-text" style="color:white; margin-bottom:30px; font-size:1.2rem; font-weight:bold;">Listo para escanear</div>
                
                <div id="nfc-btn" class="nfc-button" onclick="toggleNFCScan()">
                    <i class="fas fa-wifi"></i>
                    <span id="btn-text">ESCANEAR</span>
                </div>

                <div class="info-text">
                    Acerca el dispositivo al punto de control NFC.
                    Asegúrate de seguir el orden exacto de la ruta seleccionada.
                </div>
            </div>
        </div>
    `
};

/* =========================================
   2. FUNCIONES PRINCIPALES Y RUTA
   ========================================= */

function navigate(screenName) {
    const viewport = document.getElementById('viewport');
    if (viewport) {
        viewport.innerHTML = SCREENS[screenName];
        if (screenName === 'MAIN') {
            actualizarUIRuta(); 
            updateSyncUI(); 
        }
    }
}

function getCatalogoActivo() {
    return STATE.ruta.tipo === 'TORRES' ? CATALOGO_TORRES : CATALOGO_AREAS_COMUNES;
}

function getTotalPasosActivo() {
    return Object.keys(getCatalogoActivo()).length;
}

function getNombrePaso(ordenBuscado, catalogo) {
    for (const key in catalogo) {
        if (catalogo[key].orden === ordenBuscado) {
            return catalogo[key].nombre;
        }
    }
    return "Punto Desconocido";
}

function encontrarTagEnCatalogo(serialLeido) {
    if (!serialLeido || !STATE.ruta.tipo) return null;
    
    const leidoLimpio = serialLeido.trim().toUpperCase();
    const catalogo = getCatalogoActivo();
    
    for (const key in catalogo) {
        if (key.trim().toUpperCase() === leidoLimpio) {
            return catalogo[key];
        }
    }
    return null;
}

function cargarEstadoRuta() {
    const guardado = localStorage.getItem('ravensRuta');
    if (guardado) {
        STATE.ruta = JSON.parse(guardado);
    }
}

function guardarEstadoRuta() {
    localStorage.setItem('ravensRuta', JSON.stringify(STATE.ruta));
}

function actualizarUIRuta() {
    const info = document.getElementById('route-info');
    const boxBotonesInicio = document.getElementById('botones-inicio');
    const boxBtnCancelar = document.getElementById('btn-cancelar-container');
    
    if (!info || !boxBotonesInicio || !boxBtnCancelar) return;

    if (STATE.ruta.enCurso) {
        const catalogo = getCatalogoActivo();
        const totalPasos = getTotalPasosActivo();
        const nombreEsperado = getNombrePaso(STATE.ruta.pasoActual, catalogo);
        const nombreRutaStr = STATE.ruta.tipo === 'TORRES' ? 'Torres' : 'Áreas Comunes';

        info.innerHTML = `Ruta: ${nombreRutaStr}<br>Paso ${STATE.ruta.pasoActual} de ${totalPasos}<br><span style="color:white; font-size:0.9rem;">Dirígete a: ${nombreEsperado}</span>`;
        
        boxBotonesInicio.style.display = 'none';
        boxBtnCancelar.style.display = 'block';
    } else {
        info.innerHTML = "Selecciona un recorrido para comenzar.";
        boxBotonesInicio.style.display = 'flex';
        boxBtnCancelar.style.display = 'none';
    }
}

function iniciarRecorrido(tipo) {
    if (!STATE.ruta.enCurso) {
        STATE.ruta.enCurso = true;
        STATE.ruta.tipo = tipo;
        STATE.ruta.pasoActual = 1;
        guardarEstadoRuta();
        actualizarUIRuta();
        
        const nombreRuta = tipo === 'TORRES' ? 'Torres' : 'Áreas Comunes';
        showModal('success', `Recorrido de ${nombreRuta} iniciado. Dirígete al Paso 1.`);
    }
}

function cancelarRecorrido() {
    if (confirm("¿Seguro que deseas cancelar el recorrido actual? Tendrás que empezar desde el paso 1.")) {
        STATE.ruta.enCurso = false;
        STATE.ruta.tipo = null;
        STATE.ruta.pasoActual = 1;
        guardarEstadoRuta();
        actualizarUIRuta();
    }
}

// --------------------

async function doLogin() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const errorMsg = document.getElementById('login-error');

    if(!user || !pass) return;

    if (!navigator.onLine) {
        errorMsg.innerText = "Necesitas conexión a internet para iniciar sesión.";
        errorMsg.style.display = "block";
        return;
    }

    const btn = document.querySelector('.btn-primary');
    btn.innerText = "Verificando...";
    btn.disabled = true;

    try {
        const response = await fetch(CONFIG.API_PROXY_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ action: 'login', username: user, password: pass }) 
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            const condId = data.condominioId || data.condominio || (data.data && data.data.condominio) || "NO_ID";
            
            STATE.session = {
                isLoggedIn: true,
                condominioId: condId,
                usuario: user
            };
            
            localStorage.setItem('ravensGuardUser', JSON.stringify(STATE.session));
            cargarEstadoRuta();
            navigate('MAIN');
        } else { 
            throw new Error(data.message || "Credenciales incorrectas."); 
        }
    } catch (error) { 
        errorMsg.innerText = error.message; 
        errorMsg.style.display = "block";
        btn.innerText = "INGRESAR";
        btn.disabled = false;
    }
}

function doLogout() {
    localStorage.removeItem('ravensGuardUser');
    STATE.session = { isLoggedIn: false, condominioId: null, usuario: null };
    navigate('LOGIN');
}

function checkSession() {
    try {
        const saved = localStorage.getItem('ravensGuardUser');
        if (saved) {
            const parsedData = JSON.parse(saved);
            
            if (parsedData && parsedData.isLoggedIn === true && parsedData.usuario) {
                STATE.session = parsedData;
                cargarEstadoRuta();
                navigate('MAIN');
                return;
            }
        }
    } catch (e) {
        console.error("Error al recuperar la sesión local:", e);
    }
    
    navigate('LOGIN');
}

/* =========================================
   3. LÓGICA NFC Y VALIDACIÓN EDGE
   ========================================= */

async function toggleNFCScan() {
    const btn = document.getElementById('nfc-btn');
    const statusTxt = document.getElementById('status-text');
    const btnTxt = document.getElementById('btn-text');

    if (STATE.isScanning || STATE.isProcessing) return;

    if (!STATE.ruta.enCurso) {
        alert("Debes seleccionar e iniciar un recorrido antes de escanear.");
        return;
    }

    if (!('NDEFReader' in window)) {
        alert("Tu dispositivo no soporta lectura NFC web. Usa Chrome en Android.");
        return;
    }

    try {
        STATE.abortController = new AbortController(); 
        STATE.ndefReader = new NDEFReader();
        
        await STATE.ndefReader.scan({ signal: STATE.abortController.signal });
        
        STATE.isScanning = true;
        btn.classList.add('scanning');
        statusTxt.innerText = "Acerca el TAG ahora...";
        btnTxt.innerText = "LEYENDO...";

        STATE.ndefReader.onreading = event => {
            handleNFCReading(event);
        };

        STATE.ndefReader.onreadingerror = () => {
            if (STATE.isProcessing) return;
            STATE.isProcessing = true; 
            showModal('error', "Error al leer etiqueta. Intenta de nuevo.");
            resetScanUI();
        };

    } catch (error) {
        console.error(error);
        alert("Error al iniciar NFC: " + error);
        resetScanUI();
    }
}

function resetScanUI() {
    STATE.isScanning = false;
    const btn = document.getElementById('nfc-btn');
    const statusTxt = document.getElementById('status-text');
    const btnTxt = document.getElementById('btn-text');
    
    if(btn) {
        btn.classList.remove('scanning');
        statusTxt.innerText = "Listo para escanear";
        btnTxt.innerText = "ESCANEAR";
    }
}

async function handleNFCReading(event) {
    if (STATE.isProcessing) return; 
    
    STATE.isProcessing = true;

    if (STATE.abortController) {
        STATE.abortController.abort();
    }

    const serialNumber = event.serialNumber;
    
    if (!serialNumber) {
        showModal('error', "Lectura vacía");
        resetScanUI();
        return;
    }

    resetScanUI();

    // 1. Validar usando el catálogo de la ruta actual
    const tagInfo = encontrarTagEnCatalogo(serialNumber);
    const catalogoActivo = getCatalogoActivo();
    const totalPasos = getTotalPasosActivo();
    
    if (!tagInfo) {
        console.log("Leído por la antena:", serialNumber);
        showModal('error', `Tag no reconocido en la ruta de ${STATE.ruta.tipo}.`);
        return;
    }

    // 2. Validar orden estricto localmente
    if (tagInfo.orden !== STATE.ruta.pasoActual) {
        const nombreEsperado = getNombrePaso(STATE.ruta.pasoActual, catalogoActivo);
        showModal('error', `¡Punto Incorrecto! Estás en '${tagInfo.nombre}'. Te toca ir a: '${nombreEsperado}' (Paso ${STATE.ruta.pasoActual})`);
        return;
    }

    // 3. Determinar Tipo de Marca
    let tipoMarca = "Rondín";
    if (STATE.ruta.pasoActual === 1) tipoMarca = "Inicio";
    if (STATE.ruta.pasoActual === totalPasos) tipoMarca = "Fin";

    // 4. Lógica Híbrida: Azure solo para Inicio y Fin
    if (tipoMarca === "Inicio" || tipoMarca === "Fin") {
        await registerPositionInDB(serialNumber, tipoMarca);
    } else {
        showModal('success', `Punto ${STATE.ruta.pasoActual} validado: ${tagInfo.nombre}`);
    }

    // 5. Avanzar de paso
    if (STATE.ruta.pasoActual === totalPasos) {
        STATE.ruta.enCurso = false;
        STATE.ruta.pasoActual = 1;
        STATE.ruta.tipo = null; // Reiniciar selección
        
        setTimeout(() => {
            showModal('success', "¡RECORRIDO COMPLETADO CON ÉXITO!");
        }, 1200);
    } else {
        STATE.ruta.pasoActual++;
    }
    
    guardarEstadoRuta();
    actualizarUIRuta();
}

/* =========================================
   4. COMUNICACIÓN INICIO/FIN CON AZURE + COLA PENDIENTE
   ========================================= */

async function registerPositionInDB(tagId, tipoMarca) {
    showModal('loading', `Procesando aviso de ${tipoMarca}...`);

    const payload = {
        action: 'submit_form',
        formulario: 'RONDINES_V2', // <--- ESTE ES EL CAMBIO CLAVE PARA EL PROXY
        condominio: STATE.session.condominioId,
        usuario: STATE.session.usuario,
        data: {
            TagID: tagId,
            Guardia: STATE.session.usuario,
            Condominio: STATE.session.condominioId,
            Fecha: new Date().toISOString(),
            TipoMarca: tipoMarca, 
            Ruta: STATE.ruta.tipo,
            Estatus: "Completado"
        }
    };

    if (!navigator.onLine) {
        saveToOfflineQueue(payload);
        showModal('success', `Aviso de ${tipoMarca} guardado en pendientes (Sin red).`);
        return;
    }

    try {
        const response = await fetch(CONFIG.API_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showModal('success', `Aviso de ${tipoMarca} registrado en línea.`);
        } else {
            saveToOfflineQueue(payload);
            showModal('error', `Error del servidor. El aviso de ${tipoMarca} se guardó en pendientes.`);
        }
    } catch (error) {
        saveToOfflineQueue(payload);
        showModal('success', `Aviso de ${tipoMarca} guardado en pendientes (Red inestable).`);
    }
}

function saveToOfflineQueue(payload) {
    let queue = JSON.parse(localStorage.getItem('ravensOfflineQueue')) || [];
    queue.push(payload);
    localStorage.setItem('ravensOfflineQueue', JSON.stringify(queue));
    updateSyncUI();
}

// -----------------------------------------------------
// FUNCIÓN DE SINCRONIZACIÓN MANUAL
// -----------------------------------------------------
async function syncOfflineData(isManual = false) {
    if (!navigator.onLine) {
        if (isManual) showModal('error', "Aún no hay conexión a internet estable.");
        return;
    }

    let queue = JSON.parse(localStorage.getItem('ravensOfflineQueue')) || [];
    if (queue.length === 0) {
        updateSyncUI();
        return;
    }

    if (isManual) showModal('loading', `Enviando ${queue.length} avisos pendientes...`);

    let newQueue = [];
    let successCount = 0;
    let lastErrorMsg = ""; 

    for (let i = 0; i < queue.length; i++) {
        try {
            const response = await fetch(CONFIG.API_PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queue[i])
            });
            
            if (response.ok) {
                successCount++;
            } else {
                newQueue.push(queue[i]); 
                lastErrorMsg = "Rechazado por el servidor";
            }
        } catch (error) {
            newQueue.push(queue[i]); 
            lastErrorMsg = "Fallo de red o Proxy caído";
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    localStorage.setItem('ravensOfflineQueue', JSON.stringify(newQueue));
    updateSyncUI();
    
    if (isManual) {
        if (newQueue.length === 0) {
            showModal('success', "¡Avisos pendientes enviados con éxito!");
        } else {
            showModal('error', `Se enviaron ${successCount}. Fallaron ${newQueue.length}. Motivo: ${lastErrorMsg}`);
        }
    }
}

function updateSyncUI() {
    const syncBadge = document.getElementById('sync-status');
    if (!syncBadge) return;

    let queue = JSON.parse(localStorage.getItem('ravensOfflineQueue')) || [];
    if (queue.length > 0) {
        syncBadge.style.display = 'inline-block';
        syncBadge.innerHTML = `<i class="fas fa-sync-alt"></i> ${queue.length} Pendiente(s)`;
    } else {
        syncBadge.style.display = 'none';
    }
}

/* =========================================
   5. UTILIDADES UI (MODAL)
   ========================================= */

function showModal(type, text) {
    const modal = document.getElementById('status-modal');
    if (!modal) return;
    
    let content = '';

    if (type === 'loading') {
        content = `<div class="modal-content"><i class="fas fa-circle-notch fa-spin modal-icon" style="color:#2563eb"></i><p>${text}</p></div>`;
    } else if (type === 'success') {
        content = `<div class="modal-content"><i class="fas fa-check-circle modal-icon" style="color:#16a34a"></i><p>${text}</p><button class="btn-primary" onclick="closeModal()" style="margin-top:10px; background:#16a34a">OK</button></div>`;
    } else if (type === 'error') {
        content = `<div class="modal-content"><i class="fas fa-times-circle modal-icon" style="color:#ef4444"></i><p>${text}</p><button class="btn-primary" onclick="closeModal()" style="margin-top:10px;">Cerrar</button></div>`;
    }

    modal.innerHTML = content;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('status-modal');
    if (modal) modal.style.display = 'none';
    STATE.isProcessing = false; 
}

/* =========================================
   6. EVENTOS DE RED Y ARRANQUE
   ========================================= */

window.addEventListener('online', () => {
    console.log("Conexión restaurada. Intentando enviar avisos pendientes silenciosamente.");
    syncOfflineData(false);
});

window.onload = () => {
    checkSession();
};
