import { defaultOffset } from 'framer-motion';
import ToggleSwitch from './ToggleSwitch'

const ToggleRow = ({ title, desc, checked }) => (
    <div className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0">
        <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
        <ToggleSwitch defaultChecked={checked} />
    </div>
);

export default ToggleRow;