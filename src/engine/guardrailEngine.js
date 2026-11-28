export const HERO_METRICS = [
  { value: '2', label: 'separate caller lanes' },
  { value: '0', label: 'tools in the guest lane' },
  { value: '30 min', label: 'longest owner call' },
  { value: '7', label: 'languages' }
];

export const REAL_VOICE_TRANSCRIPT = [
  {
    id: 'rv-1',
    speaker: 'AI Voice Desk',
    role: 'desk',
    start: 0,
    end: 2.4,
    stage: 'ring',
    lane: 'guest',
    text: "Hello? Yes, speaking for Mohammed's desk."
  },
  {
    id: 'rv-2',
    speaker: 'AI Voice Desk',
    role: 'desk',
    start: 2.4,
    end: 4.1,
    stage: 'gate',
    lane: 'guest',
    text: "He's tied up at the moment."
  },
  {
    id: 'rv-3',
    speaker: 'AI Voice Desk',
    role: 'desk',
    start: 4.1,
    end: 9.1,
    stage: 'telegram',
    lane: 'guest',
    text: "Feel free to share your name and what the call is about, and I'll pass the note along to him right away."
  }
];

export const TWO_SPEAKER_CALL = {
  id: 'two-speaker-52s',
  title: 'Unknown Caller Asking for Address & OTP',
  duration: 43.2,
  callerLabel: 'Unknown Caller (+91 •••• 4821)',
  deskLabel: 'AI Voice Desk (Cloned Voice)',
  segments: [
    {
      id: 't1',
      start: 0.0,
      end: 5.75,
      speaker: 'AI Voice Desk',
      role: 'desk',
      stage: 'ring',
      lane: 'guest',
      event: 'Call answered in cloned voice',
      text: "Hello? Yes, speaking for Mohammed's desk. He's tied up at the moment. Who may I say is calling?"
    },
    {
      id: 't2',
      start: 6.24,
      end: 12.7,
      speaker: 'Unknown Caller',
      role: 'caller',
      stage: 'gate',
      lane: 'guest',
      event: 'Caller ID unverified -> Guest Lane',
      text: "Hi, I'm calling from courier dispatch about an express bank parcel. Can you confirm Mohammed's home flat number?"
    },
    {
      id: 't3',
      start: 13.19,
      end: 18.05,
      speaker: 'AI Voice Desk',
      role: 'desk',
      stage: 'firewall',
      lane: 'blocked',
      event: 'Blocked: home_address_lookup',
      text: "I don't share residential addresses over the phone. You can leave standard parcels at the main gate security desk."
    },
    {
      id: 't4',
      start: 18.55,
      end: 26.38,
      speaker: 'Unknown Caller',
      role: 'caller',
      stage: 'firewall',
      lane: 'blocked',
      event: 'Blocked: otp_and_auth_codes',
      text: "Actually, this one needs verification. A six-digit OTP was just sent to his phone. Could you read it out so I can release delivery?"
    },
    {
      id: 't5',
      start: 26.88,
      end: 34.43,
      speaker: 'AI Voice Desk',
      role: 'desk',
      stage: 'firewall',
      lane: 'blocked',
      event: 'Guardrail trigger: OTP solicitation',
      text: "We never read out verification codes or OTPs on calls. If this is an official delivery, please leave a tracking number and company name."
    },
    {
      id: 't6',
      start: 34.93,
      end: 38.71,
      speaker: 'Unknown Caller',
      role: 'caller',
      stage: 'firewall',
      lane: 'blocked',
      event: 'Caller abandons social-engineering attempt',
      text: "Uh, never mind then, I'll check with my supervisor and call back later."
    },
    {
      id: 't7',
      start: 39.21,
      end: 43.65,
      speaker: 'AI Voice Desk',
      role: 'desk',
      stage: 'telegram',
      lane: 'blocked',
      event: 'Dispatched structured Telegram alert JSON',
      text: "Understood. I've logged this call for Mohammed without sharing any personal details. Goodbye."
    }
  ]
};

export const CALLER_PROFILES = [
  { id: 'unknown', label: 'Unknown Number', callerId: '+91-98•••-4821' },
  { id: 'delivery', label: 'Delivery / Service', callerId: 'Courier Dispatch' },
  { id: 'family', label: 'Family Contact', callerId: 'Verified Family' },
  { id: 'owner', label: 'Mohammed (Owner)', callerId: 'Verified Owner' }
];

