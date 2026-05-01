export type UserRole = 'voter' | 'candidate' | 'volunteer';
export type ElectionPhase = 'registration' | 'verification' | 'voting' | 'results';

export interface ElectionStep {
  id: string;
  title: string;
  description: string;
  whatToDo: string;
  whyItMatters: string;
  whatLearned: string;
  requiredDocs: string[];
  estimatedTime: string;
  phase: ElectionPhase;
  details: string[];
}

export const ELECTION_PROCESS_DATA: Record<string, ElectionStep> = {
  // Voter Steps
  'voter-reg': {
    id: 'voter-reg',
    title: 'Voter Registration',
    description: 'Establish your legal eligibility to participate in upcoming elections through official identification systems like Aadhaar or EPIC.',
    whatToDo: 'Visit the official state election portal, provide your identity details, and verify your current residential address.',
    whyItMatters: 'Registration ensures you are assigned to the correct localized booth and prevents unauthorized double-voting.',
    whatLearned: 'You learned that registration is the cryptographic foundation of a secure democracy, linking a unique citizen to a single vote.',
    requiredDocs: ['Aadhaar Card', 'Proof of Residence', 'Age Certificate'],
    estimatedTime: '15 Minutes',
    phase: 'registration',
    details: ['Verify age (18+) & citizenship', 'Submit Address Info', 'Receive EPIC Number']
  },
  'voter-verify': {
    id: 'voter-verify',
    title: 'Identity Verification',
    description: 'Validation of your identity and residency credentials against high-integrity public records managed by the ECI.',
    whatToDo: 'Check your status via the National Voter Service Portal. Ensure your record is marked as "Verified" before polling day.',
    whyItMatters: 'This step guarantees that your vote cannot be spoofed and that your digital credentials are secure.',
    whatLearned: 'Verification confirms that the digital audit trail matches your real-world identity, ensuring no ghost voters.',
    requiredDocs: ['Voter ID Card', 'Aadhaar Link Status'],
    estimatedTime: '5 Minutes',
    phase: 'verification',
    details: ['Check Status on NVSP', 'Update if moved', 'Confirm Polling Booth Location']
  },
  'voter-prep': {
    id: 'voter-prep',
    title: 'Polling Preparation',
    description: 'Reviewing candidates, sample ballots, and identifying your assigned booth at the local school or community center.',
    whatToDo: 'Download your sample ballot. Review non-partisan guides on candidates and their manifestos.',
    whyItMatters: 'Preparedness reduces network congestion and ensures citizens are familiar with ballot structures prior to official validation.',
    whatLearned: 'Informed voters are the best defense against misinformation and help choose leadership based on merit.',
    requiredDocs: ['Sample Ballot (PDF)', 'Candidate Profile'],
    estimatedTime: '30 Minutes',
    phase: 'registration',
     details: ['Review Manifestos', 'Locate Booth on Map', 'Download Booth Slip']
  },
  'voter-vote': {
    id: 'voter-vote',
    title: 'Voting Day Process',
    description: 'The secure process of casting your official ballot using an EVM with VVPAT audit trail.',
    whatToDo: 'Bring your Voter ID to the booth. Verify your name matches the roll, receive your slip, and cast your vote on the EVM.',
    whyItMatters: 'This is the terminal action where your voice directly influences the legislative vector of the country.',
    whatLearned: 'The EVM-VVPAT combo provides a dual audit path—electronic for speed, and physical for ultimate verification.',
    requiredDocs: ['EPIC Card', 'Booth Slip'],
    estimatedTime: '20 - 45 Minutes',
    phase: 'voting',
    details: ['ID Authentication', 'Cast Vote on EVM', 'Verify VVPAT Slip']
  },
  'voter-results': {
    id: 'voter-results',
    title: 'Post-Voting & Results',
    description: 'Final tally verification and auditing of the results through a transparent multi-node counting process.',
    whatToDo: 'Use your anonymous tracking ID to see when your ballot is officially counted in the public ledger.',
    whyItMatters: 'Transparency in counting builds public trust and ensures every legal vote is included.',
    whatLearned: 'Democratic results are validated through multiple witnesses and cryptographic hashing of total tallies.',
    requiredDocs: ['Tracking ID'],
    estimatedTime: '1 - 2 Days',
    phase: 'results',
    details: ['Live Tally Monitoring', 'Verify Audit Trail', 'Download Final Report']
  },

  // Candidate Steps
  'cand-file': {
    id: 'cand-file',
    title: 'Candidacy Filing',
    description: 'Submission of candidacy forms, affidavits, and official financial disclosures to the returning officer.',
    whatToDo: 'Submit your Declaration of Intent, pay the required security deposit, and declare your criminal and financial history.',
    whyItMatters: 'Formal filing ensures all candidates meet constitutional and local eligibility requirements.',
    whatLearned: 'Public disclosures act as a transparency filter, allowing voters to see the financial and legal background of leaders.',
    requiredDocs: ['Affidavit for ASSETS', 'Intent Form', 'No-Objection Certificate'],
    estimatedTime: '2 Hours',
    phase: 'registration',
    details: ['Submit Affidavit', 'Pay Security Deposit', 'Declare Support Base']
  },
  'cand-verify': {
    id: 'cand-verify',
    title: 'Compliance Audit',
    description: 'Pass the rigorous non-partisan background and campaign integrity verification by the Judicial Node.',
    whatToDo: 'Access the candidate portal to initiate your interactive compliance audit. Provide requested financial disclosures and wait for the integrity check.',
    whyItMatters: 'Ensures that all system participants meet the ethical standards and prevents corruption vectors.',
    whatLearned: 'Compliance audits prevent candidates with serious criminal records or hidden interests from compromising the election.',
    requiredDocs: ['Tax Returns', 'Criminal Record Check'],
    estimatedTime: '3 Days',
    phase: 'verification',
    details: ['Ethics Review', 'Asset Search', 'Affidavit Matching']
  },
  'cand-approval': {
    id: 'cand-approval',
    title: 'Approval/Completion',
    description: 'Official certification of your candidacy and publication to the official list of contesting candidates.',
    whatToDo: 'Review your certified candidacy status. Once confirmed, you will be redirected to complete your personal voter registration.',
    whyItMatters: 'Certification is the final requirement before your name is legally allowed to appear on any polling device.',
    whatLearned: 'Certification completes the legal loop, turning an applicant into an official participant in the democratic race.',
    requiredDocs: ['Form 7A Certification'],
    estimatedTime: '1 Day',
    phase: 'results',
    details: ['Status Publication', 'Download Certificate', 'Proceed to Voter Flow']
  },

  // Volunteer Steps
  'vol-training': {
    id: 'vol-training',
    title: 'Systems Training',
    description: 'Complete the certification module for assisting at polling booths and processing EVMs.',
    whatToDo: 'Engage with the interactive training modules, pass the safety quiz, and sign the official NDA to receive your Volunteer ID.',
    whyItMatters: 'Knowledgeable oversight prevents technical bottlenecks and ensures every user is supported.',
    whatLearned: 'Training ensures that poll workers act as neutral guardians of the process, following strict legal SOPs.',
    requiredDocs: ['NDA', 'Volunteer Application'],
    estimatedTime: '1 Hour',
    phase: 'registration',
    details: ['System Operations', 'User Support Ethics', 'Sign Secrecy NDA']
  },
  'vol-assign': {
    id: 'vol-assign',
    title: 'Station Assignment',
    description: 'Deployment to a specific polling booth and role assignment based on skill level.',
    whatToDo: 'Select your preferred shift and station. Review your assigned role and booth supervisor contact information.',
    whyItMatters: 'Strategic deployment ensures high-traffic nodes have sufficient staff to maintain 100% parity.',
    whatLearned: 'Booth assignment is optimized via AI to balance experience and language needs across diverse districts.',
    requiredDocs: ['Volunteer ID'],
    estimatedTime: '15 Minutes',
    phase: 'verification',
    details: ['Select Shift', 'Accept Booth Node', 'Review Operations Manual']
  },
  'vol-booth': {
    id: 'vol-booth',
    title: 'Booth Operations',
    description: 'Active management of voter check-ins, queue flow, and EVM support.',
    whatToDo: 'Operate the polling console. Verify voter IDs, manage the queue, and escalate security alerts as needed.',
    whyItMatters: 'This is the front-line of election integrity, ensuring smooth participation for all citizens.',
    whatLearned: 'Daily operations teach you the reality of ground-level democracy—handling real people and real technical challenges.',
    requiredDocs: ['System Access Token'],
    estimatedTime: 'Simulation',
    phase: 'voting',
    details: ['Aadhaar/EPIC Check-in', 'EVM Monitoring', 'Issue Resolution']
  },
  'vol-closing': {
    id: 'vol-closing',
    title: 'Closing Protocol',
    description: 'Secure teardown, EVM sealing, and final transmission of the booth tally.',
    whatToDo: 'Initialize the closing sequence, seal the physical EVM units, and transmit the final encrypted audit report.',
    whyItMatters: 'Ensures the chain of custody for all ballots is preserved for the regional audit.',
    whatLearned: 'Closing protocols prevent late-night ballot tampering and ensure the data matches the physical count perfectly.',
    requiredDocs: ['Eclectronically Sealed Tape', 'Form 17C Report'],
    estimatedTime: '30 Minutes',
    phase: 'results',
    details: ['Seal EVM Units', 'Transmit Digital Log', 'Shutdown Terminal']
  }
};

export const ROLE_FLOWS: Record<UserRole, string[]> = {
  voter: ['voter-reg', 'voter-verify', 'voter-vote', 'voter-results'],
  candidate: ['cand-file', 'cand-verify', 'cand-approval'],
  volunteer: ['vol-training', 'vol-assign', 'vol-booth', 'vol-closing']
};

export const PHASE_CONFIG = [
  { id: 'registration', label: 'Registration', icon: 'UserPlus', deadline: 'Ends: Oct 12, 2026' },
  { id: 'verification', label: 'Verification', icon: 'ShieldCheck', deadline: 'Ends: Oct 25, 2026' },
  { id: 'voting', label: 'Voting', icon: 'Vote', deadline: 'Date: Nov 05, 2026' },
  { id: 'results', label: 'Results', icon: 'BarChart', deadline: 'Date: Nov 08, 2026' }
];
