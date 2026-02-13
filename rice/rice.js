
/* ---------- DATA ---------- */
const districtData = [
  {district:"Lucknow", pH:6.9, moisture:72, nitrogen:198, phosphorus:20, potassium:174, temperature:29.5, humidity:78, rainfall:920},
  {district:"Agra", pH:6.3, moisture:65, nitrogen:190, phosphorus:18, potassium:180, temperature:30.8, humidity:70, rainfall:890},
  {district:"Gorakhpur", pH:6.6, moisture:78, nitrogen:220, phosphorus:26, potassium:165, temperature:28.5, humidity:84, rainfall:1150},
  {district:"Varanasi", pH:6.0, moisture:68, nitrogen:130, phosphorus:27, potassium:229, temperature:30.2, humidity:80, rainfall:960},
  {district:"Jhansi", pH:7.06, moisture:64, nitrogen:178, phosphorus:8.5, potassium:189, temperature:31.2, humidity:68, rainfall:885}
];

const soilTextureRatings = {"Clay Loam":5,"Silty Clay Loam":4.5,"Silty Loam":4,"Clay":3};

const diseaseData = [
  {"name":"Blast Disease","triggers":"N > 160, Humidity > 85%, Moisture > 80%","symptoms":"Gray diamond spots","prevention":"Reduce N, space planting, use resistant varieties"},
  {"name":"Bacterial Leaf Blight","triggers":"Humidity > 90%, Rainfall > 1200 mm","symptoms":"Leaf tip yellowing","prevention":"Clean seeds, reduce wounds, manage water"},
  {"name":"Sheath Blight","triggers":"N > 150, Moisture > 85%, Dense sowing","symptoms":"Rot on lower sheath","prevention":"Less N, better spacing, early fungicide"},
  {"name":"Brown Spot","triggers":"P < 40, K < 40, Rainfall < 900","symptoms":"Brown leaf spots with halo","prevention":"Balance P & K, irrigation, seed treatment"},
  {"name":"Tungro Virus","triggers":"High humidity, Late sowing","symptoms":"Orange-yellow leaves, stunting","prevention":"Early sowing, vector control"},
  {"name":"Stem Rot","triggers":"Continuous cropping, high organic matter","symptoms":"Hollow tillers, rot at base","prevention":"Crop rotation, drainage"},
  {"name":"False Smut","triggers":"High humidity + rain at flowering","symptoms":"Green smut balls","prevention":"Remove infected grains, fungicide"},
  {"name":"Leaf Scald","triggers":"Excess N, high humidity","symptoms":"Brown water-soaked lesions","prevention":"Split nitrogen doses"},
  {"name":"Narrow Brown Spot","triggers":"K < 40, Excess N, low light","symptoms":"Narrow brown lesions","prevention":"Potassium-rich fertilizer"}
];

const fertilizerData = [
  {
    nutrient:"Nitrogen (N)",
    conditions:[
      { range:"N < 100 kg/ha", issues:["Slow plant growth","Yellowing of older leaves","Low tillering","Short panicles"], diseases:["Stunted Growth","Reduced grain yield","Early leaf senescence"], fertilizer:{type:"Urea", recommended_kg_per_ha:"60–80", application_method:"50% during transplanting, 50% at tillering"} },
      { range:"100 ≤ N < 120 kg/ha", issues:["Light green leaves","Moderate growth delay"], diseases:["Low panicle number","Poor grain filling"], fertilizer:{type:"Urea", recommended_kg_per_ha:"40–60", application_method:"Split between early and mid-growth stages"} },
      { range:"N > 150 kg/ha", issues:["Excessive vegetative growth","Delayed maturity","Lodging of plants"], diseases:["Blast Disease","Sheath Blight","False Smut","Leaf Scald","Narrow Brown Spot"], fertilizer:{type:"Urea", recommended_kg_per_ha:"No Urea required", application_method:"Avoid further N use; split in future cycles"} }
    ]
  },
  {
    nutrient:"Phosphorus (P)",
    conditions:[
      { range:"P < 40 kg/ha", issues:["Dark green or purplish leaves","Delayed flowering and maturity","Weak root system"], diseases:["Brown Spot","Delayed panicle emergence","Tungro Virus risk increases"], fertilizer:{type:"DAP", recommended_kg_per_ha:"50–60", application_method:"Apply during land prep or basal stage"} },
      { range:"40 ≤ P ≤ 60 kg/ha", issues:["Mild growth limitations","Slight delay in flowering"], diseases:["Weak spikelet formation"], fertilizer:{type:"DAP", recommended_kg_per_ha:"30–40", application_method:"Apply once at land prep or early tillering"} },
      { range:"P > 60 kg/ha", issues:["Micronutrient lockout (Zinc, Iron)","Nutrient imbalance"], diseases:["No direct disease but reduced Zn/Fe absorption may lead to deficiency symptoms"], fertilizer:{type:"DAP", recommended_kg_per_ha:"No DAP required", application_method:"Monitor for Zn deficiency; avoid further P use"} }
    ]
  },
  {
    nutrient:"Potassium (K)",
    conditions:[
      { range:"K < 40 kg/ha", issues:["Leaf margin yellowing or scorching","Weak stems","Increased lodging","Poor water regulation"], diseases:["Brown Spot","Narrow Brown Spot","Increased bacterial blight susceptibility"], fertilizer:{type:"MOP", recommended_kg_per_ha:"40–50", application_method:"Split into basal + tillering stage"} },
      { range:"40 ≤ K ≤ 60 kg/ha", issues:["Slight lodging risk","Mild leaf edge discoloration"], diseases:["Weakened stress tolerance"], fertilizer:{type:"MOP", recommended_kg_per_ha:"20–30", application_method:"Apply once at early vegetative stage"} },
      { range:"K > 60 kg/ha", issues:["Reduced Mg and Zn uptake","Inhibited flowering under low light"], diseases:["Indirect effects due to nutrient imbalance"], fertilizer:{type:"MOP", recommended_kg_per_ha:"No MOP required", application_method:"Stop potash use; check for secondary deficiency"} }
    ]
  }
];

