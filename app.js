/* =========================================
   RAVENS GUARD - NFC TRACKING (DUAL ROUTE)
   ========================================= */

const CONFIG = {
    // Tu Proxy de Azure existente
    API_PROXY_URL: 'https://proxyguard.azurewebsites.net/api/ravens-proxy'
};

// Se modifican las llaves de memoria para forzar a los teléfonos a olvidar rutas "fantasma" del pasado
const STORAGE_KEYS = {
    RUTA: 'ravensRuta_v3',
    USER: 'ravensGuardUser_v3',
    QUEUE: 'ravensOfflineQueue_v3',
    SENT: 'ravensMensajesEnviados_v3'
};

// =========================================================
// CATÁLOGOS DE RUTAS (SEPARADOS)
// =========================================================

const CATALOGO_GENERAL = {
    "5A:54:89:C5:07:41:89": { orden: 1, nombre: "Sala de recepción (INICIO DE RECORRIDO GENERAL)" },
    "5A:64:D1:C2:07:41:89": { orden: 2, nombre: "lobby principal" },
    "5A:84:7F:C2:07:41:89": { orden: 3, nombre: "Jardin" },
    "5A:C4:C6:BF:07:41:89": { orden: 4, nombre: "Alberca" },
    "5A:44:89:C5:07:41:89": { orden: 5, nombre: "GYM" },
    "5A:54:D1:C5:07:41:89": { orden: 6, nombre: "Área social 1" },
    "5A:74:7F:C2:07:41:89": { orden: 7, nombre: "Área social 2" },
    "5A:B4:C6:BF:07:41:89": { orden: 8, nombre: "Sotano 4" },
    "5A:34:89:C5:07:41:89": { orden: 9, nombre: "Sotano 3" },
    "5A:44:89:C2:07:41:89": { orden: 10, nombre: "Sotano 2" },
    "5A:64:89:C2:07:41:89": { orden: 11, nombre: "Sotano principal" },
    "5A:A4:C6:BF:07:41:89": { orden: 12, nombre: "Entrada vehicular" },
    "5A:24:89:C5:07:41:89": { orden: 13, nombre: "Azotea torre A 2 Y 3" },
    "5A:34:D1:C2:07:41:89": { orden: 14, nombre: "Piso 15" }, // Corregido: Letra 'C'
    "5A:54:7F:C2:07:41:89": { orden: 15, nombre: "Piso 11" },
    "5A:94:C6:BF:07:41:89": { orden: 16, nombre: "Piso 6" },
    "5A:14:89:C5:07:41:89": { orden: 17, nombre: "Nivel 1" },
    "5A:24:D1:C2:07:41:89": { orden: 18, nombre: "Azotea torre A 1 Y 4" },
    "5A:44:7F:C2:07:41:89": { orden: 19, nombre: "Piso 13" },
    "5A:84:C6:BF:07:41:89": { orden: 20, nombre: "Piso 9" },
    "5A:04:89:C5:07:41:89": { orden: 21, nombre: "Piso 4" },
    "5A:14:D1:C2:07:41:89": { orden: 22, nombre: "Nivel 1" },
    "5A:34:7F:C2:07:41:89": { orden: 23, nombre: "Azotea torre B 5 Y 8" },
    "5A:74:C6:BF:07:41:89": { orden: 24, nombre: "Piso 16" },
    "5A:74:70:AF:08:41:89": { orden: 25, nombre: "Piso 10" },
    "5A:04:D1:C2:07:41:89": { orden: 26, nombre: "Piso 5" },
    "5A:24:7F:C2:07:41:89": { orden: 27, nombre: "Ultimo depto/Sotano 4" },
    "5A:64:C6:BF:07:41:89": { orden: 28, nombre: "Azotea torre B 6 Y 7" }, // Corregido: Letra 'C'
    "5A:E4:88:C5:07:41:89": { orden: 29, nombre: "Piso 15" },
    "5A:F4:D0:C2:07:41:89": { orden: 30, nombre: "Piso 10" },
    "5A:14:7F:C2:07:41:89": { orden: 31, nombre: "Piso 5" },
    "5A:54:C6:BF:07:41:89": { orden: 32, nombre: "Nivel 1 Torre B (FIN DE RECORRIDO GENERAL)" }
};

