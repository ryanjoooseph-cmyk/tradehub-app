import { Card } from '@/components/Card';
import { kpis, recentActivity, disputes } from '@/lib/sampleData';

export default function DashboardPage(){
  return (
    <div className="grid">
      <div style={{gridColumn:'span 4'}}>
        <Card title="Escrow volume"><div className="kpi">{kpis.escrowVolume}</div><div className="sub">Last 30 days</div></Card>
      </div>
      <div style={{gridColumn:'span 4'}}>
        <Card title="Release SLA"><div className="kpi">{kpis.releaseSLA}h</div><div className="sub">p95</div></Card>
      </div>
      <div style={{gridColumn:'span 4'}}>
        <Card title="Dispute rate"><div className="kpi">{kpis.disputeRate}%</div><div className="sub">of milestones</div></Card>
      </div>
      <div style={{gridColumn:'span 7'}}>
        <Card title="Recent activity">
          <table className="table">
            <thead><tr><th>Time</th><th>Event</th><th>Details</th></tr></thead>
            <tbody>{recentActivity.map((r,i)=>(<tr key={i}><td>{r.time}</td><td>{r.event}</td><td>{r.details}</td></tr>))}</tbody>
          </table>
        </Card>
      </div>
      <div style={{gridColumn:'span 5'}}>
        <Card title="Live disputes">
          <table className="table">
            <thead><tr><th>Case</th><th>Job</th><th>Status</th><th>SLA</th></tr></thead>
            <tbody>
              {disputes.map((d,i)=>(
                <tr key={i}>
                  <td>{d.caseId}</td><td>{d.jobId}</td>
                  <td><span className="badge dot">{d.status}</span></td><td>{d.sla}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
