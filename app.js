/**
 * Parabroteas sarsi & Ecological Stoichiometry Dashboard
 * Based on Balseiro et al. (2022) - Ecología Austral 32:638-649
 */

// Global Chart Instances
let knifeEdgeChart = null;
let popDynamicChart = null;
let cascadeChart = null;
let ontogenyChart = null;

// Database of potential prey from Figure 4 & paper text
const PREY_SPECIES = [
  { id: 'd_comm', name: 'Daphnia commutata', type: 'cladocera', size: 2.5, cp: 65, defaultWeight: 13, desc: 'Cladócero grande, bajo C:P (rico en P), altamente vulnerable a peces' },
  { id: 'd_dada', name: 'Daphnia dadayana', type: 'cladocera', size: 2.0, cp: 75, defaultWeight: 4, desc: 'Cladócero intermedio, bajo C:P, vulnerable a peces' },
  { id: 'b_graci', name: 'Boeckella gracilis', type: 'copepod', size: 1.5, cp: 228, defaultWeight: 31, desc: 'Copépodo calanoideo intermedio, alto C:P (pobre en P)' },
  { id: 'b_gracilipes', name: 'Boeckella gracilipes', type: 'copepod', size: 0.9, cp: 230, defaultWeight: 37, desc: 'Copépodo pequeño, sobrevive con peces, alto C:P' },
  { id: 'b_mich', name: 'Boeckella michaelseni', type: 'copepod', size: 1.0, cp: 230, defaultWeight: 15, desc: 'Copépodo pequeño, presa común en lagos profundos' },
  { id: 'b_gibb', name: 'Boeckella gibbosa', type: 'copepod', size: 1.6, cp: 235, defaultWeight: 0, desc: 'Copépodo intermedio, moderadamente vulnerable' },
  { id: 'b_brevi', name: 'Boeckella brevicaudata', type: 'copepod', size: 1.8, cp: 236, defaultWeight: 0, desc: 'Copépodo de tamaño medio-grande' },
  { id: 'b_popp', name: 'Boeckella poppei', type: 'copepod', size: 2.7, cp: 240, defaultWeight: 0, desc: 'Copépodo gigante (lagos subantárticos y patagónicos)' }
];

// Ontogeny Data (Figure 2 & Figure 3)
const STAGES_DATA = {
  'nauplii': {
    name: 'Nauplios (NI - NVI)',
    sizeRange: '20 - 80 µm',
    diet: 'Microfagia estricta: fitoflagelados, picoplancton y nanoplancton.',
    cpMean: 86,
    cpSD: 16,
    homeostasis: 'Homeostasis Fuerte / Estricta',
    homeostasisDesc: 'Composición elemental corporal muy constante a pesar de la alta variabilidad del fitoplancton ingerido.',
    mouthparts: 'Aparato filtrador temprano, mandíbulas indiferenciadas con borde molar para partículas finas.'
  },
  'ci': {
    name: 'Copepodito I (CI)',
    sizeRange: '30 - 100 µm',
    diet: 'Microfagia: algas nanoplanctónicas y flagelados.',
    cpMean: 62,
    cpSD: 15,
    homeostasis: 'Homeostasis Fuerte',
    homeostasisDesc: 'Bajo ratio C:P corporal (muy rico en fósforo somático), inversión alta en mantener homeostasis.',
    mouthparts: 'Mandíbulas de superficie molar con pequeñas cerdas masticatorias.'
  },
  'cii': {
    name: 'Copepodito II (CII)',
    sizeRange: '50 - 250 µm',
    diet: 'Transición: algas y primeros rotíferos pequeños (Polyarthra, Keratella).',
    cpMean: 45,
    cpSD: 10,
    homeostasis: 'Homeostasis Máxima (Punto más bajo de C:P)',
    homeostasisDesc: 'Pico ontogenético de fósforo somático; tasa de síntesis de ARN ribosomal máxima.',
    mouthparts: 'Primeras cúspides en la mandíbula; maxilípedos comienzan a alargarse para captura activa.'
  },
  'ciii': {
    name: 'Copepodito III (CIII)',
    sizeRange: '100 - 500 µm',
    diet: 'Omnivoría: rotíferos (Conochilus hippocrepis), algas coloniales, nauplios.',
    cpMean: 95,
    cpSD: 24,
    homeostasis: 'Homeostasis Intermedia',
    homeostasisDesc: 'Comienza a debilitarse la regulación homeostática; mayor tolerancia a variación elemental.',
    mouthparts: 'Mandíbulas semidentadas, maxilípedos prensiles funcionales para retención de zooplancton pequeño.'
  },
  'civ': {
    name: 'Copepodito IV (CIV)',
    sizeRange: '400 - 1200 µm',
    diet: 'Macrofagia carnívora: pequeños cladóceros neonatos y copepoditos de Boeckella.',
    cpMean: 175,
    cpSD: 50,
    homeostasis: 'Homeostasis Débil (Sensible a la presa)',
    homeostasisDesc: 'La dispersión del C:P corporal aumenta notablemente; el organismo refleja más el alimento.',
    mouthparts: 'Maxilípedos alargados y robustos con espinas curvas prensiles para sujetar crustáceos.'
  },
  'cv': {
    name: 'Copepodito V (CV)',
    sizeRange: '800 - 1800 µm',
    diet: 'Macrofagia: adultos de Boeckella gracilipes/michaelseni, juveniles de Daphnia.',
    cpMean: 210,
    cpSD: 72,
    homeostasis: 'Homeostasis Débil',
    homeostasisDesc: 'Sensibilidad crítica a la calidad de la presa: requiere mezcla estequiométrica para crecer.',
    mouthparts: 'Mandíbulas afiladas con dientes agudos en lugar de superficie molar de molienda.'
  },
  'male': {
    name: 'Adulto Macho',
    sizeRange: '1200 - 2500 µm (Crustáceos grandes)',
    diet: 'Depredador tope de invertebrados: Boeckella spp. y Daphnia de tamaño intermedio. (Macho mide 4-5 mm).',
    cpMean: 317,
    cpSD: 75,
    homeostasis: 'Homeostasis Débil (Alta variabilidad somática)',
    homeostasisDesc: 'Alta relación C:P somática (menor requerimiento de P que las hembras reproductoras).',
    mouthparts: 'Anténula prensil modificada (geniculada) y maxilípedos altamente desarrollados.'
  },
  'female': {
    name: 'Adulto Hembra (Gigante)',
    sizeRange: '1500 - 3000 µm (Crustáceos hasta 3 mm)',
    diet: 'Depredador voraz: grandes Daphnia (D. dadayana, D. commutata) y Boeckella poppei. Hembras de hasta 7.5 mm.',
    cpMean: 350,
    cpSD: 110,
    homeostasis: 'Homeostasis Muy Débil (Extrema sensibilidad)',
    homeostasisDesc: 'Rango de C:P somático de 240 a 460. La producción secundaria y desove dependen de alcanzar el óptimo.',
    mouthparts: 'Poderosos maxilípedos raptoriales y mandíbulas en cúspides dentadas capaces de quebrar carapaces.'
  }
};

