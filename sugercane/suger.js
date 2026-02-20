
(function() {
  // ==================== SUGARCANE ENGINE (UP specific) ==================== (सब कैल्कुलेशन पहले जैसा)
  
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
  const cropStageSelect = document.getElementById('cropStage');
  const irrigationCheck = document.getElementById('irrigation');
  
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

  // Tabs
  const analysisTab = document.getElementById('analysisTab');
  const profitTab = document.getElementById('profitTab');
  const analysisSection = document.getElementById('analysisSection');
  const profitSection = document.getElementById('profitSection');

  // ========== VOICE ASSISTANT ========== (महिला हिंदी आवाज, धीमी, साफ)
  const listenBtn = document.getElementById('listenBtn');
  const btnText = listenBtn ? listenBtn.querySelector('.btn-text') : null;
  let lastResult = null;
  let isSpeaking = false;
  let currentUtterance = null;
  let selectedFemaleHindiVoice = null;

  // profit display elements
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

  // District data (preserved)
  const districtData = [
    { district: "Lucknow", soil: 'loamy', pH: 6.9, moisture: 72, nitrogen: 320, phosphorus: 18, potassium: 210, temperature: 29.5, humidity: 78, rainfall: 920 },
    { district: "Agra", soil: 'sandy loam', pH: 7.2, moisture: 65, nitrogen: 280, phosphorus: 15, potassium: 190, temperature: 30.8, humidity: 70, rainfall: 890 },
    { district: "Gorakhpur", soil: 'clay loam', pH: 6.6, moisture: 78, nitrogen: 350, phosphorus: 22, potassium: 240, temperature: 28.5, humidity: 84, rainfall: 1150 },
    { district: "Varanasi", soil: 'silty loam', pH: 6.8, moisture: 68, nitrogen: 300, phosphorus: 20, potassium: 230, temperature: 30.2, humidity: 80, rainfall: 960 },
    { district: "Jhansi", soil: 'sandy', pH: 7.1, moisture: 64, nitrogen: 260, phosphorus: 12, potassium: 180, temperature: 31.2, humidity: 68, rainfall: 885 }
  ];

  const soilTextureRatings = { 
    'loamy':0.9, 'sandy loam':0.8, 'clay loam':0.85, 'silty loam':0.88, 'sandy':0.6,
    'Clay Loam':0.85, 'Silty Clay Loam':0.88, 'Silty Loam':0.85, 'Clay':0.7, 'Loam':0.9 
  };

  // Disease data (sugarcane)
  const diseaseData = [
    { name: "लाल सड़न", triggers: "उच्च N (>320) + अधिक नमी (>85%), जलभराव", symptoms: "तने के अंदर लाली, मुरझान", prevention: "रोगमुक्त बीज, जल निकासी" },
    { name: "काली गाँठ", triggers: "तापमान >35°C + कम नमी (<50%)", symptoms: "काली कोड़े जैसी संरचना", prevention: "गर्म पानी उपचार, रोगरोधी किस्म" },
    { name: "मुरझान", triggers: "जलभराव (नमी>90%, बारिश>1200mm)", symptoms: "पीलापन, तने में रंग बदलना", prevention: "जल निकासी, सौर उपचार" },
    { name: "रतुआ", triggers: "नमी 80–90%, ताप 20–30°C", symptoms: "पत्तियों पर नारंगी धब्बे", prevention: "रोगरोधी किस्म, फसल चक्र" },
    { name: "घास जैसे अंकुर", triggers: "फाइटोप्लाज्मा, कीड़े", symptoms: "घास जैसे अंकुर", prevention: "रोगमुक्त बीज" },
    { name: "पोक्का बोएंग", triggers: "उच्च N + जलभराव", symptoms: "पत्ती विकृति, सड़न", prevention: "जल निकासी सुधारें" },
    { name: "रतून ठिगनापन", triggers: "बार-बार रतून, कम K (<140)", symptoms: "ठिगने पौधे, गुलाबी धब्बे", prevention: "गर्म पानी उपचार, औज़ार साफ" }
  ];

  // ========== UTILITY FUNCTIONS ==========
  function stopSpeaking() {
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (listenBtn) {
        listenBtn.classList.remove('speaking');
        const icon = listenBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-microphone';
        if (btnText) btnText.textContent = 'रिपोर्ट सुनें';
      }
      isSpeaking = false;
      currentUtterance = null;
    } catch (e) { console.error(e); }
  }

  // female Hindi voice selector (धीमी 0.85)
  function getFemaleHindiVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    // प्राथमिकता: महिला हिंदी
    let voice = voices.find(v => v.lang === 'hi-IN' && (v.name.toLowerCase().includes('female') || v.name.includes('Google हिन्दी') || v.name.includes('Heera') || v.name.includes('Lekha')));
    if (!voice) voice = voices.find(v => v.lang === 'hi-IN');  // कोई भी हिंदी
    if (!voice) voice = voices.find(v => v.lang.startsWith('hi')); 
    if (!voice && voices.length) voice = voices[0]; // डिफ़ॉल्ट
    return voice;
  }

  function formatCurrency(value) {
    return '₹ ' + Math.round(value).toLocaleString('en-IN');
  }

  function softNormalize(value, min, max, ideal) {
    if (isNaN(value) || value === null) return 0;
    const sigma = (max - min) / 4;
    const diff = value - ideal;
    return Math.exp(-(diff * diff) / (2 * sigma * sigma));
  }

  function getTextureScore(texture) {
    return soilTextureRatings[texture] || 0.5;
  }

  // ========== CORE SUGARCANE SCORING ==========
  function calculateSoilScore(ph, moisture, texture) {
    const phNorm = softNormalize(ph, 5.5, 8.0, 6.8);
    const moistNorm = softNormalize(moisture, 50, 90, 75);
    const texScore = getTextureScore(texture);
    return (phNorm * 0.3 + moistNorm * 0.3 + texScore * 0.4) * 100;
  }

  function calculateWeatherScore(temp, hum, rain, irrig) {
    let tempScore = softNormalize(temp, 18, 38, 28);
    let humScore = softNormalize(hum, 50, 90, 75);
    let rainScore = 1.0;
    
    if (rain < 700) {
      rainScore = irrig ? 0.7 : 0.4;
    } else if (rain > 1200) {
      rainScore = 0.6;
    } else {
      rainScore = 1.0;
    }
    
    return (tempScore * 0.4 + humScore * 0.3 + rainScore * 0.3) * 100;
  }

  function calculateNutrientScore(N, P, K) {
    const nScore = softNormalize(N, 150, 400, 280);
    const pScore = softNormalize(P, 60, 200, 120);
    const kScore = softNormalize(K, 100, 300, 180);
    return (nScore * 0.4 + pScore * 0.3 + kScore * 0.3) * 100;
  }

  // ========== DISEASE ENGINE (UP specific) ==========
  function computeDiseaseRisk(N, hum, moisture, rain, K, stage, temp) {
    let risk = 15; // base
    let warnings = [];
    
    if (N > 320 && hum > 85) { risk += 25; warnings.push("लाल सड़न का उच्च जोखिम (उच्च N + नमी)"); }
    else if (N > 300 && hum > 80) { risk += 15; warnings.push("लाल सड़न संभव"); }
    
    if (temp > 35 && moisture < 50) { risk += 15; warnings.push("काली गाँठ का खतरा (गर्मी + सूखा)"); }
    
    if (rain > 1200 && moisture > 85) { risk += 20; warnings.push("मुरझान का खतरा (जलभराव)"); }
    if (moisture > 90) { risk += 15; warnings.push("जलभराव से मुरझान बढ़ सकता है"); }
    
    if (hum >= 80 && hum <= 90 && temp >= 20 && temp <= 30) {
      risk += 10; warnings.push("रतुआ के लिए अनुकूल स्थितियाँ");
    }
    
    if (N > 320 && rain > 900) { risk += 15; warnings.push("पोक्का बोएंग का खतरा (उच्च N + भारी बारिश)"); }
    
    if (stage === 'Ratoon' && K < 140) { risk += 20; warnings.push("रतून ठिगनापन जोखिम (कम पोटाश)"); }
    
    risk = Math.min(90, risk);
    
    let level = 'Low';
    let displayLevel = 'Low';
    if (risk > 50) {
      level = 'High';
      displayLevel = 'उच्च (तुरंत कार्रवाई करें)';
    } else if (risk > 25) {
      level = 'Medium';
      displayLevel = 'मध्यम (निगरानी रखें)';
    } else {
      displayLevel = 'कम (कोई बड़ा खतरा नहीं)';
    }
    
    return { level, displayLevel, score: risk, warnings };
  }

  // ========== STAGE PENALTIES ==========
  function applyStagePenalty(growth, stage, N, K, temp, moisture, irrig, rain, diseaseScore) {
    let penalty = 0;
    
    if (stage === 'Germination') {
      if (moisture > 85) penalty += 0.10;
      if (temp < 18) penalty += 0.15;
    } else if (stage === 'Tillering') {
      if (N < 250) penalty += 0.15;
      if (moisture < 65) penalty += 0.10;
    } else if (stage === 'Grand Growth') {
      if (temp > 38) penalty += 0.20;
      if (!irrig && rain < 700) penalty += 0.15;
    } else if (stage === 'Maturity') {
      if (N > 350) penalty += 0.12;
    } else if (stage === 'Ratoon') {
      if (K < 140) penalty += 0.15;
      if (diseaseScore > 60) penalty += 0.20;
    }
    
    let adjusted = growth * (1 - penalty);
    return Math.min(100, Math.max(5, adjusted));
  }

  // ========== DISEASE PENALTY ==========
  function applyDiseasePenalty(growth, diseaseScore) {
    let factor = 1.0;
    if (diseaseScore > 60) factor = 0.8;
    else if (diseaseScore > 40) factor = 0.9;
    else if (diseaseScore > 20) factor = 0.95;
    return growth * factor;
  }

  // ========== HEAT STRESS ==========
  function applyHeatStress(growth, temp) {
    if (temp > 38) return growth * 0.75;
    if (temp > 35) return growth * 0.85;
    return growth;
  }

  // ========== LOGISTIC YIELD (60-130 t/ha) ==========
  function logisticYield(growth) {
    const yMin = 60, yMax = 130;
    return yMin + (yMax - yMin) / (1 + Math.exp(-0.1 * (growth - 50)));
  }

  // ========== FERTILIZER RECOMMENDATION ==========
  function calculateFertilizer(N, P, K, soilScore) {
    const ideals = { N: 250, P: 100, K: 180 };
    const conversion = { NtoUrea: 2.17, PtoDAP: 2.0, KtoMOP: 1.67 };
    const safetyCaps = { Urea: 550, DAP: 300, MOP: 250 };
    
    const efficiency = soilScore / 100;
    let warnings = [];
    
    let nStatus = N < 200 ? 'कमी' : (N > 350 ? 'अधिकता' : 'सही');
    let pStatus = P < 80 ? 'कमी' : (P > 150 ? 'अधिकता' : 'सही');
    let kStatus = K < 140 ? 'कमी' : (K > 250 ? 'अधिकता' : 'सही');
    
    let urea = 0, dap = 0, mop = 0;
    
    if (N < ideals.N) urea = (ideals.N - N) * conversion.NtoUrea * efficiency;
    if (P < ideals.P) dap = (ideals.P - P) * conversion.PtoDAP * efficiency;
    if (K < ideals.K) mop = (ideals.K - K) * conversion.KtoMOP * efficiency;
    
    urea = Math.min(safetyCaps.Urea, Math.max(0, Math.round(urea)));
    dap = Math.min(safetyCaps.DAP, Math.max(0, Math.round(dap)));
    mop = Math.min(safetyCaps.MOP, Math.max(0, Math.round(mop)));
    
    if (N > 350) warnings.push("नाइट्रोजन अधिकता: यूरिया न डालें");
    if (P > 150) warnings.push("फॉस्फोरस अधिकता: डीएपी न डालें");
    if (K > 250) warnings.push("पोटाश अधिकता: एमओपी न डालें");
    
    return {
      nitrogenStatus: nStatus,
      phosphorusStatus: pStatus,
      potassiumStatus: kStatus,
      ureaKgPerHa: urea,
      dapKgPerHa: dap,
      mopKgPerHa: mop,
      warnings,
      applicationMethod: {
        nitrogen: N < 250 ? "आधा बुआई के समय, बाकी बाद में" : "सिर्फ रखरखाव मात्रा",
        phosphorus: P < 100 ? "पूरी मात्रा बुआई के समय" : "फॉस्फोरस की जरूरत नहीं",
        potassium: K < 180 ? "आधा बुआई के समय, आधा गुड़ाई पर" : "पोटाश की जरूरत नहीं"
      }
    };
  }

  // ========== PROFIT CALCULATION (FRP) ==========
  function calculateProfit(yieldTons) {
    const FRP = 315;
    const cost = 120000;
    const quintal = yieldTons * 10;
    const gross = quintal * FRP;
    const net = gross - cost;
    const roi = (net / cost) * 100;
    const breakeven = cost / (FRP * 10);
    return { gross, net, roi, breakeven };
  }

  // ========== BEST POSSIBLE ==========
  function calculateBestPossible(stage) {
    const ideal = { ph:6.5, moisture:75, texture:'Loam', N:280, P:120, K:200, temp:28, hum:75, rain:1000 };
    const soilSc = calculateSoilScore(ideal.ph, ideal.moisture, ideal.texture);
    const nutrSc = calculateNutrientScore(ideal.N, ideal.P, ideal.K);
    const weatherSc = calculateWeatherScore(ideal.temp, ideal.hum, ideal.rain, true);
    const growthRaw = soilSc * 0.4 + nutrSc * 0.3 + weatherSc * 0.3;
    const disease = computeDiseaseRisk(ideal.N, ideal.hum, ideal.moisture, ideal.rain, ideal.K, stage, ideal.temp);
    let growthAdj = applyDiseasePenalty(growthRaw, disease.score);
    growthAdj = applyHeatStress(growthAdj, ideal.temp);
    growthAdj = applyStagePenalty(growthAdj, stage, ideal.N, ideal.K, ideal.temp, ideal.moisture, true, ideal.rain, disease.score);
    const yieldVal = logisticYield(growthAdj);
    const profit = calculateProfit(yieldVal);
    return { growth: Math.round(growthAdj), yield: Math.round(yieldVal * 10)/10, profit };
  }

  // ========== SENSITIVITY ==========
  function calculateSensitivity(soil, nutrient, weather) {
    const total = soil * 0.4 + nutrient * 0.3 + weather * 0.3;
    if (total === 0) return { soil:34, nutrient:33, weather:33 };
    return {
      soil: Math.round((soil * 0.4 / total) * 100),
      nutrient: Math.round((nutrient * 0.3 / total) * 100),
      weather: Math.round((weather * 0.3 / total) * 100)
    };
  }

  // ========== VALIDATION ==========
  function validateInputs() {
    const errors = [];
    const N = +nitrogen.value, P = +phosphorus.value, K = +potassium.value;
    const temp = +temperature.value, moist = +soilMoisture.value, ph = +soilPh.value;
    if (N > 600) errors.push("N अधिकतम 600 kg/ha");
    if (P > 300) errors.push("P अधिकतम 300 kg/ha");
    if (K > 400) errors.push("K अधिकतम 400 kg/ha");
    if (temp > 50) errors.push("तापमान अधिकतम 50°C");
    if (moist > 100) errors.push("नमी अधिकतम 100%");
    if (ph < 4 || ph > 9) errors.push("pH 4-9 के बीच हो");
    return errors;
  }

  // ========== MAIN ANALYSIS ==========
  function performAnalysis() {
    const errors = validateInputs();
    if (errors.length > 0) return { error: true, messages: errors };
    
    const ph = +soilPh.value;
    const moist = +soilMoisture.value;
    const texture = soilTexture.value;
    const N = +nitrogen.value;
    const P = +phosphorus.value;
    const K = +potassium.value;
    const temp = +temperature.value;
    const hum = +humidity.value;
    const rain = +rainfall.value;
    const stage = cropStageSelect.value;
    const irrig = irrigationCheck.checked;
    
    const soilSc = calculateSoilScore(ph, moist, texture);
    const nutrSc = calculateNutrientScore(N, P, K);
    const weatherSc = calculateWeatherScore(temp, hum, rain, irrig);
    
    const growthRaw = soilSc * 0.4 + nutrSc * 0.3 + weatherSc * 0.3;
    
    const disease = computeDiseaseRisk(N, hum, moist, rain, K, stage, temp);
    
    let growthAdj = applyDiseasePenalty(growthRaw, disease.score);
    growthAdj = applyHeatStress(growthAdj, temp);
    growthAdj = applyStagePenalty(growthAdj, stage, N, K, temp, moist, irrig, rain, disease.score);
    growthAdj = Math.min(100, Math.max(5, growthAdj));
    
    const yieldVal = logisticYield(growthAdj);
    const yieldRounded = Math.round(yieldVal * 10) / 10;
    
    const fert = calculateFertilizer(N, P, K, soilSc);
    const allWarnings = [...disease.warnings, ...fert.warnings];
    
    const sensitivity = calculateSensitivity(soilSc, nutrSc, weatherSc);
    
    return {
      error: false,
      growthRaw: Math.round(growthRaw),
      growthAdjusted: Math.round(growthAdj),
      yield: yieldRounded,
      soilScore: Math.round(soilSc),
      weatherScore: Math.round(weatherSc),
      diseaseLevel: disease.displayLevel,
      diseaseScore: disease.score,
      sensitivity,
      fertilizer: fert,
      warnings: allWarnings,
      N, P, K
    };
  }

  // ========== SPEAK REPORT (पूरी तरह हिंदी, किसान भाषा) ==========
  function speakReport(data) {
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      
      const district = districtEl.value || 'कोई जिला';
      const stageText = cropStageSelect.options[cropStageSelect.selectedIndex]?.text.split(' ')[0] || 'चयनित';
      const profit = calculateProfit(data.yield);
      
      // किसान के अनुकूल शब्द
      const growthAdjustedHindi = data.growthAdjusted;
      const yieldHindi = data.yield;
      const soilScoreHindi = data.soilScore;
      const weatherScoreHindi = data.weatherScore;
      
      let diseaseHindi = data.diseaseLevel; // already in Hindi from computeDiseaseRisk
      
      const urea = data.fertilizer.ureaKgPerHa;
      const dap = data.fertilizer.dapKgPerHa;
      const mop = data.fertilizer.mopKgPerHa;

      const message = `नमस्ते किसान भाई। 
आपके जिला ${district} में गन्ने की फसल की अवस्था ${stageText} है। 
आपकी फसल की सेहत ${growthAdjustedHindi} प्रतिशत है। 
बीमारी का खतरा ${diseaseHindi} है। 
मिट्टी की स्थिति ${soilScoreHindi} प्रतिशत है। 
मौसम की स्थिति ${weatherScoreHindi} प्रतिशत है। 
आप लगभग ${yieldHindi} टन प्रति हेक्टेयर गन्ना उगा सकते हैं। 
अनुमानित कमाई लगभग ${Math.abs(Math.round(profit.net))} रुपये ${profit.net < 0 ? 'का नुकसान' : 'का फायदा'} प्रति हेक्टेयर हो सकती है। 
अब खाद की सलाह सुनिए। 
${urea > 0 ? `आपको ${urea} किलो यूरिया डालना चाहिए। ` : 'यूरिया की जरूरत नहीं है। '}
${dap > 0 ? `आपको ${dap} किलो डीएपी डालना चाहिए। ` : 'डीएपी की जरूरत नहीं है। '}
${mop > 0 ? `आपको ${mop} किलो एमओपी डालना चाहिए। ` : 'एमओपी की जरूरत नहीं है। '}
धन्यवाद।`;

      const utterance = new SpeechSynthesisUtterance(message);
      
      // महिला हिंदी आवाज चुनें
      const voice = getFemaleHindiVoice();
      if (voice) utterance.voice = voice;
      
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;      // धीमी और साफ
      utterance.pitch = 1.0;
      utterance.volume = 1;
      
      currentUtterance = utterance;
      utterance.onend = stopSpeaking;
      utterance.onerror = stopSpeaking;
      
      if (listenBtn) {
        listenBtn.classList.add('speaking');
        const icon = listenBtn.querySelector('i'); if (icon) icon.className = 'fas fa-stop';
        if (btnText) btnText.textContent = 'आवाज बंद करें';
      }
      isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    } catch (e) { console.error(e); stopSpeaking(); alert('आवाज सिस्टम में समस्या हुई'); }
  }

  // ========== RENDER RESULTS ==========
  function renderResults(d) {
    if (d.error) {
      warnText.textContent = d.messages.join('. ');
      warnBox.classList.remove('hidden');
      finalDiv.classList.add('hidden');
      return;
    }
    
    growthRawLabel.textContent = d.growthRaw + '/100';
    growthRawBar.style.width = d.growthRaw + '%';
    growthAdjustedLabel.textContent = d.growthAdjusted + '/100';
    growthAdjustedBar.style.width = d.growthAdjusted + '%';
    yieldLbl.textContent = d.yield + ' t/ha';
    diseaseLbl.textContent = d.diseaseLevel;
    diseaseLbl.className = `text-2xl font-bold ${d.diseaseLevel.includes('कम')?'text-green-600': d.diseaseLevel.includes('मध्यम')?'text-yellow-600':'text-red-600'}`;
    riskScoreLbl.textContent = `खतरा स्कोर ${d.diseaseScore}%`;
    soilScoreLbl.textContent = d.soilScore + '%';
    soilBar.style.width = d.soilScore + '%';
    weatherScoreLbl.textContent = d.weatherScore + '%';
    weatherBar.style.width = d.weatherScore + '%';
    
    soilPercentLabel.textContent = d.sensitivity.soil + '%';
    soilPercentBar.style.width = d.sensitivity.soil + '%';
    nutrientPercentLabel.textContent = d.sensitivity.nutrient + '%';
    nutrientPercentBar.style.width = d.sensitivity.nutrient + '%';
    weatherPercentLabel.textContent = d.sensitivity.weather + '%';
    weatherPercentBar.style.width = d.sensitivity.weather + '%';
    
    const f = d.fertilizer;
    nStatusBadge.textContent = f.nitrogenStatus;
    nStatusBadge.className = `status-badge status-${f.nitrogenStatus === 'सही' ? 'optimal' : (f.nitrogenStatus === 'कमी' ? 'deficient' : 'excess')}`;
    pStatusBadge.textContent = f.phosphorusStatus;
    pStatusBadge.className = `status-badge status-${f.phosphorusStatus === 'सही' ? 'optimal' : (f.phosphorusStatus === 'कमी' ? 'deficient' : 'excess')}`;
    kStatusBadge.textContent = f.potassiumStatus;
    kStatusBadge.className = `status-badge status-${f.potassiumStatus === 'सही' ? 'optimal' : (f.potassiumStatus === 'कमी' ? 'deficient' : 'excess')}`;
    ureaDose.textContent = f.ureaKgPerHa;
    dapDose.textContent = f.dapKgPerHa;
    mopDose.textContent = f.mopKgPerHa;
    efficiencyFactor.textContent = Math.round(d.soilScore) + '%';
    nitrogenMethodText.textContent = f.applicationMethod.nitrogen;
    phosphorusMethodText.textContent = f.applicationMethod.phosphorus;
    potassiumMethodText.textContent = f.applicationMethod.potassium;
    
    fertilizerWarnings.innerHTML = '';
    d.warnings.forEach(w => {
      const warnEl = document.createElement('div');
      warnEl.className = 'text-xs p-2 bg-yellow-50 text-yellow-800 rounded border border-yellow-200';
      warnEl.innerHTML = `<i class="fas fa-exclamation-triangle mr-1"></i>${w}`;
      fertilizerWarnings.appendChild(warnEl);
    });

    // Charts
    const compareCanvas = document.getElementById('compareChart');
    if (compareCanvas) {
      const ctxComp = compareCanvas.getContext('2d');
      if (charts.compare) charts.compare.destroy();
      charts.compare = new Chart(ctxComp, { 
        type:'bar', 
        data:{ 
          labels:['शुरुआती','असली','मिट्टी','मौसम'], 
          datasets:[{ 
            label:'स्कोर', 
            data:[d.growthRaw, d.growthAdjusted, d.soilScore, d.weatherScore], 
            backgroundColor:['#84cc16','#16a34a','#f59e0b','#0ea5e9'] 
          }] 
        }, 
        options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{max:100,beginAtZero:true}} } 
      });
    }
    
    const npkCanvas = document.getElementById('npkChart');
    if (npkCanvas) {
      const ctxNpk = npkCanvas.getContext('2d');
      if (charts.npk) charts.npk.destroy();
      charts.npk = new Chart(ctxNpk, { 
        type:'bar', 
        data:{ 
          labels:['N','P','K'], 
          datasets:[{ 
            label:'kg/ha', 
            data:[d.N, d.P, d.K], 
            backgroundColor:['#15803d','#0ea5e9','#7c3aed'] 
          }] 
        }, 
        options:{ plugins:{legend:{display:false}} } 
      });
    }

    finalDiv.classList.remove('hidden');

    // Profit section
    const profit = calculateProfit(d.yield);
    grossIncomeVal.innerText = formatCurrency(profit.gross);
    netProfitVal.innerText = formatCurrency(profit.net);
    netProfitVal.className = profit.net < 0 ? 'font-bold text-red-600' : 'font-bold text-green-700';
    roiVal.innerText = profit.roi.toFixed(1) + '%';
    roiVal.className = profit.roi < 0 ? 'font-bold text-red-600' : 'font-bold text-green-700';
    breakevenVal.innerText = profit.breakeven.toFixed(1) + ' t/ha';

    const best = calculateBestPossible(cropStageSelect.value);
    yourGrowthComp.innerText = d.growthAdjusted + '%';
    bestGrowthComp.innerText = best.growth + '%';
    yourYieldComp.innerText = d.yield + ' t/ha';
    bestYieldComp.innerText = '130 t/ha';
    yourProfitComp.innerText = formatCurrency(profit.net) + '/ha';
    yourProfitComp.className = profit.net < 0 ? 'text-xl font-bold text-red-600' : 'text-xl font-bold text-emerald-700';
    bestProfitComp.innerText = formatCurrency(best.profit.net) + '/ha';
  }

  // ========== EVENT HANDLERS ==========
  function allFilled() {
    return [districtEl.value, soilTexture.value, soilPh.value, soilMoisture.value, nitrogen.value, phosphorus.value, potassium.value, temperature.value, humidity.value, rainfall.value].every(v => v && v.toString().trim()!=='');
  }

  let calculationDone = false;

  calcBtn.addEventListener('click', () => {
    if (isSpeaking) stopSpeaking();
    warnBox.classList.add('hidden');
    if (!allFilled()) {
      warnText.textContent = '⚠ सभी खाने भरें';
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
      lastResult = res;
      if (listenBtn) listenBtn.disabled = false;
      calculationDone = true;
      profitTab.disabled = false;
      profitTab.classList.remove('opacity-50', 'cursor-not-allowed');
    }, 500);
  });

  districtEl.addEventListener('change', () => {
    const d = districtData.find(x => x.district === districtEl.value);
    if (!d) return;
    soilPh.value = d.pH;
    soilMoisture.value = d.moisture;
    nitrogen.value = d.nitrogen;
    phosphorus.value = d.phosphorus;
    potassium.value = d.potassium;
    temperature.value = d.temperature;
    humidity.value = d.humidity;
    rainfall.value = d.rainfall;
    soilTexture.value = '';
  });

  resetBtn.addEventListener('click', () => {
    if (isSpeaking) stopSpeaking();
    document.getElementById('cropForm').reset();
    finalDiv.classList.add('hidden'); loader.classList.add('hidden'); placeholder.classList.remove('hidden'); warnBox.classList.add('hidden');
    Object.values(charts).forEach(ch => { if(ch) ch.destroy(); }); charts = { compare: null, npk: null };
    lastResult = null;
    if (listenBtn) listenBtn.disabled = true;
    calculationDone = false;
    profitTab.disabled = true;
    profitTab.classList.add('opacity-50', 'cursor-not-allowed');
    analysisTab.click();
  });

  // Voice button
  if (listenBtn) {
    listenBtn.addEventListener('click', () => {
      if (!lastResult) { alert('कृपया पहले रिपोर्ट बनाएं'); return; }
      if (isSpeaking) stopSpeaking(); else speakReport(lastResult);
    });
  }

  // Window load / unload
  window.addEventListener('load', () => {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch(e){}
    if (listenBtn) { listenBtn.disabled = true; listenBtn.classList.remove('speaking'); }
    isSpeaking = false;
    // voices चुनने के लिए थोड़ा इंतजार (कुछ ब्राउज़र में async)
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {}; // बस ट्रिगर
    }
  });
  window.addEventListener('beforeunload', () => {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch(e){}
  });

  // Disease modal
  const diseaseTbody = document.getElementById('diseaseTbody');
  function populateDiseaseTable() {
    if (!diseaseTbody) return;
    diseaseTbody.innerHTML = '';
    diseaseData.forEach(d => {
      const tr = document.createElement('tr');
      tr.className = 'disease-row';
      tr.innerHTML = `<td class="px-6 py-4 font-medium">${d.name}</td><td class="px-6 py-4 text-sm">${d.triggers}</td><td class="px-6 py-4 text-sm">${d.symptoms}</td><td class="px-6 py-4 text-sm">${d.prevention}</td>`;
      diseaseTbody.appendChild(tr);
    });
  }
  populateDiseaseTable();
  
  if (diseaseBtn) diseaseBtn.addEventListener('click', () => diseaseModal.classList.remove('hidden'));
  if (closeModal) closeModal.addEventListener('click', () => diseaseModal.classList.add('hidden'));

  // Fertilizer modal
  if (viewDetails) {
    viewDetails.addEventListener('click', () => {
      if (fertDetails) { 
        fertDetails.innerHTML = `
          <div class="bg-green-50 p-5 rounded-xl border border-green-200">
            <h4 class="font-bold text-lg text-green-800 mb-3">खाद की सलाह कैसे बनती है?</h4>
            <div class="space-y-4 text-gray-700">
              <div><span class="font-semibold">1.</span> नाइट्रोजन, फॉस्फोरस, पोटाश की कमी देखें</div>
              <div><span class="font-semibold">2.</span> जितनी कमी, उतनी खाद (यूरिया/डीएपी/एमओपी)</div>
              <div><span class="font-semibold">3.</span> मिट्टी की गुणवत्ता के हिसाब से घटाएँ</div>
              <div><span class="font-semibold">4.</span> सुरक्षा सीमा: यूरिया ≤550, डीएपी ≤300, एमओपी ≤250 किलो/हेक्टेयर</div>
              <div><span class="font-semibold">5.</span> जरूरत से ज्यादा हो तो खाद न डालें</div>
            </div>
          </div>
        `; 
      }
      fertModal.classList.remove('hidden');
    });
  }
  if (closeFertModal) closeFertModal.addEventListener('click', () => fertModal.classList.add('hidden'));

  // Download
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      html2canvas(document.body, { scale:1.5 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `sugarcane_up_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(console.warn);
    });
  }

  // Tabs
  if (analysisTab && profitTab && analysisSection && profitSection) {
    analysisTab.addEventListener('click', () => {
      analysisTab.classList.add('active-tab');
      profitTab.classList.remove('active-tab');
      analysisSection.classList.remove('hidden');
      profitSection.classList.add('hidden');
    });
    profitTab.addEventListener('click', () => {
      if (!calculationDone) {
        alert('पहले रिपोर्ट बनाएं');
        return;
      }
      profitTab.classList.add('active-tab');
      analysisTab.classList.remove('active-tab');
      profitSection.classList.remove('hidden');
      analysisSection.classList.add('hidden');
    });
  }
})();
