# Clínica del Día Federico Cedeño - Landing Page

Sitio web moderno, responsivo y de alta conversión diseñado para la consulta privada del **Dr. Federico Cedeño** en Chone, Manabí, Ecuador.

---

## 🚀 Características Clave

* **Diseño Premium y Moderno:** Interfaz estilizada con efectos de glassmorphism, sombras suaves, tipografía elegante (Outfit) y animaciones de scroll interactivas.
* **Agendamiento Inteligente por WhatsApp:** Formulario dinámico de reserva que valida los campos requeridos y construye un mensaje de confirmación formateado en negritas enviándolo directamente al chat de la clínica.
* **Lógica de Horarios Dinámica:**
  * **Lunes a Viernes:** Citas disponibles de 08:00 AM a 05:00 PM (cada 30 min).
  * **Sábados:** Citas disponibles de 09:00 AM a 02:00 PM (cada 30 min).
  * **Domingos:** Selector de horas deshabilitado con alerta informativa (solo emergencias directas).
* **Seguridad y Privacidad de Datos:** El número telefónico está protegido de raspadores (scrapers) automatizados y no se muestra como texto plano, sino a través de enlaces de llamada a la acción seguros ("Contactar por WhatsApp").
* **Optimización SEO:** Incluye metaetiquetas para previsualizaciones en redes sociales (Open Graph y Twitter Cards), `robots.txt` y mapa del sitio XML (`sitemap.xml`).
* **Rendimiento y Despliegue:** Optimizado para carga rápida. Contiene un archivo `.htaccess` configurado para caché de archivos estáticos y compresión en servidores Apache.

---

## 🛠️ Tecnologías Utilizadas

* **Estructura:** HTML5 Semántico
* **Estilos:** Tailwind CSS (vía CDN) con paleta personalizada de colores médicos (Teal/Emerald/Rose)
* **Iconos:** FontAwesome 6 (vía CDN)
* **Tipografía:** Google Fonts (Outfit)
* **Lógica:** Vanilla JavaScript (ES6+)

---

## 💻 Ejecución Local

Para probar el sitio web localmente:

1. Asegúrate de tener instalado [Node.js](https://nodejs.org/).
2. Abre tu terminal en la carpeta raíz del proyecto y ejecuta:
   ```bash
   npx http-server -p 8000
   ```
3. Abre en tu navegador la dirección `http://localhost:8000`.

---

## 🌐 Despliegue en Producción

El sitio está listo para subirse directamente a cualquier hosting tradicional (Hostinger, BanaHosting, etc.) en el directorio público `public_html`. No requiere compilación de código ni base de datos para funcionar.
