export const patientOneInformation = {
  name: 'Gilda Shields',
  address: '9914 Maia Locks',
  phoneNumbers: [
    { type: 'cell', number: '111-111-1111' },
    { type: 'home', number: '222-222-2222' },
  ],
  email: 'gilda@gmail.com',
  lastVisit: '02/04/19',
  reason: 'Foot pain',
  diagnosis: 'Stubbed toe',
  totalNumberOfSessions: 1,
  notes: 'N/A',
  sessions: [
    {
      number: 1,
      date: '02/04/19',
      notes: 'N/A',
      confirmed: true,
    },
  ],
};

export const patientTwoInformation = {
  name: 'Barrett Hilpert',
  address: '269 Tillman Court',
  phoneNumbers: [{ type: 'cell', number: '333-333-3333' }],
  email: 'barrett@gmail.com',
  lastVisit: '02/05/19',
  reason: 'Hurt back while exercising',
  diagnosis: 'Strained muscle',
  totalNumberOfSessions: 2,
  notes: 'Wear a lifting belt',
  sessions: [
    {
      number: 1,
      date: '02/04/19',
      notes: 'N/A',
      confirmed: true,
    },
    {
      number: 2,
      date: '02/05/19',
      notes: 'N/A',
      confirmed: true,
    },
  ],
};

export const incompletePatientInformation = {
  phoneNumbers: [{ type: 'cell', number: '444-444-4444' }],
  email: 'barrett@gmail.com',
  lastVisit: '02/05/19',
  diagnosis: 'Headaches',
  totalNumberOfSessions: 1,
  notes: 'Take baby aspirin',
  sessions: [
    {
      number: 1,
      date: '02/04/19',
      notes: 'Working too much',
      confirmed: true,
    },
  ],
};
