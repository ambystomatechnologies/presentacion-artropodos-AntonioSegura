# Restricciones Estequiométricas en Lagos Patagónicos: *Parabroteas sarsi*

> **Simulador Interactivo de Estequiometría Ecológica & Redes Tróficas Lacustres**  
> Basado en la investigación de:  
> **Esteban Balseiro, Beatriz Modenutti, Cecilia Laspoumaderes, Luca Schenone, Marcela Bastidas Navarro & Nicolás Martyniuk (2022)**  
> *Ecología Austral* 32:638–649.  
> 🔗 **DOI:** [10.25260/EA.22.32.2.1.1841](https://doi.org/10.25260/EA.22.32.2.1.1841) | 📖 **Leer Paper Online:** [Ecología Austral OJS](https://ojs.ecologiaaustral.com.ar/index.php/Ecologia_Austral/article/view/1841/1182)

---

## 🌐 Demo Online (GitHub Pages)

Accede a la aplicación interactiva directamente en tu navegador (compatible con PC, tablets y smartphones):  
👉 **[https://ambystomatechnologies.github.io/presentacion-artropodos-AntonioSegura/](https://ambystomatechnologies.github.io/presentacion-artropodos-AntonioSegura/)**

---

## 🔬 Resumen Científico

*Parabroteas sarsi* (Daday, 1901) es uno de los copépodos dulceacuícolas más grandes del mundo (hasta 7.5 mm en hembras adultas) y el depredador invertebrado tope de los lagos patagónicos y antárticos (39°S – 68°S).

Este modelo interactivo permite explorar los principales descubrimientos del paper:

1. **La Hipótesis del Filo de la Navaja (*Stoichiometric Knife-Edge*):**
   - El crecimiento somático del depredador ($g$) no aumenta indefinidamente con más fósforo, sino que sigue una **curva parabólica (en joroba)**.
   - **Exceso de fósforo (C:P < 108):** Inanición de carbono y alto costo metabólico de excreción $\to g < 0$ (pérdida de biomasa).
   - **Déficit de fósforo (C:P > 215):** Carencia de fósforo para ARN ribosomal y proteínas $\to g \le 0$.
   - **Ventana óptima:** C:P dietario centrado en **162.5 atómico** ($g_{\text{máx}} \approx +0.010\text{ d}^{-1}$).

2. **La Paradoja de las Presas (Geometría Nutricional):**
   - **Ninguna presa individual cae dentro de la ventana de crecimiento positivo [108, 215].**
   - Cladóceros (*Daphnia*, C:P 65–75): caen por debajo del óptimo.
   - Copépodos (*Boeckella*, C:P 228–240): caen por encima del óptimo.
   - El depredador está **obligado a combinar presas de perfiles elementales complementarios** para alcanzar un C:P viable.

3. **Impacto de la Siembra de Truchas (*Oncorhynchus mykiss*):**
   - **Depredación visual selectiva:** Remueve a todo zooplancton $\ge 1.5$ mm, extinguiendo localmente a *Daphnia* y a *P. sarsi* en lagunas someras.
   - **Inanición estequiométrica indirecta:** Al perder los cladóceros ricos en fósforo, la única presa disponible son pequeños copépodos de C:P > 230, impidiendo la maduración del depredador.
   - **Cascada trófica sobre el fitoplancton:** La proporción de fitoflagelados cae de ~98% a ~0% y las **cianobacterias se disparan a >98%**, degradando la calidad del agua.

---

## 💻 Módulos Interactivos de la Aplicación

- **🔪 1. Filo de la Navaja & Geometría Nutricional:** Ajuste en tiempo real de proporciones dietarias de las 8 presas patagónicas con cálculo instantáneo del C:P armónico, tasa $g$ y trayectoria demográfica $N(t) = N_0 \cdot e^{(g - m)t}$ a 30 días.
- **🐟 2. Cascada Trófica por Peces:** Simulación de siembra de salmónidos en lagos someros vs. lagos andinos profundos (con refugio hipolimnético a 30-40 m).
- **🔬 3. Ontogenia & Homeostasis C:P:** Evolución de la composición elemental corporal desde nauplios (homeostasis estricta) hasta adultos gigantes (homeostasis débil).
- **📖 4. Galería de Figuras Originales:** Visualizador en alta resolución de las 6 figuras del paper con análisis detallado.
- **📊 5. Matriz de Presas:** Tabla biométrica, taxonómica y estequiométrica completa.

---

## 🚀 Ejecución Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/ambystomatechnologies/presentacion-artropodos-AntonioSegura.git
   ```
2. Entra a la carpeta y haz doble clic en `start.bat` (o ejecuta `python -m http.server 8000`).
3. Se abrirá automáticamente tu navegador en `http://localhost:8000`.
