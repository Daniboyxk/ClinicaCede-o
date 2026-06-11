/* ==========================================================================
   Comportamiento Dinámico y Agendamiento - Clínica Federico Cedeño
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar elementos de fecha y restricciones
    inicializarFechasYAño();
    
    // Configurar escuchadores de eventos
    configurarEscuchadores();
    
    // Ejecutar revelación inicial
    reveal();
    window.addEventListener("scroll", reveal);
});

// ==========================================================================
// CONFIGURACIÓN DE PRODUCCIÓN:
// Reemplace el número a continuación con el WhatsApp real de la clínica.
// Formato internacional: código de país + número (sin "+" ni espacios).
// Ejemplo para Ecuador: "593XXXXXXXXX"
// ==========================================================================
const clinicWhatsAppNumber = "34656612873"; // Número de WhatsApp de la clínica 

// Mapa de equivalencia de los servicios principales
const serviciosNombres = {
    "1": "Consulta General",
    "2": "Cirugía General",
    "3": "Cirugía Menor"
};

// Referencias a elementos del DOM
const fechaInput = document.getElementById('fecha');
const heroDateInput = document.getElementById('hero-date');
const horaSelect = document.getElementById('hora_inicio');
const form = document.getElementById('bookingForm');
const msgDiv = document.getElementById('formMessage');
const yearLabel = document.getElementById('year-label');
const backToTopBtn = document.getElementById('backToTop');

/**
 * Revelación suave de elementos al hacer scroll
 */
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
            element.classList.add("active");
        }
    });
}

/**
 * Inicialización de restricciones de fecha mínima y año automático en footer
 */
function inicializarFechasYAño() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    
    if (fechaInput) fechaInput.min = formattedToday;
    if (heroDateInput) heroDateInput.min = formattedToday;
    if (yearLabel) yearLabel.textContent = yyyy;
}

/**
 * Vinculación de eventos de usuario
 */
