

(function() {
  
  
  // DOM elements
  const districtEl = document.getElementById('district');
  const soilPh = document.getElementById('soilPh');
  const soilMoisture = document.getElementById('soilMoisture');
  const soilTexture = document.getElementById('soilTexture');
  const nitrogen = document.getElementById('nitrogen');
  const phosphorus = document.getElementById('phosphorus');
  const potassium = document.getElementById('potassium');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');
  const rainfall = document.getElementById('rainfall');
  const calcBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const loader = document.getElementById('loaderArea');
  const finalDiv = document.getElementById('finalResults');
  const placeholder = document.getElementById('placeholderIntro');
  const warnBox = document.getElementById('warningBox');
  const warnText = document.getElementById('warningText');
  
  const growthRawLabel = document.getElementById('growthRawLabel');
  const growthRawBar = document.getElementById('growthRawBar');
  const growthAdjustedLabel = document.getElementById('growthAdjustedLabel');
  const growthAdjustedBar = document.getElementById('growthAdjustedBar');
  const yieldLbl = document.getElementById('expectedYieldLabel');
  const diseaseLbl = document.getElementById('diseaseRiskLabel');
  const riskScoreLbl = document.getElementById('riskScoreLabel');
  const soilScoreLbl = document.getElementById('soilScoreLabel');
  const soilBar = document.getElementById('soilBar');
  const weatherScoreLbl = document.getElementById('weatherScoreLabel');
  const weatherBar = document.getElementById('weatherBar');
  
  const soilPercentLabel = document.getElementById('soilPercentLabel');
  const soilPercentBar = document.getElementById('soilPercentBar');
  const nutrientPercentLabel = document.getElementById('nutrientPercentLabel');
  const nutrientPercentBar = document.getElementById('nutrientPercentBar');
  const weatherPercentLabel = document.getElementById('weatherPercentLabel');
  const weatherPercentBar = document.getElementById('weatherPercentBar');
  
  const nStatusBadge = document.getElementById('nStatusBadge');
  const pStatusBadge = document.getElementById('pStatusBadge');
  const kStatusBadge = document.getElementById('kStatusBadge');
  const ureaDose = document.getElementById('ureaDose');
  const dapDose = document.getElementById('dapDose');
  const mopDose = document.getElementById('mopDose');
  const efficiencyFactor = document.getElementById('efficiencyFactor');
  const nitrogenMethodText = document.getElementById('nitrogenMethodText');
  const phosphorusMethodText = document.getElementById('phosphorusMethodText');
  const potassiumMethodText = document.getElementById('potassiumMethodText');
  const fertilizerWarnings = document.getElementById('fertilizerWarnings');
  
  const viewDetails = document.getElementById('viewDetailsBtn');
  const downloadBtn = document.getElementById('downloadImageBtn');
  const diseaseBtn = document.getElementById('diseaseBtn');
  const diseaseModal = document.getElementById('diseaseModal');
  const closeModal = document.getElementById('closeModal');
  const fertModal = document.getElementById('fertilizerModal');
  const closeFertModal = document.getElementById('closeFertilizerModal');
  const fertDetails = document.getElementById('fertilizerDetails');
  
  let charts = { compare: null, npk: null };


  const cropStageSelect = document.getElementById('cropStage');
  const analysisTab = document.getElementById('analysisTab');
  const profitTab = document.getElementById('profitTab');
  const analysisSection = document.getElementById('analysisSection');
  const profitSection = document.getElementById('profitSection');


  const listenBtn = document.getElementById('listenBtn');
  const btnText = listenBtn ? listenBtn.querySelector('.btn-text') : null;
  let lastResult = null;
  let isSpeaking = false;
  let currentUtterance = null;

  // profit display
  const grossIncomeVal = document.getElementById('grossIncomeVal');
  const netProfitVal = document.getElementById('netProfitVal');
  const roiVal = document.getElementById('roiVal');
  const breakevenVal = document.getElementById('breakevenVal');
  const yourGrowthComp = document.getElementById('yourGrowthComp');
  const bestGrowthComp = document.getElementById('bestGrowthComp');
  const yourYieldComp = document.getElementById('yourYieldComp');
  const bestYieldComp = document.getElementById('bestYieldComp');
  const yourProfitComp = document.getElementById('yourProfitComp');
  const bestProfitComp = document.getElementById('bestProfitComp');

  // District data
  const districtData = [
    { district: "Lucknow", pH: 6.9, moisture: 72, nitrogen: 198, phosphorus: 20, potassium: 174, temperature: 29.5, humidity: 78, rainfall: 920 },
    { district: "Agra", pH: 6.3, moisture: 65, nitrogen: 190, phosphorus: 18, potassium: 180, temperature: 30.8, humidity: 70, rainfall: 890 },
    { district: "Gorakhpur", pH: 6.6, moisture: 78, nitrogen: 220, phosphorus: 26, potassium: 165, temperature: 28.5, humidity: 84, rainfall: 1150 },
    { district: "Varanasi", pH: 6.0, moisture: 68, nitrogen: 130, phosphorus: 27, potassium: 229, temperature: 30.2, humidity: 80, rainfall: 960 },
    { district: "Jhansi", pH: 7.06, moisture: 64, nitrogen: 178, phosphorus: 8.5, potassium: 189, temperature: 31.2, humidity: 68, rainfall: 885 }
  ];

  const diseaseData = [ 
    { "name": "Blast Disease", "triggers": "Too much Nitrogen (>160), High humidity (>85%)", "symptoms": "Gray diamond spots", "prevention": "Reduce nitrogen, space plants" },
    { "name": "Bacterial Leaf Blight", "triggers": "Very high humidity (>90%), Heavy rain", "symptoms": "Leaf tips turn yellow", "prevention": "Use clean seeds, manage water" },
    { "name": "Sheath Blight", "triggers": "High Nitrogen (>150), Dense planting", "symptoms": "Rot on lower stem", "prevention": "Less nitrogen, more space" },
    { "name": "Brown Spot", "triggers": "Low Potassium (<40), Less rain", "symptoms": "Brown spots with yellow ring", "prevention": "Add potassium, irrigate" },
    { "name": "Lodging", "triggers": "High N + Low K, strong wind", "symptoms": "Plants fall over", "prevention": "Balance N and K, avoid excess N" }
  ];


  function calculateRiceFertilizer(N, P, K, soilScore) {
    const ideals = { N: { min:120, max:150, ideal:135, sigma:25, baseDose:80, maintDose:20 }, P: { min:40, max:60, ideal:50, sigma:12, baseDose:60, maintDose:20 }, K: { min:40, max:60, ideal:50, sigma:12, baseDose:50, maintDose:20 } };
    const conversion = { NtoUrea:2.17, PtoDAP:2.17, KtoMOP:1.67 };
    const SAFETY_CAPS = { Urea:200, DAP:120, MOP:100 };
    let warnings = [];
    let result = { nitrogenStatus:"", phosphorusStatus:"", potassiumStatus:"", ureaKgPerHa:0, dapKgPerHa:0, mopKgPerHa:0, applicationMethod:{ nitrogen:"", phosphorus:"", potassium:"" }, warnings:warnings };
    function calculateSuitability(value, ideal, sigma) { const diff = value - ideal; return Math.exp(-(diff * diff) / (2 * sigma * sigma)); }
    const fertilizerEfficiency = soilScore / 100;
    ['N','P','K'].forEach(nutrient => {
      const value = nutrient==='N'?N:(nutrient==='P'?P:K);
      const config = ideals[nutrient];
      const suitability = calculateSuitability(value, config.ideal, config.sigma);
      const deficiency = 1 - suitability;
      let status = value<config.min ? "Deficient" : (value>config.max ? "Excess" : "Optimal");
      if (nutrient==='N') result.nitrogenStatus = status;
      else if (nutrient==='P') result.phosphorusStatus = status;
      else if (nutrient==='K') result.potassiumStatus = status;
      let nutrientDose = 0;
      if (value < config.ideal) {
        nutrientDose = config.baseDose * Math.pow(deficiency,1.5);
        if (nutrient==='K' && value<35) { nutrientDose = nutrientDose*1.1; warnings.push("⚠️ Potassium is very low. Add 10% extra MOP to prevent lodging."); }
        nutrientDose = Math.round(nutrientDose);
      } else if (value <= config.max) { nutrientDose = config.maintDose; }
      else { nutrientDose = 0;
        if (nutrient==='N' && value>160) warnings.push("⚠️ Nitrogen too high. Do not add urea. High N increases blast disease.");
        else if (nutrient==='N') warnings.push("⚠️ Nitrogen high. Too much N can cause lodging.");
        else if (nutrient==='P') warnings.push("⚠️ Phosphorus high. Too much P can cause zinc deficiency.");
        else if (nutrient==='K') warnings.push("⚠️ Potassium high. Too much K can reduce magnesium uptake.");
      }
      nutrientDose = Math.round(nutrientDose * fertilizerEfficiency);
      if (nutrient==='N') {
        result.ureaKgPerHa = Math.round(nutrientDose * conversion.NtoUrea);
        if (result.ureaKgPerHa > SAFETY_CAPS.Urea) { result.ureaKgPerHa = SAFETY_CAPS.Urea; warnings.push("⚠️ Urea capped at 200 kg/ha to prevent lodging risk."); }
        if (status==="Deficient") result.applicationMethod.nitrogen = "Split into three: 50% basal, 25% tillering (20-25 days), 25% panicle initiation (50-55 days)";
        else if (status==="Optimal") result.applicationMethod.nitrogen = "Small maintenance dose at tillering stage";
        else result.applicationMethod.nitrogen = "Do not add nitrogen fertilizer";
      } else if (nutrient==='P') {
        result.dapKgPerHa = Math.round(nutrientDose * conversion.PtoDAP);
        if (result.dapKgPerHa > SAFETY_CAPS.DAP) { result.dapKgPerHa = SAFETY_CAPS.DAP; warnings.push("⚠️ DAP capped at 120 kg/ha."); }
        if (status==="Deficient") result.applicationMethod.phosphorus = "Apply all before planting. Mix well in soil.";
        else if (status==="Optimal") result.applicationMethod.phosphorus = "Small maintenance dose before planting";
        else result.applicationMethod.phosphorus = "Do not add phosphorus fertilizer";
      } else if (nutrient==='K') {
        result.mopKgPerHa = Math.round(nutrientDose * conversion.KtoMOP);
        if (result.mopKgPerHa > SAFETY_CAPS.MOP) { result.mopKgPerHa = SAFETY_CAPS.MOP; warnings.push("⚠️ MOP capped at 100 kg/ha."); }
        if (status==="Deficient") result.applicationMethod.potassium = "Split into two: 50% basal, 50% at panicle initiation";
        else if (status==="Optimal") result.applicationMethod.potassium = "Small maintenance dose before planting";
        else result.applicationMethod.potassium = "Do not add potassium fertilizer";
      }
    });
    return result;
  }

  function computeDiseaseRisk(humidity, nitrogen, soilMoisture, pH, potassium) {
    let risk = 0; let warnings = [];
    if (humidity > 85) risk += 30;
    if (nitrogen > 160) risk += 30;
    if (soilMoisture > 80) risk += 20;
    if (pH < 5.5 || pH > 7.5) risk += 20;
    if (nitrogen > 160 && potassium < 40) { risk += 10; warnings.push("⚠️ High Nitrogen + Low Potassium increases lodging risk."); }
    risk = Math.min(risk,100);
    let level = 'Low'; if (risk > 60) level = 'High'; else if (risk > 30) level = 'Medium';
    return { level, score: risk, warnings };
  }

  function calculateWeatherScore(temp, hum, rain) {
    const tNorm = softNormalize(temp,22,36,30);
    const hNorm = softNormalize(hum,55,95,75);
    const rNorm = softNormalize(rain,800,1500,1100);
    return (tNorm * 0.5 + hNorm * 0.3 + rNorm * 0.2) * 100;
  }

  function validateInputs(ph, moisture, N, P, K, temp, hum, rain) {
    const errors = [];
    if (N > 400) errors.push("Nitrogen value is too high (max 400 kg/ha)");
    if (P > 200) errors.push("Phosphorus value is too high (max 200 kg/ha)");
    if (K > 200) errors.push("Potassium value is too high (max 200 kg/ha)");
    if (ph < 4 || ph > 9) errors.push("Soil pH must be between 4 and 9");
    if (moisture > 100) errors.push("Soil moisture cannot exceed 100%");
    if (temp > 45) errors.push("Temperature too high (max 45°C)");
    if (hum > 100) errors.push("Humidity cannot exceed 100%");
    return errors;
  }

  function applyHeatStress(growth, temperature) {
    let adjustedGrowth = growth;
    if (temperature > 38) adjustedGrowth = growth * 0.75;
    else if (temperature > 35) adjustedGrowth = growth * 0.85;
    return adjustedGrowth;
  }

  function calculateSensitivity(soilScore, nutrientScore, weatherScore) {
    const total = (soilScore * 0.4) + (nutrientScore * 0.35) + (weatherScore * 0.25);
    if (total === 0) return { soil:33, nutrient:33, weather:34 };
    return { soil: Math.round((soilScore * 0.4 / total) * 100), nutrient: Math.round((nutrientScore * 0.35 / total) * 100), weather: Math.round((weatherScore * 0.25 / total) * 100) };
  }

  function softNormalize(value, min, max, ideal) {
    if (isNaN(value) || value === null) return 0;
    const sigma = (max - min) / 4;
    const diff = value - ideal;
    return Math.exp(-(diff * diff) / (2 * sigma * sigma));
  }

  function getTextureScore(texture) { const soilTextureRatings = { "Clay Loam":5, "Silty Clay Loam":4.5, "Silty Loam":4, "Clay":3 }; return soilTextureRatings[texture] || 0; }

  function calculateSoilScore(ph, moisture, texture) {
    const phNorm = softNormalize(ph,5.5,7.5,6.4);
    const moistNorm = softNormalize(moisture,60,90,75);
    const texScore = getTextureScore(texture) / 5;
    return (phNorm * 0.4 + moistNorm * 0.4 + texScore * 0.2) * 100;
  }

  function calculateNutrientScore(N, P, K) {
    const nNorm = softNormalize(N,80,200,135);
    const pNorm = softNormalize(P,20,90,50);
    const kNorm = softNormalize(K,20,90,50);
    return (nNorm * 0.5 + pNorm * 0.25 + kNorm * 0.25) * 100;
  }

  function sigmoidGrowth(soilSc, nutrSc, weatherSc) {
    let raw = soilSc * 0.4 + nutrSc * 0.35 + weatherSc * 0.25;
    const k = 0.08, midpoint = 50;
    return 100 / (1 + Math.exp(-k * (raw - midpoint)));
  }

  function logisticYield(growth) {
    const yMin = 2200, yMax = 3400;
    return yMin + (yMax - yMin) / (1 + Math.exp(-0.1 * (growth - 60)));
  }

  // ========== STAGE PENALTY (direct penalty, no weight multiplication) ==========
  function applyStagePenalty(growth, stage, N, K, temp, moisture) {
    let penalty = 0;
    if (stage === 'nursery' && moisture > 85) penalty = 0.05;
    if (stage === 'tillering') { 
      if (N < 110) penalty = 0.15; 
      else if (N > 170) penalty = 0.10; 
    }
    if (stage === 'panicle' && K < 35) penalty = 0.12;
    if (stage === 'flowering') { 
      if (temp > 35) penalty = 0.20; 
      if (temp > 38) penalty = 0.30; 
    }
    if (stage === 'grain' && temp > 36) penalty = 0.15;

    let adjusted = growth * (1 - penalty);
    return Math.min(100, Math.max(0, adjusted));
  }

  // ========== Profit calculation ==========
  function calculateProfit(yieldKg) {
    const MSP = 2183;       // ₹ per quintal
    const COST = 45000;     // ₹ per hectare
    const quintal = yieldKg / 100;
    const grossIncome = quintal * MSP;
    const netProfit = grossIncome - COST;
    const ROI = (netProfit / COST) * 100;
    const breakEvenYield = (COST / MSP) * 100;
    return { grossIncome, netProfit, ROI, breakEvenYield };
  }

  // ========== Best possible calculation ==========
  function calculateBestPossible(selectedStage) {
    const ideal = { ph:6.4, moisture:75, texture:'Clay Loam', N:135, P:50, K:50, temp:29, hum:75, rain:1100 };
    const soilSc = calculateSoilScore(ideal.ph, ideal.moisture, ideal.texture);
    const nutrSc = calculateNutrientScore(ideal.N, ideal.P, ideal.K);
    const weatherSc = calculateWeatherScore(ideal.temp, ideal.hum, ideal.rain);
    const growthRaw = sigmoidGrowth(soilSc, nutrSc, weatherSc);
    const disease = computeDiseaseRisk(ideal.hum, ideal.N, ideal.moisture, ideal.ph, ideal.K);
    let growthAdj = growthRaw * (1 - disease.score / 200);
    growthAdj = applyHeatStress(growthAdj, ideal.temp);
    growthAdj = applyStagePenalty(growthAdj, selectedStage, ideal.N, ideal.K, ideal.temp, ideal.moisture);
    growthAdj = Math.min(100, Math.max(0, growthAdj));
    let yieldVal = logisticYield(growthAdj);
    yieldVal = Math.min(3400, yieldVal);
    const profit = calculateProfit(yieldVal);
    return { growth: Math.round(growthAdj), yield: Math.round(yieldVal), profit };
  }

  // ========== performAnalysis ==========
  function performAnalysis() {
    const ph = parseFloat(soilPh.value) || 0;
    const moist = parseFloat(soilMoisture.value) || 0;
    const texture = soilTexture.value;
    const N = parseFloat(nitrogen.value) || 0;
    const P = parseFloat(phosphorus.value) || 0;
    const K = parseFloat(potassium.value) || 0;
    const temp = parseFloat(temperature.value) || 0;
    const hum = parseFloat(humidity.value) || 0;
    const rain = parseFloat(rainfall.value) || 0;
    const stage = cropStageSelect.value;

    const validationErrors = validateInputs(ph, moist, N, P, K, temp, hum, rain);
    if (validationErrors.length > 0) return { error: true, messages: validationErrors };

    const soilSc = calculateSoilScore(ph, moist, texture);
    const nutrSc = calculateNutrientScore(N, P, K);
    const weatherSc = calculateWeatherScore(temp, hum, rain);
    const growthRaw = sigmoidGrowth(soilSc, nutrSc, weatherSc);
    const disease = computeDiseaseRisk(hum, N, moist, ph, K);
    let growthAdjusted = growthRaw * (1 - disease.score / 200);
    growthAdjusted = applyHeatStress(growthAdjusted, temp);
    growthAdjusted = applyStagePenalty(growthAdjusted, stage, N, K, temp, moist);
    growthAdjusted = Math.min(100, Math.max(0, growthAdjusted));
    const yieldVal = logisticYield(growthAdjusted);
    const yieldRounded = Math.round(yieldVal);
    const sensitivity = calculateSensitivity(soilSc, nutrSc, weatherSc);
    const fertRec = calculateRiceFertilizer(N, P, K, soilSc);
    const allWarnings = [...fertRec.warnings, ...disease.warnings];
    let summary = growthAdjusted >=75 ? 'Excellent' : growthAdjusted>=55 ? 'Good' : 'Difficult';

    return {
      error: false,
      growthRaw: Math.round(growthRaw),
      growthAdjusted: Math.round(growthAdjusted),
      yield: yieldRounded,
      soilScore: Math.round(soilSc),
      weatherScore: Math.round(weatherSc),
      diseaseLevel: disease.level,
      diseaseScore: disease.score,
      sensitivity: sensitivity,
      fertilizer: fertRec,
      warnings: allWarnings,
      summary: summary,
      N, P, K
    };
  }

  // ========== ENHANCED VOICE REPORT FUNCTION with try-catch ==========
  function stopSpeaking() {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (listenBtn) {
        listenBtn.classList.remove('speaking');
        const icon = listenBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-microphone';
        if (btnText) btnText.textContent = '🔊 Listen Report';
      }
      isSpeaking = false;
      currentUtterance = null;
    } catch (error) {
      console.error("Voice stop error:", error);
    }
  }

  function speakReport(data) {
    try {
      // Cancel any ongoing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      // Get current values
      const district = districtEl.value || 'कोई जिला नहीं';
      const stage = cropStageSelect.options[cropStageSelect.selectedIndex]?.text.split(' ')[0] || 'चयनित';
      const profit = calculateProfit(data.yield);
      
      // Translate disease level
      let diseaseLevelHindi = 'कम';
      if (data.diseaseLevel === 'Medium') diseaseLevelHindi = 'मध्यम';
      else if (data.diseaseLevel === 'High') diseaseLevelHindi = 'उच्च';

      // Build message with all required sections
      const message = `नमस्ते किसान भाई।

आपने जिला ${district} चुना है।

आपकी फसल की स्टेज ${stage} है।

आपने जो पैरामीटर्स दिए हैं —
जैसे सॉइल पीएच, मॉइश्चर, नाइट्रोजन, फॉस्फोरस, पोटैशियम,
टेम्प्रेचर, ह्यूमिडिटी और रेनफॉल —
उसी के आधार पर यह रिपोर्ट तैयार की गई है।

आपका ग्रोथ स्कोर ${data.growthAdjusted} प्रतिशत है।

आपकी अपेक्षित यील्ड लगभग ${data.yield} किलोग्राम प्रति हेक्टेयर हो सकती है।

डिजीज रिस्क लेवल ${diseaseLevelHindi} है।

सॉइल सूटेबिलिटी ${data.soilScore} प्रतिशत है।
वेदर सूटेबिलिटी ${data.weatherScore} प्रतिशत है।

आपका एस्टीमेटेड नेट प्रॉफिट लगभग ${Math.abs(Math.round(profit.netProfit))} रुपये ${profit.netProfit < 0 ? 'का नुकसान' : 'का फायदा'} प्रति हेक्टेयर हो सकता है।

अब फर्टिलाइजर सलाह:

${data.fertilizer.ureaKgPerHa > 0 ? 
  `आपको लगभग ${data.fertilizer.ureaKgPerHa} किलोग्राम यूरिया डालना चाहिए।` : 
  `यूरिया आपको नहीं डालना है।`}

${data.fertilizer.dapKgPerHa > 0 ? 
  `${data.fertilizer.dapKgPerHa} किलोग्राम डीएपी डालना चाहिए।` : 
  `डीएपी आपको नहीं डालना है।`}

${data.fertilizer.mopKgPerHa > 0 ? 
  `${data.fertilizer.mopKgPerHa} किलोग्राम एमओपी डालना चाहिए।` : 
  `एमओपी आपको नहीं डालना है।`}

यह पूरी रिपोर्ट सिर्फ आपके दिए गए इनपुट के आधार पर जनरेट हुई है।

धन्यवाद।`;

      // Create and configure utterance
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Store current utterance
      currentUtterance = utterance;

      // Handle end of speech
      utterance.onend = function() {
        stopSpeaking();
      };

      utterance.onerror = function() {
        stopSpeaking();
      };

      // Update button state
      if (listenBtn) {
        listenBtn.classList.add('speaking');
        const icon = listenBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-stop';
        if (btnText) btnText.textContent = '⏹ Stop Listening';
      }
      isSpeaking = true;

      // Speak
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error("Voice system error:", error);
      stopSpeaking();
      alert('वॉइस सिस्टम में समस्या हुई | Voice system encountered an issue');
    }
  }

  // ========== Currency formatter ==========
  function formatCurrency(value) {
    return '₹ ' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  // ========== renderResults ==========
  function renderResults(d) {
    if (d.error) {
      warnText.textContent = d.messages.join('. ');
      warnBox.classList.remove('hidden');
      finalDiv.classList.add('hidden');
      return;
    }
    
    // existing analysis render
    if (growthRawLabel) growthRawLabel.textContent = d.growthRaw + '/100';
    if (growthRawBar) growthRawBar.style.width = d.growthRaw + '%';
    if (growthAdjustedLabel) growthAdjustedLabel.textContent = d.growthAdjusted + '/100';
    if (growthAdjustedBar) growthAdjustedBar.style.width = d.growthAdjusted + '%';
    if (yieldLbl) yieldLbl.textContent = d.yield + ' kg/ha';
    if (diseaseLbl) { diseaseLbl.textContent = d.diseaseLevel; diseaseLbl.className = `text-2xl font-bold ${d.diseaseLevel==='Low'?'text-green-600': d.diseaseLevel==='Medium'?'text-yellow-600':'text-red-600'}`; }
    if (riskScoreLbl) riskScoreLbl.textContent = `risk score ${d.diseaseScore}%`;
    if (soilScoreLbl) soilScoreLbl.textContent = d.soilScore + '%';
    if (soilBar) soilBar.style.width = d.soilScore + '%';
    if (weatherScoreLbl) weatherScoreLbl.textContent = d.weatherScore + '%';
    if (weatherBar) weatherBar.style.width = d.weatherScore + '%';
    if (soilPercentLabel) soilPercentLabel.textContent = d.sensitivity.soil + '%';
    if (soilPercentBar) soilPercentBar.style.width = d.sensitivity.soil + '%';
    if (nutrientPercentLabel) nutrientPercentLabel.textContent = d.sensitivity.nutrient + '%';
    if (nutrientPercentBar) nutrientPercentBar.style.width = d.sensitivity.nutrient + '%';
    if (weatherPercentLabel) weatherPercentLabel.textContent = d.sensitivity.weather + '%';
    if (weatherPercentBar) weatherPercentBar.style.width = d.sensitivity.weather + '%';
    
    const f = d.fertilizer;
    if (nStatusBadge) { nStatusBadge.textContent = f.nitrogenStatus; nStatusBadge.className = `status-badge status-${f.nitrogenStatus.toLowerCase()}`; }
    if (pStatusBadge) { pStatusBadge.textContent = f.phosphorusStatus; pStatusBadge.className = `status-badge status-${f.phosphorusStatus.toLowerCase()}`; }
    if (kStatusBadge) { kStatusBadge.textContent = f.potassiumStatus; kStatusBadge.className = `status-badge status-${f.potassiumStatus.toLowerCase()}`; }
    if (ureaDose) ureaDose.textContent = f.ureaKgPerHa;
    if (dapDose) dapDose.textContent = f.dapKgPerHa;
    if (mopDose) mopDose.textContent = f.mopKgPerHa;
    if (efficiencyFactor) efficiencyFactor.textContent = Math.round((d.soilScore / 100) * 100) + '%';
    if (nitrogenMethodText) nitrogenMethodText.textContent = f.applicationMethod.nitrogen;
    if (phosphorusMethodText) phosphorusMethodText.textContent = f.applicationMethod.phosphorus;
    if (potassiumMethodText) potassiumMethodText.textContent = f.applicationMethod.potassium;
    if (fertilizerWarnings) {
      fertilizerWarnings.innerHTML = '';
      d.warnings.forEach(w => { const warnEl = document.createElement('div'); warnEl.className = 'text-xs p-2 bg-yellow-50 text-yellow-800 rounded border border-yellow-200'; warnEl.innerHTML = `<i class="fas fa-exclamation-triangle mr-1"></i>${w}`; fertilizerWarnings.appendChild(warnEl); });
    }

    // Charts
    const compareCanvas = document.getElementById('compareChart');
    if (compareCanvas) {
      const ctxComp = compareCanvas.getContext('2d');
      if (charts.compare) charts.compare.destroy();
      charts.compare = new Chart(ctxComp, { type:'bar', data:{ labels:['Raw Growth','Adjusted Growth','Soil','Weather'], datasets:[{ label:'score', data:[d.growthRaw, d.growthAdjusted, d.soilScore, d.weatherScore], backgroundColor:['#84cc16','#16a34a','#f59e0b','#0ea5e9'] }] }, options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{max:100,beginAtZero:true}} } });
    }
    const npkCanvas = document.getElementById('npkChart');
    if (npkCanvas) {
      const ctxNpk = npkCanvas.getContext('2d');
      if (charts.npk) charts.npk.destroy();
      charts.npk = new Chart(ctxNpk, { type:'bar', data:{ labels:['N','P','K'], datasets:[{ label:'kg per hectare', data:[d.N, d.P, d.K], backgroundColor:['#15803d','#0ea5e9','#7c3aed'] }] }, options:{ plugins:{legend:{display:false}} } });
    }

    finalDiv.classList.remove('hidden');

    // Profit section update
    const profit = calculateProfit(d.yield);
    if (grossIncomeVal) grossIncomeVal.innerText = formatCurrency(profit.grossIncome);
    if (netProfitVal) {
      netProfitVal.innerText = formatCurrency(profit.netProfit);
      netProfitVal.className = profit.netProfit < 0 ? 'font-bold text-red-600' : 'font-bold text-green-700';
    }
    if (roiVal) {
      roiVal.innerText = profit.ROI.toFixed(1) + '%';
      roiVal.className = profit.ROI < 0 ? 'font-bold text-red-600' : 'font-bold text-green-700';
    }
    if (breakevenVal) breakevenVal.innerText = profit.breakEvenYield.toFixed(1) + ' kg/ha';

    // Best possible
    const best = calculateBestPossible(cropStageSelect.value);
    if (yourGrowthComp) yourGrowthComp.innerText = d.growthAdjusted + '%';
    if (bestGrowthComp) bestGrowthComp.innerText = best.growth + '%';
    if (yourYieldComp) yourYieldComp.innerText = d.yield + ' kg/ha';
    if (bestYieldComp) bestYieldComp.innerText = best.yield + ' kg/ha';
    if (yourProfitComp) {
      yourProfitComp.innerText = formatCurrency(profit.netProfit) + '/ha';
      yourProfitComp.className = profit.netProfit < 0 ? 'text-xl font-bold text-red-600' : 'text-xl font-bold text-emerald-700';
    }
    if (bestProfitComp) {
      bestProfitComp.innerText = formatCurrency(best.profit.netProfit) + '/ha';
    }
  }

  // ========== EVENT HANDLERS ==========
  function allFilled() { return [districtEl.value, soilTexture.value, soilPh.value, soilMoisture.value, nitrogen.value, phosphorus.value, potassium.value, temperature.value, humidity.value, rainfall.value].every(v => v && v.toString().trim()!==''); }

  let calculationDone = false;

  calcBtn.addEventListener('click', () => {
    // Stop any ongoing speech
    if (isSpeaking) {
      stopSpeaking();
    }
    
    warnBox.classList.add('hidden');
    if (!allFilled()) {
      warnText.textContent = '⚠ Please fill all fields (district, soil type and all numbers)';
      warnBox.classList.remove('hidden');
      placeholder.classList.remove('hidden');
      loader.classList.add('hidden');
      finalDiv.classList.add('hidden');
      return;
    }
    placeholder.classList.add('hidden');
    finalDiv.classList.add('hidden');
    loader.classList.remove('hidden');
    setTimeout(() => {
      const res = performAnalysis();
      loader.classList.add('hidden');
      renderResults(res);
      
      // Store result and enable voice button
      lastResult = res;
      if (listenBtn) {
        listenBtn.disabled = false;
      }
      
      calculationDone = true;
      profitTab.disabled = false;
      profitTab.classList.remove('opacity-50', 'cursor-not-allowed');
    }, 800);
  });

  districtEl.addEventListener('change', () => {
    const d = districtData.find(x => x.district === districtEl.value);
    if (!d) return;
    soilPh.value = d.pH; soilMoisture.value = d.moisture; nitrogen.value = d.nitrogen; phosphorus.value = d.phosphorus; potassium.value = d.potassium; temperature.value = d.temperature; humidity.value = d.humidity; rainfall.value = d.rainfall; soilTexture.value = '';
  });

  resetBtn.addEventListener('click', () => {
    // Stop any ongoing speech
    if (isSpeaking) {
      stopSpeaking();
    }
    
    document.getElementById('cropForm').reset();
    finalDiv.classList.add('hidden'); loader.classList.add('hidden'); placeholder.classList.remove('hidden'); warnBox.classList.add('hidden');
    Object.values(charts).forEach(ch => { if(ch) ch.destroy(); }); charts = { compare: null, npk: null };
    
    lastResult = null;
    if (listenBtn) {
      listenBtn.disabled = true;
    }
    
    calculationDone = false;
    profitTab.disabled = true;
    profitTab.classList.add('opacity-50', 'cursor-not-allowed');
    analysisTab.click();
  });

  // Voice button event listener with toggle
  if (listenBtn) {
    listenBtn.addEventListener('click', () => {
      try {
        if (!lastResult) {
          alert('कृपया पहले कैलकुलेट करें | Please calculate first');
          return;
        }
        
        if (isSpeaking) {
          stopSpeaking();
        } else {
          speakReport(lastResult);
        }
      } catch (error) {
        console.error("Voice button error:", error);
        alert('वॉइस सिस्टम में समस्या हुई | Voice system error');
      }
    });
  }

  // Window load handler - cancel any speech and reset button
  window.addEventListener('load', () => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (listenBtn) {
        listenBtn.disabled = true;
        listenBtn.classList.remove('speaking');
        const icon = listenBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-microphone';
        if (btnText) btnText.textContent = '🔊 Listen Report';
      }
      isSpeaking = false;
    } catch (error) {
      console.error("Window load voice error:", error);
    }
  });

  // Before page unload, cancel speech
  window.addEventListener('beforeunload', () => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.error("Before unload voice error:", error);
    }
  });

  function populateDiseaseTable() {
    const tbody = document.getElementById('diseaseTbody');
    if (!tbody) return; tbody.innerHTML = '';
    diseaseData.forEach(d => { const tr = document.createElement('tr'); tr.className = 'disease-row'; tr.innerHTML = `<td class="px-6 py-4 font-medium">${d.name}</td><td class="px-6 py-4 text-sm">${d.triggers}</td><td class="px-6 py-4 text-sm">${d.symptoms}</td><td class="px-6 py-4 text-sm">${d.prevention}</td>`; tbody.appendChild(tr); });
  }
  populateDiseaseTable();
  
  if (diseaseBtn) { diseaseBtn.addEventListener('click', () => diseaseModal.classList.remove('hidden')); }
  if (closeModal) { closeModal.addEventListener('click', () => diseaseModal.classList.add('hidden')); }

  // Simplified fertilizer explanation
  if (viewDetails) {
    viewDetails.addEventListener('click', () => {
      try {
        if (fertDetails) { 
          fertDetails.innerHTML = `
            <div class="bg-green-50 p-5 rounded-xl border border-green-200">
              <h4 class="font-bold text-lg text-green-800 mb-3">🧪 खाद की सलाह कैसे बनती है?</h4>
              <div class="space-y-4 text-gray-700">
                <div class="flex gap-3">
                  <div class="text-2xl">🔍</div>
                  <div><span class="font-semibold">पहला कदम:</span> सिस्टम चेक करता है कि नाइट्रोजन, फॉस्फोरस और पोटैशियम की मात्रा कम है या ज्यादा।</div>
                </div>
                <div class="flex gap-3">
                  <div class="text-2xl">📉</div>
                  <div><span class="font-semibold">दूसरा कदम:</span> जितनी कमी होगी, उतनी ही ज्यादा खाद डालने की सलाह दी जाती है।</div>
                </div>
                <div class="flex gap-3">
                  <div class="text-2xl">🌱</div>
                  <div><span class="font-semibold">तीसरा कदम:</span> मिट्टी की गुणवत्ता जितनी अच्छी होगी, खाद उतनी ही असरदार होगी।</div>
                </div>
                <div class="flex gap-3">
                  <div class="text-2xl">🛡️</div>
                  <div><span class="font-semibold">चौथा कदम:</span> सेफ्टी लिमिट रखी गई है ताकि ज्यादा खाद डालने से फसल को नुकसान न हो।</div>
                </div>
                <div class="flex gap-3">
                  <div class="text-2xl">✅</div>
                  <div><span class="font-semibold">पांचवा कदम:</span> अगर कोई न्यूट्रिएंट पहले से ज्यादा है तो उसकी खाद डालने की सलाह नहीं दी जाती।</div>
                </div>
              </div>
              <p class="mt-4 text-sm text-gray-500 border-t pt-3">यह सारा कैलकुलेशन आपके खेत के रियल डेटा के आधार पर होता है।</p>
            </div>
          `; 
        }
        fertModal.classList.remove('hidden');
      } catch (error) {
        console.error("Fertilizer modal error:", error);
      }
    });
  }
  
  if (closeFertModal) { closeFertModal.addEventListener('click', () => fertModal.classList.add('hidden')); }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => { html2canvas(document.body, { scale:1.5 }).then(canvas => { const link = document.createElement('a'); link.download = `farmer_friend_${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click(); }).catch(console.warn); });
  }

  // Tab logic
  if (analysisTab && profitTab && analysisSection && profitSection) {
    analysisTab.addEventListener('click', () => {
      analysisTab.classList.add('active-tab');
      profitTab.classList.remove('active-tab');
      analysisSection.classList.remove('hidden');
      profitSection.classList.add('hidden');
    });
    profitTab.addEventListener('click', () => {
      if (!calculationDone) {
        alert('Please calculate field analysis first');
        return;
      }
      profitTab.classList.add('active-tab');
      analysisTab.classList.remove('active-tab');
      profitSection.classList.remove('hidden');
      analysisSection.classList.add('hidden');
    });
  }
})();
