export const TRANSCRIPT_SEGMENTS = [
  {
    id: 'greet',
    start: 0,
    end: 2.4,
    text: "Hello? Yes, speaking for Mohammed's desk."
  },
  {
    id: 'status',
    start: 2.4,
    end: 4.1,
    text: "He's tied up at the moment."
  },
  {
    id: 'capture',
    start: 4.1,
    end: 9.5,
    text: "Feel free to share your name and what the call is about, and I'll pass the note along to him right away."
  }
];

export const HERO_METRICS = [
  {
    value: '2.0s',
    label: 'Memory recall',
    detail: 'Fast personal context when Mohammed calls directly.'
  },
  {
    value: '5',
    label: 'Languages supported',
    detail: 'Matches the caller naturally without breaking stride.'
  },
  {
    value: '$0',
    label: 'Extra server spend',
    detail: 'Runs cleanly on existing setup with zero new servers.'
  }
];

export const CALLER_PRESETS = [
  {
    id: 'owner',
    label: 'Owner Direct Call',
    shortRole: 'Verified identity',
    laneTitle: 'Private Owner Lane',
    laneTone: 'private',
    memoryState: 'Private memory unlocked',
    summaryLine: 'Direct line to personal memory, schedule, and cloud actions.',
    dialogue: [
      {
        speaker: 'Mohammed',
        role: 'caller',
        text: 'Quick check — what is on my calendar tomorrow morning, and remind me to send the proposal before noon.'
      },
      {
        speaker: 'AI Voice Desk',
        role: 'desk',
        text: 'You have a design review at 10:00 AM and an open block after 11:00 AM. I have added the proposal reminder to your task list.'
      }
    ],
    visibility: [
      'Reads personal calendar, notes, and active priorities in 2.0s',
      'Can trigger cloud tasks and update reminders on command',
      'Protected behind strict owner verification'
    ],
    blocked: 'Nothing restricted for verified owner.',
    telegram: {
      heading: 'owner call log',
      lines: [
        'checked tomorrow morning schedule (10:00 am design review)',
        'added reminder: send proposal before noon',
        'action completed in private lane'
      ]
    }
  },
  {
    id: 'delivery',
    label: 'Delivery Rider',
    shortRole: 'Routine errand',
    laneTitle: 'Isolated Guest Lane',
    laneTone: 'guest',
    memoryState: 'Private memory sealed',
    summaryLine: 'Helpful handling for drop-offs without sharing location or schedule.',
    dialogue: [
      {
        speaker: 'Delivery Rider',
        role: 'caller',
        text: 'Hi, I am at the main gate with a parcel for Mohammed. Is anyone home right now?'
      },
      {
        speaker: 'AI Voice Desk',
        role: 'desk',
        text: 'Mohammed is tied up right now. Please leave the parcel with the front desk security and share your name so I can notify him immediately.'
      }
    ],
    visibility: [
      'Public greeting and calm drop-off instructions only',
      'Captures caller name, item, and urgency for a quick note',
      'Never confirms whether Mohammed is home or away'
    ],
    blocked: 'Calendar, home status, personal notes, and contacts remain completely invisible.',
    telegram: {
      heading: 'delivery at main gate',
      lines: [
        'parcel arrived at the gate',
        'asked rider to leave it with front desk security',
        'no personal details shared'
      ]
    }
  },
  {
    id: 'networking',
    label: 'Networking Caller',
    shortRole: 'New introduction',
    laneTitle: 'Isolated Guest Lane',
    laneTone: 'guest',
    memoryState: 'Private memory sealed',
    summaryLine: 'Warm, executive-ready intake that captures context without leaking private work.',
    dialogue: [
      {
        speaker: 'Networking Caller',
        role: 'caller',
        text: 'Hi, this is Arjun from a product meetup last week. Wanted to see if Mohammed has time to chat about a collaboration.'
      },
      {
        speaker: 'AI Voice Desk',
        role: 'desk',
        text: 'Thanks for calling, Arjun. Mohammed is unavailable at the moment, so I will pass along your note about the collaboration and let him follow up directly.'
      }
    ],
    visibility: [
      'Answers in Mohammed’s natural voice with a calm, polite tone',
      'Captures name, topic, and preferred follow-up window',
      'Hands decision back to Mohammed via Telegram'
    ],
    blocked: 'Active projects, calendar availability, and private history are never exposed.',
    telegram: {
      heading: 'networking call note',
      lines: [
        'arjun from last week product meetup',
        'wants to discuss a possible collaboration',
        'waiting on your reply to schedule'
      ]
    }
  },
  {
    id: 'spam',
    label: 'Spam Call',
    shortRole: 'Unsolicited pitch',
    laneTitle: 'Screened & Declined',
    laneTone: 'blocked',
    memoryState: 'Private memory sealed',
    summaryLine: 'Detects sales scripts early and ends the call politely without disturbing Mohammed.',
    dialogue: [
      {
        speaker: 'Unknown Caller',
        role: 'caller',
        text: 'Congratulations! You have been selected for an exclusive pre-approved credit offer today—'
      },
      {
        speaker: 'AI Voice Desk',
        role: 'desk',
        text: 'Thanks, Mohammed does not take promotional offers by phone. Please remove this line from your list. Goodbye.'
      }
    ],
    visibility: [
      'Identifies unsolicited promotional script within seconds',
      'Ends the call cleanly with zero phone interruption',
      'Logs a quiet one-line record for transparency'
    ],
    blocked: 'Zero personal data, zero confirmation of identity, zero ring interruption.',
    telegram: {
      heading: 'spam call filtered',
      lines: [
        'promotional credit pitch screened automatically',
        'call ended politely without ringing',
        'no action needed'
      ]
    }
  }
];

export const ARCHITECTURE_STEPS = [
  {
    number: '01',
    title: 'Phone Call',
    caption: 'Answered in seconds',
    description:
      'Every incoming call is picked up calmly in Mohammed’s cloned voice, in any of 5 supported languages.'
  },
  {
    number: '02',
    title: 'Two-Lane Router',
    caption: 'Strict identity split',
    description:
      'Checks who is calling right away. Mohammed enters the private lane; all other callers stay in an isolated guest lane.'
  },
  {
    number: '03',
    title: 'Fast Memory or Cloud Execution',
    caption: 'Right depth, right caller',
    description:
      'Owner calls reach 2.0s personal memory and cloud tasks. Guest calls get helpful intake while private data stays locked.'
  },
  {
    number: '04',
    title: 'Telegram Summary',
    caption: 'Clean, actionable note',
    description:
      'The moment the call ends, a short plain-English summary arrives in Telegram so Mohammed never misses what matters.'
  }
];
