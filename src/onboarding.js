const sports = ['Soccer', 'Basketball', 'Track & field', 'American football', 'Volleyball', 'Baseball', 'Swimming', 'Multiple sports'];
const field = (label, type = 'text', placeholder = '', options = null) => ({ label, type, placeholder, options });
const select = (label, options) => field(label, 'select', '', options);
const sport = () => select('Primary sport', sports);
const identity = () => [field('Full name', 'text', 'Your name'), field('Profile name', 'text', '@yourname'), field('Contact email', 'email', 'you@example.com'), field('City / region', 'text', 'City, state or country')];

export const journeys = {
  athlete: {
    label: 'Athlete', article: 'an athlete', steps: ['Your role', 'Athlete profile', 'Sport & goals', 'Your support team', 'Athlete verification', 'Access & privacy'],
    intro: 'Your game. Your next chapter.',
    description: 'Build a sports profile, find the right programs, and understand your next opportunity.',
    profile: ['Introduce your athlete profile.', 'Choose how people see you. Your date of birth and contact details stay private.', [...identity(), field('Date of birth', 'date'), sport()]],
    context: ['Where are you in your sports journey?', 'Add the context that makes discovery and college-fit insights useful. School and club details are optional.', [select('Level of play', ['Recreational', 'Club / travel', 'High school varsity', 'College', 'Professional']), field('Position / event', 'text', 'e.g. Center midfielder'), select('Academic stage', ['Prefer to add later', 'Middle school', 'High school', 'College', 'Alumni / not in education']), field('Graduation year (optional)', 'number', '2028'), field('School / college (optional)', 'text', 'Search or enter your school'), field('Club / team (optional)', 'text', 'Your current team'), select('Main goal', ['Explore better programs', 'Develop my game', 'Find college opportunities', 'Build my sports network'])]],
    connectionTitle: 'Put your support team in your corner.',
    connectionCopy: 'Invite people who support your progress. They choose whether to connect; nothing is shared automatically.',
    connections: [['Parent / guardian', 'Link a trusted adult to support your journey.', 'fa-people-roof'], ['Coach / mentor', 'Request a connection with your current coach.', 'fa-clipboard-user']],
    methods: [['School or team email', 'Use an address issued by your school or club.', 'email', 'School or team email'], ['Official roster link', 'Share your athlete page on an official team site.', 'url', 'Athlete roster URL'], ['Private participation proof', 'A registration or roster document can support eligibility.', 'file', 'Participation document']],
    privacy: ['Allow verified coaches to find my profile', 'Share my progress with accepted connections'],
    plans: [['Community', 'Free', 'Discovery, community, saved programs and reviews'], ['Insight Plus', '$14.99 / month', '30 monthly AI credits and analysis history']],
  },
  parent: {
    label: 'Parent / guardian', article: 'a parent', steps: ['Your role', 'Parent profile', 'Family priorities', 'Link your athlete', 'Parent verification', 'Family access'],
    intro: 'Their journey. Your perspective.',
    description: 'Make confident family decisions with trusted reviews, shared shortlists, and athlete connections.',
    profile: ['Create your parent profile.', 'These are your details. You can connect an athlete in a separate step.', [...identity(), select('Your relationship', ['Parent', 'Legal guardian', 'Family supporter'])]],
    context: ['What matters to your family?', 'Set discovery preferences without needing your child’s school, date of birth, or private information.', [sport(), select('Athlete age group', ['Prefer not to say', 'Under 13', '13–15', '16–18', 'College / adult']), select('Main priority', ['Positive coaching & safety', 'Player development', 'Academic balance', 'College exposure', 'Affordability']), select('Travel preference', ['Local only', 'Within my region', 'Open to travel']), select('Annual program budget', ['Not decided', 'Under $1,000', '$1,000–$3,000', '$3,000–$5,000', '$5,000+'])]],
    connectionTitle: 'Connect your athlete when you’re ready.',
    connectionCopy: 'Send a private invitation. The athlete accepts before profiles are linked; linking does not grant access to private messages.',
    connections: [['Athlete invitation', 'Use the email associated with their athlete account.', 'fa-person-running'], ['Another parent / guardian', 'Coordinate shortlists with a family member.', 'fa-people-roof']],
    methods: [['Confirm parent email', 'Verify the email attached to your own account.', 'email', 'Your email address'], ['Accepted athlete connection', 'An accepted invitation can support a family relationship.', 'text', 'Athlete profile name'], ['Private relationship proof', 'Provide supporting evidence only when required for a review.', 'file', 'Relationship document']],
    privacy: ['Allow accepted family members to see shared shortlists', 'Send updates about programs I follow'],
    plans: [['Community', 'Free', 'Reviews, discovery and family shortlists'], ['Insight Family', '$24.99 / month', '75 shared AI credits for linked athlete profiles']],
  },
  coach: {
    label: 'Coach / director', article: 'a coach', steps: ['Your role', 'Professional profile', 'Coaching experience', 'Team connections', 'Credentials', 'Profile visibility'],
    intro: 'Let your experience speak.',
    description: 'Show your coaching approach, connect with your team, and build a credible professional presence.',
    profile: ['Introduce yourself as a coach.', 'Create a professional profile that explains who you work with.', [...identity(), select('Professional role', ['Coach', 'Head coach', 'Athletic director', 'Program director', 'Trainer']), field('Professional website (optional)', 'url', 'https://')]],
    context: ['Tell us about your coaching.', 'Families need relevant experience and clear expectations—not your graduation year.', [sport(), select('Experience', ['Less than 1 year', '1–3 years', '4–7 years', '8+ years']), select('Athletes you work with', ['Youth', 'High school', 'College', 'Adult / professional', 'Multiple levels']), field('Current organization (optional)', 'text', 'Club, school or program'), field('Coaching specialty', 'text', 'e.g. Technical development'), field('Certification (optional)', 'text', 'Credential name and issuer')]],
    connectionTitle: 'Connect with your team.',
    connectionCopy: 'Request affiliation from an organization or invite colleagues. An invitation does not create a verified badge.',
    connections: [['Organization administrator', 'Ask an authorized administrator to confirm your role.', 'fa-building'], ['Coaching colleague', 'Build your professional support network.', 'fa-user-group']],
    methods: [['Organization email', 'Use your work address to confirm your affiliation.', 'email', 'Organization email'], ['Official staff directory', 'Link your profile on the organization’s public website.', 'url', 'Staff directory URL'], ['Coaching credential', 'Upload a certification or role-confirmation document.', 'file', 'Credential document']],
    privacy: ['Make my professional profile discoverable', 'Accept inquiries from verified families'],
    plans: [['Professional community', 'Free', 'Coaching profile, connections, community and review responses']],
  },
  agent: {
    label: 'Agent / advisor', article: 'an advisor', steps: ['Your role', 'Advisor profile', 'Services & expertise', 'Client connections', 'Professional verification', 'Contact preferences'],
    intro: 'Build trust before the first conversation.',
    description: 'Make your services, experience, and credentials clear to athletes and families.',
    profile: ['Create your advisor profile.', 'Show who you are and how you work with athletes.', [...identity(), field('Agency / business name (optional)', 'text', 'Independent or agency name'), field('Business website (optional)', 'url', 'https://')]],
    context: ['What expertise do you bring?', 'Describe your services and scope. Chinstrap does not imply a license or certification from a completed profile.', [sport(), select('Primary service', ['Athlete representation', 'Recruiting advice', 'Career guidance', 'NIL / brand partnerships', 'Other advisory services']), field('Regions served', 'text', 'e.g. United States, Europe'), select('Experience', ['Less than 1 year', '1–3 years', '4–7 years', '8+ years']), field('License / certification (optional)', 'text', 'Issuer and credential'), select('Client level', ['High school', 'College', 'Professional', 'Multiple levels'])]],
    connectionTitle: 'Build your professional network.',
    connectionCopy: 'Athletes and agencies must accept invitations before a working relationship appears on your profile.',
    connections: [['Agency representative', 'Request confirmation of your agency affiliation.', 'fa-building'], ['Athlete / client', 'Invite an existing client to connect with you.', 'fa-person-running']],
    methods: [['Business email', 'Confirm your professional contact address.', 'email', 'Business email'], ['Public professional listing', 'Link an official agency profile or credential listing.', 'url', 'Professional listing URL'], ['Private credential proof', 'Upload a license or business-affiliation document.', 'file', 'Credential document']],
    privacy: ['Show my services to verified athletes', 'Allow incoming professional inquiries'],
    plans: [['Professional community', 'Free', 'Advisor profile, verified connections and conversations']],
  },
  organization: {
    label: 'Organization', article: 'an organization', steps: ['Your role', 'Organization profile', 'Programs & services', 'Administrator team', 'Ownership verification', 'Workspace setup'],
    intro: 'Give your organization a trusted home.',
    description: 'Present your programs, invite your team, and help families see the full story.',
    profile: ['Introduce your organization.', 'Set up a new listing or prepare to claim an existing organization.', [field('Organization name', 'text', 'Official name'), select('Organization type', ['School', 'University', 'Club / academy', 'Travel team', 'League', 'Tournament organizer', 'Sports business']), field('Official website', 'url', 'https://'), field('City / region', 'text', 'City, state or country'), field('Administrator name', 'text', 'Your full name'), field('Administrator work email', 'email', 'you@organization.com')]],
    context: ['What does your organization offer?', 'Add the program details athletes and families use to find you.', [sport(), select('Participant level', ['Youth', 'High school', 'College', 'Adult', 'Multiple levels']), field('Programs / services', 'text', 'e.g. Academy, camps, competitive teams'), field('Service area', 'text', 'Local, regional or national'), select('Listing status', ['Create a new listing', 'Claim an existing listing']), field('Existing profile URL (optional)', 'url', 'https://')]],
    connectionTitle: 'Invite the people who manage your program.',
    connectionCopy: 'Assign a role to each invitation. Ownership must be confirmed before listing-management permissions are granted.',
    connections: [['Co-administrator', 'Help manage organization details and team access.', 'fa-user-gear'], ['Coach / staff member', 'Connect verified staff to the organization.', 'fa-clipboard-user']],
    methods: [['Official domain email', 'Verify an address on the organization’s domain.', 'email', 'Official organization email'], ['Public staff / ownership page', 'Link a public page showing your authorized role.', 'url', 'Authorization page URL'], ['Authorization document', 'Provide an organization-issued authorization letter.', 'file', 'Authorization document']],
    privacy: ['Publish organization contact information', 'Receive listing inquiries and review notifications'],
    plans: [['Organization workspace', 'Free', 'Public listing, team invitations and review management after approval']],
  },
};

