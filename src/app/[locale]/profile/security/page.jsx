'use client'

export default function Page() {
    return (
        <div>
            <h2 className="text-3xl font-semibold mb-1">Security Settings</h2>
            <p className="text-gray-600 mb-6">
                Change your security settings, set up secure authentication or delete your account.
            </p>

            <div className="space-y-4">
               
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2"
                    >
                        <span className="font-medium">Change Password</span>
                        <button className="text-blue-600 hover:underline text-sm">
                            Change
                        </button>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2"
                    >
                        <span className="font-medium">Active Session</span>
                        <button className="text-blue-600 hover:underline text-sm">
                            Logout
                        </button>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2"
                    >
                        <span className="font-medium">2FA Authentication</span>
                        <button className="text-blue-600 hover:underline text-sm">
                            Off
                        </button>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2"
                    >
                        <span className="font-medium">Delete Account</span>
                        <button className="text-blue-600 hover:underline text-sm">
                            Delete
                        </button>
                    </div>
                   
              
            </div>
        </div>
    )
}