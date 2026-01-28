import CreatePropertyWizard from '@/components/Shared/Vendor/CreatePropertyWizard';

export const metadata = {
  title: 'Add New Property | Nakiese Vendor',
  description: 'List your hotel or restaurant on Nakiese.',
};

export default function CreatePropertyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CreatePropertyWizard />
    </div>
  );
}

