'use client'

const details = [
  'Currency',
  'Language',
]

export default function Page() {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-1">Preferences</h2>
      <p className="text-gray-600 mb-6">
        Change your language, currency and accessibility requirements.
      </p>

      <div className="space-y-4">
        {details.map((label) => (
          <div
            key={label}
            className="flex justify-between items-center border-b border-gray-300 pb-2"
          >
            <span className="font-medium">{label}</span>
            <button className="text-blue-600 hover:underline text-sm">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}