import { useEffect } from 'react';
import { inputSanitizer } from '@/lib/secureStorage';

interface InputSanitizerProps {
  children: React.ReactNode;
}

// Component wrapper that provides input sanitization context
export const InputSanitizer = ({ children }: InputSanitizerProps) => {
  useEffect(() => {
    // Add global event listener for form submissions to sanitize inputs
    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (!form || form.tagName !== 'FORM') return;

      // Rate limiting check for form submissions
      const formId = form.id || form.className || 'unknown-form';
      if (!inputSanitizer.rateLimiter.checkRate(`form-${formId}`, 5, 30000)) {
        event.preventDefault();
        console.warn('Form submission rate limited');
        return;
      }

      // Sanitize text inputs
      const textInputs = form.querySelectorAll('input[type="text"], textarea');
      textInputs.forEach((input) => {
        const element = input as HTMLInputElement | HTMLTextAreaElement;
        if (element.value) {
          element.value = inputSanitizer.sanitizeText(element.value);
        }
      });
    };

    document.addEventListener('submit', handleFormSubmit);
    
    return () => {
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  return <>{children}</>;
};

// Hook for manual input sanitization
export const useInputSanitizer = () => {
  return {
    sanitizeWorkoutName: inputSanitizer.sanitizeWorkoutName,
    sanitizeNotes: inputSanitizer.sanitizeNotes,
    sanitizeNumeric: inputSanitizer.sanitizeNumeric,
    checkRateLimit: inputSanitizer.rateLimiter.checkRate,
  };
};