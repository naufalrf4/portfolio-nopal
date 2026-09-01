import {
  GLYPH_CONTRACT,
  GLYPH_FREELANCE,
  GLYPH_FULLTIME,
  GLYPH_MENTORING,
  GLYPH_REMOTE,
  GLYPH_SPEAKING,
  MOTIF_AI,
  MOTIF_AUTOMATION,
  MOTIF_IOT,
  MOTIF_MENTORING,
  MOTIF_NETWORK,
  MOTIF_SPEAKING,
  MOTIF_WEB,
  STAGE_BRIEF,
  STAGE_BUILD,
  STAGE_DEAL,
  STAGE_REVIEW,
  STAGE_REVISE,
  STAGE_SHIP,
} from './motifs';

export interface TechnicalService {
  readonly index: string;
  readonly motif: string;
  readonly title: string;
  readonly outcome: string;
  readonly description: string;
  readonly stack: readonly string[];
}

export interface BeyondCodeOffer {
  readonly motif: string;
  readonly title: string;
  readonly outcome: string;
  readonly description: string;
}

export interface ProcessStep {
  readonly step: string;
  readonly phase: string;
  readonly motif: string;
  readonly title: string;
  readonly timing: string;
  readonly description: string;
  readonly youBring: string;
  readonly youGet: string;
}

export interface EngagementType {
  readonly label: string;
  readonly fit: string;
  readonly glyph: string;
  readonly detail: string;
  readonly signals: readonly string[];
}

export interface WorkingDetail {
  readonly label: string;
  readonly value: string;
}

export interface AvailabilityCopy {
  readonly label: string;
  readonly dotClass: string;
  readonly pulse: boolean;
}

export const AVAILABILITY_COPY: Record<string, AvailabilityCopy> = {
  available: { label: 'Open to new work', dotClass: 'bg-green', pulse: true },
  busy: { label: 'Deep in something right now', dotClass: 'bg-amber', pulse: false },
  unavailable: { label: 'Not taking new engagements', dotClass: 'bg-text-tertiary', pulse: false },
};

export const technicalServices: readonly TechnicalService[] = [
  {
    index: '01',
    motif: MOTIF_WEB,
    title: 'Full-Stack Web & Product Development',
    outcome: 'A product that runs end to end, not a demo with a database attached.',
    description:
      'I build the whole thing: Next.js on the front, Laravel or Node underneath, Postgres or MySQL holding the data, deployed and monitored so it keeps running after launch day instead of needing you on call.',
    stack: ['Next.js', 'Laravel', 'PostgreSQL'],
  },
  {
    index: '02',
    motif: MOTIF_NETWORK,
    title: 'System Integration',
    outcome: 'Five tools that finally behave like one system.',
    description:
      'Most stacks do not fail at the parts, they fail in between them. I build the layer that holds them together: authenticated APIs, data flow you can actually observe, and infrastructure another engineer can pick up without calling you.',
    stack: ['REST', 'AWS', 'Postgres'],
  },
  {
    index: '03',
    motif: MOTIF_IOT,
    title: 'IoT & Hardware Builds',
    outcome: 'Hardware that keeps reporting after you walk away.',
    description:
      'ESP32 sensor networks over MQTT, feeding telemetry and control dashboards. Built for sites where power cuts and signal drops, so reconnecting is the firmware’s job and not your 2am problem.',
    stack: ['ESP32', 'MQTT', 'Telemetry'],
  },
  {
    index: '04',
    motif: MOTIF_AUTOMATION,
    title: 'Automation Workflows',
    outcome: 'The morning routine nobody should still be doing by hand.',
    description:
      'Every process has a step someone repeats manually before the day starts. I move those into n8n and Python pipelines with retries and alerting, so no news is genuinely good news.',
    stack: ['n8n', 'Python', 'Alerting'],
  },
  {
    index: '05',
    motif: MOTIF_AI,
    title: 'AI Integration',
    outcome: 'An assistant that cites your data instead of inventing it.',
    description:
      'Wrapping a model API is the easy part. The work is retrieval that surfaces the right document, answers that stay inside what you actually know, and behaviour that holds up under real questions.',
    stack: ['RAG', 'LangChain', 'pgvector'],
  },
];

export const beyondTheCode: readonly BeyondCodeOffer[] = [
  {
    motif: MOTIF_SPEAKING,
    title: 'Speaking',
    outcome: 'Talks built from systems that shipped, not slides that circulate.',
    description:
      'Sessions on automation, IoT, and AI systems for campus and community audiences. The failures stay in the deck, because that is usually the part people learn from.',
  },
  {
    motif: MOTIF_MENTORING,
    title: 'Mentoring',
    outcome: 'A shortcut past the mistakes I already paid for.',
    description:
      'One-on-one or small groups for students building their first real system: code review, architecture direction, and a straight answer on what to learn next instead of everything at once.',
  },
];

