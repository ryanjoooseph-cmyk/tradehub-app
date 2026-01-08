export const kpis = {
  escrowVolume: '$139,420',
  releaseSLA: 27,
  disputeRate: 2.3,
};

export const recentActivity = [
  { time:'09:12', event:'Milestone funded', details:'JOB-3522  •  $3,250  •  Client: Lee' },
  { time:'08:45', event:'Dispute opened', details:'JOB-3581  •  Electrical variation' },
  { time:'08:07', event:'KYC passed', details:'Trade ABN 45 987 654 321' },
];

export const disputes = [
  { caseId:'DSP-126', jobId:'JOB-3501', status:'Inspector assigned', sla:16 },
  { caseId:'DSP-128', jobId:'JOB-3603', status:'Evidence intake', sla:12 },
];

export function calendarEvents(){
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const at = (d:number,h:number)=> new Date(base.getFullYear(), base.getMonth(), base.getDate()+d, h, 0, 0);
  return [
    { id:'e1', title:'Install downlights — Nguyen', start: at(0,9),  end: at(0,11) },
    { id:'e2', title:'Quote: decking — Patel',     start: at(1,13), end: at(1,14) },
    { id:'e3', title:'Switchboard upgrade — K. Lee', start: at(2,8), end: at(2,10) },
  ];
}