/* ---------- DOM ---------- */
const districtSelect = document.getElementById('district');
const soilPhInput = document.getElementById('soilPh');
const soilMoistureInput = document.getElementById('soilMoisture');
const soilTextureInput = document.getElementById('soilTexture');
const nitrogenInput = document.getElementById('nitrogen');
const phosphorusInput = document.getElementById('phosphorus');
const potassiumInput = document.getElementById('potassium');
const temperatureInput = document.getElementById('temperature');
const humidityInput = document.getElementById('humidity');
const rainfallInput = document.getElementById('rainfall');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const loaderArea = document.getElementById('loaderArea');
const finalResults = document.getElementById('finalResults');
const placeholderIntro = document.getElementById('placeholderIntro');
const warningBox = document.getElementById('warningBox');
const warningText = document.getElementById('warningText');

const growthScoreLabel = document.getElementById('growthScoreLabel');
const growthBar = document.getElementById('growthBar');
const expectedYieldLabel = document.getElementById('expectedYieldLabel');
const diseaseRiskLabel = document.getElementById('diseaseRiskLabel');
const soilScoreLabel = document.getElementById('soilScoreLabel');
const soilBar = document.getElementById('soilBar');
const weatherScoreLabel = document.getElementById('weatherScoreLabel');
const weatherBar = document.getElementById('weatherBar');
const matchSummaryLabel = document.getElementById('matchSummaryLabel');
const ureaRec = document.getElementById('ureaRec');
const dapRec = document.getElementById('dapRec');
const mopRec = document.getElementById('mopRec');
const viewDetailsBtn = document.getElementById('viewDetailsBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn');

const diseaseBtn = document.getElementById('diseaseBtn');
const diseaseModal = document.getElementById('diseaseModal');
const closeModal = document.getElementById('closeModal');
const diseaseTbody = document.getElementById('diseaseTbody');

const fertilizerModal = document.getElementById('fertilizerModal');
const fertilizerDetails = document.getElementById('fertilizerDetails');
const closeFertilizerModal = document.getElementById('closeFertilizerModal');

let compareChart=null, npkChart=null, fertAChart=null, fertBChart=null, fertCChart=null;

