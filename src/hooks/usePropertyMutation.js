import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyServices';
import { useRouter } from 'next/navigation';

export function usePropertyMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (newProperty) => propertyService.createProperty(newProperty),
    onSuccess: (data) => {
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      // Redirect to a success page or dashboard
      router.push(`/dashboard/properties`);
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
      // You can trigger a toast notification here
    }
  });
}