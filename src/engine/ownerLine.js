// The private owner lane, step by step. Every scenario is a made-up example;
// the behaviour (what is spoken, when it moves to the laptop, what is held
// back from Telegram) matches the real line.

export const OWNER_SCENARIOS = [
  {
    id: 'brief',
    label: 'Run my morning brief',
    tag: 'Saved routine',
    steps: [
      { at: 3, who: 'owner', text: 'Run my morning brief.' },
      { at: 5, who: 'desk', text: 'Running your morning brief.' },
      { at: 9, kind: 'work', text: 'Calendar read: two meetings, the first at 11.' },
      { at: 12, kind: 'work', text: 'Three people you know wrote overnight.' },
      { at: 14, kind: 'held', text: 'A background job finished. Its Telegram notice is held until you hang up.' },
      {
        at: 16,
        who: 'desk',
        kind: 'question',
        text: 'Two meetings today, the first at 11. Three people wrote overnight. Shall I read them out?',
        options: [
          { label: 'Read them out', reply: 'Yes, read them.', after: 'Reading all three, newest first.' },
          { label: 'Skip for now', reply: 'Skip, I will check later.', after: 'Okay. They stay unread.' }
        ]
      }
    ]
  },
  {
    id: 'doc',
    label: 'Research, then make it a doc',
    tag: 'Long task',
    steps: [
      { at: 3, who: 'owner', text: 'Find noise-cancelling earbuds under 5,000 rupees.' },
      { at: 6, who: 'desk', text: 'Checking. It may take a while.' },
      { at: 10, kind: 'work', text: 'Searching shops and review sites from the cloud.' },
      { at: 40, who: 'owner', text: 'How far along?' },
      { at: 42, who: 'desk', text: 'Six models compared so far, two left.' },
      {
        at: 50,
        who: 'desk',
        kind: 'question',
        text: 'One question before I finish: do they need to work well with an iPhone, or Android?',
        options: [
          { label: 'Android', reply: 'Android.', after: 'Got it. Finishing with Android in mind.' },
          { label: 'Does not matter', reply: 'Either is fine.', after: 'Okay. Finishing the comparison.' }
        ]
      },
      { at: 95, who: 'desk', text: 'Done. Two stand out, both under 4,500. Shall I go through them?' },
      { at: 99, who: 'owner', text: 'Make it a doc.' },
      { at: 104, kind: 'doc', text: 'Google Doc made: "earbuds under 5,000" (example).' }
    ]
  },
  {
    id: 'laptop',
    label: 'A site blocks the cloud',
    tag: 'Laptop fallback',
    steps: [
      { at: 3, who: 'owner', text: 'Check if the clinic has a slot on Saturday.' },
      { at: 6, who: 'desk', text: 'Checking.' },
      { at: 12, kind: 'work', text: 'Cloud browser opened the clinic site.' },
      { at: 20, kind: 'fallback', text: 'The site refused the cloud computer’s address (access denied). Moved to the laptop on the home connection, automatically.' },
      { at: 34, kind: 'work', text: 'Laptop: Saturday has 10:30 and 4:00 open.' },
      {
        at: 36,
        who: 'desk',
        kind: 'question',
        text: 'Saturday has 10:30 and 4:00. Which one should I hold?',
        options: [
          { label: '10:30', reply: 'Take 10:30.', after: 'Filled in up to the confirm page. Nothing is booked until you say yes.' },
          { label: '4:00', reply: 'Four is better.', after: 'Filled in up to the confirm page. Nothing is booked until you say yes.' }
        ]
      }
    ]
  },
  {
    id: 'schedule',
    label: 'Schedule a routine',
    tag: 'Scheduled',
    steps: [
      { at: 3, who: 'owner', text: 'Every weekday at 8, run my morning brief.' },
      { at: 6, kind: 'routine', text: 'Saved: "morning brief", weekdays at 8:00.' },
      {
        at: 8,
        who: 'desk',
        kind: 'question',
        text: 'Saved for 8 every weekday. Should I call you with it, or send it on Telegram?',
        options: [
          { label: 'Call me', reply: 'Call me.', after: 'I will call you at 8.' },
          { label: 'Telegram', reply: 'Telegram is fine.', after: 'It will be on Telegram at 8.' }
        ]
      }
    ]
  }
];

export const DELIVERY_CHOICES = [
  {
    id: 'callback',
    label: 'Call me back',
    note: 'The default. If he says nothing, "yes" or "okay", the line calls him back with the result.'
  },
  {
    id: 'telegram',
    label: 'Send it on Telegram',
    note: 'The result goes to Telegram as one message, together with anything held during the call.'
  },
  {
    id: 'none',
    label: 'No need',
    note: 'Nothing is sent. The line tells him at the start of his next call.'
  }
];

export const MAX_CALL_SECONDS = 30 * 60;

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