/* ---------- helpers ---------- */
function normalize(value, min, max, ideal){
  if (isNaN(value)) return 0;
  if (value <= min || value >= max) return 0;
  if (value === ideal) return 1;
  const distance = Math.abs(value - ideal);
  const maxDistance = Math.max(ideal - min, max - ideal);
  return 1 - Math.pow(distance / maxDistance, 2);
}
function getSoilTextureScore(texture){
  return soilTextureRatings[texture] || 0;
}
function getFertilizerCondition(nutrient, value){
  const nutrientData = fertilizerData.find(item => item.nutrient === nutrient);
  if (!nutrientData) return {range:'—', issues:[], diseases:[]};
  for (const condition of nutrientData.conditions){
    const range = condition.range;
    if (range.includes('<')){
      const threshold = parseFloat(range.split('<')[1]);
      if (value < threshold) return condition;
    } else if (range.includes('≤')){
      const nums = range.match(/[\d.]+/g);
      if (!nums) continue;
      if (nums.length === 2){
        const min = parseFloat(nums[0]), max = parseFloat(nums[1]);
        if (value >= min && value <= max) return condition;
      } else if (nums.length === 1){
        if (value >= parseFloat(nums[0])) return condition;
      }
    } else if (range.includes('>')){
      const threshold = parseFloat(range.split('>')[1]);
      if (value > threshold) return condition;
    }
  }
  return nutrientData.conditions[0];
}

/* ---------- fill district ---------- */
districtSelect.addEventListener('change', () => {
  const d = districtData.find(x => x.district === districtSelect.value);
  if (!d) return;
  soilPhInput.value = d.pH;
  soilMoistureInput.value = d.moisture;
  nitrogenInput.value = d.nitrogen;
  phosphorusInput.value = d.phosphorus;
  potassiumInput.value = d.potassium;
  temperatureInput.value = d.temperature;
  humidityInput.value = d.humidity;
  rainfallInput.value = d.rainfall;
  soilTextureInput.value = "";
});

/* ---------- disease table populate ---------- */
function populateDiseaseTable(){
  diseaseTbody.innerHTML = "";
  diseaseData.forEach(d => {
    const tr = document.createElement('tr');
    tr.className = 'disease-row';
    tr.innerHTML = `
      <td class="px-6 py-4 font-medium text-gray-900">${d.name}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${d.triggers}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${d.symptoms}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${d.prevention}</td>
    `;
    diseaseTbody.appendChild(tr);
  });
}
populateDiseaseTable();

/* ---------- validation ---------- */
function allFieldsFilled(){
  // require every field (as you requested)
  const fields = [
    districtSelect.value,
    soilTextureInput.value,
    soilPhInput.value,
    soilMoistureInput.value,
    nitrogenInput.value,
    phosphorusInput.value,
    potassiumInput.value,
    temperatureInput.value,
    humidityInput.value,
    rainfallInput.value
  ];
  return fields.every(v => v !== null && String(v).trim() !== "");
}

/* ---------- calculate flow ---------- */
calculateBtn.addEventListener('click', () => {
  // hide warning initially
  warningBox.classList.add('hidden');

  if (!allFieldsFilled()){
    // show warning, do not compute
    warningText.textContent = "⚠ Please fill ALL parameters (district, soil texture and all numeric fields) to get results.";
    warningBox.classList.remove('hidden');
    // ensure placeholder visible, hide other UI
    placeholderIntro.classList.remove('hidden');
    loaderArea.classList.add('hidden');
    finalResults.classList.add('hidden');
    return;
  }

  // hide placeholder & warning, show loader
  placeholderIntro.classList.add('hidden');
  warningBox.classList.add('hidden');
  finalResults.classList.add('hidden');
  loaderArea.classList.remove('hidden');

  setTimeout(() => {
    const analysis = performAnalysis();
    loaderArea.classList.add('hidden');
    renderResults(analysis);
  }, 1200); // simulated analyze delay
});

