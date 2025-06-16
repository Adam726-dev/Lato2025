
import { toast } from 'sonner';

export { toast };
export const useToast = () => ({
  toast: (title: string, options?: { description?: string }) => {
    if (options?.description) {
      toast(title, { description: options.description });
    } else {
      toast(title);
    }
  }
});
