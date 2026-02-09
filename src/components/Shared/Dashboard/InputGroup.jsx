const InputGroup = ({ label, type = "text", placeholder, defaultValue }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">{label}</label>
        <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
        />
    </div>
);

export default InputGroup;