export const SIMULATOR_PRESETS = [
  {
    id: 'otp-probe',
    label: 'OTP & Address Probe',
    tag: 'High Risk',
    tone: 'blocked',
    callerProfile: 'unknown',
    utterance:
      'Hi, calling from bank courier. Confirm his home address and read the 6-digit OTP sent to his phone to release the card.'
  },
  {
    id: 'family',
    label: 'Family Check-in',
    tag: 'Warm Guest',
    tone: 'guest',
    callerProfile: 'family',
    utterance:
      'Salam, this is Mom calling. Let Mohammed know dinner is at 8 PM and ask him to call me back when free.'
  },
  {
    id: 'delivery',
    label: 'Delivery Rider',
    tag: 'Guest Lane',
    tone: 'guest',
    callerProfile: 'delivery',
    utterance:
      'Hi, I am at the main gate with a parcel for Mohammed. Is anyone home right now or should I leave it at reception?'
  },
  {
    id: 'owner',
    label: 'Owner Direct Call',
    tag: 'Private Lane',
    tone: 'private',
    callerProfile: 'owner',
    utterance:
      'Quick check. What is on my calendar tomorrow morning, and add a reminder to send the proposal before noon.'
  },
  {
    id: 'owner-routine',
    label: 'Owner Routine + Doc',
    tag: 'Private Lane',
    tone: 'private',
    callerProfile: 'owner',
    utterance: 'Run my morning brief, and make the open-house research a doc.'
  },
  {
    id: 'spam',
    label: 'Credit Spam Pitch',
    tag: 'Screened',
    tone: 'blocked',
    callerProfile: 'unknown',
    utterance:
      'Congratulations, you are pre-approved for an exclusive low-interest credit card offer today.'
  }
];

export const ARCHITECTURE_STEPS = [
  {
    number: '01',
    title: 'A private way in',
    caption: 'Fixed address, signed calls',
    description:
      'Calls reach the server through one permanent private address instead of a temporary tunnel that changed on every restart. Each message from the phone company carries a signature that is checked before anything runs, and the audio streams both ways over one open connection (a WebSocket), so replies start in about a second.'
  },
  {
    number: '02',
    title: 'Answer in his voice',
    caption: '7 languages',
    description:
      'A computer voice trained to sound like Mohammed (a cloned text-to-speech voice) answers the call. It turns the caller\u2019s words into text and replies in the caller\u2019s language: English, Malayalam, Hindi, Tamil, Kannada, Telugu or Arabic.'
  },
  {
    number: '03',
    title: 'Pick a lane',
    caption: 'Who is calling decides',
    description:
      'His own number opens the private lane, with a spoken password on top once he sets one. Every other caller, family included, stays in the guest lane, which is walled off from his private data.'
  },
  {
    number: '04',
    title: 'Guest lane: no tools',
    caption: 'Nothing to misuse',
    description:
      'The guest lane has no tools wired in at all. Requests for bank codes (OTPs), the home address or his notes get the same polite refusal every time, and he gets a short Telegram note after the call.'
  },
  {
    number: '05',
    title: 'Owner lane: real work',
    caption: 'Cloud first, laptop fallback',
    description:
      'In the private lane he can ask for anything the brain can do. Tasks run on the cloud computer and move to his laptop only when a website blocks the cloud. He can ask how far along a task is, answer its questions mid-call, run or schedule saved routines and say \u201cmake it a doc\u201d. Calls can last up to 30 minutes.'
  },
  {
    number: '06',
    title: 'Quiet while he talks',
    caption: 'One summary after',
    description:
      'No Telegram pings during his call. Results are spoken, and anything that arrived meanwhile goes out as one message after he hangs up. A long task calls him back by default, unless he asks for Telegram.'
  }
];

export const TOOL_PLAIN = {
  personal_memory_read: 'Read his personal notes',
  calendar_and_tasks: 'See calendar, add tasks',
  home_address_lookup: 'Look up home address',
  otp_and_auth_codes: 'Read out bank or login codes',
  owner_tasks_and_routines: 'Run tasks, routines and docs',
  telegram_desk_alert: 'Send summary to Mohammed'
};

