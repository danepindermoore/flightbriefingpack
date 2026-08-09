
    const cleanupDigits = v => String(v || '').replace(/\D/g,'');

const airportList = typeof baDestinations !== "undefined" ? baDestinations : [];
    
    const fdpApi = typeof baFdpData !== "undefined" ? baFdpData : null;

    const airportByCode = {
      LHR: { code:"LHR", city:"London", airport:"London Heathrow Airport", timeZone:"Europe/London" },
      LGW: { code:"LGW", city:"London", airport:"London Gatwick Airport", timeZone:"Europe/London" },
      ...Object.fromEntries(airportList.map(a => [a.code, a]))
    };

    const aircraftMap = globalThis.AIRCRAFT || {};
    const aircraftOrder = globalThis.AIRCRAFT_ORDER || [];

    const ids = {
      flightDate: document.getElementById('flightDate'),
      flightNumber: document.getElementById('flightNumber'),
      from: document.getElementById('from'),
      to: document.getElementById('to'),
      acclimatisedAt: document.getElementById('acclimatisedAt'),
      lhrTerminal: document.getElementById('lhrTerminal'),
      aircraftType: document.getElementById('aircraftType'),
      depHour: document.getElementById('depHour'),
      depMinute: document.getElementById('depMinute'),
      reportHour: document.getElementById('reportHour'),
      reportMinute: document.getElementById('reportMinute'),
      lastArrHour: document.getElementById('lastArrHour'),
      lastArrMinute: document.getElementById('lastArrMinute'),
      arrivalTimeLabel: document.getElementById('arrivalTimeLabel'),
      numSectors: document.getElementById('numSectors'),
      sccm: document.getElementById('sccm'),
      asccm: document.getElementById('asccm'),
      absHour: document.getElementById('absHour'),
      absMinute: document.getElementById('absMinute'),
      actualHour: document.getElementById('actualHour'),
      actualMinute: document.getElementById('actualMinute'),
      revDepHour: document.getElementById('revDepHour'),
      revDepMinute: document.getElementById('revDepMinute'),
      revLandHour: document.getElementById('revLandHour'),
      revLandMinute: document.getElementById('revLandMinute'),
      flightCrewCompliment: document.getElementById('flightCrewCompliment'),
      cmdrDiscRequired: document.getElementById('cmdrDiscRequired'),
      delaySection: document.getElementById('delaySection'),
      taxiOutMins: document.getElementById('taxiOutMins'),
      holdingMins: document.getElementById('holdingMins'),
      taxiInMins: document.getElementById('taxiInMins'),
      calcBtn: document.getElementById('calcBtn'),
      clearBtn: document.getElementById('clearBtn'),
      errorBox: document.getElementById('errorBox'),
      resultsBox1: document.getElementById('resultsBox1'),
      resultsBox2: document.getElementById('resultsBox2'),
      resultsBox3: document.getElementById('resultsBox3'),
      routeRef: document.getElementById('routeRef'),
      notesList: document.getElementById('notesList')
    };

    function normalizeCode(value){ return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0,3); }
    function parsePart(h,m,allowBlank=false){ if(h===''&&m==='') return allowBlank?null:undefined; const hh=Number(h), mm=Number(m); if(!Number.isInteger(hh)||!Number.isInteger(mm)||hh<0||hh>23||mm<0||mm>59) return undefined; return hh*60+mm; }
    function parseMinutesOnly(v,allowBlank=false){ if(v==='') return allowBlank?null:undefined; const n=Number(v); if(!Number.isInteger(n)||n<0||n>999) return undefined; return n; }
    function fmtDuration(mins){ if(mins==null) return 'NIL'; const h=Math.floor(mins/60), m=mins%60; return `${String(h).padStart(2,'0')}h${String(m).padStart(2,'0')}m`; }
    function fmtClockFromMs(ms){ const d=new Date(ms); return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`; }
    function fmtClockWithZ(ms){ return `${fmtClockFromMs(ms)}z`; }
    function addMinutes(ms, mins){ return ms + (mins*60000); }
    function parseISODate(dateStr){ const [y,m,d]=String(dateStr).split('-').map(Number); return {y,m,d}; }
    function dayNumberUTC(y,m,d){ return Math.floor(Date.UTC(y,m-1,d)/86400000); }
    function getZonedParts(date, tz){ const parts=new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(date); const get=t=>parts.find(p=>p.type===t)?.value; return {year:+get('year'),month:+get('month'),day:+get('day'),hour:+get('hour'),minute:+get('minute')}; }
    function zonedDateFromLocal(dateStr, localMinutes, tz){ const {y,m,d}=parseISODate(dateStr); const hh=Math.floor(localMinutes/60), mm=localMinutes%60; const utcGuess=new Date(Date.UTC(y,m-1,d,hh,mm,0)); const p=getZonedParts(utcGuess,tz); const desiredDay=dayNumberUTC(y,m,d); const actualDay=dayNumberUTC(p.year,p.month,p.day); const delta=((desiredDay-actualDay)*1440)+((hh*60+mm)-(p.hour*60+p.minute)); return new Date(utcGuess.getTime()+delta*60000); }
    function utcDateFromZClock(dateStr,zMinutes){ const {y,m,d}=parseISODate(dateStr); return new Date(Date.UTC(y,m-1,d,Math.floor(zMinutes/60),zMinutes%60,0)); }
    function utcDateFromZClockRolling(dateStr,zMinutes,referenceMs){ let dt=utcDateFromZClock(dateStr,zMinutes); while(referenceMs!=null && dt.getTime()<referenceMs-7200000){ dt=new Date(dt.getTime()+86400000); } return dt; }
    function utcMsToLocalHHMM(utcMs,tz){ return new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(utcMs)); }
    function infoRow(label,value,minor=''){ const minorHtml=minor?`<span class="minor-note">${minor}</span>`:''; return `<div class="info-row"><div class="info-label">${label}</div><div class="info-value">${value}${minorHtml}</div></div>`; }
    function clearInvalidMarkers(){ document.querySelectorAll('.invalid').forEach(el=>el.classList.remove('invalid')); }
    function markInvalid(...els){ els.forEach(el=>{ if(el) el.classList.add('invalid'); }); }
    function showError(msg){ ids.errorBox.style.display='block'; ids.errorBox.textContent=msg; }
    function hideError(){ ids.errorBox.style.display='none'; ids.errorBox.textContent=''; }
    function sanitiseAirportInput(el){ el.value=normalizeCode(el.value); el.classList.remove('invalid'); }
    function sanitiseFlightNumber(){ let raw=ids.flightNumber.value.toUpperCase().replace(/[^A-Z0-9]/g,''); raw=raw.replace(/^BA/,'').replace(/[A-Z]/g,'').slice(0,4); ids.flightNumber.value='BA'+raw; }

    function wireTimeAutoAdvance(){
      const pairs=[['depHour','depMinute'],['reportHour','reportMinute'],['lastArrHour','lastArrMinute'],['absHour','absMinute'],['actualHour','actualMinute'],['revDepHour','revDepMinute'],['revLandHour','revLandMinute']];
      for(const [hourId, minuteId] of pairs){
        const hourEl=document.getElementById(hourId), minuteEl=document.getElementById(minuteId);
        if(!hourEl || !minuteEl) continue;
        const sanitise=el=>{ el.value=cleanupDigits(el.value).slice(0,2); el.classList.remove('invalid'); };
        hourEl.addEventListener('input',()=>{ sanitise(hourEl); if(hourEl.value.length===2){ minuteEl.focus(); minuteEl.select(); } });
        minuteEl.addEventListener('input',()=>sanitise(minuteEl));
        minuteEl.addEventListener('keydown',e=>{ if(e.key==='Backspace'&&minuteEl.selectionStart===0&&minuteEl.selectionEnd===0&&minuteEl.value.length===0){ hourEl.focus(); hourEl.select(); } });
      }
      [ids.taxiOutMins, ids.holdingMins, ids.taxiInMins].forEach(el=>el.addEventListener('input',()=>{ el.value=cleanupDigits(el.value).slice(0,3); el.classList.remove('invalid'); }));
    }

    function populateSelects(){
      ids.numSectors.innerHTML=Array.from({length:10},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');
      ids.numSectors.value='1';
      ids.flightCrewCompliment.innerHTML=[2,3,4,5].map(n=>`<option value="${n}">${n}</option>`).join('');
      ids.flightCrewCompliment.value='2';
    }

    function setTodayDate(){ const d=new Date(); ids.flightDate.value=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

   function populateAircraft(){
      const validCodes=(globalThis.AIRCRAFT_ORDER || []).filter(code => globalThis.AIRCRAFT && globalThis.AIRCRAFT[code]);
      ids.aircraftType.innerHTML=validCodes.map(code=>{
        const meta=globalThis.AIRCRAFT[code];
        const label=meta.selectorLabel || meta.code || code;
        return `<option value="${code}">${label}</option>`;
      }).join('');
   
    }

    function getAircraftMeta(){ return aircraftMap[ids.aircraftType.value] || null; }
    function isShAirbus(){ const meta=getAircraftMeta(); return meta && meta.code==='SH Airbus'; }
    function isA380(){ return ids.aircraftType.value==='38A'; }

    

    function updateLhrTerminalState(){
      const enabled=normalizeCode(ids.from.value)==='LHR';
      ids.lhrTerminal.disabled=!enabled;
      if(!enabled) ids.lhrTerminal.value='';
      if(enabled && !ids.lhrTerminal.value) ids.lhrTerminal.value='T5';
    }

    function updateDelayVisibility(){
      const hasRevDep=ids.revDepHour.value!=='' || ids.revDepMinute.value!=='';
      ids.delaySection.classList.toggle('hidden-block', !hasRevDep);
    }

    function updateArrivalLabel(){
      const sectors=Number(ids.numSectors.value || '1');
      ids.arrivalTimeLabel.innerHTML=sectors===1 ? 'Scheduled Arrival Time <span class="small-italic">(GMT)</span>' : 'Last Sector Arrival Time <span class="small-italic">(GMT)</span>';
    }

    function maybeWarnIfNotShorthaul(depCode, arrCode){
      const dep=airportByCode[depCode], arr=airportByCode[arrCode];
      const nonBase=(depCode==='LHR'||depCode==='LGW') ? arr : dep;
      if(nonBase && nonBase.haul==='LH') return 'The non-base airport on this route is marked as longhaul. This page is intended for shorthaul use.';
      return '';
    }


    function getFleetKeyForReportTable(){ 
			return isA380() ? 'A380' : 'AIRBUS_SINGLE_AISLE'; 
	}


    function getBaseOrAwayReportMinutes(depCode, terminal){
      const upperDep=normalizeCode(depCode), term=String(terminal || '').toUpperCase();
      if(fdpApi && typeof fdpApi.getCabinCrewReportTime==='function' && (upperDep==='LHR' || upperDep==='LGW')){
        const result=fdpApi.getCabinCrewReportTime({ dep:upperDep, haul:'SH', fleet:upperDep==='LGW' ? '777' : getFleetKeyForReportTable(), terminal:upperDep==='LHR' ? term : 'N/A' });
        if(result && result.found) return result.minutes;
      }
      if(upperDep==='LHR' || upperDep==='LGW'){
        if(isA380()) return upperDep==='LHR' && term==='T3' ? 115 : 105;
        return upperDep==='LHR' && term==='T3' ? 100 : 90;
      }
      return isA380() ? 75 : 60;
    }

    function prepopulateReportTime(){
      hideError();
      const depCode=normalizeCode(ids.from.value);
      const depAirport=airportByCode[depCode];
      const depZ=parsePart(ids.depHour.value, ids.depMinute.value, true);
      if(depZ==null || depZ===undefined || !depAirport || !ids.flightDate.value) return;
      const minsBefore=getBaseOrAwayReportMinutes(depCode, ids.lhrTerminal.value);
      const depUtcMs = zonedDateFromLocal(
    ids.flightDate.value,
    depZ,
    depAirport.timeZone
).getTime();
      const reportUtcMs=addMinutes(depUtcMs, -minsBefore);
      const reportLocal=utcMsToLocalHHMM(reportUtcMs, depAirport.timeZone);
      const [hh,mm]=reportLocal.split(':');
      ids.reportHour.value=hh;
      ids.reportMinute.value=mm;
    }

    function validateRequiredTimePair(hourEl, minuteEl, label, allowBlank=false){
      const parsed=parsePart(hourEl.value, minuteEl.value, allowBlank);
      if(parsed===undefined){ markInvalid(hourEl, minuteEl); return {ok:false, value:null, message:`Please complete ${label} using valid hour and minute values.`}; }
      if(parsed===null && !allowBlank){ markInvalid(hourEl, minuteEl); return {ok:false, value:null, message:`Please complete ${label}.`}; }
      return {ok:true, value:parsed, message:''};
    }

    function validateRequiredMinutesOnly(inputEl, label, allowBlank=false){
      const parsed=parseMinutesOnly(inputEl.value, allowBlank);
      if(parsed===undefined){ markInvalid(inputEl); return {ok:false, value:null, message:`Please complete ${label} using valid minutes.`}; }
      if(parsed===null && !allowBlank){ markInvalid(inputEl); return {ok:false, value:null, message:`Please complete ${label}.`}; }
      return {ok:true, value:parsed, message:''};
    }

    function getActualFlightMinutes(absFlight, actualFlight){ return actualFlight==null ? absFlight : actualFlight; }
    function getClearTimeMinutes(arrivingCode){ if(arrivingCode==='LHR' || arrivingCode==='LGW') return isShAirbus() ? 30 : 45; return 30; }
    function getReferenceReportHHMM(reportUtcMs, acclimatisedCode){ const code=normalizeCode(acclimatisedCode); if(code==='LHR' || !airportByCode[code]) return fmtClockFromMs(reportUtcMs); return utcMsToLocalHHMM(reportUtcMs, airportByCode[code].timeZone); }
    
function getTable2MaxFdp(referenceHHMM, sectors){ const res=fdpApi && typeof fdpApi.getTable2MaxFdp==='function' ? fdpApi.getTable2MaxFdp(referenceHHMM, sectors) : null; return res ? res.minutes : null; }

    function refreshmentBreakRequirement(dutyPeriod){
      if(dutyPeriod>=180 && dutyPeriod<=360) return 20;
      if(dutyPeriod>=361 && dutyPeriod<=600) return 40;
      if(dutyPeriod>=601 && dutyPeriod<=720) return 60;
      if(dutyPeriod>=721) return 60 + (Math.ceil((dutyPeriod-720)/60)*20);
      return 0;
    }

    function refreshmentBreakNoteShorthaul(minutes){
      if(minutes===20) return '20 minutes continuous break required';
      if(minutes===40) return '40 minute break required (Can be taken as one continuous 40 minute break or two breaks of 20 minutes)';
      if(minutes===60) return '1 hour continuous break required';
      if(minutes>60) return '1 hour continuous break required plus 20 minutes per hour or part of an hour above 12 hours';
      return '';
    }

    function computeCmdrDiscretionAllowed(crewCompliment){ return crewCompliment===2 ? 120 : 180; }


    function calculate(){
      clearInvalidMarkers(); hideError();
      if(!fdpApi){ showError('ba-fdp-tables.js has not loaded correctly.'); return; }

      const flightDate=ids.flightDate.value;
      if(!flightDate){ markInvalid(ids.flightDate); showError('Please complete Date.'); return; }

      const from=normalizeCode(ids.from.value), to=normalizeCode(ids.to.value), acclimatisedAt=normalizeCode(ids.acclimatisedAt.value);
      ids.from.value=from; ids.to.value=to; ids.acclimatisedAt.value=acclimatisedAt;

      if(from.length!==3 || to.length!==3 || acclimatisedAt.length!==3){
        showError('Please enter valid 3-letter airport codes.');
        if(from.length!==3) markInvalid(ids.from);
        if(to.length!==3) markInvalid(ids.to);
        if(acclimatisedAt.length!==3) markInvalid(ids.acclimatisedAt);
        return;
      }

      const depAirport=airportByCode[from], arrAirport=airportByCode[to], acclAirport=airportByCode[acclimatisedAt];
      if(!depAirport){ showError('Unknown departure airport time zone. Add this airport to ba-destinations.js first.'); markInvalid(ids.from); return; }
      if(!arrAirport){ showError('Unknown destination airport time zone. Add this airport to ba-destinations.js first.'); markInvalid(ids.to); return; }
      if(!acclAirport && acclimatisedAt!=='LHR'){ showError('Unknown acclimatised airport time zone. Add this airport to ba-destinations.js first.'); markInvalid(ids.acclimatisedAt); return; }

      if(normalizeCode(ids.from.value)==='LHR' && !ids.lhrTerminal.value){ markInvalid(ids.lhrTerminal); showError('Please select LHR Terminal.'); return; }
      if(!ids.sccm.value.trim()){ markInvalid(ids.sccm); showError('Please complete Senior Crew Member (SCCM).'); return; }
      if(!ids.asccm.value.trim()){ markInvalid(ids.asccm); showError('Please complete Acting SCCM.'); return; }

      const lhWarning=maybeWarnIfNotShorthaul(from,to);
      if(lhWarning){ showError(lhWarning); return; }

      const depRes=validateRequiredTimePair(ids.depHour, ids.depMinute, 'Scheduled Departure Time (Local)');
      if(!depRes.ok){ showError(depRes.message); return; }
      const reportRes=validateRequiredTimePair(ids.reportHour, ids.reportMinute, 'Report Time');
      if(!reportRes.ok){ showError(reportRes.message); return; }
      const lastArrRes=validateRequiredTimePair(ids.lastArrHour, ids.lastArrMinute, 'Arrival Time (GMT)');
      if(!lastArrRes.ok){ showError(lastArrRes.message); return; }
      const absFlightRes=validateRequiredTimePair(ids.absHour, ids.absMinute, 'ABS Flight Time');
      if(!absFlightRes.ok){ showError(absFlightRes.message); return; }
      const actualFlightRes=validateRequiredTimePair(ids.actualHour, ids.actualMinute, 'Actual Flight Time', true);
      if(!actualFlightRes.ok){ showError(actualFlightRes.message); return; }
      
      const revDepRes=validateRequiredTimePair(ids.revDepHour, ids.revDepMinute, 'Delayed Departure Time', true);
      if(!revDepRes.ok){ showError(revDepRes.message); return; }
      const revLandRes=validateRequiredTimePair(ids.revLandHour, ids.revLandMinute, 'Revised Landing Time', true);
      if(!revLandRes.ok){ showError(revLandRes.message); return; }
      const taxiOutRes=validateRequiredMinutesOnly(ids.taxiOutMins, 'Taxi Out');
      if(!taxiOutRes.ok){ showError(taxiOutRes.message); return; }
      const holdingRes=validateRequiredMinutesOnly(ids.holdingMins, 'Holding');
      if(!holdingRes.ok){ showError(holdingRes.message); return; }
      const taxiInRes=validateRequiredMinutesOnly(ids.taxiInMins, 'Taxi In');
      if(!taxiInRes.ok){ showError(taxiInRes.message); return; }

      const sectors=Number(ids.numSectors.value || '1');
      const crewCompliment=Number(ids.flightCrewCompliment.value || '2');
      const cmdrDiscRequired=ids.cmdrDiscRequired.checked;

      const depUtcMs = zonedDateFromLocal(
    flightDate,
    depRes.value,
    depAirport.timeZone
).getTime();
      const reportUtcMs=zonedDateFromLocal(flightDate, reportRes.value, depAirport.timeZone).getTime();

      let plannedArrivalUtcMs=utcDateFromZClockRolling(flightDate, lastArrRes.value, depUtcMs).getTime();
      if(plannedArrivalUtcMs < reportUtcMs) plannedArrivalUtcMs += 86400000;

      const activeDepartureUtcMs=revDepRes.value==null ? depUtcMs : utcDateFromZClockRolling(flightDate, revDepRes.value, reportUtcMs).getTime();
      const activeFlightTime=getActualFlightMinutes(absFlightRes.value, actualFlightRes.value);

     let etaUtcMs = addMinutes(activeDepartureUtcMs, absFlightRes.value);

if (revLandRes.value != null) {
    etaUtcMs = utcDateFromZClockRolling(
        flightDate,
        revLandRes.value,
        activeDepartureUtcMs
    ).getTime();
}

      const routeKey=`${from}-${to}`;
      const rosteredFdp=Math.round((plannedArrivalUtcMs - reportUtcMs)/60000);
      const rosteredDuty=rosteredFdp + getClearTimeMinutes(to);
      const actualFdp=Math.round((activeDepartureUtcMs - reportUtcMs)/60000) + activeFlightTime;
      const actualDutyPeriod=actualFdp + getClearTimeMinutes(to);

      const acclRefHHMM=getReferenceReportHHMM(reportUtcMs, acclimatisedAt);

      const maxFDP = getTable2MaxFdp(acclRefHHMM, sectors);
if (maxFDP == null) {
    showError('Unable to calculate Max FDP from ba-fdp-tables.js.');
    return;
}

// Shorthaul does not use inflight-rest / Table 5 logic.
// The maximum FDP comes directly from Table 2 and can only
// be increased if Commander's Discretion is selected.

const refreshmentBreak = refreshmentBreakRequirement(actualDutyPeriod);
const usingRefreshmentBreak = true;

let newMaxFDPBeforeDisc = maxFDP;
      const maxCmdrDiscretionAllowable=computeCmdrDiscretionAllowed(crewCompliment);
      const newMaxFDPInclDisc=cmdrDiscRequired ? newMaxFDPBeforeDisc + maxCmdrDiscretionAllowable : newMaxFDPBeforeDisc;
      const latestOnChocksUtcMs=addMinutes(reportUtcMs, newMaxFDPInclDisc);
      const latestTakeOffUtcMs=addMinutes(latestOnChocksUtcMs, -(activeFlightTime + taxiInRes.value + holdingRes.value));
      const latestOffChocksUtcMs=addMinutes(latestTakeOffUtcMs, -taxiOutRes.value);

      const etaDestLocal=utcMsToLocalHHMM(etaUtcMs, arrAirport.timeZone);
      const etaUtcText=fmtClockWithZ(etaUtcMs);

      ids.resultsBox1.innerHTML=[
        infoRow('Report Time', fmtClockWithZ(reportUtcMs)),
        infoRow('Rostered Flight Duty Period', fmtDuration(rosteredFdp)),
        infoRow('Rostered Duty Period', fmtDuration(rosteredDuty)),
        infoRow('Estimated Time of Arrival (Destination Local)', etaDestLocal),
        infoRow('Estimated Time of Arrival (GMT)', etaUtcText)
      ].join('');

      const box2Rows = [
    infoRow(
        'Max Flight Duty Period (Max FDP)',
        fmtDuration(maxFDP),
        `Reference time used: ${acclRefHHMM}${acclimatisedAt === 'LHR' ? 'z' : ` @ ${acclimatisedAt}`}`
    ),
    infoRow(
        'New Max Flight Duty Period (FDP)',
        fmtDuration(newMaxFDPInclDisc),
        cmdrDiscRequired ? "Including Commander's Discretion" : ""
    ),
    infoRow(
        'HCC Refreshment Break',
        refreshmentBreak < 60
            ? `${String(refreshmentBreak).padStart(2,'0')}m`
            : fmtDuration(refreshmentBreak)
    )
];

ids.resultsBox2.innerHTML = box2Rows.join('');

      ids.resultsBox3.innerHTML=[
        infoRow('Actual Flight Time', fmtDuration(activeFlightTime)),
        infoRow('Latest On Chocks Time', fmtClockWithZ(latestOnChocksUtcMs)),
        infoRow('Latest Take Off Time (HARD LIMIT)', fmtClockWithZ(latestTakeOffUtcMs)),
        infoRow('Latest Off Chocks Time (SOFT LIMIT)', fmtClockWithZ(latestOffChocksUtcMs))
      ].join('');

      
      ids.routeRef.innerHTML =
    `<strong>${routeKey}</strong><br>${depAirport.timeZone}`;

      const notes=[];
      if(usingRefreshmentBreak){ const msg=refreshmentBreakNoteShorthaul(refreshmentBreak); if(msg) notes.push(msg); }
      if(revLandRes.value!=null) notes.push('Revised landing time overrides the ETA displays only. Core FDP calculations still remain based on report, departure and flight-time calculations.');
      ids.notesList.innerHTML=notes.map(n=>`<li>${n}</li>`).join('');
    }

    function clearForm(){
      ids.flightDate.value=''; ids.flightNumber.value='BA'; ids.from.value=''; ids.to.value=''; ids.acclimatisedAt.value='LHR';
      ids.depHour.value=''; ids.depMinute.value=''; ids.reportHour.value=''; ids.reportMinute.value=''; ids.lastArrHour.value=''; ids.lastArrMinute.value='';
      ids.absHour.value=''; ids.absMinute.value=''; ids.actualHour.value=''; ids.actualMinute.value=''; ids.revDepHour.value=''; ids.revDepMinute.value=''; ids.revLandHour.value=''; ids.revLandMinute.value=''; 
      ids.sccm.value='Dane Jordan-Pinder'; ids.asccm.value=''; ids.numSectors.value='1'; ids.flightCrewCompliment.value='2'; ids.cmdrDiscRequired.checked=false;
      ids.taxiOutMins.value='25'; ids.holdingMins.value='10'; ids.taxiInMins.value='10'; ids.lhrTerminal.value='';
      setTodayDate(); updateLhrTerminalState(); updateDelayVisibility(); updateArrivalLabel();  hideError();
      ids.resultsBox1.innerHTML=''; ids.resultsBox2.innerHTML=''; ids.resultsBox3.innerHTML=''; ids.routeRef.textContent='—'; ids.notesList.innerHTML='';
    }

    ids.from.addEventListener('input',()=>{ sanitiseAirportInput(ids.from); updateLhrTerminalState(); prepopulateReportTime(); });
    ids.to.addEventListener('input',()=>sanitiseAirportInput(ids.to));
    ids.acclimatisedAt.addEventListener('input',()=>sanitiseAirportInput(ids.acclimatisedAt));
    ids.flightNumber.addEventListener('input',sanitiseFlightNumber);
    ids.aircraftType.addEventListener('change',()=>{ prepopulateReportTime(); });
    ids.lhrTerminal.addEventListener('change',prepopulateReportTime);
    ids.depHour.addEventListener('input',prepopulateReportTime);
    ids.depMinute.addEventListener('input',prepopulateReportTime);
    ids.numSectors.addEventListener('change',updateArrivalLabel);
    ids.revDepHour.addEventListener('input',updateDelayVisibility);
    ids.revDepMinute.addEventListener('input',updateDelayVisibility);
    ids.calcBtn.addEventListener('click',calculate);
    ids.clearBtn.addEventListener('click',clearForm);

    populateSelects();
    setTodayDate();
    wireTimeAutoAdvance();
    sanitiseFlightNumber();
    populateAircraft();
    updateLhrTerminalState();
    updateDelayVisibility();
    updateArrivalLabel();
    ids.resultsBox1.innerHTML=''; ids.resultsBox2.innerHTML=''; ids.resultsBox3.innerHTML='';
