const { ChevronRight } = require("lucide-react");

const SecurityRow = ({ icon: Icon, title, description, actionLabel, onClick }) => (
    <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
        <button 
            onClick={onClick}
            className="group flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
        >
            {actionLabel}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
    </div>
);

export default SecurityRow;