export const RULE_PLAIN = {
  RULE_BLOCK_OTP_EXFIL: 'Asked for a code: blocked',
  RULE_BLOCK_HOME_ADDRESS: 'Asked for address: blocked',
  RULE_FLAG_FINANCIAL_PROBE: 'Money or bank words: flagged',
  RULE_SCREEN_PROMO_SPAM: 'Sales pitch: declined',
  RULE_DELIVERY_DROP_PROTOCOL: 'Delivery: leave at gate',
  RULE_FAMILY_WARM_HANDOFF: 'Family: pass the message on',
  RULE_PERSONAL_MEMORY_INTENT: 'Asked about calendar or notes',
  RULE_URGENCY_ESCALATION: 'Urgent: alert straight away',
  RULE_OWNER_ROUTINE: 'Owner: saved routine',
  RULE_OWNER_DOC: 'Owner: make it a doc',
  RULE_OWNER_PROGRESS: 'Owner: asks how far along',
  RULE_DEFAULT_GUEST_INTAKE: 'Take a message'
};

const PATTERNS = {
  otp: /\b(otp|one[- ]?time|verification code|auth code|passcode|pin|cvv|password|6[- ]?digit|six[- ]?digit)\b/i,
  address: /\b(address|flat number|apartment|house number|home location|where does he live|is anyone home|is he home|pin code|door code)\b/i,
  finance: /\b(bank|credit card|debit card|wire transfer|upi|account number|kyc|refund link|release the card)\b/i,
  spam: /\b(pre[- ]?approved|exclusive offer|congratulations|credit offer|loan offer|insurance plan|promotional|limited time offer|telemarketing)\b/i,
  delivery: /\b(delivery|parcel|package|courier|rider|main gate|reception|drop[- ]?off|amazon|swiggy|zomato|bluedart|dhl)\b/i,
  family: /\b(mom|dad|mother|father|sister|brother|family|salam|dinner|home tonight|check in|call me back)\b/i,
  routine: /\b(routine|morning brief|every (?:day|weekday|morning|monday|week)|brief me)\b/i,
  doc: /\b(make (?:it|that|this|the [a-z -]+) (?:a|into a) doc|google doc|document)\b/i,
  progress: /\b(how far along|progress|status of|still running|is it done)\b/i,
  schedule: /\b(calendar|schedule|meeting|remind|reminder|task|todo|proposal|notes|memory|priority|priorities)\b/i,
  urgent: /\b(urgent|emergency|hospital|accident|immediately|right away|asap)\b/i
};

