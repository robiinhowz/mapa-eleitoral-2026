import { Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { regions, regionClass, type Region } from '@/lib/election-demo';
export function RegionFilter({value,onChange}:{value:Region|null;onChange:(value:Region|null)=>void}) {
 return <div className="region-filter" aria-label="Filtrar por região"><Button variant="ghost" className={value===null?'region-option active':'region-option'} aria-pressed={value===null} onClick={()=>onChange(null)}><Globe2/> Brasil</Button>{regions.map(region=><Button key={region} variant="ghost" className={`region-option ${value===region?'active':''}`} aria-pressed={value===region} onClick={()=>onChange(region)}><span className={`region-dot ${regionClass[region]}`}/>{region}</Button>)}</div>
}
