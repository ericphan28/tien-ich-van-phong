'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Only trigger if Alt is pressed and no input is focused
      if (!event.altKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'h':
          event.preventDefault();
          router.push('/');
          break;
        case 'm':
          event.preventDefault();
          router.push('/admin/modules');
          break;
        case 't':
          event.preventDefault();
          router.push('/tools/tax-calculator');
          break;
        case 'q':
          event.preventDefault();
          router.push('/tools/qr-generator-v2');
          break;
        case 'c':
          event.preventDefault();
          router.push('/tools/text-converter');
          break;
        case 'a':
          event.preventDefault();
          router.push('/tools/advanced-tool');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [router]);

  return null; // This component doesn't render anything
}
