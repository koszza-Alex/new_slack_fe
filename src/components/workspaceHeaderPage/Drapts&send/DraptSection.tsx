import { DraptItem } from "./DraptItem";
import { Draptlist } from "./draptsdomi";


export function DraptSection() {
    return (
        <div className="px-[40px] ">
            
            <div className="mt-[12px] bg-white border border-[#e8e8e8] rounded-[8px] overflow-hidden">
                {Draptlist.map((item, idx) => (
                    <DraptItem key={idx} avatarUrl={item.avatarUrl} name={item.name} time={item.content} />
                ))}
            </div>
        </div>
    );
}