const CATALOGO_AREAS_COMUNES = {
    "5A:54:89:C5:07:41:89": { orden: 1, nombre: "Sala de recepción (INICIO DE RECORRIDO ÁREAS COMUNES)" },
    "5A:64:D1:C2:07:41:89": { orden: 2, nombre: "lobby principal" },
    "5A:84:7F:C2:07:41:89": { orden: 3, nombre: "Jardin" },
    "5A:C4:C6:BF:07:41:89": { orden: 4, nombre: "Alberca" },
    "5A:44:89:C5:07:41:89": { orden: 5, nombre: "GYM" },
    "5A:54:D1:C5:07:41:89": { orden: 6, nombre: "Área social 1" },
    "5A:74:7F:C2:07:41:89": { orden: 7, nombre: "Área social 2" },
    "5A:B4:C6:BF:07:41:89": { orden: 8, nombre: "Sotano 4" },
    "5A:34:89:C5:07:41:89": { orden: 9, nombre: "Sotano 3" },
    "5A:44:89:C2:07:41:89": { orden: 10, nombre: "Sotano 2" },
    "5A:64:89:C2:07:41:89": { orden: 11, nombre: "Sotano principal" },
    "5A:A4:C6:BF:07:41:89": { orden: 12, nombre: "Entrada vehicular (FIN DE RECORRIDO ÁREAS COMUNES)" }
};

const STATE = {
    session: {
        isLoggedIn: false,
        condominioId: null,
        usuario: null
    },
    ruta: {
        enCurso: false,
        tipo: null, // Guardará 'GENERAL' o 'AREAS_COMUNES'
        pasoActual: 1,
        sesionId: null // ID único para evitar duplicados en la sesión actual
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
                    
                    <h1 style="color:white; font-size:1.6rem; margin:0;">RAVENS GUARD SEI</h1>
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
                        <button class="btn-primary" onclick="iniciarRecorrido('GENERAL')" style="padding: 10px; font-size: 0.9rem; flex: 1; min-width: 120px;">
                            INICIAR GENERAL
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
    return STATE.ruta.tipo === 'GENERAL' ? CATALOGO_GENERAL : CATALOGO_AREAS_COMUNES;
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
    
    // Normalizamos quitando espacios y forzando mayúsculas. 
    // Mantenemos la C ya que está correcta en tu hardware.
    const leidoLimpio = serialLeido.trim().toUpperCase();
    const catalogo = getCatalogoActivo();
    
    for (const key in catalogo) {
        const keyLimpia = key.trim().toUpperCase();
        if (keyLimpia === leidoLimpio) {
            return catalogo[key];
        }
    }
    return null;
}

function cargarEstadoRuta() {
    const guardado = localStorage.getItem(STORAGE_KEYS.RUTA);
    if (guardado) {
        STATE.ruta = JSON.parse(guardado);
    }
}

function guardarEstadoRuta() {
    localStorage.setItem(STORAGE_KEYS.RUTA, JSON.stringify(STATE.ruta));
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
        const nombreRutaStr = STATE.ruta.tipo === 'GENERAL' ? 'General' : 'Áreas Comunes';

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
        STATE.ruta.sesionId = new Date().getTime().toString(); 
        
        guardarEstadoRuta();
        actualizarUIRuta();
        
        const nombreRuta = tipo === 'GENERAL' ? 'General' : 'Áreas Comunes';
        showModal('success', `Recorrido de ${nombreRuta} iniciado. Dirígete a escanear el Paso 1.`);
    }
}

function cancelarRecorrido() {
    if (confirm("¿Seguro que deseas cancelar el recorrido actual? Tendrás que empezar desde el paso 1.")) {
        STATE.ruta.enCurso = false;
        STATE.ruta.tipo = null;
        STATE.ruta.pasoActual = 1;
        STATE.ruta.sesionId = null;
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
            
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(STATE.session));
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
    localStorage.removeItem(STORAGE_KEYS.USER);
    STATE.session = { isLoggedIn: false, condominioId: null, usuario: null };
    navigate('LOGIN');
}

