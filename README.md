# 🔥 FogónPOS Meseros — App Móvil Android

> **Sistema de punto de venta móvil para meseros en restaurantes colombianos con soporte para facturación electrónica DIAN.**  
> Diseñado para operación de alto rendimiento en sala, arquitectura hexagonal desacoplada, capacidades *offline-first* y experiencia nativa en Android con Capacitor.

---

## 📋 Resumen del Proyecto

**FogónPOS Meseros** es una aplicación móvil diseñada específicamente para el ritmo de trabajo de los meseros en restaurantes de alta rotación (como asaderos y restaurantes llaneros tradicionales en Colombia). 

El proyecto está concebido bajo estándares de ingeniería de software de nivel producción:
- **Arquitectura Hexagonal (Ports & Adapters):** La interfaz gráfica y la lógica de negocio dependen exclusivamente de puertos abstractos. La app puede operar tanto con **Mocks en memoria** (simulando latencia de red y tiempos reales de cocina) como con un **Backend REST/WebSocket real**, conmutables mediante una única variable de entorno (`useMocks`).
- **Diseño Ergonómico Móvil ("Fogón Llanero"):** Paleta cálida con fondo carbón oscuro (`#121212`) y acentos naranja brasa (`#ff5722`), pensada para uso con una sola mano, botones de tamaño táctil mínimo de 48px y teclado numérico en pantalla propio.
- **Preparada para la DIAN:** Modelado del dominio con impuestos colombianos (Impuesto Nacional al Consumo del 8%, IVA 19%, Excluido), propina sugerida voluntaria del 10% y solicitud de Factura Electrónica con validación de tipo de documento (CC, NIT, CE, Pasaporte).

---

## 🛠️ Stack Tecnológico

| Capa / Herramienta | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework Web** | **Angular** | Standalone Components, Signals reactivos, nuevo control de flujo (`@if`, `@for`), TypeScript estricto sin `any`. |
| **Estilos** | **SCSS** | Tokens de diseño centralizados (`_variables.scss`), responsive móvil y manejo de safe-areas. |
| **Envoltorio Nativo** | **Capacitor** | Empaquetado nativo para Android Studio con scheme HTTP para pruebas locales. |
| **Plugins Nativos** | `@capacitor/*` | `preferences` (sesión persistente), `haptics` (vibración táctil), `local-notifications` (pedidos listos), `network` (detección de red). |
| **Tiempo Real** | **Socket.IO Client** | Recepción de eventos de cocina, disponibilidad de platos y actualización de mesas. |
| **Offline-First** | **IndexedDB (`idb`)** | Almacenamiento local, caché de catálogo y cola de sincronización con idempotencia (`idLocal` UUID). |

---

## 📂 Estructura del Workspace Multi-Proyecto

El repositorio está organizado como un workspace multi-proyecto de Angular para garantizar máxima separación de responsabilidades:

```text
fogon-pos/
├── capacitor.config.ts         # Configuración nativa de Capacitor (Android)
├── android/                    # Proyecto nativo Android generado para Android Studio
└── projects/
    ├── shared/                 # 📦 LIBRERÍA COMPARTIDA DE DOMINIO
    │   └── src/lib/
    │       ├── models/         # Modelos e interfaces TypeScript puras del negocio
    │       │   ├── mesero.model.ts          (Mesero, Sesión, Rol)
    │       │   ├── mesa.model.ts            (Mesa, EstadoMesa)
    │       │   ├── producto.model.ts        (Producto, Categoria, TipoImpuesto)
    │       │   ├── pedido.model.ts          (Pedido, ItemPedido, EstadoItem)
    │       │   ├── cliente.model.ts         (DatosCliente, Factura Electrónica)
    │       │   └── solicitud-cuenta.model.ts
    │       └── ports/          # Contratos e interfaces (Clases abstractas para DI)
    │           ├── auth.port.ts
    │           ├── mesas.port.ts
    │           ├── catalogo.port.ts
    │           ├── pedidos.port.ts
    │           └── realtime.port.ts
    │
    └── meseros/                # 📱 APLICACIÓN MÓVIL DEL MESERO
        └── src/
            ├── environments/   # Configuración de entornos (useMocks: true/false)
            ├── styles/         # Tokens de diseño del tema "Fogón Llanero"
            └── app/
                ├── core/       # Infraestructura y acceso a datos
                │   ├── auth/          # Servicio de sesión, Guards e Interceptor HTTP
                │   ├── data/
                │   │   ├── mock/      # Implementaciones simuladas (datos llaneros)
                │   │   └── http/      # Implementaciones reales con HttpClient
                │   ├── realtime/      # Sockets reales + simulador de cocina
                │   ├── offline/       # Cola local en IndexedDB y sincronizador
                │   └── notifications/ # Notificaciones locales y haptics
                ├── features/   # Módulos funcionales de la aplicación
                │   ├── login-pin/     # Selección de mesero y teclado numérico propio
                │   ├── mis-mesas/     # Cuadrícula por zona con semáforo de estados
                │   ├── detalle-mesa/  # Comensales, ítems y envío a cocina
                │   ├── tomar-pedido/  # Menú con tabs, bottom sheet y notas rápidas
                │   └── solicitar-cuenta/ # Tiquete POS / Factura Electrónica DIAN
                └── ui/         # Componentes visuales desacoplados (TopBar, cards, badges)
```