// Empirical Knife-edge model parameters (Figure 5 & Laspoumaderes et al. 2015)
const OPTIMUM_CP = 162.5;
const MAX_GROWTH = 0.0099; // d^-1
const CURVATURE_K = 1.725e-6; // Ecuación de regresión empírica exacta de Fig. 5 (Balseiro et al. 2022)
const BASELINE_MORTALITY = 0.002; // Mortalidad natural basal d^-1
const TROUT_PREDATION_MORTALITY = 0.012; // Mortalidad adicional por predación visual de truchas sobre P. sarsi (Fig. 1)
let popTimeHorizon = 365; // Horizonte de proyección por defecto en 1 año (365 días)
let activePreset = 'optimal'; // Preset ecológico activo

// Helper: Calculate growth rate g(CP) continuo sin cortes planos (forma exacta idéntica a Fig. 5)
function calculateGrowthRate(cp) {
  return MAX_GROWTH - CURVATURE_K * Math.pow(cp - OPTIMUM_CP, 2);
}

// Helper: Calculate composite diet C:P (Stoichiometric Harmonic/Mass balance)
function calculateDietCP(weights) {
  let totalWeight = 0;
  let weightedInvCP = 0;

  for (const prey of PREY_SPECIES) {
    const w = weights[prey.id] || 0;
    totalWeight += w;
    if (w > 0) {
      weightedInvCP += w / prey.cp;
    }
  }

  if (totalWeight === 0 || weightedInvCP === 0) return 0;
  return totalWeight / weightedInvCP;
}

// Initialization on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  initFullscreen();
  initOrientationLock();
  initPreySliders();
  initKnifeEdgeChart();
  initPopDynamicChart();
  initTimeHorizonControls();
  initFishCascade();
  initOntogenyModule();
  initFiguresModal();
  initPreyTable();
  updateSimulation();
});

// Setup Navigation Tabs
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetElement = document.getElementById(targetTab);
      if (targetElement) {
        targetElement.classList.add('active');
      }

      // Re-render chart sizes if needed
      setTimeout(() => {
        if (targetTab === 'tab-knife' && knifeEdgeChart) {
          knifeEdgeChart.resize();
          popDynamicChart.resize();
        } else if (targetTab === 'tab-cascade' && cascadeChart) {
          cascadeChart.resize();
        } else if (targetTab === 'tab-ontogeny' && ontogenyChart) {
          ontogenyChart.resize();
        }
      }, 50);
    });
  });
}

// Fullscreen Toggle (con soporte Escape)
let userManuallyExitedFullscreen = false;

function initFullscreen() {
  const btnFs = document.getElementById('btn-fullscreen');
  if (!btnFs) return;

  btnFs.addEventListener('click', async () => {
    const isFs = Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    if (!isFs) {
      userManuallyExitedFullscreen = false;
      await triggerFullscreen();
    } else {
      userManuallyExitedFullscreen = true;
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (e) {}

      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      } catch (err) {
        console.warn('Error al salir de pantalla completa:', err);
      }
    }
  });

  const updateFsUI = () => {
    const isFs = Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    if (isFs) {
      btnFs.innerHTML = '🗗 Salir Pantalla Completa <kbd>Esc</kbd>';
      btnFs.classList.add('active');
    } else {
      btnFs.innerHTML = '⛶ Pantalla Completa';
      btnFs.classList.remove('active');
    }

    setTimeout(() => {
      if (knifeEdgeChart) knifeEdgeChart.resize();
      if (popDynamicChart) popDynamicChart.resize();
      if (cascadeChart) cascadeChart.resize();
      if (ontogenyChart) ontogenyChart.resize();
    }, 120);
  };

  document.addEventListener('fullscreenchange', updateFsUI);
  document.addEventListener('webkitfullscreenchange', updateFsUI);
}