function checkSession() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.USER);
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

    const tagInfo = encontrarTagEnCatalogo(serialNumber);
    const catalogoActivo = getCatalogoActivo();
    const totalPasos = getTotalPasosActivo();
    
    if (!tagInfo) {
        console.log("Leído por la antena:", serialNumber);
        showModal('error', `Tag no reconocido en la ruta de ${STATE.ruta.tipo}.`);
        return;
    }

    if (tagInfo.orden !== STATE.ruta.pasoActual) {
        const nombreEsperado = getNombrePaso(STATE.ruta.pasoActual, catalogoActivo);
        showModal('error', `¡Punto Incorrecto! Estás en '${tagInfo.nombre}'. Te toca ir a: '${nombreEsperado}' (Paso ${STATE.ruta.pasoActual})`);
        return;
    }

    // Determinar Tipo de Marca
    let tipoMarca = "Rondín";
    if (STATE.ruta.pasoActual === 1) tipoMarca = "Inicio";
    if (STATE.ruta.pasoActual === totalPasos) tipoMarca = "Fin";

    // Azure solo para Inicio y Fin (Cuando FÍSICAMENTE se escanea el tag)
    if (tipoMarca === "Inicio" || tipoMarca === "Fin") {
        await registerPositionInDB(serialNumber, tipoMarca, STATE.ruta.sesionId);
    } else {
        showModal('success', `Punto ${STATE.ruta.pasoActual} validado: ${tagInfo.nombre}`);
    }

    // Avanzar de paso
    if (STATE.ruta.pasoActual === totalPasos) {
        STATE.ruta.enCurso = false;
        STATE.ruta.pasoActual = 1;
        STATE.ruta.tipo = null; 
        STATE.ruta.sesionId = null; 
        
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

function registrarMensajeExitoso(sesionId, tipoMarca) {
    if (!sesionId) return;
    let exitosos = JSON.parse(localStorage.getItem(STORAGE_KEYS.SENT)) || {};
    exitosos[`${sesionId}_${tipoMarca}`] = true;
    localStorage.setItem(STORAGE_KEYS.SENT, JSON.stringify(exitosos));
}

function mensajeYaFueEnviado(sesionId, tipoMarca) {
    if (!sesionId) return false;
    let exitosos = JSON.parse(localStorage.getItem(STORAGE_KEYS.SENT)) || {};
    return exitosos[`${sesionId}_${tipoMarca}`] === true;
}

function limpiarHistorialExitosos() {
    localStorage.setItem(STORAGE_KEYS.SENT, JSON.stringify({}));
}

async function registerPositionInDB(tagId, tipoMarca, sesionId) {
    
    if (mensajeYaFueEnviado(sesionId, tipoMarca)) {
        showModal('success', `Paso validado localmente (Aviso de ${tipoMarca} ya se había enviado).`);
        return;
    }

    showModal('loading', `Procesando aviso de ${tipoMarca}...`);

    const payload = {
        action: 'submit_form',
        formulario: 'RONDINES_V2', 
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
        },
        meta_sesionId: sesionId 
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
            registrarMensajeExitoso(sesionId, tipoMarca);
            showModal('success', `Aviso de ${tipoMarca} registrado en línea.`);
            
            if (tipoMarca === 'Fin') limpiarHistorialExitosos();

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
    let queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUEUE)) || [];
    queue.push(payload);
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    updateSyncUI();
}

async function syncOfflineData(isManual = false) {
    if (!navigator.onLine) {
        if (isManual) showModal('error', "Aún no hay conexión a internet estable.");
        return;
    }

    let queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUEUE)) || [];
    if (queue.length === 0) {
        updateSyncUI();
        return;
    }

    if (isManual) showModal('loading', `Revisando ${queue.length} avisos pendientes...`);

    let newQueue = [];
    let successCount = 0;
    let ignoradosCount = 0;
    let lastErrorMsg = ""; 

    for (let i = 0; i < queue.length; i++) {
        let item = queue[i];
        let sesionId = item.meta_sesionId;
        let tipoMarca = item.data.TipoMarca;

        if (mensajeYaFueEnviado(sesionId, tipoMarca)) {
            ignoradosCount++;
            continue; 
        }

        try {
            const response = await fetch(CONFIG.API_PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            
            if (response.ok) {
                registrarMensajeExitoso(sesionId, tipoMarca);
                successCount++;
            } else {
                newQueue.push(item); 
                lastErrorMsg = "Rechazado por el servidor";
            }
        } catch (error) {
            newQueue.push(item); 
            lastErrorMsg = "Fallo de red o Proxy caído";
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(newQueue));
    updateSyncUI();
    
    if (isManual) {
        if (newQueue.length === 0) {
            let msg = successCount > 0 ? `¡${successCount} avisos enviados con éxito!` : "Cola limpia. No había avisos nuevos que enviar.";
            if (ignoradosCount > 0) msg += ` (${ignoradosCount} duplicados ignorados).`;
            showModal('success', msg);
            limpiarHistorialExitosos();
        } else {
            showModal('error', `Se enviaron ${successCount}. Fallaron ${newQueue.length}. Motivo: ${lastErrorMsg}`);
        }
    }
}

function updateSyncUI() {
    const syncBadge = document.getElementById('sync-status');
    if (!syncBadge) return;

    let queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUEUE)) || [];
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
