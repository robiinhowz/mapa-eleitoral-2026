import { UserRound } from 'lucide-react';
import helena from '@/assets/candidate-helena.jpg';
import rafael from '@/assets/candidate-rafael.jpg';
import { formatNumber, formatPercent } from '@/lib/election-demo';
const photos:Record<string,string>={helena,rafael};
export type CandidateResult={id:string;name:string;party:string;percent:number;votes:number;className:string;initials:string};
export function CandidateCard({candidate,rank}:{candidate:CandidateResult;rank:number}) {
 return <article className={`candidate-card ${candidate.className}`}><div className="candidate-top"><div className="candidate-photo">{photos[candidate.id]?<img src={photos[candidate.id]} alt={`Retrato fictício de ${candidate.name}`} width={64} height={64} loading="lazy"/>:<UserRound size={26}/>}</div><div className="min-w-0"><h3>{candidate.name}</h3><p>{candidate.party}</p></div><span className="rank">{rank}º</span></div><div className="candidate-numbers"><span><strong>{formatNumber(candidate.votes)}</strong><small>votos</small></span><b>{formatPercent(candidate.percent)}<small>%</small></b></div><div className="candidate-progress" role="meter" aria-label={`Percentual de ${candidate.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={candidate.percent}><span style={{width:`${candidate.percent}%`}}/></div></article>
}
