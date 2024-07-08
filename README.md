# AppTracking

Descripción de la Aplicación:
Mi aplicación web basada en Node.js con Express y MongoDB permite a los usuarios gestionar envíos utilizando diferentes servicios de paquetería.

Manual de Configuración y Ejecución de la Aplicación

Prerrequisitos

1) Node.js: Asegúrarse de tener Node.js instalado en el sistema. Puedes descargarlo desde nodejs.org.
2) MongoDB: Debes tener una instancia de MongoDB en ejecución. Puedes usar un servicio en la nube como MongoDB Atlas o una instancia local.

Paso 1: Clonar el Repositorio
Clona el repositorio de tu proyecto desde GitHub.

Paso 2: Instalar Dependencias
Instala todas las dependencias necesarias utilizando npm.

Paso 3: Configurar Variables de Entorno
Crea un archivo .env en la raíz del proyecto y configura las variables de entorno necesarias.

Paso 4: Estructura del Proyecto
Asegúrate de que tu estructura de archivos sea similar a la siguiente:
  /node_modules
  /models
      shipping.js
  /routes
      routes.js
  /views
      layout/
          header.ejs
          footer.ejs
      index.ejs
      new.ejs
      edit.ejs
  app.js
  package.json
  .env

Paso 5: Configurar la Conexión a MongoDB
En app.js, asegúrate de tener configurada la conexión a tu base de datos MongoDB.

Paso 6: Ejecutar la Aplicación
Inicia la aplicación usando npm.
Nota: Esto debería iniciar tu servidor en el puerto especificado (por defecto 3000).

Paso 7: Acceder a la Aplicación
Abre tu navegador web y navega a http://localhost:3000 para acceder a la aplicación.

Funcionalidades Principales
1) Página Principal: Muestra una lista de todos los envíos registrados.
2) Agregar Envío: Navega a /new para acceder al formulario de creación de envío.
3) Editar Envío: Navega a /edit/:id para editar un envío específico.
4) Eliminar Envío: Selecciona el ícono de eliminar en la lista de envíos para borrar un envío.
5) Seguimiento de Envíos: Usa los enlaces generados en la lista de envíos para consultar el estado de un envío en las     APIs de DHL o 99minutos.

Notas Adicionales
API Key: Asegúrate de tener tus claves API configuradas correctamente en el archivo routes.js.