/* ---------- CORE analysis ---------- */
function performAnalysis(){
  const soilPh = parseFloat(soilPhInput.value) || 0;
  const soilMoisture = parseFloat(soilMoistureInput.value) || 0;
  const soilTexture = soilTextureInput.value;
  const nitrogen = parseFloat(nitrogenInput.value) || 0;
  const phosphorus = parseFloat(phosphorusInput.value) || 0;
  const potassium = parseFloat(potassiumInput.value) || 0;
  const temperature = parseFloat(temperatureInput.value) || 0;
  const humidity = parseFloat(humidityInput.value) || 0;
  const rainfall = parseFloat(rainfallInput.value) || 0;

  const growthScore = (
    normalize(soilPh,6.0,6.8,6.4)*0.05 +
    normalize(soilMoisture,70,80,75)*0.15 +
    (soilTexture? getSoilTextureScore(soilTexture.split(' ')[0])/5*0.10:0) +
    normalize(nitrogen,120,150,135)*0.23 +
    normalize(phosphorus,40,60,50)*0.10 +
    normalize(potassium,40,60,50)*0.10 +
    normalize(temperature,28,32,30)*0.15 +
    normalize(humidity,65,85,75)*0.10 +
    normalize(rainfall,1000,1200,1100)*0.12
  ) * 100;

  const soilScore = (
    normalize(soilPh,6.0,6.8,6.4)*0.05 +
    normalize(soilMoisture,70,80,75)*0.15 +
    (soilTexture? getSoilTextureScore(soilTexture.split(' ')[0])/5*0.20:0) +
    normalize(nitrogen,120,150,135)*0.23 +
    normalize(phosphorus,40,60,50)*0.10 +
    normalize(potassium,40,60,50)*0.10
  ) * 100;

  const weatherScore = (
    normalize(temperature,28,32,30)*0.15 +
    normalize(humidity,65,85,75)*0.10 +
    normalize(rainfall,1000,1200,1100)*0.12
  ) * 100;

  const expectedYield = Math.round(2200 + (growthScore / 100) * (3200 - 2200));

  // disease risk
  let diseaseRisk = "Low";
  if (humidity > 85 || nitrogen > 160) diseaseRisk = "Medium";
  if (humidity > 90 || nitrogen > 180 || soilPh < 5.5 || soilPh > 7.5) diseaseRisk = "High";

  // match summary
  let matchSummary = "";
  if (growthScore >= 85) matchSummary = "Excellent conditions for rice cultivation";
  else if (growthScore >= 70) matchSummary = "Good conditions for rice cultivation";
  else matchSummary = "Unsuitable or risky conditions";

  // fertilizer recs (text)
  let ureaRecommendation = "";
  if (nitrogen < 100) ureaRecommendation = "Add 60–80 kg/ha Urea (split basal + tillering)";
  else if (nitrogen < 120) ureaRecommendation = "Add 40–60 kg/ha Urea";
  else if (nitrogen > 150) ureaRecommendation = "No Urea needed";
  else ureaRecommendation = "Add 20–30 kg/ha Urea";

  let dapRecommendation = "";
  if (phosphorus < 40) dapRecommendation = "Add 50–60 kg/ha DAP";
  else if (phosphorus <= 60) dapRecommendation = "Add 30–40 kg/ha DAP";
  else dapRecommendation = "No DAP needed";

  let mopRecommendation = "";
  if (potassium < 40) mopRecommendation = "Add 40–50 kg/ha MOP";
  else if (potassium <= 60) mopRecommendation = "Add 20–30 kg/ha MOP";
  else mopRecommendation = "No MOP needed";

  return {
    growthScore: Math.round(growthScore),
    soilScore: Math.round(soilScore),
    weatherScore: Math.round(weatherScore),
    expectedYield,
    diseaseRisk,
    matchSummary,
    ureaRecommendation,
    dapRecommendation,
    mopRecommendation,
    // also return raw NPK for charts:
    N: Math.round(nitrogen),
    P: Math.round(phosphorus),
    K: Math.round(potassium)
  };
}