let activeRole = 'parent';
let initialized = false;
const drafts = new Map();
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const grid = (fields) => `<div class="form-grid">${fields.map((f, i) => `<label>${escape(f.label)}${f.type === 'select' ? `<select data-setup-field="${i}"><option value="">Select an option</option>${f.options.map((o) => `<option>${escape(o)}</option>`).join('')}</select>` : `<input data-setup-field="${i}" type="${f.type}" placeholder="${escape(f.placeholder)}" ${f.type === 'number' ? 'min="1900" max="2100"' : ''} />`}</label>`).join('')}</div>`;
const heading = (title, copy) => `<h1>${escape(title)}</h1><p>${escape(copy)}</p>`;
const callout = (copy) => `<div class="setup-note"><i class="fa-solid fa-lock" aria-hidden="true"></i><span>${escape(copy)}</span></div>`;

export function getOnboardingRole() { return activeRole; }

export function selectOnboardingRole(role) {
  if (!journeys[role]) return;
  if (initialized && role === activeRole) return;
  if (initialized) document.querySelectorAll('.onboarding-step:not([data-step="1"]) input, .onboarding-step:not([data-step="1"]) select').forEach((el, i) => {
    drafts.set(`${activeRole}:${i}`, { value: el.type === 'file' ? '' : el.value, checked: el.checked });
  });
  initialized = true;
  activeRole = role;
  const j = journeys[role];
  document.querySelectorAll('[data-role-choice]').forEach((button) => {
    const selected = button.dataset.roleChoice === role;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.getElementById('onboarding-selection').textContent = `Setting up ${j.article} profile`;
  [j.profile, j.context].forEach(([title, copy, fields], i) => {
    document.querySelector(`.onboarding-step[data-step="${i + 2}"]`).innerHTML = heading(title, copy) + grid(fields) + callout(i === 0 ? 'Private contact details are never added to your public profile.' : 'You can add or update these details later in your profile.');
  });
  document.querySelector('.onboarding-step[data-step="4"]').innerHTML = heading(j.connectionTitle, j.connectionCopy) + `<div class="setup-invitations">${j.connections.map(([title, copy, icon], i) => `<article><i class="fa-solid ${icon}" aria-hidden="true"></i><div><h3>${escape(title)}</h3><p>${escape(copy)}</p><label>Email address<input type="email" placeholder="name@example.com" aria-label="${escape(title)} email" /></label><button type="button" class="button button--secondary button--small" data-setup-invite="${i}">Prepare invitation</button><small class="invite-status" role="status"></small></div></article>`).join('')}</div><button type="button" class="skip-link" data-setup-skip>Skip invitations for now →</button>`;
  document.querySelector('.onboarding-step[data-step="5"]').innerHTML = heading(`Verify your ${role === 'organization' ? 'authority to manage this listing' : role === 'parent' ? 'parent relationship' : 'professional connection'}.`.replace('professional connection', role === 'athlete' ? 'athlete affiliation' : 'professional connection'), 'Choose a method that fits your role, or finish this later. Evidence stays private; a completed form is not an approved verification.') + `<div class="verification-options">${j.methods.map(([name, description, type], i) => `<label><input type="radio" name="setup-verification" value="${i}" ${i === 0 ? 'checked' : ''} /><i class="fa-solid ${type === 'email' ? 'fa-envelope' : type === 'url' ? 'fa-link' : type === 'file' ? 'fa-file-shield' : 'fa-user-check'}" aria-hidden="true"></i><span><strong>${escape(name)}</strong><small>${escape(description)}</small></span></label>`).join('')}</div><div class="setup-proof-fields">${j.methods.map(([, , type, label], i) => `<div data-setup-proof="${i}" ${i ? 'hidden' : ''}>${grid([field(label, type, type === 'url' ? 'https://' : type === 'email' ? 'name@example.com' : '')])}</div>`).join('')}</div>${callout('Prototype preview: documents are not uploaded and no verification is performed.')}<button type="button" class="skip-link" data-setup-skip>Verify later →</button>`;
  document.querySelector('.onboarding-step[data-step="6"]').innerHTML = heading(role === 'organization' ? 'Make this workspace yours.' : `Your ${j.label.toLowerCase()} profile, your choices.`, 'Start with free access. Review what you share and choose whether extra tools are useful to you.') + `<div class="onboarding-plan-grid setup-plans">${j.plans.map(([name, price, copy], i) => `<label><input type="radio" name="setup-plan" value="${escape(name)}" ${i === 0 ? 'checked' : ''} /><span><small>${i ? 'OPTIONAL UPGRADE' : 'START HERE'}</small><strong>${escape(name)}</strong><em>${escape(price)}</em><b>${escape(copy)}</b></span></label>`).join('')}</div><div class="setup-privacy">${j.privacy.map((label) => `<label><span>${escape(label)}</span><input type="checkbox" /></label>`).join('')}</div><div class="setup-ready"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span><strong>Ready to explore as ${j.article}</strong><small>Connections and verification stay pending until confirmed. Paid plans are previews; no payment is collected.</small></span></div>`;
  document.querySelectorAll('.onboarding-step:not([data-step="1"]) input, .onboarding-step:not([data-step="1"]) select').forEach((el, i) => {
    const saved = drafts.get(`${role}:${i}`);
    if (saved && el.type !== 'file') { el.value = saved.value; el.checked = saved.checked; }
  });
  updateProofFields();
  document.querySelectorAll('[data-onboarding-jump]').forEach((button, i) => {
    button.querySelector('strong').textContent = j.steps[i];
    button.querySelector('small').textContent = ['Choose your experience', 'Introduce yourself', 'Personalize your journey', 'Optional invitations', 'Role-specific evidence', 'Review your preferences'][i];
  });
}

function updateProofFields() {
  const selected = document.querySelector('[name="setup-verification"]:checked')?.value || '0';
  document.querySelectorAll('[data-setup-proof]').forEach((el) => { el.hidden = el.dataset.setupProof !== selected; });
}

export function onboardingGuidance(role, step) {
  const j = journeys[role];
  return step === 1 ? [j.intro, j.description] : [j.steps[step - 1], ['Your details remain yours.', j.description, 'Invitations are optional. Each person controls whether to accept.', 'Complete verification when you’re ready to unlock verified actions.', 'You decide what to share. You can change these choices later.'][step - 2]];
}

document.addEventListener('change', (event) => {
  if (event.target.matches('[name="setup-verification"]')) updateProofFields();
});

document.addEventListener('click', (event) => {
  const invitation = event.target.closest('[data-setup-invite]');
  if (!invitation) return;
  const card = invitation.closest('article');
  const input = card.querySelector('input');
  if (!input.value.trim() || !input.checkValidity()) { input.reportValidity(); input.focus(); card.querySelector('.invite-status').textContent = 'Enter a valid email to prepare an invitation.'; return; }
  card.querySelector('.invite-status').textContent = `Invitation prepared for ${input.value.trim()}. Nothing sent in this prototype.`;
  invitation.textContent = 'Invitation prepared';
});
