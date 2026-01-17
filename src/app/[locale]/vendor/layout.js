
export const metadata = {
  title: 'Partner Dashboard | Nakiese',
  description: 'Manage properties and bookings',
};

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      </div>
  );
}