/* ---------- render UI & charts ---------- */
function renderResults(data){
  // labels & bars
  growthScoreLabel.textContent = `${data.growthScore}/100`;
  growthBar.style.width = `${data.growthScore}%`;

  expectedYieldLabel.textContent = `${data.expectedYield} kg/ha`;

  diseaseRiskLabel.textContent = data.diseaseRisk;
  diseaseRiskLabel.className = `text-2xl font-bold ${ data.diseaseRisk === 'Low' ? 'text-green-600' : (data.diseaseRisk === 'Medium' ? 'text-yellow-600':'text-red-600') }`;

  soilScoreLabel.textContent = `${data.soilScore}%`;
  soilBar.style.width = `${data.soilScore}%`;

  weatherScoreLabel.textContent = `${data.weatherScore}%`;
  weatherBar.style.width = `${data.weatherScore}%`;

  matchSummaryLabel.textContent = data.matchSummary;

  ureaRec.textContent = data.ureaRecommendation;
  dapRec.textContent = data.dapRecommendation;
  mopRec.textContent = data.mopRecommendation;

  // show results
  finalResults.classList.remove('hidden');
  setTimeout(()=> finalResults.classList.add('show'), 30);

  // Chart: Growth/Soil/Weather
  const ctx = document.getElementById('compareChart').getContext('2d');
  if (compareChart) compareChart.destroy();
  compareChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Growth','Soil','Weather'],
      datasets:[{
        label:'Score (%)',
        data:[data.growthScore, data.soilScore, data.weatherScore],
        backgroundColor:['#16a34a','#f59e0b','#0ea5e9'],
        borderRadius:6, barThickness:28
      }]
    },
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true, max:100}} }
  });

  // NPK Chart
  const ctxN = document.getElementById('npkChart').getContext('2d');
  if (npkChart) npkChart.destroy();
  npkChart = new Chart(ctxN, {
    type:'bar',
    data:{
      labels:['Nitrogen (N)','Phosphorus (P)','Potassium (K)'],
      datasets:[{ label:'kg/ha', data:[data.N,data.P,data.K], backgroundColor:['#15803d','#0ea5e9','#7c3aed'], borderRadius:6 }]
    },
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }
  });

  /* ---------- Fertilizer Chart A: recommended amounts (numeric) ----------
     We convert textual recs into single number for visualization:
  */
  const ureaKg = estimateKgFromRec(data.ureaRecommendation, 'urea');
  const dapKg = estimateKgFromRec(data.dapRecommendation, 'dap');
  const mopKg = estimateKgFromRec(data.mopRecommendation, 'mop');

  const ctxA = document.getElementById('fertAChart').getContext('2d');
  if (fertAChart) fertAChart.destroy();
  fertAChart = new Chart(ctxA, {
    type:'bar',
    data:{ labels:['Urea','DAP','MOP'], datasets:[{ label:'Recommended kg/ha', data:[ureaKg,dapKg,mopKg], backgroundColor:['#16a34a','#0ea5e9','#f59e0b'], borderRadius:6 }]},
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });

  /* ---------- Fertilizer Chart B: Nutrient Deficiency Score ----------
     Map N,P,K to a score:
     - if < ideal_min => 30
     - if within ideal => 80
     - if > ideal_high => 20
  */
  const scoreN = deficiencyScore(data.N, 120, 150);
  const scoreP = deficiencyScore(data.P, 40, 60);
  const scoreK = deficiencyScore(data.K, 40, 60);
  const ctxB = document.getElementById('fertBChart').getContext('2d');
  if (fertBChart) fertBChart.destroy();
  fertBChart = new Chart(ctxB, {
    type:'bar',
    data:{ labels:['N score','P score','K score'], datasets:[{ label:'Score (0-100)', data:[scoreN, scoreP, scoreK], backgroundColor:['#0ea5e9','#7c3aed','#16a34a'], borderRadius:6 }]},
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true, max:100}}}
  });

  /* ---------- Fertilizer Chart C: Impact on Growth (%) ----------
     We'll compute impact as (1 - normalized distance from ideal) * 100 for each fertilizer (proxy)
  */
  const impactUrea = Math.round(normalize(data.N, 120, 150, 135) * 100);
  const impactDAP = Math.round(normalize(data.P, 40, 60, 50) * 100);
  const impactMOP = Math.round(normalize(data.K, 40, 60, 50) * 100);
  const ctxC = document.getElementById('fertCChart').getContext('2d');
  if (fertCChart) fertCChart.destroy();
  fertCChart = new Chart(ctxC, {
    type:'bar',
    data:{ labels:['Urea impact','DAP impact','MOP impact'], datasets:[{ label:'Impact %', data:[impactUrea, impactDAP, impactMOP], backgroundColor:['#16a34a','#0ea5e9','#f59e0b'], borderRadius:6 }]},
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true, max:100}}}
  });

}

/* ---------- utility mapping functions ---------- */
function estimateKgFromRec(text, type){
  // returns a single representative number
  if (!text) return 0;
  text = String(text).toLowerCase();
  if (text.includes('no') || text.includes('no urea') || text.includes('no dap') || text.includes('no mop')) return 0;
  // find numbers like 60–80 or 40–60 or 20–30
  const m = text.match(/(\d+)(?:\D+)(\d+)/);
  if (m && m.length >= 3){
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    return Math.round((a+b)/2);
  }
  // single number fallback
  const m2 = text.match(/(\d+)/);
  if (m2) return parseFloat(m2[1]);
  // fallback default
  if (type==='urea') return 50;
  if (type==='dap') return 40;
  if (type==='mop') return 30;
  return 0;
}

function deficiencyScore(value, minIdeal, maxIdeal){
  if (value < minIdeal) return 30;
  if (value > maxIdeal) return 20;
  return 80;
}

