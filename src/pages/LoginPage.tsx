import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Building2 } from "lucide-react";
import { LoginDialog } from "@/components/LoginDialog";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-fade-up text-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl mb-8 shadow-2xl">
          <Building2 className="w-20 h-20 mx-auto mb-6 text-white" />
          <h1 className="text-3xl font-bold text-white mb-2">SEDCO</h1>
          <h2 className="text-xl font-semibold text-white/90 mb-8">
            Entrepreneur Database Information System
          </h2>
          
          <Dialog>
            <DialogTrigger className="w-full inline-flex items-center justify-center rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-white/90 text-blue-700 h-14 px-8 shadow-lg hover:shadow-xl">
              Sign In
            </DialogTrigger>
            <LoginDialog />
          </Dialog>
        </div>

        <p className="text-center text-sm text-white/60">
          © {new Date().getFullYear()} Perbadanan Pembangunan Ekonomi Sabah (SEDCO).
          <br />All Rights Reserved.
        </p>
      </div>
    </div>
  );
}