// Generate Sliders for Module 1 (Versión Académica con Categorías Taxonómicas)
function initPreySliders() {
  const container = document.getElementById('prey-sliders-container');
  if (!container) return;

  container.innerHTML = '';
  
  // Categorías taxonómicas
  let lastType = '';

  PREY_SPECIES.forEach(prey => {
    // Insertar encabezado taxonómico
    if (prey.type !== lastType) {
      const headerDiv = document.createElement('div');
      if (prey.type === 'cladocera') {
        headerDiv.className = 'taxonomy-header cladocera';
        headerDiv.innerHTML = '<span>Cladóceros (P-ricos)</span><span>Bajo C:P (&lt;80)</span>';
      } else {
        headerDiv.className = 'taxonomy-header copepoda';
        headerDiv.innerHTML = '<span>Copépodos (P-deficientes)</span><span>Alto C:P (&gt;220)</span>';
      }
      container.appendChild(headerDiv);
      lastType = prey.type;
    }

    const tagClass = prey.type === 'cladocera' ? 'tag-cladocera' : 'tag-copepod';
    const tagLabel = prey.type === 'cladocera' ? 'Cladócero' : 'Copépodo';
    const shortName = prey.name.replace('Daphnia ', 'D. ').replace('Boeckella ', 'B. ');

    const div = document.createElement('div');
    div.className = 'slider-item';
    div.innerHTML = `
      <div class="slider-header">
        <span class="slider-name" title="${prey.name}: ${prey.desc}">
          <em>${shortName}</em>
          <span class="slider-tag ${tagClass}">${prey.size.toFixed(1)} mm · C:P ${prey.cp}</span>
        </span>
        <span class="slider-val" id="val-${prey.id}">${prey.defaultWeight}%</span>
      </div>
      <input type="range" id="slider-${prey.id}" min="0" max="100" value="${prey.defaultWeight}" step="1" aria-label="${prey.name}">
    `;
    container.appendChild(div);

    const slider = div.querySelector('input');
    slider.addEventListener('input', (e) => {
      activePreset = '';
      document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
      document.getElementById(`val-${prey.id}`).innerText = `${e.target.value}%`;
      updateSimulation();
    });
  });

  // Botones de presets
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      applyPreset(preset);
    });
  });
}

function applyPreset(preset) {
  activePreset = preset;
  const weights = {};
  PREY_SPECIES.forEach(p => weights[p.id] = 0);

  if (preset === 'optimal') {
    // Mezcla estequiométrica balanceada en el ápice óptimo C:P = 162.5 (17% Cladóceros + 83% Copépodos)
    weights['d_comm'] = 13;
    weights['d_dada'] = 4;
    weights['b_graci'] = 31;
    weights['b_gracilipes'] = 37;
    weights['b_mich'] = 15;
  } else if (preset === 'pure_daphnia') {
    // Solo Daphnia: C:P ~ 65 (crecimiento negativo por exceso de P)
    weights['d_comm'] = 70;
    weights['d_dada'] = 30;
  } else if (preset === 'pure_boeckella') {
    // Solo Boeckella: C:P ~ 230 (crecimiento negativo/nulo por déficit de P)
    weights['b_gracilipes'] = 50;
    weights['b_graci'] = 30;
    weights['b_mich'] = 20;
  } else if (preset === 'stocked_fish') {
    // Presas > 1.5mm eliminadas por truchas: solo Boeckella pequeñas sobreviven
    weights['b_gracilipes'] = 60;
    weights['b_mich'] = 40;
  }

  // Actualizar valores en los sliders
  PREY_SPECIES.forEach(p => {
    const s = document.getElementById(`slider-${p.id}`);
    const v = document.getElementById(`val-${p.id}`);
    if (s && v) {
      s.value = weights[p.id] || 0;
      v.innerText = `${s.value}%`;
    }
  });

  updateSimulation();
}

function getCurrentWeights() {
  const weights = {};
  PREY_SPECIES.forEach(p => {
    const s = document.getElementById(`slider-${p.id}`);
    weights[p.id] = s ? parseFloat(s.value) : 0;
  });
  return weights;
}