---

## 🎨 Sistema de Diseño "Fogón Llanero"

La app implementa un sistema visual propio optimizado para pantallas OLED y ambientes con iluminación variable:

- **Fondo Carbón:** `#121212` (ahorro de batería y descanso visual).
- **Acentos Brasa Viva:** `#ff5722` y `#ff7043` para llamados a la acción principales.
- **Semáforo de Estados de Mesa:**
  - ⚪ **LIBRE** (`#757575` - Gris carbón): Mesa desocupada lista para abrir.
  - 🔵 **OCUPADA** (`#2196f3` - Azul): Comensales ubicados tomando el pedido.
  - 🟠 **ESPERANDO COMIDA** (`#ff9800` - Naranja): Pedido enviado a comanda / en preparación.
  - 🟢 **PIDIÓ CUENTA** (`#4caf50` - Verde): Comensales listos para pagar.

---

## 🚀 Puesta en Marcha y Desarrollo

### Prerrequisitos
- **Node.js**: v20+ o v24+
- **npm**: v10+
- **Angular CLI**: v19+ o v22+
- **Android Studio**: Con Android SDK instalado (API 33+) para ejecución nativa o en emulador.

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Compilar la librería compartida
```bash
ng build shared
```

### 3. Ejecución en Navegador (Desarrollo Web)
Para probar la app rápidamente en el navegador con emulación móvil:
```bash
ng serve meseros
```
Abre en tu navegador `http://localhost:4200` y activa el modo de dispositivo móvil en las herramientas de desarrollador (`F12` -> Toggle device toolbar).

### 4. Compilación y Ejecución en Android Studio
Para compilar la app y transferirla al emulador nativo de Android:

```bash
# Compilar la aplicación y sincronizar los recursos con Android
ng build meseros && npx cap sync android

# Abrir el proyecto nativo en Android Studio
npx cap open android
```

En **Android Studio**:
1. Espera la sincronización automática de Gradle.
2. Selecciona un emulador (ej. Pixel 7 / API 34) o tu dispositivo físico conectado por USB.
3. Presiona el botón verde **Run** (`Shift + F10`).

---

## ⚙️ Conmutación entre Mocks y Backend Real

La aplicación está lista para integrarse al backend sin modificar componentes:

- **Modo Mocks (por defecto en desarrollo):**  
  En `projects/meseros/src/environments/environment.ts`:
  ```typescript
  export const environment = {
    production: false,
    useMocks: true, // Usa datos en memoria con retardo aleatorio de 300-800ms
    apiUrl: 'http://10.0.2.2:3000',
    wsUrl: 'http://10.0.2.2:3000'
  };
  ```

- **Modo Backend Real (Producción o pruebas de integración):**  
  En `projects/meseros/src/environments/environment.prod.ts`:
  ```typescript
  export const environment = {
    production: true,
    useMocks: false, // Inyecta HttpClient y Socket.IO apuntando a la API real
    apiUrl: 'https://api.fogonpos.com',
    wsUrl: 'https://api.fogonpos.com'
  };
  ```

---

## 🗺️ Hoja de Ruta de Desarrollo

- [x] **Paso 1: Base y Arquitectura** (Workspace multi-proyecto, modelos, puertos, adaptadores mock/http, tema visual y setup de Capacitor Android).
- [ ] **Paso 2: Login con PIN** (Selector visual de meseros, teclado numérico propio, feedback háptico con `@capacitor/haptics`, persistencia con `@capacitor/preferences` e interceptor de autenticación).
- [ ] **Paso 3: Mis Mesas** (Cuadrícula agrupada por zonas, semáforo de colores, apertura rápida de mesa y pull-to-refresh).
- [ ] **Paso 4: Tomar Pedido** (Catálogo llanero por pestañas, buscador, bottom sheet con comensales y notas predeterminadas).
- [ ] **Paso 5: Detalle de Mesa y Cocina** (Agrupación por comensal, envío de comanda y cambio de estado en vivo con Socket.IO).
- [ ] **Paso 6: Notificaciones** (Avisos de platos listos en segundo plano con `@capacitor/local-notifications` y navegación directa).
- [ ] **Paso 7: Solicitar Cuenta & DIAN** (Tiquete POS, Factura Electrónica con validación de CC/NIT, división por comensal y propina del 10%).
- [ ] **Paso 8: Modo Sin Conexión** (Caché local con `idb`, cola de sincronización resiliente e interruptor de simulación offline).
- [ ] **Paso 9: Pulido Final** (Íconos adaptativos con `@capacitor/assets`, pruebas unitarias y generación de APK).

---

## 👨‍💻 Autor

Proyecto desarrollado como muestra de portafolio para aplicaciones móviles modernas, arquitecturas escalables y soluciones para el sector gastronómico en Colombia.
