import { MessageForm } from '@/src/components/MessageForm';
import { MessageCircle } from 'lucide-react';

export default function NGLPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="neu-card p-8 md:p-10 opacity-0 animate-scale-in">
          <div className="flex flex-col items-center mb-8">
            <div className="neu-avatar-ring mb-4">
              <div className="neu-avatar-inner flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[#3B82F6]" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-center text-[#3D4852] mb-2">
              Send me a message
            </h1>

            <p className="text-sm md:text-base text-[#6B7280] text-center max-w-xs">
              Share your thoughts, feedback, or questions anonymously
            </p>
          </div>

          <MessageForm />

          <div className="mt-8 pt-6 border-t border-[#d1d9e6]">
            <p className="text-xs text-[#A0AEC0] text-center">
              Your message is completely anonymous. I won&apos;t know who sent it.
            </p>
          </div>
        </div>

        <footer className="mt-8 text-center opacity-0 animate-fade-in-up stagger-3">
          <a
            href="https://naufalrf.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#6B7280] hover:text-[#3B82F6] transition-colors"
          >
            naufalrf.tech
          </a>
        </footer>
      </div>
    </div>
  );
}