// Module 1: Initialize Knife-Edge Chart
function initKnifeEdgeChart() {
  const ctx = document.getElementById('knifeEdgeCanvas');
  if (!ctx) return;

  const curvePoints = [];
  for (let cp = 40; cp <= 280; cp += 2) {
    curvePoints.push({ x: cp, y: calculateGrowthRate(cp) });
  }

  const expDaphnia = [
    { x: 51, y: -0.0115 }, { x: 57, y: -0.0080 }, { x: 57, y: -0.0051 }, { x: 66, y: -0.0049 }
  ];
  const expBGracilis = [
    { x: 125, y: 0.0105 }, { x: 129, y: 0.0047 }, { x: 156, y: 0.0088 }, { x: 191, y: 0.0085 }, { x: 222, y: 0.0037 }
  ];
  const expBGracilipes = [
    { x: 144, y: 0.0036 }, { x: 190, y: 0.0123 }, { x: 207, y: 0.0116 }, { x: 227, y: -0.0005 }, { x: 246, y: 0.0070 }, { x: 247, y: -0.0080 }, { x: 255, y: 0.0090 }
  ];

  knifeEdgeChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Modelo Empírico (Campana)',
          data: curvePoints,
          type: 'line',
          borderColor: '#38bdf8',
          borderWidth: 2.5,
          pointRadius: 0,
          fill: false,
          tension: 0.35
        },
        {
          label: 'D. commutata (Exp.)',
          data: expDaphnia,
          backgroundColor: '#f43f5e',
          borderColor: '#f43f5e',
          pointRadius: 5.5,
          pointStyle: 'triangle'
        },
        {
          label: 'B. gracilis (Exp.)',
          data: expBGracilis,
          backgroundColor: '#f59e0b',
          borderColor: '#f59e0b',
          pointRadius: 5.5,
          pointStyle: 'rect'
        },
        {
          label: 'B. gracilipes (Exp.)',
          data: expBGracilipes,
          backgroundColor: '#c084fc',
          borderColor: '#c084fc',
          pointRadius: 5.5,
          pointStyle: 'circle'
        },
        {
          label: 'Dieta Actual (P. sarsi)',
          data: [{ x: 162.5, y: 0.010 }],
          backgroundColor: '#10b981',
          borderColor: '#ffffff',
          borderWidth: 2,
          pointRadius: 10,
          pointHoverRadius: 13,
          pointStyle: 'star'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Relación atómica C:P de la presa / dieta', color: '#94a3b8', font: { size: 11 } },
          min: 40,
          max: 280,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        },
        y: {
          title: { display: true, text: 'Tasa de crecimiento somático g (d⁻¹)', color: '#94a3b8', font: { size: 11 } },
          min: -0.015,
          max: 0.015,
          grid: {
            color: (context) => (context.tick.value === 0 ? 'rgba(244, 63, 94, 0.45)' : 'rgba(255, 255, 255, 0.05)'),
            lineWidth: (context) => (context.tick.value === 0 ? 1.8 : 1)
          },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#e2e8f0', font: { size: 10 }, boxWidth: 12, padding: 8 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: C:P=${ctx.parsed.x.toFixed(1)}, g=${ctx.parsed.y.toFixed(4)} d⁻¹`
          }
        }
      }
    }
  });
}

// Module 1: Initialize Population Dynamic Chart
function initPopDynamicChart() {
  const ctx = document.getElementById('popDynamicCanvas');
  if (!ctx) return;

  const totalDays = 365;
  const step = 5;
  const dayPoints = [];
  for (let d = 0; d <= totalDays; d += step) {
    dayPoints.push(d);
  }
  if (dayPoints[dayPoints.length - 1] !== totalDays) {
    dayPoints.push(totalDays);
  }

  const baselineTraj = dayPoints.map(d => 100 * Math.exp((calculateGrowthRate(162.5) - BASELINE_MORTALITY) * d));

  popDynamicChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dayPoints.map(d => `Día ${d}`),
      datasets: [
        {
          label: 'N(t) Población Proyectada',
          data: baselineTraj,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          fill: true,
          borderWidth: 2.2,
          tension: 0.3,
          pointRadius: 2
        },
        {
          label: 'N₀ = 100 (Referencia Inicial)',
          data: dayPoints.map(() => 100),
          borderColor: 'rgba(148, 163, 184, 0.4)',
          borderDash: [5, 4],
          borderWidth: 1.4,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Tiempo transcurrido (días)', color: '#94a3b8', font: { size: 11 } },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 11 }
        },
        y: {
          title: { display: true, text: 'Densidad poblacional N(t) (ind / m³)', color: '#94a3b8', font: { size: 11 } },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { size: 10 } },
          beginAtZero: true,
          suggestedMin: 0
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#e2e8f0', font: { size: 10 }, boxWidth: 12, padding: 8 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} ind / m³`
          }
        }
      }
    }
  });
}

// Controls for Time Horizon (30 Días vs 1 Año)
function initTimeHorizonControls() {
  const btn30 = document.getElementById('btn-horizon-30');
  const btn365 = document.getElementById('btn-horizon-365');
  const titleEl = document.getElementById('pop-dynamic-title');

  const setHorizon = (days) => {
    popTimeHorizon = days;
    if (btn30 && btn365) {
      if (days === 30) {
        btn30.classList.add('active');
        btn365.classList.remove('active');
        if (titleEl) titleEl.innerHTML = 'Dinámica Poblacional de <em>P. sarsi</em> (30 Días)';
      } else {
        btn30.classList.remove('active');
        btn365.classList.add('active');
        if (titleEl) titleEl.innerHTML = 'Dinámica Poblacional de <em>P. sarsi</em> (1 Año)';
      }
    }
    updateSimulation();
  };

  if (btn30) btn30.addEventListener('click', () => setHorizon(30));
  if (btn365) btn365.addEventListener('click', () => setHorizon(365));
}

