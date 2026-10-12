# Análisis Exhaustivo del Paper y Guía del Programa Interactivo

Este documento contiene el análisis completo del paper de **Balseiro et al. (2022)** (*Ecología Austral* 32:638-649) y la guía detallada del simulador web interactivo diseñado para su ejecución en `localhost`.

---

## 1. Ficha Bibliográfica y Contexto

- **Título**: *Stoichiometric constraints in plankton communities of Patagonian lakes: Implications for Parabroteas sarsi distribution and conservation*
- **Autores**: Esteban Balseiro, Beatriz Modenutti, Cecilia Laspoumaderes, Luca Schenone, Marcela Bastidas Navarro & Nicolás Martyniuk
- **Institución**: Laboratorio de Limnología, INIBIOMA, CONICET - Universidad Nacional del Comahue (Bariloche, Argentina).
- **Publicación**: *Ecología Austral* 32:638-649 (2022) | DOI: [10.25260/EA.22.32.2.1.1841](https://doi.org/10.25260/EA.22.32.2.1.1841)

### El Organismo de Estudio
*Parabroteas sarsi* (Daday, 1901) es un copépodo calanoideo de la familia Centropagidae que habita lagos y lagunas de la Patagonia y la Antártida (39°S - 68°S). Es **uno de los copépodos dulceacuícolas más grandes del mundo** (hasta 7.5 mm de longitud en hembras adultas) y actúa como el **depredador invertebrado tope** en lagos sin peces.

### El Problema
La introducción masiva de peces (truchas como *Oncorhynchus mykiss* y percas nativas traslocadas) provocó la **extinción local de *P. sarsi* en lagunas someras**. El paper investiga si este colapso se debe solo a la depredación visual directa o si existe un mecanismo subyacente de **restricción estequiométrica** generado por la alteración de la comunidad de presas.

---

## 2. Marco Teórico: Estequiometría Ecológica y "El Filo de la Navaja"

1. **Hipótesis de la Tasa de Crecimiento (Growth Rate Hypothesis - GRH):** Los organismos con alto crecimiento demandan grandes cantidades de ARN ribosomal (rRNA), el cual es rico en fósforo. Por ende, requieren alimento con baja relación Carbono:Fósforo (C:P).
2. **Hipótesis del Filo de la Navaja (Stoichiometric Knife-Edge Hypothesis):** A diferencia de modelos tradicionales donde menor C:P siempre es mejor, el crecimiento somático ($g$) tiene forma de **joroba parabólica**:
   - **Filo derecho (C:P > 215):** Escasez crítica de fósforo para ARN y proteínas $\to$ crecimiento nulo o negativo ($g \le 0$).
   - **Filo izquierdo (C:P < 108):** Exceso de fósforo en relación al carbono. El animal debe gastar gran energía en excretar el fósforo y sufre inanición de carbono $\to$ crecimiento negativo ($g < 0$).
   - **Ventana de crecimiento positivo:** Estrecho rango entre **C:P ~ 108 y 215**, con un óptimo en **162.5 atómico**.

---

## 3. Las 6 Figuras del Paper y sus Conclusiones

1. **Figura 1 (Distribución en 101 lagos):**
   - 92 lagos son sin peces (prístinos, *P. sarsi* dominante).
   - Solo 9 lagos tienen peces y *P. sarsi*: 7 son lagos andinos profundos (>30 m) con refugio en la penumbra; 2 son lagunas someras con vegetación densa. En lagunas someras abiertas con peces, la extinción es del 100%.
2. **Figura 2 (Espectro de tamaño de alimento en ontogenia):**
   - Nauplios a CII: microfagia algal (20 - 100 µm).
   - CIII a CV: omnivoría y primeros rotíferos/crustáceos (100 - 1200 µm).
   - Adultos: macrofagia carnívora de presas de 1000 a 3000 µm (mandíbulas dentadas y maxilípedos alargados).
3. **Figura 3 (C:P ontogenético y variabilidad):**
   - Nauplios y CII tienen C:P muy bajo (mínimo de ~45 en CII) con varianza casi nula (**homeostasis estricta**).
   - Adultos alcanzan C:P de 317 a 350 con enorme dispersión (**homeostasis débil**, alta dependencia de la calidad de presa).
4. **Figura 4 (Tamaño y C:P de presas vs remoción por peces):**
   - **¡Ninguna presa cae en la zona de crecimiento positivo (108 a 215)!**
   - Cladóceros (*Daphnia*): C:P = 65 - 75 (por debajo de la zona).
   - Copépodos (*Boeckella*): C:P = 228 - 240 (por encima de la zona).
   - *P. sarsi* está **obligado a combinar presas** (Geometría Nutricional).
   - Los peces eliminan presas $\ge 1.5$ mm, extinguiendo a *Daphnia*. El depredador queda solo con copépodos de C:P > 228 y colapsa estequiométricamente.
5. **Figura 5 (Curva del Filo de la Navaja):**
   - Validación experimental en laboratorio con dietas monotípicas. Máximo crecimiento en C:P ~ 162.5 (+0.010 d⁻¹); tasas negativas en dietas puras de *Daphnia* (-0.012 d⁻¹) o *Boeckella*.
6. **Figura 6 (Cascada trófica en fitoplancton y tamaño de zooplancton):**
   - Sin peces: >98% fitoflagelados, zooplancton hasta 1.7 mm.
   - Con peces: >98% cianobacterias (floraciones), zooplancton < 0.45 mm.

---

## 4. Instrucciones del Programa y Archivo `start.bat`

El programa interactivo está construido en HTML5, CSS3 y JavaScript con Chart.js local y está ubicado en:
- `index.html` (interfaz principal)
- `app.css` (estilos limnológicos)
- `app.js` (lógica y modelos estequiométricos)
- `lib/chart.umd.min.js` (biblioteca gráfica local)
- `assets/` (las 6 figuras originales en alta definición)
- `start.bat` (lanzador en 1 clic)

### Cómo Iniciar:
1. Haz **doble clic en `start.bat`**.
2. Se iniciará el servidor HTTP local de Python y se abrirá automáticamente en tu navegador:
   `http://localhost:8000`
3. Para pantalla completa: Haz clic en el botón superior **`⛶ Pantalla Completa`** (o presiona `F11`). Para salir en cualquier momento, presiona **`Esc`**.
4. Para detener el servidor, presiona `Ctrl + C` en la ventana de comandos.

---

## 5. Módulos Interactivos Disponibles en la Aplicación

- **🔪 Pestaña 1: Filo de la Navaja & Geometría Nutricional (Diseño Cockpit Sin Scroll)**
  - **Gráficas arriba y visibles de inmediato:** Las dos gráficas (*Curva del Filo de la Navaja* y *Dinámica Poblacional a 30 Días*) se muestran lado a lado junto a la columna de controles y los 3 indicadores clave (C:P, $g$ y Estado).
  - **Deslizadores compactos en tiempo real:** Al mover cualquier slider de presa o presionar un botón de escenario preconfigurado (*Óptima*, *Daphnia*, *Boeckella*, *Con Peces*), ambas gráficas se actualizan de forma instantánea sin necesidad de bajar la pantalla.
  - **Sección Teórica al Pie:** Desplazando hacia abajo se encuentra el análisis detallado del experimento y el panel con las estadísticas de los 101 lagos analizados.

- **🐟 Pestaña 2: Impacto de Peces & Cascada Trófica (Gráfica Arriba)**
  - **Gráfica comunitaria en la parte superior:** El gráfico de barras comparativo (flagelados, cianobacterias, Daphnia y abundancia de P. sarsi) se ubica arriba junto al control de siembra de truchas (0-100%) y el selector de profundidad del lago.
  - **Relato dinámico al pie:** La explicación ecológica del colapso hacia cianobacterias (>98%) se ubica debajo de la interacción visual.

- **🔬 Pestaña 3: Ontogenia & Homeostasis**
  - Selector superior de los 8 estadios ontogenéticos con gráfica de evolución del C:P somático (Figura 3) en primer plano.

- **📖 Pestaña 4: Análisis del Paper & Galería de Figuras Originales**
  - Las 6 figuras del paper en alta resolución con visor modal interactivo en pantalla completa.

- **📊 Pestaña 5: Tabla de Presas y Base de Datos**
  - Tabla biométrica y estequiométrica de las 8 presas patagónicas.

---

## 6. Despliegue en GitHub Pages (100% Compatible)

La aplicación está preparada para ser subida directamente a un repositorio de GitHub y compartida online:
1. Sube los archivos a tu repositorio en GitHub (`index.html`, `app.css`, `app.js`, `lib/`, `assets/`).
2. En GitHub ve a **Settings** > **Pages**.
3. En **Branch**, selecciona `main` (o `master`) y carpeta `/(root)`. Haz clic en **Save**.
4. ¡Listo! En 1 minuto tendrás tu enlace público (ej. `https://tu-usuario.github.io/tu-repositorio/`) totalmente responsivo y accesible tanto en ordenadores de laboratorio como en teléfonos móviles.