export const processSteps: readonly ProcessStep[] = [
  {
    step: '01',
    phase: 'Brief',
    motif: STAGE_BRIEF,
    title: 'Tell me what you need',
    timing: 'Day one',
    description:
      'Not the stack you think you need. What breaks, what is slow, what keeps landing back on your desk.',
    youBring: 'A rough description, plus whatever already exists.',
    youGet: 'Questions that narrow it down to the real constraint.',
  },
  {
    step: '02',
    phase: 'Deal',
    motif: STAGE_DEAL,
    title: 'Agree on the shape',
    timing: 'A day or two',
    description:
      'Scope, price, and timeline written down before anything starts. If it is outside my lane, you hear that here instead of three weeks in.',
    youBring: 'Your deadline and whatever budget shape you have.',
    youGet: 'A written scope with milestones and a fixed price.',
  },
  {
    step: '03',
    phase: 'Build',
    motif: STAGE_BUILD,
    title: 'I build in the open',
    timing: 'Milestone by milestone',
    description:
      'Work lands in milestones you can actually run, not a black box that opens at the end. Progress is visible whether or not you ask.',
    youBring: 'Access to whatever the system needs to talk to.',
    youGet: 'Working software at every milestone, not screenshots.',
  },
  {
    step: '04',
    phase: 'Review',
    motif: STAGE_REVIEW,
    title: 'You try it for real',
    timing: 'Each milestone',
    description:
      'You use it the way your users will, on your own data. Anything that feels wrong gets written down rather than politely ignored.',
    youBring: 'An honest run-through and the edge cases you know about.',
    youGet: 'A demo, a changelog, and a list of what is still open.',
  },
  {
    step: '05',
    phase: 'Revise',
    motif: STAGE_REVISE,
    title: 'We fix what the review found',
    timing: 'Before sign-off',
    description:
      'Revisions inside the agreed scope are part of the price, not a change request. Anything genuinely new gets quoted honestly instead of absorbed quietly.',
    youBring: 'Priorities, when there is more to fix than time to fix it.',
    youGet: 'The agreed fixes done, and a straight answer on the rest.',
  },
  {
    step: '06',
    phase: 'Ship',
    motif: STAGE_SHIP,
    title: 'It goes live and stays yours',
    timing: 'Handover',
    description:
      'Deployed, documented, and handed over so your team can run it without me. No lock-in, no undocumented magic, no calls required.',
    youBring: 'Where it should live and who needs access.',
    youGet: 'Source, deploy setup, docs, and a short support window.',
  },
];

export const engagementTypes: readonly EngagementType[] = [
  {
    label: 'Freelance',
    fit: 'Project-based',
    glyph: GLYPH_FREELANCE,
    detail: 'A scoped build with one clear deliverable. Best when the problem has an edge to it.',
    signals: ['Fixed price', 'One deliverable'],
  },
  {
    label: 'Contract',
    fit: '3-6 months',
    glyph: GLYPH_CONTRACT,
    detail: 'Ongoing engineering capacity, delivered in milestones you can review as they land.',
    signals: ['Milestone billing', 'Reviewable'],
  },
  {
    label: 'Full-time',
    fit: 'Hiring',
    glyph: GLYPH_FULLTIME,
    detail: 'Open to teams where systems, automation, and AI work actually sit next to each other.',
    signals: ['Long horizon', 'Systems role'],
  },
  {
    label: 'Remote',
    fit: 'GMT+7',
    glyph: GLYPH_REMOTE,
    detail: 'Based in Depok, Indonesia. Comfortable with async work and written handoffs.',
    signals: ['Async first', 'Written handoff'],
  },
  {
    label: 'Speaking engagement',
    fit: 'Events',
    glyph: GLYPH_SPEAKING,
    detail: 'Campus and community sessions on automation, IoT, and AI systems.',
    signals: ['Campus', 'Community'],
  },
  {
    label: 'Mentoring',
    fit: 'Students',
    glyph: GLYPH_MENTORING,
    detail: 'One-on-one or small groups, aimed at getting a first real system finished.',
    signals: ['1-on-1', 'Small group'],
  },
];

export const workingDetails: readonly WorkingDetail[] = [
  { label: 'Based in', value: 'Depok, Indonesia' },
  { label: 'Timezone', value: 'GMT+7, async friendly' },
  { label: 'Reply time', value: 'Within a day, usually' },
  { label: 'Languages', value: 'English, Bahasa Indonesia' },
];

export const servedAreas: readonly string[] = ['Indonesia', 'Jakarta', 'Depok', 'Jabodetabek'];