// Update simulation calculations
function updateSimulation() {
  const weights = getCurrentWeights();
  const dietCP = calculateDietCP(weights);
  const growthRate = calculateGrowthRate(dietCP);

  // Update KPI Cards
  const kpiCP = document.getElementById('kpi-diet-cp');
  const kpiGrowth = document.getElementById('kpi-growth-rate');
  const kpiStatus = document.getElementById('kpi-metabolic-status');
  const cardStatus = document.getElementById('card-status');

  if (kpiCP) kpiCP.innerText = dietCP > 0 ? dietCP.toFixed(1) : '--';
  if (kpiGrowth) {
    kpiGrowth.innerText = dietCP > 0 ? (growthRate >= 0 ? `+${growthRate.toFixed(4)}` : growthRate.toFixed(4)) : '--';
    kpiGrowth.style.color = growthRate >= 0 ? '#10b981' : '#f43f5e';
  }

  // Evaluate metabolic zone
  let statusText = 'Indeterminado';
  let statusClass = '';
  let descText = '';

  if (dietCP < 108) {
    statusText = 'Toxicidad P (g < 0)';
    statusClass = 'danger';
    descText = 'Filo izquierdo de la navaja: exceso de fósforo en relación al carbono (dieta saturada de Daphnia). Costo metabólico de excreción y pérdida somática.';
  } else if (dietCP >= 108 && dietCP <= 215) {
    if (Math.abs(dietCP - OPTIMUM_CP) <= 15) {
      statusText = 'Zona Óptima (g máx)';
      statusClass = 'optimum';
      descText = 'Crecimiento poblacional máximo (~0.010 d⁻¹). Dieta estequiométricamente balanceada.';
    } else {
      statusText = 'Crecimiento (+)';
      statusClass = 'optimum';
      descText = 'Ventana estequiométrica donde el depredador acumula biomasa y se reproduce.';
    }
  } else {
    statusText = 'Déficit P (Subóptimo)';
    statusClass = 'warning';
    descText = 'Filo derecho de la navaja: escasez de P para síntesis de ARN ribosomal y producción de huevos. Crecimiento somático bajo e insuficiente para reproducción sostenida.';
  }

  if (kpiStatus) kpiStatus.innerText = statusText;
  if (cardStatus) {
    cardStatus.className = `kpi-card-compact ${statusClass}`.trim();
    cardStatus.title = descText;
    const subDesc = document.getElementById('kpi-status-desc');
    if (subDesc) subDesc.innerText = descText;
  }

  // Update Knife-Edge Chart Current Point & Dynamic Axis Scaling
  if (knifeEdgeChart) {
    const baseMinX = 40;
    const baseMaxX = 280;
    const baseMinY = -0.015;
    const baseMaxY = 0.015;

    // Si algún slider sitúa un valor fuera de rango, la gráfica se ajusta dinámicamente con margen
    const targetMinX = (dietCP > 0 && dietCP < baseMinX) ? Math.floor(dietCP - 10) : baseMinX;
    const targetMaxX = dietCP > baseMaxX ? Math.ceil(dietCP + 10) : baseMaxX;
    const targetMinY = growthRate < baseMinY ? Math.floor((growthRate - 0.003) * 1000) / 1000 : baseMinY;
    const targetMaxY = growthRate > baseMaxY ? Math.ceil((growthRate + 0.003) * 1000) / 1000 : baseMaxY;

    // Regenerar curva para cubrir el rango visible de X si cambió
    if (knifeEdgeChart.options.scales.x.min !== targetMinX || knifeEdgeChart.options.scales.x.max !== targetMaxX) {
      const newCurve = [];
      for (let cp = targetMinX; cp <= targetMaxX; cp += 2) {
        newCurve.push({ x: cp, y: calculateGrowthRate(cp) });
      }
      knifeEdgeChart.data.datasets[0].data = newCurve;
    }

    knifeEdgeChart.options.scales.x.min = targetMinX;
    knifeEdgeChart.options.scales.x.max = targetMaxX;
    knifeEdgeChart.options.scales.y.min = targetMinY;
    knifeEdgeChart.options.scales.y.max = targetMaxY;

    knifeEdgeChart.data.datasets[4].data = [{ x: dietCP, y: growthRate }];
    knifeEdgeChart.update();
  }

  // Update Population Trajectory
  if (popDynamicChart) {
    const totalDays = popTimeHorizon === 365 ? 365 : 30;
    const step = popTimeHorizon === 365 ? 5 : 1;
    const dayPoints = [];
    for (let d = 0; d <= totalDays; d += step) {
      dayPoints.push(d);
    }
    if (dayPoints[dayPoints.length - 1] !== totalDays) {
      dayPoints.push(totalDays);
    }

    // Mortalidad: en presencia de truchas ('stocked_fish'), la predación visual por peces aniquila al copépodo gigante (Fig. 1)
    const fishMortality = (activePreset === 'stocked_fish') ? TROUT_PREDATION_MORTALITY : 0;
    const netRate = growthRate - (BASELINE_MORTALITY + fishMortality);
    const newTraj = dayPoints.map(d => Math.max(0, 100 * Math.exp(netRate * d)));
    const refBaseline = dayPoints.map(() => 100);

    popDynamicChart.data.labels = dayPoints.map(d => `Día ${d}`);
    popDynamicChart.data.datasets[0].data = newTraj;
    popDynamicChart.data.datasets[0].borderColor = netRate >= 0 ? '#10b981' : '#f43f5e';
    popDynamicChart.data.datasets[0].backgroundColor = netRate >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)';
    popDynamicChart.data.datasets[1].data = refBaseline;

    // A 30 días: se mantiene tal y como estaba originalmente (escala automática para notar pequeñas variaciones)
    // A 1 año: se fija el inicio en cero para apreciar la extinción local (llegada a cero) si netRate < 0
    if (popTimeHorizon === 365) {
      popDynamicChart.options.scales.y.beginAtZero = true;
      popDynamicChart.options.scales.y.suggestedMin = 0;
      if (netRate <= 0) {
        popDynamicChart.options.scales.y.suggestedMax = 100;
      } else {
        delete popDynamicChart.options.scales.y.suggestedMax;
      }
    } else {
      popDynamicChart.options.scales.y.beginAtZero = false;
      delete popDynamicChart.options.scales.y.suggestedMin;
      delete popDynamicChart.options.scales.y.suggestedMax;
    }

    popDynamicChart.update();
  }
}

