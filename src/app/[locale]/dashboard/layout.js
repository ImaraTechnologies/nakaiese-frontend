import DashboardLayout from '@/components/Layout/Dashboard/DashboardLayout';

export const metadata = {
  title: 'Partner Dashboard | Nakiese',
  description: 'Manage properties and bookings',
};

export default function Layout({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}