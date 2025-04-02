
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, continueAsGuest, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!",
      });
      navigate("/onboarding");
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: "Email atau password tidak valid",
        variant: "destructive",
      });
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast({
        title: "Login Berhasil",
        description: "Selamat datang!",
      });
      navigate("/onboarding");
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: "Gagal login dengan Google",
        variant: "destructive",
      });
    }
  };
  
  const handleGuestLogin = () => {
    continueAsGuest();
    toast({
      title: "Masuk sebagai Tamu",
      description: "Kamu masuk sebagai pengguna tamu",
    });
    navigate("/onboarding");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-jalan-background p-6">
      <div className="max-w-md w-full space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-jalan-text">
            <TypedText 
              text="Mari kita mulai." 
              speed={50} 
              onComplete={() => setShowOptions(true)} 
            />
          </h1>
          
          {showOptions && (
            <p className="text-jalan-secondary text-lg mt-6">
              <TypedText text="Pilih cara masuk:" speed={30} delay={200} onComplete={() => setShowForm(true)} />
            </p>
          )}
        </div>
        
        {showForm && (
          <div className="space-y-4">
            {showEmailForm ? (
              <form onSubmit={handleEmailLogin} className="space-y-6 animate-text-appear opacity-0" style={{ animationDelay: "0.3s" }}>
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-transparent border-b border-jalan-secondary focus:border-jalan-accent text-jalan-text outline-none"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 bg-transparent border-b border-jalan-secondary focus:border-jalan-accent text-jalan-text outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-jalan-accent text-left"
                  >
                    {isLoading ? "> Memproses..." : "> Masuk"}
                  </button>
                </div>
                
                <div>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="w-full text-jalan-secondary text-left hover:text-jalan-text"
                  >
                    &lt; Kembali
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full text-left text-jalan-accent animate-text-appear opacity-0 hover:brightness-110 transition-all"
                  style={{ animationDelay: "0.3s" }}
                >
                  &gt; Masuk dengan Email
                </button>
                
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full text-left text-jalan-accent animate-text-appear opacity-0 hover:brightness-110 transition-all"
                  style={{ animationDelay: "0.5s" }}
                >
                  &gt; Masuk dengan Google
                </button>
                
                <button
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  className="w-full text-left text-jalan-accent animate-text-appear opacity-0 hover:brightness-110 transition-all"
                  style={{ animationDelay: "0.7s" }}
                >
                  &gt; Lanjutkan sebagai Tamu
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