// Module 2: Fish Introduction Cascade
function initFishCascade() {
  const fishSlider = document.getElementById('fish-pressure-slider');
  const fishVal = document.getElementById('fish-pressure-val');
  const lakeTypeSelect = document.getElementById('lake-type-select');
  const ctx = document.getElementById('cascadeChartCanvas');

  if (!fishSlider || !ctx) return;

  cascadeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Fitoplancton Flagelados %', 'Fitoplancton Cianobacterias %', 'Daphnia Biomasa %', 'P. sarsi Abundancia %'],
      datasets: [
        {
          label: 'Estado de la Red Trófica',
          data: [98, 2, 100, 100],
          backgroundColor: ['#2dd4bf', '#f59e0b', '#38bdf8', '#a855f7'],
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
          title: { display: true, text: 'Porcentaje / Densidad Relativa (%)', color: '#94a3b8' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          ticks: { color: '#e6f1ff' },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  function updateCascade() {
    const pressure = parseFloat(fishSlider.value);
    fishVal.innerText = `${pressure}%`;
    const lakeType = lakeTypeSelect.value; // 'shallow' or 'deep'

    // Calculate responses based on paper data (Figure 6 & text)
    // In fish stocked lakes: flagellates drop to almost 0, cyanobacteria >98%
    const flagellates = Math.max(1, 98 - (pressure / 100) * 96);
    const cyano = Math.min(99, 2 + (pressure / 100) * 97);

    // Daphnia is removed first (size > 1.5mm)
    const daphnia = Math.max(0, 100 - (pressure / 100) * 120);

    // P. sarsi: in shallow lake disappears completely (0). In deep lake, refuge at 30-40m keeps a remnant population
    let psarsi = 0;
    if (lakeType === 'shallow') {
      psarsi = Math.max(0, 100 - (pressure / 100) * 135);
    } else {
      // Deep lake with depth refuge: survives at dim layers (~25-35% of pristine abundance, colorless, smaller)
      psarsi = Math.max(28, 100 - (pressure / 100) * 72);
    }

    // Zooplankton size indicator
    const avgZooSize = (lakeType === 'shallow')
      ? Math.max(0.2, 1.4 - (pressure / 100) * 1.1)
      : Math.max(0.35, 1.4 - (pressure / 100) * 0.8);

    document.getElementById('cascade-flagellates').innerText = `${flagellates.toFixed(0)}%`;
    document.getElementById('cascade-cyano').innerText = `${cyano.toFixed(0)}%`;
    document.getElementById('cascade-daphnia').innerText = `${Math.max(0, daphnia).toFixed(0)}%`;
    document.getElementById('cascade-psarsi').innerText = `${Math.max(0, psarsi).toFixed(0)}%`;
    document.getElementById('cascade-zoo-size').innerText = `${avgZooSize.toFixed(2)} mm`;

    // Progress bar fills
    document.getElementById('bar-flagellates').style.width = `${flagellates}%`;
    document.getElementById('bar-cyano').style.width = `${cyano}%`;
    document.getElementById('bar-daphnia').style.width = `${Math.max(0, daphnia)}%`;
    document.getElementById('bar-psarsi').style.width = `${Math.max(0, psarsi)}%`;

    // Trophic cascade description text
    const narrativeEl = document.getElementById('cascade-narrative');
    if (narrativeEl) {
      if (pressure === 0) {
        narrativeEl.innerHTML = `<strong>Lago Prístino Sin Peces:</strong> Parabroteas sarsi reina como depredador tope de invertebrados. Coexisten copépodos y grandes cladóceros (<em>Daphnia</em>). El fitoplancton es dominado por fitoflagelados (>95%) con agua oligotrófica transparente y baja biomasa de cianobacterias.`;
      } else if (pressure < 40) {
        narrativeEl.innerHTML = `<strong>Baja Presión de Peces:</strong> Comienza la depredación visual selectiva sobre las presas mayores a 1.5 mm. La abundancia de <em>Daphnia</em> declina, forzando a <em>P. sarsi</em> a alimentarse con mayor proporción de <em>Boeckella</em> (aumento del C:P de la dieta).`;
      } else if (lakeType === 'shallow') {
        narrativeEl.innerHTML = `<strong>Impacto Severo en Lago Somero (Sin Refugio):</strong> Colapso total de <em>P. sarsi</em> y <em>Daphnia</em>. La red trófica sufre un desacoplamiento estequiométrico catastrófico: los copépodos remanentes son solo micro-especies (<1.5 mm). Se dispara la dominancia de cianobacterias (>98%), degradando la calidad ecológica del agua.`;
      } else {
        narrativeEl.innerHTML = `<strong>Lago Andino Profundo (Con Refugio Hipolimnético):</strong> A pesar de la presencia de truchas, <em>P. sarsi</em> logra persistir en las capas oscuras profundas (30-40 m). Los individuos son significativamente menores (3 mm vs 7 mm) y despigmentados (incoloros), alimentándose en la penumbra.`;
      }
    }

    // Update Bar Chart
    cascadeChart.data.datasets[0].data = [flagellates, cyano, Math.max(0, daphnia), Math.max(0, psarsi)];
    cascadeChart.update();
  }

  fishSlider.addEventListener('input', updateCascade);
  lakeTypeSelect.addEventListener('change', updateCascade);
  updateCascade();
}

// Module 3: Ontogeny & Stoichiometric Homeostasis
function initOntogenyModule() {
  const stageBtns = document.querySelectorAll('.stage-btn');
  const ctx = document.getElementById('ontogenyCanvas');

  // Chart: Ontogeny trajectory of body C:P with standard deviation (Figure 3)
  const stagesKeys = ['nauplii', 'ci', 'cii', 'ciii', 'civ', 'cv', 'male', 'female'];
  const labels = ['Nauplios', 'CI', 'CII', 'CIII', 'CIV', 'CV', 'Macho', 'Hembra'];
  const means = stagesKeys.map(k => STAGES_DATA[k].cpMean);
  const upperSD = stagesKeys.map(k => STAGES_DATA[k].cpMean + STAGES_DATA[k].cpSD);
  const lowerSD = stagesKeys.map(k => Math.max(10, STAGES_DATA[k].cpMean - STAGES_DATA[k].cpSD));

  if (ctx) {
    ontogenyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'C:P Somático Promedio',
            data: means,
            borderColor: '#38bdf8',
            backgroundColor: '#38bdf8',
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: 'Desviación Estándar (+1 SD)',
            data: upperSD,
            borderColor: 'rgba(56, 189, 248, 0.2)',
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Desviación Estándar (-1 SD)',
            data: lowerSD,
            borderColor: 'rgba(56, 189, 248, 0.2)',
            borderDash: [4, 4],
            pointRadius: 0,
            fill: '-1',
            backgroundColor: 'rgba(56, 189, 248, 0.1)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: { display: true, text: 'Relación C:P Corporal (atómico)', color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            ticks: { color: '#e6f1ff' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#e6f1ff' }
          }
        }
      }
    });
  }

  function displayStage(stageKey) {
    const data = STAGES_DATA[stageKey];
    if (!data) return;

    document.getElementById('stage-detail-name').innerText = data.name;
    document.getElementById('stage-size-spectrum').innerText = data.sizeRange;
    document.getElementById('stage-diet-desc').innerText = data.diet;
    document.getElementById('stage-cp-val').innerText = `${data.cpMean} (±${data.cpSD})`;
    document.getElementById('stage-homeostasis-title').innerText = data.homeostasis;
    document.getElementById('stage-homeostasis-desc').innerText = data.homeostasisDesc;
    document.getElementById('stage-mouthparts-desc').innerText = data.mouthparts;
  }

  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const stage = btn.getAttribute('data-stage');
      displayStage(stage);
    });
  });

  displayStage('cii');
}

