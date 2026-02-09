import InputGroup from "./InputGroup";
import ToggleSwitch from "./ToggleSwitch";

const SecuritySettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Password</h3>
            <p className="text-sm text-slate-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>

            <div className="space-y-4 max-w-lg">
                <InputGroup label="Current Password" type="password" placeholder="••••••••" />
                <InputGroup label="New Password" type="password" placeholder="••••••••" />
                <InputGroup label="Confirm New Password" type="password" placeholder="••••••••" />
            </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                </div>
                <ToggleSwitch defaultChecked={true} />
            </div>
        </div>
    </div>
);

export default SecuritySettings;