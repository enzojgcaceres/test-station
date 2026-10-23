# Sandbox del Messenger de Intercom — template

Página de pruebas para desplegar y testear el chat web de Intercom (Messenger + Fin) de un cliente, sin depender de su sitio. Primer uso: Medstation (UI en portugués de Brasil).

Stack: Next.js 14 (App Router) · TypeScript · Tailwind 3 · framer-motion · lucide-react. Deploy en Vercel, sin variables de entorno obligatorias.

## Qué permite probar

| Sección | Qué hace | API de Intercom |
|---|---|---|
| Estado | Widget cargado, Messenger abierto, no leídos, identidad actual | `booted`, `onShow`, `onHide`, `onUnreadCountChange` |
| Messenger | Abrir, cerrar, ir a cada espacio, abrir conversación con texto precargado | `show`, `hide`, `showSpace`, `showNewMessage` |
| Identidade | Reiniciar como usuario (nombre, email, user_id) o como visitante, con idioma forzado | `shutdown` + `boot`, `language_override` |
| Atributo | Enviar un atributo personalizado | `update` |
| Evento | Disparar un evento para workflows u outbound | `trackEvent` |
| Log ao vivo | Registra cada acción del panel y cada callback del widget | `onUserEmailSupplied` y los de arriba |

## Adaptarlo a otro cliente

1. Crear un repo nuevo a partir de este (o clonar y cambiar el `origin`).
2. **app_id**: definir `NEXT_PUBLIC_INTERCOM_APP_ID` en Vercel (o `.env.local`). Sin definirla usa el de Medstation, así que no te olvides. Se saca de Intercom › Settings › Installation › Web.
3. **Región del workspace**: si el workspace está alojado en EU o Australia, cambiar `INTERCOM_API_BASE` en `lib/intercom.ts` por `https://api-iam.eu.intercom.io` o `https://api-iam.au.intercom.io`. Por defecto es EE. UU.
4. **Nombre del cliente**: reemplazar "Medstation" en `app/page.tsx` (header y título) y en `app/layout.tsx` (metadata). La inicial del logo está en el header de `app/page.tsx`.
5. **Colores**: la paleta `med` en `tailwind.config.ts`. Con cambiar esos 6 tonos se rebrandea toda la página.
6. **Idioma**: los textos están escritos directamente en `components/Sandbox.tsx`, `app/page.tsx` y `app/layout.tsx` (`lang`, metadata y `toLocaleTimeString`). No hay archivo de traducciones; se reemplazan a mano.
7. **Valores precargados** (mensaje, atributo `pais`, evento): los `useState` iniciales al principio de `Sandbox.tsx`. Conviene usar un atributo y un evento que existan en el workspace del cliente.

## Correr y deployar

```bash
npm install
npm run dev     # http://localhost:3000
```

Vercel: importar el repo, framework Next.js, sin configuración extra. Agregar `NEXT_PUBLIC_INTERCOM_APP_ID` si el cliente no es Medstation.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `components/IntercomScript.tsx` | El snippet oficial de instalación, sin cambios salvo el app_id parametrizado |
| `lib/intercom.ts` | app_id, región, helper `ic()` y `reboot()` (shutdown + boot) |
| `components/Sandbox.tsx` | Panel de pruebas y log en vivo |
| `app/page.tsx` | Portada y marca del cliente |
| `tailwind.config.ts` | Paleta y tipografías |

## Limitaciones conocidas

- **Verificación de identidad**: si el workspace exige Messenger security (JWT / user_hash), "Entrar como usuário" falla porque la página no firma al usuario. Hace falta un endpoint que genere el token con el secreto del workspace; el secreto nunca va en el frontend.
- **Atributos**: Intercom ignora los atributos personalizados que no existan en el workspace.
- **Idioma del Messenger**: la página traduce su propia interfaz, no el chat. El idioma del Messenger depende del navegador o de `language_override`, y el workspace tiene que tener ese idioma habilitado, con los mensajes y el contenido de Fin traducidos.
- **Dominios**: si el workspace restringe los dominios donde puede cargar el Messenger, agregar el dominio de Vercel.
- La página se marca `noindex`; igual cualquiera con el link la ve. No publicar datos reales de clientes ahí.
