# Sitio Ciclo Celular 2° Medio

Sitio educativo estático listo para GitHub Pages.

## Publicación rápida en GitHub Pages
1. Crea un repositorio nuevo.
2. Sube todos los archivos de esta carpeta.
3. En GitHub: Settings > Pages > Deploy from branch > main > /root.
4. Abre la URL pública generada.

## Envío automático de correo
El botón **Guardar y enviar correo** usa FormSubmit con fetch AJAX hacia `belen.acpe@gmail.com`.
No abre Outlook, Gmail ni aplicaciones externas.

Importante: FormSubmit normalmente solicita una confirmación la primera vez que se usa un correo destinatario. Revisar la bandeja de entrada de `belen.acpe@gmail.com` y confirmar el servicio.

## Archivos principales
- `index.html`: página completa.
- `assets/styles.css`: diseño visual responsivo.
- `assets/app.js`: quiz, guardado local, CSV y envío por correo.
- `assets/infografia-ciclo-celular2.png`: infografía principal.


## Versión v3 - Acceso docente protegido

- El envío automático de resultados se mantiene solo hacia `belen.acpe@gmail.com`.
- El reporte pedagógico automático y el panel docente local se muestran únicamente al ingresar:
  - Correo: `belen.acpe@gmail.com`
  - Contraseña: `NeotechEdulab`

Nota técnica: al ser un sitio estático para GitHub Pages, esta protección es de interfaz/local. Para seguridad real con contraseñas ocultas se recomienda migrar el panel docente a Supabase Auth, Cloudflare Access o un Worker con autenticación.


## Material complementario 3D / VR

Se agregó `3d.html` y una sección `#modelo3d` en `index.html` con modelos educativos embebidos desde Sketchfab. Los modelos se cargan por iframe, por lo que el sitio puede subirse a GitHub Pages sin almacenar archivos pesados `.glb` localmente. El reporte pedagógico automático y el envío exclusivo al correo de la profesora se mantienen sin cambios.