/* ---------- event handlers ---------- */
downloadImageBtn.addEventListener('click', () => {
  // require fields filled for download? No — user wanted entire page download regardless,
  // but we still warn if empty before calculating. For download, just capture the page.
  downloadImageBtn.disabled = true;
  downloadImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Preparing...';
  setTimeout(()=> {
    html2canvas(document.body, { scale: 1.5, useCORS:true }).then(canvas => {
      const link = document.createElement('a');
      link.download = `cropguard_fullpage_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      downloadImageBtn.disabled = false;
      downloadImageBtn.innerHTML = '<i class="fas fa-download mr-2"></i>Download Report (Full Page)';
    }).catch(err => {
      alert('Export failed. Try again.');
      console.error(err);
      downloadImageBtn.disabled = false;
      downloadImageBtn.innerHTML = '<i class="fas fa-download mr-2"></i>Download Report (Full Page)';
    });
  }, 300);
});

/* ---------- modals ---------- */
diseaseBtn.addEventListener('click', ()=> diseaseModal.classList.remove('hidden'));
closeModal.addEventListener('click', ()=> diseaseModal.classList.add('hidden'));

viewDetailsBtn.addEventListener('click', () => {
  const n = parseFloat(nitrogenInput.value) || 0;
  const p = parseFloat(phosphorusInput.value) || 0;
  const k = parseFloat(potassiumInput.value) || 0;
  fertilizerDetails.innerHTML = generateFertilizerDetails(n,p,k);
  fertilizerModal.classList.remove('hidden');
});
closeFertilizerModal.addEventListener('click', ()=> fertilizerModal.classList.add('hidden'));

/* ---------- fertilizer details re-used ---------- */
function generateFertilizerDetails(nitrogen, phosphorus, potassium){
  const nCondition = getFertilizerCondition('Nitrogen (N)', nitrogen);
  const pCondition = getFertilizerCondition('Phosphorus (P)', phosphorus);
  const kCondition = getFertilizerCondition('Potassium (K)', potassium);

  let html = `<div class="space-y-4">`;

  html += `<div class="bg-blue-50 p-4 rounded"><h4 class="font-bold">Nitrogen (N)</h4><p>Current: ${nitrogen} kg/ha (${nCondition.range})</p><h5 class="mt-2 font-semibold">Potential Issues</h5><ul class="list-disc pl-5">`;
  (nCondition.issues||[]).forEach(i=> html += `<li>${i}</li>`);
  html += `</ul><h5 class="mt-2 font-semibold">Disease Risks</h5><ul class="list-disc pl-5">`;
  (nCondition.diseases||[]).forEach(d=> html += `<li>${d}</li>`);
  html += `</ul></div>`;

  html += `<div class="bg-purple-50 p-4 rounded"><h4 class="font-bold">Phosphorus (P)</h4><p>Current: ${phosphorus} kg/ha (${pCondition.range})</p><h5 class="mt-2 font-semibold">Potential Issues</h5><ul class="list-disc pl-5">`;
  (pCondition.issues||[]).forEach(i=> html += `<li>${i}</li>`);
  html += `</ul><h5 class="mt-2 font-semibold">Disease Risks</h5><ul class="list-disc pl-5">`;
  (pCondition.diseases||[]).forEach(d=> html += `<li>${d}</li>`);
  html += `</ul></div>`;

  html += `<div class="bg-green-50 p-4 rounded"><h4 class="font-bold">Potassium (K)</h4><p>Current: ${potassium} kg/ha (${kCondition.range})</p><h5 class="mt-2 font-semibold">Potential Issues</h5><ul class="list-disc pl-5">`;
  (kCondition.issues||[]).forEach(i=> html += `<li>${i}</li>`);
  html += `</ul><h5 class="mt-2 font-semibold">Disease Risks</h5><ul class="list-disc pl-5">`;
  (kCondition.diseases||[]).forEach(d=> html += `<li>${d}</li>`);
  html += `</ul></div>`;

  html += `</div>`;
  return html;
}

/* ---------- reset ---------- */
resetBtn.addEventListener('click', () => {
  document.getElementById('cropForm').reset();
  finalResults.classList.add('hidden'); finalResults.classList.remove('show');
  loaderArea.classList.add('hidden');
  placeholderIntro.classList.remove('hidden');
  warningBox.classList.add('hidden');
  // destroy charts if present
  if (compareChart) { compareChart.destroy(); compareChart = null; }
  if (npkChart) { npkChart.destroy(); npkChart = null; }
  if (fertAChart) { fertAChart.destroy(); fertAChart = null; }
  if (fertBChart) { fertBChart.destroy(); fertBChart = null; }
  if (fertCChart) { fertCChart.destroy(); fertCChart = null; }
});

/* ---------- populate disease table ---------- */
populateDiseaseTable();

