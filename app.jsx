const { useState, useEffect } = React;

// ── persistence helpers (localStorage, survives app close/reopen) ──
const STORAGE_KEY = "warrior-bootcamp-state-v1";
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

// ─────────────────────────────────────────────────────────────────
// PROGRESSIVE 30-DAY PHYSICAL BLUEPRINT
// Built for a sedentary starting point (93kg / 6ft / no training history).
// Phase 1 (Days 1–7):   Foundation — walking, joint prep, low-volume bodyweight work
// Phase 2 (Days 8–14):  Base Building — walk-jog intervals, moderate volume
// Phase 3 (Days 15–21): Build — continuous jogging begins, light rucking introduced
// Phase 4 (Days 22–30): Army Tough — fasted runs, weighted rucking, real intensity
// Each phase only adds load once the previous one has been absorbed. This is how
// actual basic training ramps up — nobody starts week 1 at week 4 intensity.
// ─────────────────────────────────────────────────────────────────
const PHYSICAL = [
  // Day 1 → MON MOVEMENT, NOT MILES
  { label:"MON", title:"MOVEMENT, NOT MILES", focus:"Walk + Foundation", blocks:[
    {time:"5:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"First week. Nobody expects you to run today — they expect you to show up. That's the only bar. Cold water on the face. No phone."},
    {time:"5:35",dur:"8m",type:"warm",name:"Joint-Prep Warmup",desc:"Ankle circles, hip openers, arm circles, bodyweight squats x10, slow. No rushing cold joints."},
    {time:"5:43",dur:"25m",type:"cardio",name:"Incline Walk / Walk-Jog",desc:"20 min brisk incline walk. Weeks 1: no running — build the engine and protect the joints first."},
    {time:"6:08",dur:"18m",type:"strength",name:"Foundation Circuit",desc:"3 rounds: 8 wall/incline pushups, 10 bodyweight squats, 20s plank, 10 glute bridges. Full rest between rounds — form over speed."},
    {time:"6:26",dur:"12m",type:"recovery",name:"Stretch + Log",desc:"Static stretch — quads, hamstrings, calves, shoulders. Log how the joints felt. Adjust, don't push through pain."},
  ]},
  // Day 2 → TUE FOUNDATION BUILD
  { label:"TUE", title:"FOUNDATION BUILD", focus:"Walk + Foundation", blocks:[
    {time:"5:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Your legs are sore from yesterday. Good — that's proof something changed. Show up anyway. Slower is still forward."},
    {time:"5:35",dur:"8m",type:"warm",name:"Joint-Prep Warmup",desc:"Ankle circles, hip openers, arm circles, bodyweight squats x10, slow. No rushing cold joints."},
    {time:"5:43",dur:"25m",type:"cardio",name:"Incline Walk / Walk-Jog",desc:"20 min brisk incline walk. Weeks 1: no running — build the engine and protect the joints first."},
    {time:"6:08",dur:"18m",type:"strength",name:"Foundation Circuit",desc:"3 rounds: 8 wall/incline pushups, 10 bodyweight squats, 20s plank, 10 glute bridges. Full rest between rounds — form over speed."},
    {time:"6:26",dur:"12m",type:"recovery",name:"Stretch + Log",desc:"Static stretch — quads, hamstrings, calves, shoulders. Log how the joints felt. Adjust, don't push through pain."},
  ]},
  // Day 3 → WED MIDWEEK CHECK
  { label:"WED", title:"MIDWEEK CHECK", focus:"Walk + Foundation", blocks:[
    {time:"5:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Halfway through week one. The urge to skip is loudest right now. Mirror. Say it out loud: 'I show up before I feel ready.'"},
    {time:"5:35",dur:"8m",type:"warm",name:"Joint-Prep Warmup",desc:"Ankle circles, hip openers, arm circles, bodyweight squats x10, slow. No rushing cold joints."},
    {time:"5:43",dur:"25m",type:"cardio",name:"Incline Walk / Walk-Jog",desc:"20 min brisk incline walk. Weeks 1: no running — build the engine and protect the joints first."},
    {time:"6:08",dur:"18m",type:"strength",name:"Foundation Circuit",desc:"3 rounds: 8 wall/incline pushups, 10 bodyweight squats, 20s plank, 10 glute bridges. Full rest between rounds — form over speed."},
    {time:"6:26",dur:"12m",type:"recovery",name:"Stretch + Log",desc:"Static stretch — quads, hamstrings, calves, shoulders. Log how the joints felt. Adjust, don't push through pain."},
  ]},
  // Day 4 → THU CONSISTENCY OVER INTENSITY
  { label:"THU", title:"CONSISTENCY OVER INTENSITY", focus:"Walk + Foundation", blocks:[
    {time:"5:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"You're not building fitness yet — you're building the habit of showing up at this hour. The fitness comes later. Trust the process."},
    {time:"5:35",dur:"8m",type:"warm",name:"Joint-Prep Warmup",desc:"Ankle circles, hip openers, arm circles, bodyweight squats x10, slow. No rushing cold joints."},
    {time:"5:43",dur:"25m",type:"cardio",name:"Incline Walk / Walk-Jog",desc:"20 min brisk incline walk. Weeks 1: no running — build the engine and protect the joints first."},
    {time:"6:08",dur:"18m",type:"strength",name:"Foundation Circuit",desc:"3 rounds: 8 wall/incline pushups, 10 bodyweight squats, 20s plank, 10 glute bridges. Full rest between rounds — form over speed."},
    {time:"6:26",dur:"12m",type:"recovery",name:"Stretch + Log",desc:"Static stretch — quads, hamstrings, calves, shoulders. Log how the joints felt. Adjust, don't push through pain."},
  ]},
  // Day 5 → FRI STREAK PROTECTION
  { label:"FRI", title:"STREAK PROTECTION", focus:"Walk + Foundation", blocks:[
    {time:"5:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"One week of consistency beats one day of heroics. Don't chase soreness. Chase the streak."},
    {time:"5:35",dur:"8m",type:"warm",name:"Joint-Prep Warmup",desc:"Ankle circles, hip openers, arm circles, bodyweight squats x10, slow. No rushing cold joints."},
    {time:"5:43",dur:"25m",type:"cardio",name:"Incline Walk / Walk-Jog",desc:"20 min brisk incline walk. Weeks 1: no running — build the engine and protect the joints first."},
    {time:"6:08",dur:"18m",type:"strength",name:"Foundation Circuit",desc:"3 rounds: 8 wall/incline pushups, 10 bodyweight squats, 20s plank, 10 glute bridges. Full rest between rounds — form over speed."},
    {time:"6:26",dur:"12m",type:"recovery",name:"Stretch + Log",desc:"Static stretch — quads, hamstrings, calves, shoulders. Log how the joints felt. Adjust, don't push through pain."},
  ]},
  // Day 6 → SAT LONGEST WALK
  { label:"SAT", title:"LONGEST WALK", focus:"Walk + Foundation", blocks:[
    {time:"5:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Longest session of the week. Go slow. Slow and finished beats fast and injured — every single time."},
    {time:"5:35",dur:"8m",type:"warm",name:"Joint-Prep Warmup",desc:"Ankle circles, hip openers, arm circles, bodyweight squats x10, slow. No rushing cold joints."},
    {time:"5:43",dur:"25m",type:"cardio",name:"Incline Walk / Walk-Jog",desc:"20 min brisk incline walk. Weeks 1: no running — build the engine and protect the joints first."},
    {time:"6:08",dur:"18m",type:"strength",name:"Foundation Circuit",desc:"3 rounds: 8 wall/incline pushups, 10 bodyweight squats, 20s plank, 10 glute bridges. Full rest between rounds — form over speed."},
    {time:"6:26",dur:"12m",type:"recovery",name:"Stretch + Log",desc:"Static stretch — quads, hamstrings, calves, shoulders. Log how the joints felt. Adjust, don't push through pain."},
  ]},
  // Day 7 → SUN REST + RESET
  { label:"SUN", title:"REST + RESET", focus:"Rest + Mobility", blocks:[
    {time:"5:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Rest is not weakness — it's how the last 6 days actually turn into strength. Walk, breathe, recover. Earn week 2."},
    {time:"5:35",dur:"8m",type:"warm",name:"Joint-Prep Warmup",desc:"Ankle circles, hip openers, arm circles, bodyweight squats x10, slow. No rushing cold joints."},
    {time:"5:43",dur:"25m",type:"cardio",name:"Easy Walk",desc:"25 min flat walk, conversational pace. No jogging. This is recovery, not training."},
    {time:"6:08",dur:"15m",type:"recovery",name:"Stretch + Breathing",desc:"Full body static stretch 10 min. Box breathing 4-4-4-4, 10 rounds."},
  ]},
  // Day 8 → MON WEEK 2 BEGINS
  { label:"MON", title:"WEEK 2 BEGINS", focus:"Walk-Jog + Base", blocks:[
    {time:"5:15",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Week 2. Your resting heart rate is already changing, even if you can't feel it yet. Trust what you can't see."},
    {time:"5:20",dur:"8m",type:"warm",name:"Dynamic Warmup",desc:"Leg swings, high knees (slow), arm circles, hip openers. 2 rounds."},
    {time:"5:28",dur:"30m",type:"cardio",name:"Walk-Jog Intervals",desc:"3 min walk / 1 min light jog, repeat 6–7x. First real jogging — knees dictate the pace, not the clock."},
    {time:"5:58",dur:"22m",type:"strength",name:"Base Building Circuit",desc:"4 rounds: 10 pushups (knees if needed), 12 squats, 30s plank, 12 lunges/leg. 60s rest between rounds."},
    {time:"6:20",dur:"15m",type:"recovery",name:"Stretch + Cold Rinse",desc:"Static stretch 12 min. End shower on 20s cold — introduce it gently, don't shock the system yet."},
  ]},
  // Day 9 → TUE FIRST JOG INTERVALS
  { label:"TUE", title:"FIRST JOG INTERVALS", focus:"Walk-Jog + Base", blocks:[
    {time:"5:15",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Jog intervals get a little longer today. Craving hits? That's your cue to breathe through it, not light up."},
    {time:"5:20",dur:"8m",type:"warm",name:"Dynamic Warmup",desc:"Leg swings, high knees (slow), arm circles, hip openers. 2 rounds."},
    {time:"5:28",dur:"30m",type:"cardio",name:"Walk-Jog Intervals",desc:"3 min walk / 1 min light jog, repeat 6–7x. First real jogging — knees dictate the pace, not the clock."},
    {time:"5:58",dur:"22m",type:"strength",name:"Base Building Circuit",desc:"4 rounds: 10 pushups (knees if needed), 12 squats, 30s plank, 12 lunges/leg. 60s rest between rounds."},
    {time:"6:20",dur:"15m",type:"recovery",name:"Stretch + Cold Rinse",desc:"Static stretch 12 min. End shower on 20s cold — introduce it gently, don't shock the system yet."},
  ]},
  // Day 10 → WED HALFWAY TO WEEK 3
  { label:"WED", title:"HALFWAY TO WEEK 3", focus:"Walk-Jog + Base", blocks:[
    {time:"5:15",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"You've now gone longer without a cigarette than most people manage in a week. Let that sit with you."},
    {time:"5:20",dur:"8m",type:"warm",name:"Dynamic Warmup",desc:"Leg swings, high knees (slow), arm circles, hip openers. 2 rounds."},
    {time:"5:28",dur:"30m",type:"cardio",name:"Walk-Jog Intervals",desc:"3 min walk / 1 min light jog, repeat 6–7x. First real jogging — knees dictate the pace, not the clock."},
    {time:"5:58",dur:"22m",type:"strength",name:"Base Building Circuit",desc:"4 rounds: 10 pushups (knees if needed), 12 squats, 30s plank, 12 lunges/leg. 60s rest between rounds."},
    {time:"6:20",dur:"15m",type:"recovery",name:"Stretch + Cold Rinse",desc:"Static stretch 12 min. End shower on 20s cold — introduce it gently, don't shock the system yet."},
  ]},
  // Day 11 → THU NOBODY'S WATCHING
  { label:"THU", title:"NOBODY'S WATCHING", focus:"Walk-Jog + Base", blocks:[
    {time:"5:15",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Discipline is choosing this at 5:15am when the bed is warm and nobody's watching. Nobody's watching is exactly why it counts."},
    {time:"5:20",dur:"8m",type:"warm",name:"Dynamic Warmup",desc:"Leg swings, high knees (slow), arm circles, hip openers. 2 rounds."},
    {time:"5:28",dur:"30m",type:"cardio",name:"Walk-Jog Intervals",desc:"3 min walk / 1 min light jog, repeat 6–7x. First real jogging — knees dictate the pace, not the clock."},
    {time:"5:58",dur:"22m",type:"strength",name:"Base Building Circuit",desc:"4 rounds: 10 pushups (knees if needed), 12 squats, 30s plank, 12 lunges/leg. 60s rest between rounds."},
    {time:"6:20",dur:"15m",type:"recovery",name:"Stretch + Cold Rinse",desc:"Static stretch 12 min. End shower on 20s cold — introduce it gently, don't shock the system yet."},
  ]},
  // Day 12 → FRI CLEANER FORM
  { label:"FRI", title:"CLEANER FORM", focus:"Walk-Jog + Base", blocks:[
    {time:"5:15",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Your form is getting cleaner. Notice it. Small wins compound — that's the whole game."},
    {time:"5:20",dur:"8m",type:"warm",name:"Dynamic Warmup",desc:"Leg swings, high knees (slow), arm circles, hip openers. 2 rounds."},
    {time:"5:28",dur:"30m",type:"cardio",name:"Walk-Jog Intervals",desc:"3 min walk / 1 min light jog, repeat 6–7x. First real jogging — knees dictate the pace, not the clock."},
    {time:"5:58",dur:"22m",type:"strength",name:"Base Building Circuit",desc:"4 rounds: 10 pushups (knees if needed), 12 squats, 30s plank, 12 lunges/leg. 60s rest between rounds."},
    {time:"6:20",dur:"15m",type:"recovery",name:"Stretch + Cold Rinse",desc:"Static stretch 12 min. End shower on 20s cold — introduce it gently, don't shock the system yet."},
  ]},
  // Day 13 → SAT LONGER EFFORT
  { label:"SAT", title:"LONGER EFFORT", focus:"Walk-Jog + Base", blocks:[
    {time:"5:15",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Longer effort today. Break it into minutes, not the whole distance. One minute at a time is how anyone finishes anything."},
    {time:"5:20",dur:"8m",type:"warm",name:"Dynamic Warmup",desc:"Leg swings, high knees (slow), arm circles, hip openers. 2 rounds."},
    {time:"5:28",dur:"30m",type:"cardio",name:"Walk-Jog Intervals",desc:"3 min walk / 1 min light jog, repeat 6–7x. First real jogging — knees dictate the pace, not the clock."},
    {time:"5:58",dur:"22m",type:"strength",name:"Base Building Circuit",desc:"4 rounds: 10 pushups (knees if needed), 12 squats, 30s plank, 12 lunges/leg. 60s rest between rounds."},
    {time:"6:20",dur:"15m",type:"recovery",name:"Stretch + Cold Rinse",desc:"Static stretch 12 min. End shower on 20s cold — introduce it gently, don't shock the system yet."},
  ]},
  // Day 14 → SUN REST + REVIEW
  { label:"SUN", title:"REST + REVIEW", focus:"Rest + Mobility", blocks:[
    {time:"5:15",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Two weeks down. Rest today. Review what almost broke you this week — and what you did instead of breaking."},
    {time:"5:20",dur:"8m",type:"warm",name:"Dynamic Warmup",desc:"Leg swings, high knees (slow), arm circles, hip openers. 2 rounds."},
    {time:"5:28",dur:"30m",type:"cardio",name:"Easy Walk",desc:"30 min walk, easy pace. Let the legs recover from the week."},
    {time:"5:58",dur:"20m",type:"recovery",name:"Deep Stretch + Journal",desc:"Full body stretch 15 min. Journal: what got easier this week, what still hurts."},
  ]},
  // Day 15 → MON FIRST CONTINUOUS JOG
  { label:"MON", title:"FIRST CONTINUOUS JOG", focus:"Run/Ruck + Build", blocks:[
    {time:"5:00",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Week 3. Today you jog continuously for the first time — no walk breaks. Your body's ready. Your mind just needs to believe it."},
    {time:"5:05",dur:"10m",type:"warm",name:"Full Body Flow",desc:"Dynamic mobility, 2 full rounds. Joints are more prepared now — still don't skip this."},
    {time:"5:15",dur:"30m",type:"cardio",name:"Continuous Jog",desc:"2 km continuous jog, easy pace, no walk breaks. First real running block of the program."},
    {time:"5:45",dur:"20m",type:"strength",name:"Build Circuit",desc:"4 rounds: 12 pushups, 15 squats, 40s plank, 15 mountain climbers. 60s rest."},
    {time:"6:05",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch. Cold shower 45s — a real dose now, body's ready for it."},
  ]},
  // Day 16 → TUE RUCK DAY
  { label:"TUE", title:"RUCK DAY", focus:"Run/Ruck + Build", blocks:[
    {time:"5:00",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Add resistance today — a light pack on your back. This is where 'fit' starts becoming 'tough.'"},
    {time:"5:05",dur:"10m",type:"warm",name:"Full Body Flow",desc:"Dynamic mobility, 2 full rounds. Joints are more prepared now — still don't skip this."},
    {time:"5:15",dur:"30m",type:"cardio",name:"Light Ruck",desc:"2 km walk with a light loaded backpack (5–8 kg). This is where 'fit' starts becoming 'tough.'"},
    {time:"5:45",dur:"20m",type:"strength",name:"Build Circuit",desc:"4 rounds: 12 pushups, 15 squats, 40s plank, 15 mountain climbers. 60s rest."},
    {time:"6:05",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch. Cold shower 45s — a real dose now, body's ready for it."},
  ]},
  // Day 17 → WED PAST COMFORTABLE
  { label:"WED", title:"PAST COMFORTABLE", focus:"Run/Ruck + Build", blocks:[
    {time:"5:00",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Nobody becomes hard by staying comfortable. Today asks a little more of you than yesterday did. That's the design."},
    {time:"5:05",dur:"10m",type:"warm",name:"Full Body Flow",desc:"Dynamic mobility, 2 full rounds. Joints are more prepared now — still don't skip this."},
    {time:"5:15",dur:"30m",type:"cardio",name:"Continuous Jog",desc:"2.5 km continuous jog, easy pace, no walk breaks. First real running block of the program."},
    {time:"5:45",dur:"20m",type:"strength",name:"Build Circuit",desc:"4 rounds: 12 pushups, 15 squats, 40s plank, 15 mountain climbers. 60s rest."},
    {time:"6:05",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch. Cold shower 45s — a real dose now, body's ready for it."},
  ]},
  // Day 18 → THU THREE WEEKS IN
  { label:"THU", title:"THREE WEEKS IN", focus:"Run/Ruck + Build", blocks:[
    {time:"5:00",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"You are three weeks smoke-free-in-progress and three weeks stronger. Those two numbers are not a coincidence."},
    {time:"5:05",dur:"10m",type:"warm",name:"Full Body Flow",desc:"Dynamic mobility, 2 full rounds. Joints are more prepared now — still don't skip this."},
    {time:"5:15",dur:"30m",type:"cardio",name:"Continuous Jog",desc:"3 km continuous jog, easy pace, no walk breaks. First real running block of the program."},
    {time:"5:45",dur:"20m",type:"strength",name:"Build Circuit",desc:"4 rounds: 12 pushups, 15 squats, 40s plank, 15 mountain climbers. 60s rest."},
    {time:"6:05",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch. Cold shower 45s — a real dose now, body's ready for it."},
  ]},
  // Day 19 → FRI PUSH THE PACE
  { label:"FRI", title:"PUSH THE PACE", focus:"Run/Ruck + Build", blocks:[
    {time:"5:00",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Push a little on the run today. Not all-out — just past what's comfortable. That edge is where change happens."},
    {time:"5:05",dur:"10m",type:"warm",name:"Full Body Flow",desc:"Dynamic mobility, 2 full rounds. Joints are more prepared now — still don't skip this."},
    {time:"5:15",dur:"30m",type:"cardio",name:"Continuous Jog",desc:"3 km continuous jog, easy pace, no walk breaks. First real running block of the program."},
    {time:"5:45",dur:"20m",type:"strength",name:"Build Circuit",desc:"4 rounds: 12 pushups, 15 squats, 40s plank, 15 mountain climbers. 60s rest."},
    {time:"6:05",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch. Cold shower 45s — a real dose now, body's ready for it."},
  ]},
  // Day 20 → SAT LONGEST RUN YET
  { label:"SAT", title:"LONGEST RUN YET", focus:"Run/Ruck + Build", blocks:[
    {time:"5:00",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Longest run yet. You've earned the base for this. Pace yourself and finish standing, not crawling."},
    {time:"5:05",dur:"10m",type:"warm",name:"Full Body Flow",desc:"Dynamic mobility, 2 full rounds. Joints are more prepared now — still don't skip this."},
    {time:"5:15",dur:"30m",type:"cardio",name:"Continuous Jog",desc:"4 km (longest yet) continuous jog, easy pace, no walk breaks. First real running block of the program."},
    {time:"5:45",dur:"20m",type:"strength",name:"Build Circuit",desc:"4 rounds: 12 pushups, 15 squats, 40s plank, 15 mountain climbers. 60s rest."},
    {time:"6:05",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch. Cold shower 45s — a real dose now, body's ready for it."},
  ]},
  // Day 21 → SUN REST + WEEK 3 REVIEW
  { label:"SUN", title:"REST + WEEK 3 REVIEW", focus:"Rest + Mobility", blocks:[
    {time:"5:00",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Rest. Look back at week 1 versus now — read your own numbers. You are not the same person who started this."},
    {time:"5:05",dur:"10m",type:"warm",name:"Full Body Flow",desc:"Dynamic mobility, 2 full rounds. Joints are more prepared now — still don't skip this."},
    {time:"5:15",dur:"30m",type:"cardio",name:"Recovery Walk",desc:"30 min easy walk outdoors. Let this week's work actually absorb."},
    {time:"5:45",dur:"25m",type:"recovery",name:"Deep Stretch + Weekly Review",desc:"Full stretch 15 min. Review: log km run, weight moved, cravings beaten. Compare to week 1."},
  ]},
  // Day 22 → MON ARMY PHASE BEGINS
  { label:"MON", title:"ARMY PHASE BEGINS", focus:"Run/Ruck + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Final phase. This is what the whole program was building toward. Early wake, real weight on your back, real distance. You're ready."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Fasted Run",desc:"4 km real running pace, no walk breaks. Every craving that shows up now is weaker than week 1's."},
    {time:"5:25",dur:"20m",type:"strength",name:"Army Circuit",desc:"5 rounds: 15 pushups, 20 squats, 45s plank, 15 burpees (scale to step-back burpees if needed). 60s rest."},
    {time:"5:45",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 90s. Non-negotiable now — body's fully adapted."},
  ]},
  // Day 23 → TUE RUCK — REAL WEIGHT
  { label:"TUE", title:"RUCK — REAL WEIGHT", focus:"Run/Ruck + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Rucking again today — pack, boots, pavement. This is the closest this program gets to army-style conditioning. Own it."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"45m",type:"cardio",name:"Weighted Ruck",desc:"3.5 km with 8–10 kg pack. Boots, pavement, steady pace. This is the closest this plan gets to army-style conditioning."},
    {time:"5:30",dur:"20m",type:"strength",name:"Army Circuit",desc:"5 rounds: 15 pushups, 20 squats, 45s plank, 15 burpees (scale to step-back burpees if needed). 60s rest."},
    {time:"5:50",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 90s. Non-negotiable now — body's fully adapted."},
  ]},
  // Day 24 → WED FASTED RUN, REAL PACE
  { label:"WED", title:"FASTED RUN, REAL PACE", focus:"Run/Ruck + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Fasted run, real pace. Every craving that shows up now is weaker than the one from week 1. You're not fighting the same fight anymore."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Fasted Run",desc:"4 km real running pace, no walk breaks. Every craving that shows up now is weaker than week 1's."},
    {time:"5:25",dur:"20m",type:"strength",name:"Army Circuit",desc:"5 rounds: 15 pushups, 20 squats, 45s plank, 15 burpees (scale to step-back burpees if needed). 60s rest."},
    {time:"5:45",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 90s. Non-negotiable now — body's fully adapted."},
  ]},
  // Day 25 → THU CLOSER THAN THE START
  { label:"THU", title:"CLOSER THAN THE START", focus:"Run/Ruck + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"You are closer to done than to the start line. Don't coast — the last third is where 'tough' gets decided."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Fasted Run",desc:"4.5 km real running pace, no walk breaks. Every craving that shows up now is weaker than week 1's."},
    {time:"5:25",dur:"20m",type:"strength",name:"Army Circuit",desc:"5 rounds: 15 pushups, 20 squats, 45s plank, 15 burpees (scale to step-back burpees if needed). 60s rest."},
    {time:"5:45",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 90s. Non-negotiable now — body's fully adapted."},
  ]},
  // Day 26 → FRI HEAVIER CIRCUIT
  { label:"FRI", title:"HEAVIER CIRCUIT", focus:"Run/Ruck + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Heavier circuit today. Your body has three weeks of base under it now — it can take this."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Fasted Run",desc:"4 km real running pace, no walk breaks. Every craving that shows up now is weaker than week 1's."},
    {time:"5:25",dur:"20m",type:"strength",name:"Army Circuit",desc:"5 rounds: 15 pushups, 20 squats, 45s plank, 15 burpees (scale to step-back burpees if needed). 60s rest."},
    {time:"5:45",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 90s. Non-negotiable now — body's fully adapted."},
  ]},
  // Day 27 → SAT LONGEST RUCK
  { label:"SAT", title:"LONGEST RUCK", focus:"Run/Ruck + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Longest ruck of the program. Slow, steady, no stopping unless it's genuinely necessary. This is the forge."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"45m",type:"cardio",name:"Weighted Ruck",desc:"5 km (longest ruck) with 8–10 kg pack. Boots, pavement, steady pace. This is the closest this plan gets to army-style conditioning."},
    {time:"5:30",dur:"20m",type:"strength",name:"Army Circuit",desc:"5 rounds: 15 pushups, 20 squats, 45s plank, 15 burpees (scale to step-back burpees if needed). 60s rest."},
    {time:"5:50",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 90s. Non-negotiable now — body's fully adapted."},
  ]},
  // Day 28 → SUN SPEND WHAT'S LEFT
  { label:"SUN", title:"SPEND WHAT'S LEFT", focus:"Rest + Mobility", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Two days left after today. Whatever's left in the tank — this is where it gets spent."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Recovery Walk",desc:"30 min easy walk. Deliberate rest — the program ends soon, arrive there recovered."},
    {time:"5:15",dur:"30m",type:"recovery",name:"Deep Stretch + Full Review",desc:"Full stretch 20 min. Review the whole month: Day 1 numbers vs today, smoke-free streak, weight moved."},
  ]},
  // Day 29 → MON REST BEFORE DAY 30
  { label:"MON", title:"REST BEFORE DAY 30", focus:"Run/Ruck + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Rest, deliberately. Tomorrow is the last day. Let your body arrive there fully recovered, not limping in."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Fasted Run",desc:"— real running pace, no walk breaks. Every craving that shows up now is weaker than week 1's."},
    {time:"5:25",dur:"20m",type:"strength",name:"Army Circuit",desc:"5 rounds: 15 pushups, 20 squats, 45s plank, 15 burpees (scale to step-back burpees if needed). 60s rest."},
    {time:"5:45",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 90s. Non-negotiable now — body's fully adapted."},
  ]},
  // Day 30 → TUE DAY 30 — PROOF
  { label:"TUE", title:"DAY 30 — PROOF", focus:"Run/Ruck + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Day 30. Read back your Day 1 numbers before you start. Then go put in the last piece of proof."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds, faster pace. Body's conditioned now — earn the intensity."},
    {time:"4:45",dur:"45m",type:"cardio",name:"Weighted Ruck",desc:"4 km with 8–10 kg pack. Boots, pavement, steady pace. This is the closest this plan gets to army-style conditioning."},
    {time:"5:30",dur:"20m",type:"strength",name:"Army Circuit",desc:"5 rounds: 15 pushups, 20 squats, 45s plank, 15 burpees (scale to step-back burpees if needed). 60s rest."},
    {time:"5:50",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 90s. Non-negotiable now — body's fully adapted."},
  ]},
  // Day 31 → WED MAINTAIN — SPEED WORK
  { label:"WED", title:"MAINTAIN — SPEED WORK", focus:"Intervals + Upper", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Same distance, different demand today — push pace teaches a different kind of tough than grinding distance does."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Interval Run",desc:"6 x 400m hard, 90s walk recovery between. Total ~3km of work."},
    {time:"5:15",dur:"20m",type:"strength",name:"Upper Body Circuit",desc:"4 rounds: 12 pushups, 10 pike pushups, 15 inverted rows/towel rows, 30s plank."},
    {time:"5:35",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 32 → THU MAINTAIN — RUCK + MOBILITY
  { label:"THU", title:"MAINTAIN — RUCK + MOBILITY", focus:"Ruck + Mobility", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Lighter day. Recovery is part of the training, not a break from it — treat it with the same discipline."},
    {time:"4:35",dur:"10m",type:"warm",name:"Mobility Flow",desc:"Slow, deliberate full body mobility work — hips, shoulders, spine."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Easy Ruck",desc:"3 km with light pack (5 kg), easy pace."},
    {time:"5:20",dur:"20m",type:"recovery",name:"Deep Stretch",desc:"Full body static stretch, 60-90s holds per muscle group."},
  ]},
  // Day 33 → FRI MAINTAIN — FULL BODY + RUN
  { label:"FRI", title:"MAINTAIN — FULL BODY + RUN", focus:"Compound + Run", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Friday. Same standard as week one demanded, just heavier weight and faster pace now."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Fasted Run",desc:"3.5 km, moderate-hard pace."},
    {time:"5:15",dur:"25m",type:"strength",name:"Full Body Circuit",desc:"4 rounds: 12 pushups, 15 squats, 12 lunges/leg, 10 burpees, 30s plank. 90s rest."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 34 → SAT MAINTAIN — LONG RUCK TEST
  { label:"SAT", title:"MAINTAIN — LONG RUCK TEST", focus:"Longest Ruck", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"This is the weekly proof-of-work day. Same distance you hit on Day 27 — hold the standard."},
    {time:"5:00",dur:"10m",type:"warm",name:"Long Warmup",desc:"Full 2 rounds mobility."},
    {time:"5:10",dur:"70m",type:"cardio",name:"Long Ruck",desc:"5-6 km with 8-10 kg pack. Steady, no stopping unless necessary."},
    {time:"6:20",dur:"20m",type:"recovery",name:"Full Recovery Protocol",desc:"Deep stretch 15 min. Cold shower 90s. 5 min silence."},
  ]},
  // Day 35 → SUN REST + REVIEW
  { label:"SUN", title:"REST + REVIEW", focus:"Rest + Mindset", blocks:[
    {time:"5:25",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Rest, deliberately. Log the week's income + outreach numbers too — the body and the business both compound on consistency."},
    {time:"5:30",dur:"30m",type:"cardio",name:"Easy Walk",desc:"30 min easy walk. No structured training."},
    {time:"6:00",dur:"25m",type:"recovery",name:"Stretch + Weekly Review",desc:"Full body stretch 15 min. Review: training numbers, outreach numbers, income logged this week."},
  ]},
  // Day 36 → MON MAINTAIN — RUN + CIRCUIT
  { label:"MON", title:"MAINTAIN — RUN + CIRCUIT", focus:"Run + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"You're not chasing new PRs anymore — you're protecting what you built. Consistency, not intensity, wins from here."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Fasted Run",desc:"4 km steady pace. Same distance as Day 24-25 — hold it, don't chase further."},
    {time:"5:20",dur:"20m",type:"strength",name:"Army Circuit",desc:"4 rounds: 15 pushups, 20 squats, 45s plank, 12 burpees. 60s rest."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 37 → TUE MAINTAIN — WEIGHTED RUCK
  { label:"TUE", title:"MAINTAIN — WEIGHTED RUCK", focus:"Ruck + Core", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"The pack doesn't get lighter, you get more used to carrying it. That's the whole idea of toughness."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Weighted Ruck",desc:"4 km with 8-10 kg pack, steady pace."},
    {time:"5:25",dur:"15m",type:"strength",name:"Core Finisher",desc:"3 rounds: 25 crunches, 20 leg raises, 45s plank."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 38 → WED MAINTAIN — SPEED WORK
  { label:"WED", title:"MAINTAIN — SPEED WORK", focus:"Intervals + Upper", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Same distance, different demand today — push pace teaches a different kind of tough than grinding distance does."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Interval Run",desc:"6 x 400m hard, 90s walk recovery between. Total ~3km of work."},
    {time:"5:15",dur:"20m",type:"strength",name:"Upper Body Circuit",desc:"4 rounds: 12 pushups, 10 pike pushups, 15 inverted rows/towel rows, 30s plank."},
    {time:"5:35",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 39 → THU MAINTAIN — RUCK + MOBILITY
  { label:"THU", title:"MAINTAIN — RUCK + MOBILITY", focus:"Ruck + Mobility", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Lighter day. Recovery is part of the training, not a break from it — treat it with the same discipline."},
    {time:"4:35",dur:"10m",type:"warm",name:"Mobility Flow",desc:"Slow, deliberate full body mobility work — hips, shoulders, spine."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Easy Ruck",desc:"3 km with light pack (5 kg), easy pace."},
    {time:"5:20",dur:"20m",type:"recovery",name:"Deep Stretch",desc:"Full body static stretch, 60-90s holds per muscle group."},
  ]},
  // Day 40 → FRI MAINTAIN — FULL BODY + RUN
  { label:"FRI", title:"MAINTAIN — FULL BODY + RUN", focus:"Compound + Run", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Friday. Same standard as week one demanded, just heavier weight and faster pace now."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Fasted Run",desc:"3.5 km, moderate-hard pace."},
    {time:"5:15",dur:"25m",type:"strength",name:"Full Body Circuit",desc:"4 rounds: 12 pushups, 15 squats, 12 lunges/leg, 10 burpees, 30s plank. 90s rest."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 41 → SAT MAINTAIN — LONG RUCK TEST
  { label:"SAT", title:"MAINTAIN — LONG RUCK TEST", focus:"Longest Ruck", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"This is the weekly proof-of-work day. Same distance you hit on Day 27 — hold the standard."},
    {time:"5:00",dur:"10m",type:"warm",name:"Long Warmup",desc:"Full 2 rounds mobility."},
    {time:"5:10",dur:"70m",type:"cardio",name:"Long Ruck",desc:"5-6 km with 8-10 kg pack. Steady, no stopping unless necessary."},
    {time:"6:20",dur:"20m",type:"recovery",name:"Full Recovery Protocol",desc:"Deep stretch 15 min. Cold shower 90s. 5 min silence."},
  ]},
  // Day 42 → SUN REST + REVIEW
  { label:"SUN", title:"REST + REVIEW", focus:"Rest + Mindset", blocks:[
    {time:"5:25",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Rest, deliberately. Log the week's income + outreach numbers too — the body and the business both compound on consistency."},
    {time:"5:30",dur:"30m",type:"cardio",name:"Easy Walk",desc:"30 min easy walk. No structured training."},
    {time:"6:00",dur:"25m",type:"recovery",name:"Stretch + Weekly Review",desc:"Full body stretch 15 min. Review: training numbers, outreach numbers, income logged this week."},
  ]},
  // Day 43 → MON MAINTAIN — RUN + CIRCUIT
  { label:"MON", title:"MAINTAIN — RUN + CIRCUIT", focus:"Run + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"You're not chasing new PRs anymore — you're protecting what you built. Consistency, not intensity, wins from here."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Fasted Run",desc:"4 km steady pace. Same distance as Day 24-25 — hold it, don't chase further."},
    {time:"5:20",dur:"20m",type:"strength",name:"Army Circuit",desc:"4 rounds: 15 pushups, 20 squats, 45s plank, 12 burpees. 60s rest."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 44 → TUE MAINTAIN — WEIGHTED RUCK
  { label:"TUE", title:"MAINTAIN — WEIGHTED RUCK", focus:"Ruck + Core", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"The pack doesn't get lighter, you get more used to carrying it. That's the whole idea of toughness."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Weighted Ruck",desc:"4 km with 8-10 kg pack, steady pace."},
    {time:"5:25",dur:"15m",type:"strength",name:"Core Finisher",desc:"3 rounds: 25 crunches, 20 leg raises, 45s plank."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 45 → WED MAINTAIN — SPEED WORK
  { label:"WED", title:"MAINTAIN — SPEED WORK", focus:"Intervals + Upper", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Same distance, different demand today — push pace teaches a different kind of tough than grinding distance does."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Interval Run",desc:"6 x 400m hard, 90s walk recovery between. Total ~3km of work."},
    {time:"5:15",dur:"20m",type:"strength",name:"Upper Body Circuit",desc:"4 rounds: 12 pushups, 10 pike pushups, 15 inverted rows/towel rows, 30s plank."},
    {time:"5:35",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 46 → THU MAINTAIN — RUCK + MOBILITY
  { label:"THU", title:"MAINTAIN — RUCK + MOBILITY", focus:"Ruck + Mobility", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Lighter day. Recovery is part of the training, not a break from it — treat it with the same discipline."},
    {time:"4:35",dur:"10m",type:"warm",name:"Mobility Flow",desc:"Slow, deliberate full body mobility work — hips, shoulders, spine."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Easy Ruck",desc:"3 km with light pack (5 kg), easy pace."},
    {time:"5:20",dur:"20m",type:"recovery",name:"Deep Stretch",desc:"Full body static stretch, 60-90s holds per muscle group."},
  ]},
  // Day 47 → FRI MAINTAIN — FULL BODY + RUN
  { label:"FRI", title:"MAINTAIN — FULL BODY + RUN", focus:"Compound + Run", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Friday. Same standard as week one demanded, just heavier weight and faster pace now."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Fasted Run",desc:"3.5 km, moderate-hard pace."},
    {time:"5:15",dur:"25m",type:"strength",name:"Full Body Circuit",desc:"4 rounds: 12 pushups, 15 squats, 12 lunges/leg, 10 burpees, 30s plank. 90s rest."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 48 → SAT MAINTAIN — LONG RUCK TEST
  { label:"SAT", title:"MAINTAIN — LONG RUCK TEST", focus:"Longest Ruck", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"This is the weekly proof-of-work day. Same distance you hit on Day 27 — hold the standard."},
    {time:"5:00",dur:"10m",type:"warm",name:"Long Warmup",desc:"Full 2 rounds mobility."},
    {time:"5:10",dur:"70m",type:"cardio",name:"Long Ruck",desc:"5-6 km with 8-10 kg pack. Steady, no stopping unless necessary."},
    {time:"6:20",dur:"20m",type:"recovery",name:"Full Recovery Protocol",desc:"Deep stretch 15 min. Cold shower 90s. 5 min silence."},
  ]},
  // Day 49 → SUN REST + REVIEW
  { label:"SUN", title:"REST + REVIEW", focus:"Rest + Mindset", blocks:[
    {time:"5:25",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Rest, deliberately. Log the week's income + outreach numbers too — the body and the business both compound on consistency."},
    {time:"5:30",dur:"30m",type:"cardio",name:"Easy Walk",desc:"30 min easy walk. No structured training."},
    {time:"6:00",dur:"25m",type:"recovery",name:"Stretch + Weekly Review",desc:"Full body stretch 15 min. Review: training numbers, outreach numbers, income logged this week."},
  ]},
  // Day 50 → MON MAINTAIN — RUN + CIRCUIT
  { label:"MON", title:"MAINTAIN — RUN + CIRCUIT", focus:"Run + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"You're not chasing new PRs anymore — you're protecting what you built. Consistency, not intensity, wins from here."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Fasted Run",desc:"4 km steady pace. Same distance as Day 24-25 — hold it, don't chase further."},
    {time:"5:20",dur:"20m",type:"strength",name:"Army Circuit",desc:"4 rounds: 15 pushups, 20 squats, 45s plank, 12 burpees. 60s rest."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 51 → TUE MAINTAIN — WEIGHTED RUCK
  { label:"TUE", title:"MAINTAIN — WEIGHTED RUCK", focus:"Ruck + Core", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"The pack doesn't get lighter, you get more used to carrying it. That's the whole idea of toughness."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Weighted Ruck",desc:"4 km with 8-10 kg pack, steady pace."},
    {time:"5:25",dur:"15m",type:"strength",name:"Core Finisher",desc:"3 rounds: 25 crunches, 20 leg raises, 45s plank."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 52 → WED MAINTAIN — SPEED WORK
  { label:"WED", title:"MAINTAIN — SPEED WORK", focus:"Intervals + Upper", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Same distance, different demand today — push pace teaches a different kind of tough than grinding distance does."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Interval Run",desc:"6 x 400m hard, 90s walk recovery between. Total ~3km of work."},
    {time:"5:15",dur:"20m",type:"strength",name:"Upper Body Circuit",desc:"4 rounds: 12 pushups, 10 pike pushups, 15 inverted rows/towel rows, 30s plank."},
    {time:"5:35",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 53 → THU MAINTAIN — RUCK + MOBILITY
  { label:"THU", title:"MAINTAIN — RUCK + MOBILITY", focus:"Ruck + Mobility", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Lighter day. Recovery is part of the training, not a break from it — treat it with the same discipline."},
    {time:"4:35",dur:"10m",type:"warm",name:"Mobility Flow",desc:"Slow, deliberate full body mobility work — hips, shoulders, spine."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Easy Ruck",desc:"3 km with light pack (5 kg), easy pace."},
    {time:"5:20",dur:"20m",type:"recovery",name:"Deep Stretch",desc:"Full body static stretch, 60-90s holds per muscle group."},
  ]},
  // Day 54 → FRI MAINTAIN — FULL BODY + RUN
  { label:"FRI", title:"MAINTAIN — FULL BODY + RUN", focus:"Compound + Run", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Friday. Same standard as week one demanded, just heavier weight and faster pace now."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Fasted Run",desc:"3.5 km, moderate-hard pace."},
    {time:"5:15",dur:"25m",type:"strength",name:"Full Body Circuit",desc:"4 rounds: 12 pushups, 15 squats, 12 lunges/leg, 10 burpees, 30s plank. 90s rest."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 55 → SAT MAINTAIN — LONG RUCK TEST
  { label:"SAT", title:"MAINTAIN — LONG RUCK TEST", focus:"Longest Ruck", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"This is the weekly proof-of-work day. Same distance you hit on Day 27 — hold the standard."},
    {time:"5:00",dur:"10m",type:"warm",name:"Long Warmup",desc:"Full 2 rounds mobility."},
    {time:"5:10",dur:"70m",type:"cardio",name:"Long Ruck",desc:"5-6 km with 8-10 kg pack. Steady, no stopping unless necessary."},
    {time:"6:20",dur:"20m",type:"recovery",name:"Full Recovery Protocol",desc:"Deep stretch 15 min. Cold shower 90s. 5 min silence."},
  ]},
  // Day 56 → SUN REST + REVIEW
  { label:"SUN", title:"REST + REVIEW", focus:"Rest + Mindset", blocks:[
    {time:"5:25",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Rest, deliberately. Log the week's income + outreach numbers too — the body and the business both compound on consistency."},
    {time:"5:30",dur:"30m",type:"cardio",name:"Easy Walk",desc:"30 min easy walk. No structured training."},
    {time:"6:00",dur:"25m",type:"recovery",name:"Stretch + Weekly Review",desc:"Full body stretch 15 min. Review: training numbers, outreach numbers, income logged this week."},
  ]},
  // Day 57 → MON MAINTAIN — RUN + CIRCUIT
  { label:"MON", title:"MAINTAIN — RUN + CIRCUIT", focus:"Run + Army Circuit", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"You're not chasing new PRs anymore — you're protecting what you built. Consistency, not intensity, wins from here."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Fasted Run",desc:"4 km steady pace. Same distance as Day 24-25 — hold it, don't chase further."},
    {time:"5:20",dur:"20m",type:"strength",name:"Army Circuit",desc:"4 rounds: 15 pushups, 20 squats, 45s plank, 12 burpees. 60s rest."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 58 → TUE MAINTAIN — WEIGHTED RUCK
  { label:"TUE", title:"MAINTAIN — WEIGHTED RUCK", focus:"Ruck + Core", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"The pack doesn't get lighter, you get more used to carrying it. That's the whole idea of toughness."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"40m",type:"cardio",name:"Weighted Ruck",desc:"4 km with 8-10 kg pack, steady pace."},
    {time:"5:25",dur:"15m",type:"strength",name:"Core Finisher",desc:"3 rounds: 25 crunches, 20 leg raises, 45s plank."},
    {time:"5:40",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 59 → WED MAINTAIN — SPEED WORK
  { label:"WED", title:"MAINTAIN — SPEED WORK", focus:"Intervals + Upper", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Same distance, different demand today — push pace teaches a different kind of tough than grinding distance does."},
    {time:"4:35",dur:"10m",type:"warm",name:"Full Warmup",desc:"Dynamic mobility, 2 rounds."},
    {time:"4:45",dur:"30m",type:"cardio",name:"Interval Run",desc:"6 x 400m hard, 90s walk recovery between. Total ~3km of work."},
    {time:"5:15",dur:"20m",type:"strength",name:"Upper Body Circuit",desc:"4 rounds: 12 pushups, 10 pike pushups, 15 inverted rows/towel rows, 30s plank."},
    {time:"5:35",dur:"15m",type:"recovery",name:"Stretch + Cold Shower",desc:"Static stretch 10 min. Cold shower 60-90s."},
  ]},
  // Day 60 → THU MAINTAIN — RUCK + MOBILITY
  { label:"THU", title:"MAINTAIN — RUCK + MOBILITY", focus:"Ruck + Mobility", blocks:[
    {time:"4:30",dur:"5m",type:"mind",name:"Armor Your Mind",desc:"Lighter day. Recovery is part of the training, not a break from it — treat it with the same discipline."},
    {time:"4:35",dur:"10m",type:"warm",name:"Mobility Flow",desc:"Slow, deliberate full body mobility work — hips, shoulders, spine."},
    {time:"4:45",dur:"35m",type:"cardio",name:"Easy Ruck",desc:"3 km with light pack (5 kg), easy pace."},
    {time:"5:20",dur:"20m",type:"recovery",name:"Deep Stretch",desc:"Full body static stretch, 60-90s holds per muscle group."},
  ]},
];

// ─────────────────────────────────────────────────────────────────
// ALL 60 BOOTCAMP DAYS
// ─────────────────────────────────────────────────────────────────
const BOOTCAMP = [
  {num:1,week:1,title:"Python Foundations",subtitle:"Variables, functions, loops, dicts — the building blocks of every automation",difficulty:"easy",hours:10,
   concepts:["Variables & data types","Lists and dictionaries","Functions and arguments","For loops and conditionals","Reading/writing files","Virtual environments","pip package management"],
   exercises:["Write a script that reads a JSON file and prints each key-value pair","Build a function that takes a list of prices and returns total + average","Create a dict-based contact book with add/search/delete"],
   miniProject:"CLI Budget tracker: reads expenses from text file, categorizes, prints summary report",
   challenge:"Build the budget tracker WITHOUT any tutorial — only Python docs",
   outcome:"Comfortable writing Python scripts from scratch. Can manipulate dicts, lists, files without hesitation.",
   resources:[{name:"Automate the Boring Stuff Ch 1–3",url:"https://automatetheboringstuff.com/2e/chapter1/",tag:"FREE BOOK"},{name:"Python in 4 Hours — freeCodeCamp",url:"https://www.youtube.com/watch?v=rfscVS0vtbw",tag:"YOUTUBE"},{name:"Python Official Docs",url:"https://docs.python.org/3/tutorial/",tag:"DOCS"}]},
  {num:2,week:1,title:"APIs, HTTP & JSON",subtitle:"Every automation calls an API. Understand this completely and automation becomes trivial.",difficulty:"easy",hours:10,
   concepts:["What is an HTTP request?","GET vs POST vs PUT vs DELETE","Headers and auth","JSON structure and parsing","Status codes 200/400/401/500","Query parameters","Python requests library"],
   exercises:["Call JSONPlaceholder API and print all posts by user_id=1","Make a POST request to create a fake post and print response","Handle a 404 error gracefully"],
   miniProject:"Weather CLI: call OpenWeatherMap free API, accept city name, print temp, humidity, conditions",
   challenge:"Add a 5-day forecast feature with no tutorial help",
   outcome:"Can call any API, parse any JSON response, handle errors. The fundamental skill of all automation.",
   resources:[{name:"requests library docs",url:"https://requests.readthedocs.io/en/latest/",tag:"DOCS"},{name:"HTTP Crash Course — Traversy",url:"https://www.youtube.com/watch?v=iYM2zFP3Zn0",tag:"YOUTUBE"},{name:"JSONPlaceholder free test API",url:"https://jsonplaceholder.typicode.com/",tag:"PRACTICE"}]},
  {num:3,week:1,title:"Git, GitHub & Dev Workflow",subtitle:"Your portfolio, version control, safety net. Non-negotiable.",difficulty:"easy",hours:8,
   concepts:["git init, add, commit, push","Branches and merging",".gitignore and secrets","GitHub README best practices","GitHub Pages for portfolio","Pull requests workflow"],
   exercises:["Init a repo for this bootcamp, commit all Day 1–2 code","Create a .gitignore that excludes .env and __pycache__","Write a README for your weather CLI with screenshots"],
   miniProject:"Create your GitHub profile README: skills, current learning, projects built",
   challenge:"Set up a GitHub Action that auto-runs Python tests on every push",
   outcome:"Confident with daily Git workflow. GitHub profile shows active commits. Portfolio structure in place.",
   resources:[{name:"Git & GitHub Crash Course — freeCodeCamp",url:"https://www.youtube.com/watch?v=RGOj5yH7evk",tag:"YOUTUBE"},{name:"Oh My Git! — interactive game",url:"https://ohmygit.org/",tag:"GAME"},{name:"GitHub Skills",url:"https://skills.github.com/",tag:"INTERACTIVE"}]},
  {num:4,week:1,title:"OpenAI API — First AI Integration",subtitle:"Connect to GPT-4o. This is the moment automation becomes intelligent.",difficulty:"med",hours:10,
   concepts:["OpenAI API setup & auth","Chat completions endpoint","System vs user messages","Temperature and max_tokens","Prompt engineering basics","Streaming responses","Token counting and cost"],
   exercises:["Build a basic chat loop — user types, GPT responds","Experiment with 5 different system prompts, document differences","Implement streaming so responses appear word by word"],
   miniProject:"AI Journaling App: user writes about their day, AI gives structured reflection with 3 action items",
   challenge:"Add conversation memory — AI remembers the last 5 exchanges and references them",
   outcome:"Can integrate OpenAI into any Python script. Understands prompt engineering fundamentals. Cost-aware.",
   resources:[{name:"OpenAI API Docs — Quickstart",url:"https://platform.openai.com/docs/quickstart",tag:"DOCS"},{name:"OpenAI Cookbook",url:"https://github.com/openai/openai-cookbook",tag:"GITHUB"},{name:"Prompt Engineering Guide",url:"https://www.promptingguide.ai/",tag:"GUIDE"}]},
  {num:5,week:1,title:"Claude API & Prompt Engineering",subtitle:"Anthropic's Claude API — different strengths, different use cases. Know both.",difficulty:"med",hours:10,
   concepts:["Anthropic SDK setup","Claude's message format differences","System prompt architecture","Claude vs GPT-4o — when to use which","XML tags in prompts","Chain-of-thought prompting","Few-shot examples"],
   exercises:["Replicate Day 4's journaling app using Claude","Test same 5 prompts on Claude vs GPT — document quality differences","Build a prompt using XML tags to get structured JSON output"],
   miniProject:"AI Email Classifier: raw email → Claude categorizes (urgent/normal/spam) + extracts sender intent",
   challenge:"Make the classifier work with attachments — simulate with text summaries",
   outcome:"Dual-API fluency. Can select the right model for the right task. Advanced prompt engineering.",
   resources:[{name:"Anthropic API Docs",url:"https://docs.anthropic.com/en/api/getting-started",tag:"DOCS"},{name:"Anthropic Prompt Engineering Guide",url:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",tag:"DOCS"},{name:"Claude Cookbook",url:"https://github.com/anthropics/anthropic-cookbook",tag:"GITHUB"}]},
  {num:6,week:1,title:"n8n — Visual Automation Fundamentals",subtitle:"The most powerful open-source automation platform. Primary tool for client work.",difficulty:"med",hours:10,
   concepts:["n8n interface orientation","Trigger vs action nodes","HTTP Request node","JSON path expressions","$json syntax","Credentials management","Error handling nodes"],
   exercises:["Every hour, get BTC price, save to Google Sheet","Webhook workflow: POST JSON → n8n processes → returns transformed data","Error handling: HTTP fail → Telegram alert"],
   miniProject:"News Digest Bot: daily 8 AM → fetch top 5 tech news → AI summarize → post to Telegram",
   challenge:"Add sentiment filter: only include articles with sentiment score >0.7",
   outcome:"Comfortable building multi-node workflows. First real automation deployed.",
   resources:[{name:"n8n Official Docs",url:"https://docs.n8n.io/",tag:"DOCS"},{name:"n8n YouTube Channel",url:"https://www.youtube.com/@n8n-io",tag:"YOUTUBE"},{name:"n8n Community Forum",url:"https://community.n8n.io/",tag:"COMMUNITY"}]},
  {num:7,week:1,title:"Week 1 Checkpoint — AI Email Responder",subtitle:"Consolidate Days 1–6 into one production-quality project",difficulty:"hard",hours:10,
   concepts:["Full-stack automation thinking","Gmail API integration","Webhook architecture","AI response generation","Rate limiting","Logging basics"],
   exercises:["Read unread emails via Gmail API in Python","Parse sender, subject, body from raw email","Generate AI response based on email content"],
   miniProject:"CAPSTONE: AI Email Responder — reads Gmail, classifies, drafts AI response, saves draft (does NOT auto-send)",
   challenge:"Add learning: log email→response pairs. After 10 pairs, analyze what gets the best responses.",
   outcome:"Week 1 complete. Portfolio project #1 live on GitHub with README and demo video.",
   resources:[{name:"Gmail API Python Quickstart",url:"https://developers.google.com/gmail/api/quickstart/python",tag:"DOCS"},{name:"n8n Gmail Integration",url:"https://docs.n8n.io/integrations/built-in/core-nodes/n8n-nodes-base.gmail/",tag:"DOCS"}]},
  {num:8,week:2,title:"n8n Advanced — Loops, Branching, Errors",subtitle:"Production-grade n8n workflows require mastery of control flow",difficulty:"med",hours:10,
   concepts:["Split in Batches node","IF/Switch nodes","Merge node strategies","Loop over Items","Error workflow config","Retry logic","Sub-workflows"],
   exercises:["Process 100 contacts — loop, call AI for each, save results","IF/Switch: urgent → Slack; invoice → Sheet","Retry: API fail → wait 60s → try 3 times → alert"],
   miniProject:"Batch Lead Processor: CSV of 50 leads → AI enrich → score 1–10 → route to different sheets by score",
   challenge:"Handle duplicates and already-processed leads gracefully",
   outcome:"Can build complex branching workflows. Production thinking: error handling, retries, edge cases.",
   resources:[{name:"n8n Advanced Workflows",url:"https://docs.n8n.io/flow-logic/",tag:"DOCS"},{name:"n8n Error Handling",url:"https://docs.n8n.io/flow-logic/error-handling/",tag:"DOCS"}]},
  {num:9,week:2,title:"Make.com — Visual Automation Mastery",subtitle:"The other major platform. Clients use it. You must know it.",difficulty:"med",hours:9,
   concepts:["Make.com scenarios vs n8n workflows","Routers and filters","Aggregators and iterators","Make.com HTTP module","Scheduling in Make","Webhooks in Make","Make vs n8n decision matrix"],
   exercises:["Rebuild Day 6's News Digest in Make.com","Webhook scenario: POST → AI content → email response","Google Forms → Make → OpenAI → Email reply"],
   miniProject:"AI Form Responder: Google Form → Make → AI personalized response → sends email",
   challenge:"If respondent is business owner, send premium response with consultation offer",
   outcome:"Dual-platform proficiency. Can work in whatever tool the client prefers.",
   resources:[{name:"Make Academy",url:"https://www.make.com/en/academy",tag:"OFFICIAL"},{name:"Make.com Help Center",url:"https://www.make.com/en/help",tag:"DOCS"}]},
  {num:10,week:2,title:"Supabase & PostgreSQL — Automation Database",subtitle:"Automations need memory. Supabase gives you a free Postgres database with instant APIs.",difficulty:"med",hours:10,
   concepts:["Supabase project setup","SQL: SELECT, INSERT, UPDATE, WHERE","Supabase Python client","Row Level Security basics","Real-time subscriptions","Storing automation state","Querying automation logs"],
   exercises:["Create 'leads' table, insert 10 records via Python","Query leads by status='new', update to 'contacted'","Log every AI API call: timestamp, model, tokens, cost"],
   miniProject:"Automation Logging System: every n8n run writes metadata to Supabase. Build a simple dashboard query.",
   challenge:"Query: avg cost per automation, most expensive workflow, total spend today",
   outcome:"Can persist data across automation runs. Understands SQL for practical use cases.",
   resources:[{name:"Supabase Docs",url:"https://supabase.com/docs/guides/getting-started",tag:"DOCS"},{name:"SQL for Beginners — freeCodeCamp",url:"https://www.youtube.com/watch?v=HXV3zeQKqGY",tag:"YOUTUBE"}]},
  {num:11,week:2,title:"LangChain — AI Orchestration Framework",subtitle:"LangChain makes building complex AI pipelines systematic instead of ad hoc",difficulty:"hard",hours:10,
   concepts:["LangChain mental model","Chains: LLMChain, SequentialChain","Prompt templates","Output parsers","LangChain with memory","LCEL","Debugging LangChain"],
   exercises:["Chain: prompt template → GPT-4o → output parser → structured dict","Sequential: analyze email → extract actions → draft response → review","Add ConversationBufferMemory to a chat chain"],
   miniProject:"AI Writing Pipeline: rough notes → expand into draft → edit for tone → suggest title",
   challenge:"Make each chain step interruptible — user can edit output before passing to next chain",
   outcome:"Can build sophisticated AI pipelines. LangChain feels like organized code, not magic.",
   resources:[{name:"LangChain Python Docs",url:"https://python.langchain.com/docs/introduction/",tag:"DOCS"},{name:"LangChain Crash Course — Greg Kamradt",url:"https://www.youtube.com/watch?v=_v_fgW2SkkQ",tag:"YOUTUBE"}]},
  {num:12,week:2,title:"RAG Systems — Teaching AI Your Data",subtitle:"RAG is the foundation of every custom AI chatbot.",difficulty:"hard",hours:10,
   concepts:["What is RAG and why it exists","Embeddings and vector similarity","Chunking strategies","ChromaDB (local) vs Pinecone (cloud)","Retrieval strategies","Prompt construction with context","Evaluating RAG quality"],
   exercises:["Embed 20 pages of PDF content, query with 5 questions","Compare k=3 vs k=10 retrieval — which gives better answers?","Test chunk sizes: 500 vs 1000 vs 2000 chars"],
   miniProject:"Company FAQ Bot: load 10 FAQ pages → embed → chat interface where AI answers only from FAQ data",
   challenge:"Add 'I don't know' mechanism: if retrieved context below 0.7 similarity, AI says so",
   outcome:"Can build RAG systems from scratch. Understands embeddings intuitively. Ready for production chatbots.",
   resources:[{name:"LangChain RAG Tutorial",url:"https://python.langchain.com/docs/tutorials/rag/",tag:"DOCS"},{name:"RAG from Scratch — Lance Martin",url:"https://www.youtube.com/watch?v=wd7TZ4w1mSw",tag:"YOUTUBE"},{name:"ChromaDB Docs",url:"https://docs.trychroma.com/",tag:"DOCS"}]},
  {num:13,week:2,title:"Telegram & WhatsApp Bots",subtitle:"Most-requested automation deliverable from clients. Master both.",difficulty:"med",hours:10,
   concepts:["Telegram Bot API + python-telegram-bot","Commands and messages","Inline keyboards and callbacks","WhatsApp Business API (Twilio/Meta)","Webhook vs polling","Conversation state","Rate limiting bots"],
   exercises:["Bot responding to /start, /help commands","Add /ask command → Claude API → returns answer","Conversation state: bot remembers last 5 messages per user"],
   miniProject:"AI Customer Support Bot (Telegram): FAQ via RAG, answers customers, escalates unknowns to human group",
   challenge:"User identification — bot tracks returning users, personalizes greeting",
   outcome:"Can deliver Telegram/WhatsApp AI bots. This alone is a $300–800 service.",
   resources:[{name:"python-telegram-bot Docs",url:"https://python-telegram-bot.readthedocs.io/en/stable/",tag:"DOCS"},{name:"Twilio WhatsApp Quickstart",url:"https://www.twilio.com/docs/whatsapp/quickstart/python",tag:"DOCS"}]},
  {num:14,week:2,title:"Week 2 Checkpoint — Web Scraping Pipeline",subtitle:"Scraping + AI processing = lead gen, market research, competitive intel",difficulty:"hard",hours:10,
   concepts:["BeautifulSoup for static pages","Playwright for dynamic pages","Respect robots.txt","Rate limiting scrapers","Storing scraped data","AI processing of scraped content","Anti-scraping countermeasures"],
   exercises:["Scrape HN top 10 posts + comments, store in Supabase","Playwright scrape a JS-rendered job board","AI-process job listings: extract company, salary, skills"],
   miniProject:"Competitor Intelligence System: scrape 5 competitor sites weekly → AI summarizes changes → Telegram alert",
   challenge:"Change detection: only alert if content changed >20% from last week",
   outcome:"Week 2 complete. Can build end-to-end data pipelines. RAG chatbot and scraping in portfolio.",
   resources:[{name:"Playwright Python Docs",url:"https://playwright.dev/python/docs/intro",tag:"DOCS"},{name:"BeautifulSoup Docs",url:"https://www.crummy.com/software/BeautifulSoup/bs4/doc/",tag:"DOCS"}]},
  {num:15,week:3,title:"AI Agents — Tools, Reasoning & Autonomy",subtitle:"Agents are AI systems that use tools, make decisions, and complete multi-step tasks.",difficulty:"hard",hours:10,
   concepts:["Agent vs Chain vs LLM call","Tool calling / function calling","ReAct pattern (Reason + Act)","LangGraph for control flow","Tool design best practices","Agent memory types","Stopping conditions"],
   exercises:["Research agent with 3 tools: web_search, read_page, summarize","Calendar booking agent: check_calendar, create_event, send_confirmation","Agent with stopping condition: stops after 5 tool calls or finding the answer"],
   miniProject:"AI Research Agent: given a topic, searches web, reads top 5 pages, synthesizes structured report with citations",
   challenge:"Add confidence score to each fact — agent flags uncertain information",
   outcome:"Can build autonomous AI agents. This is the premium tier — $3000+ projects.",
   resources:[{name:"LangGraph Docs",url:"https://langchain-ai.github.io/langgraph/",tag:"DOCS"},{name:"LangGraph Agent Tutorial",url:"https://python.langchain.com/docs/tutorials/agents/",tag:"DOCS"},{name:"OpenAI Function Calling",url:"https://platform.openai.com/docs/guides/function-calling",tag:"DOCS"}]},
  {num:16,week:3,title:"MCP Architecture — Production Agent Infrastructure",subtitle:"Model Context Protocol is how production agents connect to external systems reliably.",difficulty:"hard",hours:9,
   concepts:["What is MCP and why it matters","MCP servers vs tools vs resources","Building a custom MCP server","MCP client integration","Security in MCP","Claude + MCP patterns"],
   exercises:["Set up local MCP server exposing 'search_database' tool","Connect Claude to your MCP server, test tool calling","Build MCP tool that reads from Supabase"],
   miniProject:"Custom MCP Server: expose your Supabase leads DB via MCP so Claude can query, filter, update leads",
   challenge:"Add MCP resource subscriptions — Claude gets notified when new leads are added",
   outcome:"Understands production agent infrastructure. Can sell this as enterprise-grade differentiator.",
   resources:[{name:"Anthropic MCP Docs",url:"https://modelcontextprotocol.io/introduction",tag:"DOCS"},{name:"MCP Python SDK",url:"https://github.com/modelcontextprotocol/python-sdk",tag:"GITHUB"},{name:"MCP Server Examples",url:"https://github.com/modelcontextprotocol/servers",tag:"GITHUB"}]},
  {num:17,week:3,title:"Document AI & OCR Automation",subtitle:"Businesses swim in PDFs, invoices, contracts. AI that reads documents is extremely sellable.",difficulty:"med",hours:10,
   concepts:["PDF extraction with PyMuPDF","OCR with Tesseract + pytesseract","Document AI with Claude Vision","Invoice parsing patterns","Contract analysis","Table extraction","Document classification"],
   exercises:["Extract all text from a 10-page PDF, store by page","OCR a scanned invoice: extract vendor, amount, date, line items","Classify 20 documents into categories using Claude Vision"],
   miniProject:"Invoice Processor: upload PDF → AI extracts all fields → saves to Supabase → sends Slack summary",
   challenge:"Handle multi-currency invoices, convert all amounts to INR via real-time exchange rate",
   outcome:"Can sell document automation to accountants, lawyers, logistics companies. High-value niche.",
   resources:[{name:"PyMuPDF Docs",url:"https://pymupdf.readthedocs.io/en/latest/",tag:"DOCS"},{name:"Claude Vision + Documents",url:"https://docs.anthropic.com/en/docs/build-with-claude/vision",tag:"DOCS"}]},
  {num:18,week:3,title:"CRM Automation — HubSpot & Airtable",subtitle:"The lifeblood of B2B sales automation. Every business needs this.",difficulty:"med",hours:10,
   concepts:["HubSpot API — contacts, deals, activities","Airtable API — bases, tables, records","Lead scoring logic","Automated follow-up sequences","CRM data enrichment","Pipeline stage automation","Zapier-like integration patterns"],
   exercises:["Create, read, update HubSpot contacts via API","Automated deal stage progression based on conditions","Enrich contacts: LinkedIn profile, company size via Clearbit"],
   miniProject:"Lead Nurture Machine: new HubSpot lead → AI writes personalized intro email → schedules 3 follow-ups → scores lead → moves pipeline stage",
   challenge:"A/B testing: 50% get template A, 50% get B. Track open rates after 7 days.",
   outcome:"Can build and sell CRM automation. Most commonly requested freelance service.",
   resources:[{name:"HubSpot API Docs",url:"https://developers.hubspot.com/docs/api/overview",tag:"DOCS"},{name:"Airtable API Reference",url:"https://airtable.com/developers/web/api/introduction",tag:"DOCS"}]},
  {num:19,week:3,title:"Voice AI — Whisper, ElevenLabs & Voice Workflows",subtitle:"Voice is the next frontier. AI that can hear and speak opens entirely new automation categories.",difficulty:"hard",hours:9,
   concepts:["OpenAI Whisper for speech-to-text","ElevenLabs for text-to-speech","Voice workflow architecture","Real-time vs batch voice processing","Voice bot design patterns","VAPI for voice agents"],
   exercises:["Transcribe a 5-min audio file using Whisper","Generate speech from text with 3 different ElevenLabs voices","Pipeline: Record audio → Whisper → AI summary → email summary"],
   miniProject:"Meeting Recorder: record meeting → Whisper transcribes → Claude extracts action items → emails report to all attendees",
   challenge:"Add speaker diarization — identify different speakers in the transcript",
   outcome:"Can build voice AI workflows. Rare skill that commands premium rates.",
   resources:[{name:"OpenAI Whisper Docs",url:"https://platform.openai.com/docs/guides/speech-to-text",tag:"DOCS"},{name:"ElevenLabs API Docs",url:"https://elevenlabs.io/docs/api-reference/getting-started",tag:"DOCS"},{name:"VAPI Voice AI",url:"https://docs.vapi.ai/",tag:"DOCS"}]},
  {num:20,week:3,title:"Docker & Cloud Deployment",subtitle:"Automations that only run on your laptop aren't deliverables. Learn to deploy.",difficulty:"hard",hours:10,
   concepts:["Docker: images, containers, volumes","Writing Dockerfiles","docker-compose for multi-service apps","Railway and Render deployment","Environment variables in production","Monitoring with logs","Health checks"],
   exercises:["Dockerize your Telegram bot from Day 13","docker-compose with bot + Postgres database","Deploy to Railway and verify 24/7 operation"],
   miniProject:"Deploy AI Customer Support Bot (Day 13) to Railway — running 24/7 for real users",
   challenge:"Health check endpoint — bot responds to /health with uptime and last message processed",
   outcome:"Can deliver production-deployed automations. This doubles your rates.",
   resources:[{name:"Docker Official Getting Started",url:"https://docs.docker.com/get-started/",tag:"DOCS"},{name:"Docker Crash Course — TechWorld with Nana",url:"https://www.youtube.com/watch?v=3c-iBn73dDE",tag:"YOUTUBE"},{name:"Railway Deployment Guide",url:"https://docs.railway.app/guides/deployments",tag:"DOCS"}]},
  {num:21,week:3,title:"Week 3 Checkpoint — Multi-Agent Research System",subtitle:"Combine everything from Week 3 into one ambitious system",difficulty:"hard",hours:10,
   concepts:["Multi-agent orchestration","Agent communication patterns","Task delegation","Result aggregation","Production deployment"],
   exercises:["Build 3-agent system: Researcher → Writer → Editor","Agent communication via shared Supabase state","Deploy full system to Railway"],
   miniProject:"AI Content Factory: topic → Researcher finds facts → Writer creates article → Editor polishes → auto-publishes to Ghost/WordPress",
   challenge:"Quality Gate agent that rejects content below threshold and sends back for revision",
   outcome:"Week 3 complete. Multi-agent system in portfolio. 3 projects now deployed.",
   resources:[{name:"CrewAI Docs",url:"https://docs.crewai.com/",tag:"DOCS"},{name:"AutoGen Multi-Agent",url:"https://microsoft.github.io/autogen/",tag:"DOCS"}]},
  {num:22,week:4,title:"SaaS Thinking — From Freelance to Product",subtitle:"Automation engineers who think in products earn 10x those who just deliver workflows",difficulty:"med",hours:9,
   concepts:["Productizing a service","SaaS vs one-time projects","Subscription workflow architecture","Multi-tenant automation design","White-labeling automations","Pricing for recurring revenue","Building an API layer"],
   exercises:["Take Day 18 lead nurture machine — design as multi-tenant SaaS","Define pricing: per seat? per lead? per workflow run?","Design onboarding: how does a new customer connect their HubSpot?"],
   miniProject:"SaaS Blueprint: full product spec for 'LeadFlow' — AI-powered lead nurture as subscription service",
   challenge:"Create a landing page for LeadFlow you could actually use to get beta users",
   outcome:"Thinks in products, not just tasks. Can identify which automations to build as products.",
   resources:[{name:"Productize & Scale Summary",url:"https://www.youtube.com/watch?v=iEFzmBBFBis",tag:"YOUTUBE"},{name:"Indie Hackers — SaaS ideas",url:"https://www.indiehackers.com/",tag:"COMMUNITY"}]},
  {num:23,week:4,title:"Auth, Security & API Reliability",subtitle:"The things that separate junior from senior automation engineers",difficulty:"hard",hours:9,
   concepts:["OAuth 2.0 flow","JWT tokens","API key rotation","Webhook signature verification","Rate limiting and backoff","Circuit breakers","Secret management"],
   exercises:["Implement Slack webhook signature verification in Python","Exponential backoff: 1s, 2s, 4s, 8s retry on failures","Circuit breaker: 5 failures in 60s → stop calling + alert"],
   miniProject:"Harden Day 20 deployment: add JWT auth, webhook signing, rate limiting",
   challenge:"Security audit: attempt to break your own system. Document 3 vulnerabilities and fix them.",
   outcome:"Production-grade security thinking. Can handle client data and enterprise requirements.",
   resources:[{name:"OAuth 2.0 Simplified",url:"https://www.oauth.com/",tag:"GUIDE"},{name:"Webhook Security Best Practices",url:"https://webhooks.fyi/security/signing-requests",tag:"GUIDE"}]},
  {num:24,week:4,title:"Monitoring, Logging & Debugging",subtitle:"Automations break at 3 AM. Build systems that tell you before clients do.",difficulty:"med",hours:9,
   concepts:["Structured logging with Python logging","Log levels: DEBUG/INFO/WARNING/ERROR","Betterstack or UptimeRobot monitoring","Alerting via Telegram/Slack","Debugging n8n workflows","Error aggregation","Status dashboard"],
   exercises:["Add structured JSON logging to Day 20 bot","Set up UptimeRobot for all deployed services","Daily digest: all errors from past 24h → Telegram summary"],
   miniProject:"Operations Dashboard: Supabase table of automation runs + errors + costs → HTML dashboard showing system health",
   challenge:"Anomaly detection: if error rate spikes >10% in 1 hour, send immediate alert",
   outcome:"Can build and maintain production systems. Clients pay for reliability, not just functionality.",
   resources:[{name:"Python Logging HOWTO",url:"https://docs.python.org/3/howto/logging.html",tag:"DOCS"},{name:"Betterstack Logging",url:"https://betterstack.com/logs",tag:"TOOL"}]},
  {num:25,week:4,title:"Upwork Profile & Portfolio Launch",subtitle:"All skills, no visibility = no income. Fix this today.",difficulty:"med",hours:8,
   concepts:["Upwork algorithm factors","Proposal writing science","Portfolio presentation","Video demo creation","Profile optimization","Niche positioning"],
   exercises:["Complete 100% of Upwork profile","Write 3 different bio versions — test which gets more profile views","Record Loom demos for your top 3 projects"],
   miniProject:"Portfolio Website: clean single-page — About, Projects (3 with demos), Services, Contact. Host on Vercel.",
   challenge:"Send your first 5 Upwork proposals before end of day. Track response rate.",
   outcome:"Professional online presence. First proposals sent. Income machine switched on.",
   resources:[{name:"Upwork Success Guide",url:"https://support.upwork.com/hc/en-us/categories/200188108",tag:"GUIDE"},{name:"How to Win on Upwork",url:"https://www.youtube.com/watch?v=KD5L5S0G9_o",tag:"YOUTUBE"}]},
  {num:26,week:4,title:"Client Acquisition Machine",subtitle:"Build systematic outreach so client acquisition becomes automatic",difficulty:"med",hours:9,
   concepts:["ICP (Ideal Client Profile)","Lead finding: Apollo, LinkedIn","Cold email sequence design","DM outreach frameworks","Follow-up cadence","Objection handling","Closing techniques"],
   exercises:["Define ICP: industry, company size, revenue range, pain points","Build list of 50 target prospects via LinkedIn free search","Write 5 personalized outreach messages — no template feel"],
   miniProject:"Outreach Automation: n8n workflow → finds prospects → researches via AI → generates personalized intro → saves to Airtable outreach tracker",
   challenge:"Automate your own outreach tracking: after 3 days, auto-follow-up if no response",
   outcome:"Systematic client acquisition. Not dependent on job boards.",
   resources:[{name:"Alex Hormozi Offer Creation",url:"https://www.youtube.com/watch?v=vINoNEmolqs",tag:"YOUTUBE"},{name:"Cold Email Mastery — Jason Bay",url:"https://www.blissfulprospecting.com/",tag:"BLOG"}]},
  {num:27,week:4,title:"Zapier — The Client's Tool",subtitle:"Many existing clients use Zapier. You need to speak their language.",difficulty:"easy",hours:7,
   concepts:["Zapier vs n8n vs Make — honest comparison","Zapier Zap anatomy","Paths in Zapier","Zapier Tables","Zapier AI actions","When to migrate clients from Zapier"],
   exercises:["Rebuild Day 6's News Digest in Zapier","Identify where Zapier falls short vs n8n","Write a 1-page 'Which tool' guide for clients"],
   miniProject:"Migration Blueprint: document how to migrate a client from Zapier to n8n with cost savings calculation",
   challenge:"Build a Zapier zap triggered by new Supabase row insertion (via webhooks)",
   outcome:"Can advise clients on tool selection. Can work in any automation ecosystem.",
   resources:[{name:"Zapier Learn",url:"https://zapier.com/learn",tag:"OFFICIAL"},{name:"Zapier Help Center",url:"https://help.zapier.com/hc/en-us",tag:"DOCS"}]},
  {num:28,week:4,title:"Capstone — Day 1 of Build",subtitle:"The full-stack AI automation system that becomes your hero portfolio piece",difficulty:"hard",hours:10,
   concepts:["Full system architecture","End-to-end workflow design","Multi-service integration","Production deployment planning"],
   exercises:["Draw full system architecture diagram (Excalidraw)","Set up all required services and credentials","Build the data layer (Supabase schema)"],
   miniProject:"START: AI Sales Automation System — Lead capture → enrichment → AI scoring → personalized outreach → follow-up → CRM updates → Telegram dashboard",
   challenge:"Architecture review: have Claude critique your architecture. Implement at least 3 suggested improvements.",
   outcome:"Capstone 30% complete. Foundation solid.",
   resources:[{name:"Excalidraw",url:"https://excalidraw.com/",tag:"TOOL"}]},
  {num:29,week:4,title:"Capstone — Day 2 of Build",subtitle:"Build the core integration and AI layers",difficulty:"hard",hours:10,
   concepts:["Integration debugging","State management across services","AI pipeline optimization"],
   exercises:["Build the AI enrichment and scoring pipeline","Connect all services end-to-end","Test with 10 real leads (public business directories)"],
   miniProject:"CONTINUE: webhook receiver → Supabase storage → AI enrichment → score → HubSpot/Airtable CRM update",
   challenge:"Stress test: send 50 simultaneous leads. Fix any bottlenecks.",
   outcome:"Capstone 75% complete. Core system functional.",
   resources:[]},
  {num:30,week:4,title:"Capstone Complete + Career Launch",subtitle:"Final polish, deployment, documentation, and your first client proposal",difficulty:"hard",hours:10,
   concepts:["Production deployment","Documentation writing","Video demo creation","Proposal writing from real work"],
   exercises:["Deploy capstone to Railway with monitoring","Record 3-min Loom demo of the full system","Write case study: Problem → Solution → Architecture → Results"],
   miniProject:"COMPLETE: Full deployment + GitHub README with architecture diagram + Loom demo + written case study",
   challenge:"Send a cold proposal to 3 real businesses in your chosen niche, attaching the Loom demo. This is the final test.",
   outcome:"30-day bootcamp complete. Production system live. Portfolio ready. First proposals sent. CAREER LAUNCHED.",
   resources:[{name:"Excalidraw",url:"https://excalidraw.com/",tag:"TOOL"},{name:"Loom",url:"https://www.loom.com/",tag:"TOOL"}]},
  {num:31,week:5,title:"Pick Your Niche — Stop Being a Generalist",subtitle:"Generalists get ignored. 'I fix X for Y industry' gets replies.",difficulty:"med",hours:5,
   concepts:["Why niching down gets more replies, not fewer","Picking a niche from your 3 capstone projects","Writing a one-line positioning statement"],
   exercises:["List every business type you know something about (family, friends, past jobs)","Cross-reference with your Week 1-4 projects: which niche fits which project best","Write your positioning statement: 'I build [X] for [Y] so they can [Z]'"],
   miniProject:"Finalize your niche + positioning statement — this becomes your profile headline.",
   challenge:"Find 5 real businesses in that niche in Delhi/NCR you could realistically cold-message.",
   outcome:"A specific, sellable niche instead of 'I do AI automation.' This alone doubles reply rates.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:32,week:5,title:"Rebuild Your Portfolio Around One Story",subtitle:"One sharp case study beats five vague ones.",difficulty:"med",hours:5,
   concepts:["Case study structure: problem → solution → result","Screenshots vs live demo vs Loom walkthrough","Framing hours saved / money saved in numbers"],
   exercises:["Pick your strongest capstone project","Write it up as: the business problem it solves, how it works, what it saves","Record a 2-minute Loom screen recording walking through it live"],
   miniProject:"One polished case study page (can be a simple Notion page or GitHub README) with the Loom embedded.",
   challenge:"Ask 2 people (friend/family) to read it cold and tell you what's unclear.",
   outcome:"A case study you can paste into any proposal or DM instantly.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:33,week:5,title:"Set Up Your Upwork Profile Properly",subtitle:"Most profiles are invisible. Fix the 3 things that actually matter.",difficulty:"med",hours:5,
   concepts:["Profile title formula that matches search terms","Portfolio section — case study goes here","Setting your rate: undercut early, raise later"],
   exercises:["Rewrite your Upwork title using your niche + keyword","Upload your case study as a portfolio piece","Set an intro rate 20-30% below market to win first reviews"],
   miniProject:"Fully live, niche-specific Upwork profile.",
   challenge:"Apply to 3 relevant jobs today, even before the profile feels 'ready.'",
   outcome:"A profile that shows up in the right searches instead of sitting empty.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:34,week:5,title:"Set Up Fiverr as a Second Channel",subtitle:"Fiverr buyers come to you — different game than Upwork.",difficulty:"med",hours:5,
   concepts:["Gig title + tags for search visibility","Packages: Basic / Standard / Premium pricing","Gig video — 30-60 seconds, screen + voice"],
   exercises:["Create 1 gig around your niche (e.g. 'I will build an n8n automation for your Delhi retail business')","Set 3 tiered packages","Record a short gig video, even on your phone"],
   miniProject:"One live Fiverr gig with packages and a video.",
   challenge:"Write 3 gig variations and pick the one with the clearest, most specific offer.",
   outcome:"A second inbound channel running in parallel with outbound Upwork work.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:35,week:5,title:"Cold Outreach Templates — Write Once, Reuse Daily",subtitle:"Winging every message burns time and gets ignored. Templates fixed to a formula work.",difficulty:"med",hours:5,
   concepts:["Cold DM formula: specific observation → relevant capability → soft ask","Why generic 'I can help you' gets deleted","Personalization tokens: 1 real detail per message"],
   exercises:["Write 3 DM templates: LinkedIn, email, Upwork proposal","Each must reference something specific about the business, not just 'I saw your profile'","Test each template on yourself — would you reply to this?"],
   miniProject:"3 reusable outreach templates saved in a doc/notes app.",
   challenge:"Send your first 5 real messages today using them — no more polishing, just send.",
   outcome:"A repeatable outreach system instead of writing from scratch every time.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:36,week:5,title:"Build a Target List of 50",subtitle:"You can't run outreach volume without a list. Build it once, use it all week 6.",difficulty:"med",hours:5,
   concepts:["Where to find leads: LinkedIn search, Google Maps, Upwork job posts, local FB groups","Qualifying a lead: do they plausibly need this, can they plausibly pay","Tracking sheet basics: name, contact, status, follow-up date"],
   exercises:["Build a simple sheet: 50 rows — business name, contact info, niche fit, notes","Source 20 from LinkedIn, 20 from Google Maps, 10 from Upwork job posts","Mark each as hot/warm/cold based on fit"],
   miniProject:"A 50-lead tracking sheet, ready to work through in Week 6.",
   challenge:"Find 5 leads that are 'hot' — you know a real, specific problem they have.",
   outcome:"No more scrambling for who to message — the list is already built.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:37,week:5,title:"Week 5 Review — Rest + Reset",subtitle:"Portfolio and profiles are live. Tomorrow the outreach grind starts for real.",difficulty:"med",hours:3,
   concepts:["What's actually live vs what's still 'almost done'","Realistic expectations for Week 6 — most replies come after 15-20 messages, not 2"],
   exercises:["Confirm: Upwork profile live? Fiverr gig live? Case study ready? Templates ready? List built?","Fix whatever's not actually live yet — don't carry unfinished setup into outreach week","Rest. Tomorrow starts the volume phase."],
   miniProject:"A fully 'go-live' checklist, everything checked off.",
   challenge:"Write down your Week 6 daily outreach quota (recommend: 8-10 messages/day) and commit to it.",
   outcome:"Clean foundation. Nothing left half-set-up to distract you during outreach week.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:38,week:6,title:"Outreach Day 1 — Send 10, No Excuses",subtitle:"The list and templates exist. Today the only job is volume.",difficulty:"med",hours:5,
   concepts:["Why day 1 replies are usually zero — that's normal, not a signal to stop","Tracking sends and opens, not just replies"],
   exercises:["Send 10 personalized messages from your list (mix of LinkedIn, email, Upwork proposals)","Log every send in your tracking sheet with date","Apply to 2 fresh Upwork job posts"],
   miniProject:"10 messages sent, logged.",
   challenge:"Personalize every single one — zero copy-paste with no edits.",
   outcome:"Momentum. The scariest part (the first send) is done.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:39,week:6,title:"Outreach Day 2 — Refine From Yesterday",subtitle:"Look at what got opened, what didn't. Adjust before sending more.",difficulty:"med",hours:5,
   concepts:["Reading signals: opened-no-reply vs no-open vs reply","When to follow up vs when to move on"],
   exercises:["Review yesterday's 10 sends — any replies or opens?","Send 10 more, tweak subject lines/openers based on what you noticed","Follow up politely on 1 message from 3+ days ago if any"],
   miniProject:"10 more sent, templates refined once.",
   challenge:"Get one message under 80 words — brutal editing.",
   outcome:"A slightly sharper outreach message than yesterday's.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:40,week:6,title:"Outreach Day 3 — Local + Warm Network",subtitle:"Cold isn't the only channel. People who already know you convert faster.",difficulty:"med",hours:5,
   concepts:["Warm outreach: friends, family, past classmates who run or know businesses","Asking for referrals, not just direct work"],
   exercises:["Message 5 people you already know: 'I'm building AI automations for businesses — know anyone who might need one?'","Send 5 more cold messages from your list","Post one build-in-public update on LinkedIn (what you built, 2-3 lines)"],
   miniProject:"5 warm asks + 5 cold sends + 1 public post.",
   challenge:"Ask at least 2 people directly for an introduction, not just awareness.",
   outcome:"Warm leads often convert 3-5x better than cold — don't skip this channel.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:41,week:6,title:"Outreach Day 4 — Handle Replies Properly",subtitle:"A reply is not a client. How you respond in the next 10 minutes matters.",difficulty:"med",hours:5,
   concepts:["Response formula: thank them, ask 1 clarifying question, propose a quick call","Not overselling in the first reply"],
   exercises:["Respond to any replies within an hour, using the formula","Send 8 more fresh messages","If someone says 'send more info' — send your case study link, not a wall of text"],
   miniProject:"Fast, clean responses to every reply that comes in.",
   challenge:"Get one reply to agree to a 15-minute call.",
   outcome:"Replies converted into actual conversations, not left hanging.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:42,week:6,title:"Outreach Day 5 — First Calls / Scoping",subtitle:"If a call happens, this is where you find out if it's real money or not.",difficulty:"med",hours:5,
   concepts:["Discovery call structure: their problem, their current process, budget signal","Never quote a price on the call — 'I'll send a proposal by tomorrow'"],
   exercises:["Take any scheduled calls — ask more than you talk","Send 6 more fresh outreach messages regardless","Draft a proposal for anyone who had a real call"],
   miniProject:"At least one real discovery conversation had, proposal drafted if applicable.",
   challenge:"Ask directly: 'What's your budget range for something like this?' — don't dodge it.",
   outcome:"A qualified lead in the pipeline, or clear proof you need more volume.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:43,week:6,title:"Outreach Day 6 — Push Through the Silence",subtitle:"This is the day motivation dips because replies are still thin. Send anyway.",difficulty:"med",hours:5,
   concepts:["Normal reply rates for cold outreach: 5-15%","Why day 6 of a grind is when most people quit — right before it turns"],
   exercises:["Send 10 more messages, no matter how yesterday felt","Follow up on anyone from Day 1-2 who hasn't replied","Update your tracking sheet — total sent this week, total replies"],
   miniProject:"Full week tally in the tracking sheet.",
   challenge:"Hit 50+ total outreach messages for the week.",
   outcome:"Proof, in numbers, that you did the volume — regardless of how it feels.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:44,week:6,title:"Week 6 Review — Rest + Numbers",subtitle:"Look at the real numbers, not the feeling. Decide next week's move.",difficulty:"med",hours:3,
   concepts:["Reviewing: sent, opened, replied, calls booked, proposals sent","What a realistic Week 7 looks like based on this data"],
   exercises:["Total up the week's numbers honestly","If reply rate is low (<5%), revisit your templates and niche fit before Week 7","If you have even 1 warm proposal out, Week 7 focuses on closing it"],
   miniProject:"A one-page summary: total sent, replies, calls, proposals out.",
   challenge:"Identify the single biggest bottleneck (volume, messaging, or niche) and name it honestly.",
   outcome:"Rest today. Week 7 is about closing, not just sending.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:45,week:7,title:"Turn a Warm Lead Into a Proposal",subtitle:"If Week 6 produced any real interest, today it becomes a written offer.",difficulty:"med",hours:5,
   concepts:["Proposal structure: problem, solution, timeline, price, one strong guarantee"],
   exercises:["Write a formal proposal for your best lead: scope, timeline (aim for fast — 3-5 days), fixed price","Price low-but-real for a first client: think ₹3,000–₹8,000 for a simple workflow, not a full retainer","Send it same day, don't sit on it"],
   miniProject:"One sent proposal with a clear price and timeline.",
   challenge:"Include a 'if you're not happy, I'll fix it free' line — reduces their risk to zero.",
   outcome:"A real, priced offer in front of a real prospect.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:46,week:7,title:"No Warm Lead? Widen the Net Fast",subtitle:"If nothing's warm yet, today is a second outreach sprint — smaller, sharper target.",difficulty:"med",hours:5,
   concepts:["Micro-offers: a $20-50 'starter' automation instead of a big project — lower the barrier to yes"],
   exercises:["Draft a specific micro-offer ('I'll automate your [exact task] for ₹2,000, delivered in 48 hours')","Send it to 10 fresh, highly-specific leads","Post it as a Fiverr gig variant too"],
   miniProject:"A micro-offer live and sent to 10 people.",
   challenge:"Make the offer so specific and small that saying no feels harder than saying yes.",
   outcome:"A lower-friction path to your first paid transaction.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:47,week:7,title:"Close the Deal",subtitle:"Someone said yes or is close. Get the agreement locked, not just implied.",difficulty:"med",hours:5,
   concepts:["Getting paid safely: use Upwork/Fiverr escrow if possible, or 50% upfront if direct","Confirming scope in writing before starting work"],
   exercises:["Confirm scope + price + deadline in writing (message or simple doc)","Request the deposit or use platform escrow","If nothing closed yet, follow up on every open proposal today"],
   miniProject:"A confirmed, paid (or escrowed) first project.",
   challenge:"Get the agreement in writing even if it feels awkward to ask.",
   outcome:"Your first real, paying automation client — locked in.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:48,week:7,title:"Deliver Fast — Day 1 of Build",subtitle:"Speed builds trust. A fast delivery is worth more than a perfect one.",difficulty:"med",hours:5,
   concepts:["Reusing your existing capstone code as a base — don't build from zero","Scoping ruthlessly to what was promised, nothing more"],
   exercises:["Build the core of the client's automation using your existing templates as a base","Keep it to exactly what was scoped — no extra features that delay delivery","Message the client with a quick progress update"],
   miniProject:"Working first draft of the client's automation.",
   challenge:"Get a working version today, even if rough — momentum over perfection.",
   outcome:"Visible progress within 24 hours of the deal closing — this is what gets referrals.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:49,week:7,title:"Deliver Fast — Day 2 of Build",subtitle:"Finish it. Test it against their real data if possible.",difficulty:"med",hours:5,
   concepts:["Testing with real inputs, not just sample data","Writing a 3-line usage note so the client can actually use it without you"],
   exercises:["Finish the build, test with real or realistic client data","Write a short usage note / Loom walkthrough for the client","Fix any bugs found during testing"],
   miniProject:"A finished, tested deliverable ready to hand off.",
   challenge:"Record a 2-minute handoff video walking the client through it.",
   outcome:"A completed project ready for delivery — your first real proof of income capability.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:50,week:7,title:"Deliver + Ask for the Review",subtitle:"The project isn't done until the review/testimonial is in.",difficulty:"med",hours:5,
   concepts:["Why the first review matters more than the first payment — it unlocks every future client","Asking directly, same day, while goodwill is highest"],
   exercises:["Deliver the final work + walkthrough to the client","Ask directly for a review (Upwork/Fiverr) or a written testimonial if direct","Ask if they know anyone else who might need something similar"],
   miniProject:"Delivered project + review/testimonial requested.",
   challenge:"Get one explicit referral ask in, even if awkward.",
   outcome:"Payment received, review requested, referral path opened.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:51,week:7,title:"Week 7 Review — First Money In",subtitle:"Whatever came in this week, log it against the ₹50,000 target and plan the next push.",difficulty:"med",hours:3,
   concepts:["Tracking actual rupees earned vs the 50k target","Realistic math: if first project was ₹3-8k, how many more at that rate to clear the debt"],
   exercises:["Log exact amount earned this week","Update your target list with any referrals gained","Rest — Week 8 is about repeating this cycle faster"],
   miniProject:"An honest income tally: earned so far vs ₹50,000 remaining.",
   challenge:"Write down what made this cycle slow, so Week 8 can compress it.",
   outcome:"Proof that the system works. Now it's about repeating it faster.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:52,week:8,title:"Repeat the Cycle — Client #2",subtitle:"You have a system now. Run it again, faster.",difficulty:"med",hours:5,
   concepts:["Reusing your case study + testimonial from client #1 in every new message"],
   exercises:["Update your outreach templates and Upwork profile with the new testimonial","Send 10 fresh messages, now backed by real proof","Follow up on any old leads from Week 6 with 'just delivered this for a client, thought of you'"],
   miniProject:"10 outreach messages sent, now with social proof attached.",
   challenge:"Reference your delivered project specifically in every message.",
   outcome:"Outreach that converts noticeably better than Week 6's cold version.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:53,week:8,title:"Raise Your Price",subtitle:"First client was priced to win trust. Client #2 doesn't need to be that cheap.",difficulty:"med",hours:5,
   concepts:["Pricing anchored to value delivered, not hours spent","Simple rate increase: 30-50% above your first project's price"],
   exercises:["Set your new price for the same type of project (30-50% higher)","Update Upwork/Fiverr pricing to reflect it","Send 8 more outreach messages at the new price point"],
   miniProject:"Updated pricing live across profiles.",
   challenge:"Quote the new price without discounting it in the first message.",
   outcome:"Same effort, meaningfully more revenue per project.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:54,week:8,title:"Close Client #2",subtitle:"Same close process as Week 7 — should feel faster this time.",difficulty:"med",hours:5,
   concepts:["Reducing your own scoping/proposal time using a template from last week"],
   exercises:["Turn your best current lead into a written proposal","Get scope + price + deadline confirmed in writing","Request deposit/escrow"],
   miniProject:"Client #2 confirmed and paid/escrowed.",
   challenge:"Get this deal closed in fewer messages than client #1 took.",
   outcome:"Second confirmed income stream, faster than the first.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:55,week:8,title:"Deliver Client #2 — Fast",subtitle:"Reuse your build templates. This should take less time than the first project.",difficulty:"med",hours:5,
   concepts:["Building a personal 'starter kit' of reusable automation components from project #1"],
   exercises:["Build the core using components/patterns from client #1's project","Test with client's real data","Send a progress update"],
   miniProject:"Working draft of client #2's project.",
   challenge:"Beat your Day 48-49 build time.",
   outcome:"Faster delivery — proof your system is compounding, not just repeating.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:56,week:8,title:"Finish + Set Up a Simple Retainer Offer",subtitle:"One-off projects are good. Recurring monthly income clears debt faster and more predictably.",difficulty:"med",hours:5,
   concepts:["Retainer basics: monthly fee for ongoing maintenance/small requests","Why clients often say yes to a small retainer after a good first delivery"],
   exercises:["Finish and deliver client #2's project + walkthrough","Offer a simple monthly retainer (e.g. ₹2,000-5,000/month for maintenance + small tweaks) to both clients","Ask for review/referral again"],
   miniProject:"Client #2 delivered + at least one retainer offer made.",
   challenge:"Get one client to say yes to the retainer, even a small one.",
   outcome:"A step toward recurring income instead of only one-off project income.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:57,week:8,title:"Simple Money Tracking — Invoicing + Sheet",subtitle:"Debt clearing needs a number you look at daily, not a vague feeling.",difficulty:"med",hours:5,
   concepts:["Simple invoice template (even a Google Doc is fine at this stage)","Tracking sheet: date, client, amount, paid/pending, running total vs ₹50,000"],
   exercises:["Set up one invoice template you can reuse for every client","Build a simple running-total sheet: income so far vs ₹50,000 target","Log every rupee earned in the last 60 days into it"],
   miniProject:"A live income tracker showing progress toward ₹50,000.",
   challenge:"Be brutally honest — include only money actually received, not promised.",
   outcome:"A clear number, updated daily, instead of anxiety without data.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:58,week:8,title:"Week 8 Review — Where You Actually Stand",subtitle:"Two clients in, real income logged. Time for an honest gap check.",difficulty:"med",hours:3,
   concepts:["Comparing actual 60-day income to the ₹50,000 target","Deciding: full-speed continuation, add a bridge income source, or both"],
   exercises:["Total your 60-day income from the tracker","If short of ₹50,000, list 2-3 realistic bridge options (part-time gig work, selling unused items, asking for an EMI/installment plan with the creditor)","Set your Day 61-90 target explicitly — this system compounds, it doesn't stop at day 60"],
   miniProject:"A written Day 61-90 plan with a specific income target.",
   challenge:"If you're behind, talk to the creditor about a payment plan today rather than avoiding the call.",
   outcome:"An honest, numbers-based picture — and a concrete next 30 days instead of open-ended pressure.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:59,week:8,title:"Full 60-Day Review — Skills, Body, Money",subtitle:"Look at all three numbers you've been building: fitness, technical skill, income.",difficulty:"med",hours:3,
   concepts:["Reviewing Day 1 vs Day 60 across all three tracks"],
   exercises:["Physical: compare Day 1 capability to today's — distance, weight, energy","Technical: list every real project you can now build unsupervised","Money: final tally against the ₹50,000 target"],
   miniProject:"A one-page 60-day summary across fitness, skill, and income.",
   challenge:"Write down the single hardest day and what got you through it.",
   outcome:"Concrete proof of 60 days of compounding work — not a feeling, a record.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
  {num:60,week:8,title:"Day 60 — The Next 60 Days",subtitle:"This program ends. The system you built doesn't have to.",difficulty:"med",hours:3,
   concepts:["Turning this into an ongoing weekly rhythm: training + 1-2 outreach hours daily + client delivery","Setting Day 61-120 targets: more clients, higher retainers, or narrowing further into your strongest niche"],
   exercises:["Write your Day 61-120 income target based on this 60-day rate","Decide what stays daily (outreach, training) and what becomes weekly (new skills)","If debt isn't cleared yet, write the specific plan — client volume needed, or bridge income to close the gap"],
   miniProject:"A written 61-120 day plan.",
   challenge:"Commit to one specific number: clients per month going forward.",
   outcome:"A sustainable system running past Day 60, not a program that just ends.",
   resources:[{name:"Upwork Getting Started",url:"https://www.upwork.com/resources/how-to-get-started-on-upwork",tag:"GUIDE"},{name:"Cold Email / DM frameworks",url:"https://www.mailshake.com/blog/cold-email-templates/",tag:"GUIDE"}]},
];

// ─────────────────────────────────────────────────────────────────
// SMOKE-FREE TIPS & CRAVING PROTOCOLS
// ─────────────────────────────────────────────────────────────────
const SMOKE_TIPS = [
  "Cravings peak at 3 minutes then fall. Outlast it — it always passes.",
  "Replace the ritual: full glass of water + 10 pushups + 3 deep breaths.",
  "Running metabolizes nicotine faster. Your morning run is literal detox.",
  "Name the trigger: boredom, stress, habit, social? Name the enemy, then move.",
  "Every hour smoke-free, your blood pressure drops. You're healing right now.",
  "The rough patch IS the reason. Don't smoke to cope with what you're trying to escape.",
  "One day at a time. Not forever — just today.",
];

// ─────────────────────────────────────────────────────────────────
// MIND ARMOR — loneliness, social pressure, comparison, fear @ 23
// ─────────────────────────────────────────────────────────────────
const MIND_TIPS = [
  "Loneliness is missing connection. Solitude is meeting yourself. Same 'alone', different feeling.",
  "Comparison is measuring your real Tuesday against someone else's edited highlight reel.",
  "Wanting to call old smoking friends 'just to talk' is the craving wearing a disguise. Notice it, let it pass.",
  "Fear of being behind at 23 assumes there's one timeline. There isn't. You're building yours.",
  "'I'm good' is a complete sentence. You don't owe anyone a defense for protecting your discipline.",
  "Most family nagging is fear for you, not anger at you. Translate before you react to it.",
  "The version of you in 6 months is built on the quiet, lonely Tuesdays nobody else sees.",
];

const DECLINE_SCRIPTS = [
  "Nah, I'm off it. You guys enjoy — I'm good with water.",
  "I'm good. Keeping my mornings clean for training right now.",
  "Not today. Hit me up for something else though.",
  "Used to need it to relax. Found other ways now.",
  "If they push: repeat the same short no once, then change the subject. Defending it invites debate.",
  "If a hangout is built mostly around smoking, it's fine to skip it and suggest something else instead.",
];

const FEARS = [
  ["Being unemployed at 23","Most people building something real look 'behind' before they look ahead. This phase is data collection, not a verdict on you."],
  ["Friends ahead in jobs or relationships","Their timeline isn't a scoreboard, and you don't see their full story either — only the part they post."],
  ["Disappointing family","Worry and disappointment look the same from outside. Most of what sounds like criticism is fear dressed up as advice."],
  ["Body and weight — 'the fat one'","95kg is a number, not an identity. It moves with the same consistency you're already putting into your runs — it's already changing."],
  ["Wasting these years if it doesn't work out","Skills compound even before income shows up. Nothing you're learning right now disappears."],
  ["Being alone for a long time","This loneliness is tied to a season — the rough patch, the job search, the early build. Seasons end."],
];

// ─────────────────────────────────────────────────────────────────
// SOLITUDE TRAINING — 4 week progression, tied to bootcamp week
// ─────────────────────────────────────────────────────────────────
const SOLITUDE_WEEKS = [
  {week:1, target:"10 min/day alone", practice:"Sit alone, no phone, no music. Just breathe and notice. If it's uncomfortable, that's the rep working.", challenge:"Eat one full meal this week completely alone, no phone on the table."},
  {week:2, target:"20 min/day alone", practice:"Add a solo activity — a walk, a public space, a meal out — phone in your pocket, not your hand.", challenge:"Go somewhere new, alone, with zero plan. Just observe."},
  {week:3, target:"30 min/day alone", practice:"One 'digital fast' block this week: 2–3 hours completely offline, phone away, not just face-down.", challenge:"Sit in total silence for 30 minutes. No journal, no notes. Just sit."},
  {week:4, target:"Solitude as default", practice:"You shouldn't need to schedule it anymore — it's part of how you move through a day. One full solo 'reset' afternoon: 3–4 hours, no destination, just you.", challenge:"Notice if you still reach for your phone to avoid silence. If yes, that's this week's real target."},
];

// ─────────────────────────────────────────────────────────────────
// DAILY MIND ROUTINE — weakness mirror, solitude, guard, reflect
// (repeats across 30 days, like PHYSICAL)
// ─────────────────────────────────────────────────────────────────
const MIND_ROUTINE = [
  { label:"MON", title:"FACE THE WEEK", blocks:[
    {time:"7:00",dur:"5m",type:"mirror",name:"Weakness Mirror",desc:"Look at yourself. Out loud: 'What did I avoid this weekend that I'm facing today?' Don't answer in your head — say it."},
    {time:"13:00",dur:"20m",type:"solitude",name:"Solo Lunch",desc:"Eat alone, phone in another room. Eat slow. Let the boredom sit instead of reaching for it."},
    {time:"19:30",dur:"10m",type:"guard",name:"Evening Guard Check",desc:"If anyone calls about smoking tonight, the line is ready: 'I'm good, keeping mornings clean.' Use it, don't explain it."},
    {time:"22:00",dur:"10m",type:"reflect",name:"Comparison Log",desc:"Write one sentence: where did comparison show up today, and what did it cost you?"},
  ]},
  { label:"TUE", title:"GUARD THE LINE", blocks:[
    {time:"7:00",dur:"5m",type:"mirror",name:"Weakness Mirror",desc:"Say it straight: 'Where did I make an excuse today instead of doing the thing?' Name it specifically, not generally."},
    {time:"13:00",dur:"20m",type:"solitude",name:"Directionless Walk",desc:"Walk with no destination and no headphones. 20 minutes. Just look around."},
    {time:"19:30",dur:"15m",type:"guard",name:"High-Risk Evening",desc:"Highest-risk night for the smoke invite. If it comes: one no, no defense, change the subject. Log it after, either way."},
    {time:"22:00",dur:"10m",type:"reflect",name:"Reach-Out Check",desc:"Journal: who did I lean on today, and did I reach out first or only respond?"},
  ]},
  { label:"WED", title:"DEEP SOLITUDE", blocks:[
    {time:"7:00",dur:"5m",type:"mirror",name:"The Hard Mirror",desc:"This is the hard mirror day. Ask: 'What's the weakness I keep protecting instead of fixing?' Sit with the answer 30 seconds before moving."},
    {time:"13:00",dur:"40m",type:"solitude",name:"Long Solitude Block",desc:"Longest solitude block of the week. No phone, no destination, no plan. Sit somewhere public alone — park, rooftop, anywhere. Just be there."},
    {time:"19:30",dur:"10m",type:"guard",name:"Midweek Yes-Count",desc:"Count this week so far: how many times did you say yes to something you didn't want, just to avoid being alone?"},
    {time:"22:00",dur:"10m",type:"reflect",name:"The Real Sentence",desc:"Write the truest sentence you can about today. Not the version you'd post — the real one."},
  ]},
  { label:"THU", title:"COMPARISON CHECK", blocks:[
    {time:"7:00",dur:"5m",type:"mirror",name:"Whose Highlight Reel",desc:"Ask yourself: 'Whose life did I compare mine to today — and what did I actually see, their highlight or their whole story?'"},
    {time:"13:00",dur:"20m",type:"solitude",name:"Three Facts",desc:"Sit in silence with a notebook, no phone. Write 3 things that are actually true about where you are right now — just facts, not feelings about them."},
    {time:"19:30",dur:"10m",type:"guard",name:"Script Audit",desc:"Check your group chats. Any 'come smoke' messages today? If yes — did you reply with the script, or with an explanation?"},
    {time:"22:00",dur:"10m",type:"reflect",name:"Own Progress Log",desc:"One line: what's one thing today that had nothing to do with anyone else's progress — just yours?"},
  ]},
  { label:"FRI", title:"WEEKEND GUARD", blocks:[
    {time:"7:00",dur:"5m",type:"mirror",name:"Pre-Weekend Mirror",desc:"Before the weekend starts: 'What's my plan if the smoke invite comes tonight?' Say your line out loud once, now, before you need it."},
    {time:"13:00",dur:"20m",type:"solitude",name:"Deposit Before The Noise",desc:"20 minutes, no phone, before the weekend noise starts. This is the deposit you make before the social pressure shows up."},
    {time:"20:00",dur:"15m",type:"guard",name:"Tonight's Test",desc:"Decide before you go out: are you staying for the people, or staying because you don't want to be the one who leaves? Know the difference."},
    {time:"23:00",dur:"10m",type:"reflect",name:"No-Judgment Recap",desc:"However tonight went — write exactly what happened. No judgment, just the facts. That's the data for next Friday."},
  ]},
  { label:"SAT", title:"EXTENDED SOLITUDE", blocks:[
    {time:"7:00",dur:"8m",type:"mirror",name:"Three True Sentences",desc:"Longest mirror session of the week. Say three honest sentences about yourself — not insults, not compliments. Just true."},
    {time:"14:00",dur:"60m",type:"solitude",name:"The Long Sit",desc:"One full hour alone, no destination. Walk, sit, think. This is the long run for your mind. Let it be boring."},
    {time:"19:00",dur:"10m",type:"guard",name:"Weekend Check",desc:"If friends call tonight, you already know your line. Use it once. Don't repeat the argument if they push."},
    {time:"22:30",dur:"10m",type:"reflect",name:"What It Actually Felt Like",desc:"Write what solitude felt like today — not what it should feel like. What it actually felt like."},
  ]},
  { label:"SUN", title:"FULL REFLECTION", blocks:[
    {time:"8:00",dur:"8m",type:"mirror",name:"Weekly Mirror",desc:"Weekly mirror: 'What did I face this week, and what did I still avoid?' Say both out loud."},
    {time:"13:00",dur:"30m",type:"solitude",name:"Let The Week Settle",desc:"30 minutes, no phone, no agenda. Let the week settle before you plan the next one."},
    {time:"18:00",dur:"10m",type:"guard",name:"Weekly Line Count",desc:"Review the week: how many times did you hold the line on smoking? Write the number, not the feeling about it."},
    {time:"19:00",dur:"15m",type:"reflect",name:"Fear Review",desc:"From this week's Fear Audit — which fear got a little smaller? Which one is still loud? Pick one to face head-on next week."},
  ]},
];

const MIND_TYPE = {
  mirror:   {bg:"#150e22",border:"#7c3aed44",badge:"#7c3aed",label:"MIRROR"},
  solitude: {bg:"#0e0e22",border:"#6366f144",badge:"#6366f1",label:"SOLITUDE"},
  guard:    {bg:"#1f0e22",border:"#a855f744",badge:"#a855f7",label:"GUARD"},
  reflect:  {bg:"#170e22",border:"#8b5cf644",badge:"#8b5cf6",label:"REFLECT"},
};

const TYPE = {
  mind:     {bg:"#0e0e1f",border:"#7c3aed44",badge:"#7c3aed",label:"MINDSET"},
  warm:     {bg:"#0a1a0a",border:"#16a34a44",badge:"#16a34a",label:"WARMUP"},
  cardio:   {bg:"#0a0f1f",border:"#2563eb44",badge:"#2563eb",label:"CARDIO"},
  strength: {bg:"#1a0a0a",border:"#dc262644",badge:"#dc2626",label:"STRENGTH"},
  recovery: {bg:"#0a1a1a",border:"#0891b244",badge:"#0891b2",label:"RECOVERY"},
};

const WEEK_COLOR = ["","#00ff88","#7c3aed","#f59e0b","#ef4444","#06b6d4","#eab308","#22c55e","#f97316"];
const DIFF_COLOR = {easy:"#00ff88",med:"#f59e0b",hard:"#ef4444"};

function App() {
  const saved = loadSaved();
  const [dayIdx, setDayIdx]     = useState(saved.dayIdx ?? 0);
  const [tab, setTab]           = useState(saved.tab ?? "physical");
  const [checked, setChecked]   = useState(saved.checked ?? {});
  const [smokeFree, setSmokeFree] = useState(saved.smokeFree ?? 0);
  const [tipIdx, setTipIdx]     = useState(0);
  const [mindTipIdx, setMindTipIdx] = useState(0);
  const [expandCode, setExpandCode] = useState(false);

  // auto-save progress whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dayIdx, tab, checked, smokeFree }));
    } catch (e) {}
  }, [dayIdx, tab, checked, smokeFree]);

  const bd = BOOTCAMP[dayIdx];
  const physDay = PHYSICAL[dayIdx];
  const mindDay = MIND_ROUTINE[dayIdx % 7];
  const wc = WEEK_COLOR[bd.week];

  const physKey  = (i) => `p-${dayIdx}-${i}`;
  const codeKey  = (t) => `c-${dayIdx}-${t}`;
  const mindRoutineKey = (i) => `mr-${dayIdx}-${i}`;

  const toggle = (k) => setChecked(p => ({...p,[k]:!p[k]}));

  // progress
  const physTotal  = physDay.blocks.length;
  const physDone   = physDay.blocks.filter((_,i) => checked[physKey(i)]).length;
  const codeChecks = ["concepts","exercises","mini","challenge","outcome"];
  const codeDone   = codeChecks.filter(t => checked[codeKey(t)]).length;

  const C = {
    app: {minHeight:"100vh",background:"#080810",color:"#e2e2f0",fontFamily:"'Inter','Segoe UI',sans-serif",maxWidth:500,margin:"0 auto",paddingBottom:90},
    header: {background:"#08080f",padding:"18px 16px 12px",position:"sticky",top:0,zIndex:20,borderBottom:"1px solid #1e1e2e"},
    stripe: {height:3,background:`linear-gradient(90deg,#dc2626 0%,#dc2626 50%,${wc} 50%,${wc} 100%)`,marginBottom:12,borderRadius:2,transition:"background 0.4s"},
    row: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8},
    eyebrow: {fontSize:9,letterSpacing:4,color:"#555",marginBottom:2},
    bigTitle: {fontSize:17,fontWeight:900,letterSpacing:-0.5,lineHeight:1.1},
    smokePill: {background:"#041a0e",border:"1px solid #00ff8822",borderRadius:8,padding:"6px 10px",textAlign:"center",minWidth:70},
    smokeBig: {fontSize:20,fontWeight:900,color:"#00ff88",lineHeight:1},
    smokeSub: {fontSize:7,letterSpacing:2,color:"#555",marginTop:1},
    progRow: {display:"flex",gap:8,alignItems:"center"},
    bar: {flex:1,height:4,background:"#1e1e2e",borderRadius:2,overflow:"hidden"},
    fill: (p,c) => ({width:`${p}%`,height:"100%",background:c,transition:"width 0.4s",borderRadius:2}),
    barLabel: {fontSize:9,color:"#555",minWidth:40,textAlign:"right"},
    // day scroll
    scroll: {display:"flex",gap:5,padding:"10px 14px",overflowX:"auto",scrollbarWidth:"none",background:"#0a0a14",borderBottom:"1px solid #1e1e2e"},
    daybtn: (active,wc) => ({flexShrink:0,width:42,height:42,borderRadius:6,border:`1.5px solid ${active?wc:"#1e1e2e"}`,background:active?`${wc}18`:"#10101a",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}),
    dayNum: (active,wc) => ({fontSize:11,fontWeight:900,color:active?wc:"#444"}),
    dayW: {fontSize:7,color:"#333",marginTop:1},
    // tabs
    tabs: {display:"flex",borderBottom:"1px solid #1e1e2e",background:"#0a0a10"},
    tab: (active) => ({flex:1,padding:"9px 0",background:"none",border:"none",fontSize:9,fontWeight:700,letterSpacing:1.5,cursor:"pointer",color:active?"#e2e2f0":"#333",borderBottom:active?"2px solid #dc2626":"2px solid transparent",textTransform:"uppercase"}),
    // physical blocks
    blocks: {padding:"12px 13px",display:"flex",flexDirection:"column",gap:8},
    block: (t,done) => ({background:done?"#0c0c14":TYPE[t].bg,border:`1.5px solid ${done?"#1e1e2e":TYPE[t].border}`,borderRadius:10,padding:"11px 13px",cursor:"pointer",opacity:done?0.4:1,transition:"all 0.18s"}),
    blockTop: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5},
    badge: (t) => ({fontSize:7,fontWeight:800,letterSpacing:2,background:TYPE[t].badge,color:"#000",padding:"2px 5px",borderRadius:3}),
    meta: {fontSize:9,color:"#444",marginTop:2},
    name: (done) => ({fontSize:13,fontWeight:700,color:done?"#333":"#dde"}),
    check: (done) => ({width:19,height:19,borderRadius:"50%",border:`2px solid ${done?"#00ff88":"#222"}`,background:done?"#00ff88":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:8}),
    desc: {fontSize:11,color:"#555",lineHeight:1.65,marginTop:2},
    // code section
    codeWrap: {padding:"12px 13px"},
    codeMeta: {display:"flex",gap:6,alignItems:"center",marginBottom:10,flexWrap:"wrap"},
    pill: (bg,c) => ({fontSize:8,fontWeight:800,letterSpacing:1,background:bg,color:c||"#000",padding:"3px 7px",borderRadius:3}),
    codeTitle: {fontSize:17,fontWeight:900,marginBottom:2,lineHeight:1.2},
    codeSub: {fontSize:11,color:"#555",lineHeight:1.6,marginBottom:12},
    card: {background:"#10101a",border:"1px solid #1e1e2e",borderRadius:10,padding:"12px 14px",marginBottom:8},
    cardLabel: {fontSize:8,letterSpacing:3,color:wc,marginBottom:7,display:"flex",alignItems:"center",gap:6},
    cardLabelLine: {width:12,height:1,background:wc,display:"inline-block"},
    concept: {fontSize:11,color:"#667",padding:"3px 0",borderBottom:"1px solid #1a1a2a",display:"flex",gap:6},
    exercise: {fontSize:11,color:"#667",padding:"4px 0",borderBottom:"1px solid #1a1a2a",display:"flex",gap:7,alignItems:"flex-start"},
    exNum: {color:wc,minWidth:16,fontWeight:700,fontSize:10},
    challengeBox: {border:`1px dashed ${wc}44`,borderRadius:8,padding:"10px 12px",fontSize:11,color:"#9ab"},
    outcomeBox: {background:`${wc}08`,border:`1px solid ${wc}22`,borderRadius:8,padding:"10px 12px",fontSize:11,color:"#7a9"},
    checkRow: (done) => ({display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",cursor:"pointer",borderBottom:"1px solid #1a1a2a",opacity:done?0.5:1}),
    checkLabel: {fontSize:11,color:"#ccd"},
    miniCheck: (done) => ({width:16,height:16,borderRadius:3,border:`1.5px solid ${done?wc:"#333"}`,background:done?wc:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#000",flexShrink:0}),
    // resources
    resLink: {display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #1a1a2a",textDecoration:"none"},
    resName: {fontSize:11,color:"#4a9"},
    resTag: {fontSize:7,letterSpacing:1,background:"#1a1a2a",color:"#555",padding:"2px 6px",borderRadius:3},
    // smoke tools
    smokeWrap: {padding:"12px 13px"},
    counter: {background:"#041a0e",border:"1px solid #00ff8822",borderRadius:10,padding:"14px",marginBottom:8},
    counterRow: {display:"flex",alignItems:"center",justifyContent:"center",gap:16,margin:"10px 0"},
    counterNum: {fontSize:38,fontWeight:900,color:"#00ff88",minWidth:60,textAlign:"center"},
    cBtn: (c) => ({width:36,height:36,borderRadius:"50%",border:`2px solid ${c}`,background:"transparent",color:c,fontSize:22,cursor:"pointer",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}),
    tipBox: {background:"#041a0e",border:"1px solid #00ff8822",borderRadius:10,padding:"13px",marginBottom:8},
    tipLabel: {fontSize:8,letterSpacing:3,color:"#00ff88",marginBottom:5},
    tipText: {fontSize:12,color:"#7ab",lineHeight:1.7},
    tipNav: {display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8},
    tipBtn: {background:"none",border:"1px solid #00ff8822",borderRadius:5,padding:"3px 9px",fontSize:10,color:"#00ff88",cursor:"pointer"},
    emergBox: {background:"#1a0808",border:"1px solid #dc262633",borderRadius:10,padding:"13px",marginBottom:8},
    timelineBox: {background:"#041a0e",border:"1px solid #00ff8822",borderRadius:10,padding:"13px"},
    timelineRow: {display:"flex",gap:10,padding:"5px 0",borderBottom:"1px solid #041a10",fontSize:11},
    // mind armor tools
    mindBox: {background:"#120e1f",border:"1px solid #7c3aed22",borderRadius:10,padding:"13px",marginBottom:8},
    mindLabel: {fontSize:8,letterSpacing:3,color:"#7c3aed",marginBottom:7},
    mTipBox: {background:"#120e1f",border:"1px solid #7c3aed22",borderRadius:10,padding:"13px",marginBottom:8},
    mTipLabel: {fontSize:8,letterSpacing:3,color:"#7c3aed",marginBottom:5},
    mTipText: {fontSize:12,color:"#a78bfa",lineHeight:1.7},
    mTipBtn: {background:"none",border:"1px solid #7c3aed22",borderRadius:5,padding:"3px 9px",fontSize:10,color:"#7c3aed",cursor:"pointer"},
    mblock: (t,done) => ({background:done?"#0c0c14":MIND_TYPE[t].bg,border:`1.5px solid ${done?"#1e1e2e":MIND_TYPE[t].border}`,borderRadius:10,padding:"11px 13px",cursor:"pointer",opacity:done?0.4:1,transition:"all 0.18s"}),
    mbadge: (t) => ({fontSize:7,fontWeight:800,letterSpacing:2,background:MIND_TYPE[t].badge,color:"#000",padding:"2px 5px",borderRadius:3}),
  };

  return (
    <div style={C.app}>
      {/* ─── HEADER ─── */}
      <div style={C.header}>
        <div style={C.stripe}/>
        <div style={C.row}>
          <div>
            <div style={C.eyebrow}>30-DAY WARRIOR + AI BOOTCAMP · LAKSHAY</div>
            <div style={C.bigTitle}>
              <span style={{color:"#dc2626"}}>BODY</span>
              <span style={{color:"#2a2a3a"}}> × </span>
              <span style={{color:wc}}>CODE</span>
              <span style={{color:"#444",fontSize:11}}> + QUIT + MIND</span>
            </div>
          </div>
          <div style={C.smokePill}>
            <div style={C.smokeBig}>{smokeFree}</div>
            <div style={C.smokeSub}>SMOKE-FREE<br/>DAYS</div>
          </div>
        </div>
        <div style={C.progRow}>
          <span style={{fontSize:9,color:"#555",minWidth:24}}>💪</span>
          <div style={C.bar}><div style={C.fill(physTotal?Math.round(physDone/physTotal*100):0,"#dc2626")}/></div>
          <span style={C.barLabel}>{physDone}/{physTotal}</span>
        </div>
        <div style={{...C.progRow,marginTop:4}}>
          <span style={{fontSize:9,color:"#555",minWidth:24}}>⚡</span>
          <div style={C.bar}><div style={C.fill(Math.round(codeDone/codeChecks.length*100),wc)}/></div>
          <span style={C.barLabel}>{codeDone}/{codeChecks.length}</span>
        </div>
      </div>

      {/* ─── DAY SELECTOR ─── */}
      <div style={C.scroll}>
        {BOOTCAMP.map((b,i) => {
          const wc2 = WEEK_COLOR[b.week];
          return (
            <button key={i} style={C.daybtn(i===dayIdx,wc2)} onClick={()=>setDayIdx(i)}>
              <div style={C.dayNum(i===dayIdx,wc2)}>{b.num}</div>
              <div style={C.dayW}>W{b.week}</div>
            </button>
          );
        })}
      </div>

      {/* ─── TABS ─── */}
      <div style={C.tabs}>
        {[["physical","💪 PHYSICAL"],["code","⚡ CODING"],["quit","🚭 QUIT"],["mind","🛡️ MIND"]].map(([k,l])=>(
          <button key={k} style={C.tab(tab===k)} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {/* ════════════════ PHYSICAL TAB ════════════════ */}
      {tab==="physical" && (
        <>
          <div style={{padding:"10px 14px 0"}}>
            <div style={{fontSize:9,letterSpacing:3,color:"#dc2626"}}>{physDay.label} — DAY {bd.num} OF 60</div>
            <div style={{fontSize:16,fontWeight:900}}>{physDay.title}</div>
            <div style={{fontSize:10,color:"#444",marginTop:1}}>{physDay.focus} · {physTotal} BLOCKS · TAP TO COMPLETE</div>
          </div>
          <div style={C.blocks}>
            {physDay.blocks.map((b,i)=>{
              const done = !!checked[physKey(i)];
              return (
                <div key={i} style={C.block(b.type,done)} onClick={()=>toggle(physKey(i))}>
                  <div style={C.blockTop}>
                    <div>
                      <span style={C.badge(b.type)}>{TYPE[b.type].label}</span>
                      <div style={C.meta}>{b.time} · {b.dur}</div>
                      <div style={C.name(done)}>{b.name}</div>
                    </div>
                    <div style={C.check(done)}>{done&&<span style={{fontSize:9,color:"#000"}}>✓</span>}</div>
                  </div>
                  <div style={C.desc}>{b.desc}</div>
                </div>
              );
            })}
          </div>
          <div style={{margin:"0 13px 13px",background:"#10101a",border:"1px solid #dc262622",borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#dc2626",marginBottom:6}}>THE 40% RULE</div>
            <div style={{fontSize:11,color:"#556",lineHeight:1.7}}>When your mind says stop — quit running, quit coding, quit quitting — you're at 40% capacity. The remaining 60% is locked behind the wall your mind builds. Your only job: break that wall. Every single day.</div>
          </div>
        </>
      )}

      {/* ════════════════ CODE TAB ════════════════ */}
      {tab==="code" && (
        <div style={C.codeWrap}>
          <div style={C.codeMeta}>
            <span style={C.pill(wc,"#000")}>WEEK {bd.week}</span>
            <span style={C.pill(`${DIFF_COLOR[bd.difficulty]}22`,DIFF_COLOR[bd.difficulty])}>{bd.difficulty.toUpperCase()}</span>
            <span style={C.pill("#1a1a2a","#555")}>{bd.hours}H</span>
            <span style={C.pill("#1a1a2a","#555")}>DAY {bd.num}</span>
          </div>
          <div style={C.codeTitle}>{bd.title}</div>
          <div style={C.codeSub}>{bd.subtitle}</div>

          {/* Concepts */}
          <div style={C.card}>
            <div style={C.cardLabel}><span style={C.cardLabelLine}/>CONCEPTS TO MASTER</div>
            {bd.concepts.map((c,i)=>(
              <div key={i} style={C.concept}><span style={{color:wc,minWidth:10}}>▸</span>{c}</div>
            ))}
            <div style={C.checkRow(checked[codeKey("concepts")])} onClick={()=>toggle(codeKey("concepts"))}>
              <span style={{fontSize:10,color:"#555",marginTop:4}}>Mark concepts studied</span>
              <div style={C.miniCheck(checked[codeKey("concepts")])}>{checked[codeKey("concepts")]&&"✓"}</div>
            </div>
          </div>

          {/* Exercises */}
          <div style={C.card}>
            <div style={C.cardLabel}><span style={C.cardLabelLine}/>DAILY EXERCISES</div>
            {bd.exercises.map((e,i)=>(
              <div key={i} style={C.exercise}><span style={C.exNum}>{i+1}.</span><span style={{color:"#668"}}>{e}</span></div>
            ))}
            <div style={C.checkRow(checked[codeKey("exercises")])} onClick={()=>toggle(codeKey("exercises"))}>
              <span style={{fontSize:10,color:"#555",marginTop:4}}>Mark exercises done</span>
              <div style={C.miniCheck(checked[codeKey("exercises")])}>{checked[codeKey("exercises")]&&"✓"}</div>
            </div>
          </div>

          {/* Mini Project */}
          <div style={C.card}>
            <div style={C.cardLabel}><span style={C.cardLabelLine}/>MINI PROJECT</div>
            <div style={C.challengeBox}><span style={{color:wc,fontWeight:700}}>BUILD: </span>{bd.miniProject}</div>
            <div style={C.checkRow(checked[codeKey("mini")])} onClick={()=>toggle(codeKey("mini"))}>
              <span style={{fontSize:10,color:"#555",marginTop:4}}>Project built & pushed to GitHub</span>
              <div style={C.miniCheck(checked[codeKey("mini")])}>{checked[codeKey("mini")]&&"✓"}</div>
            </div>
          </div>

          {/* Challenge */}
          <div style={C.card}>
            <div style={C.cardLabel}><span style={C.cardLabelLine}/>NO-TUTORIAL CHALLENGE</div>
            <div style={C.challengeBox}><span style={{color:wc,fontWeight:700}}>CHALLENGE: </span>{bd.challenge}</div>
            <div style={C.checkRow(checked[codeKey("challenge")])} onClick={()=>toggle(codeKey("challenge"))}>
              <span style={{fontSize:10,color:"#555",marginTop:4}}>Challenge completed</span>
              <div style={C.miniCheck(checked[codeKey("challenge")])}>{checked[codeKey("challenge")]&&"✓"}</div>
            </div>
          </div>

          {/* Outcome */}
          <div style={C.card}>
            <div style={C.cardLabel}><span style={C.cardLabelLine}/>EXPECTED OUTCOME</div>
            <div style={C.outcomeBox}>{bd.outcome}</div>
            <div style={C.checkRow(checked[codeKey("outcome")])} onClick={()=>toggle(codeKey("outcome"))}>
              <span style={{fontSize:10,color:"#555",marginTop:4}}>Outcome achieved — I'm confident</span>
              <div style={C.miniCheck(checked[codeKey("outcome")])}>{checked[codeKey("outcome")]&&"✓"}</div>
            </div>
          </div>

          {/* Resources */}
          {bd.resources.length > 0 && (
            <div style={C.card}>
              <div style={C.cardLabel}><span style={C.cardLabelLine}/>RESOURCES</div>
              {bd.resources.map((r,i)=>(
                <a key={i} href={r.url} target="_blank" rel="noreferrer" style={C.resLink}>
                  <span style={C.resName}>{r.name}</span>
                  <span style={C.resTag}>{r.tag}</span>
                </a>
              ))}
            </div>
          )}

          {/* Overall bootcamp progress */}
          <div style={{background:"#10101a",border:"1px solid #1e1e2e",borderRadius:10,padding:"12px 14px",marginTop:4}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#555",marginBottom:8}}>BOOTCAMP PROGRESS</div>
            <div style={{height:4,background:"#1e1e2e",borderRadius:2,overflow:"hidden",marginBottom:5}}>
              <div style={{width:`${Math.round((dayIdx+1)/60*100)}%`,height:"100%",background:wc,borderRadius:2}}/>
            </div>
            <div style={{fontSize:10,color:"#555"}}>Day {bd.num} of 60 · Week {bd.week} · {Math.round((dayIdx+1)/60*100)}% complete</div>
          </div>
        </div>
      )}

      {/* ════════════════ QUIT TOOLS TAB ════════════════ */}
      {tab==="quit" && (
        <div style={C.smokeWrap}>
          <div style={{fontSize:9,letterSpacing:3,color:"#00ff88",marginBottom:2}}>QUIT SMOKING TOOLS</div>
          <div style={{fontSize:17,fontWeight:900,marginBottom:3}}>CRAVING ARSENAL</div>
          <div style={{fontSize:11,color:"#445",lineHeight:1.65,marginBottom:10}}>
            The rough patch is fuel. Every craving you beat is a rep. You're training your nervous system to not need cigarettes.
          </div>

          {/* Counter */}
          <div style={C.counter}>
            <div style={{fontSize:8,letterSpacing:3,color:"#00ff88",marginBottom:2}}>SMOKE-FREE DAY COUNTER</div>
            <div style={C.counterRow}>
              <button style={C.cBtn("#dc2626")} onClick={()=>setSmokeFree(Math.max(0,smokeFree-1))}>−</button>
              <div style={C.counterNum}>{smokeFree}</div>
              <button style={C.cBtn("#00ff88")} onClick={()=>setSmokeFree(smokeFree+1)}>+</button>
            </div>
            <div style={{fontSize:11,color:"#555",textAlign:"center"}}>
              {smokeFree===0?"Start your count. Day 1 is the hardest.":
               smokeFree<3?`${smokeFree} day${smokeFree>1?"s":""} — nicotine leaving your blood. Keep going.`:
               smokeFree<7?`${smokeFree} days — lung cilia regrowing. Physical progress.`:
               smokeFree<14?`${smokeFree} days — one week+ free. Heart rate dropping.`:
               smokeFree<30?`${smokeFree} days — circulation improving. Feel it in your runs.`:
               `${smokeFree} days. You are not a smoker anymore.`}
            </div>
          </div>

          {/* Tips */}
          <div style={C.tipBox}>
            <div style={C.tipLabel}>CRAVING RESPONSE #{tipIdx+1}/{SMOKE_TIPS.length}</div>
            <div style={C.tipText}>{SMOKE_TIPS[tipIdx]}</div>
            <div style={C.tipNav}>
              <button style={C.tipBtn} onClick={()=>setTipIdx(i=>(i-1+SMOKE_TIPS.length)%SMOKE_TIPS.length)}>← PREV</button>
              <span style={{fontSize:8,color:"#333"}}>{SMOKE_TIPS.map((_,i)=>i===tipIdx?"●":"○").join(" ")}</span>
              <button style={C.tipBtn} onClick={()=>setTipIdx(i=>(i+1)%SMOKE_TIPS.length)}>NEXT →</button>
            </div>
          </div>

          {/* Emergency */}
          <div style={C.emergBox}>
            <div style={{fontSize:8,letterSpacing:3,color:"#dc2626",marginBottom:8}}>CRAVING EMERGENCY PROTOCOL</div>
            {["Drink a full glass of water — now.",
              "Do 10 pushups. Right now.",
              "4-7-8 breath: inhale 4s, hold 7s, exhale 8s. Repeat 4×.",
              "Text someone. Say 'I almost smoked. I didn't.'",
              "Walk outside for 5 minutes.",
              "The craving peaks at 3 min then falls. Wait it out."].map((item,i)=>(
              <div key={i} style={{fontSize:11,color:"#666",padding:"5px 0",borderBottom:"1px solid #1a1a2a",display:"flex",gap:8}}>
                <span style={{color:"#dc2626",minWidth:14}}>{i+1}.</span>{item}
              </div>
            ))}
          </div>

          {/* Timeline of healing */}
          <div style={C.timelineBox}>
            <div style={{fontSize:8,letterSpacing:3,color:"#00ff88",marginBottom:8}}>WHAT YOUR BODY IS GAINING</div>
            {[["20 min","Heart rate and blood pressure drop"],
              ["8 hrs","CO in blood halves, O₂ increases"],
              ["24 hrs","Heart attack risk begins to fall"],
              ["48 hrs","Nerve endings start regrowing"],
              ["72 hrs","Breathing becomes easier"],
              ["2 wks","Circulation improves — running gets easier"],
              ["1 mo","Lung function improves up to 30%"],
              ["30 days","You've done the bootcamp. Your lungs and your code are both production-ready."]].map(([t,d])=>(
              <div key={t} style={C.timelineRow}>
                <span style={{color:"#00ff88",minWidth:44,fontWeight:700}}>{t}</span>
                <span style={{color:"#556"}}>{d}</span>
              </div>
            ))}
          </div>

          <div style={{marginTop:8,background:"#10101a",border:"1px solid #7c3aed22",borderRadius:10,padding:"13px 14px"}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#7c3aed",marginBottom:7}}>THE ROUGH PATCH IS THE WORK</div>
            <div style={{fontSize:11,color:"#556",lineHeight:1.75}}>
              You're going through something hard. That's not bad luck — that's your training ground. The discipline you're building here transfers. Every craving you beat, every 4 AM alarm you don't snooze, every day of code you ship — it compounds. You're not waiting for the rough patch to end. You're building through it.
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ MIND ARMOR TAB ════════════════ */}
      {tab==="mind" && (
        <div style={C.smokeWrap}>
          <div style={{fontSize:9,letterSpacing:3,color:"#7c3aed",marginBottom:2}}>INNER WARFARE</div>
          <div style={{fontSize:17,fontWeight:900,marginBottom:3}}>MIND ARMOR</div>
          <div style={{fontSize:11,color:"#445",lineHeight:1.65,marginBottom:10}}>
            Quitting smoking is one battle. The other is staying whole when you're lonely, comparing yourself to everyone, or getting pulled at by friends and family. Loneliness is missing connection — solitude is being okay in your own company. Same "alone," different feeling. Below is the actual training for that second one.
          </div>

          {/* Weakness Mirror — how to */}
          <div style={C.mindBox}>
            <div style={C.mindLabel}>THE WEAKNESS MIRROR — HOW TO</div>
            <div style={{fontSize:11,color:"#9a8cd1",lineHeight:1.75}}>
              Stand close enough to see your own eyes. Say the day's prompt out loud — not in your head. Answer out loud too. Two rules: don't flatter yourself, and don't trash yourself either. Just say what's true. It only works if you're not performing for it.
            </div>
          </div>

          {/* Solitude training progression */}
          <div style={C.mindBox}>
            <div style={C.mindLabel}>SOLITUDE TRAINING — WEEK {bd.week} OF 4</div>
            <div style={{fontSize:13,fontWeight:800,color:"#c4b5fd",marginBottom:3}}>{SOLITUDE_WEEKS[bd.week-1].target}</div>
            <div style={{fontSize:11,color:"#9a8cd1",lineHeight:1.7,marginBottom:7}}>{SOLITUDE_WEEKS[bd.week-1].practice}</div>
            <div style={{fontSize:11,color:"#a78bfa",lineHeight:1.6,padding:"8px 10px",background:"#0d0a1a",borderRadius:6,border:"1px solid #7c3aed22"}}>
              <span style={{color:"#7c3aed",fontWeight:700}}>This week's edge: </span>{SOLITUDE_WEEKS[bd.week-1].challenge}
            </div>
            <div style={{marginTop:9}}>
              {SOLITUDE_WEEKS.map((w,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"4px 0",borderBottom:i<3?"1px solid #1a1a2a":"none",opacity:bd.week===w.week?1:0.4}}>
                  <span style={{color:bd.week===w.week?"#7c3aed":"#444",minWidth:52,fontWeight:700,fontSize:10}}>WEEK {w.week}</span>
                  <span style={{fontSize:10,color:"#667"}}>{w.target}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily mind routine — time-blocked */}
          <div style={{padding:"4px 1px 7px"}}>
            <div style={C.mindLabel}>DAILY MIND ROUTINE — {mindDay.label} · {mindDay.title}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
            {mindDay.blocks.map((b,i)=>{
              const done = !!checked[mindRoutineKey(i)];
              return (
                <div key={i} style={C.mblock(b.type,done)} onClick={()=>toggle(mindRoutineKey(i))}>
                  <div style={C.blockTop}>
                    <div>
                      <span style={C.mbadge(b.type)}>{MIND_TYPE[b.type].label}</span>
                      <div style={C.meta}>{b.time} · {b.dur}</div>
                      <div style={C.name(done)}>{b.name}</div>
                    </div>
                    <div style={C.check(done)}>{done&&<span style={{fontSize:9,color:"#000"}}>✓</span>}</div>
                  </div>
                  <div style={C.desc}>{b.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Tip carousel */}
          <div style={C.mTipBox}>
            <div style={C.mTipLabel}>MIND REP #{mindTipIdx+1}/{MIND_TIPS.length}</div>
            <div style={C.mTipText}>{MIND_TIPS[mindTipIdx]}</div>
            <div style={C.tipNav}>
              <button style={C.mTipBtn} onClick={()=>setMindTipIdx(i=>(i-1+MIND_TIPS.length)%MIND_TIPS.length)}>← PREV</button>
              <span style={{fontSize:8,color:"#333"}}>{MIND_TIPS.map((_,i)=>i===mindTipIdx?"●":"○").join(" ")}</span>
              <button style={C.mTipBtn} onClick={()=>setMindTipIdx(i=>(i+1)%MIND_TIPS.length)}>NEXT →</button>
            </div>
          </div>

          {/* Decline scripts */}
          <div style={C.mindBox}>
            <div style={C.mindLabel}>WHEN THEY TRY TO CONVINCE YOU</div>
            {DECLINE_SCRIPTS.map((item,i)=>(
              <div key={i} style={{fontSize:11,color:"#9a8cd1",padding:"5px 0",borderBottom:"1px solid #1a1a2a",display:"flex",gap:8}}>
                <span style={{color:"#7c3aed",minWidth:14}}>{i+1}.</span>{item}
              </div>
            ))}
          </div>

          {/* Fear audit */}
          <div style={C.mindBox}>
            <div style={C.mindLabel}>FEAR AUDIT — TURNING 23</div>
            {FEARS.map(([f,r],i)=>(
              <div key={i} style={{padding:"7px 0",borderBottom:"1px solid #1a1a2a"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#c4b5fd",marginBottom:2}}>{f}</div>
                <div style={{fontSize:11,color:"#667",lineHeight:1.6}}>{r}</div>
              </div>
            ))}
          </div>

          {/* Family & friends */}
          <div style={{marginTop:8,background:"#10101a",border:"1px solid #7c3aed22",borderRadius:10,padding:"13px 14px"}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#7c3aed",marginBottom:7}}>FAMILY & FRIENDS — THE LONG GAME</div>
            <div style={{fontSize:11,color:"#556",lineHeight:1.75}}>
              You don't owe anyone a play-by-play of a rough patch. Share real wins when they happen. Set one short, calm line for the worried questions — "I'm building something, give me time" — and repeat that instead of re-explaining every time. Protect your energy for the people actually building with you. The rest can catch up once there's something to see.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// App mounted successfully — now it's safe to remove the boot splash
const bootEl = document.getElementById("boot");
if (bootEl) bootEl.style.display = "none";