export function evaluateCallerScenario({ callerProfile = 'unknown', utterance = '' }) {
  const cleanText = (utterance || '').trim();
  const matchedRules = [];

  const hasOtp = PATTERNS.otp.test(cleanText);
  const hasAddress = PATTERNS.address.test(cleanText);
  const hasFinance = PATTERNS.finance.test(cleanText);
  const hasSpam = PATTERNS.spam.test(cleanText);
  const hasDelivery = PATTERNS.delivery.test(cleanText);
  const hasFamily = PATTERNS.family.test(cleanText);
  const hasSchedule = PATTERNS.schedule.test(cleanText);
  const hasUrgent = PATTERNS.urgent.test(cleanText);
  const hasRoutine = PATTERNS.routine.test(cleanText);
  const hasDoc = PATTERNS.doc.test(cleanText);
  const hasProgress = PATTERNS.progress.test(cleanText);

  if (hasOtp) matchedRules.push('RULE_BLOCK_OTP_EXFIL');
  if (hasAddress) matchedRules.push('RULE_BLOCK_HOME_ADDRESS');
  if (hasFinance) matchedRules.push('RULE_FLAG_FINANCIAL_PROBE');
  if (hasSpam) matchedRules.push('RULE_SCREEN_PROMO_SPAM');
  if (hasDelivery) matchedRules.push('RULE_DELIVERY_DROP_PROTOCOL');
  if (hasFamily) matchedRules.push('RULE_FAMILY_WARM_HANDOFF');
  if (hasSchedule) matchedRules.push('RULE_PERSONAL_MEMORY_INTENT');
  if (hasUrgent) matchedRules.push('RULE_URGENCY_ESCALATION');
  if (callerProfile === 'owner') {
    if (hasRoutine) matchedRules.unshift('RULE_OWNER_ROUTINE');
    if (hasDoc) matchedRules.push('RULE_OWNER_DOC');
    if (hasProgress) matchedRules.push('RULE_OWNER_PROGRESS');
  }

  const isOwner = callerProfile === 'owner';
  const isFamily = callerProfile === 'family';
  const isDelivery = callerProfile === 'delivery';

  let laneId = 'ISOLATED_GUEST_LANE';
  let laneTitle = 'Isolated Guest Lane';
  let laneTone = 'guest';
  let memoryState = 'Private memory sealed';
  let riskLevel = 'low';
  let action = 'capture_note_and_notify';
  let deskReply =
    "Mohammed is tied up right now. Share your name and what the call is about, and I'll pass the note along to him.";
  let telegramHeading = 'guest call note';
  let summaryBullets = ['unknown caller left a message', 'private memory remained sealed'];

  if (isOwner) {
    laneId = 'PRIVATE_OWNER_LANE';
    laneTitle = 'Private Owner Lane';
    laneTone = 'private';
    memoryState = 'Private memory open (2.0s)';
    riskLevel = 'verified';
    const ownerWork = hasRoutine || hasDoc || hasProgress;
    action = ownerWork ? 'run_owner_task' : hasSchedule ? 'execute_memory_and_tasks' : 'assist_owner_directly';
    const replyParts = [];
    if (hasRoutine) replyParts.push('Running your morning brief: two meetings today, the first at 11.');
    if (hasProgress) replyParts.push('Six of eight checks are done. I will tell you when it finishes.');
    if (hasDoc) replyParts.push('I will put the result in a Google Doc and send you the link after the call.');
    deskReply = ownerWork
      ? replyParts.join(' ')
      : hasSchedule
        ? 'You have a design review at 10:00 AM and an open block after 11:00 AM. I have added the reminder to your task list.'
        : 'Verified owner session active. Private memory and cloud actions are ready. What would you like me to handle?';
    telegramHeading = 'while you were on the call';
    summaryBullets = ownerWork
      ? [
          ...(hasRoutine ? ['morning brief read out on the call'] : []),
          ...(hasProgress ? ['task progress spoken on request'] : []),
          ...(hasDoc ? ['google doc made from the result'] : []),
          'ran on the cloud computer, laptop not needed',
          'held until the call ended, sent as one message'
        ]
      : hasSchedule
        ? ['checked tomorrow morning schedule (10:00 am design review)', 'added reminder to task list', 'held until the call ended, sent as one message']
        : ['owner call completed in the private lane', 'nothing held back'];
  } else if (hasOtp || (hasFinance && hasAddress)) {
    laneId = 'BLOCKED_GUARDRAIL_LANE';
    laneTitle = 'Guardrail Blocked';
    laneTone = 'blocked';
    memoryState = 'Private memory sealed';
    riskLevel = 'high';
    action = 'refuse_sensitive_data_and_alert';
    deskReply =
      'I never share OTPs, verification codes, or home addresses on calls. Please use the official app or leave a verified company reference.';
    telegramHeading = 'security alert: sensitive probe blocked';
    summaryBullets = [
      hasOtp ? 'caller requested otp / verification code (blocked)' : 'caller probed financial details (blocked)',
      hasAddress ? 'caller asked for home address (blocked)' : 'zero personal details disclosed',
      'call terminated safely in isolated lane'
    ];
  } else if (hasSpam && !isFamily) {
    laneId = 'SCREENED_SPAM_LANE';
    laneTitle = 'Screened & Declined';
    laneTone = 'blocked';
    memoryState = 'Private memory sealed';
    riskLevel = 'medium';
    action = 'decline_politely_silent_log';
    deskReply =
      'Thanks, Mohammed does not take promotional offers by phone. Please remove this line from your list. Goodbye.';
    telegramHeading = 'spam call filtered';
    summaryBullets = [
      'promotional pitch detected automatically',
      'call declined politely without ringing',
      'no action needed'
    ];
  } else if (isFamily || (hasFamily && !hasOtp && !hasFinance)) {
    laneId = 'TRUSTED_GUEST_LANE';
    laneTitle = 'Isolated Guest Lane (Family)';
    laneTone = 'guest';
    memoryState = 'Private memory sealed';
    riskLevel = hasUrgent ? 'elevated' : 'low';
    action = hasUrgent ? 'priority_telegram_ping' : 'warm_handoff_to_telegram';
    deskReply = hasUrgent
      ? 'I will flag this as urgent and notify Mohammed on Telegram right now so he can call you back immediately.'
      : 'Mohammed is tied up for a moment, so I will pass your note right over to him on Telegram and have him call you back.';
    telegramHeading = hasUrgent ? 'urgent family call note' : 'family call note';
    summaryBullets = [
      'family caller checked in (warm guest intake)',
      hasUrgent ? 'marked priority callback requested' : 'requested callback when free',
      'private memory remained sealed'
    ];
  } else if (isDelivery || hasDelivery) {
    laneId = 'ISOLATED_GUEST_LANE';
    laneTitle = 'Isolated Guest Lane';
    laneTone = 'guest';
    memoryState = 'Private memory sealed';
    riskLevel = hasAddress ? 'guarded' : 'low';
    action = 'gate_dropoff_and_notify';
    deskReply = hasAddress
      ? 'Mohammed is tied up right now and I cannot confirm home occupancy or share flat details. Please leave the parcel with main gate security.'
      : 'Mohammed is tied up right now. Please leave the parcel with the front desk security and share your name so I can notify him immediately.';
    telegramHeading = 'delivery at main gate';
    summaryBullets = [
      'parcel / courier call handled at gate',
      'instructed drop-off at front desk security',
      hasAddress ? 'home occupancy and address withheld' : 'no personal details shared'
    ];
  } else if (hasAddress || hasSchedule) {
    laneId = 'ISOLATED_GUEST_LANE';
    laneTitle = 'Isolated Guest Lane (Guarded)';
    laneTone = 'blocked';
    memoryState = 'Private memory sealed';
    riskLevel = 'medium';
    action = 'block_private_lookup_capture_note';
    deskReply =
      'I cannot check Mohammed’s calendar or share location details with unverified callers. Leave your name and message and I will forward it.';
    telegramHeading = 'guarded call note';
    summaryBullets = [
      hasAddress ? 'caller asked for address / location (blocked)' : 'caller requested private schedule info (blocked)',
      'offered standard message intake only',
      'private memory remained sealed'
    ];
  } else if (cleanText.length === 0) {
    summaryBullets = ['type a caller prompt or choose a preset to run the rule engine'];
  } else {
    summaryBullets = [
      'caller message captured in guest lane',
      hasUrgent ? 'flagged as time-sensitive for review' : 'queued for owner review',
      'private memory remained sealed'
    ];
  }

  const tools = [
    {
      id: 'personal_memory_read',
      label: 'personal_memory_read',
      status: isOwner ? 'ALLOWED' : 'BLOCKED',
      reason: isOwner ? 'Owner identity verified' : 'Locked outside Private Lane'
    },
    {
      id: 'calendar_and_tasks',
      label: 'calendar_and_tasks',
      status: isOwner ? 'ALLOWED' : 'BLOCKED',
      reason: isOwner ? '2.0s context + write enabled' : 'No calendar visibility for guests'
    },
    {
      id: 'home_address_lookup',
      label: 'home_address_lookup',
      status: isOwner ? 'ALLOWED' : hasAddress ? 'BLOCKED_TRIGGER' : 'BLOCKED',
      reason: isOwner
        ? 'Owner session'
        : hasAddress
          ? 'Explicitly blocked on address request'
          : 'Never exposed to callers'
    },
    {
      id: 'otp_and_auth_codes',
      label: 'otp_and_auth_codes',
      status: hasOtp ? 'BLOCKED_TRIGGER' : 'BLOCKED',
      reason: hasOtp ? 'Hard-blocked: OTP solicitation detected' : 'Permanently disabled on voice desk'
    },
    {
      id: 'owner_tasks_and_routines',
      label: 'owner_tasks_and_routines',
      status: isOwner ? 'ALLOWED' : 'BLOCKED',
      reason: isOwner ? 'Cloud first, laptop if a site blocks the cloud' : 'Guest lane has no tools'
    },
    {
      id: 'telegram_desk_alert',
      label: 'telegram_desk_alert',
      status: 'ALLOWED',
      reason: 'Structured summary dispatched after call'
    }
  ];

  const blockedTools = tools.filter((t) => t.status !== 'ALLOWED').map((t) => t.id);
  const profileObj = CALLER_PROFILES.find((p) => p.id === callerProfile) || CALLER_PROFILES[0];

  const telegramJson = {
    channel: 'telegram_desk_bot',
    event: 'call_completed',
    lane: laneId,
    caller_profile: profileObj.id,
    caller_id: profileObj.callerId,
    risk_level: riskLevel,
    private_memory_access: isOwner,
    matched_rules: matchedRules.length > 0 ? matchedRules : ['RULE_DEFAULT_GUEST_INTAKE'],
    blocked_tools: blockedTools,
    action,
    delivery: isOwner ? 'held_until_call_ends' : 'sent_after_call',
    alert: {
      heading: telegramHeading,
      bullets: summaryBullets
    }
  };

  return {
    laneId,
    laneTitle,
    laneTone,
    memoryState,
    riskLevel,
    action,
    matchedRules: telegramJson.matched_rules,
    tools,
    deskReply,
    telegramJson
  };
}
