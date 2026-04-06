import DraptSentUnit from "./DtaptSentUnit";
import { DraptSent } from "./draptsdomi";
export function DraptSentPage() {
  return(

  DraptSent.map((item,idx)=>(<DraptSentUnit key={idx} data={item}/> )

  )

)
}