function configurarEscuchadores() {
    // Horarios dinámicos cuando cambia fecha o servicio
    if (fechaInput) {
        fechaInput.addEventListener('change', cargarHorasEstaticas);
    }
    
    document.querySelectorAll('input[name="servicio_id"]').forEach(radio => {
        radio.addEventListener('change', cargarHorasEstaticas);
    });

    // Interceptar el envío del formulario
    if (form) {
        form.addEventListener('submit', procesarEnvioWhatsApp);
    }

    // Botón volver arriba (Scroll Listener)
    window.addEventListener('scroll', controlBotonVolverArriba);
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/**
 * Selecciona un servicio de forma programada desde otra sección
 */
function seleccionarServicio(id) {
    const radio = document.querySelector(`input[name="servicio_id"][value="${id}"]`);
    if (radio) {
        radio.checked = true;
        cargarHorasEstaticas();
    }
}

/**
 * Copia los filtros seleccionados en la cabecera (Hero) hacia el formulario de reserva
 */
function prepararReservaDesdeHero() {
    const heroSelect = document.getElementById('hero-select');
    if (heroSelect && heroSelect.value) {
        seleccionarServicio(heroSelect.value);
    }
    if (heroDateInput && heroDateInput.value) {
        fechaInput.value = heroDateInput.value;
        cargarHorasEstaticas();
    }
}

/**
 * Carga de slots horarios dinámicos según el día seleccionado en el calendario
 */
function cargarHorasEstaticas() {
    if (!fechaInput || !fechaInput.value) return;
    
    const fechaVal = fechaInput.value;
    const msgP = document.getElementById('hora_mensaje');

    horaSelect.disabled = true;
    if (msgP) msgP.classList.add('hidden');

    const dateObj = new Date(fechaVal + 'T00:00:00');
    const dayOfWeek = dateObj.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    let optionsHtml = '<option value="">Seleccione una hora</option>';
    let slots = [];

    if (dayOfWeek === 0) {
        // Domingo: Cerrado
        horaSelect.innerHTML = '<option value="">Cerrado los domingos</option>';
        if (msgP) {
            msgP.textContent = 'Los domingos solo atendemos emergencias médicas directas.';
            msgP.classList.remove('hidden');
        }
        return;
    } else if (dayOfWeek === 6) {
        // Sábado: 09:00 AM a 02:00 PM (intervalos de 30 minutos)
        slots = generarSlotsHorarios("09:00", "14:00", 30);
    } else {
        // Lunes a Viernes: 08:00 AM a 05:00 PM (intervalos de 30 minutos)
        slots = generarSlotsHorarios("08:00", "17:00", 30);
    }

    slots.forEach(slot => {
        optionsHtml += `<option value="${slot.valor}">${slot.texto}</option>`;
    });

    horaSelect.innerHTML = optionsHtml;
    horaSelect.disabled = false;
}

/**
 * Helper para estructurar los intervalos de tiempo del desplegable
 */
function generarSlotsHorarios(inicio, fin, intervaloMinutos) {
    const slots = [];
    let [hInicio, mInicio] = inicio.split(':').map(Number);
    let [hFin, mFin] = fin.split(':').map(Number);

    let actualMinutes = hInicio * 60 + mInicio;
    const finMinutes = hFin * 60 + mFin;

    while (actualMinutes < finMinutes) {
        const hour = Math.floor(actualMinutes / 60);
        const minutes = actualMinutes % 60;
        
        const hh = String(hour).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const timeString = `${hh}:${mm}`;
        
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const dispHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        const displayString = `${String(dispHour).padStart(2, '0')}:${mm} ${ampm}`;

        slots.push({ valor: timeString, texto: displayString });
        actualMinutes += intervaloMinutos;
    }
    return slots;
}

/**
 * Intercepta el formulario, genera la plantilla del mensaje y redirige a WhatsApp
 */
function procesarEnvioWhatsApp(e) {
    e.preventDefault();
    if (!msgDiv) return;

    msgDiv.classList.add('hidden');

    const radioChecked = document.querySelector('input[name="servicio_id"]:checked');
    const servicioId = radioChecked ? radioChecked.value : null;
    const servicioNombre = serviciosNombres[servicioId] || "Consulta Médica";
    
    const fecha = fechaInput ? fechaInput.value : '';
    const hora = horaSelect ? horaSelect.value : '';
    const nombre = document.getElementById('paciente_nombre').value.trim();
    const apellido = document.getElementById('paciente_apellido').value.trim();
    const telefono = document.getElementById('paciente_telefono').value.trim();
    const email = document.getElementById('paciente_email').value.trim() || 'No provisto';

    // Generar plantilla estructurada de WhatsApp
    const mensaje = `Hola, *Clínica Dr. Federico Cedeño*.\n\n` + 
                    `Me gustaría agendar una cita médica a través de la web:\n\n` +
                    `📌 *Especialidad:* ${servicioNombre}\n` +
                    `📅 *Fecha:* ${fecha}\n` +
                    `⏰ *Hora:* ${hora}\n\n` +
                    `👤 *Paciente:* ${nombre} ${apellido}\n` +
                    `📞 *Teléfono:* ${telefono}\n` +
                    `✉️ *Email:* ${email}\n\n` +
                    `Quedo atento(a) a su confirmación. ¡Muchas gracias!`;

    const urlMensaje = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${clinicWhatsAppNumber}?text=${urlMensaje}`;

    // Mostrar mensaje de redirección local
    msgDiv.classList.remove('hidden', 'bg-amber-50', 'text-amber-700', 'border-amber-200');
    msgDiv.classList.add('bg-green-50', 'text-green-700', 'border-green-200');
    msgDiv.innerHTML = `<i class="fas fa-check-circle mr-1"></i> Redirigiendo a WhatsApp para confirmar su cita...`;

    // Redirección con retraso para mejorar el feedback visual
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        form.reset();
        if (horaSelect) {
            horaSelect.innerHTML = '<option value="">Seleccione fecha primero</option>';
            horaSelect.disabled = true;
        }
        msgDiv.classList.add('hidden');
    }, 1000);
}

/**
 * Controla la animación del botón de volver arriba en base a la posición del scroll
 */
function controlBotonVolverArriba() {
    if (!backToTopBtn) return;
    
    if (window.scrollY > 400) {
        backToTopBtn.classList.remove('translate-y-20', 'opacity-0');
        backToTopBtn.classList.add('translate-y-0', 'opacity-100');
    } else {
        backToTopBtn.classList.remove('translate-y-0', 'opacity-100');
        backToTopBtn.classList.add('translate-y-20', 'opacity-0');
    }
}