// Module 4: Modal for Figure Zoom
function initFiguresModal() {
  const modal = document.getElementById('figureModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.modal-close');

  document.querySelectorAll('.figure-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      if (img && modalImg) {
        modalImg.src = img.currentSrc || img.src;
        modalImg.alt = img.alt || '';
        modal.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

// Module 5: Initialize Prey Species Table
function initPreyTable() {
  const tbody = document.getElementById('prey-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  PREY_SPECIES.forEach((p, idx) => {
    const tr = document.createElement('tr');
    const isVulnerable = p.size >= 1.5 ? '<span style="color: #f43f5e; font-weight:700">Eliminada (>1.5 mm)</span>' : '<span style="color: #10b981">Persiste (<1.5 mm)</span>';
    const tag = p.type === 'cladocera' ? '<span class="slider-tag tag-cladocera">Cladócero</span>' : '<span class="slider-tag tag-copepod">Copépodo</span>';

    tr.innerHTML = `
      <td><strong>${idx + 1}</strong></td>
      <td><em>${p.name}</em></td>
      <td>${tag}</td>
      <td>${p.size.toFixed(1)} mm</td>
      <td><strong>${p.cp}</strong></td>
      <td>${isVulnerable}</td>
      <td>${p.desc}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Window resize listener con debounce para soporte en móviles y orientación de pantalla
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (knifeEdgeChart) knifeEdgeChart.resize();
    if (popDynamicChart) popDynamicChart.resize();
    if (cascadeChart) cascadeChart.resize();
    if (ontogenyChart) ontogenyChart.resize();
  }, 100);
});

// --- DETECCIÓN DE DISPOSITIVO MÓVIL (IDÉNTICO A EJEMPLO) ---
function isMobileOrTabletDevice() {
  const uaCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const touchScreenCheck = (('ontouchstart' in window) || navigator.maxTouchPoints > 0) && (window.innerWidth <= 1024 || window.innerHeight <= 1024);
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  return Boolean(uaCheck || touchScreenCheck || coarsePointer || window.innerHeight <= 620 || window.innerWidth <= 950);
}

// --- PANTALLA COMPLETA AUTOMÁTICA Y BLOQUEO DE ORIENTACIÓN EN MÓVILES ---
async function triggerFullscreen() {
  const isFs = Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

  const el = document.documentElement;

  if (!isFs) {
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        await el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      }
    } catch (e) {
      console.warn('Error al solicitar pantalla completa:', e);
    }
  }

  // En Android / navegadores móviles, screen.orientation.lock requiere estar en pantalla completa primero
  if (screen.orientation && screen.orientation.lock) {
    try {
      await screen.orientation.lock('landscape');
    } catch (e1) {
      try {
        await screen.orientation.lock('landscape-primary');
      } catch (e2) {
        // En navegadores que no admiten lock o iOS Safari se gestiona por rotación del dispositivo
      }
    }
  }
}

function initOrientationLock() {
  const landscapeOverlay = document.getElementById('landscape-lock-overlay');
  const btnRequestLandscape = document.getElementById('btn-request-landscape');

  function checkOrientationLock() {
    if (!landscapeOverlay) return;
    const isMobile = isMobileOrTabletDevice();
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile && isPortrait) {
      userManuallyExitedFullscreen = false;
      window.scrollTo(0, 0);
      document.body.classList.add('portrait-locked');
      document.documentElement.classList.add('portrait-locked');
      landscapeOverlay.style.setProperty('display', 'flex', 'important');
    } else {
      document.body.classList.remove('portrait-locked');
      document.documentElement.classList.remove('portrait-locked');
      landscapeOverlay.style.setProperty('display', 'none', 'important');

      // Si es un dispositivo móvil y está en horizontal, entrar automáticamente en pantalla completa
      if (isMobile && !document.fullscreenElement && !document.webkitFullscreenElement && !userManuallyExitedFullscreen) {
        triggerFullscreen().catch(() => {});
      }

      setTimeout(() => {
        if (knifeEdgeChart) knifeEdgeChart.resize();
        if (popDynamicChart) popDynamicChart.resize();
        if (cascadeChart) cascadeChart.resize();
        if (ontogenyChart) ontogenyChart.resize();
      }, 150);
    }
  }

  // Botón "🔄 Habilitar Vista Horizontal": entrar en pantalla completa y apaisado inmediatamente
  if (btnRequestLandscape) {
    let isRequesting = false;
    const handleLandscapeRequest = async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (isRequesting) return;
      isRequesting = true;
      setTimeout(() => { isRequesting = false; }, 800);

      userManuallyExitedFullscreen = false;

      // Ocultar pantalla de bloqueo de inmediato para feedback instantáneo
      if (landscapeOverlay) {
        landscapeOverlay.style.setProperty('display', 'none', 'important');
      }
      document.body.classList.remove('portrait-locked');
      document.documentElement.classList.remove('portrait-locked');

      // Activar pantalla completa y orientación horizontal
      await triggerFullscreen();

      // Chequeos sucesivos para redibujado óptimo de gráficos
      checkOrientationLock();
      setTimeout(checkOrientationLock, 150);
      setTimeout(checkOrientationLock, 400);
      setTimeout(checkOrientationLock, 800);
    };

    btnRequestLandscape.addEventListener('click', handleLandscapeRequest);
    btnRequestLandscape.addEventListener('touchend', handleLandscapeRequest);
  }

  // Asegurar pantalla completa cuando el usuario gira el teléfono manualmente a horizontal y toca la pantalla
  const ensureFullscreenOnMobileLandscape = () => {
    if (isMobileOrTabletDevice() && !document.fullscreenElement && !document.webkitFullscreenElement && !userManuallyExitedFullscreen) {
      const isPortrait = window.innerHeight > window.innerWidth;
      if (!isPortrait) {
        triggerFullscreen().catch(() => {});
      }
    }
  };

  window.addEventListener('touchstart', ensureFullscreenOnMobileLandscape, { passive: true });
  window.addEventListener('pointerdown', ensureFullscreenOnMobileLandscape, { passive: true });
  window.addEventListener('click', ensureFullscreenOnMobileLandscape, { passive: true });

  window.addEventListener('resize', () => {
    checkOrientationLock();
  });

  window.addEventListener('orientationchange', () => {
    // Si giró a horizontal en móvil, disparar pantalla completa
    const isMobile = isMobileOrTabletDevice();
    if (isMobile && !userManuallyExitedFullscreen) {
      setTimeout(() => {
        if (window.innerWidth >= window.innerHeight) {
          triggerFullscreen().catch(() => {});
        }
      }, 50);
    }
    setTimeout(checkOrientationLock, 150);
  });

  document.addEventListener('fullscreenchange', () => {
    setTimeout(() => {
      checkOrientationLock();
      if (knifeEdgeChart) knifeEdgeChart.resize();
      if (popDynamicChart) popDynamicChart.resize();
      if (cascadeChart) cascadeChart.resize();
      if (ontogenyChart) ontogenyChart.resize();
    }, 150);
  });

  document.addEventListener('webkitfullscreenchange', () => {
    setTimeout(() => {
      checkOrientationLock();
      if (knifeEdgeChart) knifeEdgeChart.resize();
      if (popDynamicChart) popDynamicChart.resize();
      if (cascadeChart) cascadeChart.resize();
      if (ontogenyChart) ontogenyChart.resize();
    }, 150);
  });

  checkOrientationLock();
}


